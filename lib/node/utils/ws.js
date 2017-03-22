const
  url = require('url'),
  ws = require('ws'),
  log = require('./logger.js'),
  Cookies = require('cookies'),
  WebSocketServer = ws.Server;

function parseUser(obj) {
  if (!obj) {
    return;
  }
  log('try parse: ' + obj);
  let s = '';
  if (typeof obj === 'string') {
    s = obj;
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null);
    s = cookies.get('name');
  }
  if (s) {
    try {
      let user = JSON.parse(Buffer.from(s, 'base64').toString());
      log(`User: ${user.name}, ID: ${user.id}`);
      return user;
    } catch (e) {
      // ignore
    }
  }
}

function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
  let wss = new WebSocketServer({
    server: server
  });
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };
  onConnection = onConnection || function() {
    log('[WebSocket] connected.');
  };
  onMessage = onMessage || function(msg) {
    log('[WebSocket] message received: ' + msg);
  };
  onClose = onClose || function(code, message) {
    log(`[WebSocket] closed: ${code} - ${message}`);
  };
  onError = onError || function(err) {
    log('[WebSocket] error: ' + err);
  };
  wss.on('connection', function(ws) {
    let location = url.parse(ws.upgradeReq.url, true);
    log('[WebSocketServer] connection: ' + location.href);
    ws.on('message', onMessage);
    ws.on('close', onClose);
    ws.on('error', onError);
    if (location.pathname !== '/ws/chat') {
      // close ws:
      ws.close(4000, 'Invalid URL');
    }
    // check user:
    let user = parseUser(ws.upgradeReq);
    if (!user) {
      ws.close(4001, 'Invalid user');
    }
    ws.user = user;
    ws.wss = wss;
    onConnection.apply(ws);
  });
  log('WebSocketServer was attached.');
  return wss;
}

var messageIndex = 0;

function createMessage(type, user, data) {
  messageIndex++;
  return JSON.stringify({
    id: messageIndex,
    type: type,
    user: user,
    data: data
  });
}

function onConnect() {
  let user = this.user;
  let msg = createMessage('join', user, `${user.name} joined.`);
  this.wss.broadcast(msg);
  // build user list:
  let users = this.wss.clients.map(function(client) {
    return client.user;
  });
  this.send(createMessage('list', user, users));
}

function onMessage(message) {
  log(message);
  if (message && message.trim()) {
    let msg = createMessage('chat', this.user, message.trim());
    this.wss.broadcast(msg);
  }
}

function onClose() {
  let user = this.user;
  let msg = createMessage('left', user, `${user.name} is left.`);
  this.wss.broadcast(msg);
}

module.exports = { wss: createWebSocketServer, args: [onConnect, onMessage, onClose], parseUser: parseUser };
