const starwars = require('./starwars');

module.exports = ((ns) => {

  ns.init = app => {

    // routing
    app.get('/starwars/:resource/:id', function(req, res) {
      starwars.get(req.params.resource, req.params.id)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err.Error));
    });


    app.get('/starwars/:resource', function(req, res) {
      starwars.search(req.params.resource, req.query.search)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err.Error));
    });

  };

  return ns;

})({});
