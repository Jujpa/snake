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
    {punti:35, img:"images/amico4.png"},
    {punti:50, img:"images/amico5.png"},
    {punti:65, img:"images/amico6.png"},
    {punti:80, img:"images/amico7.png"},
    {punti:100, img:"images/amico8.png"},

]

document.addEventListener("keydown", cambiaDirezione)

function cambiaDirezione(e){
    // Gestione unificata del tasto Enter
    if (e.key === "Enter") {
        if (!gameStarted || gameOver) {
            resetGame()
            return
        }
        if (pausa && mostraSblocco) {
            // Aggiungi immagine alla galleria e riprendi
            const img = document.createElement("img")
            img.src = imgGrande.src
            document.getElementById("cards").appendChild(img)
            pausa = false
            mostraSblocco = false
            imgGrande = null
            return
        }
    }

    if(e.key==="ArrowUp"){dx=0;dy=-20}
    if(e.key==="ArrowDown"){dx=0;dy=20}
    if(e.key==="ArrowLeft"){dx=-20;dy=0}
    if(e.key==="ArrowRight"){dx=20;dy=0}
}

function gameLoop(){

    // Puliamo il canvas
    ctx.clearRect(0,0,400,400)
    
    // Opzionale: disegna un colore di base se lo sfondo CSS non carica
    // ctx.fillStyle = "#f0f2f5"; ctx.fillRect(0,0,400,400);
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)" // Griglia semi-trasparente e sottile
    ctx.lineWidth = 1
    for(let i=0; i<=400; i+=20){
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,400); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(400,i); ctx.stroke()
    }

    if(!gameStarted){
        ctx.shadowBlur = 4; ctx.shadowColor = "rgba(0,0,0,0.2)"
        ctx.font = "20px Arial"
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText("Premi ENTER per iniziare", 200, 200)
        return
    }

    if(gameOver){
        // Mostra messaggio game over
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.font = "25px Arial"
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

    // Disegna lo Snake con stile
    snake.forEach((s, index) => {
        const isHead = index === 0
        
        // Colore differenziato tra testa e corpo
        ctx.fillStyle = isHead ? "#2d6a4f" : "#52b788"
        ctx.strokeStyle = "#1b4332"
        ctx.lineWidth = 1

        // Disegna il segmento arrotondato
        const radius = 6
        ctx.beginPath()
        ctx.roundRect(s.x + 1, s.y + 1, 18, 18, radius)
        ctx.fill()
        ctx.stroke()

        // Aggiungi gli occhi alla testa
        if (isHead) {
            ctx.fillStyle = "white"
            // Occhio sinistro
            ctx.beginPath(); ctx.arc(s.x + 6, s.y + 6, 2.5, 0, Math.PI * 2); ctx.fill()
            // Occhio destro
            ctx.beginPath(); ctx.arc(s.x + 14, s.y + 6, 2.5, 0, Math.PI * 2); ctx.fill()
            
            // Pupille (che guardano avanti in base a dx/dy)
            ctx.fillStyle = "black"
            let px = dx === 0 ? 0 : (dx > 0 ? 1 : -1)
            let py = dy === 0 ? 0 : (dy > 0 ? 1 : -1)
            ctx.beginPath(); ctx.arc(s.x + 6 + px, s.y + 6 + py, 1, 0, Math.PI * 2); ctx.fill()
            ctx.beginPath(); ctx.arc(s.x + 14 + px, s.y + 6 + py, 1, 0, Math.PI * 2); ctx.fill()
        }
    })

    // Disegna cibo con una piccola ombra
    ctx.shadowBlur = 5; ctx.shadowColor = "rgba(0,0,0,0.3)"
    ctx.drawImage(foodImg, food.x, food.y, 20, 20)
    ctx.shadowBlur = 0 // Reset ombra per i prossimi cicli
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