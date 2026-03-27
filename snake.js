const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const foodImg = new Image()
foodImg.src = "cibo.png"

let snake = [{x:200,y:200}]
let dx = 20
let dy = 0

let food = {x:100,y:100}

let score = 0

let pausa = false
let mostraSblocco = false  // true = mostra immagine e testo sbloccato
let imgGrande = null
let gameOver = false       // nuovo flag per game over
let gameStarted = false    // flag per indicare se il gioco è iniziato

const figurine = [
    {punti:5, img:"images/amico1.png"},
    {punti:10, img:"images/amico2.png"},
    {punti:20, img:"images/amico3.png"},
    {punti:35, img:"images/amico4.png"}
]

document.addEventListener("keydown", cambiaDirezione)

function avviaGioco(){
    gameStarted = true
}

function cambiaDirezione(e){
    if(!gameStarted && e.key === "Enter"){
        avviaGioco()
        return
    }

    if(gameOver && e.key === "Enter"){
        // Riavvia il gioco
        resetGame()
        return
    }

    if(e.key === "Enter" && pausa){
        // Aggiungi immagine piccola alla galleria e riprendi il gioco
        const img = document.createElement("img")
        img.src = imgGrande.src
        document.getElementById("cards").appendChild(img)
        
        pausa = false
        mostraSblocco = false
        imgGrande = null
        return
    }

    if(e.key==="ArrowUp"){dx=0;dy=-20}
    if(e.key==="ArrowDown"){dx=0;dy=20}
    if(e.key==="ArrowLeft"){dx=-20;dy=0}
    if(e.key==="ArrowRight"){dx=20;dy=0}
}

function gameLoop(){

    ctx.clearRect(0,0,400,400)

    if(!gameStarted){
        ctx.font = "20px Arial"
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText("Premi ENTER per iniziare", 200, 200)
        return
    }

    if(gameOver){
        // Mostra messaggio game over
        ctx.font = "30px Arial"
        ctx.fillStyle = "red"
        ctx.textAlign = "center"
        ctx.fillText("Game Over!", 200, 180)
        ctx.fillText("Premi ENTER per ricominciare", 200, 220)
        return
    }

    if(pausa){
        if(mostraSblocco && imgGrande){
            ctx.font = "18px Arial"
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.fillText("Complimenti! Hai sbloccato una nuova foto!", 200, 40)
            ctx.drawImage(imgGrande, 50, 60, 300, 300)
            ctx.fillText("Premi ENTER per continuare", 200, 385)
        }
        return
    }

    const head = {x:snake[0].x+dx, y:snake[0].y+dy}

    // Controlla collisione bordi
    if(head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400){
        gameOver = true
        return
    }

    // Controlla collisione con se stesso
    for(let i=0; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            gameOver = true
            return
        }
    }

    snake.unshift(head)

    if(head.x===food.x && head.y===food.y){

        score++
        document.getElementById("score").innerText = score

        food = {
            x:Math.floor(Math.random()*20)*20,
            y:Math.floor(Math.random()*20)*20
        }

        controllaFigurine()

    }else{
        snake.pop()
    }

    // disegna snake
    ctx.fillStyle="green"
    snake.forEach(s=>{
        ctx.fillRect(s.x,s.y,20,20)
    })

    // disegna cibo
    ctx.drawImage(foodImg, food.x, food.y, 20, 20)
}

// controlla se sbloccare figurine
function controllaFigurine(){
    figurine.forEach(f=>{
        if(score === f.punti){
            pausa = true
            mostraSblocco = true

            imgGrande = new Image()
            imgGrande.src = f.img
        }
    })
}

// reset gioco
function resetGame(){
    snake = [{x:200,y:200}]
    dx = 20
    dy = 0
    food = {x:100,y:100}
    score = 0
    document.getElementById("score").innerText = score
    // Elimina le immagini sbloccate dalle partite precedenti
    document.getElementById("cards").innerHTML = ""
    pausa = false
    mostraSblocco = false
    imgGrande = null
    gameOver = false
    gameStarted = true  // Rimane true dopo il reset
}

setInterval(gameLoop,100)