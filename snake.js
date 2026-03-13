const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

let snake = [{x:200,y:200}]
let dx = 20
let dy = 0

let food = {x:100,y:100}

let score = 0

let pausa = false
let imgGrande = null
let animazione = null  // info per animazione
let scrittaTimer = 0   // timer per la scritta

const figurine = [
    {punti:5, img:"images/amico1.png"},
    {punti:10, img:"images/amico2.png"},
    {punti:15, img:"images/amico3.png"},
    {punti:20, img:"images/amico4.png"}
]

document.addEventListener("keydown", cambiaDirezione)

function cambiaDirezione(e){

    if(e.key === "Enter" && pausa){
        pausa = false
        imgGrande = null
        animazione = null
        scrittaTimer = 0
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

        // Disegna animazione ingrandimento
        if(animazione){
            const progress = animazione.size/animazione.targetSize
            const size = animazione.size
            const x = (400 - size)/2
            const y = (400 - size)/2

            ctx.drawImage(imgGrande, x, y, size, size)

            if(progress < 1){
                animazione.size += 5
            } else {
                animazione = null
                scrittaTimer = 50 // durata della scritta
            }
        } else {
            // Disegna immagine finale
            ctx.drawImage(imgGrande,50,50,300,300)
        }

        // Mostra scritta
        if(scrittaTimer > 0){
            ctx.font = "20px Arial"
            ctx.fillStyle = "yellow"
            ctx.textAlign = "center"
            ctx.fillText("Complimenti! Hai sbloccato una nuova foto!", 200, 30)
            scrittaTimer--
        }

        return
    }

    // logica snake normale
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

    } else {
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

            imgGrande = new Image()
            imgGrande.src = f.img

            animazione = {size:0, targetSize:300} // parte da 0px e ingrandisce a 300px

            // aggiungi immagine piccola sotto
            const img = document.createElement("img")
            img.src = f.img
            document.getElementById("cards").appendChild(img)
        }
    })

}

setInterval(gameLoop,100)
