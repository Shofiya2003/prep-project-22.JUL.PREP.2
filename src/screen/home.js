import { useEffect, useState } from "react";
import "./App.css";
import { Fab } from "../Components/common/Fab";
import logo from "../assets/logo.png";
import { PATHS, useRouter } from "../Components/route.js";

function App() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [results, setResults] = useState(null);
  const [generic, setGeneric] = useState("app");

  useEffect(() => {
    document.body.classList.add("app");
  }, []);

  const navigateToTrip = () => router.push(PATHS.TRIP);

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.REACT_APP_APIKEY}`
      )
        .then((res) => res.json())
        .then((result) => {
          setIsLoaded(true);
          setCity(`${result.name}, ${result.sys.country}`);
          setResults(results);
        })
        .catch((err) => {
          setIsLoaded(false);
          setError(err);
        });
    });
  }, []);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric" +
        "&appid=" +
        process.env.REACT_APP_APIKEY
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
            document.body.classList = result.weather[0].main;
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <div className="header">
          <img className="logo" src={logo} alt="MLH Prep Logo"></img>
          <h1>Weather App</h1>
        </div>
        <main>
          <h2>Enter a city below 👇</h2>
          <input
            type="text"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
            }}
          />
          <div className="Results">
            {!isLoaded && <h2>Loading...</h2>}
            {console.log(results)}
            {isLoaded && results && (
              <>
                <h3>{results.weather[0].main}</h3>
                <p>Feels like {results.main.feels_like}°C</p>
                <i>
                  <p>
                    {results.name}, {results.sys.country}
                  </p>
                </i>
              </>
            )}
          </div>
          <p className="required-things-heading">Things you should carry 🎒</p>
          {isLoaded && results && <Box weather={results.weather[0].main} />}
          <p className="required-things-heading">Things you should carry 🎒</p>
          {isLoaded && results && <Box weather={results.weather[0].main} />}

          <Fab icon={"airplane_ticket"} onClick={navigateToTrip}>
            Plan Trip
          </Fab>
        </main>
      </>
    );
  }
}

export default App;
