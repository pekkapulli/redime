import { Omit } from "lodash";

export const allDeviceTypes = ["Phone", "Laptop"] as const;
export type DeviceType = (typeof allDeviceTypes)[number];

export const allConnectivityMethods = ["4G", "5G", "WIFI"] as const;
export type ConnectivityMethod = (typeof allConnectivityMethods)[number];

export const allContentTypes = ["Text", "Video", "Audio"] as const;
export type ContentType = (typeof allContentTypes)[number];

export interface Params {
  deviceType: DeviceType;
  connectivityMethod: ConnectivityMethod;
  contentType: ContentType;
}

export interface ArticleSimulationParams {
  contentType: ContentType;
  streamContentLengthInMinutes: number;
  optimizeVideo: boolean;
  autoplay: boolean;
  textAlt: boolean;
  percentageOfUsersPlayingStreamContent: number;
  percentageOfMobileUsers: number;
  users: number;

  kwhPerGB_4G: number;
  kwhPerGB_5G: number;
  initialVolumeInMB: number;
  networkCoeffJPerByte: number;
  videoMBitsPerSecond: number;
  optimizedVideoMBitsPerSecond: number;
  audioKiloBitsPerSecond: number;
  carbonCoeff: number; // kg co2e / kWh
  eOriginPerRequest: number; // joules of energy per request
  devicePowerWPhone: number; // W
  devicePowerWLaptop: number; // W
}

// Results

export type EnergyAndCarbon = {
  totalEnergyConsumptionWh: number;
  carbonGrams: number;
};

export interface Calculation {
  total: EnergyAndCarbon;
  comparisonValues: ComparisonValues;
  serverEnergyConsumption: EnergyAndCarbon;
  networkEnergyConsumption: EnergyAndCarbon;
  dataTransferEnergyConsumption: EnergyAndCarbon;
  energyOfUse: EnergyAndCarbon;
}

export type CalculationParts = Omit<Calculation, "comparisonValues">;

export interface ComparisonValues {
  drivingKMPetrolCar: number;
  lightBulbDurationSeconds: number;
}
