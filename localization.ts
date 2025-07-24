// harddie/localization.ts
import chalk from "chalk";

type LocaleStrings = {
  banner: string;
  prompts: {
    widthMm: string;
    lengthMm: string;
    dpi: string;
    sensorPx: string;
    pixelPitchUm: string;
    wdMm: string;
    speedMmS: string;
    overlap: string;
    cameras: string;
  };
  validation: {
    positiveNumber: string;
    positiveInteger: string;
    fraction: string;
    nonNegative: string;
  };
  tables: {
    inputsHeader: string;
    outputsHeader: string;
    parameter: string;
    value: string;
    units: string;
    metric: string;
    notes: string;
  };
  inputsTable: {
    width: string;
    length: string;
    dpi: string;
    sensorPx: string;
    pixelPitch: string;
    wd: string;
    speed: string;
    overlap: string;
    plannedCams: string;
  };
  outputsTable: {
    pixelSize: string;
    eqDpi: string;
    pxNeeded: string;
    pxNeededMargin: string;
    camsRequired: string;
    fovPerCam: string;
    sensorLength: string;
    magnification: string;
    focalLength: string;
    linePitch: string;
    linesNeeded: string;
    lineRate: string;
  };
  tips: {
    pixelSize: string;
    eqDpi: string;
    pxNeeded: string;
    pxNeededMargin: string;
    camsRequired: string;
    fovPerCam: string;
    sensorLength: string;
    magnification: string;
    focalLength: string;
    linePitch: string;
    linesNeeded: string;
    lineRate: string;
  };
  misc: {
    cancelled: string;
    languagePrompt: string;
  };
};

export const loc: { [key: string]: LocaleStrings } = {
  en: {
    banner: "Die Scan Calc",
    prompts: {
      widthMm: "Object width to cover (mm):",
      lengthMm: "Object length (scan direction) (mm):",
      dpi: "Target DPI on object:",
      sensorPx: "Sensor pixels (e.g., 4096, 8192):",
      pixelPitchUm: "Pixel pitch (µm):",
      wdMm: "Working distance WD (mm):",
      speedMmS: "Traverse speed (mm/s):",
      overlap: "Total overlap fraction (e.g. 0.12 = 12%):",
      cameras: "Number of cameras (0 = auto-calc):",
    },
    validation: {
      positiveNumber: "Enter a positive number",
      positiveInteger: "Enter a positive integer",
      fraction: "Enter 0–1",
      nonNegative: "Enter >= 0",
    },
    tables: {
      inputsHeader: "INPUTS",
      outputsHeader: "OUTPUTS",
      parameter: "Parameter",
      value: "Value",
      units: "Units",
      metric: "Metric",
      notes: "Notes/Tips",
    },
    inputsTable: {
        width: "Object width",
        length: "Object length (scan)",
        dpi: "Target DPI",
        sensorPx: "Sensor pixels",
        pixelPitch: "Pixel pitch",
        wd: "Working distance",
        speed: "Traverse speed",
        overlap: "Overlap (total)",
        plannedCams: "Planned cameras"
    },
    outputsTable: {
      pixelSize: "Pixel size on object",
      eqDpi: "Equivalent DPI",
      pxNeeded: "Pixels needed across",
      pxNeededMargin: "Pixels w/ margin",
      camsRequired: "Cameras required",
      fovPerCam: "FOV per camera",
      sensorLength: "Sensor length",
      magnification: "Magnification",
      focalLength: "Lens focal length",
      linePitch: "Line pitch",
      linesNeeded: "Lines needed (length)",
      lineRate: "Line rate needed",
    },
    tips: {
      pixelSize: "Defines the smallest feature you can resolve.",
      eqDpi: "Higher is better, but this is fixed by your choice of DPI.",
      pxNeeded: "Total required resolution for the object width.",
      pxNeededMargin: "Accounts for overlap, giving a safety margin.",
      camsRequired: "If this seems too high, consider wider-sensor cameras.",
      fovPerCam: "Check for lens distortion at edges.",
      sensorLength: "Physical size of the camera sensor array.",
      magnification: "Optical mag. < 0.1 or > 10 can be tricky.",
      focalLength: "Select a standard lens close to this value.",
      linePitch: "Distance object moves per scan line (set by DPI).",
      linesNeeded: "Total scan lines to cover the object length.",
      lineRate: `Select a camera with at least ${chalk.bold("2x")} this rate for margin.`,
    },
    misc: {
      cancelled: "Cancelled.",
      languagePrompt: "Select language / Dil seçin:",
    },
  },
  tr: {
    banner: "Yüzey Tarama Hesaplayıcı",
    prompts: {
      widthMm: "Taranacak nesne genişliği (mm):",
      lengthMm: "Nesne uzunluğu (tarama yönü) (mm):",
      dpi: "Nesne üzerindeki hedef DPI:",
      sensorPx: "Sensör pikseli (örn: 4096, 8192):",
      pixelPitchUm: "Piksel aralığı (µm):",
      wdMm: "Çalışma mesafesi (mm):",
      speedMmS: "Tarama hızı (mm/s):",
      overlap: "Toplam bindirme oranı (örn: 0.12 = %12):",
      cameras: "Kamera sayısı (0 = otomatik hesapla):",
    },
    validation: {
      positiveNumber: "Pozitif bir sayı girin",
      positiveInteger: "Pozitif bir tamsayı girin",
      fraction: "0–1 arası bir değer girin",
      nonNegative: ">= 0 girin",
    },
    tables: {
      inputsHeader: "GİRDİLER",
      outputsHeader: "ÇIKTILAR",
      parameter: "Parametre",
      value: "Değer",
      units: "Birim",
      metric: "Metrik",
      notes: "Notlar/İpuçları",
    },
    inputsTable: {
        width: "Nesne genişliği",
        length: "Nesne uzunluğu (tarama)",
        dpi: "Hedef DPI",
        sensorPx: "Sensör pikselleri",
        pixelPitch: "Piksel aralığı",
        wd: "Çalışma mesafesi",
        speed: "Tarama hızı",
        overlap: "Bindirme (toplam)",
        plannedCams: "Planlanan kamera sayısı"
    },
    outputsTable: {
      pixelSize: "Nesne üzerindeki piksel boyutu",
      eqDpi: "Eşdeğer DPI",
      pxNeeded: "Gereken piksel (genişlik)",
      pxNeededMargin: "Gereken piksel (marjlı)",
      camsRequired: "Gereken kamera sayısı",
      fovPerCam: "Kamera başına FOV",
      sensorLength: "Sensör uzunluğu",
      magnification: "Büyütme oranı",
      focalLength: "Lens odak uzaklığı",
      linePitch: "Satır aralığı",
      linesNeeded: "Gereken satır sayısı (uzunluk)",
      lineRate: "Gereken satır hızı",
    },
    tips: {
      pixelSize: "Çözebileceğiniz en küçük ayrıntıyı tanımlar.",
      eqDpi: "Daha yüksek daha iyidir, ancak bu DPI seçiminizle sabittir.",
      pxNeeded: "Nesne genişliği için gereken toplam çözünürlük.",
      pxNeededMargin: "Bindirmeyi hesaba katarak bir güvenlik payı sağlar.",
      camsRequired: "Bu sayı çok yüksekse, daha geniş sensörlü kameraları düşünün.",
      fovPerCam: "Kenarlarda lens bozulmasını kontrol edin.",
      sensorLength: "Kamera sensör dizisinin fiziksel boyutu.",
      magnification: "Optik büyütme. < 0.1 veya > 10 olması durumu zorlaştırabilir.",
      focalLength: "Bu değere yakın standart bir lens seçin.",
      linePitch: "Nesnenin taranan satır başına hareket ettiği mesafe (DPI ile ayarlanır).",
      linesNeeded: "Nesne uzunluğunu taramak için gereken toplam satır sayısı.",
      lineRate: `Güvenlik payı için bu oranın en az ${chalk.bold("2 katı")} hıza sahip bir kamera seçin.`,
    },
    misc: {
      cancelled: "İptal edildi.",
      languagePrompt: "Select language / Dil seçin:",
    },
  },
};
