import { useState } from "react";
import { Squircle, squircle } from "corner-smoothing";
import styled from "styled-components";

const boxWidth = "max(20vw, 150px)";

// Styling a Squircle can be done in any way, it doesn't have to be with
// styled-components. This is just to demonstrate.
const FilledBox = styled.div`
  background: linear-gradient(45deg, #7c3aed, #ff1b6b);
  color: #fff;
  width: ${boxWidth};
  padding: 0.5rem;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  :hover {
    background: linear-gradient(45deg, #7c3aedee, #ff1b6bee);
  }
`;

const Row = styled.div`
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const BorderBoxNormal = styled.div`
  background: #fff;
  color: #333;
  width: ${boxWidth};
  height: 75px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-color: #7c3aed;
  border-style: solid;

  :hover {
    background: #fcfaff;
  }
`;

const BorderBox = styled.div`
  background: linear-gradient(45deg, #7c3aed, #ff1b6b);
  color: #333;
  width: ${boxWidth};
  height: 75px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  ::before {
    background: #fff;
  }

  :hover::before {
    background: #fcfaff;
  }
`;

const Container = styled.div`
  background: #f2f2f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const ShadowWrapper = styled.div`
  filter: drop-shadow(0px 3px 6px rgba(25, 25, 0, 0.25));
`;

const StyledContainerBox = styled.div`
  display: inline-block;
  padding: 0 1rem;
  background: #fff;
`;

const ContainerBox = squircle(StyledContainerBox, {
  cornerRadius: 35,
});

export default function Page() {
  const [radiusPx, setRadiusPx] = useState(25);
  const [smoothing100, setSmoothing100] = useState(100);
  const [borderWidth2, setBorderWidth2] = useState(2);

  const borderWidth = borderWidth2 / 2;
  const smoothing = smoothing100 / 100;

  return (
    <Container>
      <h3 style={{ marginBottom: "1.75rem", fontWeight: 500 }}>
        Corner Smoothing. Squircles for the web. Read the{" "}
        <a href="https://github.com/sanalabs/corner-smoothing#readme">docs</a>.
      </h3>

      <ShadowWrapper>
        <ContainerBox>
          <table style={{ margin: "1rem auto 2rem" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "right" }}>Radius:</td>
                <td>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={radiusPx}
                    onChange={(e) => setRadiusPx(parseInt(e.target.value))}
                  />
                </td>
                <td style={{ width: "60px" }}>{radiusPx} px</td>
              </tr>
              <tr>
                <td style={{ textAlign: "right" }}>Smoothing:</td>
                <td>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={smoothing100}
                    onChange={(e) => setSmoothing100(parseInt(e.target.value))}
                  />
                </td>
                <td style={{ width: "60px" }}>{smoothing}</td>
              </tr>
              <tr>
                <td>Border width:</td>
                <td>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={borderWidth2}
                    onChange={(e) => setBorderWidth2(parseInt(e.target.value))}
                  />
                </td>
                <td style={{ width: "60px" }}>{borderWidth} px</td>
              </tr>
            </tbody>
          </table>

          <Row>
            <div
              style={{
                width: boxWidth,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Before:
            </div>
            <div
              style={{
                width: boxWidth,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              After:
            </div>
          </Row>

          <Row>
            <FilledBox style={{ borderRadius: `${radiusPx}px` }}>
              Filled
              <br />
              Normal
            </FilledBox>
            <Squircle
              cornerRadius={radiusPx}
              cornerSmoothing={smoothing}
              as={FilledBox}
            >
              Filled
              <br />
              Squircle
            </Squircle>
          </Row>

          <Row>
            <BorderBoxNormal
              style={{
                borderRadius: `${radiusPx}px`,
                borderWidth: `${borderWidth}px`,
              }}
            >
              Border
              <br />
              Normal
            </BorderBoxNormal>

            <Squircle
              cornerRadius={radiusPx}
              cornerSmoothing={smoothing}
              borderWidth={borderWidth}
              as={BorderBox}
            >
              Border
              <br />
              Squircle
            </Squircle>
          </Row>
        </ContainerBox>
      </ShadowWrapper>
    </Container>
  );
}
