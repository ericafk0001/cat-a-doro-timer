document.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.getElementById("start");
  const resetBtn = document.getElementById("reset-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const timerText = document.getElementById("timer-text");

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

    updateTimerText(minutes, seconds);
  }

  function startTimer() {
    timer = setInterval(updateTimer, 1000);
  }

  function updateTimerText(minutes, seconds) {
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    timerText.textContent = formattedTime;
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
    checkTimerChoice();
  });

  const timerChoices = document.getElementsByClassName("radio");

  function resetTimer() {
    const startText = document.getElementById("start-text");
    startText.textContent = "Start";
    isStarted = false;
    clearInterval(timer);
  }

  function checkTimerChoice() {
    resetTimer();
    if (document.getElementById("pomodoro").checked) {
      clearInterval(timer);
      minutes = 25;
      seconds = 0;
      updateTimerText(minutes, seconds);
    } else if (document.getElementById("short-break").checked) {
      clearInterval(timer);
      minutes = 5;
      seconds = 0;
      updateTimerText(minutes, seconds);
    } else if (document.getElementById("long-break").checked) {
      clearInterval(timer);
      minutes = 10;
      seconds = 0;
      updateTimerText(minutes, seconds);
    }
  }

  for (var i = 0; i < timerChoices.length; i++) {
    timerChoices[i].addEventListener("change", checkTimerChoice);
  }

  checkTimerChoice();
});
