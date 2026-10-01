# 🌦️ Vatavaran – Weather 

## 📌 Introduction

Vatavaran is a web-based weather dashboard developed as a group internship project.

The application allows users to check current weather information based on their current location and also search for another city or state.

It provides important weather details such as temperature, weather condition, feels-like temperature, humidity, and wind speed.

## 🎯 Objective

The main objectives of the Vatavaran Weather Dashboard are:

- Detect the user's current location using browser geolocation.
- Display current weather information.
- Allow users to search for cities and states.
- Provide weather search suggestions.
- Store recent searches in MongoDB.
- Display previously searched locations.
- Provide a responsive interface for desktop and mobile devices.
- Provide light and dark mode support.
- Present weather information in a simple and user-friendly interface.

## ✨ Features

- 📍 Current location weather
- 🔎 City and state search
- 💡 Search suggestions / autocomplete
- 🌡️ Current temperature
- 🌤️ Weather condition
- 🌡️ Feels-like temperature
- 💧 Humidity
- 💨 Wind speed
- 🕒 Updated weather information
- 🗂️ Recent search history
- 🌙 Dark mode
- ☀️ Light mode
- 📱 Responsive design
- ⏳ Loading state while searching
- ⚠️ Error handling for invalid searches
- 🗄️ MongoDB search history

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### APIs
- Open-Meteo Weather API
- Open-Meteo Geocoding API

### Development Tools
- Visual Studio Code
- Git
- GitHub

### 🏗️ Project Architecture

The project follows a client-server architecture.

```text
                 ┌─────────────────────┐
                 │        User         │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ React + Vite        │
                 │ Frontend            │
                 └──────────┬──────────┘
                            │
                       HTTP Requests
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Node.js + Express   │
                 │ Backend             │
                 └───────┬───────┬─────┘
                         │       │
                         ▼       ▼
              ┌─────────────┐  ┌─────────────┐
              │ Open-Meteo  │  │ MongoDB     │
              │ Weather API │  │ Atlas       │
              └─────────────┘  └─────────────┘

### 🔄 How the Application Works

### 1. Current Location

When the user opens the application, the browser can request permission to access the user's location.

If permission is granted, the application obtains the user's latitude and longitude and requests weather information.

```text
Browser Location
       ↓
Latitude + Longitude
       ↓
Backend
       ↓
Open-Meteo Weather API
       ↓
Current Weather Data
       ↓
React Dashboard

#### 2. City / State Search

Users can search for a city or state using the search box.

```text

User enters location
        ↓
Search Suggestions
        ↓
User selects location
        ↓
Backend
        ↓
Open-Meteo API
        ↓
Weather Data
        ↓
Dashboard

### 3. Recent Searches

When a location is searched, the application stores the search information in MongoDB.

Previously searched locations can then be displayed as recent searches.

## 📂 Project Structure

```text
Weather-dashbord/
│
├── client/
│   ├── public/
│   │   └── vatavaran-logo.png
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── server.js
│   ├── models/
│   │   └── Search.js
│   ├── package.json
│   └── .env
│
├── .gitignore
├── README.md
└── package.json
    
Note: The .env file contains private configuration and should not be uploaded to GitHub.

## 🔌 API Endpoints

### Get Weather by Location

```text
GET /api/weather/location

Example:

/api/weather/location?lat=23.0225&lon=72.5714

Search Weather by City

GET /api/weather/search

Example:

/api/weather/search?city=Ahmedabad

## 🗄️ Database

MongoDB Atlas is used to store recent search information.

The search data contains information such as:

- City
- State
- Country
- Latitude
- Longitude
- Search date and time

The database allows the application to maintain a history of recently searched locations.

## 🌐 External APIs

### Open-Meteo Weather API

Open-Meteo is used to retrieve current weather information.

The application uses weather data such as:

- Temperature
- Relative humidity
- Apparent temperature
- Weather code
- Wind speed

### Open-Meteo Geocoding API

The Open-Meteo Geocoding API is used to search for locations and provide search suggestions.

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VSsukhnani21/vatavaran-weather-dashboard.git

### 2. Open the Project

cd vatavaran-weather-dashboard

### 3. Install Frontend Dependencies

cd client
npm install

### 4. Install Backend Dependencies

Open another terminal and run:

cd server
npm install

### 5. Configure Environment Variables

Create a .env file inside the server folder.

Add the required MongoDB connection configuration.

Example:

MONGODB_URI=your_mongodb_connection_string
PORT=5000

Important: Do not upload the .env file to GitHub

### 6. Start the Backend

Inside the server folder:

node server.js

### 7. Start the Frontend

Inside the client folder:

npm run dev

Then open the local URL provided by Vite in your browser.

## 📱 Responsive Design

Vatavaran is designed to work across different screen sizes, including:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile devices

The interface adjusts according to the screen size to provide a better user experience.

## 🔐 Security

Sensitive configuration such as the MongoDB connection string is stored in the `.env` file.

The `.env` file is excluded from Git using `.gitignore`.

This helps prevent private database credentials from being uploaded to the GitHub repository.

## 🚀 Future Scope

The project can be further improved by adding:

- Multi-day weather forecasts
- Weather alerts
- Weather charts
- More detailed weather information
- Improved location detection
- Additional weather data sources
- User accounts and personalized settings

## 👥 Team Members

This project was developed as a group internship project by:

| No. | Name | Role |
|-----|------|------|
| 1 | Dipak Yadav | Design |
| 2 | Lotwan Amarjeet Kaur | Frontend |
| 3 | Vishal Sukhnani | Backend |

## 📊 Project Presentation

A detailed 10-page project presentation has been prepared for the Vatavaran Weather Dashboard.

The presentation covers the project's:

- Introduction
- Objective
- Features
- Technology Stack
- Project Architecture
- Working Process
- Database
- API Integration
- Team Members
- Project Conclusion

The presentation file will be added to this repository.

**Presentation:** [View Project Presentation (PDF)](./Vatavaran-Project-Presentation.pdf)

## 📄 Conclusion

Vatavaran is a weather dashboard developed to provide users with current weather information through a simple and responsive web interface.

The project demonstrates the integration of a React frontend, Node.js and Express backend, MongoDB database, browser geolocation, and external weather APIs into a single web application.

## 🔗 GitHub Repository

[Vatavaran Weather Dashboard](https://github.com/VSsukhnani21/vatavaran-weather-dashboard)

