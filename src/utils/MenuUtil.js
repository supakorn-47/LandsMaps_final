// import {
//   menuGrouped,
//   menuGroupedType6,
//   menuGroupedCheckMenu,
// } from "../json/03menuLPADM";
import menuLPSMS from '../json/01menuLPSMS';
import menuLPASM from '../json/02menuLPASM';
import menuLPADM from '../json/03menuLPADM';
import menuLPSPS from '../json/04menuLPSPS';
import menuLPSTS from '../json/05menuLPSTS';

export const getTextMenu = (text) => {
  let hash = window.location.hash;
  let nameMenu = "";
  let menuGroupeds = [];
  if (hash.indexOf("ADM") !== -1) {
    // if (hash === "#/ADM09" || hash === "#/ADM08") {
    //   menuGroupeds = menuGroupedCheckMenu;
    // } else {
    //   menuGroupeds = menuGrouped;
    // }
    // menuGroupeds.forEach((element1) => {
    //   element1.items.forEach((element2) => {
    //     if ("#" + element2.to === hash) {
    //       nameMenu = element2.to.replace("/", "") + " " + element2.label;
    //     }
    //   });
    // });
  } else if (hash.indexOf("MSM") !== -1) {
    // menuMSM.forEach((element1) => {
    //   element1.items.forEach((element2) => {
    //     if ("#" + element2.to === hash) {
    //       nameMenu = element2.to.replace("/", "") + " " + element2.label;
    //     }
    //   });
    // });
  } else if (hash.indexOf("DMS") !== -1) {
    menuLPSMS.forEach((element1) => {
      element1.items.forEach((element2) => {
        if ("#" + element2.to === hash) {
          // nameMenu = element2.to.replace("/", "") + " " + element2.label;
          nameMenu = element2.label;
        }
      });
    });
  } else if (hash.indexOf("DEA") !== -1) {
    // menuDEA.forEach((element1) => {
    //   if ("#" + element1.to === hash) {
    //     nameMenu = element1.to.replace("/", "") + " " + element1.label;
    //   }
    // });
  } else if (hash.indexOf("DGR") !== -1) {
    // menuDGR.forEach((element1) => {
    //   if ("#" + element1.to === hash) {
    //     nameMenu = element1.to.replace("/", "") + " " + element1.label;
    //   }
    // });
  }
  return nameMenu;
};
