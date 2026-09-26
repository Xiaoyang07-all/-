function getAppConfig() {
  const app = getApp();
  return app && app.globalData ? app.globalData : { apiBase: '' };
}

function request(path, options = {}) {
  const apiBase = (getAppConfig().apiBase || '').replace(/\/$/, '');
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${apiBase}${path}`,
      timeout: options.timeout || 10000,
      method: options.method || 'GET',
      data: options.data,
      header: { 'content-type': 'application/json', ...(options.header || {}) },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data);
        } else {
          reject(new Error(response.data && response.data.error ? response.data.error : `请求失败（${response.statusCode}）`));
        }
      },
      fail: reject
    });
  });
}

function assetUrl(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const apiBase = (getAppConfig().apiBase || '').replace(/\/$/, '');
  return `${apiBase}${value.startsWith('/') ? value : `/${value}`}`;
}

module.exports = { request, assetUrl };
