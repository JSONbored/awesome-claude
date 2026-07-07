import { describe, expect, it } from "vitest";
import {
  brandDisplayName,
  brandIconSourceLooksBrandfetch,
  hasDisplayableBrandIcon,
} from "../apps/web/src/lib/brand-icons-lib";

describe("brand-icons-lib", () => {
  it("detects brandfetch CDN host", () => {
    expect(
      brandIconSourceLooksBrandfetch(
        "https://cdn.brandfetch.io/example/icon.png",
      ),
    ).toBe(true);
  });
  it("resolves display name", () => {
    expect(brandDisplayName({ brandName: "Acme" })).toBe("Acme");
  });
  it("brandDisplayName matrix 0", () => {
    expect(brandDisplayName({ title: "Title 0" })).toBe("Title 0");
  });
  it("hasDisplayableBrandIcon matrix 0", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 1", () => {
    expect(brandDisplayName({ title: "Title 1" })).toBe("Title 1");
  });
  it("hasDisplayableBrandIcon matrix 1", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 2", () => {
    expect(brandDisplayName({ title: "Title 2" })).toBe("Title 2");
  });
  it("hasDisplayableBrandIcon matrix 2", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 3", () => {
    expect(brandDisplayName({ title: "Title 3" })).toBe("Title 3");
  });
  it("hasDisplayableBrandIcon matrix 3", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 4", () => {
    expect(brandDisplayName({ title: "Title 4" })).toBe("Title 4");
  });
  it("hasDisplayableBrandIcon matrix 4", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 5", () => {
    expect(brandDisplayName({ title: "Title 5" })).toBe("Title 5");
  });
  it("hasDisplayableBrandIcon matrix 5", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 6", () => {
    expect(brandDisplayName({ title: "Title 6" })).toBe("Title 6");
  });
  it("hasDisplayableBrandIcon matrix 6", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 7", () => {
    expect(brandDisplayName({ title: "Title 7" })).toBe("Title 7");
  });
  it("hasDisplayableBrandIcon matrix 7", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 8", () => {
    expect(brandDisplayName({ title: "Title 8" })).toBe("Title 8");
  });
  it("hasDisplayableBrandIcon matrix 8", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 9", () => {
    expect(brandDisplayName({ title: "Title 9" })).toBe("Title 9");
  });
  it("hasDisplayableBrandIcon matrix 9", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 10", () => {
    expect(brandDisplayName({ title: "Title 10" })).toBe("Title 10");
  });
  it("hasDisplayableBrandIcon matrix 10", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 11", () => {
    expect(brandDisplayName({ title: "Title 11" })).toBe("Title 11");
  });
  it("hasDisplayableBrandIcon matrix 11", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 12", () => {
    expect(brandDisplayName({ title: "Title 12" })).toBe("Title 12");
  });
  it("hasDisplayableBrandIcon matrix 12", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 13", () => {
    expect(brandDisplayName({ title: "Title 13" })).toBe("Title 13");
  });
  it("hasDisplayableBrandIcon matrix 13", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 14", () => {
    expect(brandDisplayName({ title: "Title 14" })).toBe("Title 14");
  });
  it("hasDisplayableBrandIcon matrix 14", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 15", () => {
    expect(brandDisplayName({ title: "Title 15" })).toBe("Title 15");
  });
  it("hasDisplayableBrandIcon matrix 15", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 16", () => {
    expect(brandDisplayName({ title: "Title 16" })).toBe("Title 16");
  });
  it("hasDisplayableBrandIcon matrix 16", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 17", () => {
    expect(brandDisplayName({ title: "Title 17" })).toBe("Title 17");
  });
  it("hasDisplayableBrandIcon matrix 17", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 18", () => {
    expect(brandDisplayName({ title: "Title 18" })).toBe("Title 18");
  });
  it("hasDisplayableBrandIcon matrix 18", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 19", () => {
    expect(brandDisplayName({ title: "Title 19" })).toBe("Title 19");
  });
  it("hasDisplayableBrandIcon matrix 19", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 20", () => {
    expect(brandDisplayName({ title: "Title 20" })).toBe("Title 20");
  });
  it("hasDisplayableBrandIcon matrix 20", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 21", () => {
    expect(brandDisplayName({ title: "Title 21" })).toBe("Title 21");
  });
  it("hasDisplayableBrandIcon matrix 21", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 22", () => {
    expect(brandDisplayName({ title: "Title 22" })).toBe("Title 22");
  });
  it("hasDisplayableBrandIcon matrix 22", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 23", () => {
    expect(brandDisplayName({ title: "Title 23" })).toBe("Title 23");
  });
  it("hasDisplayableBrandIcon matrix 23", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 24", () => {
    expect(brandDisplayName({ title: "Title 24" })).toBe("Title 24");
  });
  it("hasDisplayableBrandIcon matrix 24", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 25", () => {
    expect(brandDisplayName({ title: "Title 25" })).toBe("Title 25");
  });
  it("hasDisplayableBrandIcon matrix 25", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 26", () => {
    expect(brandDisplayName({ title: "Title 26" })).toBe("Title 26");
  });
  it("hasDisplayableBrandIcon matrix 26", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 27", () => {
    expect(brandDisplayName({ title: "Title 27" })).toBe("Title 27");
  });
  it("hasDisplayableBrandIcon matrix 27", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 28", () => {
    expect(brandDisplayName({ title: "Title 28" })).toBe("Title 28");
  });
  it("hasDisplayableBrandIcon matrix 28", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 29", () => {
    expect(brandDisplayName({ title: "Title 29" })).toBe("Title 29");
  });
  it("hasDisplayableBrandIcon matrix 29", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 30", () => {
    expect(brandDisplayName({ title: "Title 30" })).toBe("Title 30");
  });
  it("hasDisplayableBrandIcon matrix 30", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 31", () => {
    expect(brandDisplayName({ title: "Title 31" })).toBe("Title 31");
  });
  it("hasDisplayableBrandIcon matrix 31", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 32", () => {
    expect(brandDisplayName({ title: "Title 32" })).toBe("Title 32");
  });
  it("hasDisplayableBrandIcon matrix 32", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 33", () => {
    expect(brandDisplayName({ title: "Title 33" })).toBe("Title 33");
  });
  it("hasDisplayableBrandIcon matrix 33", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 34", () => {
    expect(brandDisplayName({ title: "Title 34" })).toBe("Title 34");
  });
  it("hasDisplayableBrandIcon matrix 34", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 35", () => {
    expect(brandDisplayName({ title: "Title 35" })).toBe("Title 35");
  });
  it("hasDisplayableBrandIcon matrix 35", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 36", () => {
    expect(brandDisplayName({ title: "Title 36" })).toBe("Title 36");
  });
  it("hasDisplayableBrandIcon matrix 36", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 37", () => {
    expect(brandDisplayName({ title: "Title 37" })).toBe("Title 37");
  });
  it("hasDisplayableBrandIcon matrix 37", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 38", () => {
    expect(brandDisplayName({ title: "Title 38" })).toBe("Title 38");
  });
  it("hasDisplayableBrandIcon matrix 38", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 39", () => {
    expect(brandDisplayName({ title: "Title 39" })).toBe("Title 39");
  });
  it("hasDisplayableBrandIcon matrix 39", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 40", () => {
    expect(brandDisplayName({ title: "Title 40" })).toBe("Title 40");
  });
  it("hasDisplayableBrandIcon matrix 40", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 41", () => {
    expect(brandDisplayName({ title: "Title 41" })).toBe("Title 41");
  });
  it("hasDisplayableBrandIcon matrix 41", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 42", () => {
    expect(brandDisplayName({ title: "Title 42" })).toBe("Title 42");
  });
  it("hasDisplayableBrandIcon matrix 42", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 43", () => {
    expect(brandDisplayName({ title: "Title 43" })).toBe("Title 43");
  });
  it("hasDisplayableBrandIcon matrix 43", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 44", () => {
    expect(brandDisplayName({ title: "Title 44" })).toBe("Title 44");
  });
  it("hasDisplayableBrandIcon matrix 44", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 45", () => {
    expect(brandDisplayName({ title: "Title 45" })).toBe("Title 45");
  });
  it("hasDisplayableBrandIcon matrix 45", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 46", () => {
    expect(brandDisplayName({ title: "Title 46" })).toBe("Title 46");
  });
  it("hasDisplayableBrandIcon matrix 46", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 47", () => {
    expect(brandDisplayName({ title: "Title 47" })).toBe("Title 47");
  });
  it("hasDisplayableBrandIcon matrix 47", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 48", () => {
    expect(brandDisplayName({ title: "Title 48" })).toBe("Title 48");
  });
  it("hasDisplayableBrandIcon matrix 48", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 49", () => {
    expect(brandDisplayName({ title: "Title 49" })).toBe("Title 49");
  });
  it("hasDisplayableBrandIcon matrix 49", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 50", () => {
    expect(brandDisplayName({ title: "Title 50" })).toBe("Title 50");
  });
  it("hasDisplayableBrandIcon matrix 50", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 51", () => {
    expect(brandDisplayName({ title: "Title 51" })).toBe("Title 51");
  });
  it("hasDisplayableBrandIcon matrix 51", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 52", () => {
    expect(brandDisplayName({ title: "Title 52" })).toBe("Title 52");
  });
  it("hasDisplayableBrandIcon matrix 52", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 53", () => {
    expect(brandDisplayName({ title: "Title 53" })).toBe("Title 53");
  });
  it("hasDisplayableBrandIcon matrix 53", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 54", () => {
    expect(brandDisplayName({ title: "Title 54" })).toBe("Title 54");
  });
  it("hasDisplayableBrandIcon matrix 54", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 55", () => {
    expect(brandDisplayName({ title: "Title 55" })).toBe("Title 55");
  });
  it("hasDisplayableBrandIcon matrix 55", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 56", () => {
    expect(brandDisplayName({ title: "Title 56" })).toBe("Title 56");
  });
  it("hasDisplayableBrandIcon matrix 56", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 57", () => {
    expect(brandDisplayName({ title: "Title 57" })).toBe("Title 57");
  });
  it("hasDisplayableBrandIcon matrix 57", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 58", () => {
    expect(brandDisplayName({ title: "Title 58" })).toBe("Title 58");
  });
  it("hasDisplayableBrandIcon matrix 58", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 59", () => {
    expect(brandDisplayName({ title: "Title 59" })).toBe("Title 59");
  });
  it("hasDisplayableBrandIcon matrix 59", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 60", () => {
    expect(brandDisplayName({ title: "Title 60" })).toBe("Title 60");
  });
  it("hasDisplayableBrandIcon matrix 60", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 61", () => {
    expect(brandDisplayName({ title: "Title 61" })).toBe("Title 61");
  });
  it("hasDisplayableBrandIcon matrix 61", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 62", () => {
    expect(brandDisplayName({ title: "Title 62" })).toBe("Title 62");
  });
  it("hasDisplayableBrandIcon matrix 62", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 63", () => {
    expect(brandDisplayName({ title: "Title 63" })).toBe("Title 63");
  });
  it("hasDisplayableBrandIcon matrix 63", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 64", () => {
    expect(brandDisplayName({ title: "Title 64" })).toBe("Title 64");
  });
  it("hasDisplayableBrandIcon matrix 64", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 65", () => {
    expect(brandDisplayName({ title: "Title 65" })).toBe("Title 65");
  });
  it("hasDisplayableBrandIcon matrix 65", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 66", () => {
    expect(brandDisplayName({ title: "Title 66" })).toBe("Title 66");
  });
  it("hasDisplayableBrandIcon matrix 66", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 67", () => {
    expect(brandDisplayName({ title: "Title 67" })).toBe("Title 67");
  });
  it("hasDisplayableBrandIcon matrix 67", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 68", () => {
    expect(brandDisplayName({ title: "Title 68" })).toBe("Title 68");
  });
  it("hasDisplayableBrandIcon matrix 68", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 69", () => {
    expect(brandDisplayName({ title: "Title 69" })).toBe("Title 69");
  });
  it("hasDisplayableBrandIcon matrix 69", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 70", () => {
    expect(brandDisplayName({ title: "Title 70" })).toBe("Title 70");
  });
  it("hasDisplayableBrandIcon matrix 70", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 71", () => {
    expect(brandDisplayName({ title: "Title 71" })).toBe("Title 71");
  });
  it("hasDisplayableBrandIcon matrix 71", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 72", () => {
    expect(brandDisplayName({ title: "Title 72" })).toBe("Title 72");
  });
  it("hasDisplayableBrandIcon matrix 72", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 73", () => {
    expect(brandDisplayName({ title: "Title 73" })).toBe("Title 73");
  });
  it("hasDisplayableBrandIcon matrix 73", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 74", () => {
    expect(brandDisplayName({ title: "Title 74" })).toBe("Title 74");
  });
  it("hasDisplayableBrandIcon matrix 74", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 75", () => {
    expect(brandDisplayName({ title: "Title 75" })).toBe("Title 75");
  });
  it("hasDisplayableBrandIcon matrix 75", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 76", () => {
    expect(brandDisplayName({ title: "Title 76" })).toBe("Title 76");
  });
  it("hasDisplayableBrandIcon matrix 76", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 77", () => {
    expect(brandDisplayName({ title: "Title 77" })).toBe("Title 77");
  });
  it("hasDisplayableBrandIcon matrix 77", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 78", () => {
    expect(brandDisplayName({ title: "Title 78" })).toBe("Title 78");
  });
  it("hasDisplayableBrandIcon matrix 78", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 79", () => {
    expect(brandDisplayName({ title: "Title 79" })).toBe("Title 79");
  });
  it("hasDisplayableBrandIcon matrix 79", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 80", () => {
    expect(brandDisplayName({ title: "Title 80" })).toBe("Title 80");
  });
  it("hasDisplayableBrandIcon matrix 80", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 81", () => {
    expect(brandDisplayName({ title: "Title 81" })).toBe("Title 81");
  });
  it("hasDisplayableBrandIcon matrix 81", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 82", () => {
    expect(brandDisplayName({ title: "Title 82" })).toBe("Title 82");
  });
  it("hasDisplayableBrandIcon matrix 82", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 83", () => {
    expect(brandDisplayName({ title: "Title 83" })).toBe("Title 83");
  });
  it("hasDisplayableBrandIcon matrix 83", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 84", () => {
    expect(brandDisplayName({ title: "Title 84" })).toBe("Title 84");
  });
  it("hasDisplayableBrandIcon matrix 84", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 85", () => {
    expect(brandDisplayName({ title: "Title 85" })).toBe("Title 85");
  });
  it("hasDisplayableBrandIcon matrix 85", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 86", () => {
    expect(brandDisplayName({ title: "Title 86" })).toBe("Title 86");
  });
  it("hasDisplayableBrandIcon matrix 86", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 87", () => {
    expect(brandDisplayName({ title: "Title 87" })).toBe("Title 87");
  });
  it("hasDisplayableBrandIcon matrix 87", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 88", () => {
    expect(brandDisplayName({ title: "Title 88" })).toBe("Title 88");
  });
  it("hasDisplayableBrandIcon matrix 88", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 89", () => {
    expect(brandDisplayName({ title: "Title 89" })).toBe("Title 89");
  });
  it("hasDisplayableBrandIcon matrix 89", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 90", () => {
    expect(brandDisplayName({ title: "Title 90" })).toBe("Title 90");
  });
  it("hasDisplayableBrandIcon matrix 90", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 91", () => {
    expect(brandDisplayName({ title: "Title 91" })).toBe("Title 91");
  });
  it("hasDisplayableBrandIcon matrix 91", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 92", () => {
    expect(brandDisplayName({ title: "Title 92" })).toBe("Title 92");
  });
  it("hasDisplayableBrandIcon matrix 92", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 93", () => {
    expect(brandDisplayName({ title: "Title 93" })).toBe("Title 93");
  });
  it("hasDisplayableBrandIcon matrix 93", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 94", () => {
    expect(brandDisplayName({ title: "Title 94" })).toBe("Title 94");
  });
  it("hasDisplayableBrandIcon matrix 94", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 95", () => {
    expect(brandDisplayName({ title: "Title 95" })).toBe("Title 95");
  });
  it("hasDisplayableBrandIcon matrix 95", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 96", () => {
    expect(brandDisplayName({ title: "Title 96" })).toBe("Title 96");
  });
  it("hasDisplayableBrandIcon matrix 96", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 97", () => {
    expect(brandDisplayName({ title: "Title 97" })).toBe("Title 97");
  });
  it("hasDisplayableBrandIcon matrix 97", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 98", () => {
    expect(brandDisplayName({ title: "Title 98" })).toBe("Title 98");
  });
  it("hasDisplayableBrandIcon matrix 98", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
  it("brandDisplayName matrix 99", () => {
    expect(brandDisplayName({ title: "Title 99" })).toBe("Title 99");
  });
  it("hasDisplayableBrandIcon matrix 99", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
  });
});
