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

  settingsBtn.addEventListener("click", function () {
    console.log("settings opened");
  });

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

  fetchCatImg();
  checkTimerChoice();
});
