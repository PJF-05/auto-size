<template>
  <div class="x-chart-box" :style="{ height: $px2rem(chartHeight) }">
    <v-chart
      class="x-chart"
      v-bind="$attrs"
      :option="chartsOption"
      :updateOption="chartsUpdateOption"
      :autoresize="false"
      :theme="'dark'"
      ref="chartRef"
    />
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";
import { onMounted, onUnmounted, ref, watch } from "vue";
import AutoSizeEchart from "@/service/auto-size-echart";

export interface UpdateOption {
  notMerge?: boolean;
  lazyUpdate?: boolean;
  silent?: boolean;
}

const props = defineProps({
  option: {
    type: Object as () => EChartsOption,
    default: () => ({}),
  },
  updateOption: {
    type: Object as () => UpdateOption,
    default: () => ({
      notMerge: false,
      lazyUpdate: false,
      silent: false,
    }),
  },
  chartHeight: {
    type: String,
  },
});

const chartsOption = ref<EChartsOption>({});
const chartsUpdateOption = ref<UpdateOption>({});
const chartRef = ref();
const autoSizeService = ref<AutoSizeEchart | null>(null);

const init = () => {
  const instance = chartRef.value?.chart;
  const dom = chartRef.value?.$el;

  if (instance && dom) {
    autoSizeService.value = new AutoSizeEchart({
      options: props.option,
      mode: props.updateOption,
      chartInstance: instance,
      dom: dom,
    });

    chartsUpdateOption.value = props.updateOption;
    chartsOption.value = autoSizeService.value.options();
  }
};

onMounted(() => {
  init();
});

watch(
  () => props.option,
  (newVal) => {
    if (autoSizeService.value) {
      autoSizeService.value.updateOption(newVal || {});
      chartsOption.value = autoSizeService.value.options();
    }
  },
  {
    deep: true,
  },
);

watch(
  () => props.updateOption,
  (newVal) => {
    if (autoSizeService.value) {
      autoSizeService.value.updateMode(newVal);
      chartsUpdateOption.value = newVal;
    }
  },
  { deep: true },
);

onUnmounted(() => {
  if (autoSizeService.value) {
    autoSizeService.value.destroy();
    autoSizeService.value = null;
  }
});

defineExpose({
  // 组件实例本身
  getInstance: () => chartRef.value,

  setOption: (...args: any[]) => chartRef.value?.setOption(...args),
  getOption: () => chartRef.value?.getOption(),
  resize: () => chartRef.value?.resize(),
  clear: () => chartRef.value?.clear(),
  dispose: () => chartRef.value?.dispose(),

  // 交互与事件
  dispatchAction: (payload: any) => chartRef.value?.dispatchAction(payload),

  // 尺寸与 DOM
  getWidth: () => chartRef.value?.getWidth(),
  getHeight: () => chartRef.value?.getHeight(),
  getDom: () => chartRef.value?.getDom(),

  // 坐标转换
  convertToPixel: (finder: any, value: any) =>
    chartRef.value?.convertToPixel(finder, value),
  convertFromPixel: (finder: any, value: any) =>
    chartRef.value?.convertFromPixel(finder, value),
  containPixel: (finder: any, value: any) =>
    chartRef.value?.containPixel(finder, value),

  // 视觉映射
  getVisual: (finder: any, visualType: any) =>
    chartRef.value?.getVisual(finder, visualType),

  // 导出图片
  getDataURL: (opts?: any) => chartRef.value?.getDataURL(opts),

  // 动效与布局
  updateLabelLayout: () => chartRef.value?.updateLabelLayout(),
});
</script>
<style scoped lang="less">
.x-chart-box,
.x-chart {
  width: 100%;
  height: 100%;
}
</style>
