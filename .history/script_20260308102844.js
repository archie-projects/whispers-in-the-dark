let current = 0;
let typingTimeout; 
let isTyping = false;
let currentText = "";
let typingSpeed = "normal"; // States: "normal", "fast", "instant"

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

// --- FEATURE LOGIC ---

// 1. Change Font via Dropdown
function changeFont() {
  const selectedFont = document.getElementById("fontSelector").value;
  document.documentElement.style.setProperty('--reading-font', selectedFont);
}

// 2. Toggle Theme
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const themeBtn = document.getElementById("themeToggle");
  if (document.body.classList.contains("dark-mode")) {
    themeBtn.innerText = "[ ATMOSPHERE ]"; 
  } else {
    themeBtn.innerText = "[ DARK MODE ]";
  }
}

// 3. Toggle Reading Speed
function toggleSpeed() {
  const speedBtn = document.getElementById("speedToggle");
  if (typingSpeed === "normal") {
    typingSpeed = "fast";
    speedBtn.innerText = "[ SPEED: FAST ]";
  } else if (typingSpeed === "fast") {
    typingSpeed = "instant";
    speedBtn.innerText = "[ SPEED: INSTANT ]";
    // If currently typing, finish it instantly
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

// --- HTML-AWARE TYPEWRITER ---
function typeWriter(rawText) {
  clearTimeout(typingTimeout);
  isTyping = true;
  
  // Convert standard newlines to HTML line breaks before typing
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
      
      // Check if we are entering or leaving an HTML tag (like <i> or <b>)
      if (char === '<') isInsideTag = true;
      if (char === '>') isInsideTag = false;

      // Add text up to the current index
      content.innerHTML = currentText.substring(0, i + 1);
      i++;

      let delay = 0;
      // If we are inside an HTML tag, type it instantly (0 delay) so formatting doesn't break
      if (!isInsideTag) {
        if (typingSpeed === "normal") {
          delay = Math.floor(Math.random() * 20) + 15;
        } else if (typingSpeed === "fast") {
          delay = Math.floor(Math.random() * 5) + 5; // Much faster
        }
      }

      typingTimeout = setTimeout(typing, delay);
    } else {
      isTyping = false;
    }
  }
  typing();
}

// --- NAVIGATION LOGIC ---
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
  
  document.body.style.backgroundImage = `url('${backgrounds[i % backgrounds.length]}')`;
  
  typeWriter(chapters[i].content);
  
  progress.style.width = ((i + 1) / chapters.length) * 100 + "%";
  updateSidebar();
  
  document.querySelector('.reader').scrollTop = 0;
}

// Build Sidebar
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

// Initialize
loadChapter(0);

// --- AUDIO LOGIC ---
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
