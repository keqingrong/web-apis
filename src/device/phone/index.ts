/**
 * 拨打电话
 * @param phoneNumber 电话号码
 * 在 iPhone 上可能会提示 "已阻止此网站进行自动通话。"
 */
export function makePhoneCall(phoneNumber: string) {
  const link = document.createElement('a');
  link.href = `tel:${phoneNumber}`;
  link.dispatchEvent(new MouseEvent('click'));
}
