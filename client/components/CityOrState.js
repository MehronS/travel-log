import React from "react";

function CityOrState(props) {
  const city = props.city.data.attributes;

  // move the map marker to the selected city
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

/*

 Lets invite Sarahs new friend Joe to her event. She can select him frmo the dropdown of all of her friends, and Add him to the event. When she scrolls down to the bottom of the page, Sarah will be able to see everyone who's going to be attending!

 To help organize the details, Sarah can create a chat specifically for this event where everyone can communicate.
 ---'type in a msg'---.

 Looks like Joe responded with a message. ---wait ? ---

 Awesome, let the planning begin.


   In the profile page, Sarah can make changes to her account information as well as manage her friend requests. Looks like she has 2 friend requests pending. Lets accept and head over to the personal page.

This is Sarah's personnel hub. From here, she can see her old and new friends, Events she is hosting, and events that she is just attending.


Now that you have seen our application, here is Sean to talk a little about our tech stack.
*/
