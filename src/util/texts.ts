import { Calculation, ContentType } from "../types";

export const getStreamedContentDescription = (contentType: ContentType) =>
  contentType.toLocaleLowerCase("fi-FI");

export const getLabel = (type: keyof Calculation) => {
  switch (type) {
    case "energyOfUse":
      return "Device use";
    case "networkEnergyConsumption":
      return "Network";
    case "serverEnergyConsumption":
      return "Server";
    case "dataTransferEnergyConsumption":
      return "Data transfer";
    case "comparisonValues":
      return "Comparison values";
    case "total":
      return "Total";
  }
};
