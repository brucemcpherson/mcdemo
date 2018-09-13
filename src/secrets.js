module.exports = ((ns) => {

    ns.memcached = {
        defExpires: 30 * 60 * 2,
        maxExpires: 30 * 60 * 24,
        c9: {
            host: '35.234.151.8:11211', // temporarly exposed for testing 
            silo: 'mcdemo@mcpher.com',
            verbose: true,
        },
        ku: {
            host: 'mcrouter-demo-mcrouter.default.svc.cluster.local:5000',
            silo: 'mcdemo@mcpher.com',
            verbose: false
        }
    };

    return ns;
})({});
