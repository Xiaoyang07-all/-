const BOOKMARKS_KEY = 'yujian_bookmarks';
const ITINERARY_KEY = 'yujian_itinerary';

function read(key) {
  try { return wx.getStorageSync(key) || []; } catch (_) { return []; }
}

function write(key, value) {
  wx.setStorageSync(key, value);
  return value;
}

function bookmarks() { return read(BOOKMARKS_KEY); }
function isBookmarked(id) { return bookmarks().includes(id); }
function toggleBookmark(id) {
  const current = bookmarks();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  return write(BOOKMARKS_KEY, next);
}
function itinerary() { return read(ITINERARY_KEY); }
function addItinerary(item) {
  const current = itinerary().filter((entry) => entry.spotId !== item.spotId);
  return write(ITINERARY_KEY, [...current, item].sort((a, b) => a.date.localeCompare(b.date)));
}
function removeItinerary(id) {
  return write(ITINERARY_KEY, itinerary().filter((entry) => entry.spotId !== id));
}

module.exports = { bookmarks, isBookmarked, toggleBookmark, itinerary, addItinerary, removeItinerary };
