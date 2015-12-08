// Here we add an event listener for the "install" event. 
// Once it registers successfully, it will automatically 
// install the service worker for you. Cool!

this.addEventListener('install', function(event) {
    console.log('installing....');

    // Here we are once again using promises! the event 
    // object has a waitUntil property that is a promise. 
    // This promise waits until the cache portions (below) // are populated before declaring the service worker 
    // "installed!"

    event.waitUntil(

        // See this 'v1' here? That's the version of your 
        // Service Worker cache. If you ever need to add 
        // new dependencies in the future, you'll have to 
        // use the "delete" functionality below and make 
        // this a 'v2' //(or whatever you wish to call it.

        caches.open('v1').then(function(cache) {
            return cache.addAll([
                //  These are the files we want to cache so // we can access offline! For your project 
                // you'll need to add your own. You can 
                // include any file you wish here.
                'index.html',
                'page_script.js',
                'style.css',
                'index.html',
                '/images/set1.jpg',
                '/images/set2.jpg',
                '/images/set3.jpg'
            ]);
        })
    );
});


// This is where the really cool stuff happens. We make use 
// of the Fetch API in order to first check the cached 
// resources, then if those don't exist, we check the 
// server, if we are online. Essentially, this is great for 
// both offline mode as well as from a site speed 
// standpoint!

this.addEventListener('fetch', function(event) {
    // Full documentation for respondWith is available on 
    // MDN (http://mzl.la/1SKtV92), but basically with this
    // you are able to customize the response from the 
    // request you initially get by the browser.

    event.respondWith(

    // caches.open look familiar? It should! We just used 
    // it in the code above! Here we are finding a match 
    // for the event.request in our cached v1 storage (in 
    // the browser). 
    //
    // If we find a match for the request in the cache 
    // storage, that means our service worker will serve 
    // that file right up from the browser itself rather 
    // than going alllll the way to the server to get it! 
    // NICE!!!

    // However, if the resource isn't found, then it WILL 
    // go ALLLL the way to the server to grab it, or if 
    // it's in offline mode, will break and not show the 
    // file. Bummer!

        caches.open('v1').then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

// An event listener for the 'activate' functionality that
// goes along with Service Worker registration. 

this.addEventListener('activate', function activator(event) {
    console.log('activate!');

    // Here we see another wait until....
    event.waitUntil(

        // I won't go too much into detail here because 
        // there's a lot of stuff you can look up yourself // (filter() and map() being two of them), but 
        // basically this function is in case there's 
        // previously cached content, then we get rid of 
        // it and populate it with the newest cached 
        // content. This is only if you need them to 
        // install a v2, v3, v4, etc... In a nutshell it 
        // wipes out their previous cache and replaces it 
        // with the new version. 
        
        caches.keys().then(function(keys) {
            return Promise.all(keys
                .filter(function(key) {
                    return key.indexOf('v1') !== 0;
                })
                .map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});
