import { DefectType, Severity } from "./types";

export const DEFECT_DESCRIPTIONS: Record<string, string> = {
  [DefectType.SURFACE_CRACK_PAINT]: "Superficial fissures in the outer coating, typically not structural but requires monitoring.",
  [DefectType.LEADING_EDGE_EROSION_PAINT]: "Wear on the leading edge affecting only the protective paint layer.",
  [DefectType.LEADING_EDGE_EROSION_LAMINATE]: "Severe erosion penetrating the paint and damaging the underlying laminate structure.",
  [DefectType.LAMINATE_CRACK]: "Structural cracking within the fiberglass laminate layers.",
  [DefectType.LIGHTNING_DEFECT_LAMINATE]: "Thermal and physical damage to laminate caused by lightning strikes.",
  [DefectType.LIGHTNING_DEFECT_TIP]: "Explosive damage or delamination at the blade tip due to lightning exit.",
  [DefectType.LAMINATE_DEFECT_CORE]: "Deep structural failure penetrating to the core material.",
  [DefectType.SURFACE_EROSION]: "General surface roughening due to environmental factors.",
  [DefectType.DUST_ACCUMULATION]: "Buildup of particulate matter affecting aerodynamics.",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  [Severity.LOW]: "bg-blue-100 text-blue-800 border-blue-200",
  [Severity.MEDIUM]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [Severity.HIGH]: "bg-orange-100 text-orange-800 border-orange-200",
  [Severity.CRITICAL]: "bg-red-100 text-red-800 border-red-200",
  [Severity.NONE]: "bg-green-100 text-green-800 border-green-200",
};

export const SEVERITY_BORDER_COLORS: Record<Severity, string> = {
  [Severity.LOW]: "border-blue-500",
  [Severity.MEDIUM]: "border-yellow-500",
  [Severity.HIGH]: "border-orange-500",
  [Severity.CRITICAL]: "border-red-600",
  [Severity.NONE]: "border-green-500",
};

export const SEVERITY_BG_COLORS: Record<Severity, string> = {
  [Severity.LOW]: "bg-blue-500/20",
  [Severity.MEDIUM]: "bg-yellow-500/20",
  [Severity.HIGH]: "bg-orange-500/20",
  [Severity.CRITICAL]: "bg-red-600/20",
  [Severity.NONE]: "bg-green-500/10",
};

export const SEVERITY_LABEL_COLORS: Record<Severity, string> = {
  [Severity.LOW]: "bg-blue-500 text-white",
  [Severity.MEDIUM]: "bg-yellow-500 text-white",
  [Severity.HIGH]: "bg-orange-500 text-white",
  [Severity.CRITICAL]: "bg-red-600 text-white",
  [Severity.NONE]: "bg-green-500 text-white",
};