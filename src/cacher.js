const hasher = require("object-hash");
const memjs = require('memjs');
const secrets = require('./secrets');

module.exports = ((ns) => {

  // initialize
  ns.init = (mode) => {
    // possible that memcached not supported
    const host = secrets.memcached[mode].host;
    ns.client = host ? memjs.Client.create(host) : null;
    // to seperate caches in different environments
    ns.silo = secrets.memcached[mode].silo;
    ns.verbose = secrets.memcached[mode].verbose;
    return ns;
  };

  // try to get from cache
  ns.get = (key) => {

    // cache not supported
    if (!ns.client) return Promise.resolve(null);

    // normalize the key
    const hashKey = ns.getKey(key);

    // get it
    return new Promise((resolve, reject) => {

      ns.client.get(hashKey, (err, val) => {
        if (err) {
          reject(err);
        }
        else {
          if (val !== null) {
            try {
              const ob = JSON.parse(val.toString());
              if (ns.verbose) console.log("hit:", key, hashKey);
              resolve(ob.value);
            }

            catch (err) {
              reject(err);
            }
          }
          else {
            resolve(null);
          }
        }
      });
    });
  };

  /** put to memcached
   * @param {string} key the key
   * @param {object} vob the value object to store
   * @param {number} expires no of secs to expire
   * @return {string} result from memjs (true)
   */
  ns.put = (key, vob, expires) => {

    // not every environment supports memcache
    if (!ns.client) return Promise.resolve(null);

    // dont bother registering undefined or null obs
    if (typeof vob === typeof undefined || vob === null) return Promise.resolve(null);

    // normalize the key
    const hashKey = ns.getKey(key);

    // set it
    return new Promise((resolve, reject) => {

      try {
        ns.client.set(hashKey, JSON.stringify({ value: vob }), ns.makeExpires(expires), (err, val) => {
          if (err) {
            reject(err);
          }
          else {
            if (ns.verbose) console.log("cached:", key, hashKey);
            resolve(vob);
          }
        });
      }
      catch (err) {
        reject(err);
      }
    });
  };

  /**stats
   * @return {string} result from the memcache
   */
  ns.stats = () => {

    // not every environment supports memcache
    if (!ns.client) return Promise.resolve(null);

    // set it
    return new Promise((resolve, reject) => {
      ns.client.stats((err, val, stats) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(stats);
        }
      });
    });
  };


  /**flush
   * @return {string} result from the memcache
   */
  ns.flush = () => {

    // not every environment supports memcache
    if (!ns.client) return Promise.resolve(null);

    // set it
    return new Promise((resolve, reject) => {
      ns.client.flush((err, val) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(val);
        }
      });
    });
  };

  /** remove from memcached
   * @param {string} key 
   * @return {object} result from the store
   */
  ns.remove = (key) => {

    // not every environment supports memcache
    if (!ns.client) return Promise.resolve(null);

    // normalize the key
    const hashKey = ns.getKey(key);

    // set it
    return new Promise((resolve, reject) => {
      ns.client.delete(hashKey, (err, val) => {
        if (err) {
          reject(err);
        }
        else {
          if (val) {
            try {
              const ob = JSON.parse(val.toString());
              if (ns.verbose) console.log("removed:", key, hashKey);
              resolve(ob.value);
            }
            catch (err) {
              reject(err);
            }
          }
          else {
            resolve(null);
          }
        }
      });
    });
  };

  ns.makeExpires = (expires) => {
    if (!ns.client) return Promise.resolve(null);
    expires = typeof expires === typeof undefined ? secrets.memcached.defExpires : expires;
    if (expires > secrets.memcached.maxExpires) {
      console.log('expires ', expires, ' reduced to ', secrets.memcached.maxExpires);
      expires = secrets.memcached.maxExpires;
    }
    return { expires };
  };

  // standardize getting a key to use
  ns.getKey = (url) => hasher({
    silo: ns.silo,
    url
  });


  return ns;

})({});
