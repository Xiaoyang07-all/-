const { assetUrl } = require('../../utils/api');

Page({
  data: { loading: true, error: '', spots: [], hero: null, featured: [] },

  onShow() {
    const app = getApp();
    if (app.globalData.spotsLoaded) this.applySpots(app.globalData.spots);
    else this.loadSpots();
  },

  loadSpots() {
    this.setData({ loading: true, error: '' });
    getApp().loadSpots().then((spots) => this.applySpots(spots)).catch(() => {
      this.setData({ loading: false, error: '暂时无法连接景点服务，请检查 API 地址' });
    });
  },

  applySpots(spots) {
    const prepared = spots.map((spot) => ({ ...spot, cover: assetUrl(spot.heroImage || spot.cardImage || spot.image) }));
    this.setData({ loading: false, spots: prepared, hero: prepared[0], featured: prepared.slice(1, 5) });
  },

  openDiscover() { wx.switchTab({ url: '/pages/discover/discover' }); },
  openItinerary() { wx.switchTab({ url: '/pages/itinerary/itinerary' }); },
  openSpot(event) { wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` }); },
  onShareAppMessage() { return { title: '豫见中原 · 河南文旅', path: '/pages/index/index' }; }
});
