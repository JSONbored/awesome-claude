import { describe, expect, it } from "vitest";

import { findPredictableSharedTmpDebugPaths } from "../scripts/lib/shared-tmp-debug-paths.mjs";

describe("findPredictableSharedTmpDebugPaths", () => {
  it("finds predictable /tmp debug and startup paths", () => {
    expect(
      findPredictableSharedTmpDebugPaths("cat /tmp/debug.log here"),
    ).toEqual(["/tmp/debug.log"]);
    expect(
      findPredictableSharedTmpDebugPaths("echo x > /tmp/startup-config"),
    ).toEqual(["/tmp/startup-config"]);
  });

  it("excludes paths randomized with $$ / $RANDOM / XXXX", () => {
    expect(findPredictableSharedTmpDebugPaths("/tmp/debug-$$")).toEqual([]);
    expect(findPredictableSharedTmpDebugPaths("/tmp/debug-$RANDOM")).toEqual(
      [],
    );
    expect(findPredictableSharedTmpDebugPaths("/tmp/debugXXXXXX")).toEqual([]);
  });

  it("ignores /tmp paths without a debug/startup segment", () => {
    expect(findPredictableSharedTmpDebugPaths("/tmp/foo.log")).toEqual([]);
    expect(findPredictableSharedTmpDebugPaths("no tmp here")).toEqual([]);
    expect(findPredictableSharedTmpDebugPaths("")).toEqual([]);
  });

  it("de-duplicates a repeated path", () => {
    expect(
      findPredictableSharedTmpDebugPaths(
        "/tmp/debug.log and again /tmp/debug.log",
      ),
    ).toEqual(["/tmp/debug.log"]);
  });

  it("returns each distinct predictable path, skipping randomized ones in the same body", () => {
    expect(
      findPredictableSharedTmpDebugPaths(
        "a /tmp/debug.a and /tmp/startupZ and /tmp/debug-$$",
      ),
    ).toEqual(["/tmp/debug.a", "/tmp/startupZ"]);
  });
});
