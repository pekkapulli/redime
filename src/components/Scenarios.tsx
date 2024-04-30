import styled from "styled-components";
import { breakpoints, theme } from "../theme";
import { P } from "./common-components";

import s1 from "../assets/1.png";
import s2 from "../assets/2.png";
import s3 from "../assets/3.png";
import s4 from "../assets/4.png";
import s5 from "../assets/5.png";
import s6 from "../assets/6.png";

interface ScenarioModel {
  title: string;
  description: React.ReactNode;
  image: string;
  actor: string;
  enabler: string;
  effects: string[];
}

const allScenarios: ScenarioModel[] = [
  {
    title: "Green media service design",
    description:
      "Media services offer options that help consumers use their content sustainably. Methods for saving data and electricity include web site optimization, using lower video quality, reducing video autoplay, or creating a low-carbon mode, where all of these methods are in use.",
    image: s1,
    actor: "Consumer",
    enabler: "Media companies",
    effects: [
      "+ Educates consumers about environmental impact",
      "+ Impacts Scope 3 emissions, which are the most relevant emission source",
      "+ A modal shift that does not require using less content",
      "- Risk of no impact unless consumer makes the choice",
    ],
  },
  {
    title: "Sustainable distribution practices",
    description:
      "Media companies engineer their digital services in ways that take the environment into account every step of the way. Features using excessive data and energy, such as HD video on mobile, autoplay, and endless scrolling are removed or optimized without consumer choice. Ad views and ad distribution networks are optimized to be more sustainable.",
    image: s2,
    actor: "Media companies",
    enabler: "Stakeholder groups",
    effects: [
      "+ Impacts Scope 3 emissions, which are the most relevant emission source",
      "+ Changes visible to consumers are small",
      "+ Lessens addictive and attention-heavy media use",
      "- Time spent in media services could diminish",
      "- No clear advertiser benefit, or can be seen as a negative by advertisers",
      "- Needs to be accepted by all stakeholders",
    ],
  },
  {
    title: "Incentivicing journalists",
    description:
      "Journalists and content producers are incentivised and rewarded for environmentally conscious practices. They are rewarded for including environmental aspects to stories, using sustainable content formats, and making environmentally conscious choices when travelling for stories. The criteria may also be visible to consumers.",
    image: s3,
    actor: "Journalists",
    enabler: "Media companies",
    effects: [
      "+ Educates about environmental themes in the society",
      "+ More agency to journalists",
      "- Shifting responsibility to journalists",
      "- No direct impact on Scope 3 emissions",
      "+ Could still have an effect on consumer actions",
    ],
  },
  {
    title: "Raising Awareness",
    description:
      "Media companies try to raise consumer awareness about the impact of digital media by making it visible in their services, e.g. in the form of meters or budgets. These would let the consumer follow the environmental impact of their own actions in real time. Environmentally sound consumership can also be supported via pricing.",
    image: s4,
    actor: "Consumers",
    enabler: "Media companies",
    effects: [
      "+ Educates about environmental impact",
      "+ Links individual consumer behaviour to its environmental impact",
      "+ A user can follow their own action’s impact",
      "- No emissions are saved without consumer action",
      "- Will likely lessen time spent in media services",
      "- Requires exact measurements of data and electricity use",
    ],
  },
  {
    title: "Green Regulation",
    description:
      "Digital media is subjected to environmental regulation, setting an upper boundary on their services’ energy intensity and forcing companies to report their Scope 3 emissions.",
    image: s5,
    actor: "Media companies",
    enabler: "Governing bodies",
    effects: [
      "+ Educates about environmental impact",
      "+ Effective for reducing Scope 3 emissions",
      "+ Same responsibilities for everyone",
      "- Requires exact measuring for data and electricity usage of services",
      "- Requires large operational and technological changes in every media company",
    ],
  },
  {
    title: "OS and browser heroes",
    description:
      "Companies that own the digital platforms, such as browser and OS manufacturers, decide to make browsing websites and using applications sustainable. The consumer can use browser features and add-ons to prevent loading environmentally unsound digital media, and app stores set limits to how energy-hungry applications can be.",
    image: s6,
    actor: "Consumer",
    enabler: "Platform companies",
    effects: [
      "+ Educates about environmental impact",
      "+ Very effective in reducing Scope 3 emissions",
      "+ Same requirements to all actors",
      "- Requires exact measurements on data and electricity usage",
      "- Requires large technology changes in every media company",
    ],
  },
];

const ScenariosContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(5)};
`;

export const Scenarios = () => {
  return (
    <ScenariosContainer>
      {allScenarios.map((scenario, i) => (
        <SingleScenario
          key={scenario.title}
          scenario={scenario}
          number={i + 1}
        />
      ))}
    </ScenariosContainer>
  );
};

const ScenarioCard = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
  padding: ${theme.spacing(4)};
  align-items: center;
  background-color: ${theme.colors.grey(4)};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing(3)};
  @media (max-width: ${breakpoints.mobilePlus}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ScenarioTextBox = styled.div`
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: ${theme.spacing(3)};
  gap: ${theme.spacing(2)};

  @media (max-width: ${breakpoints.mobilePlus}px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const ScenarioTitle = styled.h4`
  ${theme.fontBold};
  ${theme.fontSize(1)};
`;

const TextBoxTitle = styled.h5`
  ${theme.fontSize(0)};
  text-transform: uppercase;
`;

const SingleScenario = ({
  scenario,
  number,
}: {
  scenario: ScenarioModel;
  number: number;
}) => {
  return (
    <ScenarioCard>
      <ScenarioTitle>
        Scenario {number}: {scenario.title}
      </ScenarioTitle>
      <ScenarioTextBox>
        <img src={scenario.image} />
        <P>{scenario.description}</P>
      </ScenarioTextBox>
      <Row>
        <ScenarioTextBox style={{ minWidth: 180 }}>
          <div>
            <TextBoxTitle>Actor</TextBoxTitle>
            <P>{scenario.actor}</P>
            <TextBoxTitle>Enabler</TextBoxTitle>
            <P>{scenario.enabler}</P>
          </div>
        </ScenarioTextBox>
        <ScenarioTextBox style={{ flexGrow: 1 }}>
          <div>
            <TextBoxTitle>Effects</TextBoxTitle>
            {scenario.effects.map((effect) => (
              <P key={effect}>{effect}</P>
            ))}
          </div>
        </ScenarioTextBox>
      </Row>
    </ScenarioCard>
  );
};
