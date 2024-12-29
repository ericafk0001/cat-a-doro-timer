document.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.getElementById("start");
  const resetBtn = document.getElementById("reset-btn");
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

  // create task
  document
    .getElementById("task-input")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const input = event.target;
        const value = input.value.trim();
        if (value) {
          const newTask = document.createElement("div");
          newTask.className = "task";
          newTask.textContent = value;
          // Add the click event listener to the new task
          newTask.addEventListener("click", deleteTask);
          document.getElementById("left-todo").appendChild(newTask);
          input.value = "";
        } else {
          alert("you didn't type anything!");
        }
      }
    });

  function deleteTask(event) {
    if (confirm("Are you sure you want to delete this task?")) {
      event.target.remove();
    }
  }

  // Add click listeners to existing tasks
  const tasks = document.getElementsByClassName("task");
  Array.from(tasks).forEach((task) => {
    task.addEventListener("click", deleteTask);
  });

  const noteBox = document.getElementById("note-box");

  noteBox.addEventListener("change", function () {
    const textValue = noteBox.value;
    localStorage.setItem("savedText", textValue);
    console.log("Text saved!");
  });

  window.addEventListener("load", () => {
    const savedText = localStorage.getItem("savedText");
    if (savedText !== null) {
      noteBox.value = savedText;
    }
  });

  //cat petter
  let catPlacement = document.getElementById("cat-placement");

  catPlacement.addEventListener("mouseover", function () {
    catPlacement.src = "cat_pet_gif.gif";
  });

  catPlacement.addEventListener("mouseout", function () {
    catPlacement.src = "cat_pet.png";
  });

  //fetch cat img
  function fetchCatImg() {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const catImageUrl = data[0].url;

        const catImage = document.getElementById("cat-image");
        catImage.src = catImageUrl;
        catImage.alt = "Random Cute Cat";
      })
      .catch((error) => console.error(error));
  }

  const reloadCatBtn = document.getElementById("reload-cat");
  reloadCatBtn.addEventListener("click", function () {
    fetchCatImg();
  });

  let startTime = Date.now();
  let totalTime = 0; // total time

  // Update the total time
  function updateTime() {
    const currentTime = Date.now();
    totalTime += currentTime - startTime;
    startTime = currentTime;
    const hours = Math.floor(totalTime / 3600000);
    const minutes = Math.floor((totalTime % 3600000) / 60000);
    const seconds = ((totalTime % 60000) / 1000).toFixed(1); // Round seconds to 1 decimal place

    document.getElementById(
      "time-display"
    ).textContent = `${hours}h, ${minutes}m, ${seconds}s`;
  }

  // Listen for tab focus/unfocus
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      updateTime();
    } else {
      startTime = Date.now(); // reset start time when tab is focused
    }
  });

  // update time when the user leaves the page
  window.addEventListener("beforeunload", function () {
    updateTime();
  });

  //settings
  const settingsBtn = document.getElementById("settings-btn");
  const settingsDiv = document.getElementById("settings-container");
  const settingsSide = document.getElementById("settings-side");

  const settingsCloseBtn = document.getElementById("close-settings-btn");
  const hamburgerClose = document.getElementById("close-settings-side");
  const hamburger = document.getElementById("check");

  settingsBtn.addEventListener("click", function () {
    settingsDiv.classList.add("active");
  });

  settingsCloseBtn.addEventListener("click", function () {
    settingsDiv.classList.remove("active");
  });

  hamburger.addEventListener("click", function () {
    settingsSide.style.display = "flex";
  });

  hamburgerClose.addEventListener("click", function () {
    settingsSide.style.display = "none";
  });

  //settings SIDE-BAR
  const timerElements = [
    "timer-settings",
    "look-settings",
    "storage-settings",
    "other-settings",
    "about-settings",
  ];

  timerElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", function () {
        element.style.display = "block";
      });
    }
  });

  fetchCatImg();
  checkTimerChoice();
});
