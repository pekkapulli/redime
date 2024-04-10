import {
  ArticleSimulationParams,
  Calculation,
  ComparisonValues,
  ConnectivityMethod,
  ContentType,
  DeviceType,
  EnergyAndCarbon,
  allConnectivityMethods,
} from "../types";
import { multiplyCalculation } from "./calculationUtils";

// export const DEVICE_POWER: Record<DeviceType, number> = {
//   Phone: 3,
//   Tablet: 7,
//   PC: 115,
//   Laptop: 32,
// };

// const E_ORIGIN_PER_REQUEST = 306;
// const E_NETWORK_COEFF = 0.000045;
const WIFI_ENERGY_PER_S = 10;
// const E_ACC_NET_3G = 4.55e-5; // Joules/byte
// const E_ACC_NET_5G = WIFI_ENERGY_PER_S * 0.1; //claims that its 90% more efficient than WiFi;
// const E_ACC_NET_4G = (0.117 * 3.6e6) / 1e9; // kWh/GB to Joules/byte for 4G
// const E_ACC_NET_5G = (0.501 * 3.6e6) / 1e9; // kWh/GB to Joules/byte for 5G

// const CARBON_COEFF = 0.11; // kg / kwh or g / wh, https://pxhopea2.stat.fi/sahkoiset_julkaisut/energia2022/html/suom0011.htm
const POWER_LIGHTBULB = 40; // Watts = j/s
const CAR_EMISSIONS = 0.20864; // kg/km

const getJPerByte = (kwhPerBG: number) => (kwhPerBG * 3.6e6) / 1e9;

const getEnergyAndCarbon = (
  energyInJoules: number,
  carbonCoeff: number
): EnergyAndCarbon => {
  const totalEnergyConsumptionWh = energyInJoules / 3600;
  const carbonGrams = carbonCoeff * totalEnergyConsumptionWh;

  return {
    totalEnergyConsumptionWh,
    carbonGrams,
  };
};

const getDeviceEnergyConsumption = (
  deviceType: DeviceType,
  articleSimulationParams: ArticleSimulationParams,
  contentType?: ContentType
) => {
  const useCoeff = contentType === "Video" ? 1.15 : 1;

  return (
    (deviceType === "Laptop"
      ? articleSimulationParams.devicePowerWLaptop
      : articleSimulationParams.devicePowerWPhone) * useCoeff
  );
};

const getPageUseDataVolume = (
  contentType: ContentType,
  durationSecs: number,
  optimizeVideo: boolean,
  articleSimulationParams: ArticleSimulationParams
) => {
  switch (contentType) {
    case "Audio":
      return (
        durationSecs * (articleSimulationParams.audioKiloBitsPerSecond * 125)
      );
    case "Video":
      return (
        durationSecs *
        (optimizeVideo
          ? articleSimulationParams.optimizedVideoMBitsPerSecond * 125000
          : articleSimulationParams.videoMBitsPerSecond * 125000)
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
    // case "3G":
    //   return E_ACC_NET_3G * dataVolume * pageLoads;
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

export const DATA_SHARE_MAP: {
  mobile: Record<ConnectivityMethod, number>;
  computer: Record<ConnectivityMethod, number>;
} = {
  mobile: {
    "4G": 0.4,
    "5G": 0.3,
    // "3G": 0,
    WIFI: 0.3,
  },
  computer: {
    "4G": 0.3,
    "5G": 0.1,
    // "3G": 0,
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
  articleSimulationParams: ArticleSimulationParams,
  pageLoads?: number
) =>
  (articleSimulationParams.eOriginPerRequest + 6.9e-6 * dataVolume) *
  (pageLoads ?? 1);

const calculateNetworkEnergyConsumption = (
  dataVolume: number,
  articleSimulationParams: ArticleSimulationParams,
  pageLoads?: number
) =>
  articleSimulationParams.networkCoeffJPerByte * dataVolume * (pageLoads ?? 1);

/**
 * Impact of just a page load – no video content assumed on page load
 */

export interface PageLoadParams {
  deviceType: DeviceType;
  dataVolume: number;
  userAmount: number;
}

export const calculatePageLoadImpact = (
  params: PageLoadParams,
  articleSimulationParams: ArticleSimulationParams
): Calculation => {
  const { deviceType, dataVolume, userAmount } = params;
  const deviceEnergyConsumption = getDeviceEnergyConsumption(
    deviceType,
    articleSimulationParams
  );

  const durationInSeconds = 5; // an unbased assumption about page load time

  const serverEnergyConsumption = calculateServerEnergyConsumption(
    dataVolume,
    articleSimulationParams
  );
  const networkEnergyConsumption = calculateNetworkEnergyConsumption(
    dataVolume,
    articleSimulationParams
  );

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

  const totalEnergyAndCarbon = getEnergyAndCarbon(
    eTotalJoule,
    articleSimulationParams.carbonCoeff
  );

  const comparisonValues = calculateComparisonValues(
    totalEnergyAndCarbon.carbonGrams,
    eTotalJoule
  );

  return multiplyCalculation(
    {
      total: getEnergyAndCarbon(
        eTotalJoule,
        articleSimulationParams.carbonCoeff
      ),
      comparisonValues,
      serverEnergyConsumption: getEnergyAndCarbon(
        serverEnergyConsumption,
        articleSimulationParams.carbonCoeff
      ),
      networkEnergyConsumption: getEnergyAndCarbon(
        networkEnergyConsumption,
        articleSimulationParams.carbonCoeff
      ),
      dataTransferEnergyConsumption: getEnergyAndCarbon(
        dataTransferEnergyConsumption,
        articleSimulationParams.carbonCoeff
      ),
      energyOfUse: getEnergyAndCarbon(
        energyOfUse,
        articleSimulationParams.carbonCoeff
      ),
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
    articleSimulationParams,
    contentType
  );

  const dataVolume = getPageUseDataVolume(
    contentType,
    durationInSeconds,
    optimizeVideo,
    articleSimulationParams
  );
  // Use of text content assumes 0 loaded bytes
  const serverEnergyConsumption =
    contentType !== "Text"
      ? calculateServerEnergyConsumption(dataVolume, articleSimulationParams)
      : 0;

  const networkEnergyConsumption = calculateNetworkEnergyConsumption(
    dataVolume,
    articleSimulationParams
  );

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

  const totalEnergyAndCarbon = getEnergyAndCarbon(
    eTotalJoule,
    articleSimulationParams.carbonCoeff
  );

  const comparisonValues = calculateComparisonValues(
    totalEnergyAndCarbon.carbonGrams,
    eTotalJoule
  );

  return multiplyCalculation(
    {
      total: getEnergyAndCarbon(
        eTotalJoule,
        articleSimulationParams.carbonCoeff
      ),
      comparisonValues,
      serverEnergyConsumption: getEnergyAndCarbon(
        serverEnergyConsumption,
        articleSimulationParams.carbonCoeff
      ),
      networkEnergyConsumption: getEnergyAndCarbon(
        networkEnergyConsumption,
        articleSimulationParams.carbonCoeff
      ),
      dataTransferEnergyConsumption: getEnergyAndCarbon(
        dataTransferEnergyConsumption,
        articleSimulationParams.carbonCoeff
      ),
      energyOfUse: getEnergyAndCarbon(
        energyOfUse,
        articleSimulationParams.carbonCoeff
      ),
    },
    userAmount
  );
};
