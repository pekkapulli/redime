import { ConnectivityMethod, ContentType, DeviceType } from "../types";

const DEVICE_POWER: Record<DeviceType, number> = {
  Phone: 1,
  Tablet: 3,
  PC: 115,
  Laptop: 32,
};
const DATA_VOLUME_TEXT = 8000000; // in bytes
const DATA_VOLUME_VIDEO = 1100000; // in bytes per second
const E_ORIGIN_PER_REQUEST = 306;
const E_NETWORK_COEFF = 0.000045;
const WIFI_ENERGY_PER_S = 10;
const E_ACC_NET_3G = 4.55e-5;
const E_ACC_NET_5G = WIFI_ENERGY_PER_S * 0.1; //claims that its 90% more efficient than WiFi;
const CARBON_COEFF = 0.525;
const POWER_LIGHTBULB = 11;
const CAR_EMISSIONS = 0.20864;

const getPDevice = (deviceType: DeviceType, contentType: ContentType) => {
  if (contentType === "Video") {
    return DEVICE_POWER[deviceType] * 1.15;
  }
  return DEVICE_POWER[deviceType];
};

const getDataVolume = (contentType: ContentType, durationSecs: number) => {
  if (contentType === "Video") {
    return durationSecs * DATA_VOLUME_VIDEO;
  } else {
    return DATA_VOLUME_TEXT;
  }
};

const getEAccNet = (
  connectivityMethod: ConnectivityMethod,
  dataVolume: number,
  pageLoads: number,
  durationSecs: number
) => {
  if (connectivityMethod === "3G") {
    return E_ACC_NET_3G * dataVolume * pageLoads;
  } else if (connectivityMethod === "5G") {
    return E_ACC_NET_5G * durationSecs;
  } else {
    return WIFI_ENERGY_PER_S * durationSecs;
  }
};

const calculateComparisonValues = (
  carbon: number,
  eTotalJoule: number,
  durationSecs: number
) => {
  // kg per km
  const drivingMetersPetrolCar = (carbon / CAR_EMISSIONS) * 1000;

  const lightBulbsDuration = eTotalJoule / (POWER_LIGHTBULB * durationSecs);

  return {
    drivingMetersPetrolCar,
    lightBulbsDuration,
  };
};

export const calculateImpact = (
  deviceType: DeviceType,
  contentType: ContentType,
  connectivityMethod: ConnectivityMethod,
  durationInSeconds: number // in seconds
) => {
  const durationInMinutes = durationInSeconds / 60;
  const pDevice = getPDevice(deviceType, contentType);
  const pageLoads = contentType === "Video" ? 1 : durationInMinutes;

  const dataVolume = getDataVolume(contentType, durationInSeconds);

  const eServ = (E_ORIGIN_PER_REQUEST + 6.9e-6 * dataVolume) * pageLoads;
  const eNetwork = E_NETWORK_COEFF * dataVolume * pageLoads;

  const eAccNet = getEAccNet(
    connectivityMethod,
    dataVolume,
    pageLoads,
    durationInSeconds
  );

  const eUser = pDevice * durationInSeconds;
  const eTotalJoule = eServ + eNetwork + eAccNet + eUser;

  const eTotalWh = eTotalJoule / 3600;
  const carbon = CARBON_COEFF * eTotalWh;

  const comparisonValues = calculateComparisonValues(
    carbon,
    eTotalJoule,
    durationInSeconds
  );

  return { eTotalWh, carbon, comparisonValues };
};
