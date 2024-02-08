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
