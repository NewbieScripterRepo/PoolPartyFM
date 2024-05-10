import { createApp } from "nativescript-vue";
import Home from "./components/Home.vue";

const app = createApp(Home);

import { CoreTypes, TouchManager } from "@nativescript/core";
TouchManager.enableGlobalTapAnimations = true;
TouchManager.animations = {
  down: {
    backgroundColor: "#00000010",
    duration: 50,
    curve: CoreTypes.AnimationCurve.easeInOut,
  },
  up: {
    backgroundColor: "transparent",
    duration: 50,
    curve: CoreTypes.AnimationCurve.easeInOut,
  },
};

/**
 * Font icon
 */
import { FontIconFactory, fonticon } from "nativescript-fonticon";
import { knownFolders } from "@nativescript/core/file-system";

FontIconFactory.debug = false;
FontIconFactory.paths = {
  fa: knownFolders.currentApp().getFile("./assets/fa.css").readTextSync(),
};
FontIconFactory.loadCss();
app.config.globalProperties.$fonticon = fonticon;

app.start();
