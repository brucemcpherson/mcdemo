const fetcher = require('./fetcher');


module.exports = ((ns) => {

    // star wars root url
    ns.base = 'http://swapi.co/api/';

    // do a search
    ns.search = (resource, query) => fetcher.get(`${ns.base}${resource}?search=${query}`);

    // do a get by id
    ns.get = (resource, id) => fetcher.get(`${ns.base}${resource}/${id}`);

    return ns;

})({});
