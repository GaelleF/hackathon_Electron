const express = require('express')
const WebSocket = require('ws')

const app = express()
const wss = new WebSocket.Server({ port: 8080 })
const games = {}

app.get('/', (req, res, err) => {
    res.send('GET 5000')
})

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        data = JSON.parse(message)
        player = {'ws': ws, 'pseudo': data.pseudo}
        games[data.numPartie]?games[data.numPartie].push(player):games[data.numPartie]=[player]
       console.log('g1', games)
        if (games[data.numPartie].length === 2) {

            console.log(games)
            for (wsConnect of games[data.numPartie]) {
                wsConnect? wsConnect.ws.send('a friend is connect') : console.log('y a un pb quelque part!')
            }
        }
        console.log(games)
    })
})

app.listen(5050, console.log('server is listening on 5050'))