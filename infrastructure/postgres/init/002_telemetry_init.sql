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
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pre_session_id UUID NULL,
    anonymous_session_id UUID NULL,
    associated_user_id BIGINT NULL,
    user_id BIGINT NULL,
    timestamp_start TIMESTAMPTZ NOT NULL,
    duration_ms REAL NOT NULL,
    req_method VARCHAR(10) NULL,
    req_path TEXT NULL,
    req_protocol VARCHAR(20) NULL,
    res_status_code INTEGER NOT NULL,
    res_phrase TEXT NOT NULL,

    CONSTRAINT fk_telemetry_traces_associated_user FOREIGN KEY (associated_user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_telemetry_traces_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS ix_traces_associated_user_time
ON telemetry.traces (associated_user_id, id DESC);

CREATE INDEX IF NOT EXISTS ix_traces_anon_session_time
ON telemetry.traces (anonymous_session_id, id DESC);

CREATE INDEX IF NOT EXISTS ix_traces_pre_session
ON telemetry.traces (pre_session_id);

CREATE TABLE IF NOT EXISTS telemetry.steps (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trace_id BIGINT NOT NULL,
    middleware VARCHAR(100) NOT NULL,
    direction telemetry.flow_direction,
    event telemetry.execution_event NOT NULL,
    timestamp_start TIMESTAMPTZ NOT NULL,
    duration_ms REAL NOT NULL,
    logs JSONB,

    CONSTRAINT fk_telemetry_steps_trace FOREIGN KEY(trace_id) REFERENCES telemetry.traces(id)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_steps_trace_id ON telemetry.steps(trace_id);
