let current = 0;
let typingTimeout; // Store the timeout to cancel it if user clicks rapidly

const title = document.getElementById("chapterTitle");
const content = document.getElementById("chapterContent");
const list = document.getElementById("chapterList");
const indicator = document.getElementById("chapterIndicator");
const progress = document.getElementById("progressBar");

function typeWriter(text) {
  content.innerHTML = "";
  let i = 0;
  
  // Clear any existing typing animation to prevent overlapping text
  clearTimeout(typingTimeout);

  function typing() {
    if (i < text.length) {
      let char = text.charAt(i);
      // Convert newlines to HTML line breaks
      if (char === '\n') {
        content.innerHTML += '<br>';
      } else {
        content.innerHTML += char;
      }
      i++;
      
      // Randomize typing speed slightly for realism (between 15ms and 35ms)
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
  
  typeWriter(chapters[i].content);
  
  progress.style.width = ((i + 1) / chapters.length) * 100 + "%";
  updateSidebar();
  
  // Auto-scroll reader to top on new chapter
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
const audioLabel = document.getElementById("audioLabel");

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
    audioLabel.innerText = "AUDIO : PLAYING";
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    audioLabel.innerText = "AUDIO : MUTED";
  }
};

/* Anti-copy */
document.addEventListener("copy", e => {
  alert("The darkness does not allow copying.");
  e.preventDefault();
});
