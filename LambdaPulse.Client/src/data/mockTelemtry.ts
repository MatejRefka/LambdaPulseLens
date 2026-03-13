import type { Trace } from "../types/telemetry";
const now = Date.now();

export const mockTraces: Trace[] = [
  //TRACE 1
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
        timestampStart: new Date(now - 59996).toISOString(),
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
        middleware: "AuthorizationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.1
      },
      {
        order: 26,
        middleware: "AuthenticationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        order: 27,
        middleware: "JwtMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        order: 28,
        middleware: "CorsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        order: 29,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        order: 30,
        middleware: "StaticPagesMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        order: 31,
        middleware: "StaticFilesMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        order: 32,
        middleware: "CachingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 0.1
      },
      {
        order: 33,
        middleware: "ResponseCompressionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 1.0,
        notes: "Compressed via GZIP"
      },
      {
        order: 34,
        middleware: "CsrfMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        order: 35,
        middleware: "CookieMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        order: 36,
        middleware: "SecurityMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        order: 37,
        middleware: "HstsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        order: 38,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        order: 39,
        middleware: "ConnectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        order: 40,
        middleware: "RequestLimitsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.1
      },
      {
        order: 41,
        middleware: "LoggingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.2
      },
      {
        order: 42,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 59940).toISOString(),
        durationMs: 0.1
      }
    ]
  },

  //TRACE 2
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
        middleware: "RequestLimitsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 4,
        middleware: "ConnectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 5,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "HstsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 7,
        middleware: "SecurityMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 8,
        middleware: "CookieMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 9,
        middleware: "CsrfMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 10,
        middleware: "ResponseCompressionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 11,
        middleware: "CachingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 44994).toISOString(),
        durationMs: 0.5
      },
      {
        order: 12,
        middleware: "StaticFilesMiddleware",
        phase: "ShortCircuit",
        timestampStart: new Date(now - 44993).toISOString(),
        durationMs: 2.5,
        notes: "File found. Writing directly to stream."
      },

      // Outbound (Bubbling back up from 12)
      {
        order: 13,
        middleware: "CachingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44990).toISOString(),
        durationMs: 0.1
      },
      {
        order: 14,
        middleware: "ResponseCompressionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44990).toISOString(),
        durationMs: 0.1
      },
      {
        order: 15,
        middleware: "CsrfMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44989).toISOString(),
        durationMs: 0.1
      },
      {
        order: 16,
        middleware: "CookieMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44989).toISOString(),
        durationMs: 0.1
      },
      {
        order: 17,
        middleware: "SecurityMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44988).toISOString(),
        durationMs: 0.1
      },
      {
        order: 18,
        middleware: "HstsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44988).toISOString(),
        durationMs: 0.1
      },
      {
        order: 19,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44987).toISOString(),
        durationMs: 0.1
      },
      {
        order: 20,
        middleware: "ConnectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44987).toISOString(),
        durationMs: 0.1
      },
      {
        order: 21,
        middleware: "RequestLimitsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        order: 22,
        middleware: "LoggingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        order: 23,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 44985).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  //TRACE 3
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
        middleware: "LoggingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 0.1
      },
      {
        order: 3,
        middleware: "RequestLimitsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 0.1
      },
      {
        order: 4,
        middleware: "ConnectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 5,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "HstsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 7,
        middleware: "SecurityMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 8,
        middleware: "CookieMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 9,
        middleware: "CsrfMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 10,
        middleware: "ResponseCompressionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 11,
        middleware: "CachingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 12,
        middleware: "StaticFilesMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29994).toISOString(),
        durationMs: 0.1
      },
      {
        order: 13,
        middleware: "StaticPagesMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29994).toISOString(),
        durationMs: 0.1
      },
      {
        order: 14,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29993).toISOString(),
        durationMs: 1.0
      },
      {
        order: 15,
        middleware: "CorsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29992).toISOString(),
        durationMs: 0.1
      },
      {
        order: 16,
        middleware: "JwtMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 29991).toISOString(),
        durationMs: 0.5,
        notes: "No Bearer token found in headers."
      },
      {
        order: 17,
        middleware: "AuthenticationMiddleware",
        phase: "ShortCircuit",
        timestampStart: new Date(now - 29990).toISOString(),
        durationMs: 0.5,
        notes: "Rejecting request: 401 Unauthorized."
      },

      // Outbound
      {
        order: 18,
        middleware: "JwtMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29989).toISOString(),
        durationMs: 0.1
      },
      {
        order: 19,
        middleware: "CorsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29989).toISOString(),
        durationMs: 0.1
      },
      {
        order: 20,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29988).toISOString(),
        durationMs: 0.1
      },
      {
        order: 21,
        middleware: "StaticPagesMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29988).toISOString(),
        durationMs: 0.1
      },
      {
        order: 22,
        middleware: "StaticFilesMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29987).toISOString(),
        durationMs: 0.1
      },
      {
        order: 23,
        middleware: "CachingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29987).toISOString(),
        durationMs: 0.1
      },
      {
        order: 24,
        middleware: "ResponseCompressionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29986).toISOString(),
        durationMs: 0.1
      },
      {
        order: 25,
        middleware: "CsrfMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29986).toISOString(),
        durationMs: 0.1
      },
      {
        order: 26,
        middleware: "CookieMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29985).toISOString(),
        durationMs: 0.1
      },
      {
        order: 27,
        middleware: "SecurityMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29985).toISOString(),
        durationMs: 0.1
      },
      {
        order: 28,
        middleware: "HstsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29984).toISOString(),
        durationMs: 0.1
      },
      {
        order: 29,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29984).toISOString(),
        durationMs: 0.1
      },
      {
        order: 30,
        middleware: "ConnectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29983).toISOString(),
        durationMs: 0.1
      },
      {
        order: 31,
        middleware: "RequestLimitsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29983).toISOString(),
        durationMs: 0.1
      },
      {
        order: 32,
        middleware: "LoggingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29982).toISOString(),
        durationMs: 0.1
      },
      {
        order: 33,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 29982).toISOString(),
        durationMs: 0.1
      }
    ]
  },
  //TRACE 4
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
        middleware: "LoggingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14999).toISOString(),
        durationMs: 0.1
      },
      {
        order: 3,
        middleware: "RequestLimitsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14999).toISOString(),
        durationMs: 0.1
      },
      {
        order: 4,
        middleware: "ConnectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 5,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14998).toISOString(),
        durationMs: 0.1
      },
      {
        order: 6,
        middleware: "HstsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 7,
        middleware: "SecurityMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14997).toISOString(),
        durationMs: 0.1
      },
      {
        order: 8,
        middleware: "CookieMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 9,
        middleware: "CsrfMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14996).toISOString(),
        durationMs: 0.1
      },
      {
        order: 10,
        middleware: "ResponseCompressionMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 11,
        middleware: "CachingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14995).toISOString(),
        durationMs: 0.1
      },
      {
        order: 12,
        middleware: "StaticFilesMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14994).toISOString(),
        durationMs: 0.1
      },
      {
        order: 13,
        middleware: "StaticPagesMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14994).toISOString(),
        durationMs: 0.1
      },
      {
        order: 14,
        middleware: "RoutingMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14993).toISOString(),
        durationMs: 1.5
      },
      {
        order: 15,
        middleware: "CorsMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14992).toISOString(),
        durationMs: 0.1
      },
      {
        order: 16,
        middleware: "JwtMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14991).toISOString(),
        durationMs: 0.5
      },
      {
        order: 17,
        middleware: "AuthenticationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14990).toISOString(),
        durationMs: 0.5
      },
      {
        order: 18,
        middleware: "AuthorizationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14989).toISOString(),
        durationMs: 0.5
      },
      {
        order: 19,
        middleware: "ContentNegotiationMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14988).toISOString(),
        durationMs: 0.1
      },
      {
        order: 20,
        middleware: "InvokeMiddleware",
        phase: "Enter",
        timestampStart: new Date(now - 14987).toISOString(),
        durationMs: 50.0
      },
      {
        order: 21,
        middleware: "InvokeMiddleware",
        phase: "Exception",
        timestampStart: new Date(now - 14937).toISOString(),
        durationMs: 2.0,
        notes: "SqlException: Timeout expired."
      },
      {
        order: 22,
        middleware: "ContentNegotiationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14935).toISOString(),
        durationMs: 0.1
      },
      {
        order: 23,
        middleware: "AuthorizationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14935).toISOString(),
        durationMs: 0.1
      },
      {
        order: 24,
        middleware: "AuthenticationMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14934).toISOString(),
        durationMs: 0.1
      },
      {
        order: 25,
        middleware: "JwtMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14934).toISOString(),
        durationMs: 0.1
      },
      {
        order: 26,
        middleware: "CorsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14933).toISOString(),
        durationMs: 0.1
      },
      {
        order: 27,
        middleware: "RoutingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14933).toISOString(),
        durationMs: 0.1
      },
      {
        order: 28,
        middleware: "StaticPagesMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14932).toISOString(),
        durationMs: 0.1
      },
      {
        order: 29,
        middleware: "StaticFilesMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14932).toISOString(),
        durationMs: 0.1
      },
      {
        order: 30,
        middleware: "CachingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14931).toISOString(),
        durationMs: 0.1
      },
      {
        order: 31,
        middleware: "ResponseCompressionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14931).toISOString(),
        durationMs: 0.1
      },
      {
        order: 32,
        middleware: "CsrfMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14930).toISOString(),
        durationMs: 0.1
      },
      {
        order: 33,
        middleware: "CookieMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14930).toISOString(),
        durationMs: 0.1
      },
      {
        order: 34,
        middleware: "SecurityMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14929).toISOString(),
        durationMs: 0.1
      },
      {
        order: 35,
        middleware: "HstsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14929).toISOString(),
        durationMs: 0.1
      },
      {
        order: 36,
        middleware: "HttpsRedirectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14928).toISOString(),
        durationMs: 0.1
      },
      {
        order: 37,
        middleware: "ConnectionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14928).toISOString(),
        durationMs: 0.1
      },
      {
        order: 38,
        middleware: "RequestLimitsMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14927).toISOString(),
        durationMs: 0.1
      },
      {
        order: 39,
        middleware: "LoggingMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14927).toISOString(),
        durationMs: 0.1
      },
      {
        order: 40,
        middleware: "ExceptionMiddleware",
        phase: "Exit",
        timestampStart: new Date(now - 14926).toISOString(),
        durationMs: 5.0,
        notes: "Caught SqlException. Modifying response to 500."
      }
    ]
  }
];
