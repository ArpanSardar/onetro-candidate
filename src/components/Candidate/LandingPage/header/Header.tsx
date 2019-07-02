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
import Headroom from 'react-headroom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Icon,
} from 'antd';
import 'antd/dist/antd.css';
import logo from "../../../../assets/images/logo.png";
import Group49 from "../../../../assets/images/Group49@2x.png";
import Group50 from "../../../../assets/images/Group50@2x.png";
import Group51 from "../../../../assets/images/Group51@2x.png";
import Group52 from "../../../../assets/images/Group52@2x.png";
import Group53 from "../../../../assets/images/Group53@2x.png";
import Group54 from "../../../../assets/images/Group54@2x.png";
import video from "../../../../assets/images/video@4x.png";
import interview from "../../../../assets/images/interview@3x.png";
import hire from "../../../../assets/images/hire@4x.png";
import footer from "../../../../assets/images/footer.png";
import coma from "../../../../assets/images/coma.png";
import Gopal from "../../../../assets/images/Gopal.jpg";
import Ankur from "../../../../assets/images/Ankur.jpg";
import Lav from "../../../../assets/images/Lav.jpg";
import ExpandableView from './expansionPannel';



import "./style.css";
import Footer from '../../HomePage/footer/Footer';

interface IProps { }

interface IState {
    isDisplayNavbar: string;
}

class Top extends React.Component<IProps & RouteComponentProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isDisplayNavbar: 'none'
        }
    }
    onSignUpClicked = () => {
        this.props.history.push("/SignUp");
    };

    onSignInClicked = () => {
        this.props.history.push("/SignIn");
    };

    render() {
        return (
            <React.Fragment>
                <Headroom
                    style={{ display: this.state.isDisplayNavbar, zIndex: 4 }}
                    onPin={() => this.setState({ isDisplayNavbar: 'block' })}
                >
                    <Navbar collapseOnSelect expand="sm" className="navHeader">
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
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="#home" />
                            </Nav>
                            <Nav>
                                <Nav.Link href="" onClick={this.onSignInClicked}>
                                    <b className="navText">LogIn</b>
                                </Nav.Link>
                                <Nav.Link href="" onClick={this.onSignUpClicked}>
                                    <b className="navText">SignUp</b>
                                </Nav.Link>
                                <Nav.Link href="https://company.onetro.jp">
                                    <b className="navText">For Companies></b>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Headroom>
                <section className="section_banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="col-md-6 col-sm-6 col-xs-12 bannerLeftContents">
                                    <h1 className="titleClass1">
                                        Find your most suited job in Japan
                </h1>
                                    <p className="description">
                                        You read that right! Just upload your CV and introduction video to get started on getting recognized by companies and exploring them to give an interview to get selected!
                </p>
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-md-6 col-sm-6 col-xs-12 iq-mt-30 resCenter">
                                    <button className="btn btn-primary-custom" onClick={this.onSignInClicked}>
                                        Log in
                </button>
                                    <button className="btn btn-primary-custom" onClick={this.onSignUpClicked}>
                                        Sign up
                </button>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section_whatWeDo col-lg-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-xs-12 col-sm-12 text-left">
                                <h1 className="titleClass2 shortUnderline">
                                    WHY US ?
                                </h1>
                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-12 col-xs-12 col-sm-12">
                                <div className="ourworks row">
                                    <div className="col-md-4 col-sm-6 col-xs-12 smallBlock">
                                        <img src={Group52} className="rotateImage" />
                                        <h3 className="green">Your 1 min video <br />introduction</h3>
                                        <p> Introduce yourself to companies through a one minute video before getting recruited to attract and increase chances of getting a job.</p>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-xs-12 smallBlock">
                                        <img src={Group53} className="rotateImage" />
                                        <h3 className="orange">Collect stars & exchange<br />
                                            them for money</h3>
                                        {/* <p> Lorem Ipsum is simply dummy text of the<br/>
                             printing and typesetting industry.<br/> Lorem Ipsum has been the industry's</p> */}
                                        <p>Receive stars and exchange them for money! Refer Ontro to your IT friends and acquaintances and get stars once they register.</p>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-xs-12 smallBlock">
                                        <img src={Group54} className="rotateImage" />
                                        <h3 className="red">Get likes on your<br /> profile</h3>
                                        <p> Get likes on your profiles to know<br />
                                            which companies may be<br />interested in you.</p>
                                    </div>
                                    <div className="col-md-4 col-xs-12 col-sm-6 smallBlock">
                                        <img src={Group51} className="rotateImage" />
                                        <h3 className="blue">Show interest in<br /> companies that you like</h3>
                                        <p> Show interest in companies to <br /> increase your chances of getting<br /> noticed and getting interviews. <br /> once you’re in Japan</p>
                                    </div>
                                    <div className="col-md-4 col-xs-12 col-sm-6 smallBlock">
                                        <img src={Group50} className="rotateImage" />
                                        <h3 className="lightGreen">Life support once you're<br /> in japan</h3>
                                        <p> Moving too a new country can be<br /> stressful and we know that which is<br /> why we provide A-Z life support</p>
                                    </div>
                                    <div className="col-md-4 col-xs-12 col-sm-6 smallBlock">
                                        <img src={Group49} className="rotateImage" />
                                        <h3 className="lightBlue">Interview preparation;<br /> quick tips and tricks</h3>
                                        <p> We will help you prepare for the<br /> interview with the companies.</p>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        
                    </div>
                </section>
                <div className=" opportunity">
                                <b>50+</b> companies, <b>Endless</b> Job Opportunities.
                            </div>
                <section className="section_howItWorks col-lg-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-xs-12 col-sm-12 text-left">
                                <h1 className="titleClass2 underline">
                                    HOW CAN YOU GET A JOB IN JAPAN ?
                    </h1>
                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="block wow fadeInLeft">
                                    <img src={video} />
                                    <h2>Upload and Explore</h2>
                                    <p>Upload your one minute introductory video and your profile and start exploring job postings that best suit your needs.</p>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="block wow fadeInUp">
                                    <img src={interview} />
                                    <h2>Interview</h2>
                                    <p>Interview with the top companies in Japan to get hired.</p>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="block wow fadeInRight">
                                    <img src={hire} />
                                    <h2>Get Hire</h2>
                                    <p>Once you’re hired, get ready to come to Japan for your dream job!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section_faq iq-pt-100 iq-pb-50 col-lg-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-xs-12 col-sm-12 text-left">
                                <h1 className="titleClass2 underline">
                                    FREQUENTLY ASKED QUESTIONS.
                    </h1>
                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-12 col-xs-12 col-sm-12 text-left">

                                <ExpandableView />
                            </div>

                        </div>
                    </div>
                </section>
                <section className="section_benifit iq-pt-100 iq-pb-50 col-lg-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-xs-12 col-sm-12 text-left">
                                <h1 className="titleClass2 underline">
                                    HOW WILL THESE STARS BENIFIT YOU ?
                    </h1>
                            </div>
                            <div className="clearfix"></div>

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
                                    And the Great News! is
            </h3>
                            </div>
                            <div className="col-lg-12 text-center">
                                <h3 className="col pgDescription">
                                    *For those Onetro users who will register <strong>till the end of May</strong> can earn more money.
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
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering-container">
                                        <div className="starOffering">

                                            <span className="star">★</span>
                                            <h3 className="col pgDescription">1 star - for every 5 likes on your profile from companies</h3>
                                        </div>

                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering-container">
                                        <div className="starOffering">

                                            <span className="star">★</span>
                                            <h3 className="col pgDescription">1 star - for the first interview with one company</h3>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering-container">
                                        <div className="starOffering">

                                            <span className="star">★★★</span>
                                            <h3 className="col pgDescription">3 stars - once you make a referral to your IT friend and their profile is successfully launched</h3>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 starOffering-container">
                                        <div className="starOffering">
                                            <span className="star">★★★★★★★★★★</span>
                                            <h3 className="col pgDescription">10 stars - once you sign the offer letter</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section_pricing col-lg-12 col-md-12 col-sm-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-xs-12 col-sm-12 text-left">
                                <h1 className="titleClass2 underline">
                                    OUR CANDIDATE SUCCESS STORIES
                    </h1>
                            </div>
                            <div className="clearfix"></div>
                            <div className="col-md-4 col-sm-4 col-xs-12 text-center">
                                <div className="pricingBlock wow fadeInLeft">
                                    <h2 className="pricePlan gradient1">
                                        <img src={Ankur} />
                                    </h2>
                                    <div className="clearfix"></div>
                                    <h3 className="candidateName">Ankur Sardar</h3>
                                    <h3 className="candidateDesignation">Software Engineer</h3>
                                    <img src={coma} className="comaImage" />
                                    <p className="candidateComment">
                                        It was a very easy process actually. I always dreamt of coming abroad for a job but I did not know where and how to start. Onetro really helped me a lot to get me to the right direction. Thanks.
                                    </p>
                                    <a href='https://www.facebook.com/ankur.sardar18' target="_blank" style={{ fontSize: 22 }}><Icon type="facebook" style={{ color: '#3b5998', borderRadius: '50%' }} /></a>

                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            
                            <div className="col-md-4 col-sm-4 col-xs-12 text-center">
                                <div className="pricingBlock wow fadeInLeft">
                                    <h2 className="pricePlan gradient1">
                                        <img src={Gopal} />
                                    </h2>
                                    <div className="clearfix"></div>
                                    <h3 className="candidateName">Gopal Krishan Agarwal</h3>
                                    <h3 className="candidateDesignation">Software Engineer</h3>
                                    <img src={coma} className="comaImage" />
                                    <p className="candidateComment">
                                        I had not experienced anythinglike this before. It was super easy to apply. I cracked the interviews and  landed in Japan. That was a dream come true for me! I had nothing to  worry about. Thanks Onetro! Always grateful.
                        </p>
                                    <a href='https://www.facebook.com/gopalkriagg' target="_blank" style={{ fontSize: 22 }}><Icon type="facebook" style={{ color: '#3b5998', borderRadius: '50%' }} /></a>

                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12 text-center">
                                <div className="pricingBlock wow fadeInLeft">
                                    <h2 className="pricePlan gradient1">
                                        <img src={Lav} />
                                    </h2>
                                    <div className="clearfix"></div>
                                    <h3 className="candidateName">Lav Shinde</h3>
                                    <h3 className="candidateDesignation">Software Engineer</h3>
                                    <img src={coma} className="comaImage" />
                                    <p className="candidateComment">
                                        The entire process was so smooth. I had to do absolutely nothing apart from prepare for the interviews. Onetro helped me at each step of what I consider the biggest stepping stone for my career.
                        </p>
                                    <a href='https://www.facebook.com/lav1708' target="_blank" style={{ fontSize: 22 }}><Icon type="facebook" style={{ color: '#3b5998', borderRadius: '50%' }} /></a>

                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </section>
                <footer>
                    <ul className="quick_links">
                        <li className="" data-wow-delay="0.2s"><a href="http://willings.co.jp/en/">Willings, Inc.</a></li>
                        <li className="" data-wow-delay="0.6s"><a href="https://willings.co.jp/en/contact">Contact Us</a></li>
                        <li className="" data-wow-delay="0.8s"><a href="javascript:void(0)">FAQ</a></li>
                        <li className="" data-wow-delay="1s"><a href="javascript:void(0)">Privacy Policy</a></li>
                    </ul>
                    <div className="clearfix"></div>
                    <div className="socialIcons">
                        {/* <img src={ooter}/> */}
                    </div>
                    <div className="clearfix"></div>
                    <p className="copyRight">© 2019 Willings, Inc. All rights reserved.</p>
                </footer>


            </React.Fragment>
        );
    }
}

export default withRouter(Top);
