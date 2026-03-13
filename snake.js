const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

let snake = [{x:200,y:200}]
let dx = 20
let dy = 0

let food = {x:100,y:100}

let score = 0

const figurine = [
    {punti:5, img:"images/amico1.png"},
    {punti:10, img:"images/amico2.png"},
    {punti:20, img:"images/amico3.png"}
]

document.addEventListener("keydown", cambiaDirezione)

function cambiaDirezione(e){

if(e.key==="ArrowUp"){dx=0;dy=-20}
if(e.key==="ArrowDown"){dx=0;dy=20}
if(e.key==="ArrowLeft"){dx=-20;dy=0}
if(e.key==="ArrowRight"){dx=20;dy=0}

}

function gameLoop(){

const head = {x:snake[0].x+dx,y:snake[0].y+dy}

snake.unshift(head)

if(head.x===food.x && head.y===food.y){

score++
document.getElementById("score").innerText=score

food={
x:Math.floor(Math.random()*20)*20,
y:Math.floor(Math.random()*20)*20
}

controllaFigurine()

}else{
snake.pop()
}

ctx.clearRect(0,0,400,400)

ctx.fillStyle="green"
snake.forEach(s=>{
ctx.fillRect(s.x,s.y,20,20)
})

ctx.fillStyle="red"
ctx.fillRect(food.x,food.y,20,20)

}

function controllaFigurine(){

figurine.forEach(f=>{

if(score===f.punti){

const img=document.createElement("img")
img.src=f.img
document.getElementById("cards").appendChild(img)

}

})

}

setInterval(gameLoop,100)
