const config = require('./config');

App({
  globalData: {
    ...config,
    spots: [],
    spotsLoaded: false
  },

  onLaunch() {
    this.loadSpots();
  },

  loadSpots() {
    if (this.globalData.spotsLoaded) return Promise.resolve(this.globalData.spots);
    const apiBase = (this.globalData.apiBase || '').replace(/\/$/, '');
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${apiBase}/api/spots`,
        timeout: 10000,
        success: (response) => {
          const spots = response.data && response.data.spots;
          if (response.statusCode === 200 && Array.isArray(spots)) {
            this.globalData.spots = spots;
            this.globalData.spotsLoaded = true;
            resolve(spots);
          } else {
            reject(new Error('景点数据格式不正确'));
          }
        },
        fail: reject
      });
    });
  }
});
