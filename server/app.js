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
       // console.log('init', data)
        if (data.action === 'connection') {
            player = {'ws': ws, 'pseudo': data.pseudo,'heroes':[], turn:0, heroePlay:{}}
             games[data.numPartie]?games[data.numPartie].push(player):games[data.numPartie]=[player]
            if (games[data.numPartie].length === 2) {
              for (wsConnect of games[data.numPartie]) {
                wsConnect? wsConnect.ws.send(JSON.stringify({'message':'a friend is connect'})) : console.log('y a un pb quelque part!')
              }
            }    
        }
        else if (data.action === 'chooseHeroes') {
          //console.log('choose', data)
          for (player of games[data.numPartie]) {
            if (player.pseudo === data.pseudo) {
              player.heroes = data.heroes
            } 
            else {
              player.ws.send(JSON.stringify({'message':'heroes of your enemy', 'badTeam':data.heroes}))
            } 
          }
            // console.log('heroes', games[data.numPartie])
        }
        else if (data.action === 'playHeroe') {
          for (player of games[data.numPartie]) {
            if (player.pseudo === data.pseudo) {
              player.heroePlay = data.heroePlay
              player.turn = data.turn
            } 
            // si les 2 player ont choisit leur joueur : renvoyer animation(nbFight) et nouveau tableau des heros à chacun!
            //if (games[data.numPartie]))
             // player.ws.send(JSON.stringify({'message':'heroes of your enemy', 'badTeam':data.heroes}))
            } 
            console.log('*playHeroes ************',games[data.numPartie],'* ',games[data.numPartie][0].turn,'* ',games[data.numPartie][1].turn,'* ',games[data.numPartie][0].turn)
            if ((games[data.numPartie][0].turn === games[data.numPartie][1].turn) && games[data.numPartie][0].turn !== 0) {
              console.log('*************FIGHT*****************************')
              const player1 = games[data.numPartie][0]
              const player2 = games[data.numPartie][1]
              let nbFight = 0 
              while ( player1.heroePlay.powerstats.combat > 0 || player1.heroePlay.powerstats.combat > 0 ) {
                player1.heroePlay.powerstats.combat -= player2.heroePlay.powerstats.strength
                player2.heroePlay.powerstats.combat -= player1.heroePlay.powerstats.strength
                console.log('player1', player1.heroePlay)
                console.log('player2', player2.heroePlay)
                nbFight += 1
              }
              





            }

        }
    })
})

app.listen(5050, console.log('server is listening on 5050'))