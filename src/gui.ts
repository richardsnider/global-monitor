import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let gui: GUI;

const settings = {
  bloom: {
    strength: {
      value: 0.5,
      min: 0,
      max: 3,
    },
    radius: {
      value: 0.5,
      min: 0,
      max: 1,
    },
  },
  other: {
    code: {
      value: "a1b2c3",
    }
  }
};

const createGui = () => {
  gui = new GUI();

  for (let key in settings) {
    const folder = gui.addFolder(key);

    const values: Record<string, any> = {};
    for (let subKey in settings[key]) {
      values[subKey] = settings[key][subKey].value;
    }

    for (let subKey in settings[key]) {
      const controller = folder.add(values, subKey, settings[key][subKey].min || 0, settings[key][subKey].max || 0);
      controller.step(0.01);
      controller.onChange((value) => { settings[key][subKey].value = value; });
    }
  }
}

const getSetting = (key: string, subKey: string) => settings[key][subKey].value;

const hideGui = () => gui.hide();
const showGui = () => gui.show();

export { createGui, hideGui, showGui, getSetting };
