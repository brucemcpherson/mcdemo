export const routing = {
    init: (app => {

        // routing
        app.get('/', function(req, res) {
            res.send('Hello World');
        });

    })
};
