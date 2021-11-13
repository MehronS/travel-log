import React, { useState } from "react";

function CreateAccount(props) {
  const [state, setState] = useState({
    email: ``,
    password: ``,
    firstName: ``,
    lastName: ``,
  });

  function handleChange(event) {
    setState((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
    console.log(state);
  }

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
          value={state.firstName}
          onChange={(e) => handleChange(e)}
        />

        <input
          placeholder="Last Name"
          className="create_inputs"
          name="lastName"
          value={state.lastName}
          onChange={(e) => handleChange(e)}
        />

        <input
          placeholder="Email"
          className="create_inputs"
          name="email"
          value={state.email}
          onChange={(e) => handleChange(e)}
        />

        <input
          type="password"
          placeholder="Password"
          className="create_inputs"
          name="password"
          value={state.password}
          onChange={(e) => handleChange(e)}
        />
        <div>
          {" "}
          <button
            onClick={() => props.handleCreate(state)}
            className="create_button"
          >
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
