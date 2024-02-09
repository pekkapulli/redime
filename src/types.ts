export const allDeviceTypes = ["Phone", "Tablet", "Laptop", "PC"] as const;
export type DeviceType = (typeof allDeviceTypes)[number];

export const allConnectivityMethods = ["3G", "WIFI"] as const;
export type ConnectivityMethod = (typeof allConnectivityMethods)[number];

export const allContentTypes = ["Video", "Text"] as const;
export type ContentType = (typeof allContentTypes)[number];

export interface Params {
  deviceType: DeviceType;
  connectivityMethod: ConnectivityMethod;
  contentType: ContentType;
}

// Results

export type EnergyAndCarbon = {
  kWhEnergy: number;
  carbon: number;
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
