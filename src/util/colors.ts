import chroma from "chroma-js";

export const brighten = (hex: string) => chroma(hex).brighten(0.4).hex();
