interface ScenarioModel {
  title: string;
  description: string;
  image: string;
  responsibility: string;
  enabler: string;
  effects: string[];
}

const allScenarios: ScenarioModel[] = [];

export const Scenarios = () => {
  return (
    <>
      {allScenarios.map((scenario) => (
        <SingleScenario key={scenario.title} />
      ))}
    </>
  );
};

const SingleScenario = () => {
  return <div></div>;
};
