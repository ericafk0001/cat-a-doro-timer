document.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.getElementById("start");
  const resetBtn = document.getElementById("reset-btn");
  const settingsBtn = document.getElementById("settings-btn");
  let timer;
  let minutes = 25;
  let seconds = 0;

  let isStarted = false;

  function updateTimer() {
    if (minutes === 0 && seconds === 0) {
      const doneSound = document.getElementById("alarm");
      clearInterval(timer);
      console.log("Timer finished!");
      doneSound.play();
      return;
    }

    if (seconds === 0) {
      minutes -= 1;
      seconds = 59;
    } else {
      seconds -= 1;
    }

    timerText = document.getElementById("timer-text");
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    timerText.textContent = formattedTime;
  }

  function startTimer() {
    timer = setInterval(updateTimer, 1000);
  }

  startBtn.addEventListener("click", function () {
    const startText = document.getElementById("start-text");
    if (!isStarted) {
      startText.textContent = "Pause";
      startTimer();
      isStarted = true;
    } else {
      isStarted = false;
      startText.textContent = "Start";
      clearInterval(timer);
    }
  });

  resetBtn.addEventListener("click", function () {
    const startText = document.getElementById("start-text");
    startText.textContent = "Start";
    isStarted = false;
    clearInterval(timer);
    minutes = 25;
    seconds = 0;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    timerText.textContent = formattedTime;
  });
});
