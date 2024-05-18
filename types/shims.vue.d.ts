declare module "*.vue" {
  import type { DefineComponent } from "nativescript-vue";
  const component: DefineComponent<
    {
      // global $fonticon function
      $fonticon: (text: string) => string;
    },
    {},
    any
  >;
  export default component;
}
