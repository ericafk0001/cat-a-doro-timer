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
    seconds = 0;
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
          newTask.addEventListener("click", deleteTask);
          document.getElementById("left-todo").appendChild(newTask);
          input.value = "";

          // Deselect the input box
          input.blur();

          const saveEnabled = document.getElementById("save-todos").checked;
          if (saveEnabled) {
            const existingTodos = JSON.parse(
              localStorage.getItem("todos") || "[]"
            );
            existingTodos.push(newTask.textContent);
            localStorage.setItem("todos", JSON.stringify(existingTodos));
          }
        } else {
          const intervalId = setInterval(() => {
            Swal.fire({
              icon: "warning",
              title: "Oops...",
              text: "You didn't type anything!",
              confirmButtonText: "OK",
            }).then(() => {
              clearInterval(intervalId);
            });
          }, 10);
        }
      }
    });

  function deleteTask(event) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        event.target.remove();

        const todoText = event.target.textContent;
        const existingTodos = JSON.parse(localStorage.getItem("todos") || "[]");
        const updatedTodos = existingTodos.filter((todo) => todo !== todoText);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  }

  //load tasks
  window.addEventListener("load", () => {
    if (localStorage.getItem("saveTodosEnabled") === null) {
      localStorage.setItem("saveTodosEnabled", "true");
    }
    if (localStorage.getItem("saveNotesChecked") === null) {
      localStorage.setItem("saveNotesChecked", "true");
    }

    loadSwitchState();
    loadNoteState();
    loadSettings();
    loadQuoteSettings();
    checkTimerChoice();
    fetchCatImg();
    loadMinimalMode();

    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    todos.forEach((todoText) => {
      const newTask = document.createElement("div");
      newTask.className = "task";
      newTask.textContent = todoText;
      newTask.addEventListener("click", deleteTask);
      document.getElementById("left-todo").appendChild(newTask);
    });

    //loader
    const loader = document.querySelector(".loader-container");
    setTimeout(() => {
      loader.classList.add("hide-loader");
    }, 350);
  });

  const saveSwitch = document.getElementById("save-todos");
  saveSwitch.addEventListener("change", function () {
    localStorage.setItem("saveTodosEnabled", this.checked);
    if (!this.checked) {
      localStorage.removeItem("todos");
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "info",
        title: "To-do tasks will not be saved",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: "To-do tasks will be saved",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

  function loadSwitchState() {
    const savedState = localStorage.getItem("saveTodosEnabled");
    document.getElementById("save-todos").checked = savedState === "true";
  }

  const noteSwitch = document.getElementById("save-notes");
  noteSwitch.addEventListener("change", function () {
    localStorage.setItem("saveNotesChecked", this.checked);
    if (!this.checked) {
      localStorage.removeItem("notes");
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "info",
        title: "Personal notes will not be saved",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: "Personal notes will be saved",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

  const noteBox = document.getElementById("note-box");

  noteBox.addEventListener("change", function () {
    const textValue = noteBox.value;
    localStorage.setItem("savedText", textValue);
  });

  function loadNoteState() {
    const savedState = localStorage.getItem("saveNotesChecked");
    document.getElementById("save-notes").checked = savedState === "true";

    if (savedState === "true") {
      const savedText = localStorage.getItem("savedText");
      if (savedText !== null) {
        noteBox.value = savedText;
      }
    } else {
      localStorage.setItem("savedText", "");
      noteBox.value = "";
    }
  }

  // Add click listeners to existing tasks
  const tasks = document.getElementsByClassName("task");
  Array.from(tasks).forEach((task) => {
    task.addEventListener("click", deleteTask);
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

  //close21
  settingsCloseBtn.addEventListener("click", function () {
    saveSettings();
    saveQuoteSettings();
    settingsDiv.classList.remove("active");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Settings Saved",
    });
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

  function hideAllSettings() {
    const settingDivs = document.querySelectorAll(".setting-content");
    settingDivs.forEach((div) => {
      div.style.display = "none";
    });
  }

  timerElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", function () {
        hideAllSettings(); // Hide all settings divs
        const correspondingDiv = document.getElementById(`${id}-content`); // Assuming each div has an ID like 'timer-settings-content'
        if (correspondingDiv) {
          correspondingDiv.style.display = "flex";
        }
      });
    }
  });

  //settings side TIMER

  function saveSettings() {
    const workInterval = document.getElementById("work-interval").value || 25;
    const shortBreakInterval =
      document.getElementById("short-interval").value || 5;
    const longBreakInterval =
      document.getElementById("long-interval").value || 10;
    const saveSettingsCheckbox = document.getElementById("save-timers").checked;

    if (saveSettingsCheckbox) {
      localStorage.setItem("workInterval", workInterval);
      localStorage.setItem("shortBreakInterval", shortBreakInterval);
      localStorage.setItem("longBreakInterval", longBreakInterval);
      localStorage.setItem("saveSettings", "true");

      // Update timer text immediately based on current selection
      checkTimerChoice();
    } else {
      // Clear saved settings
      localStorage.removeItem("workInterval");
      localStorage.removeItem("shortBreakInterval");
      localStorage.removeItem("longBreakInterval");
      localStorage.setItem("saveSettings", "false");

      // Reset input values to defaults
      document.getElementById("work-interval").value = "";
      document.getElementById("short-interval").value = "";
      document.getElementById("long-interval").value = "";

      // Reset placeholders to defaults
      document.getElementById("work-interval").placeholder = "25 Minutes";
      document.getElementById("short-interval").placeholder = "5 Minutes";
      document.getElementById("long-interval").placeholder = "10 Minutes";

      // Reset timer to default values
      minutes = 25;
      updateTimerText(minutes, seconds);
    }

    // Show save confirmation
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "success",
      title: saveSettingsCheckbox
        ? "Custom Times Saved"
        : "Custom Times Reseted",
    });
  }

  const saveTimerCheckbox = document.getElementById("save-timers");
  saveTimerCheckbox.addEventListener("change", function () {
    if (!this.checked) {
      Swal.fire({
        title: "Clear Saved Settings?",
        text: "This will reset all timer values to default",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear settings",
        cancelButtonText: "No, keep settings",
      }).then((result) => {
        if (result.isConfirmed) {
          saveSettings();
        } else {
          this.checked = true;
        }
      });
    } else {
      // if turning on saving, save current settings
      saveSettings();
    }
  });

  function loadSettings() {
    const saveSettings = localStorage.getItem("saveSettings");
    const saveTimersCheckbox = document.getElementById("save-timers");

    // Set checkbox state (default to checked if no setting exists)
    saveTimersCheckbox.checked =
      saveSettings === null ? true : saveSettings === "true";

    const workIntervalInput = document.getElementById("work-interval");
    const shortBreakInput = document.getElementById("short-interval");
    const longBreakInput = document.getElementById("long-interval");

    if (saveTimersCheckbox.checked) {
      const savedWorkInterval = localStorage.getItem("workInterval");
      const savedShortBreakInterval =
        localStorage.getItem("shortBreakInterval");
      const savedLongBreakInterval = localStorage.getItem("longBreakInterval");

      // Set input values and placeholders if saved values exist
      if (savedWorkInterval) {
        workIntervalInput.value = savedWorkInterval;
        workIntervalInput.placeholder = savedWorkInterval + " Minutes";
      }

      if (savedShortBreakInterval) {
        shortBreakInput.value = savedShortBreakInterval;
        shortBreakInput.placeholder = savedShortBreakInterval + " Minutes";
      }

      if (savedLongBreakInterval) {
        longBreakInput.value = savedLongBreakInterval;
        longBreakInput.placeholder = savedLongBreakInterval + " Minutes";
      }
    } else {
      // reset default placeholders
      workIntervalInput.placeholder = "25 Minutes";
      shortBreakInput.placeholder = "5 Minutes";
      longBreakInput.placeholder = "10 Minutes";

      // clear input values
      workIntervalInput.value = "";
      shortBreakInput.value = "";
      longBreakInput.value = "";
    }
  }

  function checkTimerChoice() {
    resetTimer();

    const workInterval = localStorage.getItem("workInterval") || 25;
    const shortBreakInterval = localStorage.getItem("shortBreakInterval") || 5;
    const longBreakInterval = localStorage.getItem("longBreakInterval") || 10;

    if (document.getElementById("pomodoro").checked) {
      minutes = parseInt(workInterval, 10);
    } else if (document.getElementById("short-break").checked) {
      minutes = parseInt(shortBreakInterval, 10);
    } else if (document.getElementById("long-break").checked) {
      minutes = parseInt(longBreakInterval, 10);
    }

    updateTimerText(minutes, seconds);
  }

  // checkbox is checked by default
  if (localStorage.getItem("saveSettings") === null) {
    localStorage.setItem("saveSettings", "true");
  }

  //other settings
  const customQuoteText = document.getElementById("custom-quote");
  const quoteAuthorInput = document.getElementById("quote-author");
  const quoteDisplay = document.getElementById("quote");

  const defaultQuote =
    "\"Your time is limited, so don't waste it living someone else's life\" - Steve Jobs";

  // Load quote settings
  function loadQuoteSettings() {
    const savedQuote = localStorage.getItem("customQuote");
    const savedAuthor = localStorage.getItem("quoteAuthor");

    if (savedQuote) {
      customQuoteText.value = savedQuote;
      quoteAuthorInput.value = savedAuthor || "";
      updateQuoteDisplay();
    } else {
      quoteDisplay.textContent = defaultQuote;
    }
  }

  function saveQuoteSettings() {
    const quote = customQuoteText.value.trim();
    const author = quoteAuthorInput.value.trim();

    if (quote) {
      localStorage.setItem("customQuote", quote);
      localStorage.setItem("quoteAuthor", author);
    } else {
      localStorage.removeItem("customQuote");
      localStorage.removeItem("quoteAuthor");
    }

    updateQuoteDisplay();
  }

  function updateQuoteDisplay() {
    const quote = customQuoteText.value.trim();
    const author = quoteAuthorInput.value.trim();

    if (quote) {
      quoteDisplay.textContent = `"${quote}"${author ? ` - ${author}` : ""}`;
    } else {
      quoteDisplay.textContent = defaultQuote;
    }
  }

  function toggleMinimalMode(event) {
    const isMinimal = event.target.checked;
    const containersToHide = document.querySelectorAll(
      "#left-container, #right-container, #settings-container"
    );

    containersToHide.forEach((container) => {
      container.style.display = isMinimal ? "none" : "block";
    });

    localStorage.setItem("minimalMode", isMinimal);

    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "info",
      title: isMinimal ? "Minimal mode enabled" : "Minimal mode disabled",
      showConfirmButton: false,
      timer: 2000,
    });
  }

  function loadMinimalMode() {
    const minimalMode = localStorage.getItem("minimalMode") === "true";
    const toggle = document.getElementById("minimal-mode-toggle");
    toggle.checked = minimalMode;

    if (minimalMode) {
      const containersToHide = document.querySelectorAll(
        "#left-container, #right-container, #settings-container"
      );
      containersToHide.forEach((container) => {
        container.style.display = "none";
      });
    }
  }

  // Add event listener
  document
    .getElementById("minimal-mode-toggle")
    .addEventListener("change", toggleMinimalMode);

  customQuoteText.addEventListener("input", saveQuoteSettings);
  quoteAuthorInput.addEventListener("input", saveQuoteSettings);
});
