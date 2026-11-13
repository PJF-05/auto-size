import { rootValue } from "@/config/px2rem/px2rem";

/**
 * 动态px转换rem(针对行内样式)
 * @param px 传入数字，或者带 px 后缀的字符串 (如 104, '104px')
 */
export const px2rem = (px: string | number): string => {
  // 1. 如果是数字类型（包括 0），直接转换
  if (typeof px === "number") {
    return px / rootValue + "rem";
  }

  // 2. 如果是字符串，转小写并去除前后空格
  const val = String(px).trim().toLowerCase();

  // 3. 匹配数字（包含小数），且后面紧跟 "px" 或者什么都没有。允许前面有负号
  // 例如："104", "104px", "104.5px", "-20px" 都会匹配成功
  // 像 "50%"、"10vh"、"auto" 这种就不会匹配，从而走下面的原样返回
  const match = val.match(/^(-?\d+(\.\d+)?)(px)?$/);

  if (match) {
    const num = parseFloat(match[1]);
    return num / rootValue + "rem";
  }

  // 4. 其他所有情况（百分比、其他单位、甚至空字符串），原样返回
  return val;
};

/**
 * 动态px转换rem后再根据当前html font-size 转当前页面尺寸下的px
 * @param px 传入数字，或者带 px 后缀的字符串 (如 104, '104px')
 */
export const pxToHtmlPx = (px: string | number): number | string => {
  const rootPx =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  if (typeof px === "number") {
    return parseFloat(px2rem(px)) * rootPx;
  }
  const val = String(px).trim().toLowerCase();

  const match = val.match(/^(-?\d+(\.\d+)?)(px)?$/);
  if (match) {
    const num = parseFloat(match[1]);
    return parseFloat(px2rem(num)) * rootPx;
  }

  return val;
};