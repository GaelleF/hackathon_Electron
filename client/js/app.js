/* decla variable*/
let persoTeam = []
let imagePerso=[]
let imageBad =[]
let badTeam =[]
let numPartie = ''
let Pseudo = ''
let msgSocket = ''
let turn = 0
let finish = true
let adversaire = {}
let imageHeroeSelect = {}

const map_element =document.getElementById('map_container')
const fightScreenElt = document.getElementById("fightScreen")
const fightScreen = document.getElementById("fightScreen")
const injectHeroes = document.getElementById('select_heroes')
const choix = document.getElementById('choice')
const injectTeamHeroes = document.getElementById('teamPerso')
const elem1 =document.getElementById('tour')
const elem2 =document.getElementById('gare')
const elem3 =document.getElementById('WCS')
const btn = document.getElementById('btn_next')
const btn2 = document.getElementById('btn_next2')
const story1 = document.getElementById('story')
const connexionDiv = document.getElementById('connexion')

/*connexion webSocket *******************************/
const connectionSocket = new WebSocket('ws://localhost:8080','incoming')
connectionSocket.onmessage = (event) => {
  console.log('event', event)
  message = JSON.parse(event.data).message
  const infoSocketDiv = document.getElementById('infoSocket')
  msgSocket = JSON.parse(event.data).message
  console.log(msgSocket)
  infoSocketDiv.innerHTML = `message from socket : ${msgSocket}`

  if (message === 'heroes of your enemy') {
    badTeam = JSON.parse(event.data).badTeam
    console.log('badteam')
  }
  if (message === 'play turn') {
    let  data = JSON.parse(event.data)
    console.log('PLAY TURN ', data.message, data)
    let nbFight = data.nbFight
    imageBad =[]
    createPicturePerso(data.adversaire, imageBad)
    let badPerso = imageBad[0]
    console.log('pre anim bad', badPerso, imageBad)
    for (let i = 0; i < nbFight; i++) {
      console.log('ANIMATION', nbFight)
      animation(imageHeroeSelect, badPerso, 400, 275, 450, 575, 900, i*1630)
    }
      setTimeout(() => {
        console.log('msgInfo', data.msgInfo)
        persoTeam = data.heroes
        imageBad = []
        imagePerso=[]
      
        fightScreen.removeChild(document.getElementById('divZoneId'))
        fightScreen.removeChild(document.getElementById('divPersoId'))
        lancerCombat('image/eiffel_tower.jpg',0)
        finish = true
      },nbFight*1630)
    }
  

}

const reset = () => {
	fightScreenElt.innerHTML = ""
	injectHeroes.innerHTML = ""
	choix .innerHTML = ""
	injectTeamHeroes.innerHTML = ""
	btn.innerHTML = ""
	btn2.innerHTML = ""
	map_container.innerHTML = ""
	elem1.innerHTML = ""
	elem2.innerHTML = ""
	elem3.innerHTML = ""
  story1.innerHTML = ""
  connexionDiv.innerHTML = ""
}


/*création zone de fight*/

const createDivPerso = () => {
	let divPerso = document.createElement("div")
	divPerso.style.backgroundColor = "black"
	divPerso.style.height = "1260px"
	divPerso.style.width = "350px"
	divPerso.id="divPersoId"
	fightScreen.appendChild(divPerso)
}
const createDivZone = (urlBack) => {
	let divZone = document.createElement("div")
	divZone.style.backgroundImage = "url('image/eiffel_tower.jpg')"
	divZone.style.height = "1260px"
	divZone.style.position ="absolute"
	divZone.style.top="0px"
	divZone.style.left="360px"
	divZone.style.width = "1400px"
	divZone.id="divZoneId"
	fightScreen.appendChild(divZone)
}

/* création perso*/
const createPicturePerso = (perso,tab) => {
	let img = new Image()
  img.src = perso.images.sm 
	if (tab.length<6){tab.push(img)}
}

const placerPerso = (persoImg,posX, posY,emplacement,parent)=>{
	persoImg.style.position = "absolute";
	persoImg.style.top = posX;
  persoImg.style.left = posY;
  if (parent === 'divZoneId') {
    persoImg.className = 'imgChildZone'
  }
  else {persoImg.className = 'imgChildPerso'}
	emplacement.appendChild(persoImg);
}

//div avec caractéristiques
const caractere = (perso) => {
	let divCaract = document.createElement("div")
	divCaract.style.color = "white"
	divCaract.style.width = "150px"
	divCaract.classList.add("caractClass")
	divCaract.innerHTML = `<p>${perso.name} </p>
							<p>life : ${perso.powerstats.combat} </p>
							<p> attack : ${perso.powerstats.strength}</p>`
	return divCaract
}

const animation = (perso,badPerso,xBeg,xEnd,yBeg,yEnd,yBegBad,time) => {
  let posX = xBeg
  let posY = yBeg
  let posYbad = yBegBad
  const divZoneId = document.getElementById('divZoneId')
  console.log("function moveHeroes")
  console.log(perso)
  const persoSave = perso
  const persoBadSave = badPerso
  //placerPerso(perso,"550px","300px",divZoneId)
  setTimeout(() => {
  const frame = (perso) => {
    if (posX == xEnd) {
      clearInterval(anim)
      setTimeout(()=>{
        placerPerso(persoSave,xBeg+"px",yBeg+"px",divZoneId,'divZoneId')
        placerPerso(persoBadSave,xBeg+"px",yBegBad+"px",divZoneId,'divZoneId')
      },1000)

      /*console.log("retour = ")
      if (retour) {moveHeroe(persoSave,xEnd,xBeg,yEnd,yBeg,"d","m",false)}*/
    }
    else {//utiliser la fonction placerPerso?
      posX--
      posY++
      posYbad--
      /*console.log("frame function"+posX)
        console.log(persoSave)*/
      /*perso.style.top = posX +"px"
      perso.style.left = posY +"px"*/
      placerPerso(persoSave,posX+"px",posY+"px",divZoneId,'divZoneId')
      placerPerso(persoBadSave,posX+"px",posYbad+"px",divZoneId,'divZoneId')
      /*console.log("pos heroes x =" + posX +"y = "+ posY)*/
    }
  }
      const anim = setInterval(frame,5)

}, time)
}
/*lancer la pâge combat avec les perso selectionné */
const lancerCombat=(urlBack,numBad,fnScenario) => {

/*creation du bouton fight si clic sur perso */
	/*const createButtonFight = (perso1,perso2,i,urlB) => {
		let fightButton = document.createElement("input")
			fightButton.setAttribute("name","fightButton")
	    	fightButton.setAttribute("value","FIGHT")
	    	fightButton.setAttribute("type","button")
			fightButton.style.position ="absolute"
			fightButton.style.backgroundColor = "red"
			fightButton.style.fontSize = "24px"
			fightButton.style.padding = "10px"
			fightButton.style.color = "white"
			fightButton.id = "fightButtonId"
			fightButton.style.top="800px"
			fightButton.style.left="700px"
			fightButton.width = "100px"
	    	fightButton.addEventListener("click", (e)=> {
	    		moveHeroe(imagePerso[i],imageBad[numBad],400,275,450,575,900)
	    		// moveHeroe(imageBad[numBad],400,300,900,800,"m","d",true)
	    		
	    		perso1.powerstats.combat -= perso2.powerstats.strength
	    		perso2.powerstats.combat -= perso1.powerstats.strength
	    		if (perso2.powerstats.combat <= 0){
	    				setTimeout(()=> {
	    					console.log("timeout")
	    					divZoneId.innerHTML= ''
	    					divPersoId.innerHTML= ''
	    					//divZoneId.removeChild(perso1)
	    				  //divZoneId.removeChild(imageBad[numBad])
	    					reset()
							console.log(`${perso1.name} a gagné !!!!!!  `)
							lancerCombat('image/eiffel_tower.jpg',1)
	    				},1630)//setTimeout
	    			}
	    			
	    		else if (perso1.powerstats.combat<=0) {
	    			setTimeout(()=> {
		    			persoTeam.splice(i-1,1)//suppression perso battu
		    			imagePerso.splice(i-1,1)//suppression perso battu
		    			divZoneId.innerHTML= ''
	    				divPersoId.innerHTML= ''
		    			reset()
						console.log('perso2win')
						lancerCombat('image/eiffel_tower.jpg',1)
	    			},1630)//setTimeout
	    		}
	    	})

	   		divZoneId.appendChild(fightButton);
	}*/

	const moveHeroe = (perso,badPerso,xBeg,xEnd,yBeg,yEnd,yBegBad) => {//Xdir,Ydir : image monte/gauche("m") ou descend/droite("d"); retour : true ou false 
		let posX = xBeg
		let posY = yBeg
		let posYbad = yBegBad
		const divZoneId = document.getElementById('divZoneId')
		console.log("function moveHeroes")
		console.log(perso)
		const persoSave = perso
		const persoBadSave = badPerso
		//placerPerso(perso,"550px","300px",divZoneId)
		const frame = (perso) => {
			if (posX == xEnd) {
				clearInterval(anim)
				setTimeout(()=>{
					placerPerso(persoSave,xBeg+"px",yBeg+"px",divZoneId,'divZoneId')
					placerPerso(persoBadSave,xBeg+"px",yBegBad+"px",divZoneId,'divZoneId')
				},1000)

				/*console.log("retour = ")
				if (retour) {moveHeroe(persoSave,xEnd,xBeg,yEnd,yBeg,"d","m",false)}*/
			}
			else {//utiliser la fonction placerPerso?
				posX--
				posY++
				posYbad--
				/*console.log("frame function"+posX)
					console.log(persoSave)*/
				/*perso.style.top = posX +"px"
				perso.style.left = posY +"px"*/
				placerPerso(persoSave,posX+"px",posY+"px",divZoneId,'divZoneId')
				placerPerso(persoBadSave,posX+"px",posYbad+"px",divZoneId,'divZoneId')
				/*console.log("pos heroes x =" + posX +"y = "+ posY)*/
			}
		}
				const anim = setInterval(frame,5)

	}

	createDivPerso()
	createDivZone(urlBack)

  let heroes = persoTeam
  let imagePerso = []
	heroes.forEach((perso) => {
		if (perso != undefined) {
		createPicturePerso(perso,imagePerso)
  	}
	})

	//tab des méchants = on recupere la badteam fait sur selection des perso
  	badTeam.forEach((perso) => {
		createPicturePerso(perso,imageBad)
	})

	tabX=["10px","260px","510px","760px","1010px"]

	for(let i = 0; i < persoTeam.length;i++){
		if (persoTeam[i].powerstats.combat >= 0) {
			placerPerso(imagePerso[i],tabX[i],"30px",divPersoId,'divPersoId')
			placerPerso(caractere(persoTeam[i]),tabX[i],"200px",divPersoId,'divPersoId')
		}
	}

	//rendre les images cliquables
	for(let i=0;i<persoTeam.length;i++) {
		imagePerso[i].addEventListener("click",(e)=>{
			console.log("placer perso initial")
			console.log(imagePerso[i])
      placerPerso(imagePerso[i],"400px","450px",divZoneId,'divZoneId')
      imageHeroeSelect = imagePerso[i]
		//	placerPerso(imageBad[numBad],"400px","900px",divZoneId)
	  // createButtonFight(persoTeam[i],badTeam[numBad],i,urlBack)
	  if (finish) {turn += 1}
      connectionSocket.send(JSON.stringify({'action':'playHeroe','numPartie': numPartie, 'pseudo': pseudo,
	  heroePlay: persoTeam[i], 'turn' : turn }))
	  finish = false
		})
	}
}

/**********************creer page de selection des persos ***********************************************************************/
const persoPage = () => {
	const baseUrl = 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api'

	const getHeroes = () => fetch(`${baseUrl}/all.json`)
	    .then(response => response.json())

	const start = async () => {
	    const heroes = await getHeroes()

	    //fonction lancer choix des personnages
	    
	    //injection instruction

	    choix.innerHTML = '<h3>Compose ton équipe de 5 personnages différents</h3>'

	    /* heroes random selection*/
	    const selecteur = []
	    for (let i = 0; i < 10; i++) {
	        const randomHeroes = heroes[Math.floor((Math.random() * heroes.length))]
	        selecteur.push(randomHeroes)
	    }

	    /*for (let i = 0; i < 3; i++) {
	        const randomBadHeroes = heroes[Math.floor((Math.random() * heroes.length))]
	        badTeam.push(randomBadHeroes)
	    }*/
	    console.log("Team des badHeroes : ")
	    console.log(badTeam)
	    //injection des heroes random dans le html
	    const heroesElement = monarray => {
	        return `
	            <div class='vignette_heroes' id="${monarray.id}" >
	                <img src='${monarray.images.sm}' />
	                <h3>${monarray.name}</h3>
	                <span>Life : ${monarray.powerstats.combat}</span>
	                <span>Attack : ${monarray.powerstats.strength}</span>
	            </div>	    `
      }
      
	    injectHeroes.innerHTML = selecteur.map(heroesElement).join('')

	    //Creation de la team
	    injectHeroes.addEventListener("click", (e) => {
	        const perso = e.target.parentElement.id
	        
	        const fichePerso = heroes.find(heroe => heroe.id == perso)
	        persoTeam.push(fichePerso)
	        console.log("Team des superHeroes : ")
	        console.log(persoTeam)
	        injectTeamHeroes.innerHTML = persoTeam.map(heroesTeamElement).join('')
	    })

	    //injection des heroes choisi dans le html
	    const heroesTeamElement = monarray => {
	        return `
	            <div class='team_heroes' id="${monarray.id}" >
	                <img src='${monarray.images.sm}' />
	                <h3>${monarray.name}</h3>
	                <span>Life : ${monarray.powerstats.combat}</span>
	                <span>Attack : ${monarray.powerstats.strength}</span>
	            </div>
	    `
	    }

	    //injection button next
	   
	    btn.innerHTML = '<button class="button_next"><span>Suite</span></button>'
	    btn.addEventListener("click",(e)=>{
        //envoi au socket
        connectionSocket.send(JSON.stringify({'action':'chooseHeroes','numPartie': numPartie, 'pseudo': pseudo,
         'heroes': persoTeam}))
	    	reset()
	    	lancerCombat('image/eiffel_tower.jpg',0)
	    })
	}

	start()
}

const pageConnexion = () => {

  const createNameInput=()=> {
    let pseudoInput = document.createElement("input")
    pseudoInput.setAttribute("type","text")
    pseudoInput.setAttribute("placeholder","PSEUDO")
    pseudoInput.id = "pseudoInputId"
    connexionDiv.appendChild(pseudoInput);
  }
  
  const createNumInput=()=> {
    let numInput = document.createElement("input")
    numInput.setAttribute("type","text")
    numInput.setAttribute("placeholder","numéro de la partie")
    //numInput.style.color = "b"
    numInput.id = "numInputId"
    connexionDiv.appendChild(numInput);
  }


	const createButtonConnexion = () => {
		let connexionButton = document.createElement("input")
				connexionButton.setAttribute("type","button")
        connexionButton.style.color = "white"
        connexionButton.setAttribute("value","CREER PARTIE")
				connexionButton.id = "connexionButtonId"
				connexionButton.addEventListener("click", (e)=> {
          const numRandom = Math.floor(Math.random()*100000)
          numInput = document.getElementById('numInputId')
          numInput.value = numRandom
        })
				connexionDiv.appendChild(connexionButton);
  }

  const createButtonGo = () => {
		let goButton = document.createElement("input")
				goButton.setAttribute("type","button")
        goButton.style.color = "white"
        goButton.setAttribute("value","go")
				goButton.id = "goButtonId"
				goButton.addEventListener("click", (e)=> {
          numPartie = document.getElementById('numInputId').value
          pseudo = document.getElementById('pseudoInputId').value
          console.log('partie co', numPartie, pseudo)
          reset()
          
          connectionSocket.send(JSON.stringify({'action':'connection','numPartie': numPartie, 'pseudo': pseudo }))
            connexionDiv.innerHTML = `Hello ${pseudo}     partie n°${numPartie} `
          persoPage()})
				connexionDiv.appendChild(goButton);
  }
  
  createNameInput() 
  createButtonConnexion()
  createNumInput()
  createButtonGo()

}

pageConnexion()
