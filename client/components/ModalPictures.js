import React from "react";

function ModalPictures(props) {
  return (
    <div
      className="modalDiv"
      onClick={(e) => {
        if (e.target.className === `modalDiv`) {
          // ignore clicking on the actual picture or the comment section
          props.toggleModal(); // get back to the single country view with picture list
        }
      }}
    >
      <div className="modalWrapper">
        <img src={props.image.imageUrl} className="modalImage" />
        <div className="modalContent">
          <p className="modalPara">{props.image.description}</p>
        </div>
        <button className="modalButton" onClick={props.toggleModal}>
          X
        </button>
      </div>
    </div>
  );
}

export default ModalPictures;
