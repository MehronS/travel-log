import React from "react";

function CreateAccount(props) {
  return (
    <div
      className="modalDiv"
      onClick={(e) => {
        if (e.target.className === `modalDiv`) {
          props.toggleModal();
        }
      }}
    >
      <div className="create_modal_wrapper">
        <h3>Create Account</h3>

        <input
          placeholder="First Name"
          className="create_inputs"
          name="firstName"
          value={props.state.firstName}
          onChange={props.handleChange}
        />

        <input
          placeholder="Last Name"
          className="create_inputs"
          name="lastName"
          value={props.state.lastName}
          onChange={props.handleChange}
        />

        <input
          placeholder="Email"
          className="create_inputs"
          name="newEmail"
          value={props.state.newEmail}
          onChange={props.handleChange}
        />

        <input
          placeholder="Password"
          className="create_inputs"
          name="newPass"
          value={props.state.newPass}
          onChange={props.handleChange}
        />
        <div>
          {" "}
          <button onClick={props.handleCreate} className="create_button">
            Create Account
          </button>
        </div>
        <button className="modal_create_button" onClick={props.toggleModal}>
          X
        </button>
      </div>
    </div>
  );
}

export default CreateAccount;
