export interface NavigateConfig {
  /** 跳转地址 */
  url?: string;
  /** 请求方法 */
  method?: 'get' | 'post';
  /** 参数 */
  params?: { [key: string]: any };
  /** 打开方式 */
  target?: '_self' | '_blank' | '_parent' | '_top';
}

/**
 * 使用表单进行页面跳转（如实现 POST 方法打开页面）
 * @param config - 页面跳转配置
 * @param config.url - 跳转地址
 * @param config.method - 请求方法，默认 `post`
 * @param config.params - 参数
 * @param config.target - 打开方式，默认 `_self` 当前页面打开
 */
export function navigateTo(config: NavigateConfig) {
  const {
    url = window.location.href,
    method = 'post',
    params = {},
    target = '_self'
  } = { ...config };
  const inputGroup = document.createDocumentFragment();
  const form = document.createElement('form');

  Object.keys(params || {}).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params[key];
    inputGroup.appendChild(input);
  });

  form.action = url;
  form.method = method;
  form.target = target;
  form.appendChild(inputGroup);
  document.body.appendChild(form);

  form.submit();
}
