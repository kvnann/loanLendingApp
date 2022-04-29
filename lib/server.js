var http = require("http");
const { StringDecoder } = require("string_decoder");
var url = require("url");
var config = require("./config");
var util = require('util');
var debug = util.debuglog('server');
var handlers = require('./handlers');
var helpers = require("./helpers");

var server = {};

server.httpServer = http.createServer((req,res)=>{
    var parsedUrl = url.parse(req.url,true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    var queryStringObject = parsedUrl.query;

    var method = req.method.toLowerCase();

    var headers = req.headers;

    if(headers.token != undefined){
      if(headers.token.indexOf(",") > -1){
        headers.token = headers.token.split(",")[0]
      }
    }

    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data' , (data)=>{
        buffer += decoder.write(data)
    });
    req.on('end' , ()=>{
        buffer += decoder.end();

        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data,(statusCode,payload,contentType)=>{
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            var payloadString = ''
            if(contentType == 'json'){
                res.setHeader('Content-Type', 'application/json');
                payload = typeof(payload) == 'object'? payload : {};
                payloadString = JSON.stringify(payload);
              }
     
              if(contentType == 'html'){
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) == 'string'? payload : '';
              }
     
              if(contentType == 'favicon'){
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
              if(contentType == 'plain'){
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
              if(contentType == 'css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
              if(contentType == 'png'){
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
              if(contentType == 'jpg'){
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }

              res.writeHead(statusCode);
              res.end(payloadString);

              if(statusCode == 200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
              } else {
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
              }
        })


    });


});


server.router = {
    '' : handlers.index,
    'account/create' : handlers.accountCreate,
    'account/edit' : handlers.usersEdit,
    'account/deleted' : handlers.accountDeleted, 
    'myaccount' : handlers.myaccount,
    'home' : handlers.home,
    'myaccount' : handlers.myaccount,
    'explore' : handlers.explore,
    'session/deleted' : handlers.sessionDeleted,
    'posts/create' : handlers.createPost,
    'posts/edit' : handlers.postsEdit,
    'ping' : handlers.ping,
    'api/users' : handlers.users,
    'api/tokens' : handlers.tokens,
    'api/posts' : handlers.posts,
    'payment' : handlers.payment,
    'post':handlers.post,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public,
    'api/buy' : handlers.buy
}

server.init = ()=>{
    server.httpServer.listen(config.httpPort,function(){
      console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+config.httpPort);
    });
  
};


module.exports = server;