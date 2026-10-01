'use strict';
var CACHE = 'sm64-shell-v2';
var SHELL = ['./', './index.html', './manifest.webmanifest', './sm64.us.js', './sm64.us.wasm'];
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key.indexOf('sm64-shell-') === 0 && key !== CACHE; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(function (response) {
      if (response.ok) caches.open(CACHE).then(function (cache) { cache.put(request, response.clone()); });
      return response;
    }).catch(function () {
      return caches.match(request).then(function (cached) { return cached || caches.match('./index.html'); });
    }));
    return;
  }
  event.respondWith(caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      if (response.ok) { var copy = response.clone(); caches.open(CACHE).then(function (cache) { cache.put(request, copy); }); }
      return response;
    });
  }));
});
