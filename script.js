document.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.getElementById("start");
  const resetBtn = document.getElementById("reset-btn");
  const timerText = document.getElementById("timer-text");

  let timer;
  let minutes = 25;
  let seconds = 0;

  let isStarted = false;

  const alarmSounds = {
    alarm_1: "alarm_1.mp3",
    alarm_2: "alarm_2.mp3",
    alarm_3: "alarm_3.mp3",
    alarm_4: "alarm_4.mp3",
    alarm_5: "alarm_5.mp3",
    alarm_6: "alarm_6.mp3",
  };

  function loadAlarmPreference() {
    const savedAlarm = localStorage.getItem("selectedAlarm") || "alarm_1"; //defaults to alarm_1, the android sound
    document.getElementById("alarm-selector").value = savedAlarm;
  }

  function changeAlarmSound(alarmId) {
    const alarmAudio = document.getElementById("alarm");
    alarmAudio.src = `alarms/${alarmSounds[alarmId]}`;
    localStorage.setItem("selectedAlarm", alarmId);

    // Test if audio loads
    alarmAudio.load();
    alarmAudio.onerror = () => console.error("Error loading audio");
  }

  function testAlarmSound(alarmId) {
    const alarmAudio = document.getElementById("alarm");
    alarmAudio.src = `alarms/${alarmSounds[alarmId]}`;
    alarmAudio.volume = 0.4;
    alarmAudio.play();
  }

  document.getElementById("alarm-selector").addEventListener("change", (e) => {
    changeAlarmSound(e.target.value);
    testAlarmSound(e.target.value);
  });

  function updateTimer() {
    if (minutes === 0 && seconds === 0) {
      const doneSound = document.getElementById("alarm");
      clearInterval(timer);
      doneSound.volume = 0.1;
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

  function isDuplicateTask(value) {
    const existingTasks = document.querySelectorAll(".task");
    return Array.from(existingTasks).some(
      (task) => task.textContent.toLowerCase() === value.toLowerCase()
    );
  }

  // create task

  document
    .getElementById("task-input")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const input = event.target;
        const value = input.value.trim();
        if (value) {
          if (isDuplicateTask(value)) {
            const intervalId = setInterval(() => {
              Swal.fire({
                icon: "warning",
                title: "Duplicate Task",
                text: "This task already exists!",
                confirmButtonText: "OK",
              }).then(() => {
                clearInterval(intervalId);
              });
            }, 10);
            return;
          }

          const newTask = document.createElement("div");
          newTask.className = "task";
          newTask.textContent = value;
          newTask.addEventListener("click", deleteTask);
          document.getElementById("left-todo").appendChild(newTask);
          input.value = "";
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

  function switchTheme(themeName) {
    document.body.classList.remove(
      "theme-synthwave",
      "theme-forest",
      "theme-ocean",
      "theme-highcontrast",
      "theme-sakura",
      "theme-matcha",
      "theme-samurai",
      "theme-midnight",
      "theme-coffee",
      "theme-lavender",
      "theme-blackout",
      "theme-matrix"
    );

    if (themeName !== "default") {
      document.body.classList.add(`theme-${themeName}`);
    }

    localStorage.setItem("selectedTheme", themeName);
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem("selectedTheme") || "default";
    document.getElementById("theme-selector").value = savedTheme;
    switchTheme(savedTheme);
  }

  document.getElementById("theme-selector").addEventListener("change", (e) => {
    switchTheme(e.target.value);
  });

  //window.onload stuff
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
    loadTheme();
    checkScreenWidth();

    loadAlarmPreference();
    const savedAlarm = localStorage.getItem("selectedAlarm") || "alarm_1";
    changeAlarmSound(savedAlarm);

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
    }, 369);
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

  const quotes = [
    {
      text: "Your time is limited, so don't waste it living someone else's life",
      author: "Steve Jobs",
    },
    {
      text: "The only way to do great work is to love what you do",
      author: "Steve Jobs",
    },
    {
      text: "Stay hungry, stay foolish",
      author: "Steve Jobs",
    },
    {
      text: "Innovation distinguishes between a leader and a follower",
      author: "Steve Jobs",
    },
    {
      text: "Be the change you wish to see in the world",
      author: "Mahatma Gandhi",
    },
    {
      text: "Life is what happens when you're busy making other plans",
      author: "John Lennon",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams",
      author: "Eleanor Roosevelt",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts",
      author: "Winston Churchill",
    },
    {
      text: "It always seems impossible until it's done",
      author: "Nelson Mandela",
    },
    {
      text: "Happiness is not something ready made. It comes from your own actions",
      author: "Dalai Lama",
    },
    {
      text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment",
      author: "Buddha",
    },
    {
      text: "The journey of a thousand miles begins with one step",
      author: "Lao Tzu",
    },
    {
      text: "What lies behind us and what lies before us are tiny matters compared to what lies within us",
      author: "Ralph Waldo Emerson",
    },
    {
      text: "In the middle of every difficulty lies opportunity",
      author: "Albert Einstein",
    },
    {
      text: "The best way to predict the future is to create it",
      author: "Peter Drucker",
    },
    {
      text: "You miss 100% of the shots you don’t take",
      author: "Wayne Gretzky",
    },
    {
      text: "If you want to lift yourself up, lift up someone else",
      author: "Booker T. Washington",
    },
    {
      text: "Do what you can, with what you have, where you are",
      author: "Theodore Roosevelt",
    },
    {
      text: "The purpose of our lives is to be happy",
      author: "Dalai Lama",
    },
    {
      text: "Not everything that can be counted counts, and not everything that counts can be counted",
      author: "Albert Einstein",
    },
    {
      text: "Believe you can and you're halfway there",
      author: "Theodore Roosevelt",
    },
    {
      text: "Act as if what you do makes a difference. It does",
      author: "William James",
    },
    {
      text: "Dream big and dare to fail",
      author: "Norman Vaughan",
    },
    {
      text: "The best revenge is massive success",
      author: "Frank Sinatra",
    },
    {
      text: "Success is how high you bounce when you hit bottom",
      author: "George S. Patton",
    },
    {
      text: "Don’t count the days, make the days count",
      author: "Muhammad Ali",
    },
    {
      text: "The way to get started is to quit talking and begin doing",
      author: "Walt Disney",
    },
    {
      text: "Your limitation—it’s only your imagination",
      author: "Anonymous",
    },
    {
      text: "Great things never come from comfort zones",
      author: "Anonymous",
    },
    {
      text: "Dream it. Wish it. Do it",
      author: "Anonymous",
    },
  ];

  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  // Load quote settings
  function loadQuoteSettings() {
    const savedQuote = localStorage.getItem("customQuote");
    const savedAuthor = localStorage.getItem("quoteAuthor");

    if (savedQuote) {
      customQuoteText.value = savedQuote;
      quoteAuthorInput.value = savedAuthor || "";
      updateQuoteDisplay();
    } else {
      const defaultQuote = `"${getRandomQuote().text}" - ${
        getRandomQuote().author
      }`;
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
      const randomQuote = getRandomQuote();
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.author}`;
    }
  }

  function toggleMinimalMode(event) {
    const isMinimal = event.target.checked;
    const containersToHide = document.querySelectorAll(
      "#left-container, #right-container, #settings-container, #header"
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
        "#left-container, #right-container, #settings-container, #header"
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

  function checkScreenWidth() {
    if (window.innerWidth <= 768) {
      const containersToHide = document.querySelectorAll(
        "#left-container, #right-container, #settings-container, #header, #settings-btn"
      );
      containersToHide.forEach((container) => {
        container.style.display = "none";
      });
    } else {
      const containersToHide = document.querySelectorAll(
        "#left-container, #right-container, #settings-container, #header, #settings-btn"
      );
      containersToHide.forEach((container) => {
        container.style.display = "block";
      });
    }
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      const containersToHide = document.querySelectorAll(
        "#left-container, #right-container, #settings-container, #header, #settings-btn"
      );
      containersToHide.forEach((container) => {
        container.style.display = "none";
      });
    } else {
      const containersToHide = document.querySelectorAll(
        "#left-container, #right-container, #settings-container, #header, #settings-btn"
      );
      containersToHide.forEach((container) => {
        container.style.display = "block";
      });
    }
  });
});
