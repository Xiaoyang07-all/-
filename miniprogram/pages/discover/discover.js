const { assetUrl } = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: { loading: true, error: '', query: '', category: '全部', categories: ['全部', '人文古迹', '山水胜境', '宋韵生活', '我的收藏'], spots: [] },

  onShow() {
    const app = getApp();
    if (app.globalData.spotsLoaded) this.applySpots(app.globalData.spots);
    else this.loadSpots();
  },

  loadSpots() {
    this.setData({ loading: true, error: '' });
    getApp().loadSpots().then((spots) => this.applySpots(spots)).catch(() => this.setData({ loading: false, error: '暂时无法连接景点服务' }));
  },

  applySpots(spots) {
    this.allSpots = spots.map((spot) => ({ ...spot, cover: assetUrl(spot.cardImage || spot.image) }));
    this.filterSpots();
  },

  filterSpots() {
    const { query, category } = this.data;
    const needle = query.trim().toLowerCase();
    const spots = (this.allSpots || []).filter((spot) => {
      const categoryMatch = category === '全部' || (category === '我的收藏' ? storage.isBookmarked(spot.id) : spot.category === category);
      const textMatch = !needle || `${spot.name} ${spot.city} ${spot.tagline}`.toLowerCase().includes(needle);
      return categoryMatch && textMatch;
    }).map((spot) => ({ ...spot, bookmarked: storage.isBookmarked(spot.id) }));
    this.setData({ loading: false, spots });
  },

  onSearch(event) { this.setData({ query: event.detail.value }, () => this.filterSpots()); },
  selectCategory(event) { this.setData({ category: event.currentTarget.dataset.category }, () => this.filterSpots()); },
  openSpot(event) { wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` }); },
  toggleBookmark(event) {
    storage.toggleBookmark(event.currentTarget.dataset.id);
    this.filterSpots();
    wx.showToast({ title: '已更新收藏', icon: 'none' });
  }
});
