const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

let snake = [{x:200,y:200}]
let dx = 20
let dy = 0

let food = {x:100,y:100}

let score = 0

// Stato del gioco
let pausa = false           // pausa totale
let mostraScritta = false   // true = mostra scritta iniziale
let animazione = null       // info animazione ingrandimento
let imgGrande = null        // immagine della figurina

const figurine = [
    {punti:5, img:"images/amico1.png"},
    {punti:10, img:"images/amico2.png"},
    {punti:15, img:"images/amico3.png"},
    {punti:20, img:"images/amico4.png"}
]

document.addEventListener("keydown", cambiaDirezione)

function cambiaDirezione(e){
    // ENTER gestisce lo step successivo
    if(e.key === "Enter" && pausa){
        if(mostraScritta){
            // Passa da scritta a animazione
            mostraScritta = false
            animazione = {size:0, targetSize:300}
        } else if(animazione === null){
            // Animazione finita → riprende gioco
            pausa = false
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
        // Se siamo in pausa per la scritta
        if(mostraScritta){
            ctx.font = "20px Arial"
            ctx.fillStyle = "yellow"
            ctx.textAlign = "center"
            ctx.fillText("Complimenti! Hai sbloccato una nuova foto!", 200, 200)
            return
        }

        // Se siamo in pausa per animazione immagine
        if(animazione){
            if(imgGrande){
                const size = animazione.size
                const x = (400 - size)/2
                const y = (400 - size)/2
                ctx.drawImage(imgGrande, x, y, size, size)

                if(animazione.size < animazione.targetSize){
                    animazione.size += 5
                } else {
                    animazione = null
                }
            }
            return
        }

        // Se pausa ma animazione finita, resta immagine finale
        if(imgGrande){
            ctx.drawImage(imgGrande,50,50,300,300)
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
            mostraScritta = true

            imgGrande = new Image()
            imgGrande.src = f.img

            // aggiungi immagine piccola sotto
            const img = document.createElement("img")
            img.src = f.img
            document.getElementById("cards").appendChild(img)
        }
    })
}

function startLoop(){
    requestAnimationFrame(loop)
}

let lastTime = 0
const speed = 100 // millisecondi tra un movimento e l'altro

function loop(timestamp){
    if(!lastTime) lastTime = timestamp
    const delta = timestamp - lastTime

    if(delta > speed){
        gameLoop()
        lastTime = timestamp
    }

    requestAnimationFrame(loop)
}

startLoop() // chiamala una sola volta all'inizio
