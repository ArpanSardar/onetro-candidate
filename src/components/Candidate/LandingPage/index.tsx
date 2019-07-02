import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import Header from "./header/Header";
import { Navbar, Nav, Button } from "react-bootstrap";
import logo from "../../../assets/images/logo.png";
// import "./headerStyle.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import $ from "jquery";
import Footer from '../HomePage/footer/Footer';

interface IProps {}

interface IDispProps {}

interface IState {
  className: string;
  loading: boolean;
}

class Main extends React.Component<IProps & RouteComponentProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      className: "",
      loading: true
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = (event: any) => {
    // console.log(event);
    let scrollTop = event.srcElement.documentElement.scrollTop;
    let itemTranslate = Math.min(0, scrollTop / 3 - 130);
    if (itemTranslate == 0) {
      this.setState({ className: "header sticky" });
    } else {
      this.setState({ className: "" });
    }
  };

  onSignUpClicked = () => {
    this.props.history.push("/SignUp");
  };

  onSignInClicked = () => {
    this.props.history.push("/SignIn");
  };

  render() {
    if (sessionStorage.getItem('candidateID')!=null) {
      return <Redirect to="/HomePage" />;
    }
    return (
      <React.Fragment>
        {/* {this.renderFloatingHeader(this.state.className)} */}
        <Header />
        {/* <Footer/> */}
      </React.Fragment>
      // <div>In Candidate Landing</div>
    );
  }

  renderFloatingHeader = (className: any) => {
    if (className == "") {
      return null;
    } else {
      return (
        <div className={className} id="myHeader">
          <Navbar>
            <Navbar.Brand onClick={this.scrollToTop}>
              <div className=" col topBar scrollToTopButton">
                <div className="row left headerLogo">
                  <img src={logo} alt="Logo" width="300%" height="100%" />
                </div>
                <div className="row">
                  <div className="forStyle">for candidates</div>
                </div>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button
                variant="link"
                className="headerText"
                onClick={this.onSignInClicked}
              >
                Login
              </Button>
              <Button
                variant="link"
                className="headerText"
                onClick={this.onSignUpClicked}
              >
                Signup
              </Button>
              <Nav>
                <Button variant="link" className="bak1Head">
                  For Companies >
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      );
    }
  };

  scrollToTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  };
}

export default withRouter(Main);
