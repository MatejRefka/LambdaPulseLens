export const STATIC_PIPELINE = [
  //col 1
  "Exception",
  "Request Limits",
  "Connection",
  "HTTPS",
  "HSTS",
  "Security",
  "CORS",
  "Session",
  "Routing",
  //col 2
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

export const MIDDLEWARE_1_9 = STATIC_PIPELINE.slice(0, 9);
export const MIDDLEWARE_10_18 = STATIC_PIPELINE.slice(9, 18);
export const MIDDLEWARE_TERMINATION = STATIC_PIPELINE[18];
