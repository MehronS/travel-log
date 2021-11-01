import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCreatedUser, fetchSingleUser } from "../redux/users";

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: "mehrons@gmail.com",
      password: "1111",
      firstName: ``,
      lastName: ``,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.singleUser !== this.props.singleUser &&
      this.props.singleUser !== "Not Allowed"
    ) {
      this.props.history.push(`/dashboard/${this.props.singleUser.id}`);
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSignin() {
    try {
      await this.props.userLogin({ ...this.state });
    } catch (error) {
      console.error(error);
    }
  }

  async handleCreate() {
    try {
      await this.props.userCreate({ ...this.state });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // console.log(`from login render`, this.props);
    return (
      <div>
        <fieldset>
          <legend>Login</legend>
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
            <button onClick={this.handleSignin}>Sign In</button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Create Account</legend>
          <label>First Name</label>
          <br />
          <input
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleChange}
          />
          <br />
          <label>Last Name</label>
          <br />
          <input
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleChange}
          />
          <br />
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
            <button onClick={this.handleCreate}>Create Account</button>
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
    userCreate: (user) => dispatch(fetchCreatedUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
