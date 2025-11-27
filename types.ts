export enum DefectType {
  SURFACE_CRACK_PAINT = "Surface Crack (Paint/Gelcoat)",
  LEADING_EDGE_EROSION_PAINT = "Leading Edge Erosion (Paint/Gelcoat)",
  LEADING_EDGE_EROSION_LAMINATE = "Leading Edge Erosion (Laminate)",
  LAMINATE_CRACK = "Laminate Crack",
  LIGHTNING_DEFECT_LAMINATE = "Lightning Defect (Laminate Level)",
  LIGHTNING_DEFECT_TIP = "Lightning Defect (Tip Opened)",
  LAMINATE_DEFECT_CORE = "Laminate Defect (Till Core/Through Laminate)",
  SURFACE_EROSION = "Surface Level Erosion",
  DUST_ACCUMULATION = "Dust Accumulation",
  NORMAL = "No Defects Detected"
}

export enum Severity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
  NONE = "None"
}

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedDefect {
  type: DefectType | string;
  severity: Severity;
  confidence: number;
  location: string;
  description: string;
  recommendation: string;
  boundingBox?: BoundingBox;
}

export interface InspectionResult {
  hasDefects: boolean;
  bladeConditionScore: number; // 0-100
  defects: DetectedDefect[];
  summary: string;
  timestamp: string;
}

export interface FileData {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}