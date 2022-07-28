import React,{useEffect, useState} from "react";
import "../assets/css/Bookmark.css";


function DailyForecast({day, forecast}) {
  return (
      <>
      <div className='daily-container'>
          <div className='day'>{day}</div>
          <img src={"http://openweathermap.org/img/wn/"+forecast.icon+"@2x.png"} alt="cloudy-icon"/>
				<p>{Math.round(forecast.temperature.maximum)}&#8451;</p>
				<p>{Math.round(forecast.temperature.minimum)}&#8451;</p>
      </div>
      </>
  )
}

function Bookmark({x, weather, city, dailyforecast}) {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return (
		<>
		<div className="bookmark">
			<div className="bookmark-country-name">
				<h1>{city}</h1>
			</div>
			<div className="bookmark-cloud-type">
				<div className='weather-icon'>
                    <img src={"http://openweathermap.org/img/wn/"+dailyforecast[0].icon+"@2x.png"} alt='cloudy_img'/>
                </div>
				<p>{dailyforecast[0].condition}</p>
			</div>
			<div className="bookmark-wind-humidity">
				<ul>
					<li> Wind {dailyforecast[0].wind} kmph </li>
					<li> Humidity {dailyforecast[0].humidity} </li>
				</ul>
			</div>
			<div className="bookmark-temp">
				<h1>20 &#8451;</h1>
			</div>
			<div className="bookmark-weathericon">
				<img alt="" src=""></img>
			</div>
			<div className="flex bookmark-daily-forecast">
		    {dailyforecast.map((forecast, index) => (
				  <DailyForecast key={index} day={days[forecast.date.getDay()]} forecast={forecast} />
        ))}
			</div>
		</div>
		</>
	)
}





function BookmarksContainer({bookmarks}){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [results, setResults] = useState(null);
	const [forecast, setForecast] = useState(null);
	const [generic, setGeneric] = useState("app");
	const [notfound, setFlag] = useState(false);
	const [weatherData, setWeatherData] = useState([]);

	const fetchWeather = (city) => {
		const url = "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric" +
        "&appid=" +
        process.env.REACT_APP_APIKEY;
		return fetch(url)
		  .then((res) => res.json())
		  .then((result) => {
			
			if (result.cod !== "200") {
	
			  setIsLoaded(false);
			  console.log("hah");
			  if(result.name !== null){
				setIsLoaded(true);
				console.log("name",result.name);
				setResults(results);
			  }
			  if (result["cod"] == "404") {
				setIsLoaded(true);
				setFlag(true);
			  }
			  return null;
			}
			console.log("yo");
	
			let hourlyForecast = [];
			result.list.forEach((fc) => {
			  hourlyForecast.push({
				current_temp: fc.main.temp,
				condition: fc.weather[0].description,
				date: new Date(fc.dt * 1000),
				feels_like: fc.main.feels_like,
				temperature: {
				  minimum: fc.main.temp_min,
				  maximum: fc.main.temp_max,
				},
				icon: fc.weather[0].icon,
				windspeed: fc.wind.speed,
				humidity: fc.main.humidity,
			  });
			});
			setWeatherData(prev=>{
				return [...prev, {forecast:hourlyForecast,city:city}]
			});
			setIsLoaded(true);
		  })
		  .catch((error) => {
			setIsLoaded(true);
			console.log(error);
			setError(error);
		  });
	  };

	  useEffect(()=>{
		console.log(bookmarks+">>>>>>>>>>>>>>>>>>>>>>>>>.");
		setWeatherData([]);
		setIsLoaded(false);
		bookmarks.forEach(async city=>{
			await fetchWeather(city);
		 })
	  },[bookmarks]);

	  return(
		<div className="flex bookmark-box">
			{isLoaded && weatherData && weatherData.map(data=>{
				const daily_forecast = [];
				console.log(data);
				data?.forecast?.map((data, key) => {
					if (key === 0) {
						daily_forecast.push(data);
					}
					const last = daily_forecast.length - 1;
			
					if (!(data.date.getDay() == daily_forecast[last].date.getDay())) {
						daily_forecast.push(data);
					}
				});
				return <Bookmark city={data.city} dailyforecast={daily_forecast.slice(0, 5)}/>
			})}
		</div>
	  )

	  
	
}


export default BookmarksContainer;

