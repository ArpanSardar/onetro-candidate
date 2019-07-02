import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import {
  candidateAuth,
  companyDatabase,
  facebookProvider,
  googleProvider
} from "../../../../services/FirebaseCandidateService";
import "../../../../../node_modules/noty/lib/noty.css";
import "../../../../../node_modules/noty/lib/themes/mint.css";
import Noty from "noty";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface IProps {}
interface IState {
  [key: string]: any;
}

const emailRegEx = RegExp(
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
);

const formValid = (validationErrors: string, ...rest: string[]) => {
  let valid = true;

  Object.values(validationErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });
  return valid;
};

class passwordResetForm extends Component<
  IProps & RouteComponentProps,
  IState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      error: "",
      resetInfo: false,
      validationErrors: {
        email: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  Alert(msg: any, type: any) {
    new Noty({
      type: type,
      layout: "topRight",
      // text: "Unable to login !",
      text: msg,
      timeout: 4000
    }).show();
  }

  handleChange(e: any) {
    let target = e.target;
    let value = target.value;

    let name = target.name;

    let validationErrors = this.state.validationErrors;
    switch (name) {
      case "email":
        validationErrors.email = emailRegEx.test(value)
          ? ""
          : "Invalid email address";
        break;
      default:
        break;
    }

    this.setState({
      validationErrors,
      [name]: value
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    if (formValid(this.state.validationErrors, this.state.email)) {
      var emailAddress = this.state.email;
      candidateAuth
        .sendPasswordResetEmail(emailAddress)
        .then(() => {
          this.Alert("Hi there! Welcome back.", "success");
          this.setState({ resetInfo: true });
        })
        .catch((error: any) => {
          this.Alert(error.message, "error");
        });
      //  firebaseService.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      //  .then((u:any)=>{

      //       this.Alert('Hi there! Welcome back.','success');

      //   }).catch((error:any)=>{
      //     this.Alert(error.message,'error');
      //   });
    }
  }

  handleClose = () => {
    this.setState({ resetInfo: false });
    this.props.history.push("/");
  };

  render() {
    return (
      <Modal show={true} onHide={this.handleClose}>
        <div className="close">
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={this.handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Title className="modalTitle">Password Reset</Modal.Title>
        <Modal.Body>
          <div className="FormCenter">
            <form noValidate>
              <hr className="FormField__hr" />

              <input
                type="email"
                id="email"
                className={
                  this.state.validationErrors.email.length > 0
                    ? "error"
                    : "FormField__Input"
                }
                placeholder="Enter your email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                formNoValidate
              />
              {this.state.validationErrors.email.length > 0 && (
                <span className="errorMessage">
                  {this.state.validationErrors.email}
                </span>
              )}

              <Button className="buttonLogin" onClick={this.handleSubmit}>
                <span>Reset</span>
              </Button>
              <br />
              {this.state.resetInfo ? (
                <div className="alert alert-info alert-dismissible">
                  <a
                    href="#"
                    className="close"
                    data-dismiss="alert"
                    aria-label="close"
                  >
                    &times;
                  </a>
                  Password reset link has been sent to your registered E-mail.
                </div>
              ) : null}

              <Link to="/SignIn" className="FormField__Link">
                Back to sign in
              </Link>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
export default withRouter(passwordResetForm);
