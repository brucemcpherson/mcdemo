const axios = require('axios');
const cacher = require('./cacher');
const secrets = require('./secrets');

module.exports = ((ns) => {

  ns.init = (mode) => {
    ns.verbose = secrets.memcached[mode].verbose;
    return ns;
  };
  // wrapper to try cache first
  ns.cacheWrapper = (url, action) => cacher.get(url)
    .then(r => {
      return r || action(url).then(result => cacher.put(url, result));
    });

  // first attempt will be from cache
  ns.get = (url) => ns.timeWrapper(url, (url) => ns.getter(url));

  // have to go to the api
  ns.getter = (url) => axios.get(url).then(result => result.data);

  ns.timeWrapper = (url, action) => {
    const now = new Date().getTime();
    return ns.cacheWrapper(url, action)
      .then(r => {
        if (ns.verbose) {
          console.log(new Date().getTime() - now, "ms to complete");
        }
        return r;
      });


  };
  return ns;

})({});
