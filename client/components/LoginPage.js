import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCreatedUser, fetchSingleUser } from "../redux/users";
import CreateAccount from "./CreateAccount";

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: ``,
      password: ``,
      firstName: ``,
      lastName: ``,
      newEmail: ``,
      newPass: ``,
      showModal: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.newEmail,
      password: this.state.newPass,
    };
    try {
      await this.props.userCreate(newUser);
    } catch (error) {
      console.error(error);
    }
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    return (
      <div>
        {this.state.showModal ? (
          <CreateAccount
            toggleModal={this.toggleModal}
            handleCreate={this.handleCreate}
            state={this.state}
            handleChange={this.handleChange}
          />
        ) : (
          <div className="login_view">
            <div className="login_fieldset">
              <h3>Login</h3>
              <br />

              <div className="form__input">
                <input
                  className="login_input"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  autoFocus
                  placeholder="Email"
                />
              </div>
              <div className="form__input">
                <input
                  className="login_input"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  placeholder="Password"
                />
              </div>

              <div className="login_buttons_div">
                <button onClick={this.handleSignin} className="login_buttons">
                  Log In
                </button>

                <button onClick={this.toggleModal} className="login_buttons">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
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
