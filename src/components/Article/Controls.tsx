import { ContentType, allContentTypes } from "../../types";
import {
  A,
  P,
  SectionTitle,
  Selector,
  SelectorLabel,
  SmallP,
} from "../common-components";
import styled from "styled-components";
import { useContext } from "react";
import { ArticleParamsContext } from "../../contexts/ArticleParamsContext";
import { breakpoints, theme } from "../../theme";
import { NumberInput } from "../generic/NumberInput";
import OptionsSelector from "../generic/OptionsSelector";
import SliderInput from "../generic/SliderInput";
import { getStreamedContentDescription } from "../../util/texts";
import { ToggleableContent } from "../generic/ToggleableContent";
import PresetSelector from "../generic/PresetSelector";

const getOption = <T,>(option: T) => ({
  label: option,
  value: option,
});

const ControlsContainer = styled.div`
  border-right: 1px solid ${theme.colors.grey(4)};
  padding: 0 ${theme.spacing(3)} ${theme.spacing(3)} 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.spacing(1)};

  @media (max-width: ${breakpoints.mobilePlus}px) {
    border-right: none;
    border-bottom: 1px solid ${theme.colors.grey(4)};
    padding: ${theme.spacing(3)} 0;
  }
`;

const Controls = () => {
  const { params, updateParams } = useContext(ArticleParamsContext);

  return (
    <ControlsContainer>
      <SectionTitle>Choices made in article content</SectionTitle>
      <Selector>
        <SelectorLabel>Content type</SelectorLabel>
        <OptionsSelector
          options={allContentTypes.map(getOption<ContentType>)}
          onChange={(newValue) =>
            newValue !== null && updateParams({ contentType: newValue })
          }
          value={params.contentType}
          params={params}
          paramName="contentType"
        />
        <P>
          The article's content type has the greatest effect on how much carbon
          is emitted. Video content produces so much transfer emissions that the
          amounts emitted from initial page loading are marginal.
        </P>
      </Selector>
      <Selector>
        <SelectorLabel>Users</SelectorLabel>
        <NumberInput
          min={1000}
          step={1000}
          value={params.users}
          onChange={(value) => updateParams({ users: value })}
        />
      </Selector>
      {params.contentType !== "Text" && (
        <>
          <Selector>
            <SelectorLabel>{params.contentType} length</SelectorLabel>
            <NumberInput
              min={0.5}
              step={0.5}
              value={params.streamContentLengthInMinutes}
              onChange={(value) =>
                updateParams({ streamContentLengthInMinutes: value })
              }
              unit="min"
            />
          </Selector>
          {params.contentType === "Video" && (
            <Selector>
              <SelectorLabel>Optimize video</SelectorLabel>
              <OptionsSelector
                options={[
                  {
                    label: "On",
                    value: true,
                  },
                  {
                    label: "Off",
                    value: false,
                  },
                ]}
                onChange={(newValue) =>
                  updateParams({ optimizeVideo: newValue })
                }
                paramName="optimizeVideo"
                params={params}
                value={params.optimizeVideo}
              />
              <P>
                E.g. YouTube has a data saver mode, and generally optimizes
                video definition by network speed and device size. Here, for
                simplification, we optimize to 360p for mobile devices.
              </P>
            </Selector>
          )}
          <Selector>
            <SelectorLabel>Autoplay</SelectorLabel>
            <OptionsSelector
              options={[
                {
                  label: "On",
                  value: true,
                },
                {
                  label: "Off",
                  value: false,
                },
              ]}
              onChange={(newValue) => updateParams({ autoplay: newValue })}
              paramName="autoplay"
              params={params}
              value={params.autoplay}
            />
            <P>
              Playing the article's video automatically drastically reduces user
              choice on whether to play video content or not. Some users prefer
              to read a text version when available.
            </P>
          </Selector>
          {!params.autoplay && (
            <Selector>
              <SelectorLabel>
                Percentage of users who play{" "}
                {getStreamedContentDescription(params.contentType)} (when not on
                autoplay)
              </SelectorLabel>
              <SliderInput
                value={params.percentageOfUsersPlayingStreamContent}
                onChange={(value) =>
                  updateParams({ percentageOfUsersPlayingStreamContent: value })
                }
                showNumberInput
                min={0}
                max={100}
                step={10}
                params={params}
                paramName="percentageOfUsersPlayingStreamContent"
                unit="%"
              />
              <P>
                Some users may prefer text alternatives to{" "}
                {getStreamedContentDescription(params.contentType)}, or just
                want to read the text article. You can simulate these choices
                with this slider.
              </P>
            </Selector>
          )}
        </>
      )}

      <Selector>
        <SelectorLabel>Percentage of mobile users</SelectorLabel>
        <SliderInput
          value={params.percentageOfMobileUsers}
          onChange={(value) => updateParams({ percentageOfMobileUsers: value })}
          showNumberInput
          min={0}
          max={100}
          step={10}
          paramName="percentageOfMobileUsers"
          params={params}
          unit="%"
        />
        <P>
          Mobile use increases energy needed for data transfer, but decreases
          device power consumption. Around 40 % of Finnish households use 4G or
          5G routers for their home internet, so especially in Finland, using a
          computer doesn't always signify using a fixed internet connection.
        </P>
        <P>
          For this simulation, we divide the users to approximate percentages
          that use the different networks.
        </P>
      </Selector>

      <ToggleableContent
        defaultOpen={false}
        buttonTitle="Edit background assumptions"
        closeText="Close background assumptions"
      >
        <Selector>
          <SelectorLabel>4G Transfer energy</SelectorLabel>
          <NumberInput
            min={0}
            value={params.kwhPerGB_4G}
            onChange={(value) => updateParams({ kwhPerGB_4G: value })}
            unit="kWh/GB"
          />
        </Selector>
        <Selector>
          <SelectorLabel>5G Transfer energy</SelectorLabel>
          <NumberInput
            min={0}
            value={params.kwhPerGB_5G}
            onChange={(value) => updateParams({ kwhPerGB_5G: value })}
            unit="kWh/GB"
          />
          <SmallP>
            Source:{" "}
            <A
              target="_blank"
              href="https://www.theseus.fi/handle/10024/817469"
            >
              Tietoverkkojen energiankulutus ja päästöt
            </A>{" "}
            (Sami Hautala 2023)
          </SmallP>
        </Selector>
        <Selector>
          <SelectorLabel>Initial data volume</SelectorLabel>
          <NumberInput
            min={0}
            value={params.initialVolumeInMB}
            onChange={(value) => updateParams({ initialVolumeInMB: value })}
            unit="MB"
          />
          <PresetSelector
            options={[
              {
                label: "hs.fi",
                value: 7,
              },
              {
                label: "yle.fi",
                value: 1,
              },
            ]}
            onChange={(newValue) =>
              updateParams({ initialVolumeInMB: newValue })
            }
            value={params.initialVolumeInMB}
          />
          <SmallP>
            You can set the initial amount of data loaded by the site here.
            Above are presets for the measured amounts from yle.fi and hs.fi.
          </SmallP>
        </Selector>
        <Selector>
          <SelectorLabel>Video quality</SelectorLabel>
          <NumberInput
            min={0}
            value={params.videoMBitsPerSecond}
            onChange={(value) => updateParams({ videoMBitsPerSecond: value })}
            unit="bps"
          />
          <PresetSelector
            options={[
              {
                label: "hs.fi",
                value: 5.3,
              },
              {
                label: "yle.fi",
                value: 3.7,
              },
            ]}
            onChange={(newValue) =>
              updateParams({ initialVolumeInMB: newValue })
            }
            value={params.initialVolumeInMB}
          />
          <SmallP>
            You can set the initial amount of data loaded by the site here.
            Above are presets for the measured video quality of web video in
            yle.fi and hs.fi.
          </SmallP>
        </Selector>
        <Selector>
          <SelectorLabel>Optimized video quality</SelectorLabel>
          <NumberInput
            min={0}
            value={params.optimizedVideoMBitsPerSecond}
            onChange={(value) =>
              updateParams({ optimizedVideoMBitsPerSecond: value })
            }
            unit="Mbps"
          />
          <SmallP>
            In the simulation, mobile video is optimized to 360p quality. You
            can set different values here to try out other optimizations. Find
            common bit rates in{" "}
            <A
              target="_blank"
              href="https://support.google.com/youtube/answer/1722171?hl=en#zippy=%2Cvideo-codec-h%2Cbitrate"
            >
              YouTube's guide.
            </A>
          </SmallP>
        </Selector>
        <Selector>
          <SelectorLabel>Audio quality</SelectorLabel>
          <NumberInput
            min={0}
            value={params.audioKiloBitsPerSecond}
            onChange={(value) =>
              updateParams({ audioKiloBitsPerSecond: value })
            }
            unit="Kbps"
          />
          <SmallP>
            Set the quality for audio content. The default, 128 Kbps, is fairly
            standard podcast quality.
          </SmallP>
        </Selector>

        <Selector>
          <SelectorLabel>Network coefficient</SelectorLabel>
          <NumberInput
            min={0}
            value={params.networkCoeffJPerByte}
            onChange={(value) => updateParams({ networkCoeffJPerByte: value })}
            unit="J/B"
          />
        </Selector>
      </ToggleableContent>
    </ControlsContainer>
  );
};

export default Controls;
