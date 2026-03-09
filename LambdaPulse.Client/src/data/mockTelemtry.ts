import type { Trace } from "../types/telemetry";
const now = Date.now();

export const mockTraces: Trace[] = [
  {
    id: 1001,
    timestampStart: new Date(now - 60000).toISOString(),
    durationMs: 45,
    request: {
      method: "GET",
      path: "/api/users/profile",
      protocol: "HTTP/1.1",
      headers: { Accept: "application/json", Authorization: "Bearer eyJhb..." },
      cookies: {}
    },
    response: {
      statusCode: 200,
      responsePhrase: "OK",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 42, role: "Admin" }),
      cookies: { session_id: "xyz_123" }
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 60000).toISOString(),
        durationMs: 0.1
      },
      {
        order: 2,
        middleware: "LoggingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59999).toISOString(),
        durationMs: 0.5
      },
      {
        order: 3,
        middleware: "RequestLimitsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 4,
        middleware: "ConnectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 5,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "HstsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 7,
        middleware: "SecurityMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.2
      },
      {
        order: 8,
        middleware: "CookieMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 9,
        middleware: "CsrfMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 10,
        middleware: "ResponseCompressionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 11,
        middleware: "CachingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59994).toISOString(),
        durationMs: 1.5,
        notes: "Cache miss"
      },
      {
        order: 12,
        middleware: "StaticFilesMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        order: 13,
        middleware: "StaticPagesMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        order: 14,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59991).toISOString(),
        durationMs: 1.2,
        notes: "Matched route: GetUserProfile"
      },
      {
        order: 15,
        middleware: "CorsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59990).toISOString(),
        durationMs: 0.2
      },
      {
        order: 16,
        middleware: "JwtMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59989).toISOString(),
        durationMs: 2.5,
        notes: "Token signature validated"
      },
      {
        order: 17,
        middleware: "AuthenticationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59986).toISOString(),
        durationMs: 0.5
      },
      {
        order: 18,
        middleware: "AuthorizationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59985).toISOString(),
        durationMs: 0.5
      },
      {
        order: 19,
        middleware: "ContentNegotiationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 0.2
      },
      {
        order: 20,
        middleware: "InvokeMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 35.0,
        notes: "Executing Controller Action"
      },
      {
        order: 21,
        middleware: "TerminationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 59949).toISOString(),
        durationMs: 0.1,
        notes: "Pipeline core reached"
      },
      {
        order: 22,
        middleware: "TerminationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59948).toISOString(),
        durationMs: 0.1
      },
      {
        order: 23,
        middleware: "InvokeMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59948).toISOString(),
        durationMs: 0.1
      },
      {
        order: 24,
        middleware: "ContentNegotiationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.5,
        notes: "Formatted to JSON"
      },
      {
        order: 25,
        middleware: "ResponseCompressionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 1.0,
        notes: "Compressed via GZIP"
      },
      {
        order: 26,
        middleware: "LoggingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.2
      },
      {
        order: 27,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  {
    id: 1002,
    timestampStart: new Date(now - 45000).toISOString(),
    durationMs: 4,
    request: {
      method: "GET",
      path: "/assets/styles.css",
      protocol: "HTTP/1.1",
      headers: { Accept: "text/css" },
      cookies: {}
    },
    response: {
      statusCode: 200,
      responsePhrase: "OK",
      headers: { "Content-Type": "text/css" },
      cookies: { session_id: "xyz_123" }
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 45000).toISOString(),
        durationMs: 0.1
      },
      {
        order: 2,
        middleware: "LoggingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44999).toISOString(),
        durationMs: 0.2
      },
      {
        order: 3,
        middleware: "CachingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.5
      },
      {
        order: 4,
        middleware: "StaticFilesMiddleware",
        phase: "ShortCircuit",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 2.5,
        notes: "File found. Writing directly to stream."
      },
      {
        order: 5,
        middleware: "CachingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44994).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "LoggingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44994).toISOString(),
        durationMs: 0.1
      },
      {
        order: 7,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44993).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  {
    id: 1003,
    timestampStart: new Date(now - 30000).toISOString(),
    durationMs: 8,
    request: {
      method: "POST",
      path: "/api/admin/settings",
      protocol: "HTTP/1.1",
      headers: { "Content-Type": "application/json" },
      cookies: {},
      body: '{"theme":"dark"}'
    },
    response: {
      statusCode: 401,
      responsePhrase: "Unauthorized",
      headers: {},
      cookies: { session_id: "xyz_123" },
      body: "Missing Authentication Token"
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 30000).toISOString(),
        durationMs: 0.1
      },
      {
        order: 2,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 1.0
      },
      {
        order: 3,
        middleware: "JwtMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.5,
        notes: "No Bearer token found in headers."
      },
      {
        order: 4,
        middleware: "AuthenticationMiddleware",
        phase: "ShortCircuit",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.5,
        notes: "Rejecting request: 401 Unauthorized."
      },
      {
        order: 5,
        middleware: "JwtMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 7,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  {
    id: 1004,
    timestampStart: new Date(now - 15000).toISOString(),
    durationMs: 65,
    request: {
      method: "PUT",
      path: "/api/orders/99",
      protocol: "HTTP/1.1",
      headers: { "Content-Type": "application/json" },
      cookies: {}
    },
    response: {
      statusCode: 500,
      responsePhrase: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
      cookies: { session_id: "xyz_123" },
      body: '{"error": "Database connection timeout"}'
    },
    pipeline: [
      {
        order: 1,
        middleware: "ExceptionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 15000).toISOString(),
        durationMs: 0.1
      },
      {
        order: 2,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14999).toISOString(),
        durationMs: 1.5
      },
      {
        order: 3,
        middleware: "InvokeMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14997).toISOString(),
        durationMs: 50.0
      },
      {
        order: 4,
        middleware: "InvokeMiddleware",
        phase: "Exception",
        timestampStart: new Date(now - 14947).toISOString(),
        durationMs: 2.0,
        notes: "SqlException: Timeout expired."
      },
      {
        order: 5,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14945).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14944).toISOString(),
        durationMs: 5.0,
        notes: "Caught SqlException. Modifying response to 500."
      }
    ]
  }
];
