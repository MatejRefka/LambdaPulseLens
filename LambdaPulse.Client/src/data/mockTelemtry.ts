import type { Trace } from "../types/telemetry";

export const mockTraces: Trace[] = [
  {
    id: 1001,
    timestampStart: new Date().toISOString(),
    durationMs: 14,
    request: {
      method: "GET",
      path: "/api/dashboard/stats",
      protocol: "HTTP/1.1",
      headers: { Accept: "application/json", "User-Agent": "LambdaPulse-UI" },
      cookies: { session_id: "xyz_123" }
    },
    response: {
      statusCode: 200,
      responsePhrase: "OK",
      headers: { "Content-Type": "application/json", "X-Powered-By": "LambdaPulse" },
      cookies: { session_id: "xyz_123" },
      body: JSON.stringify({ activeUsers: 42, cpuUsage: "12%" }, null, 2)
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-18T20:52:13.001Z",
        durationMs: 0.1,
        tags: ["system"]
      },
      {
        order: 2,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-18T20:52:13.002Z",
        durationMs: 1.2,
        tags: ["routing"]
      },
      {
        order: 3,
        middleware: "AuthMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-18T20:52:13.004Z",
        durationMs: 4.5,
        notes: "Token Validated",
        tags: ["security"]
      },
      {
        order: 4,
        middleware: "EndpointMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-18T20:52:13.009Z",
        durationMs: 7.0,
        notes: "Executing Handler",
        tags: ["execution"]
      },
      {
        order: 5,
        middleware: "EndpointMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-18T20:52:13.016Z",
        durationMs: 0.2,
        tags: ["execution"]
      },
      {
        order: 6,
        middleware: "AuthMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-18T20:52:13.017Z",
        durationMs: 0.1,
        tags: ["security"]
      },
      {
        order: 7,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-18T20:52:13.018Z",
        durationMs: 0.1,
        tags: ["routing"]
      },
      {
        order: 8,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-18T20:52:13.019Z",
        durationMs: 0.8,
        tags: ["system"]
      }
    ]
  },
  {
    id: 1002,
    timestampStart: new Date(Date.now() - 5000).toISOString(),
    durationMs: 3,
    request: {
      method: "POST",
      path: "/api/admin/config",
      protocol: "HTTP/1.1",
      headers: { "Content-Type": "application/json" },
      cookies: {},
      body: JSON.stringify({ newSetting: "enable_god_mode" })
    },
    response: {
      statusCode: 401,
      responsePhrase: "Unauthorized",
      headers: { "Content-Type": "text/plain" },
      cookies: { session_id: "xyz_123" },
      body: "Unauthorized: Missing Session"
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-18T20:52:08.001Z",
        durationMs: 0.1,
        tags: ["system"]
      },
      {
        order: 2,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-18T20:52:08.002Z",
        durationMs: 1.0,
        tags: ["routing"]
      },
      {
        order: 3,
        middleware: "AuthMiddleware",
        phase: "ShortCircuit",
        timestampStart: "2026-02-18T20:52:08.004Z",
        durationMs: 1.5,
        notes: "Missing Session Cookie - Aborting",
        tags: ["security", "error"]
      },
      {
        order: 4,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-18T20:52:08.006Z",
        durationMs: 0.1,
        tags: ["routing"]
      },
      {
        order: 5,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-18T20:52:08.007Z",
        durationMs: 0.3,
        tags: ["system"]
      }
    ]
  },
  {
    id: 1003,
    timestampStart: new Date(Date.now() - 15000).toISOString(), // 15 seconds ago
    durationMs: 45,
    request: {
      method: "GET",
      path: "/api/users/999",
      protocol: "HTTP/1.1",
      headers: { Accept: "application/json", Authorization: "Bearer token..." },
      cookies: {}
    },
    response: {
      statusCode: 500,
      responsePhrase: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
      cookies: { session_id: "xyz_123" },
      body: JSON.stringify({ error: "NullReferenceException" })
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-21T16:30:00.001Z",
        durationMs: 0.1,
        tags: ["system"]
      },
      {
        order: 2,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-21T16:30:00.002Z",
        durationMs: 0.8,
        tags: ["routing"]
      },
      {
        order: 3,
        middleware: "AuthMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-21T16:30:00.003Z",
        durationMs: 2.1,
        notes: "Bearer token valid",
        tags: ["security"]
      },
      {
        order: 4,
        middleware: "EndpointMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-21T16:30:00.006Z",
        durationMs: 38.0,
        notes: "Executing GetUser",
        tags: ["execution"]
      },
      {
        order: 5,
        middleware: "EndpointMiddleware",
        phase: "Exception",
        timestampStart: "2026-02-21T16:30:00.044Z",
        durationMs: 0.5,
        notes: "Unhandled NullReferenceException in DB call",
        tags: ["execution", "error"]
      },
      {
        order: 6,
        middleware: "AuthMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-21T16:30:00.045Z",
        durationMs: 0.1,
        tags: ["security"]
      },
      {
        order: 7,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-21T16:30:00.045Z",
        durationMs: 0.1,
        tags: ["routing"]
      },
      {
        order: 8,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-21T16:30:00.046Z",
        durationMs: 3.3,
        notes: "Caught exception, formatting 500 JSON response",
        tags: ["system", "error"]
      }
    ]
  },
  {
    id: 1004,
    timestampStart: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    durationMs: 2,
    request: {
      method: "GET",
      path: "/assets/styles/main.css",
      protocol: "HTTP/1.1",
      headers: { Accept: "text/css" },
      cookies: {}
    },
    response: {
      statusCode: 200,
      responsePhrase: "OK",
      headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=31536000" },
      cookies: { session_id: "xyz_123" }
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: "2026-02-21T16:29:45.001Z",
        durationMs: 0.1,
        tags: ["system"]
      },
      {
        order: 2,
        middleware: "StaticFilesMiddleware",
        phase: "ShortCircuit",
        timestampStart: "2026-02-21T16:29:45.002Z",
        durationMs: 1.8,
        notes: "File found, writing directly to response stream",
        tags: ["io", "static"]
      },
      {
        order: 3,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: "2026-02-21T16:29:45.004Z",
        durationMs: 0.1,
        tags: ["system"]
      }
    ]
  }
];
