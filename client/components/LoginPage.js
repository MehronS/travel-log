import React, { Component } from "react";

export default class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: ``,
      password: ``,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(`handle change`, this.state);
  }

  render() {
    return (
      <div>
        Login Damnit
        <br />
        <fieldset>
          <label>Email</label>
          <br />
          <input
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <br />
          <label>Password</label>
          <br />
          <input
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <div className="login_buttons_div">
            <br />
            <button onClick={() => this.handleSignin}>Sign In</button>
            <button onClick={() => this.handleCreate}>Create Account</button>
          </div>
        </fieldset>
      </div>
    );
  }
}
