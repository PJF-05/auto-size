<template>
  <div class="dashboard">
    <div v-for="(item, index) in chartList" :key="index" class="box">
      <div class="header">
        <span class="title">{{ item.title }}</span>
        <span class="badge">m³</span>
      </div>
      <div class="content">
        <x-chart class="chart" :option="item.option" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import xChart from "./components/x-chart.vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { LegacyGridContainLabel } from "echarts/features";
import type { EChartsOption } from "echarts";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LegacyGridContainLabel,
]);

interface AirDataItem {
  ts: string;
  value: number;
}

const baseData: AirDataItem[] = [
  { ts: "00:00", value: 120 }, { ts: "01:00", value: 132 },
  { ts: "02:00", value: 101 }, { ts: "03:00", value: 134 },
  { ts: "04:00", value: 90 },  { ts: "05:00", value: 230 },
  { ts: "06:00", value: 210 }, { ts: "07:00", value: 182 },
  { ts: "08:00", value: 191 }, { ts: "09:00", value: 234 },
  { ts: "10:00", value: 290 }, { ts: "11:00", value: 330 },
  { ts: "12:00", value: 310 }, { ts: "13:00", value: 320 },
  { ts: "14:00", value: 340 }, { ts: "15:00", value: 330 },
  { ts: "16:00", value: 320 }, { ts: "17:00", value: 310 },
  { ts: "18:00", value: 280 }, { ts: "19:00", value: 250 },
  { ts: "20:00", value: 220 }, { ts: "21:00", value: 190 },
  { ts: "22:00", value: 160 }, { ts: "23:00", value: 140 },
];

const createData = (offset: number): AirDataItem[] =>
  baseData.map((d) => ({ ts: d.ts, value: d.value + offset }));

// ✅ 组装完整 EChartsOption（x-chart 的 option prop 要求完整配置）
const buildOption = (data: AirDataItem[], name: string): EChartsOption => ({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    axisPointer: { lineStyle: { color: "#c9c9c9", type: "dashed" } },
    textStyle: { color: "#fff" },
    triggerOn: "click",
  },
  legend: { show: false },
  grid: { top: 30, left: "3%", right: "1%", bottom: "3%", containLabel: true },
  xAxis: {
    type: "category",
    data: data.map((d) => d.ts),
    axisLine: { lineStyle: { color: "rgba(255,255,255,0.4)" } },
    axisLabel: { color: "#c9c9c9", fontSize: 13 },
  },
  yAxis: {
    type: "value",
    name: "m³",
    axisLine: { lineStyle: { color: "#c9c9c9" } },
    axisLabel: { color: "#c9c9c9", fontSize: 13 },
    splitLine: { lineStyle: { color: "rgba(201,201,201,0.2)" } },
  },
  series: [
    {
      name,
      type: "line",
      data: data.map((d) => d.value),
      lineStyle: { width: 2, color: "#4ade80" },
      areaStyle: {
        color: {
          type: "linear", x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(74,222,128,0.3)" },
            { offset: 1, color: "rgba(74,222,128,0.02)" },
          ],
        },
      },
      itemStyle: { color: "#4ade80" },
    },
  ],
});

const chartList = ref<any>([
  { title: "压空 · 1号机", option: buildOption(createData(0), "1号机") },
  { title: "压空 · 2号机", option: buildOption(createData(12), "2号机") },
  { title: "压空 · 3号机", option: buildOption(createData(-8), "3号机") },
  { title: "压空 · 4号机", option: buildOption(createData(25), "4号机") },
  { title: "压空 · 5号机", option: buildOption(createData(-15), "5号机") },
  { title: "压空 · 6号机", option: buildOption(createData(40), "6号机") },
]);
</script>

<style lang="less" scoped>
/* 只重置本组件内部，全局 html/body/#app 样式请放全局 css */
.dashboard {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  padding: 12px;
  gap: 12px;
  background: #0b0f17;
  box-sizing: border-box;
}

/* ✅ 关键：每个盒子宽度 = (100% - 2×gap)/3，高度 = (100% - 1×gap)/2
   这样 3 个一行、2 行刚好铺满，不依赖 flex-grow 拉伸 */
.box {
  flex: 0 0 calc((100% - 24px) / 3);   /* 2 个 gap = 24px */
  height: calc((100% - 12px) / 2);     /* 1 个 gap = 12px */
  min-width: 0;                        /* 防止内容撑破 */
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #131a24;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.box:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(74, 222, 128, 0.3);
}

.header {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header .title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header .title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #4ade80;
  border-radius: 4px;
}

.header .badge {
  font-size: 12px;
  color: #94a3b8;
  background: rgba(74, 222, 128, 0.1);
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

/* ✅ 内容区撑满 header 之外的高度 */
.content {
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 6px 4px 4px 4px;
  position: relative;
}

.content .chart {
  width: 100%;
  height: 100%;
}

.box:nth-child(1) .header .title::before { background: #4ade80; }
.box:nth-child(2) .header .title::before { background: #60a5fa; }
.box:nth-child(3) .header .title::before { background: #facc15; }
.box:nth-child(4) .header .title::before { background: #f472b6; }
.box:nth-child(5) .header .title::before { background: #a78bfa; }
.box:nth-child(6) .header .title::before { background: #fb923c; }
</style>