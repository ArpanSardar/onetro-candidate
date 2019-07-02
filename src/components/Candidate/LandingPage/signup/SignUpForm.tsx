import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import "./style.css";

import {
  Navbar,
  Badge,
  Nav,
  NavDropdown,
  Button,
  Modal
} from "react-bootstrap";

import { RouteComponentProps, withRouter } from "react-router-dom";

// import {firebaseCompanyService} from '../../../../services/FirebaseCompanyService';
import {
  firebaseService,
  candidateAuth,
  facebookProvider,
  googleProvider,
  companyDatabase,
  companyFirebase,
  candidateDatabase
} from "../../../../services/FirebaseCandidateService";

import "../../../../../node_modules/noty/lib/noty.css";
import "../../../../../node_modules/noty/lib/themes/mint.css";
import Noty from "noty";
import GoogleButton from "../../../../assets/images/btn_google_signin.png";
import FacebookButton from "../../../../assets/images/facebooklogin.png";
import { Spin } from 'antd';
import 'antd/dist/antd.css';
// import Modal from '@material-ui/core/Modal';

interface IProps {}

interface IDispProps {}

interface IState {
  [key: string]: any;
}

const styles: any = {
  paper: {
    sition: "absolute",
    outline: "none"
  }
};

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

class SignUpForm extends Component<IProps & RouteComponentProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      candidateName: "",
      email: "",
      referEmail:"",
      password: "",
      confirmpassword: "",
      error: "",
      loading:false,
      validationErrors: {
        candidateName: "",
        email: "",
        referEmail:"",
        password: "",
        confirmpassword: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.authWithFacebook = this.authWithFacebook.bind(this);
    this.authWithGoogle = this.authWithGoogle.bind(this);
  }

  handleChange(e: any) {
    let target = e.target;
    // let value = target.type === 'checkbox' ? target.checked : target.value;
    let value = target.value;

    let name = target.name;

    let validationErrors = this.state.validationErrors;
    switch (name) {
      case "userName":
        validationErrors.candidateName =
          value.length < 4
            ? "Name is Rquired and must be at least 4 characters"
            : "";
        break;
      case "email":
      
        validationErrors.email = emailRegEx.test(value)
          ? ""
          : "Invalid email address";
          
        break;
      case "referEmail":
      if(value.length>0)
      // alert(value);
        validationErrors.referEmail = emailRegEx.test(value)
          ? ""
          : "Invalid referral email address";
          else validationErrors.referEmail ="";
        break;
      case "password":
        validationErrors.password = value.length < 5 ? "password required" : "";
        break;
      case "confirmpassword":
        validationErrors.confirmpassword =
          value === this.state.password
            ? ""
            : "Confirm password should match with password";
        break;
      default:
        break;
    }

    this.setState({
      validationErrors,
      [name]: value
    });
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

  authWithFacebook() {
    const referEmail=this.state.referEmail;
    this.setState({loading: true});
    if(referEmail.length>0){
    candidateAuth
      .signInWithPopup(facebookProvider)
      .then((u: any) => {
        // console.log(u.user);
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
                currentCompany: "",
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
                referredBy:referEmail,
                referredTo:[],
                profileOfflineNote:"Pending for review"
              };

              var monitorData = {
                email: u.user.email,
                CandidateName: u.user.displayName,
                CandidateId: userId,
                Date: new Date(),
                referredBy:referEmail

              };
              companyDatabase
                .collection("CandidateInfo")
                .doc(userId)
                .set(docData)
                .then(function() {
                  companyDatabase
                    .collection("CandidateInfo")
                    .where("email","==",docData.referredBy)
                    .get()
                    .then(function(querySnapshot) {
                      if (!querySnapshot.empty) {
                      querySnapshot.forEach(function(doc) {
    
                        companyDatabase
                        .collection("CandidateInfo")
                        .doc(doc.data().id)
                        .update({
                          referredTo: firebaseService.firestore.FieldValue.arrayUnion({id:userId,email:u.user.email})
                        });
    
                        // companyDatabase
                        // .collection("CandidateInfo")
                        // .doc(userId)
                        // .update({
                        //   referredBy: {id:doc.data().id,email:doc.data().email}
                        // });
    
                      });
                    }
                    }) .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
                })
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
    else{
      candidateAuth
      .signInWithPopup(facebookProvider)
      .then((u: any) => {
        console.log(u.user);
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
                currentCompany: "",
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
                referredBy:referEmail,
                referredTo:[],
                profileOfflineNote:"Pending for review"
              };

              var monitorData = {
                email: u.user.email,
                CandidateName: u.user.displayName,
                CandidateId: userId,
                Date: new Date(),
                referredBy:referEmail

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
  }

  authWithGoogle() {
    const referEmail=this.state.referEmail;
    this.setState({loading: true});
    if(referEmail.length>0){
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
                currentCompany: "",
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
                referredBy:referEmail,
                referredTo:[],
                profileOfflineNote:"Pending for review"
              };

              var monitorData = {
                email: u.user.email,
                CandidateName: u.user.displayName,
                CandidateId: userId,
                Date: new Date(),
                referredBy:referEmail

              };
              companyDatabase
                .collection("CandidateInfo")
                .doc(userId)
                .set(docData)
                .then(function() {
                  companyDatabase
                    .collection("CandidateInfo")
                    .where("email","==",docData.referredBy)
                    .get()
                    .then(function(querySnapshot) {
                      if (!querySnapshot.empty) {

                      querySnapshot.forEach(function(doc) {
    
                        companyDatabase
                        .collection("CandidateInfo")
                        .doc(doc.data().id)
                        .update({
                          referredTo: firebaseService.firestore.FieldValue.arrayUnion({id:userId,email:u.user.email})
                        }) .catch(function(error) {
                          console.log("Error getting documents: ", error);
                      });
    
                        // companyDatabase
                        // .collection("CandidateInfo")
                        // .doc(userId)
                        // .update({
                        //   referredBy: {id:doc.data().id,email:doc.data().email}
                        // });
    
                      });
                    }
                    });
                })
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
      else{
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
                  currentCompany: "",
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
                  referredBy:referEmail,
                  referredTo:[],
                  profileOfflineNote:"Pending for review"
                };
  
                var monitorData = {
                  email: u.user.email,
                  CandidateName: u.user.displayName,
                  CandidateId: userId,
                  Date: new Date(),
                  referredBy:referEmail
  
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
  }

  handleSubmit(e: any) {
    e.preventDefault();
    if (
      formValid(
        this.state.validationErrors,
        this.state.candidateName,
        this.state.email,
        this.state.password,
        this.state.confirmpassword
      )
    ) {
      this.setState({loading: true});
      if(this.state.referEmail.length>0){
      candidateAuth
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((u: any) => {
          // this.Alert('Regsitration successful','success');
          let userId = u.user.uid;

          var docData = {
            id: userId,
            JobProfile: "",
            name: this.state.candidateName,
            place: "",
            video: "",
            videoThumb: "",
            img:
              "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3",
            currentCompany: "",
            interviewCount: [],
            linkedinURL: "",
            shortListedCount: [],
            email: this.state.email,
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
            referredBy:this.state.referEmail,
            referredTo:[],
            profileOfflineNote:"Pending for review"
          };

          var monitorData = {
            email: this.state.email,
            CandidateName: this.state.candidateName,
            CandidateId: userId,
            Date: new Date(),
            referredBy:this.state.referEmail,
          };
          companyDatabase
            .collection("CandidateInfo")
            .doc(userId)
            .set(docData)
            .then(function() {
              companyDatabase
                .collection("CandidateInfo")
                .where("email","==",docData.referredBy)
                .get()
                .then(function(querySnapshot) {
                  if (!querySnapshot.empty) {
                  querySnapshot.forEach(function(doc) {

                    companyDatabase
                    .collection("CandidateInfo")
                    .doc(doc.data().id)
                    .update({
                      referredTo: firebaseService.firestore.FieldValue.arrayUnion({id:userId,email:u.user.email})
                    });

                    // companyDatabase
                    // .collection("CandidateInfo")
                    // .doc(userId)
                    // .update({
                    //   referredBy: {id:doc.data().id,email:doc.data().email}
                    // });

                  });
                }
                }) .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });
            })
            .then(function() {
              companyDatabase
                .collection("ActivityMonitor")
                .doc("CandidateRegistration")
                .update({
                  Candidate: firebaseService.firestore.FieldValue.arrayUnion(
                    monitorData
                  )
                })
                .catch(error => {
                });
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
      else{
        candidateAuth
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((u: any) => {
          // this.Alert('Regsitration successful','success');
          let userId = u.user.uid;

          var docData = {
            id: userId,
            JobProfile: "",
            name: this.state.candidateName,
            place: "",
            video: "",
            videoThumb: "",
            img:
              "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3",
            currentCompany: "",
            interviewCount: [],
            linkedinURL: "",
            shortListedCount: [],
            email: this.state.email,
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
            referredBy:this.state.referEmail,
            referredTo:[],
            profileOfflineNote:"Pending for review"
          };

          var monitorData = {
            email: this.state.email,
            CandidateName: this.state.candidateName,
            CandidateId: userId,
            Date: new Date(),
            referredBy:this.state.referEmail,
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
                })
                .catch(error => {
                });
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
        .catch((error: any) => {
          this.setState({loading: false});
          this.Alert(error.message, "error");
        });
      }
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

        <Modal.Title className="modalTitle">Sign up</Modal.Title>
        <Modal.Body>
        {this.state.loading?
          <div className="signingIn">
          <Spin size="large" />
        </div>
        :
          <div className="FormCenter align-self-center">
            <form onSubmit={this.handleSubmit} className="FormFields">
              <div className="FormTitle">
                <label className="FormField__CheckboxLabel">
                  Registering to this website, you accept our
              <a className="FormField__TermsLink">Terms of Use</a> and our
              <a className="FormField__TermsLink">Privacy Policy</a>
                  {/* <Link to="/TermsAndConditions">利用規約</Link>と<Link to="/PrivacyPolicy">プライバシーポリシー</Link>をご確認の上、本サービスにご登録ください。 */}
                </label>
              </div>
              <div className="FormTitle">
                {/* <label className="FormField__CheckboxLabel"> */}
                with your social network
                {/* </label> */}
              </div>
              <div className="SocialLogin modalTitle">
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
              </div>

              <hr className="FormField__hr" />

              <div className="FormField">
                <div className="FormField">
                  <input
                    type="candidateName"
                    id="candidateName"
                    className={
                      this.state.validationErrors.candidateName.length > 0
                        ? "error"
                        : "FormField__Input"
                    }
                    placeholder="Enter your name"
                    name="candidateName"
                    value={this.state.employeeName}
                    onChange={this.handleChange}
                    formNoValidate
                  />
                  {this.state.validationErrors.candidateName.length > 0 && (
                    <span className="errorMessage">
                      {this.state.validationErrors.candidateName}
                    </span>
                  )}
                </div>

                <div className="FormField">
                  {/* <label className="FormField__Label" htmlFor="email">Email</label> */}
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
                </div>
                <div className="FormField">
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
                </div>
                <div className="FormField">
                  {/* <label className="FormField__Label" htmlFor="confirmpassword">Confirm Password</label> */}
                  <input
                    type="password"
                    id="confirmpassword"
                    className={
                      this.state.validationErrors.confirmpassword.length > 0
                        ? "error"
                        : "FormField__Input"
                    }
                    placeholder="Confirm password"
                    name="confirmpassword"
                    value={this.state.confirmpassword}
                    onChange={this.handleChange}
                    formNoValidate
                  />
                  {this.state.validationErrors.confirmpassword.length > 0 && (
                    <span className="errorMessage">
                      {this.state.validationErrors.confirmpassword}
                    </span>
                  )}
                </div>
                <div className="FormField">
                  {/* <label className="FormField__Label" htmlFor="email">Email</label> */}
                  <input
                    type="email"
                    id="referEmail"
                    className={
                      this.state.validationErrors.referEmail.length > 0
                        ? "error"
                        : "FormField__Input"
                    }
                    placeholder="Enter your referral email (optional)"
                    name="referEmail"
                    value={this.state.referEmail}
                    onChange={this.handleChange}
                    formNoValidate
                  />
                  {this.state.validationErrors.referEmail.length > 0 && (
                    <span className="errorMessage">
                      {this.state.validationErrors.referEmail}
                    </span>
                  )}
                </div>

                <div className="FormField">
                  <Button className="buttonLogin" onClick={this.handleSubmit}>
                    <span>Sign up</span>
                  </Button>
                  <br />
                  <Link to="/SignIn" className="FormField__Link">
                  Already registered? Log in
                  </Link>
                </div>
              </div>
            </form>
          </div>
        }
        </Modal.Body>
      </Modal>
    );
  }
}
export default withRouter(SignUpForm);
