import type { Trace } from "../types/telemetry";
const now = Date.now();

export const mockTraces: Trace[] = [
  //trace 1: 200 OK
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
        middleware: "ExceptionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 60000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59999).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HttpsRedirectionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HstsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SecurityMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "CookieMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CsrfMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ResponseCompressionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CachingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59994).toISOString(),
        durationMs: 1.5,
        notes: "Cache miss"
      },
      {
        middleware: "StaticFilesMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticPagesMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RoutingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59991).toISOString(),
        durationMs: 1.2,
        notes: "Matched route: GetUserProfile"
      },
      {
        middleware: "CorsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59990).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "JwtMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59989).toISOString(),
        durationMs: 2.5,
        notes: "Token signature validated"
      },
      {
        middleware: "AuthenticationMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59986).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "AuthorizationMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59985).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "ContentNegotiationMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "InvokeMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 35.0,
        notes: "Executing Controller Action"
      },
      {
        middleware: "TerminationMiddleware",
        event: "success",
        timestampStart: new Date(now - 59949).toISOString(),
        durationMs: 0.1,
        notes: "Pipeline core reached"
      },
      {
        middleware: "InvokeMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59948).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ContentNegotiationMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.5,
        notes: "Formatted to JSON"
      },
      {
        middleware: "AuthorizationMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "AuthenticationMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "JwtMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CorsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RoutingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticPagesMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticFilesMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CachingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ResponseCompressionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 1.0,
        notes: "Compressed via GZIP"
      },
      {
        middleware: "CsrfMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CookieMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SecurityMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HstsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HttpsRedirectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "ExceptionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59940).toISOString(),
        durationMs: 0.1
      }
    ]
  },

  //trace 2, 400 bad request (reverse proxy failure)
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
      statusCode: 400,
      responsePhrase: "Bad Request",
      headers: { "Content-Type": "text/css" },
      cookies: { session_id: "xyz_123" }
    },
    pipeline: [
      {
        middleware: "ExceptionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 45000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44999).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HttpsRedirectionMiddleware",
        direction: "downstream",
        event: "short-circuit",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HttpsRedirectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ExceptionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44985).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  //trace 3, 410 Unauthorised
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
        middleware: "ExceptionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 30000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HttpsRedirectionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HstsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SecurityMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CookieMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CsrfMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ResponseCompressionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CachingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticFilesMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29994).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticPagesMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29994).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RoutingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29993).toISOString(),
        durationMs: 1.0
      },
      {
        middleware: "CorsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "JwtMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29991).toISOString(),
        durationMs: 0.5,
        notes: "No Bearer token found in headers."
      },
      {
        middleware: "AuthenticationMiddleware",
        direction: "downstream",
        event: "short-circuit",
        timestampStart: new Date(now - 29990).toISOString(),
        durationMs: 0.5,
        notes: "Rejecting request: 401 Unauthorized."
      },
      {
        middleware: "AuthenticationMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29990).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "JwtMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29989).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CorsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29989).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RoutingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29988).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticPagesMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29988).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "StaticFilesMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CachingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ResponseCompressionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CsrfMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CookieMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29985).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SecurityMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29985).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HstsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29984).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HttpsRedirectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29984).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29983).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29983).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29982).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ExceptionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29982).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  //trace 4, 500 Internal Server Error
  {
    id: 1004,
    timestampStart: new Date(now - 45000).toISOString(),
    durationMs: 4,
    request: {
      method: "GET",
      path: "/assets/index.js",
      protocol: "HTTP/1.1",
      headers: { Accept: "text/css" },
      cookies: {}
    },
    response: {
      statusCode: 500,
      responsePhrase: "Internal Server Error",
      headers: { "Content-Type": "text/css" },
      cookies: { session_id: "xyz_123" }
    },
    pipeline: [
      {
        middleware: "ExceptionMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 45000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44999).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "downstream",
        event: "error",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ConnectionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "RequestLimitsMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "LoggingMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "ExceptionMiddleware",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44985).toISOString(),
        durationMs: 0.1
      }
    ]
  }
];
