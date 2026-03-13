export const STATIC_PIPELINE = [
  //col 1
  "ExceptionMiddleware",
  "LoggingMiddleware",
  "RequestLimitsMiddleware",
  "ConnectionMiddleware",
  "HttpsRedirectionMiddleware",
  "HstsMiddleware",
  "SecurityMiddleware",
  "CookieMiddleware",
  "CsrfMiddleware",
  "ResponseCompressionMiddleware",
  //col 2
  "CachingMiddleware",
  "StaticFilesMiddleware",
  "StaticPagesMiddleware",
  "RoutingMiddleware",
  "CorsMiddleware",
  "JwtMiddleware",
  "AuthenticationMiddleware",
  "AuthorizationMiddleware",
  "ContentNegotiationMiddleware",
  "InvokeMiddleware",
  //col 3
  "TerminationMiddleware"
];

export const MIDDLEWARE_1_10 = STATIC_PIPELINE.slice(0, 10);
export const MIDDLEWARE_11_20 = STATIC_PIPELINE.slice(10, 20);
export const MIDDLEWARE_TERMINATION = STATIC_PIPELINE[20];
