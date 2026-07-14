// Pure UTF-16 check behind scripts/validate-raycast-feed.mjs: detect a lone
// (unpaired) surrogate code unit, which is invalid in a well-formed string and
// would corrupt the emitted JSON feed. Split out so the surrogate-pairing logic
// can be unit-tested in isolation.

/**
 * True when `value` contains an unpaired UTF-16 surrogate: a high surrogate
 * (U+D800–U+DBFF) not immediately followed by a low surrogate (U+DC00–U+DFFF),
 * or a low surrogate that does not follow a high one. Valid surrogate pairs and
 * BMP characters return false.
 */
export function stringHasLoneSurrogate(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = value.charCodeAt(index + 1);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        index += 1;
        continue;
      }
      return true;
    }
    if (code >= 0xdc00 && code <= 0xdfff) return true;
  }
  return false;
}
