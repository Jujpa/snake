const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

let snake = [{x:200,y:200}]
let dx = 20
let dy = 0

let food = {x:100,y:100}

let score = 0

let pausa = false
let mostraScritta = false   // true = mostra scritta iniziale
let mostraImmagine = false  // true = mostra immagine sbloccata
let imgGrande = null

const figurine = [
    {punti:5, img:"images/amico1.png"},
    {punti:10, img:"images/amico2.png"},
    {punti:15, img:"images/amico3.png"},
    {punti:20, img:"images/amico4.png"}
]

document.addEventListener("keydown", cambiaDirezione)

function cambiaDirezione(e){
    if(e.key === "Enter" && pausa){
        if(mostraScritta){
            // Passa dalla scritta all'immagine
            mostraScritta = false
            mostraImmagine = true
        } else if(mostraImmagine){
            // Immagine mostrata → riprende gioco
            pausa = false
            mostraImmagine = false
            imgGrande = null
        }
        return
    }

    if(e.key==="ArrowUp"){dx=0;dy=-20}
    if(e.key==="ArrowDown"){dx=0;dy=20}
    if(e.key==="ArrowLeft"){dx=-20;dy=0}
    if(e.key==="ArrowRight"){dx=20;dy=0}
}

function gameLoop(){

    ctx.clearRect(0,0,400,400)

    if(pausa){
        if(mostraScritta){
            // Mostra scritta centrata
            ctx.font = "30px Arial"
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.fillText("Complimenti! Hai sbloccato una nuova foto!", 200, 200)
        } else if(mostraImmagine && imgGrande){
            // Mostra immagine grande
            ctx.drawImage(imgGrande,50,50,300,300)
        }
        return
    }

    const head = {x:snake[0].x+dx, y:snake[0].y+dy}
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
    ctx.fillStyle="red"
    ctx.fillRect(food.x,food.y,20,20)

}

function controllaFigurine(){
    figurine.forEach(f=>{
        if(score === f.punti){
            pausa = true
            mostraScritta = true
            mostraImmagine = false

            imgGrande = new Image()
            imgGrande.src = f.img

            // aggiungi immagine piccola sotto
            const img = document.createElement("img")
            img.src = f.img
            document.getElementById("cards").appendChild(img)
        }
    })
}

setInterval(gameLoop,100)
