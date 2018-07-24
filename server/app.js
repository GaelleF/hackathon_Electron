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
            player = {'ws': ws, 'pseudo': data.pseudo,'heroes':[], turn:0, heroePlay:{}, adversaire : {}, msgInfo:''}
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
        else if (data.action === 'playHeroe' && games[data.numPartie].length > 1) {
          for (player of games[data.numPartie]) {
            if (player.pseudo === data.pseudo) {
              player.heroePlay = data.heroePlay
              player.turn = data.turn
            } 
            // si les 2 player ont choisit  leur joueur : renvoyer animation(nbFight) et nouveau tableau des heros à chacun!
            //if (games[data.numPartie]))
             // player.ws.send(JSON.stringify({'message':'heroes of your enemy', 'badTeam':data.heroes}))
            } 
            console.log('*playHeroes ************',games[data.numPartie],'* ',games[data.numPartie][0].turn,'* ',games[data.numPartie][1].turn,'* ',games[data.numPartie][0].turn)
            if ((games[data.numPartie][0].turn === games[data.numPartie][1].turn) && games[data.numPartie][0].turn !== 0) {
              console.log('*************FIGHT*****************************')
              const [ player1, player2 ] = games[data.numPartie]
              let nbFight = 0 
              player1.adversaire = player2.heroePlay
              player2.adversaire = player1.heroePlay
              //maj adversaire
              while ( player1.heroePlay.powerstats.combat > 0 && player1.heroePlay.powerstats.combat > 0 ) {
                player1.heroePlay.powerstats.combat -= player2.heroePlay.powerstats.strength
                player2.heroePlay.powerstats.combat -= player1.heroePlay.powerstats.strength
                console.log('player1', player1.heroePlay)
                console.log('player2', player2.heroePlay)
                nbFight += 1
                //suppr heros mort and maj combat heros qui a combattu : badteam goodteam et adversaire
              }
              if (player1.heroePlay.powerstats.combat <= 0) { 
                player1.heroes = player1.heroes.filter(heroe => heroe.id !== player1.heroePlay.id)
                player1.msgInfo = `${player1.heroePlay.name} a perdu ! `
                player2.msgInfo = `${player2.heroePlay.name} a gagné ! `
                // player2.heroes = player2.heroes.forEach(heroe => {if(heroe.id === player2.heroePlay.id){
                // heroe.powerstats.combat = player2.heroePlay.powerstats.combat }!!!!!!!!!!!!!!!!!! A faire !!!!!!!!!!!!!!!!!!!!
                // ajouter phrase personalisé
                console.log('player1 lose', player1.heroes)
                console.log('player1 lose : player2', player2.heroes)

              }

              if (player2.heroePlay.powerstats.combat <= 0) { 
                player2.heroes = player2.heroes.filter(heroe => heroe.id !== player2.heroePlay.id)
                player2.msgInfo = `${player2.heroePlay.name} a perdu ! `
                player1.msgInfo = `${player1.heroePlay.name} a gagné ! `
                console.log('player2 lose', player1.heroes)
              }


              for (player of games[data.numPartie]) {
                player.ws.send(JSON.stringify({'message':'play turn', 'heroes':player.heroes, 'heroePlay': player.heroePlay,'adversaire': player.adversaire, 'nbFight': nbFight, 'msgInfo': player.msgInfo}))
              }




            }

        }
    })
})

app.listen(5050, console.log('server is listening on 5050'))