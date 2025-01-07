// Select DOM elements
const inputField = document.querySelector(".input-part input");
const infoTxt = document.querySelector(".info-txt");
const locationBtn = document.querySelector(".input-part button");
const weatherPart = document.querySelector(".weather-part");
const wrapper = document.querySelector(".wrapper");
const darkModeBtn = document.querySelector(".dark-mode-btn");

// OpenWeatherMap API key and base URL
const API_KEY = "1e3e8f230b6064d27976e41163a82b77";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetch weather data
const fetchWeather = async (city) => {
  try {
    infoTxt.classList.add("pending");
    infoTxt.textContent = "Getting weather details...";
    const response = await fetch(
      `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();

    if (data.cod === "404") {
      showError("City not found!");
      return;
    }

    displayWeather(data);
  } catch (error) {
    showError("Something went wrong! Check your connection.");
  }
};

// Display weather data
const displayWeather = (data) => {
  const { name, sys, weather, main } = data;

  wrapper.classList.add("active");
  weatherPart.querySelector(
    "img"
  ).src = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
  weatherPart.querySelector(".numb").textContent = Math.round(main.temp);
  weatherPart.querySelector(".weather").textContent = weather[0].description;
  weatherPart.querySelector(
    ".location span"
  ).textContent = `${name}, ${sys.country}`;
  weatherPart.querySelector(".numb-2").textContent = Math.round(
    main.feels_like
  );
  weatherPart.querySelector(".humidity span").textContent = `${main.humidity}%`;

  infoTxt.textContent = ""; // Clear the info text
  infoTxt.classList.remove("pending");
};

// Handle errors
const showError = (message) => {
  infoTxt.classList.remove("pending");
  infoTxt.classList.add("error");
  infoTxt.textContent = message;
};

// Detect user location
const detectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          infoTxt.classList.add("pending");
          infoTxt.textContent = "Detecting your location...";
          const response = await fetch(
            `${API_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await response.json();
          displayWeather(data);
        } catch {
          showError("Failed to fetch weather for your location.");
        }
      },
      () => {
        showError("Location access denied.");
      }
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
};

// Select the icon
const refreshIcon = document.getElementById("refresh-icon");

// Add a click event listener
refreshIcon.addEventListener("click", () => {
  location.reload(); // Refresh the page
});

// Dark mode toggle
const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode-active");
  darkModeBtn.innerHTML = document.body.classList.contains("dark-mode-active")
    ? `<i class="bx bx-sun"></i>`
    : `<i class="bx bx-moon"></i>`;
};

// Event listeners
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && inputField.value.trim() !== "") {
    fetchWeather(inputField.value.trim());
  }
});

locationBtn.addEventListener("click", detectLocation);
darkModeBtn.addEventListener("click", toggleDarkMode);
