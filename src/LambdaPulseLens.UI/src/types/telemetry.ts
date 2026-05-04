export type FlowDirection = "downstream" | "upstream";
export type ExecutionEvent = "success" | "short-circuit" | "error";

export interface Trace {
  id: number;
  timestampStart: string;
  durationMs: number;

  request: WebRequest;
  response: WebResponse;

  pipeline: Step[];
}

export interface Step {
  middleware: string;
  direction?: FlowDirection;
  event: ExecutionEvent;
  timestampStart: string;
  durationMs: number;
  logs?: string[];
}

export interface WebRequest {
  method: string;
  path: string;
  protocol: string;
  headers: Headers;
  cookies?: Cookies;
  body?: string;
}

export interface WebResponse {
  statusCode: number;
  responsePhrase: string;
  headers: Headers;
  cookies?: Cookies;
  body?: string;
}

export interface Headers {
  [key: string]: string;
}

export interface Cookies {
  [key: string]: string;
}
