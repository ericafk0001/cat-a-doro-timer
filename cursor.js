let currentCursor = null;

function initializeCursor() {
  const savedEffect = localStorage.getItem("cursorEffect") || "rainbow";
  document.getElementById("cursor-effect").value = savedEffect;
  changeCursor(savedEffect);
}

function changeCursor(effect) {
  if (currentCursor) {
    currentCursor.destroy?.();
    currentCursor = null;
  }

  // Apply new cursor
  switch (effect) {
    case "rainbow":
      currentCursor = new cursoreffects.rainbowCursor();
      document.body.style.cursor = "url('pusheen.png'), auto";
      break;
    case "fairy":
      currentCursor = new cursoreffects.fairyDustCursor();
      document.body.style.cursor = "url('pusheen.png'), auto";
      break;
    case "ghost":
      currentCursor = new cursoreffects.ghostCursor();
      document.body.style.cursor = "default";
      break;
    case "springy":
      currentCursor = new cursoreffects.springyEmojiCursor();
      document.body.style.cursor = "url('pusheen.png'), auto";
      break;
  }

  localStorage.setItem("cursorEffect", effect);
}

window.addEventListener("load", () => {
  initializeCursor();

  document.getElementById("cursor-effect").addEventListener("change", (e) => {
    changeCursor(e.target.value);
  });
});
