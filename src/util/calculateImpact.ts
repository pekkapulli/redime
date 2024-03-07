import {
  Calculation,
  ConnectivityMethod,
  ContentType,
  DeviceType,
  EnergyAndCarbon,
  Site,
} from "../types";
import { multiplyCalculation } from "./calculationUtils";

const DEVICE_POWER: Record<DeviceType, number> = {
  Phone: 1,
  Tablet: 3,
  PC: 115,
  Laptop: 32,
};
const DATA_VOLUME_TEXT = 8000000; // in bytes TODO: what unit is this?
const DATA_VOLUME_VIDEO_PER_S_DEFAULT = 4000000; // in bits per second (fairly standard 720p rate)
const DATA_VOLUME_VIDEO_PER_S_SANOMA = 5312785; // in bits per second, measured from a Sanoma video
const DATA_VOLUME_VIDEO_PER_S_YLE = 3670450; // in bits per second, measured from an Yle video
const DATA_VOLUME_AUDIO_PER_S = 128000;
const DATA_VOLUME_VIDEO_OPTIMIZED_PER_S = 2000000; // TODO: Check rates
const E_ORIGIN_PER_REQUEST = 306;
const E_NETWORK_COEFF = 0.000045;
const WIFI_ENERGY_PER_S = 10;
const E_ACC_NET_3G = 4.55e-5;
// const E_ACC_NET_5G = WIFI_ENERGY_PER_S * 0.1; //claims that its 90% more efficient than WiFi;
const CARBON_COEFF = 0.11; // kg / kwh or g / wh, https://pxhopea2.stat.fi/sahkoiset_julkaisut/energia2022/html/suom0011.htm
const POWER_LIGHTBULB = 11;
const CAR_EMISSIONS = 0.20864;

const getEnergyAndCarbon = (energyInJoules: number): EnergyAndCarbon => {
  const totalEnergyConsumptionWh = energyInJoules / 3600;
  const carbonGrams = CARBON_COEFF * totalEnergyConsumptionWh;

  return {
    totalEnergyConsumptionWh,
    carbonGrams,
  };
};

const getDeviceEnergyConsumption = (
  deviceType: DeviceType,
  contentType?: ContentType
) => {
  if (contentType === "Video") {
    return DEVICE_POWER[deviceType] * 1.15;
  }
  return DEVICE_POWER[deviceType];
};

const getDataVolume = (
  contentType: ContentType,
  durationSecs: number,
  optimizeVideo: boolean,
  site: Site
) => {
  if (contentType === "Audio") {
    return durationSecs * DATA_VOLUME_AUDIO_PER_S;
  }
  if (contentType === "Video") {
    let bitRate = DATA_VOLUME_VIDEO_PER_S_DEFAULT;
    switch (site) {
      case "Areena":
      case "Yle":
        bitRate = DATA_VOLUME_VIDEO_PER_S_YLE;
        break;
      case "HS":
        bitRate = DATA_VOLUME_VIDEO_PER_S_SANOMA;
        break;
      default:
        break;
    }
    return (
      durationSecs *
      (optimizeVideo ? DATA_VOLUME_VIDEO_OPTIMIZED_PER_S : bitRate)
    );
  } else {
    return DATA_VOLUME_TEXT;
  }
};

const getDataTransferEnergyConsumption = (
  connectivityMethod: ConnectivityMethod,
  dataVolume: number,
  pageLoads: number,
  durationSecs: number
) => {
  if (connectivityMethod === "3G") {
    return E_ACC_NET_3G * dataVolume * pageLoads;
    // Let's add 4G/5G when calculations are ready:
    // } else if (connectivityMethod === "5G") {
    //   return E_ACC_NET_5G * durationSecs;
  } else {
    return WIFI_ENERGY_PER_S * durationSecs;
  }
};

export interface ComparisonValues {
  drivingMetersPetrolCar: number;
  lightBulbsDuration: number;
}

const calculateComparisonValues = (
  carbonGrams: number,
  eTotalJoule: number,
  durationSecs: number
): ComparisonValues => {
  // kg per km
  const drivingMetersPetrolCar = (carbonGrams / CAR_EMISSIONS) * 1000;

  const lightBulbsDuration = eTotalJoule / (POWER_LIGHTBULB * durationSecs);

  return {
    drivingMetersPetrolCar,
    lightBulbsDuration,
  };
};

const calculateServerEnergyConsumption = (
  dataVolume: number,
  pageLoads?: number
) => (E_ORIGIN_PER_REQUEST + 6.9e-6 * dataVolume) * (pageLoads ?? 1);

const calculateNetworkEnergyConsumption = (
  dataVolume: number,
  pageLoads?: number
) => E_NETWORK_COEFF * dataVolume * (pageLoads ?? 1);

/**
 * Impact of just a page load – no video content assumed on page load
 */

export interface PageLoadParams {
  deviceType: DeviceType;
  connectivityMethod: ConnectivityMethod;
  dataVolume: number;
  userAmount: number;
  site: Site;
}

export const calculatePageLoadImpact = (
  params: PageLoadParams
): Calculation => {
  const { deviceType, connectivityMethod, dataVolume, userAmount } = params;
  const deviceEnergyConsumption = getDeviceEnergyConsumption(deviceType);

  const durationInSeconds = 5; // an unbased assumption about page load time

  const serverEnergyConsumption = calculateServerEnergyConsumption(dataVolume);
  const networkEnergyConsumption =
    calculateNetworkEnergyConsumption(dataVolume);

  const dataTransferEnergyConsumption = getDataTransferEnergyConsumption(
    connectivityMethod,
    dataVolume,
    1,
    durationInSeconds
  );

  const energyOfUse = deviceEnergyConsumption * durationInSeconds;

  const eTotalJoule =
    serverEnergyConsumption +
    networkEnergyConsumption +
    dataTransferEnergyConsumption +
    energyOfUse;

  const totalEnergyAndCarbon = getEnergyAndCarbon(eTotalJoule);

  const comparisonValues = calculateComparisonValues(
    totalEnergyAndCarbon.carbonGrams,
    eTotalJoule,
    durationInSeconds
  );

  return multiplyCalculation(
    {
      total: getEnergyAndCarbon(eTotalJoule),
      comparisonValues,
      serverEnergyConsumption: getEnergyAndCarbon(serverEnergyConsumption),
      networkEnergyConsumption: getEnergyAndCarbon(networkEnergyConsumption),
      dataTransferEnergyConsumption: getEnergyAndCarbon(
        dataTransferEnergyConsumption
      ),
      energyOfUse: getEnergyAndCarbon(energyOfUse),
    },
    userAmount
  );
};

export interface PageUseParams {
  deviceType: DeviceType;
  contentType: ContentType;
  connectivityMethod: ConnectivityMethod;
  durationInSeconds: number;
  optimizeVideo: boolean;
  userAmount: number;
  site: Site;
}

export type CalculationParams = PageLoadParams | PageUseParams;

/**
 * Impact of the site after the page has been loaded
 */
export const calculatePageUseImpact = (params: PageUseParams): Calculation => {
  const {
    deviceType,
    connectivityMethod,
    contentType,
    durationInSeconds,
    optimizeVideo,
    userAmount,
    site,
  } = params;

  const deviceEnergyConsumption = getDeviceEnergyConsumption(
    deviceType,
    contentType
  );

  const dataVolume =
    contentType !== "Text"
      ? getDataVolume(contentType, durationInSeconds, optimizeVideo, site)
      : 0;

  // Use of text content assumes 0 loaded bytes
  const serverEnergyConsumption =
    contentType !== "Text" ? calculateServerEnergyConsumption(dataVolume) : 0;

  const networkEnergyConsumption =
    calculateNetworkEnergyConsumption(dataVolume);

  const dataTransferEnergyConsumption = getDataTransferEnergyConsumption(
    connectivityMethod,
    dataVolume,
    1,
    durationInSeconds
  );

  const energyOfUse = deviceEnergyConsumption * durationInSeconds;

  const eTotalJoule =
    serverEnergyConsumption +
    networkEnergyConsumption +
    dataTransferEnergyConsumption +
    energyOfUse;

  const totalEnergyAndCarbon = getEnergyAndCarbon(eTotalJoule);

  const comparisonValues = calculateComparisonValues(
    totalEnergyAndCarbon.carbonGrams,
    eTotalJoule,
    durationInSeconds
  );

  return multiplyCalculation(
    {
      total: getEnergyAndCarbon(eTotalJoule),
      comparisonValues,
      serverEnergyConsumption: getEnergyAndCarbon(serverEnergyConsumption),
      networkEnergyConsumption: getEnergyAndCarbon(networkEnergyConsumption),
      dataTransferEnergyConsumption: getEnergyAndCarbon(
        dataTransferEnergyConsumption
      ),
      energyOfUse: getEnergyAndCarbon(energyOfUse),
    },
    userAmount
  );
};
