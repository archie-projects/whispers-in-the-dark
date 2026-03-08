let current = 0;
let typingTimeout; 

const title = document.getElementById("chapterTitle");
const content = document.getElementById("chapterContent");
const list = document.getElementById("chapterList");
const indicator = document.getElementById("chapterIndicator");
const progress = document.getElementById("progressBar");

// Array linking to your background images
const backgrounds = [
  "images/bg1.jpg", 
  "images/bg2.jpg", 
  "images/bg3.jpg"
];

function typeWriter(text) {
  content.innerHTML = "";
  let i = 0;
  clearTimeout(typingTimeout);

  function typing() {
    if (i < text.length) {
      let char = text.charAt(i);
      if (char === '\n') {
        content.innerHTML += '<br>';
      } else {
        content.innerHTML += char;
      }
      i++;
      let speed = Math.floor(Math.random() * 20) + 15;
      typingTimeout = setTimeout(typing, speed);
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
  
  // Smoothly swap the background image
  document.body.style.backgroundImage = `url('${backgrounds[i % backgrounds.length]}')`;
  
  typeWriter(chapters[i].content);
  
  progress.style.width = ((i + 1) / chapters.length) * 100 + "%";
  updateSidebar();
  
  document.querySelector('.reader').scrollTop = 0;
}

// Build Sidebar Links
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

// Initialize first chapter
loadChapter(0);

/* Music Controls Logic */
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicToggle");

let songs = ["music/music_1.mp3", "music/music_2.mp3", "music/music_3.mp3"];
let trackIndex = 0;

music.onended = () => {
  trackIndex++;
  music.src = songs[trackIndex % songs.length];
  music.play();
};

musicBtn.onclick = () => {
  if (music.paused) {
    music.play();
    musicBtn.classList.add("playing");
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
  }
};

document.addEventListener("copy", e => {
  alert("The darkness does not allow copying.");
  e.preventDefault();
});
