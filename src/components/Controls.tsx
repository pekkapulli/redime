import Select from "react-select";
import {
  ConnectivityMethod,
  ContentType,
  DeviceType,
  Params,
  allConnectivityMethods,
  allContentTypes,
  allDeviceTypes,
} from "../types";
import { Selector, SelectorLabel } from "./common-components";

interface ControlsProps {
  params: Params;
  updateParams: (newParams: Partial<Params>) => void;
}

const getOption = <T,>(option: T) => ({
  label: option,
  value: option,
});

const Controls = ({ params, updateParams }: ControlsProps) => {
  return (
    <div>
      <Selector>
        <SelectorLabel>Device</SelectorLabel>
        <Select
          options={allDeviceTypes.map(getOption<DeviceType>)}
          onChange={(newValue) =>
            newValue !== null && updateParams({ deviceType: newValue.value })
          }
          value={getOption(params.deviceType)}
        />
      </Selector>
      <Selector>
        <SelectorLabel>Connectivity</SelectorLabel>
        <Select
          options={allConnectivityMethods.map(getOption<ConnectivityMethod>)}
          onChange={(newValue) =>
            newValue !== null &&
            updateParams({ connectivityMethod: newValue.value })
          }
          value={getOption(params.connectivityMethod)}
        />
      </Selector>
      <Selector>
        <SelectorLabel>Content</SelectorLabel>
        <Select
          options={allContentTypes.map(getOption<ContentType>)}
          onChange={(newValue) =>
            newValue !== null && updateParams({ contentType: newValue.value })
          }
          value={getOption(params.contentType)}
        />
      </Selector>
    </div>
  );
};

export default Controls;
