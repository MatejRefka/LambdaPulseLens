export const STATIC_PIPELINE = [
  //col 1
  "Exception",
  "Request Limits",
  "IP Blocklist",
  "Connection",
  "HTTPS",
  "HSTS",
  "Security",
  "CORS",
  "Cookies",
  "Session",
  //col 2
  "Routing",
  "CSRF",
  "Response Compression",
  "Static Files",
  "SPA Fallback",
  "Authentication",
  "Authorization",
  "Content Negotiation",
  "Cache",
  "Invoke",
  //col 3
  "Termination"
];

export const MIDDLEWARE_1_10 = STATIC_PIPELINE.slice(0, 10);
export const MIDDLEWARE_11_20 = STATIC_PIPELINE.slice(10, 20);
export const MIDDLEWARE_TERMINATION = STATIC_PIPELINE[20];
