// Pure-string HTML beautifier / minifier, void-element aware.
// Conservative: preserves <pre>, <textarea>, <script>, and <style> contents
// byte-for-byte.

export type IndentValue = '  ' | '    ' | '\t';

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const RAW_ELEMENTS = new Set(['pre', 'textarea', 'script', 'style']);

const INLINE_ELEMENTS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup',
  'time', 'u', 'var',
]);

type Token =
  | { kind: 'doctype'; text: string }
  | { kind: 'comment'; text: string }
  | { kind: 'open'; text: string; name: string }
  | { kind: 'close'; text: string; name: string }
  | { kind: 'self'; text: string; name: string }
  | { kind: 'raw'; text: string; name: string } // full <pre>...</pre>
  | { kind: 'text'; text: string };

const NAME_RE = /^<\/?\s*([a-zA-Z][\w-]*)/;

function tokenize(html: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4);
        const stop = end === -1 ? html.length : end + 3;
        out.push({ kind: 'comment', text: html.slice(i, stop) });
        i = stop;
        continue;
      }
      if (/^<!doctype/i.test(html.slice(i))) {
        const end = html.indexOf('>', i + 2);
        const stop = end === -1 ? html.length : end + 1;
        out.push({ kind: 'doctype', text: html.slice(i, stop) });
        i = stop;
        continue;
      }
      const end = html.indexOf('>', i);
      if (end === -1) {
        out.push({ kind: 'text', text: html.slice(i) });
        break;
      }
      const full = html.slice(i, end + 1);
      const nameMatch = full.match(NAME_RE);
      const name = nameMatch ? nameMatch[1].toLowerCase() : '';
      const isClose = full.startsWith('</');
      const isSelf = /\/\s*>$/.test(full) || VOID_ELEMENTS.has(name);

      // Raw-text elements: grab content until matching close tag, byte-for-byte
      if (!isClose && !isSelf && RAW_ELEMENTS.has(name)) {
        const closeRe = new RegExp(`</${name}\\s*>`, 'i');
        const closeMatch = html.slice(end + 1).match(closeRe);
        if (closeMatch && closeMatch.index !== undefined) {
          const rawEnd = end + 1 + closeMatch.index + closeMatch[0].length;
          out.push({ kind: 'raw', text: html.slice(i, rawEnd), name });
          i = rawEnd;
          continue;
        }
      }

      if (isClose) out.push({ kind: 'close', text: full, name });
      else if (isSelf) out.push({ kind: 'self', text: full, name });
      else out.push({ kind: 'open', text: full, name });
      i = end + 1;
      continue;
    }
    const next = html.indexOf('<', i);
    const stop = next === -1 ? html.length : next;
    out.push({ kind: 'text', text: html.slice(i, stop) });
    i = stop;
  }
  return out;
}

export function beautifyHtml(html: string, indent: IndentValue): string {
  const trimmed = html.trim();
  if (!trimmed) return '';
  const tokens = tokenize(trimmed);
  const lines: string[] = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.kind === 'text') {
      const collapsed = t.text.replace(/\s+/g, ' ');
      const body = collapsed.trim();
      if (!body) continue;

      // If short text sits between an open and its matching close, keep it inline
      const prev = tokens[i - 1];
      const next = tokens[i + 1];
      const inlineCandidate =
        prev && prev.kind === 'open' &&
        next && next.kind === 'close' && prev.name === next.name &&
        !body.includes('\n') && body.length <= 100;
      if (inlineCandidate) {
        const last = lines.pop() ?? '';
        lines.push(last + body + next.text);
        depth = Math.max(0, depth - 1);
        i++; // skip the close
        continue;
      }
      lines.push(indent.repeat(depth) + body);
      continue;
    }

    if (t.kind === 'close') {
      depth = Math.max(0, depth - 1);
      lines.push(indent.repeat(depth) + t.text);
      continue;
    }

    if (t.kind === 'open') {
      lines.push(indent.repeat(depth) + t.text);
      depth++;
      continue;
    }

    if (t.kind === 'raw') {
      // Preserve as-is, indented only at the opening line
      const rawLines = t.text.split('\n');
      lines.push(indent.repeat(depth) + rawLines[0]);
      for (let k = 1; k < rawLines.length; k++) {
        lines.push(rawLines[k]);
      }
      continue;
    }

    // doctype / comment / self
    lines.push(indent.repeat(depth) + t.text);
  }

  return lines.join('\n');
}

export function minifyHtml(html: string): string {
  const tokens = tokenize(html);
  const out: string[] = [];
  for (const t of tokens) {
    if (t.kind === 'text') {
      out.push(t.text.replace(/\s+/g, ' '));
    } else if (t.kind === 'comment') {
      // Strip comments entirely (but keep conditional <!--[if IE]>-- — rare, skip)
      continue;
    } else if (t.kind === 'raw') {
      out.push(t.text);
    } else {
      out.push(t.text);
    }
  }
  return out.join('').replace(/\s+</g, match => (match.length > 1 ? '<' : match)).replace(/>\s+/g, match => (match.length > 1 ? '>' : match)).trim();
}

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
}

export function validateHtml(html: string): ValidationError | null {
  const trimmed = html.trim();
  if (!trimmed) return { message: 'Input is empty.' };
  // HTML is very forgiving, so "validate" means: does it have reasonably balanced tags?
  const tokens = tokenize(trimmed);
  const stack: string[] = [];
  let line = 1;
  let pos = 0;
  for (const t of tokens) {
    // Track line numbers through the original string
    const before = trimmed.indexOf(t.text, pos);
    if (before !== -1) {
      for (let k = pos; k < before; k++) if (trimmed.charCodeAt(k) === 10) line++;
      pos = before + t.text.length;
      for (let k = before; k < pos; k++) if (trimmed.charCodeAt(k) === 10) line++;
    }
    if (t.kind === 'open') stack.push(t.name);
    else if (t.kind === 'close') {
      const open = stack.pop();
      if (open !== t.name) {
        // Found mismatch; report as soft warning
        return {
          message: `Mismatched tag: found </${t.name}> but expected </${open ?? '(nothing)'}>`,
          line,
        };
      }
    }
  }
  if (stack.length > 0) {
    return { message: `Unclosed tag(s): ${stack.map(n => '<' + n + '>').join(', ')}` };
  }
  return null;
}
