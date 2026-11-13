import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import postCssPxToRem from "postcss-pxtorem";
import { rootValue as rv } from "./src/config/px2rem/px2rem";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          // 配置在将px转化为rem时 1rem等于多少px(因为我们搭配使用了amfe-flexible插件 此处我们需要设置的值应是UI设计稿全屏基准宽度的十分之一)
          // 当UI设计稿的全屏基准宽度是1920px时 此处设置的值为192
          rootValue: rv,
          // 所有px均转化为rem
          propList: ["*"],
          // 若想设置部分样式不转化 可以在配置项中写出
          // eg: 除 border和font-size外 所有px均转化为rem
          // propList: ["*", "!border","!font-size"],
          selectorBlackList: ["no-rem"],
        })
      ]
    }
  },
  server: {
    port: 8088,
  },
});
