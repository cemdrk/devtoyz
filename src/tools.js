import Base64 from './views/Base64.vue'
import JsonFormatter from './views/JsonFormatter.vue'
import Uuid from './views/Uuid.vue'
import Hash from './views/Hash.vue'
import UrlEncoder from './views/UrlEncoder.vue'
import Timestamp from './views/Timestamp.vue'

// One list drives the home grid, the router, and the header nav.
// To add a tool: build a view, import it, add an entry here.
export const tools = [
  {
    slug: 'base64',
    name: 'Base64',
    tag: 'encode',
    blurb: 'Encode text to Base64 and back, UTF-8 safe.',
    view: Base64,
  },
  {
    slug: 'json',
    name: 'JSON',
    tag: 'format',
    blurb: 'Pretty-print, minify, and validate JSON.',
    view: JsonFormatter,
  },
  {
    slug: 'uuid',
    name: 'UUID',
    tag: 'generate',
    blurb: 'Generate v4 UUIDs in batches, copy in one tap.',
    view: Uuid,
  },
  {
    slug: 'hash',
    name: 'Hash',
    tag: 'crypto',
    blurb: 'SHA-1, SHA-256, SHA-384, SHA-512 digests.',
    view: Hash,
  },
  {
    slug: 'url',
    name: 'URL',
    tag: 'encode',
    blurb: 'Percent-encode and decode URL components.',
    view: UrlEncoder,
  },
  {
    slug: 'timestamp',
    name: 'Timestamp',
    tag: 'convert',
    blurb: 'Unix time to human-readable dates, both ways.',
    view: Timestamp,
  },
]
