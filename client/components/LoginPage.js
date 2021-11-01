import React, { Component } from "react";
import { fetchSingleUser } from "../redux/users";

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: ``,
      password: ``,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(`handle change`, this.state);
  }

  async handleSignin() {
    try {
    } catch (error) {
      console.error(error);
    }
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

const mapStateToProps = (state) => {
  return {
    singleUser: state.users.singleUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (user) => dispatch(fetchSingleUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
