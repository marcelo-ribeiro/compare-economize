if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>n(e,i),o={module:{uri:i},exports:c,require:r};s[i]=Promise.all(t.map((e=>o[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-5afaf374"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/IJ_reJHgOxZEyxzHAqwtb/_buildManifest.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/IJ_reJHgOxZEyxzHAqwtb/_middlewareManifest.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/IJ_reJHgOxZEyxzHAqwtb/_ssgManifest.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/framework-91d7f78b5b4003c8.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/main-dd929e56e2475db0.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/pages/_app-66c80d3214ff0ae3.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/pages/_error-2280fa386d040b66.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/pages/index-4855b407f7ba8479.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/chunks/webpack-514908bffb652963.js",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/_next/static/css/68c2d6aa280211e5.css",revision:"IJ_reJHgOxZEyxzHAqwtb"},{url:"/favicon.png",revision:"cba2280a6351a2052d790309003aa32c"},{url:"/icons/apple-touch-icon.png",revision:"aa3d99c432c90f95846ebbea23ca6694"},{url:"/icons/favicon-16x16.png",revision:"cba2280a6351a2052d790309003aa32c"},{url:"/icons/favicon-32x32.png",revision:"cba2280a6351a2052d790309003aa32c"},{url:"/icons/icon-192x192.png",revision:"aa3d99c432c90f95846ebbea23ca6694"},{url:"/icons/icon-512x512.png",revision:"982d42fd1ee5f33b7d414b53907158d5"},{url:"/manifest.json",revision:"90ca17efcec725e70a4a64fb4026549c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
