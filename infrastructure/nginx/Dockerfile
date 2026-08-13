ARG NGINX_VERSION=1.30.4

#use nginx image
FROM nginx:${NGINX_VERSION}-trixie

#nginx config into correct dir
COPY nginx.conf /etc/nginx/nginx.conf

#image expects nginx to listen on 80 and 443
EXPOSE 80
EXPOSE 443