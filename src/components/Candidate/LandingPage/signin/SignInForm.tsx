import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
// import SignIn from '../../../../services/SignIn';
import {
  Navbar,
  Badge,
  Nav,
  NavDropdown,
  Button,
  Modal
} from "react-bootstrap";
import {
  candidateAuth,
  companyDatabase,
  facebookProvider,
  googleProvider,
  candidateDatabase,
  firebaseService
} from "../../../../services/FirebaseCandidateService";

import "../../../../../node_modules/noty/lib/noty.css";
import "../../../../../node_modules/noty/lib/themes/mint.css";
import Noty from "noty";
import GoogleButton from "../../../../assets/images/btn_google_signin.png";
import FacebookButton from "../../../../assets/images/facebooklogin.png";
import '../signup/style.css';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { object } from "../../../../../node_modules/@types/prop-types";
import { Spin } from 'antd';
import 'antd/dist/antd.css';


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

class SignInForm extends Component<IProps & RouteComponentProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      loading:false,
      validationErrors: {
        email: "",
        password: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.authWithFacebook = this.authWithFacebook.bind(this);
    this.authWithGoogle = this.authWithGoogle.bind(this);
  }

  Alert(msg: any, type: any) {
    new Noty({
      type: type,
      layout: "topRight",
      // text: "Unable to login !",
      text: msg,
      timeout: 3000
    }).show();
  }

  authWithFacebook() {
    this.setState({loading: true});

    candidateAuth
      .signInWithPopup(facebookProvider)
      .then((u: any) => {
        companyDatabase
          .collection("CandidateInfo")
          .where("id", "==", u.user.uid)
          .get()
          .then(function(querySnapshot) {
            if (querySnapshot.empty) {
              let userId = u.user.uid;
              var docData = {
                id: userId,
                JobProfile: "",
                name: u.user.displayName,
                place: "",
                video: "",
                videoThumb: "",
                img: u.user.photoURL||
                  "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3",
                currentCompany: "not set",
                interviewCount: [],
                linkedinURL: "",
                shortListedCount: [],
                email: u.user.email,
                contactNumber: "",
                dob: null,
                skypeId: "",
                SocialLikes: [],
                active: false,
                skills: [],
                otherSkills:[],
                spokenLanguages:[],
                portFolioLink:"",
                starsEarned:0,
                expertise: [],
                experience: "0",
                noOfInternship: "0",
                workExperience: [],
                education: [],
                project: [],
                certificate: [],
                personalInterest: {},
                starEarningLog:{},
                referredBy: "",
                referredTo:[],
                profileOfflineNote:"Pending for review"
              };

              var monitorData = {
                email: u.user.email,
                CandidateName: u.user.displayName,
                CandidateId: userId,
                Date: new Date()
              };
              companyDatabase
                .collection("CandidateInfo")
                .doc(userId)
                .set(docData)
                .then(function() {
                  companyDatabase
                    .collection("ActivityMonitor")
                    .doc("CandidateRegistration")
                    .update({
                      Candidate: firebaseService.firestore.FieldValue.arrayUnion(
                        monitorData
                      )
                    });
                });
            }
          })
          //For routing fix
          .then(()=>{
            sessionStorage.setItem("candidateID", u.user.uid);
            sessionStorage.setItem("candidateEmail", u.user.email);
          })
          .then(()=>{
            this.setState({loading: false});
            this.props.history.push('/HomePage');
          })
          .catch((error: any) => {
            this.setState({loading: false});
            this.Alert(error.message, "error");
          });
          //End routing fix;
      })
      .catch(error => {
        this.setState({loading: false});
        this.Alert(error.message, "error");
      });
  }

  authWithGoogle() {
    this.setState({loading: true});
    candidateAuth
      .signInWithPopup(googleProvider)
      .then((u: any) => {
        companyDatabase
          .collection("CandidateInfo")
          .where("id", "==", u.user.uid)
          .get()
          .then(function(querySnapshot) {
            if (querySnapshot.empty) {
              let userId = u.user.uid;
              var docData = {
                id: userId,
                JobProfile: "",
                name: u.user.displayName,
                place: "",
                video: "",
                videoThumb: "",
                img: u.user.photoURL||
                  "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3",
                currentCompany: "not set",
                interviewCount: [],
                linkedinURL: "",
                shortListedCount: [],
                email: u.user.email,
                contactNumber: "",
                dob: null,
                skypeId: "",
                SocialLikes: [],
                active: false,
                skills: [],
                otherSkills:[],
                spokenLanguages:[],
                portFolioLink:"",
                starsEarned:0,
                expertise: [],
                experience: "0",
                noOfInternship: "0",
                workExperience: [],
                education: [],
                project: [],
                certificate: [],
                personalInterest: {},
                starEarningLog:{},
                referredBy: "",
                referredTo:[],
                profileOfflineNote:"Pending for review"
              };

              var monitorData = {
                email: u.user.email,
                CandidateName: u.user.displayName,
                CandidateId: userId,
                Date: new Date()
              };
              companyDatabase
                .collection("CandidateInfo")
                .doc(userId)
                .set(docData)
                .then(function() {
                  companyDatabase
                    .collection("ActivityMonitor")
                    .doc("CandidateRegistration")
                    .update({
                      Candidate: firebaseService.firestore.FieldValue.arrayUnion(
                        monitorData
                      )
                    });
                });
            }
          })
          //For routing fix
          .then(()=>{
            sessionStorage.setItem("candidateID", u.user.uid);
            sessionStorage.setItem("candidateEmail", u.user.email);
          })
          .then(()=>{
            this.setState({loading: false});
            this.props.history.push('/HomePage');
          })
          .catch((error: any) => {
            this.setState({loading: false});
            this.Alert(error.message, "error");
          });
          //End routing fix
      })
      .catch(error => {
        this.setState({loading: false});
        this.Alert(error.message, "error");
      });
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
      case "password":
        validationErrors.password = value.length < 5 ? "password required" : "";
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

    if (
      formValid(
        this.state.validationErrors,
        this.state.email,
        this.state.password
      )
    ) {
      this.setState({loading: true});
      candidateAuth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((u: any) => {
          // companyDatabase
          // .collection("CandidateInfo")
          // .where("id", "==", u.user.uid)
          // .get()
          // .then(querySnapshot => {
          //   querySnapshot.forEach(doc => {
          //     this.setState({ candidateDetails: doc.data() });
          //   });
          // })
          // .then(() => {
            sessionStorage.setItem("candidateID", u.user.uid);
            sessionStorage.setItem("candidateEmail", u.user.email);
            // this.setState({
            //   // isSignedIn: !!user
            //   isSignedIn: true,
            //   userID: u.user.uid
            // });
         // });
        }).then(()=>{
          this.setState({loading: false});
          this.props.history.push('/HomePage');

        })
        .catch((error: any) => {
          this.setState({loading: false});
          this.Alert(error.message, "error");
        });
    }
  }

  handleClose = () => {
    this.props.history.push("/");
  };

  render() {
    //For routing fix
    if (sessionStorage.getItem('candidateID')!=null) {
      return <Redirect to="/HomePage" />;
    }
    //end routing fix
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
        <Modal.Title className="modalTitle">Sign in</Modal.Title>
        <Modal.Body>
          {this.state.loading?
          <div className="signingIn">
          <Spin size="large" />
        </div>
        :
          <div className="FormCenter">
            {/* <form onSubmit={this.handleSubmit} noValidate> */}
            <form noValidate>
              <div className="FormTitle">
                {/* <label className="FormField__CheckboxLabel"> */}
                With your social network
                {/* SNSアカウントでログイン */}
                {/* </label> */}
              </div>
              <div className="SocialLogin modalTitle">
                {/* <Button className="loginBtn loginBtn--facebook" onClick={()=>{this.authWithFacebook()}}>
                  Facebook
                </Button> */}
                {/* <Button className="loginBtn loginBtn--google" onClick={()=>{this.authWithGoogle()}}>
                  Google
                </Button>
                <br/> */}
                <img
                  src={FacebookButton}
                  className="SocialloginBtnimg"
                  alt="my image"
                  onClick={() => {
                    this.authWithFacebook();
                  }}
                />

                <img
                  src={GoogleButton}
                  className="SocialloginBtnimg"
                  alt="my image"
                  onClick={() => {
                    this.authWithGoogle();
                  }}
                />

                {/* <img src={GoogleButton} className="imgSocialbtn" onClick={()=>{this.authWithGoogle()}}/> */}
              </div>

              <hr className="FormField__hr" />
              {/* <div className="FormField"> */}

              {/* <label className="FormField__Label" htmlFor="email">E-Mail Address</label> */}
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
              {/* </div> */}
              {/* <div className="FormField"> */}
              {/* <label className="FormField__Label" htmlFor="password">Password</label> */}
              <input
                type="password"
                id="password"
                className={
                  this.state.validationErrors.password.length > 0
                    ? "error"
                    : "FormField__Input"
                }
                placeholder="Enter your password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                formNoValidate
              />
              {this.state.validationErrors.password.length > 0 && (
                <span className="errorMessage">
                  {this.state.validationErrors.password}
                </span>
              )}
              {/* </div> */}
              {/* <div className=""> */}
              {/* <button className="FormField__Button mr-20" >Sign In</button> */}
              <Button className="buttonLogin" onClick={this.handleSubmit}>
                <span>Sign in</span>
              </Button>
              <br />
              <div className="d-flex">
                <Link to="/SignUp" className="FormField__Link p-2">
                  Create an account
                </Link>

                <Link
                  to="/PasswordReset"
                  className="FormField__Link ml-auto p-2"
                >
                  Forgot password ?
                </Link>
              </div>
            </form>
          </div>
        }
        </Modal.Body>
      </Modal>
    );
    // }
  }
}
export default withRouter(SignInForm);
