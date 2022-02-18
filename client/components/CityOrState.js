import React from "react";

function CityOrState(props) {
  const city = props.city.data.attributes;

  // move the map marker to the selected city location
  props.loadMarker(city.latitude, city.longitude);

  return (
    <div>
      <button onClick={props.toggleCity} className="login_buttons">
        Back to {props.countryName}
      </button>
      <h2 className="city_name">
        <a href={city.wikipedia_url} target="_blank">
          {city.name}
        </a>
      </h2>
      <fieldset className="to_consider">
        <h3>
          Average Rating:{" "}
          {Number(city.average_rating.toFixed(2))
            ? city.average_rating.toFixed(2)
            : "N/A"}
        </h3>
        <div className="safety_div">
          <h3>Safety: {city.safety[props.countryName].text}</h3>
          <h4>{city.safety[props.countryName].subText}</h4>
        </div>
      </fieldset>
      <fieldset className="to_consider">
        <h3>
          <a href={city.airbnb_url} target="_blank">
            Airbnb
          </a>
        </h3>
        <h3>
          <a href={city.vrbo_url} target="_blank">
            Lodging
          </a>
        </h3>
        <h3>
          <a href={city.getyourguide_url} target="_blank">
            Get Your Guide
          </a>
        </h3>
      </fieldset>
    </div>
  );
}

export default CityOrState;
