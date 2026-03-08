let current = 0;
let typingTimeout; 
let isTyping = false;
let currentText = "";
let typingSpeed = "normal";

const title = document.getElementById("chapterTitle");
const content = document.getElementById("chapterContent");
const list = document.getElementById("chapterList");
const indicator = document.getElementById("chapterIndicator");
const progress = document.getElementById("progressBar");

function changeFont() {
  const selectedFont = document.getElementById("fontSelector").value;
  document.documentElement.style.setProperty('--reading-font', selectedFont);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const themeBtn = document.getElementById("themeToggle");
  if (document.body.classList.contains("dark-mode")) {
    themeBtn.innerText = "[ ATMOSPHERE ]"; 
  } else {
    themeBtn.innerText = "[ DARK MODE ]";
  }
}

function toggleSpeed() {
  const speedBtn = document.getElementById("speedToggle");
  if (typingSpeed === "normal") {
    typingSpeed = "fast";
    speedBtn.innerText = "[ SPEED: FAST ]";
  } else if (typingSpeed === "fast") {
    typingSpeed = "instant";
    speedBtn.innerText = "[ SPEED: INSTANT ]";
    if (isTyping) {
      clearTimeout(typingTimeout);
      content.innerHTML = currentText;
      isTyping = false;
    }
  } else {
    typingSpeed = "normal";
    speedBtn.innerText = "[ SPEED: NORMAL ]";
  }
}

function typeWriter(rawText) {
  clearTimeout(typingTimeout);
  isTyping = true;
  
  currentText = rawText.replace(/\n/g, '<br>');
  
  if (typingSpeed === "instant") {
    content.innerHTML = currentText;
    isTyping = false;
    return;
  }

  content.innerHTML = "";
  let i = 0;
  let isInsideTag = false;

  function typing() {
    if (i < currentText.length) {
      let char = currentText.charAt(i);
      
      if (char === '<') isInsideTag = true;
      if (char === '>') isInsideTag = false;

      content.innerHTML = currentText.substring(0, i + 1);
      i++;

      let delay = 0;
      if (!isInsideTag) {
        if (typingSpeed === "normal") {
          delay = Math.floor(Math.random() * 20) + 15;
        } else if (typingSpeed === "fast") {
          delay = Math.floor(Math.random() * 5) + 5; 
        }
      }

      typingTimeout = setTimeout(typing, delay);
    } else {
      isTyping = false;
    }
  }
  typing();
}

function updateSidebar() {
  const items = list.getElementsByTagName("li");
  for(let j = 0; j < items.length; j++) {
    items[j].classList.remove("active");
    if(j === current) {
      items[j].classList.add("active");
    }
  }
}

function loadChapter(i) {
  current = i;
  title.innerText = chapters[i].title;
  indicator.innerText = `[ ${i + 1} / ${chapters.length} ]`;
  
  typeWriter(chapters[i].content);
  
  progress.style.width = ((i + 1) / chapters.length) * 100 + "%";
  updateSidebar();
  
  document.querySelector('.reader').scrollTop = 0;
}

chapters.forEach((ch, i) => {
  let li = document.createElement("li");
  li.innerText = ch.title;
  li.onclick = () => loadChapter(i);
  list.appendChild(li);
});

function nextChapter() {
  if (current < chapters.length - 1) loadChapter(current + 1);
}

function prevChapter() {
  if (current > 0) loadChapter(current - 1);
}

loadChapter(0);

// --- AUDIO LOGIC (AUTOPLAY & DRAGGABLE) ---
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicToggle");
let songs = ["music/music_1.mp3", "music/music_2.mp3", "music/music_3.mp3"];
let trackIndex = 0;

window.addEventListener('DOMContentLoaded', () => {
    let playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            musicBtn.classList.add("playing"); 
        }).catch(error => {
            document.body.addEventListener('click', () => {
                if (music.paused && !musicBtn.classList.contains("user-paused")) {
                    music.play();
                    musicBtn.classList.add("playing");
                }
            }, { once: true });
        });
    }
});

music.onended = () => {
  trackIndex++;
  music.src = songs[trackIndex % songs.length];
  music.play();
};

let isDragging = false;
let active = false;
let initialX, initialY;

musicBtn.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

musicBtn.addEventListener("touchstart", dragStart, {passive: false});
document.addEventListener("touchend", dragEnd, false);
document.addEventListener("touchmove", drag, {passive: false});

function dragStart(e) {
  if (e.target === musicBtn || musicBtn.contains(e.target)) {
    active = true;
    isDragging = false; 

    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX;
      initialY = e.touches[0].clientY;
    } else {
      initialX = e.clientX;
      initialY = e.clientY;
    }
  }
}

function dragEnd(e) {
  active = false;
}

function drag(e) {
  if (active) {
    e.preventDefault();
    isDragging = true; 

    let clientX, clientY;
    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let dx = clientX - initialX;
    let dy = clientY - initialY;
    
    initialX = clientX;
    initialY = clientY;
    
    musicBtn.style.left = (musicBtn.offsetLeft + dx) + "px";
    musicBtn.style.top = (musicBtn.offsetTop + dy) + "px";
    musicBtn.style.bottom = "auto"; 
    musicBtn.style.right = "auto";
  }
}

musicBtn.onclick = (e) => {
  if (isDragging) {
      e.preventDefault();
      return; 
  }
  
  if (music.paused) {
    music.play();
    musicBtn.classList.add("playing");
    musicBtn.classList.remove("user-paused");
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.classList.add("user-paused"); 
  }
};

document.addEventListener("copy", e => {
  alert("The darkness does not allow copying.");
  e.preventDefault();
});
