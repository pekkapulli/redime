export const allDeviceTypes = ["Phone", "Tablet", "Laptop", "PC"] as const;
export type DeviceType = (typeof allDeviceTypes)[number];

export const allConnectivityMethods = ["3G", "WIFI"] as const;
export type ConnectivityMethod = (typeof allConnectivityMethods)[number];

export const allContentTypes = ["Text", "Video", "Audio"] as const;
export type ContentType = (typeof allContentTypes)[number];

export const allSites = ["HS", "Yle", "Areena"] as const;
export type Site = (typeof allSites)[number];

export interface Params {
  deviceType: DeviceType;
  connectivityMethod: ConnectivityMethod;
  contentType: ContentType;
}

export interface ArticleSimulationParams {
  site: Site;
  articleType: ContentType;
  videoLengthInMinutes: number;
  optimizeVideo: boolean;
  autoplay: boolean;
  textAlt: boolean;
  percentageOfUsersPlayingStreamContent: number;
  percentageOfMobileUsers: number;
  users: number;
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

export interface ComparisonValues {
  drivingMetersPetrolCar: number;
  lightBulbsDuration: number;
}
