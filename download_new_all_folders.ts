import fetch from "node-fetch";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const FOLDER_1_IDS = [
  "1a6aL9XZ6mK0JskkWcoFyoFl1ALmAdOMp",
  "1sSuz3sY_2zXwbwXRI2ASmnBX2Zpl-B3q",
  "1qePqfl_fYR6jCfTH1EN5aK39MQLHUuly",
  "1E3IULoAPe1iI_XCYpJwfyzdnCE_oexB-",
  "1iYyB8F1kCEuhAbVo9Cm0AGt0_w3FfuH5",
  "1MX0lLQCb0fsITCEMWWhgzFyzDahPw7y6",
  "15-rkQmBRYp7x0ndGsBbDg0SSNXrfc3HO",
  "1FDffwLSGDoTRBB65zUR2LokHr0vPEfc4",
  "1E6heih39No6C4O_27gF27eJng9XDKJwv"
];

const FOLDER_2_IDS = [
  "1685_ZHDJmU2-ILvkPfcBP6r187mLG9bO",
  "1RummUYqi0h-ZYJOF9rVIrX5ctIHvCAcg",
  "16DEtSvS-q9dfMeAhBn4VmgLJDLwGu3P3",
  "1Uib7b6kE1MPxngeH1aWJFHqPdqpeZDxI",
  "1KGC7loOcTDxko2GnJnzfjp5WXXh02izM",
  "1QPy1l2R3vAeqhEgEGibzfPnZcvqjrFSM",
  "1e9iEth96FwHfMiQrmqIa21kXrprwn0i3",
  "1xGzlR6pdxC2Uq__XppdKwMm8D7eG6-OT",
  "1vUC3Otevo_wHcECOTWakskZ9_zS1J4oU",
  "1ng2Mo1uHBUg3E_Prvq0BrgWqH1cTYYLr",
  "1w3Gxp3_uRJVKtLDIz3Wj4KRdsm9_eclN",
  "1BfghHVyi_97_5dnnh80VBRh4dRtzF81e",
  "1HhMMwmEHKeMcGVXg5r29MAj1zT-OFJft",
  "1lHuuCRc3jEKlyDmp60alO_0IAcFv_1vg",
  "13q-UNxm7yqSTukaNtr8id9UPJl1lhd8m",
  "1Vz3A3FqdTP0ObesYCBYCu8ueJk-JxhVi",
  "1VTmyphE61H6RgcIB_DN8JbtystYOtb_z"
];

const FOLDER_3_IDS = [
  "1OPq4KJEJYjLEnUKOHTlYB6sZ1UcOfacg",
  "1xDTu2js0jxaJpakF1H5shamv1KxSW_np",
  "1AYnexcydDFtNBiw9iQC3n7vXQryAcBaP",
  "1UUK4oB0QKU2WnHfe6PKz9xeoT_tlN_RO",
  "1iwrcm5rF00rdcBraxQKUKDSMjWBCqEqa",
  "1ztedHHrHDtzuCjkMpKgLXUGH7UPOQy7R",
  "1bL86FOtaEMPdYmk_EVrR4M4jNU3dJhJf",
  "1G5Yy4KQmI4IU5PQ_jnsfVK3hXxQwItTE",
  "137UfEYCBPTFFwMpQws66-KBn_Wn8HXMH",
  "1eC4GHVBaNo5_YqKZzX4st13Rv-N3qAnc",
  "1eS-R3PjIqT9YbIc8fB820Of737boojhb"
];

const FOLDER_4_IDS = [
  "1qWgFsK8XWJHW-B2dSNnMTEfTQ9NNBLiQ",
  "1brmW0f3g0EyGHO2vB2irJ7Q_PytIlSpN",
  "1lDVhRm9cJV2wikXsmyffFc8vnCEkfmcO"
];

const ALL_IDS = [
  ...FOLDER_1_IDS,
  ...FOLDER_2_IDS,
  ...FOLDER_3_IDS,
  ...FOLDER_4_IDS
];

async function run() {
  const outDir = "public/images/optimized";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (let id of ALL_IDS) {
    const outFile = path.join(outDir, `${id}.webp`);
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 0) {
      console.log(`File already exists: ${id}.webp (${fs.statSync(outFile).size} bytes)`);
      continue;
    }

    const url = `https://lh3.googleusercontent.com/d/${id}`;
    console.log(`Downloading ${id}...`);
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`Compressing ${id}...`);
      const compressed = await sharp(buffer)
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      fs.writeFileSync(outFile, compressed);
      console.log(`Successfully saved: ${outFile} (${compressed.length} bytes)`);
    } catch (e: any) {
      console.error(`Error downloading ${id}:`, e.message);
    }
  }
}

run();
