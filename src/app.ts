import { createApp } from "nativescript-vue";
import Home from "./components/Home.vue";

const app = createApp(Home);

/**
 * Add touch animation
 */
import { Color, CoreTypes, TouchManager } from "@nativescript/core";
TouchManager.enableGlobalTapAnimations = true;
TouchManager.animations = {
  down: {
    backgroundColor: new Color("#cccccc33"),
    duration: 25,
    curve: CoreTypes.AnimationCurve.linear,
  },
  up: {
    backgroundColor: new Color("#cccccc00"),
    duration: 100,
    curve: CoreTypes.AnimationCurve.linear,
  },
};

/**
 * Font icon
 */
import { FontIconFactory, fonticon } from "nativescript-fonticon";
import { knownFolders } from "@nativescript/core/file-system";

FontIconFactory.paths = {
  fa: knownFolders.currentApp().getFile("./assets/fa.css").readTextSync(),
};
FontIconFactory.loadCss();
app.config.globalProperties.$fonticon = fonticon;

app.start();
