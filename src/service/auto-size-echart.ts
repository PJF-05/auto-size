import { px2rem, pxToHtmlPx } from "@/utils/util";
import type { EChartsOption } from "echarts";
import {
  debounce,
  cloneDeep,
  DebouncedFunc,
  mergeWith,
  isArray,
} from "lodash-es";

export interface Mode {
  notMerge?: boolean;
  lazyUpdate?: boolean;
  silent?: boolean;
}

export interface ServiceOption {
  options: EChartsOption;
  mode?: Mode;
  chartInstance: any;
  dom: HTMLElement;
}

class AutoSizeEchart {
  private _options: EChartsOption;
  private _mode: Mode;
  private _chartInstance: any;
  private _dom: HTMLElement;
  private _resizeObserver: ResizeObserver | null = null;
  private _debouncedResize: DebouncedFunc<() => void>;
  private _fullBaseOption: any = null;

  // 默认全部组件
  private _singleToArrayKeys = [
    "title",
    "legend",
    "tooltip",
    "grid",
    "xAxis",
    "yAxis",
    "visualMap",
    "dataZoom",
    "toolbox",
    "geo",
    "polar",
    "radar",
    "angleAxis",
    "radiusAxis",
    "singleAxis",
    "timeline",
    "calendar",
  ];

  constructor(serviceOption: ServiceOption) {
    const { options, mode, chartInstance, dom } = serviceOption;
    this._options = options;
    this._mode = {
      ...{
        notMerge: false,
        lazyUpdate: false,
        silent: false,
      },
      ...mode,
    };
    this._chartInstance = chartInstance;
    this._dom = dom;
    this._debouncedResize = debounce(() => {
      this.resize();
    }, 200);

    this.initFullBaseOption();
    this.listenResize();
  }

  /**
   * 缓存全部Option配置项(包括默认的)
   */
  private initFullBaseOption() {
    let current = this._chartInstance.getOption();

    if (!current || Object.keys(current).length === 0) {
      this._chartInstance.setOption({});
      current = this._chartInstance.getOption();
    }

    // 获取全量默认基准
    const allDefaultOption = cloneDeep(current);

    // 获取option配置，并进行处理
    const userOption = cloneDeep(this._options || {});
    this._singleToArrayKeys.forEach((key) => {
      if (userOption[key] && !isArray(userOption[key])) {
        userOption[key] = [userOption[key]];
      }
    });

    // 过滤只从全部配置项组件中提取option使用到的组件用到的 key
    this._fullBaseOption = this.filterBaseOption(allDefaultOption, userOption);

    // 合并自定义默认配置
    this.mergeCurOption();

    // 合并option
    this.mergeOption();
  }

  /**
   * 把全部配置项没有或者自定义默认配置合并到全部配置里面
   */
  private mergeCurOption() {
    const curOption: EChartsOption = {
      legend: {
        itemWidth: 25,
        itemHeight: 14,
        itemGap: 10,
        padding: 5,
      },
      tooltip: {
        className: "auto-size-tooltip",
        padding: 5,
        textStyle: {
          fontSize: 14,
        },
        formatter: function (params) {
          // 兼容项触发（对象）和轴触发（数组）
          const paramsArray = Array.isArray(params) ? params : [params];

          // 如果是空数据，直接返回空
          if (!paramsArray.length || !paramsArray[0]) return "";

          let html = "";

          // 头部标题：轴触发显示 axisValue，项触发显示 name
          const headerTitle = paramsArray[0].axisValue || paramsArray[0].name;
          if (headerTitle !== undefined) {
            html += `<div style="margin-bottom: ${px2rem("4px")}; font-weight: bold;">${headerTitle}</div>`;
          }

          // 遍历拼接
          paramsArray.forEach((item) => {
            // 容错：颜色和名称
            const color = item.color || "#5470c6";
            const name = item.seriesName || item.name || "";

            // 容错：如果 value 是数组（比如散点图坐标），或者包含空值
            let val = item.value;
            if (Array.isArray(val)) {
              val = val.join(" , ");
            }
            if (val === undefined || val === null) {
              val = "-";
            }

            // 自定义圆点
            const customMarker = `<span style="display:inline-block;margin-right:${px2rem("4px")};width:${px2rem("10px")};height:${px2rem("10px")};border-radius:50%;background-color:${color};"></span>`;

            // 拼接：圆点 + 系列名 + 数值
            html += `<div style="display: flex; align-items: center; margin-top: ${px2rem("4px")};">${customMarker} <span>${name} :</span> <span style="margin-left:${px2rem("15px")};">${val}</span></div>`;
          });

          return html;
        },
        axisPointer: {
          lineStyle: {
            width: 1,
          },
        },
      },
    };

    // 如果option(用户配置)没有配置项就不显示的如：tooltip，从curOption移除,不进行合并,或者用户配置项配置如:show: false
    // noOptionKeyNoShows 没有配置项就不显示的配置项列表
    const noOptionKeyNoShows = ["tooltip"];
    noOptionKeyNoShows.forEach((key) => {
      if (
        !this._options ||
        this._options[key] === undefined ||
        this._options[key] === null
      ) {
        if (curOption[key]) {
          delete curOption[key];
        }
      }
    });

    // curOption 里的组件也要转成数组（和 getOption 返回结构对齐）
    const normalized = cloneDeep(curOption);
    this._singleToArrayKeys.forEach((key) => {
      if (normalized[key] && !isArray(normalized[key])) {
        normalized[key] = [normalized[key]];
      }
    });

    this._fullBaseOption = mergeWith(
      cloneDeep(this._fullBaseOption),
      normalized,
      (objValue, srcValue, key) => {
        if (key === "series") return srcValue;
        if (typeof srcValue === "function") return srcValue;
      },
    );
  }

  /**
   * 根据option使用到的组件过滤全量的未使用的组件
   */
  private filterBaseOption(a: any, b: any) {
    const result: any = {};

    // 必须保留的全局默认配置
    const globalKeys = [
      "color",
      "backgroundColor",
      "textStyle",
      "animation",
      "darkMode",
    ];
    globalKeys.forEach((key) => {
      if (a[key] !== undefined) result[key] = a[key];
    });

    // option使用到的组件提取对应组件的默认配置
    Object.keys(b).forEach((key) => {
      if (key === "series") {
        // series 不需要提取默认值
        return;
      }
      if (a[key] !== undefined) {
        result[key] = a[key];
      }
    });

    return result;
  }

  /**
   * 遍历 option，调用 fontsize 转换
   */
  private changeFontSize(s: Record<string, any>) {
    const changeList = [
      "fontSize",
      "itemWidth",
      "itemHeight",
      "symbolSize",
      "width",
      "height",
      "borderWidth",
      "borderRadius",
      "itemGap",
      "length",
      "top",
      "bottom",
      "margin",
      "padding",
      "lineHeight",
    ];

    // 性能优化：跳过数据体，防止遍历上万条数据
    const skipList = ["data", "dataset", "nodes", "links", "edges"];

    for (let i in s) {
      if (skipList.includes(i)) continue; // 跳过数据字段

      if (s[i] && typeof s[i] === "object") {
        this.changeFontSize(s[i]);
      } else if (changeList.includes(i)) {
        s[i] = pxToHtmlPx(s[i]);
      }
    }
    return s;
  }

  /**
   * 每次根据当前页面尺寸重新计算 fontsize，返回 options
   */
  options(options = this._fullBaseOption) {
    const copy = cloneDeep(options);
    return this.changeFontSize(copy);
  }

  /**
   * 监听页面尺寸变化
   */
  private listenResize() {
    if (!this._dom) {
      throw new Error("DOM 容器为空，无法监听尺寸变化");
    }

    window.addEventListener("resize", this._debouncedResize);

    this._resizeObserver = new ResizeObserver(() => {
      this._debouncedResize();
    });
    this._resizeObserver.observe(this._dom);
  }

  /**
   * 尺寸变化时执行的回调
   */
  private resize() {
    this.setOption();
    this._chartInstance.resize();
  }

  /**
   * 图更新
   */
  setOption() {
    this._chartInstance.setOption(this.options(), this._mode);
  }

  /**
   * 模式设置更新
   */
  updateMode(updateMode: Mode) {
    this._mode = { ...this._mode, ...updateMode };
  }

  /**
   * 配置数据更新
   */
  updateOption(options: EChartsOption) {
    this._options = options;
    this.mergeOption();
  }

  /**
   * 合并option
   */
  mergeOption() {
    const targetOptions = cloneDeep(this._options);

    // 需要转为数组的组件（大部分组件在 getOption 中返回都是数组）
    const singleToArrayKeys = [
      "title",
      "legend",
      "tooltip",
      "grid",
      "xAxis",
      "yAxis",
      "visualMap",
      "dataZoom",
      "toolbox",
      "geo",
      "polar",
      "radar",
      "angleAxis",
      "radiusAxis",
      "singleAxis",
      "timeline",
      "calendar",
    ];

    singleToArrayKeys.forEach((key) => {
      // 如果用户传了对象，并且当前基准里该组件是数组（或者用户想覆盖）
      if (targetOptions[key] && !isArray(targetOptions[key])) {
        targetOptions[key] = [targetOptions[key]];
      }
    });

    // 2. 使用 mergeWith 进行合并
    this._fullBaseOption = mergeWith(
      cloneDeep(this._fullBaseOption),
      targetOptions,
      (objValue, srcValue, key) => {
        if (key === "series") {
          const newSrcValue = srcValue.map((v) => ({
            ...v,
            symbolSize: v.symbolSize ?? 8,
            lineStyle: {
              ...(v.lineStyle || {}),
              width: 2,
            },
          }));
          return newSrcValue;
        }
        // 遇到函数，直接使用函数
        if (typeof srcValue === "function") {
          return srcValue;
        }
      },
    );
  }

  /**
   * 销毁
   */
  destroy() {
    window.removeEventListener("resize", this._debouncedResize);
    this._debouncedResize.cancel();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }
}

export default AutoSizeEchart;
