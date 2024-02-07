// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import { useState } from "react";
import { Params } from "./types";
import Controls from "./components/Controls";
import Results from "./components/Results";

const App = () => {
  const [params, setParams] = useState<Params>({
    connectivityMethod: "WIFI",
    deviceType: "Phone",
    contentType: "Text",
  });

  const setParamsHelper = (newParams: Partial<Params>) => {
    setParams((oldParams) => ({
      ...oldParams,
      ...newParams,
    }));
  };

  return (
    <div>
      <Controls params={params} updateParams={setParamsHelper} />
      <Results params={params} />
    </div>
  );
};

export default App;
