import { ConnectivityMethod, ContentType, DeviceType } from "../types";

const DEVICE_POWER: Record<DeviceType, number> = {
  phone: 1,
  tablet: 3,
  pc: 115,
  laptop: 32,
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
  if (contentType === "video") {
    return DEVICE_POWER[deviceType] * 1.15;
  }
  return DEVICE_POWER[deviceType];
};

const getDataVolume = (contentType: ContentType, durationSecs: number) => {
  if (contentType === "video") {
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

export const calculateImpact = (
  deviceType: DeviceType,
  contentType: ContentType,
  connectivityMethod: ConnectivityMethod,
  duration: number // in minutes
) => {
  const durationSecs = duration * 60;
  const pDevice = getPDevice(deviceType, contentType);
  const pageLoads = contentType === "video" ? 1 : duration;

  const dataVolume = getDataVolume(contentType, durationSecs);

  const eServ = (E_ORIGIN_PER_REQUEST + 6.9e-6 * dataVolume) * pageLoads;
  const eNetwork = E_NETWORK_COEFF * dataVolume * pageLoads;

  const eAccNet = getEAccNet(
    connectivityMethod,
    dataVolume,
    pageLoads,
    durationSecs
  );

  const eUser = pDevice * durationSecs;
  const eTotalJoule = eServ + eNetwork + eAccNet + eUser;

  const eTotalWh = eTotalJoule / 3600;
  const carbon = CARBON_COEFF * eTotalWh;
  const drivingMetersPetrolCar = (carbon / CAR_EMISSIONS) * 1000;
  const lightBulbsDuration = eTotalJoule / (POWER_LIGHTBULB * durationSecs);

  return [eTotalWh, carbon, drivingMetersPetrolCar, lightBulbsDuration];
};
