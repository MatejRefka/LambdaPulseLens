export interface Trace {
  id: number;
  timestampStart: string;
  durationMs: number;

  request: WebRequest;
  response: WebResponse;

  pipeline: Step[];
}

export interface Step {
  order: number;
  middleware: string;
  phase: MiddlewarePhase;
  timestampStart: string;
  durationMs: number;
  notes?: string;
}

export interface WebRequest {
  method: string;
  path: string;
  protocol: string;
  headers: Headers;
  cookies: Cookies;
  body?: string;
}

export interface WebResponse {
  statusCode: number;
  responsePhrase: string;
  headers: Headers;
  cookies: Cookies;
  body?: string;
}

export interface Headers {
  [key: string]: string;
}

export interface Cookies {
  [key: string]: string;
}

export type MiddlewarePhase = "Enter" | "Exit" | "ShortCircuit" | "Exception";
