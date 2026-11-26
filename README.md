页面整体采用 postcss-pxtorem 与 amfe-flexible 实现适配；ECharts 图表则由自研服务 auto-size-echarts 根据当前屏幕尺寸自动调整图表内的全部配置项（如 fontSize、itemWidth、itemHeight、symbolSize、width 等），从而让图表随页面整体自适应。
