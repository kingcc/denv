const pug = require('pug');

function templating(path, opts) {
  return async(ctx, next) => {
    ctx.render = function(view, model) {
      ctx.response.body = pug.renderFile(`${path}/${view}.pug`, model);
      ctx.response.type = 'text/html';
    };
    await next();
  };
}

module.exports = templating;
