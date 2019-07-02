import React, { Component } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import {
  candidateDatabase,
  candidateAuth,
  companyDatabase
} from "./services/FirebaseCandidateService";
// import {firebaseCompanyService} from './services/FirebaseCompanyService';

import HomePage from "./components/Candidate/HomePage";
import SignUpForm from "./components/Candidate/LandingPage/signup/SignUpForm";
import SignInForm from "./components/Candidate/LandingPage/signin/SignInForm";
import LandingPage from "./components/Candidate/LandingPage";
import PasswordResetForm from "./components/Candidate/LandingPage/passwordreset/passwordResetForm";

interface IProps {}

interface IDispProps {}

interface IState {
  userID: any;
  isSignedIn: boolean;
  candidateDetails: any;
}

class App extends React.Component<IProps & IDispProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userID: "",
      isSignedIn: false,
      candidateDetails: {}
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    candidateAuth.onAuthStateChanged((user: any) => {
      if (user) {
        companyDatabase
          .collection("CandidateInfo")
          .where("id", "==", user.uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.setState({ candidateDetails: doc.data() });
            });
          })
          .then(() => {
            sessionStorage.setItem("candidateID", user.uid);
            sessionStorage.setItem("candidateEmail", user.email);
            this.setState({
              // isSignedIn: !!user
              isSignedIn: true,
              userID: user.uid
            });
          });
      } else {
        sessionStorage.removeItem("candidateID");
        this.setState({
          isSignedIn: false,
          userID: "",
          candidateDetails: {}
        });
      }
    });
  }

  render() {
    // if (this.state.isSignedIn === true) {
    //   return (
    //     <div>
    //       <Redirect to="/HomePage" />
    //       <Route
    //         exact
    //         path="/HomePage"
    //         component={HomePage}
    //         //  render={(props:any) => <HomePage {...props} user={this.state.userID} candidateDetails={this.state.candidateDetails}/>}
    //       />
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div className="App">
    //       <Redirect to="/LandingPage" />
    //       <Route exact path="/LandingPage" component={LandingPage} />
    //       <Route exact path="/SignUp" component={SignUpForm} />
    //       <Route exact path="/SignIn" component={SignInForm} />
    //       <Route exact path="/PasswordReset" component={PasswordResetForm} />
    //       <Route exact path="/HomePage" component={HomePage} />
    //     </div>
    //   );
    // }
    return(
    <div>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/SignUp" component={SignUpForm} />
        <Route exact path="/SignIn" component={SignInForm} />
        <Route exact path="/PasswordReset" component={PasswordResetForm} />
        <Route exact path="/HomePage" component={HomePage} />
      </Switch>
  </div>
    )
  }
}

export default App;
