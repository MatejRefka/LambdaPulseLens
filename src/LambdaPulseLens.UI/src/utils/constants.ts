export const STATIC_PIPELINE = [
  //col 1
  "Exception",
  "Logging",
  "Request Limits",
  "Connection",
  "Https Redirection",
  "Hsts",
  "Security",
  "Cookie",
  "Csrf",
  "Response Compression",
  //col 2
  "Caching",
  "Static Files",
  "Static Pages",
  "Routing",
  "Cors",
  "Jwt",
  "Authentication",
  "Authorization",
  "Content Negotiation",
  "Invoke",
  //col 3
  "Termination"
];

export const MIDDLEWARE_1_10 = STATIC_PIPELINE.slice(0, 10);
export const MIDDLEWARE_11_20 = STATIC_PIPELINE.slice(10, 20);
export const MIDDLEWARE_TERMINATION = STATIC_PIPELINE[20];
