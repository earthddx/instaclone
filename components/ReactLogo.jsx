import { BlurMask, Group, Oval } from "@shopify/react-native-skia";
import React from "react";

const SIZE = 60;
const OVAL_HEIGHT_RATIO = 2.5;

const OvalComponent = () => (
  <Oval
    x={-SIZE}
    y={-SIZE / OVAL_HEIGHT_RATIO}
    width={SIZE * 2}
    height={(SIZE / OVAL_HEIGHT_RATIO) * 2}
    color="#cecece"
    style="stroke"
    strokeWidth={2}
  />
);

export const ReactNativeLogo = ({ canvasSize }) => {
  const rotatedOvals = React.useMemo(() => {
    const angles = [0, Math.PI / 3, (Math.PI * 2) / 3];
    return angles.map((angle, index) => (
      <Group key={index} transform={[{ rotate: angle }]}>
        <OvalComponent />
      </Group>
    ));
  }, []);

  return (
    <Group>
      <Group
        transform={[
          { translateX: canvasSize.width / 2 },
          { translateY: canvasSize.height / 2 },
        ]}
      >
        {rotatedOvals}
      </Group>
      <BlurMask blur={3} style="solid" />
    </Group>
  );
};
