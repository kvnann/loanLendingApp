var app = {};
var server = require('./lib/server');


app.init = ()=>{
    server.init();
}

app.init();


module.exports = app;