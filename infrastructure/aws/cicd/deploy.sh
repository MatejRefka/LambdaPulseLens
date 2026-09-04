#!/usr/bin/env bash

set -Eeuo pipefail

version="${1:-}"
app_directory="${LAMBDA_PULSE_LENS_DIRECTORY:-/opt/lambda-pulse-lens}"
env_file="$app_directory/.env.ec2"
compose_file="$app_directory/compose.ec2.yaml"
health_url="https://lambdapulse.app/api/health"

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z]+([.-][0-9A-Za-z]+)*)?$ ]]; then
  echo "Invalid release version: '$version'" >&2
  exit 1
fi

for command_name in aws curl docker grep mktemp sed; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Required command is unavailable: $command_name" >&2
    exit 1
  fi
done

if [[ ! -f "$env_file" || ! -f "$compose_file" ]]; then
  echo "Production Compose files are missing from $app_directory." >&2
  exit 1
fi

read_env_value() {
  local key="$1"
  sed -n "s/^${key}=//p" "$env_file" | head -n 1
}

replace_env_value() {
  local key="$1"
  local value="$2"

  if ! grep -q "^${key}=" "$env_file"; then
    echo "Required setting is missing from .env.ec2: $key" >&2
    return 1
  fi

  sed -i "s|^${key}=.*|${key}=${value}|" "$env_file"
}

wait_for_health() {
  local check_name="$1"
  shift

  for attempt in $(seq 1 18); do
    if response=$(curl --fail --silent --show-error --max-time 10 "$@" "$health_url" 2>/dev/null) &&
      [[ "$response" == *'"health":"Healthy"'* ]]; then
      echo "$check_name health check passed on attempt $attempt."
      return 0
    fi

    sleep 5
  done

  echo "$check_name health check failed after 90 seconds." >&2
  return 1
}

ecr_registry=$(read_env_value ECR_REGISTRY)
current_lens_tag=$(read_env_value LENS_IMAGE_TAG)
current_proxy_tag=$(read_env_value PROXY_IMAGE_TAG)

if [[ -z "$ecr_registry" || -z "$current_lens_tag" || -z "$current_proxy_tag" ]]; then
  echo "ECR registry or current image tags are missing from .env.ec2." >&2
  exit 1
fi

if [[ "$current_lens_tag" == "$version" && "$current_proxy_tag" == "$version" ]]; then
  echo "Version $version is already configured. Verifying health only."
  wait_for_health "Local" --resolve lambdapulse.app:443:127.0.0.1
  wait_for_health "Public"
  exit 0
fi

echo "Deploying Lens $current_lens_tag -> $version"
echo "Deploying proxy $current_proxy_tag -> $version"

aws ecr get-login-password --region eu-west-2 |
  docker login --username AWS --password-stdin "$ecr_registry"

# Pull both images before changing the running deployment.
docker pull "$ecr_registry/lambda-pulse-lens:$version"
docker pull "$ecr_registry/lambda-pulse-lens-proxy:$version"

backup_file=$(mktemp "$app_directory/.env.ec2.rollback.XXXXXX")
cp --preserve=mode,ownership,timestamps "$env_file" "$backup_file"
deployment_started=0

rollback() {
  local exit_code="$1"
  trap - ERR INT TERM
  set +e

  if (( deployment_started > 0 )); then
    echo "Deployment failed. Restoring Lens $current_lens_tag and proxy $current_proxy_tag." >&2
    cp --preserve=mode,ownership,timestamps "$backup_file" "$env_file"
    docker compose --env-file "$env_file" --file "$compose_file" \
      up --detach --no-deps lens proxy

    if wait_for_health "Rollback" --resolve lambdapulse.app:443:127.0.0.1; then
      echo "Rollback completed successfully." >&2
    else
      echo "Rollback completed, but the restored deployment is unhealthy." >&2
    fi
  fi

  rm -f "$backup_file"
  exit "$exit_code"
}

trap 'rollback $?' ERR
trap 'rollback 130' INT TERM

deployment_started=1
replace_env_value LENS_IMAGE_TAG "$version"
replace_env_value PROXY_IMAGE_TAG "$version"

docker compose --env-file "$env_file" --file "$compose_file" \
  up --detach --no-deps lens proxy

wait_for_health "Local" --resolve lambdapulse.app:443:127.0.0.1
wait_for_health "Public"

deployment_started=0
rm -f "$backup_file"
trap - ERR INT TERM

echo "Deployment of Lambda Pulse Lens $version completed successfully."
