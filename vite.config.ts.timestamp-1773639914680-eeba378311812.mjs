// vite.config.ts
import { defineConfig } from "file:///D:/%E5%BE%AE%E5%BA%94%E7%94%A8demo/vue3/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/%E5%BE%AE%E5%BA%94%E7%94%A8demo/vue3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
var __vite_injected_original_dirname = "D:\\\u5FAE\u5E94\u7528demo\\vue3";
var __vite_injected_original_import_meta_url = "file:///D:/%E5%BE%AE%E5%BA%94%E7%94%A8demo/vue3/vite.config.ts";
var vite_config_default = defineConfig({
  base: "./",
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "hack1": `true; @import "${path.resolve(__vite_injected_original_dirname, "node_modules/ant-design-vue/lib/style/themes/dark.less")}";`,
          "hack2": `true; @import "${path.resolve(__vite_injected_original_dirname, "src/styles/var.less")}";`
        }
      }
    }
  },
  server: {
    port: 8088,
    /** 微应用配置：开启跨域资源共享 */
    cors: true,
    proxy: {
      "/api": {
        target: "http://172.16.34.14:9910",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxcdTVGQUVcdTVFOTRcdTc1MjhkZW1vXFxcXHZ1ZTNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFx1NUZBRVx1NUU5NFx1NzUyOGRlbW9cXFxcdnVlM1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovJUU1JUJFJUFFJUU1JUJBJTk0JUU3JTk0JUE4ZGVtby92dWUzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLi8nLFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBsZXNzOiB7XG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICBtb2RpZnlWYXJzOiB7XG4gICAgICAgICAgJ2hhY2sxJzogYHRydWU7IEBpbXBvcnQgXCIke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvYW50LWRlc2lnbi12dWUvbGliL3N0eWxlL3RoZW1lcy9kYXJrLmxlc3MnKX1cIjtgLFxuICAgICAgICAgICdoYWNrMic6IGB0cnVlOyBAaW1wb3J0IFwiJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3N0eWxlcy92YXIubGVzcycpfVwiO2AsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDgwODgsXG4gICAgLyoqIFx1NUZBRVx1NUU5NFx1NzUyOFx1OTE0RFx1N0Y2RVx1RkYxQVx1NUYwMFx1NTQyRlx1OERFOFx1NTdERlx1OEQ0NFx1NkU5MFx1NTE3MVx1NEVBQiAqL1xuICAgIGNvcnM6IHRydWUsXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTcyLjE2LjM0LjE0Ojk5MTBcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UCxTQUFTLG9CQUFvQjtBQUMxUixPQUFPLFNBQVM7QUFDaEIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBQWtHLElBQU0sMkNBQTJDO0FBSzVMLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxFQUNOO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osbUJBQW1CO0FBQUEsUUFDbkIsWUFBWTtBQUFBLFVBQ1YsU0FBUyxrQkFBa0IsS0FBSyxRQUFRLGtDQUFXLHdEQUF3RCxDQUFDO0FBQUEsVUFDNUcsU0FBUyxrQkFBa0IsS0FBSyxRQUFRLGtDQUFXLHFCQUFxQixDQUFDO0FBQUEsUUFDM0U7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBRU4sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
