import { useEffect, useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const API_URL = "http://localhost:5000";

function getWeatherInfo(code) {
  if (code === 0) {
    return {
      icon: "☀️",
      label: "Clear Sky",
      type: "sunny",
    };
  }

  if ([1, 2].includes(code)) {
    return {
      icon: "🌤️",
      label: "Partly Cloudy",
      type: "cloudy",
    };
  }

  if (code === 3) {
    return {
      icon: "☁️",
      label: "Cloudy",
      type: "cloudy",
    };
  }

  if ([45, 48].includes(code)) {
    return {
      icon: "🌫️",
      label: "Foggy",
      type: "cold",
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      icon: "🌦️",
      label: "Drizzle",
      type: "rain",
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      icon: "🌧️",
      label: "Rainy",
      type: "rain",
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      icon: "❄️",
      label: "Snowy",
      type: "snow",
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      icon: "⛈️",
      label: "Thunderstorm",
      type: "rain",
    };
  }

  return {
    icon: "🌤️",
    label: "Weather Update",
    type: "cloudy",
  };
}

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [skipSuggestions, setSkipSuggestions] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
     if (skipSuggestions) {
    setSuggestions([]);
    setSkipSuggestions(false);
    return;
  }

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=5&language=en&format=json`
        );

        const data = await response.json();

       const results = data.results || [];

const stateAliases = {
  odisa: "Odisha",
  orissa: "Odisha",
};

const normalizedQuery = query.trim().toLowerCase();

const stateMatch = INDIAN_STATES.find(
  (state) => state.toLowerCase() === normalizedQuery
);

const aliasState = stateAliases[normalizedQuery];

const matchedState = stateMatch || aliasState;

if (matchedState) {
  const stateSuggestion = {
    id: `state-${matchedState}`,
    name: matchedState,
    admin1: matchedState,
    country: "India",
    country_code: "IN",
    latitude: 20.9517,
    longitude: 85.0985,
    isState: true,
  };

  setSuggestions([stateSuggestion]);
  return;
}

const sortedResults = results.sort((a, b) => {
  if (a.country_code === "IN" && b.country_code !== "IN") {
    return -1;
  }

  if (a.country_code !== "IN" && b.country_code === "IN") {
    return 1;
  }

  return 0;
});

setSuggestions(sortedResults);

      } catch (error) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function loadHistory() {
    try {
      const response = await fetch(`${API_URL}/api/history`);
      const data = await response.json();
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }

  async function getLocationWeather() {
    if (!navigator.geolocation) {
      setLoading(false);
      setMessage(
        "Your browser does not support location access. Search for a city instead."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `${API_URL}/api/weather/location?lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message);
          }

          setWeatherData(data);
        } catch {
          setMessage("Unable to get weather for your current location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setMessage(
          "Location access was not allowed. Search for a city to view its weather."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  async function handleSearch(event) {
    event.preventDefault();

    const city = query.trim();

    if (!city) {
      setMessage("Please enter a city or state name.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/weather/search?city=${encodeURIComponent(city)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setWeatherData(data);
      setQuery("");

      await loadHistory();
    } catch (error) {
      setMessage(error.message || "City not found. Try another city.");
    } finally {
      setLoading(false);
    }
  }
  async function handleSuggestionClick(place) {
  setSkipSuggestions(true);
  setSuggestions([]);
  setQuery(place.name);
  setLoading(true);
  setMessage("");

  try {
    const response = await fetch(
      `${API_URL}/api/weather/location?lat=${place.latitude}&lon=${place.longitude}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Weather not found");
    }

    setWeatherData({
  ...data,
  location: {
    ...data.location,
    city: place.name,
    state: place.admin1 || data.location.state,
    country: place.country || data.location.country,
  },              
});

    await loadHistory();
  } catch (error) {
    setMessage(error.message || "Weather not found.");
  } finally {
    setLoading(false);
  }
}

  async function handleHistoryClick(city) {
  setQuery(city);
  setLoading(true);
  setMessage("");

  try {
    const response = await fetch(
      `${API_URL}/api/weather/search?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Weather not found");
    }

    setWeatherData(data);
    await loadHistory();
  } catch (error) {
    setMessage(error.message || "Weather not found.");
  } finally {
    setLoading(false);
  }
}

 useEffect(() => {
  loadHistory();
}, []);

  const current = weatherData?.weather;

  const weatherInfo = current
    ? getWeatherInfo(current.weather_code)
    : null;

  const placeName = weatherData?.location
  ? [
      weatherData.location.city,
      weatherData.location.state !== weatherData.location.city
        ? weatherData.location.state
        : "",
      weatherData.location.country,
    ]
      .filter(Boolean)
      .join(", ")
  : "";

  return (
    <main className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      
      {/* Animated background */}
      <div className="sky-background">
        <div className="cloud cloud-one"></div>
        <div className="cloud cloud-two"></div>
        <div className="sun-glow"></div>
      </div>

      <section className="dashboard">

        {/* HEADER */}
        <header className="topbar">

          <div className="brand-area">
            <img
              src="/vatavaran-logo.png"
              alt="Vatavaran"
              className="brand-logo"
            />
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </header>

        {/* SEARCH */}
        <section className="search-section">

          <form className="search-box" onSubmit={handleSearch}>

            <span className="search-icon">🔍</span>

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city or state..."
            />
            {suggestions.length > 0 && (
             <div className="suggestions-list">
              {suggestions.map((place) => (
                <div
                  key={place.id}
                  className="suggestion-item"
                  onClick={() => {
                    setSkipSuggestions(true);
                    setQuery(place.name);
                    setSuggestions([]);

                    handleSuggestionClick(place);
                  }}
                >
                  <strong>{place.name}</strong>
                  <small>
                    {[place.admin1, place.country].filter(Boolean).join(", ")}
                  </small>
                </div>
              ))}
            </div>
            )}

           <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
            </button>

          </form>

          <button
            className="location-button"
            onClick={getLocationWeather}
          >
            📍 Use My Location
          </button>

        </section>

        {/* MESSAGE */}
        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="dashboard-grid">

          {/* WEATHER CARD */}
          <section
            className={`weather-card ${
              weatherInfo ? `weather-${weatherInfo.type}` : ""
            }`}
          >

            {loading ? (
              <div className="loading-state">

                <div className="spinner"></div>

                <p>Getting your weather...</p>

              </div>
            ) : current ? (

              <>

{/* Weather animation area */}
<div className="weather-animation">

  {weatherInfo.type === "rain" && (
    <div className="rain-effect">
      <span>🌧️</span>

      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  )}

  {weatherInfo.type === "snow" && (
    <div className="snow-effect">
      <span>☁️</span>

      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
      <i>❄</i>
    </div>
  )}

  {weatherInfo.type === "sunny" && (
    <div className="sun-effect">
      <div className="sun-core">☀️</div>
      <div className="sun-rays"></div>
    </div>
  )}

  {weatherInfo.type === "cold" && (
    <div className="cold-effect">
      <span>❄️</span>
      <div className="mist mist-one"></div>
      <div className="mist mist-two"></div>
      <div className="mist mist-three"></div>
    </div>
  )}

  {weatherInfo.type === "cloudy" && (
    <div className="cloud-effect">
      <span>☁️</span>
      <span>☁️</span>
    </div>
  )}

{/* Wind animation */}
{current.wind_speed_10m >= 4 && (
  <div className="wind-effect">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
)}

</div>

                {/* LOCATION */}
                <div className="weather-heading">

                  <div>

                    <p className="eyebrow">
                      CURRENT WEATHER
                    </p>

                    <h2>
                      📍 {placeName}
                    </h2>

                    <p className="updated-time">
                      Updated {current.time}
                    </p>

                  </div>

                </div>

                {/* TEMPERATURE */}
                <div className="temperature-section">

                  <div className="main-weather-icon">
                    {weatherInfo.icon}
                  </div>

                  <div className="temperature">
                    {Math.round(current.temperature_2m)}
                    <span>°C</span>
                  </div>

                  <div className="condition-info">

                    <h3>
                      {weatherInfo.label}
                    </h3>

                    <p>
                      Feels like{" "}
                      {Math.round(current.apparent_temperature)}°C
                    </p>

                  </div>

                </div>

                {/* WEATHER DETAILS */}
                <div className="details-grid">

                  <div className="detail-card">

                    <span className="detail-icon">
                      💧
                    </span>

                    <p>Humidity</p>

                    <strong>
                      {current.relative_humidity_2m}%
                    </strong>

                  </div>

                  <div className="detail-card">

                    <span className="detail-icon">
                      💨
                    </span>

                    <p>Wind Speed</p>

                    <strong>
                      {Math.round(current.wind_speed_10m)}
                      {" "}km/h
                    </strong>

                  </div>

                  <div className="detail-card">

                    <span className="detail-icon">
                      🌡️
                    </span>

                    <p>Feels Like</p>

                    <strong>
                      {Math.round(current.apparent_temperature)}
                      °C
                    </strong>

                  </div>

                </div>

              </>

            ) : (

              <div className="empty-weather">

                <span>🌤️</span>

                <h2>
                  Welcome to Vatavaran
                </h2>

                <p>
                  Allow location access or search for a city.
                </p>

              </div>

            )}

          </section>

          {/* RECENT SEARCHES */}
          <aside className="history-card">

            <div className="history-heading">

              <div>

                <p className="eyebrow">
                  MONGODB
                </p>

                <h2>
                  Recent Searches
                </h2>

              </div>

              <span>
                🕘
              </span>

            </div>

            {history.length > 0 ? (

              <div className="history-list">

                {history.map((item) => (

                  <button
                    className="history-item"
                    key={item._id}
                    onClick={() =>
                      handleHistoryClick(item.city)
                    }
                  >

                    <span className="history-icon">
                      📍
                    </span>

                    <div>

                      <strong>
                        {item.city}
                      </strong>

                      <small>
                        {[
                          item.state,
                          item.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </small>

                    </div>

                    <span className="arrow">
                      →
                    </span>

                  </button>

                ))}

              </div>

            ) : (

              <p className="history-empty">
                Your searched cities will appear here.
              </p>

            )}

          </aside>

        </div>

        {/* FOOTER */}
        <footer>

          <span>
            🌍 Weather data by Open-Meteo
          </span>

          <span>
            •
          </span>

          <span>
            Search history stored in MongoDB
          </span>

        </footer>

      </section>

    </main>
  );
}

export default App;