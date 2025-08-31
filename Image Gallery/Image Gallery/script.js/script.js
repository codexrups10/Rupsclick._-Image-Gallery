const filter = document.getElementById("filter");
const sort = document.getElementById("sort");
const gallery = document.getElementById("gallery");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

const modal = document.getElementById("myModal");
const modalImg = document.getElementById("modal-img");
const caption = document.getElementById("caption");
const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentIndex = 0;
let slideshowInterval;

// === Filtering ===
filter.addEventListener("change", () => {
  const value = filter.value;
  galleryItems.forEach(item => {
    item.style.display = (value === "all" || item.dataset.category === value) ? "block" : "none";
  });
});

// === Sorting ===
sort.addEventListener("change", () => {
  let sorted = [...galleryItems];
  if (sort.value === "name") {
    sorted.sort((a, b) => a.querySelector("img").alt.localeCompare(b.querySelector("img").alt));
  } else if (sort.value === "date") {
    sorted.sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date));
  }
  gallery.innerHTML = "";
  sorted.forEach(item => gallery.appendChild(item));
});

// === Modal open ===
galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => {
    modal.style.display = "block";
    currentIndex = i;
    showImage(currentIndex);
  });
});

function showImage(index) {
  const img = galleryItems[index].querySelector("img");
  modalImg.classList.remove("show");
  modalImg.src = img.src;
  caption.textContent = `${img.alt} | ${galleryItems[index].dataset.date} | Category: ${galleryItems[index].dataset.category}`;
  modalImg.onload = () => modalImg.classList.add("show");
}

// Modal navigation
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  showImage(currentIndex);
});
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  showImage(currentIndex);
});
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  resetZoom();
});

// === Slideshow ===
document.getElementById("slideshow-btn").addEventListener("click", (e) => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    e.target.textContent = "▶ Start Slideshow";
  } else {
    modal.style.display = "block";
    showImage(currentIndex);
    slideshowInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      showImage(currentIndex);
    }, 2000);
    e.target.textContent = "⏸ Stop Slideshow";
  }
});

// === Layout switch ===
document.getElementById("layout-btn").addEventListener("click", (e) => {
  gallery.classList.toggle("masonry");
  e.target.textContent = gallery.classList.contains("masonry") ? "🔲 Switch to Grid" : "🟦 Switch to Masonry";
});

// === Theme toggle ===
const themeBtn = document.getElementById("theme-btn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// === Zoom & Drag ===
let scale = 1;
let isDragging = false;
let startX, startY, originX = 0, originY = 0;

modalImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  scale = e.deltaY < 0 ? scale + zoomSpeed : Math.max(1, scale - zoomSpeed);
  applyTransform();
});

modalImg.addEventListener("mousedown", (e) => {
  if (scale <= 1) return;
  isDragging = true;
  startX = e.clientX - originX;
  startY = e.clientY - originY;
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  originX = e.clientX - startX;
  originY = e.clientY - startY;
  applyTransform();
});
document.addEventListener("mouseup", () => { isDragging = false; });

function applyTransform() {
  modalImg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
}

function resetZoom() {
  scale = 1;
  originX = 0;
  originY = 0;
  applyTransform();
}
