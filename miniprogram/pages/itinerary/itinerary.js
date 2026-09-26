const storage = require('../../utils/storage');
const { assetUrl } = require('../../utils/api');

Page({
  data: { entries: [], empty: true },
  onShow() { this.refresh(); },
  refresh() {
    const spots = getApp().globalData.spots || [];
    const entries = storage.itinerary().map((entry, index) => {
      const spot = spots.find((item) => item.id === entry.spotId);
      return { ...entry, name: spot ? spot.name : entry.spotName, city: spot ? spot.city : '', cover: spot ? assetUrl(spot.cardImage || spot.image) : '', position: index === 0 ? 'NEXT' : `STOP ${index + 1}` };
    });
    this.setData({ entries, empty: !entries.length });
  },
  openSpot(event) { wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` }); },
  remove(event) {
    storage.removeItinerary(event.currentTarget.dataset.id);
    this.refresh();
    wx.showToast({ title: '已移除', icon: 'none' });
  },
  discover() { wx.switchTab({ url: '/pages/discover/discover' }); }
});
