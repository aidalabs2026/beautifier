// Pure-string XML beautifier / minifier.
// Keeps it main-thread (DOMParser inside a Worker has spotty cross-browser
// support), and uses a token-based pass so that CDATA and comments survive.

export type IndentValue = '  ' | '    ' | '\t';

export interface BeautifyOptions {
  indent: IndentValue;
}

type Token =
  | { kind: 'decl'; text: string }         // <?xml ...?>
  | { kind: 'doctype'; text: string }      // <!DOCTYPE ...>
  | { kind: 'comment'; text: string }      // <!-- ... -->
  | { kind: 'cdata'; text: string }        // <![CDATA[ ... ]]>
  | { kind: 'open'; text: string; name: string }
  | { kind: 'close'; text: string; name: string }
  | { kind: 'self'; text: string; name: string }
  | { kind: 'text'; text: string };

const NAME_RE = /^<\/?\s*([a-zA-Z_:][\w:.-]*)/;

function tokenize(xml: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < xml.length) {
    if (xml[i] === '<') {
      // Special constructs
      if (xml.startsWith('<!--', i)) {
        const end = xml.indexOf('-->', i + 4);
        const stop = end === -1 ? xml.length : end + 3;
        out.push({ kind: 'comment', text: xml.slice(i, stop) });
        i = stop;
        continue;
      }
      if (xml.startsWith('<![CDATA[', i)) {
        const end = xml.indexOf(']]>', i + 9);
        const stop = end === -1 ? xml.length : end + 3;
        out.push({ kind: 'cdata', text: xml.slice(i, stop) });
        i = stop;
        continue;
      }
      if (xml.startsWith('<?', i)) {
        const end = xml.indexOf('?>', i + 2);
        const stop = end === -1 ? xml.length : end + 2;
        out.push({ kind: 'decl', text: xml.slice(i, stop) });
        i = stop;
        continue;
      }
      if (xml.startsWith('<!', i)) {
        const end = xml.indexOf('>', i + 2);
        const stop = end === -1 ? xml.length : end + 1;
        out.push({ kind: 'doctype', text: xml.slice(i, stop) });
        i = stop;
        continue;
      }
      // Regular tag
      const end = xml.indexOf('>', i);
      if (end === -1) {
        // Truncated tag — emit whatever is left as text
        out.push({ kind: 'text', text: xml.slice(i) });
        break;
      }
      const full = xml.slice(i, end + 1);
      const nameMatch = full.match(NAME_RE);
      const name = nameMatch ? nameMatch[1] : '';
      const isClose = full.startsWith('</');
      const isSelf = /\/\s*>$/.test(full);
      if (isClose) out.push({ kind: 'close', text: full, name });
      else if (isSelf) out.push({ kind: 'self', text: full, name });
      else out.push({ kind: 'open', text: full, name });
      i = end + 1;
      continue;
    }
    // Text up to the next '<'
    const next = xml.indexOf('<', i);
    const stop = next === -1 ? xml.length : next;
    out.push({ kind: 'text', text: xml.slice(i, stop) });
    i = stop;
  }
  return out;
}

export function beautifyXml(xml: string, indent: IndentValue): string {
  const trimmed = xml.trim();
  if (!trimmed) return '';
  const tokens = tokenize(trimmed);
  const lines: string[] = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.kind === 'text') {
      const body = t.text.replace(/\s+/g, ' ').trim();
      if (!body) continue;
      // Attach short text to its surrounding element on one line if possible
      const prev = tokens[i - 1];
      const next = tokens[i + 1];
      if (prev && prev.kind === 'open' && next && next.kind === 'close' && prev.name === next.name) {
        const last = lines.pop() ?? '';
        lines.push(last + escapeText(body) + next.text);
        depth = Math.max(0, depth - 1);
        i++; // skip the close, already emitted
        continue;
      }
      lines.push(indent.repeat(depth) + escapeText(body));
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

    // decl / doctype / comment / cdata / self-close — emit on their own line
    lines.push(indent.repeat(depth) + t.text);
  }

  return lines.join('\n');
}

export function minifyXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim();
}

function escapeText(s: string): string {
  return s.replace(/&(?![a-zA-Z#]+;)/g, '&amp;');
}

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
}

export function validateXml(xml: string): ValidationError | null {
  if (!xml.trim()) return { message: 'Input is empty.' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    // Cross-browser: Chrome/Firefox put the error inside a <parsererror> element.
    const err = doc.getElementsByTagName('parsererror')[0];
    if (!err) return null;

    // Extract line/column from the error message where present
    // Firefox: "XML Parsing Error: ... Location: ... Line Number 1, Column 13:"
    // Chrome:  "This page contains the following errors: error on line 1 at column 13: ..."
    const text = err.textContent || 'Invalid XML';
    const m = text.match(/[Ll]ine\s*(?:[Nn]umber)?[\s:]*?(\d+).*?[Cc]olumn\s*(\d+)/);
    const clean = text.replace(/^This page contains the following errors:\s*/i, '').replace(/Below is a rendering of the page[\s\S]*$/, '').trim();
    return {
      message: clean || 'Invalid XML',
      line: m ? Number(m[1]) : undefined,
      column: m ? Number(m[2]) : undefined,
    };
  } catch (e) {
    return { message: e instanceof Error ? e.message : String(e) };
  }
}
