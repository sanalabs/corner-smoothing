import { useState } from "react";
import { Squircle, squircle } from "squircle-todo";
import styled from "styled-components";

// Styling a Squircle can be done in any way, it doesn't have to be with
// styled-components. This is just to demonstrate.
const FilledBox = styled.div`
  background-color: #7c3aed;
  color: #fff;
  width: max(20vw, 150px);
  padding: 0.5rem;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  :hover {
    background-color: #8b5cf6;
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
  background-color: #fff;
  color: #333;
  width: max(20vw, 150px);
  height: 75px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-color: #7c3aed;
  border-style: solid;

  :hover {
    background-color: #f5f1ff;
  }
`;

const BorderBox = styled.div`
  background-color: #7c3aed;
  color: #333;
  width: max(20vw, 150px);
  height: 75px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  ::before {
    background-color: #fff;
  }

  :hover::before {
    background-color: #f5f1ff;
  }
`;

const Container = styled.div`
  background-color: #f4f4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ShadowWrapper = styled.div`
  filter: drop-shadow(0px 3px 6px rgba(25, 25, 0, 0.25));
`

const StyledContainerBox = styled.div`
  display: inline-block;
  padding: 0 1rem;
  background-color: #fff;
`;

const ContainerBox = squircle(StyledContainerBox, {
  cornerRadius: 35,
});

export default function Page() {
  const [radiusPx, setRadiusPx] = useState(25);
  const [smoothing100, setSmoothing100] = useState(100);
  const [borderWidthPx2, setBorderWidthPx2] = useState(2);

  const borderWidthPx = borderWidthPx2 / 2;
  const smoothing = smoothing100 / 100;

  return (
    <Container>
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
              <td style={{ width: "50px" }}>{radiusPx} px</td>
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
              <td style={{ width: "50px" }}>{smoothing}</td>
            </tr>
            <tr>
              <td>Border width:</td>
              <td>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={borderWidthPx2}
                  onChange={(e) => setBorderWidthPx2(parseInt(e.target.value))}
                />
              </td>
              <td style={{ width: "50px" }}>{borderWidthPx} px</td>
            </tr>
          </tbody>
        </table>
        <Row>
          <div
            style={{
              width: "max(20vw, 150px)",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Before:
          </div>
          <div
            style={{
              width: "max(20vw, 150px)",
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
          </Squircle>{" "}
        </Row>
        <Row>
          <BorderBoxNormal
            style={{
              borderRadius: `${radiusPx}px`,
              borderWidth: `${borderWidthPx}px`,
            }}
          >
            Border
            <br />
            Normal
          </BorderBoxNormal>

          <Squircle
            cornerRadius={radiusPx}
            cornerSmoothing={smoothing}
            borderWidthPx={borderWidthPx}
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
