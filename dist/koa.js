var koa = require('koa');
var proxy = require('koa-proxy');
var serve = require('koa-static');

var app = koa();

app.use(serve('.'));

app.use(proxy({
  host: 'http://127.0.0.1:8001'
}));

app.listen(3000);
