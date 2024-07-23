var ShareDB = require("sharedb");
var type = require("./ot-type").type;

ShareDB.types.register(type);

var express = require('express')
// @ts-ignore
var WebSocket = require('ws')
var http = require('http')
var WebSocketJSONStream = require('@teamwork/websocket-json-stream')

var app = express()
var server = http.createServer(app)
// @ts-ignore
var webSocketServer = new WebSocket.Server({server: server})

var backend = new ShareDB()
webSocketServer.on('connection', (webSocket: any) => {
  var stream = new WebSocketJSONStream(webSocket)
  backend.listen(stream)
})

server.listen(8080)

console.log('Listening on localhost:8080')

// get ops
backend.use('commit', (request: any, callback: any) => {
  console.log('commit', JSON.stringify(request.op))
  backend.db.getSnapshot(request.collection, request.id,  null, null, (err: any, snapshot: any) => {
    if (err) {
      console.error(err)
      return callback(err)
    }
    console.log('snapshot', JSON.stringify(snapshot))
  })
  callback()
})
