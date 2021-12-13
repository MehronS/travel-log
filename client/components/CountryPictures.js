import React from "react";

function CountryPictures(props) {
  return (
    <div>
      <fieldset className="single_country_input_div">
        <h3>Your Photos from {props.country.name.common}!!</h3>
        <div className="country_pictures">
          <h3>Add More</h3>
          <div>
            <form
              encType="multipart/form-data"
              // action="/api/pictures"
              // method="POST"
              onSubmit={(e) => props.handleUpload(e)}
            >
              <input type="file" name="images" multiple="multiple" />
              <input type="submit" />
            </form>
            <input
              autoFocus
              placeholder="Or Input URL Here"
              name="imageUrl"
              className="imageUrl"
              onChange={props.handleChange}
              value={props.state.imageUrl}
            />
            <button
              className="login_buttons"
              onClick={(e) => props.handleSubmit(e)}
            >
              Submit
            </button>
          </div>
        </div>
      </fieldset>

      <div className="imageDiv">
        {props.userPictures
          ? props.userPictures
              .sort((a, b) => a.id - b.id)
              .map((image) => {
                return (
                  <fieldset key={image.id} className="imageField">
                    <button
                      className="delete_button_picture"
                      onClick={() => props.handleDelete(image.id)}
                    >
                      Delete
                    </button>
                    <img
                      src={
                        image.imageUrl.slice(0, 6) === `images`
                          ? `/images/${image.imageUrl}`
                          : image.imageUrl
                      }
                      className="countryImages"
                      onClick={() => props.toggleModal(image.id)}
                    />
                  </fieldset>
                );
              })
          : null}
      </div>
    </div>
  );
}

export default CountryPictures;
