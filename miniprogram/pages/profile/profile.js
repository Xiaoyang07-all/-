const storage = require('../../utils/storage');

Page({
  data: { bookmarkCount: 0, itineraryCount: 0, apiBase: '' },
  onShow() {
    const app = getApp();
    this.setData({ bookmarkCount: storage.bookmarks().length, itineraryCount: storage.itinerary().length, apiBase: app.globalData.apiBase });
  },
  clearLocalData() {
    wx.showModal({ title: '清空本机数据', content: '会删除收藏和行程，是否继续？', success: (result) => {
      if (!result.confirm) return;
      wx.removeStorageSync('yujian_bookmarks');
      wx.removeStorageSync('yujian_itinerary');
      this.onShow();
      wx.showToast({ title: '已清空', icon: 'none' });
    } });
  },
  openDiscover() { wx.switchTab({ url: '/pages/discover/discover' }); }
});
