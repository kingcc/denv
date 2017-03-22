'use strict';
const register = require('babel-core/register');

register({
  presets: ['stage-3']
});

const app = require('./app.js');

var server = app.listen(3000);
app.wss = (require('./utils/ws.js').wss)(server, ...require('./utils/ws.js').args);
