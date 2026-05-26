import zlib from "node:zlib";

// Minimal ZIP writer used to build lightweight archive fixtures for the
// package scanner/validator regression tests. The real scripts only read these
// archives with the system `unzip`, so the fixtures must be byte-for-byte valid
// ZIP files. Building them in-process (instead of shelling out to `zip`) lets us
// control entry names exactly, including the unsafe paths and symlink entries
// that the `zip` CLI normalizes away.

export interface ZipEntry {
  /** Stored archive entry name, written verbatim (may be unsafe on purpose). */
  name: string;
  /** File contents. Ignored when `symlinkTarget` is set. */
  content?: string | Buffer;
  /** When set, the entry is stored as a Unix symbolic link to this target. */
  symlinkTarget?: string;
  /** Compression method. Defaults to "store". */
  compression?: "store" | "deflate";
}

// Fixed, valid DOS timestamp (2024-01-01 00:00:00) so fixtures are deterministic.
const DOS_DATE = 0x5821;
const DOS_TIME = 0x0000;

// Unix mode bits encoded in the high word of the external attributes field.
const UNIX_REGULAR_FILE = 0o100644;
const UNIX_SYMLINK = 0o120777;

function crc32(buf: Buffer): number {
  let crc = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function entryBytes(entry: ZipEntry): Buffer {
  if (typeof entry.symlinkTarget === "string") {
    return Buffer.from(entry.symlinkTarget, "utf8");
  }
  if (Buffer.isBuffer(entry.content)) return entry.content;
  return Buffer.from(entry.content ?? "", "utf8");
}

/** Build an in-memory ZIP archive from the provided entries. */
export function buildZip(entries: ZipEntry[]): Buffer {
  const localChunks: Buffer[] = [];
  const centralChunks: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, "utf8");
    const isSymlink = typeof entry.symlinkTarget === "string";
    const raw = entryBytes(entry);
    const method = entry.compression === "deflate" && !isSymlink ? 8 : 0;
    const stored = method === 8 ? zlib.deflateRawSync(raw) : raw;
    const crc = crc32(raw);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // local file header signature
    localHeader.writeUInt16LE(20, 4); // version needed to extract
    localHeader.writeUInt16LE(0, 6); // general purpose bit flag
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(DOS_TIME, 10);
    localHeader.writeUInt16LE(DOS_DATE, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(stored.length, 18);
    localHeader.writeUInt32LE(raw.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // extra field length
    localChunks.push(localHeader, nameBuf, stored);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0); // central directory signature
    centralHeader.writeUInt16LE((3 << 8) | 20, 4); // version made by (Unix)
    centralHeader.writeUInt16LE(20, 6); // version needed to extract
    centralHeader.writeUInt16LE(0, 8); // general purpose bit flag
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(DOS_TIME, 12);
    centralHeader.writeUInt16LE(DOS_DATE, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(stored.length, 20);
    centralHeader.writeUInt32LE(raw.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30); // extra field length
    centralHeader.writeUInt16LE(0, 32); // file comment length
    centralHeader.writeUInt16LE(0, 34); // disk number start
    centralHeader.writeUInt16LE(0, 36); // internal file attributes
    const unixMode = isSymlink ? UNIX_SYMLINK : UNIX_REGULAR_FILE;
    centralHeader.writeUInt32LE((unixMode << 16) >>> 0, 38); // external attrs
    centralHeader.writeUInt32LE(offset, 42); // local header offset
    centralChunks.push(centralHeader, nameBuf);

    offset += localHeader.length + nameBuf.length + stored.length;
  }

  const localPart = Buffer.concat(localChunks);
  const centralPart = Buffer.concat(centralChunks);

  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0); // end of central directory signature
  endRecord.writeUInt16LE(0, 4); // number of this disk
  endRecord.writeUInt16LE(0, 6); // disk with start of central directory
  endRecord.writeUInt16LE(entries.length, 8); // central dir records on disk
  endRecord.writeUInt16LE(entries.length, 10); // total central dir records
  endRecord.writeUInt32LE(centralPart.length, 12); // size of central directory
  endRecord.writeUInt32LE(localPart.length, 16); // central directory offset
  endRecord.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([localPart, centralPart, endRecord]);
}
