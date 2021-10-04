import React from 'react'
import cities from '../../lib/city.list.json';
import Head from 'next/head';
import TodaysWeather from '../../components/TodaysWeather';
import moment from 'moment-timezone';
import HourlyWeather from '../../components/HourlyWeather';


// this function gets the city name from the params
export async function getServerSideProps(context) {

  // taking the city params and using that to grab the correct city from the .json file
  const city = getCity(context.params.city);

  // 404 if no city found
  if(!city) {
    return {
      notFound: true,
    };
  }

  // API request
  const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`)

  const data = await res.json();

  if(!data) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: getHourlyWeather(data.hourly, data.timezone),
    },
  };
}

// helper function to get the id from the params
const getCity = param => {
  const cityParam = param.trim();
  const splitCity = cityParam.split("-")
  const id = splitCity[splitCity.length - 1];

  // return null if no id could be found (something went wrong)
  if(!id) {
    return null;
  }

  // Find the correct from the .json file
  const city = cities.find(city => city.id.toString() == id);

  if(city) {
    return city;
  } else {
    return null;
  }
};

// helper function to change api data for use
const getHourlyWeather = (hourlyData, timezone) => {
  // use moment to get the end of day with corrent time zone
  const endOfDay = moment().tz(timezone).endOf('day').valueOf();
  const eodTimeStamp = Math.floor(endOfDay / 1000);

  const todaysData = hourlyData.filter(data => data.dt < eodTimeStamp);

  return todaysData;
}


export default function City({ 
  hourlyWeather, 
  city, 
  currentWeather, 
  dailyWeather,
  timezone, 
}) {
  return (
    <div>
      <Head>
        <title>{city.name} Weather</title>
      </Head>
      <div className="page-wrapper">
        <div className="container">
          <TodaysWeather 
            city={city} 
            weather={dailyWeather[0]} 
            timezone={timezone}
          />
          <HourlyWeather 
            hourlyWeather={hourlyWeather} 
            timezone={timezone}
          />
        </div>
      </div>
    </div>
  )
}

