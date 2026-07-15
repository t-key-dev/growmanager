#!/usr/bin/env node
// Direct downloads with verified URLs from Wikimedia Commons
import { execSync } from "child_process";
import { statSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "diagnosis");

const UA = "GrowManager-Personal-Use/1.0 (https://github.com/t-key-dev/growmanager)";

// Map: diagnosisId -> Wikimedia-URL (verified)
const urls = {
  "n-deficiency": "https://upload.wikimedia.org/wikipedia/commons/b/be/Cannabis_Nutrient_Deficiency.JPG",
  "p-deficiency": "https://upload.wikimedia.org/wikipedia/commons/4/47/Grape_leaf_showing_nutrient_deficiency.jpg",
  "k-deficiency": "https://upload.wikimedia.org/wikipedia/commons/7/75/PotasDed.jpg",
  "ca-deficiency": "https://upload.wikimedia.org/wikipedia/commons/8/88/Tomate_Blatt_Kalimangel.jpg", // Reuse for K - placeholder
  "mg-deficiency": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Maize_of_magnesium_deficiency%2C_symptoms_on_leaves.jpg",
  "s-deficiency": "https://upload.wikimedia.org/wikipedia/commons/b/be/Cannabis_Nutrient_Deficiency.JPG", // Reuse
  "fe-deficiency": "https://upload.wikimedia.org/wikipedia/commons/0/09/Chlorose_ferrique_sur_Citrus_aurantium.jpg",
  "zn-deficiency": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Zinc-deficient_maize_plants.jpg",
  "mn-deficiency": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Zinc-deficient_maize_plants.jpg", // Reuse
  "b-deficiency": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Banana_%28Musa_sp.%29-_Boron_deficiency_and_black_leaf_streak_disease.jpg",
  "cu-deficiency": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mo-def-cauliflower-whiptail.jpg", // Reuse
  "powdery-mildew": "https://upload.wikimedia.org/wikipedia/commons/8/87/Mold_under_a_digital_microscope_01.jpg", // placeholder
  "botrytis": "https://upload.wikimedia.org/wikipedia/commons/0/07/Gray_mold_%28Botrytis_cinerea%29_on_Rosa_sp-5573591.jpg",
  "root-rot": "https://upload.wikimedia.org/wikipedia/commons/8/87/Mold_under_a_digital_microscope_01.jpg", // placeholder
  "damping-off": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Pinus_taeda_seedling_damping_off.jpg",
  "septoria": "https://upload.wikimedia.org/wikipedia/commons/9/92/Tomato_septoria_leaf_spot_3026.jpg",
  "spider-mites": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Tetranychus_urticae_with_silk_threads.jpg",
  "aphids": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Black_Cherry_Aphid.jpg",
  "thrips": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Thysanoptera.jpg",
  "whiteflies": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Iris_leaf_underside_with_aphids_and_whiteflies_in_Dnipro_by_baby-bear.org_series_02.jpg",
  "mealybugs": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Wolllaus_mit_Wachsh%C3%BClle.jpg",
  "caterpillars": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Caterpillar_%28Id_%3F%29_glueing_a_leaf_to_fold_it_..._%2831612841997%29.jpg",
  "leaf-miners": "https://upload.wikimedia.org/wikipedia/commons/8/84/Liriomyza_brassicae_198178108.jpg",
  "fungus-gnats": "https://upload.wikimedia.org/wikipedia/commons/1/13/Photograph_of_a_adult_Leia_varia.jpg",
  "springtails": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Springtail_%28Collembola_Symphypleona%29_on_soil.jpg",
  "eagle-claws": "https://upload.wikimedia.org/wikipedia/commons/4/44/Cannabis_sativa_leaf.jpg",
  "overwatering": "https://upload.wikimedia.org/wikipedia/commons/1/17/Wet_soil.jpg",
  "leggy-seedling": "https://upload.wikimedia.org/wikipedia/commons/d/da/Tomato_seedlings.jpg",
  "rootbound": "https://upload.wikimedia.org/wikipedia/commons/9/94/Root-bound_Chlorophytum_comosum.jpg",
  "heat-stress": "https://upload.wikimedia.org/wikipedia/commons/3/39/Wolferstadt_Siegeslinde_015.jpg",
  "cold-stress": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Gurken_K%C3%A4lteschaden_bei_9%C2%B0C%2C_Josef_Schlaghecken.jpg",
  "high-humidity": "https://upload.wikimedia.org/wikipedia/commons/8/87/Mold_under_a_digital_microscope_01.jpg",
};

let ok = 0, fail = 0;
for (const [name, url] of Object.entries(urls)) {
  const outFile = join(OUT, name + ".jpg");
  if (existsSync(outFile) && statSync(outFile).size > 15000) {
    console.log(`⏭️  ${name}.jpg existiert`);
    continue;
  }
  try {
    execSync(`curl -sL -A "${UA}" -H "Accept: image/*" --max-time 30 -o "${outFile}" "${url}"`, { stdio: 'pipe' });
    const size = statSync(outFile).size;
    if (size < 5000) {
      unlinkSync(outFile);
      console.log(`❌ ${name} (${size}b)`);
      fail++;
    } else {
      console.log(`✅ ${name}.jpg (${(size/1024).toFixed(1)}KB)`);
      ok++;
    }
  } catch (e) {
    console.log(`❌ ${name}: ${e.message.split('\n')[0]}`);
    fail++;
  }
}
console.log(`\n📊 ${ok} OK, ${fail} failed`);
