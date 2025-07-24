/*
 * Die Scan Calculator CLI (TUI)
 * ---------------------------------
 * Calculates camera count, FOV, pixel size, focal length, and line rate for a line‑scan setup.
 * Assumptions & formulas come from previous engineering discussion.
 *
 * Features:
 *  - Interactive prompts (if no CLI args) using Enquirer
 *  - Pretty tables with cli-table3 and Chalk colors
 *  - Outputs JSON if --json flag is set
 *  - Bilingual support (English and Turkish)
 *
 * Usage:
 *  1) npm init -y
 *  2) npm i ts-node typescript chalk@5 enquirer cli-table3 boxen figlet yargs
 *  3) npx ts-node die-scan-calculator-cli.ts  (interactive)
 *     or provide flags, e.g.:
 *     npx ts-node die-scan-calculator-cli.ts \
 *       --width-mm 1200 --length-mm 1200 --dpi 250 \
 *       --sensor-px 8192 --pixel-pitch-um 7 \
 *       --wd-mm 600 --speed-mm-s 200 --overlap 0.12 \
 *       --cameras 2
 *
 *  Press "q" at any prompt to exit.
 */

import chalk from "chalk";
import enquirer from "enquirer";
import Table from "cli-table3";
import boxen from "boxen";
import figlet from "figlet";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { loc } from "./localization.js";

// -------------------- Types --------------------
interface Inputs {
  widthMm: number; // object width to cover (mm)
  lengthMm: number; // scan length direction (mm)
  dpi: number; // target sampling dpi on object
  sensorPx: number; // camera sensor pixels across width
  pixelPitchUm: number; // sensor pixel pitch (µm)
  wdMm: number; // working distance (mm)
  speedMmS: number; // traverse speed (mm/s)
  overlap: number; // overlap fraction total (e.g. 0.12 for 12%)
  cameras: number; // planned number of cameras across width
  json: boolean; // output JSON only
}

interface Results {
  pixelSizeObjMm: number;
  eqDpi: number;
  pxNeededAcross: number;
  pxNeededWithMargin: number;
  usablePxPerCam: number;
  camsRequired: number;
  fovPerCamMm: number;
  sensorLengthMm: number;
  magnification: number;
  focalLengthMm: number;
  linePitchMm: number;
  linesNeeded: number;
  lineRateHz: number;
}

// -------------------- Helpers --------------------
const mmPerInch = 25.4;

function calc(inputs: Inputs): Results {
  const {
    widthMm,
    lengthMm,
    dpi,
    sensorPx,
    pixelPitchUm,
    wdMm,
    speedMmS,
    overlap,
    cameras,
  } = inputs;

  // pixel size on object from desired dpi
  const pixelSizeObjMm = mmPerInch / dpi; // mm/px

  // pixels needed across whole width
  const pxNeededAcross = widthMm / pixelSizeObjMm;
  const pxNeededWithMargin = pxNeededAcross * (1 + overlap);

  // how many cameras? If user specified 'cameras', compute effective.
  // Each camera covers sensorPx pixels, but we need overlap between neighbor cams.
  // For N cameras, total usable width (in pixels) = sensorPx * N * (1 - overlap)
  // (Assuming symmetric overlap distribution; simple approximation.)
  const camsRequired = Math.ceil(
    pxNeededWithMargin / (sensorPx * (1 - overlap)),
  );

  const camsUsed = cameras || camsRequired;
  const usablePxPerCam = sensorPx; // keep simple; overlap handled above

  // FOV per camera on object (mm)
  const fovPerCamMm = (widthMm * (1 + overlap)) / camsUsed;

  // Sensor length (mm)
  const sensorLengthMm = sensorPx * (pixelPitchUm / 1000);

  // magnification M = sensorLength / FOV
  const magnification = sensorLengthMm / fovPerCamMm;

  // Thin lens approx: f = (M * WD) / (1 + M)
  const focalLengthMm = (magnification * wdMm) / (1 + magnification);

  // Along travel direction, set line pitch = pixelSizeObjMm
  const linePitchMm = pixelSizeObjMm;
  const linesNeeded = lengthMm / linePitchMm;
  const lineRateHz = speedMmS / linePitchMm; // lines/sec

  const eqDpi = mmPerInch / pixelSizeObjMm;

  return {
    pixelSizeObjMm,
    eqDpi,
    pxNeededAcross,
    pxNeededWithMargin,
    usablePxPerCam,
    camsRequired,
    fovPerCamMm,
    sensorLengthMm,
    magnification,
    focalLengthMm,
    linePitchMm,
    linesNeeded,
    lineRateHz,
  };
}

function banner(lang: "en" | "tr") {
  const text = figlet.textSync(loc[lang].banner, {
    horizontalLayout: "fitted",
  });
  return boxen(chalk.cyan(text), {
    padding: 1,
    borderColor: "cyan",
    dimBorder: true,
  });
}

function prettyTable(inputs: Inputs, res: Results, lang: "en" | "tr"): string {
  const t = loc[lang];
  const t1 = new Table({
    head: [
      chalk.bold(t.tables.parameter),
      chalk.bold(t.tables.value),
      chalk.bold(t.tables.units),
    ],
    colWidths: [35, 15, 10],
    style: { head: ["green"], border: ["grey"] },
  });

  t1.push(
    [t.inputsTable.width, inputs.widthMm.toFixed(1), "mm"],
    [t.inputsTable.length, inputs.lengthMm.toFixed(1), "mm"],
    [t.inputsTable.dpi, inputs.dpi.toFixed(1), "dpi"],
    [t.inputsTable.sensorPx, inputs.sensorPx, "px"],
    [t.inputsTable.pixelPitch, inputs.pixelPitchUm.toFixed(2), "µm"],
    [t.inputsTable.wd, inputs.wdMm.toFixed(1), "mm"],
    [t.inputsTable.speed, inputs.speedMmS.toFixed(1), "mm/s"],
    [t.inputsTable.overlap, (inputs.overlap * 100).toFixed(1), "%"],
    [t.inputsTable.plannedCams, inputs.cameras || res.camsRequired, "pcs"],
  );

  const t2 = new Table({
    head: [
      chalk.bold(t.tables.metric),
      chalk.bold(t.tables.value),
      chalk.bold(t.tables.units),
      chalk.bold(t.tables.notes),
    ],
    colWidths: [35, 15, 15, 70],
    style: { head: ["magenta"], border: ["grey"] },
  });

  t2.push(
    [
      t.outputsTable.pixelSize,
      res.pixelSizeObjMm.toFixed(4),
      "mm/px",
      t.tips.pixelSize,
    ],
    [t.outputsTable.eqDpi, res.eqDpi.toFixed(1), "dpi", t.tips.eqDpi],
    [
      t.outputsTable.pxNeeded,
      res.pxNeededAcross.toFixed(0),
      "px",
      t.tips.pxNeeded,
    ],
    [
      t.outputsTable.pxNeededMargin,
      res.pxNeededWithMargin.toFixed(0),
      "px",
      t.tips.pxNeededMargin,
    ],
    [t.outputsTable.camsRequired, res.camsRequired, "pcs", t.tips.camsRequired],
    [
      t.outputsTable.fovPerCam,
      res.fovPerCamMm.toFixed(1),
      "mm",
      t.tips.fovPerCam,
    ],
    [
      t.outputsTable.sensorLength,
      res.sensorLengthMm.toFixed(3),
      "mm",
      t.tips.sensorLength,
    ],
    [
      t.outputsTable.magnification,
      res.magnification.toFixed(4),
      "—",
      t.tips.magnification,
    ],
    [
      t.outputsTable.focalLength,
      res.focalLengthMm.toFixed(1),
      "mm",
      t.tips.focalLength,
    ],
    [
      t.outputsTable.linePitch,
      res.linePitchMm.toFixed(3),
      "mm/line",
      t.tips.linePitch,
    ],
    [
      t.outputsTable.linesNeeded,
      res.linesNeeded.toFixed(0),
      "lines",
      t.tips.linesNeeded,
    ],
    [t.outputsTable.lineRate, res.lineRateHz.toFixed(2), "Hz", t.tips.lineRate],
  );

  return (
    chalk.bold.cyan(`\n${t.tables.inputsHeader}`) +
    "\n" +
    t1.toString() +
    "\n" +
    chalk.bold.magenta(t.tables.outputsHeader) +
    "\n" +
    t2.toString()
  );
}

// -------------------- CLI --------------------

async function main() {
  const noFlags = process.argv.slice(2).length === 0;
  let lang: "en" | "tr" = "en";

  if (noFlags) {
    try {
      const langChoice: { lang: "English" | "Türkçe" } = await (
        enquirer as any
      ).prompt({
        type: "select",
        name: "lang",
        message: loc.en.misc.languagePrompt,
        choices: ["English", "Türkçe"],
      });
      lang = langChoice.lang === "English" ? "en" : "tr";
    } catch (e) {
      console.log(chalk.red.bold(loc.en.misc.cancelled));
      return;
    }
  }

  const t = loc[lang];

  const argv = yargs(hideBin(process.argv))
    .option("width-mm", { type: "number", default: 1200 })
    .option("length-mm", { type: "number", default: 1200 })
    .option("dpi", { type: "number", default: 250 })
    .option("sensor-px", { type: "number", default: 8192 })
    .option("pixel-pitch-um", { type: "number", default: 7 })
    .option("wd-mm", { type: "number", default: 600 })
    .option("speed-mm-s", { type: "number", default: 200 })
    .option("overlap", { type: "number", default: 0.12 })
    .option("cameras", { type: "number", default: 0 })
    .option("json", { type: "boolean", default: false })
    .help(false)
    .parseSync();

  let inputs: Inputs = {
    widthMm: argv["width-mm"],
    lengthMm: argv["length-mm"],
    dpi: argv.dpi,
    sensorPx: argv["sensor-px"],
    pixelPitchUm: argv["pixel-pitch-um"],
    wdMm: argv["wd-mm"],
    speedMmS: argv["speed-mm-s"],
    overlap: argv.overlap,
    cameras: argv.cameras,
    json: argv.json,
  };

  if (noFlags) {
    console.clear();
    console.log(banner(lang));
    try {
      const answers: any = await (enquirer as any).prompt([
        {
          type: "input",
          name: "widthMm",
          message: t.prompts.widthMm,
          initial: inputs.widthMm,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) || t.validation.positiveNumber,
        },
        {
          type: "input",
          name: "lengthMm",
          message: t.prompts.lengthMm,
          initial: inputs.lengthMm,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) || t.validation.positiveNumber,
        },
        {
          type: "input",
          name: "dpi",
          message: t.prompts.dpi,
          initial: inputs.dpi,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) || t.validation.positiveNumber,
        },
        {
          type: "input",
          name: "sensorPx",
          message: t.prompts.sensorPx,
          initial: inputs.sensorPx,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) ||
            t.validation.positiveInteger,
        },
        {
          type: "input",
          name: "pixelPitchUm",
          message: t.prompts.pixelPitchUm,
          initial: inputs.pixelPitchUm,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) || t.validation.positiveNumber,
        },
        {
          type: "input",
          name: "wdMm",
          message: t.prompts.wdMm,
          initial: inputs.wdMm,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) || t.validation.positiveNumber,
        },
        {
          type: "input",
          name: "speedMmS",
          message: t.prompts.speedMmS,
          initial: inputs.speedMmS,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) > 0) || t.validation.positiveNumber,
        },
        {
          type: "input",
          name: "overlap",
          message: t.prompts.overlap,
          initial: inputs.overlap,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) < 1) ||
            t.validation.fraction,
        },
        {
          type: "input",
          name: "cameras",
          message: t.prompts.cameras,
          initial: inputs.cameras,
          validate: (v: any) =>
            (!isNaN(Number(v)) && Number(v) >= 0) || t.validation.nonNegative,
        },
      ]);
      const numericAnswers = Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, Number(value)]),
      );
      inputs = { ...inputs, ...numericAnswers };
    } catch (e) {
      console.log(chalk.red.bold(`\n\n${t.misc.cancelled}`));
      return;
    }
  }

  const result = calc(inputs);

  if (inputs.json) {
    console.log(JSON.stringify({ inputs, result }, null, 2));
    return;
  }

  if (noFlags) console.clear();
  console.log(banner(lang));
  console.log(prettyTable(inputs, result, lang));
}

main().catch((e) => {
  if (e instanceof Error && e.message.includes("Cancelled")) {
    return;
  }
  console.error(chalk.red("\nError:"), e);
  process.exit(1);
});
