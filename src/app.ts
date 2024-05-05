import { createApp } from "nativescript-vue";
import Home from "./components/Home.vue";

const app = createApp(Home);

/**
 * Font icon
 */
import { FontIconFactory, fonticon } from "nativescript-fonticon";
import { knownFolders } from "@nativescript/core/file-system";

FontIconFactory.debug = true;
FontIconFactory.paths = {
  fa: knownFolders.currentApp().getFile("./assets/fa.css").readTextSync(),
};
FontIconFactory.loadCss();
app.config.globalProperties.$fonticon = fonticon;

app.start();
