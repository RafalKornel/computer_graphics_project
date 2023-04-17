export const registerSlider = (wrapper: HTMLDivElement): HTMLInputElement => {
  let value = 1;

  wrapper.innerHTML = `
  <label for="focal">Focal distance: <span id="slider-value">${value}</span></label>
  <input value=${value}  name="focal" type="range" min="0.1" max="3" step="0.1" style="width: 100%"></input>
`;

  const sliderInput = document.querySelector(
    "input[name=focal]"
  )! as HTMLInputElement;

  const sliderValue = document.querySelector(
    "span#slider-value"
  )! as HTMLSpanElement;

  sliderInput.addEventListener("input", (e: any) => {
    const v = e.target.value;

    sliderValue.innerHTML = v;

    value = v;
  });

  return sliderInput;
};
