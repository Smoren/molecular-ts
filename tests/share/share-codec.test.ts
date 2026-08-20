import { gzipSync } from 'zlib';
import { describe, expect, it } from '@jest/globals';
import { decodeSharePayload, encodeSharePayload } from '../../src/web/utils/share-codec';

const PAYLOAD = '{"worldConfig":{"PHYSIC_MODEL":"v2"},"typesConfig":{"TYPE_LINKS":[1,2]}}';

function toBase64Url(buffer: Buffer): string {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

describe('share codec', () => {
  it('decodes legacy btoa JSON hashes', async () => {
    const hash = Buffer.from(PAYLOAD, 'utf8').toString('base64');
    expect(await decodeSharePayload(hash)).toBe(PAYLOAD);
  });

  it('decodes url-safe legacy hashes', async () => {
    const hash = toBase64Url(Buffer.from(PAYLOAD, 'utf8'));
    expect(await decodeSharePayload(hash)).toBe(PAYLOAD);
  });

  it('decodes g1.gzip hashes', async () => {
    const hash = `g1.${toBase64Url(gzipSync(PAYLOAD))}`;
    expect(await decodeSharePayload(hash)).toBe(PAYLOAD);
  });

  it('encodes a gzip hash that roundtrips', async () => {
    const encoded = await encodeSharePayload(PAYLOAD);
    expect(encoded.startsWith('g1.')).toBe(true);
    expect(await decodeSharePayload(encoded)).toBe(PAYLOAD);
  });

  it('decodes percent-encoded hashes', async () => {
    const hash = `g1.${toBase64Url(gzipSync(PAYLOAD))}`;
    expect(await decodeSharePayload(encodeURIComponent(hash))).toBe(PAYLOAD);
  });
});
