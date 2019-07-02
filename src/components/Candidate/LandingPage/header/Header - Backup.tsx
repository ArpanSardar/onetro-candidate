import React from "react";

import { Navbar, Badge, Nav, NavDropdown, Button } from "react-bootstrap";
// import Button from '@material-ui/core/Button';
import {
  NavLink,
  Link,
  Redirect,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import { connect } from "react-redux";

import "./style.css";
import logo from "../../../../assets/images/logo.png";
import Footer from '../../HomePage/footer/Footer';

interface IProps { }

class Top extends React.Component<IProps & RouteComponentProps> {
  onSignUpClicked = () => {
    this.props.history.push("/SignUp");
  };

  onSignInClicked = () => {
    this.props.history.push("/SignIn");
  };

  render() {
    return (
      <div className="">
        <video loop autoPlay muted id="myVideo">
          <source
            src="https://s3-ap-northeast-1.amazonaws.com/onetrovideo/work_in_japan.mp4"
            type="video/mp4"
          />
        </video>
        <div className="">
          <Navbar collapseOnSelect expand="sm">
            <Navbar.Brand href="#home">
              <div className="col topBar">
                <div className="row left topLogo">
                  <img src={logo} alt="Logo" width="250%" height="100%" />
                </div>
                <div className="row">
                  <h3 className="forStyle">for candidates</h3>
                </div>
              </div>
            </Navbar.Brand>
            {/* <Navbar.Toggle /> */}
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            {/* <Navbar.Collapse> */}
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Nav>
              <Nav.Link href="#pricing">
                <Button href="https://company.onetro.jp" id="bak1Head">
                  For Companies>
                </Button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <div className="headerCandidatePage">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h3 className="pgTitle bak1Head">Interested In Getting A Job In Japan?</h3>
                <h3 className="pgTitle bak1Head">Pre-Register On ONETRO Now!</h3>
                <h3 className="col pgDescription">
                  By completing your profile, you will get 3 stars!
              </h3>
              </div>
            
          {/* <div className="row container20p center">
            <h3 className="col pgDescription">
            By completing your profile, you will get 3 stars!
            </h3>
          </div> */}
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              How will these stars benefit you?
            </h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              You can exchange these stars for money once you start working here!
            </h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              <strong>* 1 star = JPY3000 ($27 approx) *</strong>
            </h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              Great News! as per campaign you will earn more money!!
            </h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              *For those Onetro users who will register <strong>till the end of May</strong>
            </h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              <strong>** 1 star = JPY5000 ($45 approx) **</strong>
            </h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="col pgDescription">
              That’s not it, keep collecting stars by doing the following
            </h3>

          </div>
          <div className="col-lg-12 text-center">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering">
              <span className="star">★</span>
              <h3 className="col pgDescription">1 star - for every 5 likes on your profile from companies</h3>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering">
              <span className="star">★</span>
              <h3 className="col pgDescription">1 star - for the first interview with one company</h3>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering">
              <span className="star">★★★</span>
              <h3 className="col pgDescription">3 stars - once you make a referral to your IT friend and their profile is successfully launched</h3>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering">
              <span className="star">★★★★★★★★★★</span>
              <h3 className="col pgDescription">10 stars - once you sign the offer letter</h3>
              </div>

            </div>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="signupToday bak1Head">Sign Up Today and Create Your Profile</h3>
          </div>
          <div className="col-lg-12 text-center">
            <h3 className="underConstruction">
            *Website Under Construction! We are working on an awesome design*
            </h3>

          </div>
        </div>
        </div>
          </div>
        {/* <div className="headerCandidatePage">
          <div className="row container10p">
            <div className="col s12 m6 center">
              <h3 className="pgTitle bak1Head">Website Under Construction! We are working on a awesome design.</h3>
            </div>
          </div>
          <div className="row container20p center">
            <h3 className="col pgDescription">
              Currently we are con
            </h3>

          </div>
        </div> */}
        <div className="btnAreaonPage">
          <a
            className="waves-effect waves-light btn signinButtononPage"
            onClick={this.onSignInClicked}
          >
            {/* <h3 className="buttonColorDark">ログイン</h3> */}Log In
            </a>
          <a
            className="waves-effect waves-light btn signupButtononPage"
            onClick={this.onSignUpClicked}
          >
            {/* 今すぐ使ってみる */}
            Sign Up
            </a>
            
        </div>
        <div className="btnAreaonPage"><Footer/></div>

      </div>
    );
  }
}

export default withRouter(Top);
