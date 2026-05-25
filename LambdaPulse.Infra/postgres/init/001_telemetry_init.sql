CREATE SCHEMA IF NOT EXISTS telemetry;

DO $$ BEGIN
    CREATE TYPE telemetry.flow_direction AS ENUM ('downstream', 'upstream');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE telemetry.execution_event AS ENUM ('success', 'short-circuit', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS telemetry.traces (
    id BIGSERIAL PRIMARY KEY,
    timestamp_start TIMESTAMPTZ NOT NULL,
    duration_ms BIGINT NOT NULL,

    req_method VARCHAR(10) NOT NULL,
    req_path TEXT NOT NULL,
    req_protocol VARCHAR(20) NOT NULL,
    req_headers JSONB NOT NULL,
    req_cookies JSONB,
    req_body TEXT,

    res_status_code INTEGER NOT NULL,
    res_phrase TEXT NOT NULL,
    res_headers JSONB NOT NULL,
    res_cookies JSONB,
    res_body TEXT
);

CREATE TABLE IF NOT EXISTS telemetry.steps (
    id BIGSERIAL PRIMARY KEY,
    trace_id BIGINT NOT NULL,
    middleware VARCHAR(100) NOT NULL,
    direction telemetry.flow_direction,
    event telemetry.execution_event NOT NULL,
    timestamp_start TIMESTAMPTZ NOT NULL,
    duration_ms BIGINT NOT NULL,
    logs JSONB,

    CONSTRAINT fk_trace
        FOREIGN KEY(trace_id)
        REFERENCES telemetry.traces(id)
);

CREATE INDEX IF NOT EXISTS idx_steps_trace_id ON telemetry.steps(trace_id);