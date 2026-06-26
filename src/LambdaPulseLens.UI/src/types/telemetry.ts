export type FlowDirection = "downstream" | "upstream";
export type ExecutionEvent = "success" | "short-circuit" | "error";

export interface TraceSummary {
  id: string;
  userId: string | null;
  timestampStart: string;
  durationMs: number;

  requestMethod: string | null;
  requestPath: string | null;
  requestProtocol: string | null;

  responseStatusCode: number;
  responsePhrase: string;
}

export interface Trace {
  id: string;
  userId: string | null;
  timestampStart: string;
  durationMs: number;

  requestMethod: string | null;
  requestPath: string | null;
  requestProtocol: string | null;

  responseStatusCode: number;
  responsePhrase: string;

  steps: Step[];
}

export interface Step {
  middleware: string;
  direction: FlowDirection | null;
  event: ExecutionEvent;
  timestampStart: string;
  durationMs: number;
  logs?: string[];
}
