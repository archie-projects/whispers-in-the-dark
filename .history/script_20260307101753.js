let current=0;

const title=document.getElementById("chapterTitle")
const content=document.getElementById("chapterContent")
const list=document.getElementById("chapterList")
const indicator=document.getElementById("chapterIndicator")
const progress=document.getElementById("progressBar")

function typeWriter(text){

content.innerHTML=""

let i=0

function typing(){

if(i<text.length){

content.innerHTML+=text.charAt(i)

i++

setTimeout(typing,15)

}

}

typing()

}

function loadChapter(i){

current=i

title.innerText=chapters[i].title

indicator.innerText=`${i+1}/${chapters.length}`

typeWriter(chapters[i].content)

progress.style.width=((i+1)/chapters.length)*100+"%"

}

chapters.forEach((ch,i)=>{

let li=document.createElement("li")

li.innerText=ch.title

li.onclick=()=>loadChapter(i)

list.appendChild(li)

})

function nextChapter(){

if(current<chapters.length-1)

loadChapter(current+1)

}

function prevChapter(){

if(current>0)

loadChapter(current-1)

}

loadChapter(0)

const music=document.getElementById("music")

document.getElementById("musicToggle").onclick=()=>{

if(music.paused)

music.play()

else

music.pause()

}


document.addEventListener("copy",e=>{

alert("The darkness doesn't like thieves.")

e.preventDefault()

})
