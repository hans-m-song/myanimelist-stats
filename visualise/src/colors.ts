// https://material-ui.com/customization/color/

export const colorArray = [
  '#f44336',
  '#3f51b5',
  '#03a9f4',
  '#4caf50',
  '#ff9800',
  '#9c27b0',
  '#795548',
];

interface RGB {
  red: number;
  green: number;
  blue: number;
}

export const colorGradient = (
  fadeFraction: number,
  rgbColor1: RGB,
  rgbColor2: RGB,
  rgbColor3?: RGB,
) => {
  let color1 = rgbColor1;
  let color2 = rgbColor2;
  let fade = fadeFraction;

  // Do we have 3 colors for the gradient? Need to adjust the params.
  if (rgbColor3) {
    fade = fade * 2;

    // Find which interval to use and adjust the fade percentage
    if (fade >= 1) {
      fade -= 1;
      color1 = rgbColor2;
      color2 = rgbColor3;
    }
  }

  const diffRed = color2.red - color1.red;
  const diffGreen = color2.green - color1.green;
  const diffBlue = color2.blue - color1.blue;

  const gradient = {
    red: Math.floor(color1.red + diffRed * fade),
    green: Math.floor(color1.green + diffGreen * fade),
    blue: Math.floor(color1.blue + diffBlue * fade),
  };

  return `rgb(${gradient.red}, ${gradient.green}, ${gradient.blue})`;
};
