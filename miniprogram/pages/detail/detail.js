const { assetUrl } = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: { loading: true, spot: null, gallery: [], galleryDisplay: [], bookmarked: false, planned: false, date: '' },

  onLoad(options) {
    this.spotId = options.id;
    this.loadSpot();
  },

  loadSpot() {
    const app = getApp();
    const ready = app.globalData.spotsLoaded ? Promise.resolve(app.globalData.spots) : app.loadSpots();
    ready.then((spots) => {
      const spot = spots.find((item) => item.id === this.spotId);
      if (!spot) throw new Error('景点不存在');
      this.spot = spot;
      const gallery = (spot.gallery || []).map((item) => assetUrl(item.src || item));
      this.setData({ loading: false, spot: { ...spot, cover: assetUrl(spot.image || spot.cardImage) }, gallery, galleryDisplay: gallery.length ? gallery : [assetUrl(spot.image || spot.cardImage)], bookmarked: storage.isBookmarked(spot.id), planned: storage.itinerary().some((item) => item.spotId === spot.id), date: this.defaultDate() });
    }).catch(() => this.setData({ loading: false, error: '景点加载失败' }));
  },

  defaultDate() {
    const date = new Date(Date.now() + 86400000);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  toggleBookmark() {
    const bookmarked = storage.toggleBookmark(this.spot.id).includes(this.spot.id);
    this.setData({ bookmarked });
    wx.showToast({ title: bookmarked ? '已收藏景点' : '已取消收藏', icon: 'none' });
  },

  onDateChange(event) { this.setData({ date: event.detail.value }); },
  toggleItinerary() {
    if (this.data.planned) {
      storage.removeItinerary(this.spot.id);
      this.setData({ planned: false });
      wx.showToast({ title: '已从行程移除', icon: 'none' });
      return;
    }
    storage.addItinerary({ spotId: this.spot.id, date: this.data.date, spotName: this.spot.name });
    this.setData({ planned: true });
    wx.showToast({ title: '已加入行程', icon: 'none' });
  },

  openMap() {
    wx.openLocation({ latitude: Number(this.spot.latitude), longitude: Number(this.spot.longitude), name: this.spot.name, address: this.spot.address });
  },
  onShareAppMessage() { return { title: `${this.spot.name} · 豫见中原`, path: `/pages/detail/detail?id=${this.spot.id}`, imageUrl: this.data.spot.cover }; }
});
