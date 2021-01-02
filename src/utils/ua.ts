/**
 * 判断是否是iOS系统（iPhone/iPod/iPad）
 */
export function isiOS() {
  // TODO: 确认 iPod touch/iPad 的 UA，iPad 已经拆分出 iPadOS 不是 iOS
  const detectiOS = (str: string) => str.match(/iPhone|iPod|iPad/i) !== null;
  return detectiOS(navigator.userAgent) || detectiOS(navigator.platform);
}

/**
 * 判断是否是Android系统
 */
export function isAndroid() {
  return /(Android)/i.test(navigator.userAgent);
}

/**
 * 判断是否是桌面平台，如 Windows、macOS、Linux
 */
export function isDesktop() {
  return /(Win32|Win64|MacIntel|Linux i686|Linux x86_64)/i.test(
    navigator.platform
  );
}
