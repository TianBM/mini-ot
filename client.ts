var ReconnectingWebSocket = require('reconnecting-websocket')
var ShareDB = require('sharedb/lib/client')
var webSocket = require('ws')
var type = require('./ot-type').type

ShareDB.types.register(type as any)

const wsLink = 'ws://localhost:8080'

const newTree: any[] = []


console.log('start link', wsLink)

var socket = new ReconnectingWebSocket(wsLink, [], {
  WebSocket: webSocket
})
var connection = new ShareDB.Connection(socket)

const ops = [
  { type: 'insert_node', path: [0], newNode: { id: 1, content: '1' } },
  { type: 'insert_node', path: [0,0], newNode: { id: 2, content: '2' } },
  { type: 'insert_node', path: [0,0,0], newNode: { id: 3, content: '3' } },
  { type: 'insert_node', path: [0,0,0,0], newNode: { id: 4, content: '4' } },
  { type: 'insert_node', path: [0,0,0,0,0], newNode: { id: 5, content: '5' } },
];

const test = (docId: string, isTest: boolean) => {
  console.log('========================> start test: doc', docId)

  var doc = connection.get('ot', docId)

  doc.subscribe((error: any) => {
    if (error) return console.error(error)

    if (!doc.type) {
      doc.create(newTree, 'tree')

      submitOps(doc, isTest)
    } else {
      console.log('doc exists')

      submitOps(doc, isTest)
    }
  });

  doc.on('op', (op: any) => {
    console.log('data', JSON.stringify(doc.data))
  })
}

const submitOps = (doc: any, isTest: boolean) => {
  console.log('start submit ops')

  ops.forEach((op, index) => {

    if (isTest) {
      doc.submitOp([op], (error: any) => {
        if (error) return console.error(error)
        console.log('op submitted', op)
      })
    } else {

      setTimeout(() => {
        doc.submitOp([op], (error: any) => {
          if (error) return console.error(error)
          console.log('op submitted', op)
        })
      }, 1000 * index)
    }
  })
}

test('normal', false)

setTimeout(() => {
  test('test', true)
}, 7000)
