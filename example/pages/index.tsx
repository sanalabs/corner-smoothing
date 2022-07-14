import { useState } from "react";
import { SquircleTodo, squircle } from "squircle-todo";
import styled from "styled-components";

const Button = styled.div`
  background-color: #7c3aed;
  color: white;
  width: 10%;
  padding: 1rem;
  height: 100px;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background-color: #8b5cf6;
    cursor: pointer;
  }
`;

export default function Page() {
  const [radius, setRadius] = useState(10)
  const [smoothing100, setSmoothing100] = useState(60)
  const smoothing = smoothing100 / 100

  const SquircleButton = squircle(Button, { cornerRadius: radius, cornerSmoothing: smoothing });

  return (
    <div>
      <input type="range" min={1} max={100} value={radius} onChange={e => setRadius(parseInt(e.target.value))} /> {radius}px
      <input type="range" min={0} max={100} value={smoothing100} onChange={e => setSmoothing100(parseInt(e.target.value))} /> {smoothing}

      <Button style={{ borderRadius: `${radius}px` }}>Normal border radius</Button>

      <SquircleButton>Wrapped in squircle HOC</SquircleButton>

      <SquircleTodo cornerRadius={radius} cornerSmoothing={smoothing} as={Button}>
        Wrapped in Squircle component with as={`{Button}`}
      </SquircleTodo>

      {/* <SquircleTodo
        cornerRadius={radius}
        cornerSmoothing={smoothing}
        as="span"
        style={{
          backgroundColor: "#7c3aed",
          color: 'white',
          width: "10%",
          padding: '1rem',
          height: '100px',
          margin: "1rem auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Explicitly styled Squircle component
      </SquircleTodo> */}
    </div>
  );
}
