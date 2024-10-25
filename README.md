
# MyWeather Dashboard

MyWeather is a responsive weather dashboard application that allows users to view current weather conditions, a 5-day forecast, and custom weather alerts. Users can also search for specific cities, and set temperature thresholds to receive customized weather alerts.

## Features

- **Current Weather Display**: Displays current weather information such as temperature, humidity, wind speed, pressure, and visibility.
- **5-Day Forecast**: Provides a 5-day weather forecast, including daily max/min temperatures, conditions, and precipitation chances.
- **Custom Weather Alerts**: Allows users to set upper and lower temperature thresholds and continuous rain thresholds. Triggers alerts if conditions meet or exceed thresholds.
- **Temperature Conversion**: Supports toggling between Celsius and Fahrenheit.
- **City Search with Suggestions**: Search for a city and select from suggestions as you type.

## Project Structure

```
my_weather/
│
├── public/                 # Public assets
│   └── index.html          # Main HTML file
│
├── src/
│   ├── Components/         # Reusable components
│   │   ├── Forecast.js     # 5-day forecast component
│   │   ├── Navbar.js       # Navigation bar component
│   │   ├── Search.js       # City search component with suggestions
│   │   ├── TempConvert.js  # Temperature conversion component
│   │   ├── Weather.js      # Current weather display component
│   │   ├── WeatherAlert.js # Custom weather alerts component
│   │   └── WeatherInfo.js  # Weather information component (humidity, visibility, etc.)
│   │
│   ├── App.js              # Main app component
│   └── index.js            # Entry point for React app
│
├── utils/
│   └── constants.js        # Stores API key and constants
│
├── App.css                 # Global CSS styling
└── README.md               # Project documentation
```

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/my_weather.git
   cd my_weather
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed, then install the required packages.
   ```bash
   npm install
   ```

3. **Add API Key**:
   - Obtain an API key from [OpenWeatherMap](https://openweathermap.org/api).
   - Create a `constants.js` file in the `utils` directory to store your API key:
     ```javascript
     // utils/constants.js
     export const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
     ```

4. **Run the app**:
   ```bash
   npm start
   ```
   The application will start locally, accessible at `http://localhost:3000`.

## Usage

1. **Search for a City**: Enter the city name in the search bar. Suggestions will appear based on the input. Selecting a city updates the dashboard with its weather data.

2. **Set Weather Alerts**: Customize upper and lower temperature thresholds or specify a continuous rain threshold. The app will display alerts based on these settings.

3. **Temperature Conversion**: Use the toggle to switch between Celsius and Fahrenheit for temperature display.

## Approach

### 1. API Integration
The app integrates with the OpenWeatherMap API to fetch real-time weather data and a 5-day forecast. It uses `fetch` to retrieve data based on the user’s selected city or device location.

### 2. Component-Based Structure
- **Forecast**: Displays the 5-day forecast with max/min temperatures and conditions for each day.
- **WeatherInfo**: Shows additional weather metrics like humidity, visibility, sunrise, and sunset times.
- **WeatherAlert**: Allows the user to set customizable alerts for temperature and rain conditions.

### 3. Responsive Design
CSS media queries ensure the layout adjusts across devices, enhancing readability and usability. Components are styled to fit mobile, tablet, and desktop screens with smooth transitions.

### 4. Custom Weather Alerts
The `WeatherAlert` component monitors the fetched forecast data, and based on the user's threshold settings, alerts are dynamically generated if the criteria are met.

## Technologies Used

- **React.js** for building the UI components
- **CSS** for styling and responsiveness
- **OpenWeatherMap API** for fetching weather data

## Future Improvements

- **Unit Testing**: Adding Jest for component testing.
- **Advanced Forecasting**: Incorporating additional weather parameters like UV index or air quality.
- **Localization**: Supporting multiple languages for a broader user base.

