import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

function App(){
 const [city,setCity]=useState('Mumbai');
 const [weather,setWeather]=useState(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');

 async function getWeather(e){
   e?.preventDefault(); setLoading(true); setError(''); setWeather(null);
   try{
     const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
     if(!geo.ok) throw new Error('Unable to reach API');
     const gd=await geo.json();
     if(!gd.results?.length) throw new Error('City not found');
     const p=gd.results[0];
     const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto`);
     if(!res.ok) throw new Error('Weather API request failed');
     const d=await res.json();
     setWeather({name:p.name,country:p.country,temp:d.current.temperature_2m,humidity:d.current.relative_humidity_2m,feels:d.current.apparent_temperature,wind:d.current.wind_speed_10m,unit:d.current_units.temperature_2m});
   }catch(err){setError(err.message)}
   finally{setLoading(false)}
 }
 React.useEffect(()=>{getWeather()},[]);
 return <main>
   <div className="card">
    <span className="tag">REACT • API INTEGRATION</span>
    <h1>Weather Dashboard</h1>
    <p className="sub">Fetch and display live weather data from a public API.</p>
    <form onSubmit={getWeather}><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter a city"/><button>{loading?'Loading...':'Get Weather'}</button></form>
    {error && <div className="error">{error}</div>}
    {weather && <section>
      <div className="location">📍 {weather.name}, {weather.country}</div>
      <div className="temp">{weather.temp}{weather.unit}</div>
      <div className="grid">
       <div><b>Feels Like</b><span>{weather.feels}{weather.unit}</span></div>
       <div><b>Humidity</b><span>{weather.humidity}%</span></div>
       <div><b>Wind Speed</b><span>{weather.wind} km/h</span></div>
      </div>
    </section>}
    <small>Uses Open-Meteo Geocoding API and Weather Forecast API.</small>
   </div>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);