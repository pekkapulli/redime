import {
  ArticleSimulationParams,
  Calculation,
  ComparisonValues,
  ConnectivityMethod,
  ContentType,
  DeviceType,
  EnergyAndCarbon,
  Site,
  allConnectivityMethods,
} from "../types";
import { multiplyCalculation } from "./calculationUtils";

const DEVICE_POWER: Record<DeviceType, number> = {
  Phone: 1,
  Tablet: 3,
  PC: 115,
  Laptop: 32,
};
// const DATA_VOLUME_TEXT = 8000000; // in bytes
const DATA_VOLUME_VIDEO_PER_S_DEFAULT = 4000000 / 8; // in bytes per second (fairly standard 720p rate)
// const DATA_VOLUME_VIDEO_PER_S_SANOMA = 5312785 / 8; // in bytes per second, measured from a Sanoma video
// const DATA_VOLUME_VIDEO_PER_S_YLE = 3670450 / 8; // in bytes per second, measured from an Yle video
const DATA_VOLUME_AUDIO_PER_S = 128000 / 8; // in bytes per second, fairly standard podcast definition
const DATA_VOLUME_VIDEO_OPTIMIZED_PER_S = 1100000 / 8; // https://support.google.com/youtube/answer/1722171?hl=en#zippy=%2Cvideo-codec-h%2Cbitrate
const E_ORIGIN_PER_REQUEST = 306;
const E_NETWORK_COEFF = 0.000045;
const WIFI_ENERGY_PER_S = 10;
const E_ACC_NET_3G = 4.55e-5; // Joules/byte
// const E_ACC_NET_5G = WIFI_ENERGY_PER_S * 0.1; //claims that its 90% more efficient than WiFi;
// const E_ACC_NET_4G = (0.117 * 3.6e6) / 1e9; // kWh/GB to Joules/byte for 4G
// const E_ACC_NET_5G = (0.501 * 3.6e6) / 1e9; // kWh/GB to Joules/byte for 5G

const CARBON_COEFF = 0.11; // kg / kwh or g / wh, https://pxhopea2.stat.fi/sahkoiset_julkaisut/energia2022/html/suom0011.htm
const POWER_LIGHTBULB = 40; // Watts = j/s
const CAR_EMISSIONS = 0.20864; // kg/km

const getJPerByte = (kwhPerBG: number) => (kwhPerBG * 3.6e6) / 1e9;

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

const getPageUseDataVolume = (
  contentType: ContentType,
  durationSecs: number,
  optimizeVideo: boolean
) => {
  switch (contentType) {
    case "Audio":
      return durationSecs * DATA_VOLUME_AUDIO_PER_S;
    case "Video":
      return (
        durationSecs *
        (optimizeVideo
          ? DATA_VOLUME_VIDEO_OPTIMIZED_PER_S
          : DATA_VOLUME_VIDEO_PER_S_DEFAULT)
      );
    case "Text":
    default:
      return 0;
  }
};

const getDataTransferEnergyConsumption = (
  connectivityMethod: ConnectivityMethod,
  dataVolume: number, // Adjusted to be consistent with byte calculations
  pageLoads: number,
  durationSecs: number,
  articleSimulationParams: ArticleSimulationParams
) => {
  switch (connectivityMethod) {
    case "3G":
      return E_ACC_NET_3G * dataVolume * pageLoads;
    case "4G":
      return (
        getJPerByte(articleSimulationParams.kwhPerGB_4G) *
        dataVolume *
        pageLoads
      ); // Using 4G consumption rate
    case "5G":
      return (
        getJPerByte(articleSimulationParams.kwhPerGB_5G) *
        dataVolume *
        pageLoads
      ); // Using 5G consumption rate
    case "WIFI":
      return WIFI_ENERGY_PER_S * durationSecs;
    default:
      return 0;
  }
};

const DATA_SHARE_MAP: {
  mobile: Record<ConnectivityMethod, number>;
  computer: Record<ConnectivityMethod, number>;
} = {
  mobile: {
    "4G": 0.4,
    "5G": 0.3,
    "3G": 0,
    WIFI: 0.3,
  },
  computer: {
    "4G": 0.3,
    "5G": 0.1,
    "3G": 0,
    WIFI: 0.6,
  },
};

const formulateDataTransferEnergyConsumptionSum = (
  deviceType: DeviceType,
  dataVolume: number,
  pageLoads: number,
  durationInSeconds: number,
  articleSimulationParams: ArticleSimulationParams
) => {
  const device = deviceType === "Phone" ? "mobile" : "computer";

  return allConnectivityMethods.reduce(
    (result, method) =>
      result +
      getDataTransferEnergyConsumption(
        method,
        dataVolume,
        pageLoads,
        durationInSeconds,
        articleSimulationParams
      ) *
        DATA_SHARE_MAP[device][method],
    0
  );
};

const calculateComparisonValues = (
  carbonGrams: number,
  eTotalJoule: number
): ComparisonValues => {
  const drivingKMPetrolCar = carbonGrams / 1000 / CAR_EMISSIONS;
  const lightBulbDurationSeconds = eTotalJoule / POWER_LIGHTBULB; // j  / j/s = s

  return {
    drivingKMPetrolCar,
    lightBulbDurationSeconds,
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
  dataVolume: number;
  userAmount: number;
  site: Site;
}

export const calculatePageLoadImpact = (
  params: PageLoadParams,
  articleSimulationParams: ArticleSimulationParams
): Calculation => {
  const { deviceType, dataVolume, userAmount } = params;
  const deviceEnergyConsumption = getDeviceEnergyConsumption(deviceType);

  const durationInSeconds = 5; // an unbased assumption about page load time

  const serverEnergyConsumption = calculateServerEnergyConsumption(dataVolume);
  const networkEnergyConsumption =
    calculateNetworkEnergyConsumption(dataVolume);

  const dataTransferEnergyConsumption =
    formulateDataTransferEnergyConsumptionSum(
      deviceType,
      dataVolume,
      1,
      durationInSeconds,
      articleSimulationParams
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
    eTotalJoule
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
  durationInSeconds: number;
  optimizeVideo: boolean;
  userAmount: number;
  site: Site;
}

export type CalculationParams = PageLoadParams | PageUseParams;

/**
 * Impact of the site after the page has been loaded
 */
export const calculatePageUseImpact = (
  params: PageUseParams,
  articleSimulationParams: ArticleSimulationParams
): Calculation => {
  const {
    deviceType,
    contentType,
    durationInSeconds,
    optimizeVideo,
    userAmount,
  } = params;

  const deviceEnergyConsumption = getDeviceEnergyConsumption(
    deviceType,
    contentType
  );

  const dataVolume = getPageUseDataVolume(
    contentType,
    durationInSeconds,
    optimizeVideo
  );
  // Use of text content assumes 0 loaded bytes
  const serverEnergyConsumption =
    contentType !== "Text" ? calculateServerEnergyConsumption(dataVolume) : 0;

  const networkEnergyConsumption =
    calculateNetworkEnergyConsumption(dataVolume);

  const dataTransferEnergyConsumption =
    formulateDataTransferEnergyConsumptionSum(
      deviceType,
      dataVolume,
      1,
      durationInSeconds,
      articleSimulationParams
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
    eTotalJoule
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
