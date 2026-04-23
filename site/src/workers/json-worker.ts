/// <reference lib="webworker" />

export type Operation = 'beautify' | 'minify' | 'validate';
export type IndentValue = 2 | 4 | '\t';

export interface WorkerRequest {
  op: Operation;
  input: string;
  indent: IndentValue;
  sortKeys: boolean;
}

export interface WorkerResultMessage {
  type: 'result';
  op: Operation;
  output: string;
  size: number;
  durationMs: number;
}

export interface WorkerErrorMessage {
  type: 'error';
  op: Operation;
  message: string;
  line?: number;
  column?: number;
  durationMs: number;
}

export type WorkerResponse = WorkerResultMessage | WorkerErrorMessage;

function extractPosition(message: string): number | null {
  // V8: "Unexpected token ... at position 42"
  const posMatch = message.match(/position\s+(\d+)/i);
  if (posMatch) return Number(posMatch[1]);
  return null;
}

function extractLineCol(message: string): { line: number; column: number } | null {
  // Firefox: "... at line 2 column 3 of the JSON data"
  const m = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (m) return { line: Number(m[1]), column: Number(m[2]) };
  return null;
}

function offsetToLineCol(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const limit = Math.min(offset, source.length);
  for (let i = 0; i < limit; i++) {
    if (source.charCodeAt(i) === 10) {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

function sortObjectDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectDeep);
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = sortObjectDeep(obj[key]);
    }
    return sorted;
  }
  return value;
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { op, input, indent, sortKeys } = event.data;
  const start = performance.now();

  try {
    const parsed: unknown = JSON.parse(input);

    let output: string;
    if (op === 'validate') {
      output = '';
    } else if (op === 'minify') {
      output = JSON.stringify(sortKeys ? sortObjectDeep(parsed) : parsed);
    } else {
      output = JSON.stringify(sortKeys ? sortObjectDeep(parsed) : parsed, null, indent);
    }

    const durationMs = performance.now() - start;
    const size = new TextEncoder().encode(output).length;
    const message: WorkerResultMessage = {
      type: 'result',
      op,
      output,
      size,
      durationMs,
    };
    (self as unknown as DedicatedWorkerGlobalScope).postMessage(message);
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    let line: number | undefined;
    let column: number | undefined;

    const lc = extractLineCol(raw);
    if (lc) {
      line = lc.line;
      column = lc.column;
    } else {
      const pos = extractPosition(raw);
      if (pos !== null) {
        const loc = offsetToLineCol(input, pos);
        line = loc.line;
        column = loc.column;
      }
    }

    const durationMs = performance.now() - start;
    const message: WorkerErrorMessage = {
      type: 'error',
      op,
      message: raw,
      line,
      column,
      durationMs,
    };
    (self as unknown as DedicatedWorkerGlobalScope).postMessage(message);
  }
};
