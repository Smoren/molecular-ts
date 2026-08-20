const GZIP_PREFIX = 'g1.';

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64: string): Uint8Array {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const normalized = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(normalized);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

export async function encodeSharePayload(json: string): Promise<string> {
  if (typeof CompressionStream === 'undefined') {
    return bytesToBase64Url(new TextEncoder().encode(json));
  }
  const stream = new Blob([new TextEncoder().encode(json)])
    .stream()
    .pipeThrough(new CompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  return GZIP_PREFIX + bytesToBase64Url(bytes);
}

export async function decodeSharePayload(raw: string): Promise<string> {
  let input = raw;
  try {
    input = decodeURIComponent(raw);
  } catch {
  }

  if (input.startsWith(GZIP_PREFIX)) {
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('Gzip share links need a modern browser');
    }
    const bytes = base64UrlToBytes(input.slice(GZIP_PREFIX.length));
    const stream = new Blob([bytes])
      .stream()
      .pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }

  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const normalized = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  return atob(normalized);
}
