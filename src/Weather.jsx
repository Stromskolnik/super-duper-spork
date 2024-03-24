import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchLocation, setSearchLocation] = useState('');
  const [cities, setCities] = useState([
    { name: 'Berlín', lat: 52.52, lon: 13.41 },
    { name: 'Praha', lat: 50.08, lon: 14.43 },
    { name: 'Louny', lat: 50.36, lon: 13.80 },
    { name: 'Žatec', lat: 50.33, lon: 13.55 },
    { name: 'Varšava', lat: 52.23, lon: 21.01 },
  ]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const promises = cities.map(async (city) => {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,snowfall_sum,wind_speed_10m_max,weathercode`;
          const response = await axios.get(url);
          return { city: city.name, data: response.data };
        });

        const results = await Promise.all(promises);
        setWeatherData(results);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Fetch weather data and update time every 10 minutes
    fetchWeatherData();
    const intervalId = setInterval(() => {
      fetchWeatherData();
      setCurrentTime(new Date());
    }, 600000); // 10 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, [cities]);

  const handleSearch = async () => {
    try {
      if (searchLocation.trim() === '') {
        console.error('Search location cannot be empty');
        return;
      }
  
      // Fetching coordinates using Nominatim
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`;
      const geocodeResponse = await axios.get(geocodeUrl);
      
      // Assuming the first result is the correct location
      if (geocodeResponse.data.length === 0) {
        console.error('Location not found');
        return;
      }
      const { lat, lon } = geocodeResponse.data[0];
  
      // Fetching weather data using coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max,weathercode`;
      const weatherResponse = await axios.get(weatherUrl);
  
      console.log(weatherResponse.data); // Log the response data
      const searchData = { city: searchLocation, data: weatherResponse.data };
      setWeatherData([searchData, ...weatherData]);
      setSearchLocation('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  

  const getFormattedTime = (time, index) => {
    const options = {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Prague',
    };

    const forecastTime = new Date(time);
    forecastTime.setDate(forecastTime.getDate() + index);

    return forecastTime.toLocaleString('cs-CZ', options);
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Jasno',
      1: 'Převážně jasno',
      2: 'Zčásti oblačno',
      3: 'Zataženo',
      45: 'Mlha',
      48: 'Mrznoucí mlha',
      51: 'Mrholení: Lehká intenzita',
      53: 'Mrholení: Střední intenzita',
      55: 'Mrholení: Hustá intenzita',
      56: 'Mrznoucí mrholení: Lehká intenzita',
      57: 'Mrznoucí mrholení: Hustá intenzita',
      61: 'Déšť: Mírná intenzita',
      63: 'Déšť: Střední intenzita',
      65: 'Déšť: Silná intenzita',
      66: 'Mrznoucí déšť: Lehká intenzita',
      67: 'Mrznoucí déšť: Silná intenzita',
      71: 'Sněžení: Mírná intenzita',
      73: 'Sněžení: Střední intenzita',
      75: 'Sněžení: Silná intenzita',
      77: 'Krupobití',
      80: 'Déšť se zvýšenou mokrostí: Mírná intenzita',
      81: 'Déšť: Mírná intenzita',
      82: 'Déšť: Silná intenzita',
      85: 'Sněžení se zvýšenou mokrostí: Mírná intenzita',
      86: 'Sněžení: Silná intenzita',
      95: 'Bouřka: Mírná nebo střední intenzita',
      96: 'Bouřka: Silná intenzita',
      99: 'Bouřka s kroupami: Silná intenzita',
    };

    return weatherCodes[code] || 'Neznámé';
  };

  return (
    <div className="weather-container">
      <h1>Počasí</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="cities-container">
        {weatherData.map((cityData) => (
          <div key={cityData.city} className="city-card">
            <h2>{cityData.city}</h2>
            <ul>
              {cityData.data.daily?.time?.slice(1, 4).map((time, index) => {
                if (!isNaN(new Date(time).getTime())) {
                  const dailyData = cityData.data.daily;

                  return (
                    <li key={index}>
                      <div className='Date'>{getFormattedTime(currentTime, index)}<br /></div>
                      <p>Maximální teplota: {dailyData?.temperature_2m_max?.[index]}°C<br /></p>
                      <p>Minimalní teplota: {dailyData?.temperature_2m_min?.[index]}°C<br /></p>
                      <p>Maximální rychlost vzduchu: {dailyData?.wind_speed_10m_max?.[index]}m/s<br /></p>
                      <p>Srážky: {dailyData?.precipitation_sum?.[index]}mm<br /></p>
                      <p>Sníh: {dailyData?.snowfall_sum?.[index]}mm<br /></p>
                      <p>Počasí: {getWeatherDescription(dailyData?.weathercode?.[index])}</p>
                    </li>
                  );
                }

                return null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
