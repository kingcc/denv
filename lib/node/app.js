const
  Koa = require('koa'),
  bodyParser = require('koa-bodyparser'),

  controller = require('./controller'),
  templating = require('./templating'),
  rest = require('./utils/rest'),
  log = require('./utils/logger'),

  parseUser = require('./utils/ws').parseUser,

  app = new Koa(),
  isProduction = process.env.NODE_ENV === 'production';

// log request URL:

app.use(async(ctx, next) => {
  log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  var
    start = new Date().getTime(),
    execTime;
  await next();
  execTime = new Date().getTime() - start;
  ctx.response.set('X-Response-Time', `${execTime} ms`);
});

// parse user from cookie:
app.use(async(ctx, next) => {
  ctx.state.user = parseUser(ctx.cookies.get('name') || '');
  await next();
});

// static file support:
if (!isProduction) {
  let staticFiles = require('./static-files');
  app.use(staticFiles('/static/', __dirname + '/static'));
}

// bind .rest() for ctx:
app.use(rest.restify());

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
  cache: !isProduction
    // ,watch: !isProduction
}));

// add controller:
app.use(controller());

module.exports = app;
