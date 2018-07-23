const express = require('express')
const WebSocket = require('ws')

const app = express()
const wss = new WebSocket.Server({ port: 8080 })

app.get('/', (req, res, err) => {
    res.send('GET 5000')
})

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received')
    })
})

app.listen(5050, console.log('server is listening on 5050'))