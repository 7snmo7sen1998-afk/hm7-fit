/* HM Fit service worker — offline cache */
const CACHE = 'hmfit-v30';
const ASSETS = ['./', './index.html', './manifest.json', './hm-logo-192.png', './hm-logo-512.png', './hero-bg.jpg', './howto.jpg', './cardio-run.jpg', './ex/01.jpg', './ex/02.jpg', './ex/03.jpg', './ex/04.jpg', './ex/05.jpg', './ex/06.jpg', './ex/07.jpg', './ex/08.jpg', './ex/09.jpg', './ex/10.jpg', './ex/11.jpg', './ex/12.jpg', './ex/13.jpg', './ex/14.jpg', './ex/15.jpg', './ex/16.jpg', './ex/17.jpg', './ex/18.jpg', './ex/19.jpg', './ex/20.jpg', './ex/21.jpg', './ex/22.jpg', './ex/23.jpg', './ex/24.jpg', './ex/25.jpg', './ex/26.jpg', './ex/27.jpg', './ex/28.jpg', './ex/29.jpg', './ex/30.jpg', './ex/31.jpg', './ex/32.jpg', './ex/33.jpg', './ex/34.jpg', './ex/35.jpg', './ex/36.jpg', './ex/37.jpg', './ex/38.jpg', './ex/39.jpg', './ex/40.jpg', './ex/41.jpg', './ex/42.jpg', './ex/43.jpg', './ex/44.jpg', './ex/45.jpg', './ex/46.jpg', './ex/47.jpg', './ex/48.jpg', './ex/49.jpg', './ex/50.jpg', './ex/51.jpg', './ex/52.jpg', './ex/53.jpg', './ex/54.jpg', './ex/55.jpg', './ex/56.jpg', './ex/57.jpg', './ex/58.jpg', './ex/59.jpg', './ex/60.jpg', './ex/61.jpg', './ex/62.jpg', './ex/63.jpg', './ex/64.jpg', './ex/65.jpg', './ex/66.jpg', './ex/67.jpg', './ex/68.jpg', './ex/69.jpg', './ex/70.jpg', './ex/71.jpg', './ex/72.jpg', './ex/73.jpg', './ex/74.jpg', './ex/75.jpg', './ex/76.jpg', './ex/77.jpg', './ex/78.jpg', './ex/79.jpg', './ex/80.jpg', './ex/81.jpg', './ex/82.jpg', './ex/83.jpg', './ex/84.jpg', './ex/85.jpg'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (url.indexOf('raw.githubusercontent.com/yuhonas/free-exercise-db') !== -1) {
    e.respondWith(caches.open('hmfit-img').then(function (c) {
      return c.match(e.request).then(function (hit) {
        if (hit) return hit;
        return fetch(e.request).then(function (res) {
          if (res && res.ok) c.put(e.request, res.clone());
          return res;
        }).catch(function(){ return caches.match(e.request); });
      });
    }));
    return;
  }
  // الصفحة نفسها: من النت الأول (عشان التحديثات توصل)، ولو مفيش نت من الكاش
  var isPage = e.request.mode === 'navigate' || /\/(index\.html)?(\?.*)?$/.test(new URL(url).pathname + new URL(url).search);
  if (isPage && new URL(url).origin === self.location.origin) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) { var cp = res.clone(); var cp2 = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); c.put('./index.html', './manifest.json', cp2); }); }
      return res;
    }).catch(function () { return caches.match(e.request).then(function (hit) { return hit || caches.match('./index.html'); }); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request); }));
});
