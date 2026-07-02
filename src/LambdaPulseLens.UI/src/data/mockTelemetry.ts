import type { Trace } from "../types/telemetry";

const now = Date.now();

export const mockTraces: Trace[] = [
  //trace 1: 200 OK
  {
    id: "1001",
    userId: "1",
    timestampStart: new Date(now - 60000).toISOString(),
    durationMs: 45,

    requestMethod: "GET",
    requestPath: "/api/users/profile",
    requestProtocol: "HTTP/1.1",

    responseStatusCode: 200,
    responsePhrase: "OK",

    steps: [
      {
        middleware: "Exception",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 60000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59999).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Request Limits",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59997).toISOString(),
        durationMs: 0.1,
        logs: ["Forward protocol is https.", "Bypassing redirect."]
      },
      {
        middleware: "HSTS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Security",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Cookies",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CSRF",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Response Compression",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cache",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59994).toISOString(),
        durationMs: 1.5,
        logs: ["Cache miss"]
      },
      {
        middleware: "Static Files",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SPA Fallback",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Routing",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59991).toISOString(),
        durationMs: 1.2,
        logs: ["Matched route: GetUserProfile"]
      },
      {
        middleware: "CORS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59990).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Jwt",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59989).toISOString(),
        durationMs: 2.5,
        logs: ["Token signature validated"]
      },
      {
        middleware: "Authentication",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59986).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Authorization",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59985).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Content Negotiation",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Invoke",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 35.0,
        logs: ["Executing Controller Action"]
      },
      {
        middleware: "Termination",
        direction: null,
        event: "success",
        timestampStart: new Date(now - 59949).toISOString(),
        durationMs: 0.1,
        logs: ["Pipeline core reached"]
      },
      {
        middleware: "Invoke",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59948).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Content Negotiation",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.5,
        logs: ["Formatted to JSON"]
      },
      {
        middleware: "Authorization",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Authentication",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Jwt",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CORS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Routing",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SPA Fallback",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Static Files",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cache",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Response Compression",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 1.0,
        logs: ["Compressed via GZIP"]
      },
      {
        middleware: "CSRF",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cookies",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Security",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HSTS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1,
        logs: ["Forward protocol is https.", "Bypassing redirect."]
      },
      {
        middleware: "Connection",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Request Limits",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Exception",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59940).toISOString(),
        durationMs: 0.1
      }
    ]
  },

  //trace 2, 400 bad request (reverse proxy failure)
  {
    id: "1002",
    userId: "1",
    timestampStart: new Date(now - 45000).toISOString(),
    durationMs: 4,

    requestMethod: "GET",
    requestPath: "/assets/styles.css",
    requestProtocol: "HTTP/1.1",

    responseStatusCode: 400,
    responsePhrase: "Bad Request",

    steps: [
      {
        middleware: "Exception",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 45000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44999).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Request Limits",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "downstream",
        event: "short-circuit",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 0.1,
        logs: ["Forward protocol is https.", "Bypassing redirect."]
      },
      {
        middleware: "HTTPS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Request Limits",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Exception",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44985).toISOString(),
        durationMs: 0.1
      }
    ]
  },

  //trace 3, 410 Unauthorised
  {
    id: "1003",
    userId: "1",
    timestampStart: new Date(now - 30000).toISOString(),
    durationMs: 8,

    requestMethod: "POST",
    requestPath: "/api/admin/settings",
    requestProtocol: "HTTP/1.1",

    responseStatusCode: 401,
    responsePhrase: "Unauthorized",

    steps: [
      {
        middleware: "Exception",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 30000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Request Limits",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29999).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HSTS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Security",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cookies",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CSRF",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Response Compression",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cache",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Static Files",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29994).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SPA Fallback",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29994).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Routing",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29993).toISOString(),
        durationMs: 1.0
      },
      {
        middleware: "CORS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Jwt",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 29991).toISOString(),
        durationMs: 0.5,
        logs: ["No Bearer token found in headers."]
      },
      {
        middleware: "Authentication",
        direction: "downstream",
        event: "short-circuit",
        timestampStart: new Date(now - 29990).toISOString(),
        durationMs: 0.5,
        logs: [
          "Rejecting request: 401 Unauthorized. 401 Unauthorized. 401 Unauthorized. 401 Unauthorized. 401 Unauthorized."
        ]
      },
      {
        middleware: "Authentication",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29990).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Jwt",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29989).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CORS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29989).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Routing",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29988).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SPA Fallback",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29988).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Static Files",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cache",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Response Compression",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CSRF",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cookies",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29985).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Security",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29985).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HSTS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29984).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29984).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29983).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Request Limits",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29983).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29982).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Exception",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 29982).toISOString(),
        durationMs: 0.1
      }
    ]
  },

  //trace 4, 500 Internal Server Error
  {
    id: "1004",
    userId: "1",
    timestampStart: new Date(now - 45000).toISOString(),
    durationMs: 4,

    requestMethod: "GET",
    requestPath: "/assets/index.js",
    requestProtocol: "HTTP/1.1",

    responseStatusCode: 500,
    responsePhrase: "Internal Server Error",

    steps: [
      {
        middleware: "Exception",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 45000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44999).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Request Limits",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "downstream",
        event: "error",
        timestampStart: new Date(now - 44998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44987).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Request Limits",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44986).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Exception",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 44985).toISOString(),
        durationMs: 0.1
      }
    ]
  },

  //trace 5: 500 Internal Server Error, within termination mw
  {
    id: "1005",
    userId: "1",
    timestampStart: new Date(now - 60000).toISOString(),
    durationMs: 45,

    requestMethod: "GET",
    requestPath: "/api/users/orders",
    requestProtocol: "HTTP/1.1",

    responseStatusCode: 500,
    responsePhrase: "Internal Server Error",

    steps: [
      {
        middleware: "Exception",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 60000).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59999).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Request Limits",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59998).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59997).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HSTS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Security",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Cookies",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59996).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CSRF",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Response Compression",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59995).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cache",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59994).toISOString(),
        durationMs: 1.5,
        logs: ["Cache miss"]
      },
      {
        middleware: "Static Files",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SPA Fallback",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59992).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Routing",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59991).toISOString(),
        durationMs: 1.2,
        logs: ["Matched route: GetUserProfile"]
      },
      {
        middleware: "CORS",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59990).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Jwt",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59989).toISOString(),
        durationMs: 2.5,
        logs: ["Token signature validated"]
      },
      {
        middleware: "Authentication",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59986).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Authorization",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59985).toISOString(),
        durationMs: 0.5
      },
      {
        middleware: "Content Negotiation",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Invoke",
        direction: "downstream",
        event: "success",
        timestampStart: new Date(now - 59984).toISOString(),
        durationMs: 35.0,
        logs: ["Executing Controller Action"]
      },
      {
        middleware: "Termination",
        direction: null,
        event: "error",
        timestampStart: new Date(now - 59949).toISOString(),
        durationMs: 0.1,
        logs: ["Error in core"]
      },
      {
        middleware: "Invoke",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59948).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Content Negotiation",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.5,
        logs: ["Formatted to JSON"]
      },
      {
        middleware: "Authorization",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59947).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Authentication",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Jwt",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "CORS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59946).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Routing",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "SPA Fallback",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Static Files",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59945).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cache",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Response Compression",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59944).toISOString(),
        durationMs: 1.0,
        logs: ["Compressed via GZIP"]
      },
      {
        middleware: "CSRF",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Cookies",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Security",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59943).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HSTS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "HTTPS",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Connection",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59942).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Request Limits",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.1
      },
      {
        middleware: "Logging",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59941).toISOString(),
        durationMs: 0.2
      },
      {
        middleware: "Exception",
        direction: "upstream",
        event: "success",
        timestampStart: new Date(now - 59940).toISOString(),
        durationMs: 0.1
      }
    ]
  }
];
