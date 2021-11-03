import React from "react";

function ModalPictures(props) {
  console.log(props);
  return (
    <div className="modalDiv" onClick={props.toggleModal}>
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
