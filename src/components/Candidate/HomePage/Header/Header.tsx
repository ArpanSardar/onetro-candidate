import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import logo from '../../../../assets/images/logo.png';

import { firebaseService } from '../../../../services/FirebaseCandidateService';

import { Navbar, Badge, Nav, NavDropdown, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'

import { withRouter, RouteComponentProps } from 'react-router-dom';
import $ from "jquery";

import './style.css';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};
interface IProps {
  // companyDetails: any;
}

class Header extends React.Component<IProps & RouteComponentProps>{

  constructor(props: any) {
    super(props);
    this.Logout = this.Logout.bind(this);
  }

  public navigateToDashBoard = () => {
    this.props.history.push('/CompanyDashBoard');
  }
  public Logout = () => {
    // this.props.history.push('/LandingPage');
    // localStorage.removeItem('user');
    // alert("siginig out");
    firebaseService.auth().signOut();
    sessionStorage.removeItem('candidateID');
    sessionStorage.removeItem('candidateEmail');

    this.props.history.push('/');
    // alert("signed out");
  }

  render() {
    return (
        <div className=" header sticky" id="homeHeader">
          <Navbar>
            <Navbar.Brand onClick={this.scrollToTop}>
              <div className="topBar scrollToTopButton">
                <div className="left headerLogo">
                  <img src={logo} alt="Logo" width="250%" height="100%" />
                </div>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse >
              <Nav className="mr-auto">
                <Nav.Link href="/HomePage"></Nav.Link>
              </Nav>
              <Button variant="link" id="logOut" onClick={this.Logout} >Log Out</Button>
              <Nav>
                {/* <Dropdown className="" >
                  <DropdownButton variant="success" id="dropDownMenu" alignRight className="dropDownMenu"
                    title={this.props.companyDetails ? this.props.companyDetails.CompanyName : 'Unknown'}>

                    <Dropdown.Menu className="dropDownMenu">
                    <Dropdown.Item onClick={this.navigateToDashBoard} className="dropDownItem">ダッシュボード</Dropdown.Item>
                    <Dropdown.Divider className="dropSownSeperator" />
                    <Dropdown.Item href="https://willings.co.jp/contact" className="dropDownItem">お問い合わせ</Dropdown.Item>
                    <Dropdown.Divider className="dropSownSeperator" />
                    <Dropdown.Item onClick={this.Logout} className="dropDownItem">ログアウト</Dropdown.Item>
                    </Dropdown.Menu>
                  </DropdownButton>
                </Dropdown> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
    );
  }
  scrollToTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  };
}

export default withRouter(Header);
