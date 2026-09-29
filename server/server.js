const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Search = require("./models/Search");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Weather Dashboard API is running" });
});

// User location ke latitude/longitude se weather
app.get("/api/weather/location", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
      `&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&timezone=auto`;

    const locationUrl =
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}` +
      `&longitude=${lon}&count=1&language=en&format=json`;

    const [weatherResponse, locationResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(locationUrl),
    ]);

    const weatherData = await weatherResponse.json();
    const locationData = await locationResponse.json();

    const place = locationData.results?.[0];

    res.json({
      location: {
        city: place?.name || "Your Current Location",
        state: place?.admin1 || "",
        country: place?.country || "",
      },
      weather: weatherData.current,
      timezone: weatherData.timezone,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch weather data",
    });
  }
});

// City/state search karke weather aur history save
app.get("/api/weather/search", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "City name is required",
      });
    }

    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
      `&count=10&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);
const geoData = await geoResponse.json();

let location;

if (geoData.results && geoData.results.length > 0) {
  location = geoData.results[0];
} else {
  const stateLocations = {
    "himachal pradesh": {
      name: "Himachal Pradesh",
      admin1: "Himachal Pradesh",
      country: "India",
      latitude: 31.1048,
      longitude: 77.1734,
    },
  };

  const stateLocation = stateLocations[city.trim().toLowerCase()];

  if (!stateLocation) {
    return res.status(404).json({
      message: "City or state not found",
    });
  }

  location = stateLocation;
}

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}` +
      `&longitude=${location.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const existingSearch = await Search.findOne({
  city: location.name,
  state: location.admin1 || "",
  country: location.country || "",
});

if (existingSearch) {
  existingSearch.searchedAt = new Date();
  await existingSearch.save();
} else {
  await Search.create({
    city: location.name,
    state: location.admin1 || "",
    country: location.country || "",
    latitude: location.latitude,
    longitude: location.longitude,
  });
}

    res.json({
      location: {
        city: location.name,
        state: location.admin1 || "",
        country: location.country || "",
      },
      weather: weatherData.current,
      timezone: weatherData.timezone,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to search weather",
    });
  }
});

// MongoDB se latest 10 searches
app.get("/api/history", async (req, res) => {
  try {
    const history = await Search.find()
      .sort({ searchedAt: -1 })
      .limit(10);

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch search history",
    });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });