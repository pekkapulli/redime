import { createContext } from "react";
import { Params } from "../types";

interface ParamsContextShape {
  params: Params;
  updateParams: (newParams: Partial<Params>) => void;
}

export const ParamsContext = createContext<ParamsContextShape>({
  params: {
    connectivityMethod: "WIFI",
    deviceType: "Phone",
    contentType: "Text",
  },
  updateParams: (newParams) => {
    newParams;
  },
});
