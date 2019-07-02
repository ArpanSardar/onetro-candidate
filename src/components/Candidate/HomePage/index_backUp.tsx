import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

// import Header from './Header/Header';
// import Footer from '../LandingPage/footer/Footer';
import { ProgressBar, Navbar, Nav } from "react-bootstrap";
import Modal from "react-modal";

import Noty from "noty";
import swal from "sweetalert";
import {
  firebaseService,
  candidateAuth,
  candidateDatabase,
  candidateStorage,
  companyDatabase,
  companyStorage
} from "../../../services/FirebaseCandidateService";
import CareerHistory from "./CareerHistory/CareerHistory";
import AcademicBackground from "./AcademicBackground/AcademicBackground";
import ProjectExperience from "./ProjectExperience/ProjectExperience";
import Certifications from "./Certifications/Certifications";
import Badges from "./Badges/Badges";
import RightSidebarComponent from "./RightSidebarComponent/RightSidebarComponent";
import Expertise from "./Expertise/Expertise";
import Referral from "./Referral/Refferal";
import Footer from "./footer/Footer";
import skypeIcon from "../../../assets/images/skype.png";
import "./style.css";
import Header from "./Header/Header";
import AutoSuggest from "../HomePage/AutoComplete/AutoSuggest";
import preview from "../../../assets/images/introPreview.png"
import {
  countryOptions,
  jobProfileOptions,
  skillOptions,
  languageOptions
} from "../HomePage/AutoComplete/data";
// import DatePicker from "react-datepicker";
import "../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import { defaultTheme } from "react-select/lib/theme";

import {
  AutoComplete, Select,
  Upload, Card,
  DatePicker, Popover,
  Form, Input, Alert, Spin,
  Typography, Row, Col,
  Affix, Layout, Badge, Divider,
  notification, Icon, Progress,
  Steps, Button, message
} from 'antd';
const { Title, Text } = Typography;
const { Content } = Layout;

const ButtonGroup = Button.Group;
import 'antd/dist/antd.css';
import { string } from "prop-types";
import ProfileProgressContainer from "../ProfileFillProgress/ProfileProgressContainer";

const customStyles = {
  content: {
    top: "10%",
    left: "15%",
    right: "15%",
    bottom: "5%"
  }
};
interface IProps {
  user: any;
  candidateDetails: any;
}

interface IDispProps { }

interface IState {
  candidate: any;
  workexperience: any;
  education: any;
  projects: any;
  certificates: any;
  skills: any;
  skillText: string;
  expertise: any;
  loading: boolean;
  introVideoEdit: boolean;
  newIntroVideo: any;
  newIntroVideoURL: any;
  socialInfoEdit: boolean;
  [key: string]: any;
}
const Step = Steps.Step;
const steps = [
  {
    title: 'Social Info',
    content: 'First-content',
  },
  {
    title: 'Education',
    content: 'Second-content',
  },
  {
    title: 'Work Experience',
    content: 'Last-content',
  },
  {
    title: 'Projects',
    content: 'Last-content',
  },
  {
    title: 'Certificates',
    content: 'Last-content',
  },
  {
    title: 'Badges',
    content: 'Last-content',
  },
  {
    title: 'IntroVideo',
    content: 'Last-content',
  },
  {
    title: 'Final Profile',
    content: 'Last-content',
  }
];
class HomePage extends React.Component<IProps & IDispProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      candidate: {},
      workexperience: [],
      education: [],
      projects: [],
      certificates: [],
      skills: [],
      skillText: "",
      otherSkills: [],
      otherSkillText: "",
      spokenLanguages: [],
      spokenLanguageText: "",
      skillsInEditMode: false,
      otherSkillsInEditMode: false,
      spokenLanguageInEditMode: false,
      expertise: [],
      loading: true,
      introVideoEdit: false,
      newIntroVideo: {},
      newIntroVideoURL: "",
      socialInfoEdit: false,
      newProfilePic: {},
      newProfilePicURL: "",
      progress: 0,
      instructionVideo: "",
      showInstructionVideo: false,
      dob: {},
      current: 0
    };
  }


  AlertMessage(msg: any, type: any) {
    swal("Done", msg, type);
  }
  renderInstructionVideo = () => {
    this.setState({
      instructionVideo: "https://firebasestorage.googleapis.com/v0/b/onetro-company.appspot.com/o/IntroVideo%2FIntroVideo_Instruction.mp4?alt=media&token=25c553a4-7bde-49c9-8163-d55d1eb16e1b",
      showInstructionVideo: true
    });
  };
  stopRenderInstructionVideo = () => {
    this.setState({
      instructionVideo: "",
      showInstructionVideo: false

    });
  };
  handleChange(e: any) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    name == "skillText" ? this.setState({ skillsInEditMode: true }) : null;
    name == "otherSkillkillText"
      ? this.setState({ otherSkillsInEditMode: true })
      : null;
    name == "spokenLanguageText"
      ? this.setState({ spokenLanguageInEditMode: true })
      : null;
    this.setState({
      [name]: value
    });
  }
  handleObjectChange(e: any) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      candidate: { ...this.state.candidate, [name]: value }
    });
  }
  startSocialInfoEditing = () => {
    this.setState({ socialInfoEdit: true });
  };
  stopSocialInfoEditing = () => {
    this.setState({
      skillsInEditMode: false,
      otherSkillsInEditMode: false,
      spokenLanguageInEditMode: false
    });
    
    if (this.state.otherSkillText.length > 0) {
      var arrOtherSkills = this.state.otherSkillText.split(",");
      this.setState({ otherSkills: arrOtherSkills });
    } else {
      this.setState({ otherSkills: [] });
    }
    
    if (this.state.newProfilePicURL != "") 
    {
      companyStorage
        .ref()
        .child(`ProfilePicture/${this.state.candidate.id}`)
        .put(this.state.newProfilePic)
        .on(
          "state_changed",
          snapshot => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ progress });
          },
          err => {
            console.log(err);
            message.error('Error in updating data !');

          },
          () => {
            companyStorage
              .ref()
              .child(`ProfilePicture/${this.state.candidate.id}`)
              .getDownloadURL()
              .then(url => {
                this.setState({
                  candidate: { ...this.state.candidate, img: url }
                });
              })
              .then(() => {
                companyDatabase
                  .collection("CandidateInfo")
                  .doc(this.state.candidate.id)
                  .update({
                    img: this.state.candidate.img,
                    name: this.state.candidate.name,
                    place: this.state.candidate.place,
                    JobProfile: this.state.candidate.JobProfile,
                    skills: this.state.candidate.skills,
                    otherSkills: this.state.candidate.otherSkills,
                    spokenLanguages: this.state.candidate.spokenLanguages,
                    currentCompany: this.state.candidate.currentCompany,
                    skypeId: this.state.candidate.skypeId,
                    email: this.state.candidate.email,
                    dob: this.state.candidate.dob
                  })
                  .then(() => {
                    this.setState({
                      socialInfoEdit: false,
                      newProfilePic: {},
                      newProfilePicURL: "",
                      progress: 0
                    });
                    // this.AlertMessage("Data Saved Successfully", "success");
                    message.success('Data updated successfully');

                  })
                  .catch(function (error: any) {
                    message.error('Error in updating data !');

                   });
              });
          }
        );
    } else {
      companyDatabase
        .collection("CandidateInfo")
        .doc(this.state.candidate.id)
        .update({
          name: this.state.candidate.name,
          place: this.state.candidate.place,
          JobProfile: this.state.candidate.JobProfile,
          currentCompany: this.state.candidate.currentCompany,
          skypeId: this.state.candidate.skypeId,
          email: this.state.candidate.email,
          skills: this.state.candidate.skills,
          // skills:
          // this.state.skillText.length > 0
          //   ? this.state.skillText.split(",")
          //   : [],
          otherSkills: this.state.candidate.otherSkills,
          spokenLanguages: this.state.candidate.spokenLanguages,
          dob: this.state.candidate.dob
        })
        .then(() => {
          this.setState({
            socialInfoEdit: false,
            newProfilePic: {},
            newProfilePicURL: "",
            progress: 0
          });
          // this.AlertMessage("Data Saved Successfully", "success");
          message.success('Data updated successfully');

        })
        .catch(function (error: any) { 
          message.error('Error in updating data !');

        });
    }
  };
  handleNewProfilePicUpload = (e: any) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          newProfilePic: file,
          newProfilePicURL: reader.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  startintroVideoEditing = () => {
    this.setState({ introVideoEdit: true });
  };
  stopintroVideoEditing = () => {
    // this.setState({introVideoEdit:false});
    if (this.state.newIntroVideoURL != "") {
      companyStorage
        .ref()
        .child(`IntroVideo/${this.state.candidate.id}.mp4`)
        .put(this.state.newIntroVideo)
        .on(
          "state_changed",
          snapshot => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ progress });
          },
          err => {
            console.log(err);
            message.error('Error in updating data !');

          },
          () => {
            companyStorage
              .ref()
              .child(`IntroVideo/${this.state.candidate.id}.mp4`)
              .getDownloadURL()
              .then(url => {
                this.setState({
                  candidate: { ...this.state.candidate, video: url }
                });
              })
              .then(() => {
                companyDatabase
                  .collection("CandidateInfo")
                  .doc(this.state.candidate.id)
                  .update({
                    video: this.state.candidate.video
                    // ,active: false  //Need to enable if new video required verification
                  })
                  .then(() => {
                    this.setState({
                      introVideoEdit: false,
                      newIntroVideo: {},
                      newIntroVideoURL: "",
                      progress: 0
                    });
                    // this.AlertMessage("Data Saved Successfully", "success");
                    message.success('Data updated successfully');

                  })
                  .catch(function (error: any) {
                    message.error('Error in updating data !');

                   });
              });
          }
        );
    } else {
      this.setState({ introVideoEdit: false });
    }
  };
  handleNewIntroVideoUpload = (e: any) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          newIntroVideo: file,
          newIntroVideoURL: reader.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  // componentDidMount() {
  //   companyDatabase
  //     .collection("CandidateInfo")
  //     .where("id", "==", sessionStorage.getItem("candidateID"))
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(doc => {
  //         var data = doc.data();
  //         this.setState({
  //           candidate: data,
  //           workexperience: data.workExperience,
  //           education: data.education,
  //           projects: data.project,
  //           certificates: data.certificate,
  //           skills: data.skills,
  //           expertise: data.expertise,
  //           skillText: data.skills.join(","),
  //           otherSkills: data.otherSkills,
  //           otherSkillText: data.otherSkills.join(","),
  //           spokenLanguages: data.spokenLanguages,
  //           spokenLanguageText: data.spokenLanguages.join(","),
  //           // dob: data.dob ? data.dob.toDate() : null,
  //         });
  //       });
  //     })
  //     .then(() => {
  //       this.setState({ loading: false });
  //       // console.log(this.state.candidate.dob);

  //       // console.log(this.state.candidate.dob.toDate());

  //     });
  // }
  logout = () => {
    candidateAuth.signOut();
  };
  // dataCreate(){
  //   firebaseCompanyService.firestore().collection("CandidateInfo").where("id", "==", "1n3nRIHyLBPi6XfxzqVhzGBpE8g1")
  //   // firebaseService.firestore().collection("CandidateInfo").where("email", "==", "201651009@iiitvadodara.ac.in")

  //   .get()
  //   .then(function(querySnapshot) {
  //       querySnapshot.forEach(function(doc) {
  //           firebaseCompanyService.firestore().collection("CandidateInfo").doc("y70RvrsQSsN6nlJEumbNGWnFaUv1").set(doc.data())
  //           .then(()=>{
  //             alert('document created');
  //           })
  //           .catch((error)=>{
  //             alert(error);
  //           });
  //       });
  //   }).catch((error)=>{
  //     alert(error);
  //   });
  // }
  handleChangePlace = (value: string) => {
    // console.log('Country Selected: ' + value);
    this.setState({
      candidate: { ...this.state.candidate, place: value }
    });
  };

  handleChangeJobProfile = (value: string) => {
    // console.log('Job Profile Selected: ' + value);
    this.setState({
      candidate: { ...this.state.candidate, JobProfile: value }
    });
  };

  handleChangeSkills = (value: any) => {
    // console.log('skills Selected: ');
    // console.log(value);
    this.setState({
      candidate: { ...this.state.candidate, skills: value }
    });
  };
  handleChangeOtherSkills = (value: any) => {
    // console.log('OtherSkills Selected: ');
    // console.log(value);
    // console.log(this.state.candidate);
    this.setState({
      candidate: { ...this.state.candidate, otherSkills: value }
    });
    // console.log(this.state.candidate);
  };
  handleChangeSpokenLanguage = (value: any) => {
    // console.log('language Selected: ', value);

    this.setState({
      candidate: { ...this.state.candidate, spokenLanguages: value }
    });
  };
  handleChangeDOB = (value: any) => {
    this.setState({
      candidate: { ...this.state.candidate, dob: value },
      dob: value
    });
  };
  openNotificationWithIcon = () => {
    notification.open({
      message: 'Insufficient Information',
      description:
        'Please update all the information in this page to proceed in next page.',
      duration: 0,
      icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

    });
  };
  validateSocialInfoTab=(current:any)=>{
    let flagError=false;
    if(this.state.candidate.name.length === 0
      ||this.state.candidate.place.length===0
      ||this.state.candidate.JobProfile.length===0
      ||this.state.candidate.skills==null
      ||this.state.candidate.email.length===0
      )
    {
      flagError=true;
    }
   if(flagError)
    {
      this.openNotificationWithIcon();
    }
    else
    {
      this.setState({
        current: current + 1
      });
    }
  }
  validateEducationInfoTab=(current:any)=>{
    let flagError=false;
    if(this.state.candidate.education.length===0)
      flagError=true;

    if(flagError)
    {
      this.openNotificationWithIcon();
    }
    else
    {
      this.setState({
        current: current + 1
      });
    }
  }
  validateIntroVideoTab=(current:any)=>{
    let flagError=false;
    if(this.state.candidate.video.length===0)
    {flagError=true;}
    if(flagError)
    {
      notification.open({
        message: 'Insufficient Information',
        description:
          'Please update your Introduction Video to proceed in next page.',
        duration: 0,
        icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />
  
      });
    }
    else
    {
      message.success('Congratulations! your profile is complete now.');
      this.setState({
        current: current + 1
      });
    }
  }
  nextStep = () => {
    alert('will go to next step');
    // const { current } = this.state;
    // switch(current){
    //   case 0: 
    //     this.validateSocialInfoTab(current);
    //     break;
    //   case 1:
    //     this.setState({current: current + 1});
    //     break;
    //   case 2:
    //     this.setState({current: current + 1});
    //     break;
    //   case 3:
    //     this.setState({current: current + 1});
    //     break;
    //   case 4:
    //     this.setState({current: current + 1});
    //     break;
    //   case 5:
    //     this.setState({current: current + 1});
    //     break;
    //   case 6:
    //     this.validateIntroVideoTab(current);
    //     break;
    //   case 7:
    //     message.success('Profile complete!');
    //     this.setState({current: current + 1});
    //     break;
    //   default: return null;
    // }
    // this.setState({
    //   current: current + 1
    // });
  }
  prevStep = () => {
    const { current } = this.state;
    this.setState({
      current: current - 1
    });
  }
  render() {
    if (sessionStorage.getItem('candidateID') == null) {
      return <Redirect to="/" />;
    }
    const { current } = this.state;

    return (
      <div>
                <Header /> 
                <Layout className="indexLayout">
    
          <Row>
            {/* <Col xs={0} sm={1} md={4} lg={6}></Col> */}
            <Col xs={24} sm={24} md={24} lg={24}>
              <Content className="contentClass"> 
        
              <ProfileProgressContainer/>
              </Content>
            #region LAST DESIGN  
              {/* <div className="cvBuilder-Background row">
                <Header />
                <div className="container10p col-lg-12 text-center">
                  <div className="col s12 m6 center">
                    <h3 className="pgTitle bak1Head">
                      WE ARE CURRENTLY WORKING ON AN AWESOME NEW SITE
                      </h3>
                    <h3 className="col pgDescription">
                      We are going to add many exciting features in this website soon.
                      </h3>
                    <h3 className="col pgDescription">
                      Complete your profile today to become visible to the companies
                      </h3>
                    <h3 className="col pgDescription">
                      After that we'll verify your account and contact you soon
                    </h3>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-1 hidden-md hidden-sm hidden-xs" />
                    <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
                    <Badge status="processing" text="Your profile is live and visible to recruiters." /> 

                      <div className="row">
                        <Steps current={current} size="small">
                          {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                          ))}
                        </Steps>
                        
                        <Progress strokeLinecap="square" percent={Math.round(((current+1)/8)*100)} />

                      </div>

                      {(() => {
                        switch (current) {
                          case 0:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                <div className="row">
                                <div className="steps-action col-lg-12">
                                  <Button type="primary" onClick={() => this.nextStep()}>
                                      Next
                                      <Icon type="right" />
                                  </Button>
                                </div>
                                <Divider>Social Information</Divider>
                                  <div className="col-lg-1"></div>
                                  <div className="chip col-lg-10 col-md-10 col-sm-12 col-xs-12">

                                      <div className="row">
                                        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                          {this.state.candidate.active ? (
                                            <div className="row">
                                              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">

                                                <div className="ring-container">
                                                  <div className="ringring" />
                                                  <div className="circle" />
                                                </div>
                                              </div>
                                              <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">

                                                <span className="txtLive">
                                                  Your profile is live and visible to
                                                  recruiters.
                                                  </span>
                                              </div>
                                            </div>
                                          ) : (
                                              <div className="row">
                                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">

                                                  <div className="ring-container">
                                                    <div className="ringringOffLine" />
                                                    <div className="circleOffLine" />
                                                  </div>
                                                </div>
                                                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">

                                                  <span className="txtLive">
                                                    Your profile is not Live and pending for
                                                    approval.
                                                  </span>
                                                  <span className="help-tip">
                                                    <p>
                                                      {this.state.candidate.profileOfflineNote ? this.state.candidate.profileOfflineNote.split(',')
                                                        .map((item: any, j: any) => {
                                                          return <span className="offlineNoteSpan" key={j}>{item}</span>
                                                        }) : <span></span>}</p>
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                          <div className="btn-group">
                                            <div className="btn">
                                              {this.state.socialInfoEdit === true ? (

                                                <span
                                                  className="update btn btn-sm btn-outline-success"
                                                  onClick={() => this.stopSocialInfoEditing()}
                                                >
                                                  <small>Save</small>
                                                </span>
                                              ) : (

                                                  <span
                                                    className="edit btn btn-sm btn-outline-info"
                                                    onClick={() =>
                                                      this.startSocialInfoEditing()
                                                    }
                                                  >
                                                    <small>Edit</small>
                                                  </span>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {this.state.socialInfoEdit ? (
                                        <div className="row">
                                          <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <small>
                                              <strong>Profile Picture</strong>
                                            </small>
                                          </label>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            name="newProfilePic"
                                            className="introVideoUploadControl col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                            onChange={e => {
                                              this.handleNewProfilePicUpload(e);
                                            }}
                                          />
                                          <ProgressBar
                                            className="progressBar"
                                            animated
                                            now={this.state.progress}
                                          />
                                          <br />
                                        </div>
                                      ) : (
                                          <div />
                                        )}
                                      <div className="row">
                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                          <div className="row">

                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgbox text-center">
                                              <img
                                                src={
                                                  this.state.candidate.img ||
                                                  "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3"
                                                }
                                                alt="Person"
                                                width={100}
                                                height={100}
                                              />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 badge text-center">
                                              <div className="row">
                                                <div className="socialInfoStarlbl col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                                  <span>Stars </span>
                                                  <Icon type="star" theme="twoTone" twoToneColor="#ff9800">1</Icon>
                                                  <span className="socialInfocount">{this.state.candidate.starsEarned}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                          <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-left">
                                              {this.state.socialInfoEdit ? (
                                                <div>
                                                  <label>
                                                    <small>
                                                      <strong>Name</strong>
                                                    </small>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    onChange={e => this.handleObjectChange(e)}
                                                    className="form-control"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Example: John Doe"
                                                    value={this.state.candidate.name}
                                                  />
                                                </div>
                                              ) : (
                                                  <h5>{this.state.candidate.name}</h5>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 sm-text-left xs-text-left">
                                              {this.state.socialInfoEdit ? (
                                                <div>
                                                  <label>
                                                    <small>
                                                      <strong>Place</strong>
                                                    </small>
                                                  </label>

                                                  <AutoSuggest
                                                    handleChange={this.handleChangePlace}
                                                    options={countryOptions}
                                                    isMulti={false}
                                                    creatable={false}
                                                    defaultValue={
                                                      this.state.candidate.place
                                                        ? this.state.candidate.place
                                                        : ""
                                                    }
                                                  />
                                                </div>
                                              ) : (
                                                  <span className="skillSetLocation">
                                                    {this.state.candidate.place ? (
                                                      <i className="material-icons skillSetLocation">
                                                        place
                                                      </i>
                                                    ) : (
                                                        <span>
                                                          | click edit and update your place |
                                                      </span>
                                                      )}
                                                    {this.state.candidate.place}
                                                  </span>
                                                )}
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <form className="form-horizontal">
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>Job Profile</strong>
                                                        </small>
                                                      </label>

                                                      <AutoSuggest
                                                        handleChange={
                                                          this.handleChangeJobProfile
                                                        }
                                                        options={jobProfileOptions}
                                                        isMulti={false}
                                                        creatable={false}
                                                        defaultValue={
                                                          this.state.candidate.JobProfile
                                                            ? this.state.candidate.JobProfile
                                                            : ""
                                                        }
                                                      />
                                                    </div>
                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="jbProfile"
                                                        >
                                                          <small>
                                                            <small>Job Profile:</small>
                                                          </small>
                                                        </label>
                                                        <div className="col-lg-9 socialInfolbl">
                                                          <span id="jbProfile">
                                                            {this.state.candidate.JobProfile ? (
                                                              <span className="itemName">
                                                                {this.state.candidate.JobProfile}
                                                              </span>
                                                            ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your Job
                                                                  Profile |
                                                            </span>
                                                              )}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>Current Company</strong>
                                                        </small>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        onChange={e =>
                                                          this.handleObjectChange(e)
                                                        }
                                                        className="form-control"
                                                        name="currentCompany"
                                                        id="currentCompany"
                                                        placeholder="Ex: Onetro,Willings"
                                                        value={
                                                          this.state.candidate.currentCompany
                                                        }
                                                      />
                                                    </div>
                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="currCompany"
                                                        >
                                                          <small>
                                                            <small>Company:</small>
                                                          </small>
                                                        </label>
                                                        <div className="col-lg-9 socialInfolbl">
                                                          <span id="currCompany">
                                                            {this.state.candidate
                                                              .currentCompany ? (
                                                                <span className="itemName">
                                                                  {
                                                                    this.state.candidate
                                                                      .currentCompany
                                                                  }
                                                                </span>
                                                              ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your
                                                                  current company name |
                                                            </span>
                                                              )}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>Skills</strong>
                                                        </small>
                                                      </label>

                                                      <AutoSuggest
                                                        handleChange={this.handleChangeSkills}
                                                        options={skillOptions}
                                                        isMulti={true}
                                                        creatable={true}
                                                        defaultValue={
                                                          this.state.candidate.skills
                                                            ? this.state.candidate.skills
                                                            : null
                                                        }
                                                      />
                                                      {this.state.skillsInEditMode ? (
                                                        <div className="alert-skill alert-danger">
                                                          <small>
                                                            <small>
                                                              Skills should be "," separated.
                                                              Example: JavaScript,HTML/CSS,C++
                                                            </small>
                                                          </small>
                                                        </div>
                                                      ) : null}
                                                    </div>
                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="techSkill"
                                                        >
                                                          <small>
                                                            <small>Technical Skills:</small>
                                                          </small>
                                                        </label>
                                                        <div
                                                          className="col-lg-9 socialInfolbl"
                                                          id="techSkill"
                                                        >
                                                          {this.state.candidate.skills ? (
                                                            this.state.candidate.skills.map(
                                                              (skill: any) => (
                                                                <p
                                                                  key={skill.id}
                                                                  className="skills"
                                                                >
                                                                  {skill.value
                                                                    ? skill.value
                                                                    : skill.name}
                                                                </p>
                                                              )
                                                            )
                                                          ) : (
                                                              <span className="skillSetLocation">
                                                                | click edit and update your
                                                                technical Skills |
                                                          </span>
                                                            )}
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>Spoken Languages</strong>
                                                        </small>
                                                      </label>

                                                      <AutoSuggest
                                                        handleChange={
                                                          this.handleChangeSpokenLanguage
                                                        }
                                                        options={languageOptions}
                                                        isMulti={true}
                                                        creatable={false}
                                                        defaultValue={
                                                          this.state.candidate.spokenLanguages
                                                            ? this.state.candidate
                                                              .spokenLanguages
                                                            : null
                                                        }
                                                      />
                                                      {this.state.spokenLanguageInEditMode ? (
                                                        <div className="alert-skill alert-danger">
                                                          <small>
                                                            <small>
                                                              Languages should be "," separated.
                                                              Example: English,Japanese
                                                            </small>
                                                          </small>
                                                        </div>
                                                      ) : null}
                                                    </div>
                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="lang"
                                                        >
                                                          <small>
                                                            <small>Languages:</small>
                                                          </small>
                                                        </label>
                                                        <div
                                                          className="col-lg-9 socialInfolbl"
                                                          id="lang"
                                                        >
                                                          {this.state.candidate
                                                            .spokenLanguages ? (
                                                              this.state.candidate.spokenLanguages.map(
                                                                (language: any) => (
                                                                  <p
                                                                    key={language.id}
                                                                    className="skills"
                                                                  >
                                                                    {language.value
                                                                      ? language.value
                                                                      : language.name}
                                                                  </p>
                                                                )
                                                              )
                                                            ) : (
                                                              <span className="skillSetLocation">
                                                                | click edit and update your other
                                                                spoken languages |
                                                          </span>
                                                            )}
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>SkypeId</strong>
                                                        </small>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        onChange={e =>
                                                          this.handleObjectChange(e)
                                                        }
                                                        className="form-control"
                                                        name="skypeId"
                                                        id="skypeId"
                                                        placeholder="Skype Id"
                                                        value={this.state.candidate.skypeId}
                                                      />
                                                    </div>
                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="currCompany"
                                                        >
                                                          <small>
                                                            <small>SkypeId:</small>
                                                          </small>
                                                        </label>
                                                        <div className="col-lg-9 socialInfolbl">
                                                          <span id="currCompany">
                                                            {this.state.candidate.skypeId ? (
                                                              <span className="itemName">
                                                                <a
                                                                  href={
                                                                    "skype:" +
                                                                    this.state.candidate.skypeId
                                                                  }
                                                                >
                                                                  {this.state.candidate.skypeId}
                                                                </a>
                                                              </span>
                                                            ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your
                                                                  current skypeID |
                                                            </span>
                                                              )}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>E-Mail</strong>
                                                        </small>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        onChange={e =>
                                                          this.handleObjectChange(e)
                                                        }
                                                        className="form-control"
                                                        name="email"
                                                        id="email"
                                                        placeholder="Ex: example@onetro.com"
                                                        value={this.state.candidate.email}
                                                      />
                                                    </div>
                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="currCompany"
                                                        >
                                                          <small>
                                                            <small>Email:</small>
                                                          </small>
                                                        </label>
                                                        <div className="col-lg-9 socialInfolbl">
                                                          <span id="currCompany">
                                                            {this.state.candidate.email ? (
                                                              <span className="itemName">
                                                                <a
                                                                  href={
                                                                    "mailto:" +
                                                                    this.state.candidate.email
                                                                  }
                                                                >
                                                                  {this.state.candidate.email}
                                                                </a>
                                                              </span>
                                                            ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your
                                                                  current email id|
                                                            </span>
                                                              )}
                                                          </span>
                                                        </div>
                                                      </div>

                                                    )}
                                                </div>
                                                <div className="form-group text-left">
                                                  {this.state.socialInfoEdit ? (
                                                    <div>
                                                      <label>
                                                        <small>
                                                          <strong>Date of Birth:</strong>
                                                        </small>
                                                      </label><br />

                                                      <DatePicker
                                                        className="datePicker form-control"
                                                        selected={this.state.dob}
                                                        onChange={this.handleChangeDOB}
                                                        dateFormat="d MMMM, yyyy"
                                                        placeholderText="Click to select a date"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                      />
                                                    </div>

                                                  ) : (
                                                      <div className="row">
                                                        <label
                                                          className="control-label col-lg-3 socialInfolbl"
                                                          htmlFor="dob"
                                                        >
                                                          <small>
                                                            <small>Date of Birth:</small>
                                                          </small>
                                                        </label>
                                                        <div className="col-lg-9 socialInfolbl">
                                                          <span id="dob">
                                                            {this.state.candidate.dob ? (
                                                              <span className="itemName">
                                                                {new Intl.DateTimeFormat('en-GB', {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: '2-digit'
                                                                }).format(this.state.dob)}
                                                              </span>
                                                            ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your date
                                                                  of birth |
                                                            </span>
                                                              )}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>

                                              </form>
                                            </div><br /><br />
                                            <div className="col-lg-12">
                                              {this.state.socialInfoEdit === true ? (

                                                <button
                                                  className="update btn btn-md form-control btn-outline-success col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                  onClick={() => this.stopSocialInfoEditing()}
                                                >
                                                  Save
                                              </button>
                                              ) : (
                                                  <div />
                                                )}
                                            </div>
                                          </div>
                                        </div>

                                      </div>
                                    </div>
                                    <div className="col-lg-1"></div>
                                </div>
                              </div>
                              </div>
                            );
                          case 1:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                  <AcademicBackground nextStep={this.nextStep} prevStep={this.prevStep} navigationVisible={true} />
                                </div>
                              </div>
                            );

                          case 2:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                  <CareerHistory nextStep={this.nextStep} prevStep={this.prevStep} navigationVisible={true} />
                                </div>
                              </div>
                            );
                          case 3:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                  <ProjectExperience nextStep={this.nextStep} prevStep={this.prevStep} navigationVisible={true} />
                                </div>
                              </div>
                            );
                          case 4:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                  <Certifications nextStep={this.nextStep} prevStep={this.prevStep} navigationVisible={true} />
                                </div>
                              </div>);
                          case 5:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                  
                                <RightSidebarComponent  nextStep={this.nextStep} prevStep={this.prevStep}/>
                                </div>
                              </div>);
                          case 6:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                <div className="row">
                                <div className="steps-action col-lg-12">
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>
                                    Previous
                                    <Icon type="left" />
                                </Button>
                                  <Button type="primary" onClick={() => this.nextStep()}>
                                      Next
                                      <Icon type="right" />
                                  </Button>
                                  
                                </div>
                                <Divider>Introduction Video</Divider>

                              <div className="col-lg-2 col-md-2 hidden-sm hidden-xs"></div>  
                              <div className="chipIntroVideo col-lg-8 col-md-8 col-sm-12 col-xs-12 ">
                                      <div className="row">
                                        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                          <h3 className="introVideoTitle">
                                            One Minute Intro Video
                                            </h3>
                                        </div>
                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left sm-text-left">
                                              {this.state.introVideoEdit === true ? (
                                                <button
                                                  className="update btn btn-sm btn-outline-success"
                                                  onClick={() => this.stopintroVideoEditing()}
                                                >
                                                  <small>Save</small>
                                                </button>
                                              ) : (
                                                  <button
                                                    className="edit btn btn-sm btn-outline-info"
                                                    onClick={() =>
                                                      this.startintroVideoEditing()
                                                    }
                                                  >
                                                    <small>Edit Video</small>
                                                  </button>
                                                )}
                                        </div>
                                      </div>
                                      <div className="row">
                                        {this.state.introVideoEdit ? (
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <input
                                              type="file"
                                              accept="video/*"
                                              className="introVideoUploadControl"
                                              name="newIntroVideo"
                                              onChange={e => {
                                                this.handleNewIntroVideoUpload(e);
                                              }}
                                            />
                                            <br />
                                            <ProgressBar
                                              className="progressBar"
                                              animated
                                              now={this.state.progress}
                                            />
                                          </div>
                                        ) : null}
                                      </div>
                                      <div className="row">
                                        {this.state.candidate.video ? (
                                          <video
                                            className="introVideo col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                            controls
                                            controlsList="nodownload"
                                          >
                                            <source
                                              src={this.state.candidate.video}
                                              // src="https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/IntroVideo%2Fp4MA6hSXC7SBQAF3msRA2QnaVjq2.mp4?alt=media&token=fff79396-c4de-402b-ab29-9b60ae652e2e"
                                              type="video/mp4"
                                            />
                                            Your browser does not support HTML5 video.
                                            </video>
                                        ) : (
                                            <div className="introVideoBlank col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <span className="introVideoUploadInstruction"><small>
                                                Please click on "Edit video" option above and
                                                upload your introduction video.
                                                <br />
                                                Tips:
                                                <br />1. Video should be in Landscape
                                                <br />2. It should be made in good lighting.
                                                <br />3. It is only a 1 minute video
                                                <br />4. Should be shot through a good camera, can be a phone camera as long as the quality is clear.
                                                <br />5. First/Last greeting in Japanese gives better impression to the companies.
                                                <br />6. Mention why you would like to work in Japan.
                                                <br />7. Good Smile
                                                <br />8. Good Volume of your speak</small><br /><br />
                                                <br />Here is an introduction video guideline for a reference
                                                  <div className="btn btn-sm btn-outline-info"
                                                  onClick={() => this.renderInstructionVideo()}
                                                >
                                                  <span>Instruction Video</span>
                                                </div>
                                              </span><br />

                                              <Modal show={this.state.showInstructionVideo} onHide={this.stopRenderInstructionVideo}>
                                                <Modal.Header closeButton>
                                                  <Modal.Title>Instruction Video</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                  {this.state.instructionVideo.length > 0 ?
                                                    <video className="introVideo" poster={preview} controls controlsList="nodownload">
                                                      <source
                                                        src={this.state.instructionVideo}
                                                        type="video/mp4"
                                                      />
                                                      Your browser does not support HTML5 video.
                                                  </video> :
                                                    <div></div>
                                                  }
                                                </Modal.Body>

                                              </Modal>

                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  <div className="col-lg-2 col-md-2 hidden-sm hidden-xs"></div>  
                                  </div>
                                  </div>

                              </div>);
                          case 7:
                            return (
                              <div className="row">
                                <div className="col-lg-12 steps-content">
                                <div className="row">
                                <div className="steps-action col-lg-12">
                                  <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>
                                    Previous
                                    <Icon type="left" />
                                  </Button>
                                </div>
                                <Divider>Your complete profile below</Divider>

                                  <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                                    <div className="row">

                                      <div className="chipIntroVideo col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                        <div className="row">
                                          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                            <h3 className="introVideoTitle">
                                              One Minute Intro Video
                                              </h3>
                                          </div>
                                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                            <div className="btn-group">
                                              <div className="btn">
                                                {this.state.introVideoEdit === true ? (
                                                  <span
                                                    className="update btn btn-sm btn-outline-success"
                                                    onClick={() => this.stopintroVideoEditing()}
                                                  >
                                                    <small>Save</small>
                                                  </span>
                                                ) : (
                                                    <span
                                                      className="edit btn btn-sm btn-outline-info"
                                                      onClick={() =>
                                                        this.startintroVideoEditing()
                                                      }
                                                    >
                                                      <small>Edit Video</small>
                                                    </span>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          {this.state.introVideoEdit ? (
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <input
                                                type="file"
                                                accept="video/*"
                                                className="introVideoUploadControl"
                                                name="newIntroVideo"
                                                onChange={e => {
                                                  this.handleNewIntroVideoUpload(e);
                                                }}
                                              />
                                              <br />
                                              <ProgressBar
                                                className="progressBar"
                                                animated
                                                now={this.state.progress}
                                              />
                                            </div>
                                          ) : null}
                                        </div>
                                        <div className="row">
                                          {this.state.candidate.video ? (
                                            <video
                                              className="introVideo col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                              controls
                                              controlsList="nodownload"
                                            >
                                              <source
                                                src={this.state.candidate.video}
                                                // src="https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/IntroVideo%2Fp4MA6hSXC7SBQAF3msRA2QnaVjq2.mp4?alt=media&token=fff79396-c4de-402b-ab29-9b60ae652e2e"
                                                type="video/mp4"
                                              />
                                              Your browser does not support HTML5 video.
                                              </video>
                                          ) : (
                                              <div className="introVideoBlank col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <span className="introVideoUploadInstruction"><small>
                                                  Please click on "Edit video" option above and
                                                  upload your introduction video.
                                                  <br />
                                                  Tips:
                                                  <br />1. Video should be in Landscape
                                                  <br />2. It should be made in good lighting.
                                                  <br />3. It is only a 1 minute video
                                                  <br />4. Should be shot through a good camera, can be a phone camera as long as the quality is clear.
                                                  <br />5. First/Last greeting in Japanese gives better impression to the companies.
                                                  <br />6. Mention why you would like to work in Japan.
                                                  <br />7. Good Smile
                                                  <br />8. Good Volume of your speak</small><br /><br />
                                                  <br />Here is an introduction video guideline for a reference
                                                    <div className="btn btn-sm btn-outline-info"
                                                    onClick={() => this.renderInstructionVideo()}
                                                  >
                                                    <span>Instruction Video</span>
                                                  </div>
                                                </span><br />

                                                <Modal show={this.state.showInstructionVideo} onHide={this.stopRenderInstructionVideo}>
                                                  <Modal.Header closeButton>
                                                    <Modal.Title>Instruction Video</Modal.Title>
                                                  </Modal.Header>
                                                  <Modal.Body>
                                                    {this.state.instructionVideo.length > 0 ?
                                                      <video className="introVideo" poster={preview} controls controlsList="nodownload">
                                                        <source
                                                          // src="https://firebasestorage.googleapis.com/v0/b/onetro-company.appspot.com/o/IntroVideo%2FIntroVideo_Instruction.mp4?alt=media&token=25c553a4-7bde-49c9-8163-d55d1eb16e1b"
                                                          src={this.state.instructionVideo}
                                                          type="video/mp4"
                                                        />
                                                        Your browser does not support HTML5 video.
                                                    </video> :
                                                      <div></div>
                                                    }
                                                  </Modal.Body>

                                                </Modal>

                                              </div>
                                            )}
                                        </div>
                                      </div>
                                      <div className="chip col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="row">
                                          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                            {this.state.candidate.active ? (
                                              <div className="row">
                                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">

                                                  <div className="ring-container">
                                                    <div className="ringring" />
                                                    <div className="circle" />
                                                  </div>
                                                </div>
                                                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">

                                                  <span className="txtLive">
                                                    Your profile is live and visible to
                                                    recruiters.
                                                    </span>
                                                </div>
                                              </div>
                                            ) : (
                                                <div className="row">
                                                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">

                                                    <div className="ring-container">
                                                      <div className="ringringOffLine" />
                                                      <div className="circleOffLine" />
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">

                                                    <span className="txtLive">
                                                      Your profile is not Live and pending for
                                                      approval.
                                                    </span>
                                                    <span className="help-tip">
                                                      <p>
                                                        {this.state.candidate.profileOfflineNote ? this.state.candidate.profileOfflineNote.split(',')
                                                          .map((item: any, j: any) => {
                                                            return <span className="offlineNoteSpan" key={j}>{item}</span>
                                                          }) : <span></span>}</p>
                                                    </span>
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                            <div className="btn-group">
                                              <div className="btn">
                                                {this.state.socialInfoEdit === true ? (

                                                  <span
                                                    className="update btn btn-sm btn-outline-success"
                                                    onClick={() => this.stopSocialInfoEditing()}
                                                  >
                                                    <small>Save</small>
                                                  </span>
                                                ) : (

                                                    <span
                                                      className="edit btn btn-sm btn-info"
                                                      onClick={() =>
                                                        this.startSocialInfoEditing()
                                                      }
                                                    >
                                                      <small>Edit</small>
                                                    </span>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {this.state.socialInfoEdit ? (
                                          <div className="row">
                                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <small>
                                                <strong>Profile Picture</strong>
                                              </small>
                                            </label>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              name="newProfilePic"
                                              className="introVideoUploadControl col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                              onChange={e => {
                                                this.handleNewProfilePicUpload(e);
                                              }}
                                            />
                                            <ProgressBar
                                              className="progressBar"
                                              animated
                                              now={this.state.progress}
                                            />
                                            <br />
                                          </div>
                                        ) : (
                                            <div />
                                          )}
                                        <div className="row">
                                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                            <div className="row">

                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgbox text-center">
                                                <img
                                                  src={
                                                    this.state.candidate.img ||
                                                    "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3"
                                                  }
                                                  alt="Person"
                                                  width={100}
                                                  height={100}
                                                />
                                              </div>
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 badge text-center">
                                                <div className="row">
                                                  <div className="socialInfoStarlbl col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                                    <span>Stars </span>

                                                    <span className="socialInfocount">{this.state.candidate.starsEarned}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                            <div className="row">
                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-left">
                                                {this.state.socialInfoEdit ? (
                                                  <div>
                                                    <label>
                                                      <small>
                                                        <strong>Name</strong>
                                                      </small>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      onChange={e => this.handleObjectChange(e)}
                                                      className="form-control"
                                                      name="name"
                                                      id="name"
                                                      placeholder="Example: John Doe"
                                                      value={this.state.candidate.name}
                                                    />
                                                  </div>
                                                ) : (
                                                    <h5>{this.state.candidate.name}</h5>
                                                  )}
                                              </div>
                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                                                {this.state.socialInfoEdit ? (
                                                  <div>
                                                    <label>
                                                      <small>
                                                        <strong>Place</strong>
                                                      </small>
                                                    </label>

                                                    <AutoSuggest
                                                      handleChange={this.handleChangePlace}
                                                      options={countryOptions}
                                                      isMulti={false}
                                                      creatable={false}
                                                      defaultValue={
                                                        this.state.candidate.place
                                                          ? this.state.candidate.place
                                                          : ""
                                                      }
                                                    />
                                                  </div>
                                                ) : (
                                                    <span className="skillSetLocation">
                                                      {this.state.candidate.place ? (
                                                        <i className="material-icons skillSetLocation">
                                                          place
                                                        </i>
                                                      ) : (
                                                          <span>
                                                            | click edit and update your place |
                                                        </span>
                                                        )}
                                                      {this.state.candidate.place}
                                                    </span>
                                                  )}
                                              </div>
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <form className="form-horizontal">
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>Job Profile</strong>
                                                          </small>
                                                        </label>

                                                        <AutoSuggest
                                                          handleChange={
                                                            this.handleChangeJobProfile
                                                          }
                                                          options={jobProfileOptions}
                                                          isMulti={false}
                                                          creatable={false}
                                                          defaultValue={
                                                            this.state.candidate.JobProfile
                                                              ? this.state.candidate.JobProfile
                                                              : ""
                                                          }
                                                        />
                                                      </div>
                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="jbProfile"
                                                          >
                                                            <small>
                                                              <small>Job Profile:</small>
                                                            </small>
                                                          </label>
                                                          <div className="col-lg-9 socialInfolbl">
                                                            <span id="jbProfile">
                                                              {this.state.candidate.JobProfile ? (
                                                                <span className="itemName">
                                                                  {this.state.candidate.JobProfile}
                                                                </span>
                                                              ) : (
                                                                  <span className="skillSetLocation">
                                                                    | click edit and update your Job
                                                                    Profile |
                                                              </span>
                                                                )}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>Current Company</strong>
                                                          </small>
                                                        </label>
                                                        <input
                                                          type="text"
                                                          onChange={e =>
                                                            this.handleObjectChange(e)
                                                          }
                                                          className="form-control"
                                                          name="currentCompany"
                                                          id="currentCompany"
                                                          placeholder="Ex: Onetro,Willings"
                                                          value={
                                                            this.state.candidate.currentCompany
                                                          }
                                                        />
                                                      </div>
                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="currCompany"
                                                          >
                                                            <small>
                                                              <small>Company:</small>
                                                            </small>
                                                          </label>
                                                          <div className="col-lg-9 socialInfolbl">
                                                            <span id="currCompany">
                                                              {this.state.candidate
                                                                .currentCompany ? (
                                                                  <span className="itemName">
                                                                    {
                                                                      this.state.candidate
                                                                        .currentCompany
                                                                    }
                                                                  </span>
                                                                ) : (
                                                                  <span className="skillSetLocation">
                                                                    | click edit and update your
                                                                    current company name |
                                                              </span>
                                                                )}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>Skills</strong>
                                                          </small>
                                                        </label>

                                                        <AutoSuggest
                                                          handleChange={this.handleChangeSkills}
                                                          options={skillOptions}
                                                          isMulti={true}
                                                          creatable={true}
                                                          defaultValue={
                                                            this.state.candidate.skills
                                                              ? this.state.candidate.skills
                                                              : null
                                                          }
                                                        />
                                                        {this.state.skillsInEditMode ? (
                                                          <div className="alert-skill alert-danger">
                                                            <small>
                                                              <small>
                                                                Skills should be "," separated.
                                                                Example: JavaScript,HTML/CSS,C++
                                                              </small>
                                                            </small>
                                                          </div>
                                                        ) : null}
                                                      </div>
                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="techSkill"
                                                          >
                                                            <small>
                                                              <small>Technical Skills:</small>
                                                            </small>
                                                          </label>
                                                          <div
                                                            className="col-lg-9 socialInfolbl"
                                                            id="techSkill"
                                                          >
                                                            {this.state.candidate.skills ? (
                                                              this.state.candidate.skills.map(
                                                                (skill: any) => (
                                                                  <p
                                                                    key={skill.id}
                                                                    className="skills"
                                                                  >
                                                                    {skill.value
                                                                      ? skill.value
                                                                      : skill.name}
                                                                  </p>
                                                                )
                                                              )
                                                            ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your
                                                                  technical Skills |
                                                            </span>
                                                              )}
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>Spoken Languages</strong>
                                                          </small>
                                                        </label>

                                                        <AutoSuggest
                                                          handleChange={
                                                            this.handleChangeSpokenLanguage
                                                          }
                                                          options={languageOptions}
                                                          isMulti={true}
                                                          creatable={false}
                                                          defaultValue={
                                                            this.state.candidate.spokenLanguages
                                                              ? this.state.candidate
                                                                .spokenLanguages
                                                              : null
                                                          }
                                                        />
                                                        {this.state.spokenLanguageInEditMode ? (
                                                          <div className="alert-skill alert-danger">
                                                            <small>
                                                              <small>
                                                                Languages should be "," separated.
                                                                Example: English,Japanese
                                                              </small>
                                                            </small>
                                                          </div>
                                                        ) : null}
                                                      </div>
                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="lang"
                                                          >
                                                            <small>
                                                              <small>Languages:</small>
                                                            </small>
                                                          </label>
                                                          <div
                                                            className="col-lg-9 socialInfolbl"
                                                            id="lang"
                                                          >
                                                            {this.state.candidate
                                                              .spokenLanguages ? (
                                                                this.state.candidate.spokenLanguages.map(
                                                                  (language: any) => (
                                                                    <p
                                                                      key={language.id}
                                                                      className="skills"
                                                                    >
                                                                      {language.value
                                                                        ? language.value
                                                                        : language.name}
                                                                    </p>
                                                                  )
                                                                )
                                                              ) : (
                                                                <span className="skillSetLocation">
                                                                  | click edit and update your other
                                                                  spoken languages |
                                                            </span>
                                                              )}
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>SkypeId</strong>
                                                          </small>
                                                        </label>
                                                        <input
                                                          type="text"
                                                          onChange={e =>
                                                            this.handleObjectChange(e)
                                                          }
                                                          className="form-control"
                                                          name="skypeId"
                                                          id="skypeId"
                                                          placeholder="Skype Id"
                                                          value={this.state.candidate.skypeId}
                                                        />
                                                      </div>
                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="currCompany"
                                                          >
                                                            <small>
                                                              <small>SkypeId:</small>
                                                            </small>
                                                          </label>
                                                          <div className="col-lg-9 socialInfolbl">
                                                            <span id="currCompany">
                                                              {this.state.candidate.skypeId ? (
                                                                <span className="itemName">
                                                                  <a
                                                                    href={
                                                                      "skype:" +
                                                                      this.state.candidate.skypeId
                                                                    }
                                                                  >
                                                                    {this.state.candidate.skypeId}
                                                                  </a>
                                                                </span>
                                                              ) : (
                                                                  <span className="skillSetLocation">
                                                                    | click edit and update your
                                                                    current skypeID |
                                                              </span>
                                                                )}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>E-Mail</strong>
                                                          </small>
                                                        </label>
                                                        <input
                                                          type="text"
                                                          onChange={e =>
                                                            this.handleObjectChange(e)
                                                          }
                                                          className="form-control"
                                                          name="email"
                                                          id="email"
                                                          placeholder="Ex: example@onetro.com"
                                                          value={this.state.candidate.email}
                                                        />
                                                      </div>
                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="currCompany"
                                                          >
                                                            <small>
                                                              <small>Email:</small>
                                                            </small>
                                                          </label>
                                                          <div className="col-lg-9 socialInfolbl">
                                                            <span id="currCompany">
                                                              {this.state.candidate.email ? (
                                                                <span className="itemName">
                                                                  <a
                                                                    href={
                                                                      "mailto:" +
                                                                      this.state.candidate.email
                                                                    }
                                                                  >
                                                                    {this.state.candidate.email}
                                                                  </a>
                                                                </span>
                                                              ) : (
                                                                  <span className="skillSetLocation">
                                                                    | click edit and update your
                                                                    current email id|
                                                              </span>
                                                                )}
                                                            </span>
                                                          </div>
                                                        </div>

                                                      )}
                                                  </div>
                                                  <div className="form-group text-left">
                                                    {this.state.socialInfoEdit ? (
                                                      <div>
                                                        <label>
                                                          <small>
                                                            <strong>Date of Birth:</strong>
                                                          </small>
                                                        </label><br />

                                                        <DatePicker
                                                          className="datePicker form-control"
                                                          selected={this.state.dob}
                                                          onChange={this.handleChangeDOB}
                                                          dateFormat="d MMMM, yyyy"
                                                          placeholderText="Click to select a date"
                                                          showMonthDropdown
                                                          showYearDropdown
                                                        />
                                                      </div>

                                                    ) : (
                                                        <div className="row">
                                                          <label
                                                            className="control-label col-lg-3 socialInfolbl"
                                                            htmlFor="dob"
                                                          >
                                                            <small>
                                                              <small>Date of Birth:</small>
                                                            </small>
                                                          </label>
                                                          <div className="col-lg-9 socialInfolbl">
                                                            <span id="dob">
                                                              {this.state.candidate.dob ? (
                                                                <span className="itemName">
                                                                  {new Intl.DateTimeFormat('en-GB', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: '2-digit'
                                                                  }).format(this.state.dob)}
                                                                </span>
                                                              ) : (
                                                                  <span className="skillSetLocation">
                                                                    | click edit and update your date
                                                                    of birth |
                                                              </span>
                                                                )}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>

                                                </form>
                                              </div><br /><br />
                                              <div className="col-lg-12">
                                                {this.state.socialInfoEdit === true ? (

                                                  <button
                                                    className="update btn btn-md form-control btn-outline-success col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                    onClick={() => this.stopSocialInfoEditing()}
                                                  >
                                                    Save
                                                </button>
                                                ) : (
                                                    <div />
                                                  )}
                                              </div>
                                            </div>
                                          </div>

                                        </div>
                                      </div>
                                      <div className="col-lg-12 chip TabNav">
                                        <ul className="nav nav-tabs" role="tablist">
                                          <li className="nav-item">
                                            <a
                                              className="nav-link active profileDetailsTabLink"
                                              id="workExperience-tab"
                                              data-toggle="tab"
                                              href="#workExperience"
                                              role="tab"
                                              aria-controls="workExperience"
                                              aria-selected="true"
                                            >
                                              Experience
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                            <a
                                              className="nav-link profileDetailsTabLink"
                                              id="education-tab"
                                              data-toggle="tab"
                                              href="#education"
                                              role="tab"
                                              aria-controls="education"
                                              aria-selected="false"
                                            >
                                              Education
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                            <a
                                              className="nav-link profileDetailsTabLink"
                                              id="project-tab"
                                              data-toggle="tab"
                                              href="#project"
                                              role="tab"
                                              aria-controls="project"
                                              aria-selected="false"
                                            >
                                              Projects
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                            <a
                                              className="nav-link profileDetailsTabLink"
                                              id="certificate-tab"
                                              data-toggle="tab"
                                              href="#certificate"
                                              role="tab"
                                              aria-controls="certificate"
                                              aria-selected="false"
                                            >
                                              Certifications
                                            </a>
                                          </li>
                                        </ul>
                                        <div
                                          className="tab-content candidateDetailsTab"
                                          id="myTabContent"
                                        >
                                          <div
                                            className="tab-pane fade show active"
                                            id="workExperience"
                                            role="tabpanel"
                                            aria-labelledby="workExperience-tab"
                                          >
                                            <CareerHistory
                                              workexperience={this.state.workexperience}
                                              navigationVisible={false}
                                            />
                                          </div>
                                          <div
                                            className="tab-pane fade"
                                            id="education"
                                            role="tabpanel"
                                            aria-labelledby="education-tab"
                                          >
                                            <AcademicBackground
                                              education={this.state.education}
                                              navigationVisible={false}
                                            />
                                          </div>
                                          <div
                                            className="tab-pane fade"
                                            id="project"
                                            role="tabpanel"
                                            aria-labelledby="project-tab"
                                          >
                                            <ProjectExperience project={this.state.projects} navigationVisible={false}/>
                                          </div>
                                          <div
                                            className="tab-pane fade"
                                            id="certificate"
                                            role="tabpanel"
                                            aria-labelledby="certificate-tab"
                                          >
                                            <Certifications
                                              certificate={this.state.certificates}
                                              navigationVisible={false}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                  <div className="row">
                                    <Badges
                                      jobExperience={this.state.candidate.experience}
                                      certificateAchieved={this.state.certificates.length}
                                      internshipCompleted={
                                        this.state.candidate.noOfInternship
                                      }
                                    />
                                  </div>
                                  <div className="row">
                                    <Expertise expertise={this.state.expertise} />
                                  </div>
                                  <div className="row">
                                    <Referral referredBy={this.state.candidate.referredBy} referredTo={this.state.candidate.referredTo} />
                                  </div>
                                </div>
                              </div>
                              </div>
                              </div>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </div>*/}
      #endregion
            //#region OLD DESIGN
              {/* 
              <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                  <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                    <div className="row">

                      <div className="chipIntroVideo col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <h3 className="introVideoTitle">
                              One Minute Intro Video
                              </h3>
                          </div>
                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                            <div className="btn-group">
                              <div className="btn">
                                {this.state.introVideoEdit === true ? (
                                  <span
                                    className="update btn btn-sm btn-outline-success"
                                    onClick={() => this.stopintroVideoEditing()}
                                  >
                                    <small>Save</small>
                                  </span>
                                ) : (
                                    <span
                                      className="edit btn btn-sm btn-outline-info"
                                      onClick={() =>
                                        this.startintroVideoEditing()
                                      }
                                    >
                                      <small>Edit Video</small>
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                        {this.state.introVideoEdit ? (
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <input
                              type="file"
                              accept="video/*"
                              className="introVideoUploadControl"
                              name="newIntroVideo"
                              onChange={e => {
                                this.handleNewIntroVideoUpload(e);
                              }}
                            />
                            <br />
                            <ProgressBar
                              className="progressBar"
                              animated
                              now={this.state.progress}
                            />
                          </div>
                        ) : null}
                        </div>
                        <div className="row">
                          {this.state.candidate.video ? (
                            <video
                              className="introVideo col-lg-12 col-md-12 col-sm-12 col-xs-12"
                              controls
                              controlsList="nodownload"
                            >
                              <source
                                src={this.state.candidate.video}
                                // src="https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/IntroVideo%2Fp4MA6hSXC7SBQAF3msRA2QnaVjq2.mp4?alt=media&token=fff79396-c4de-402b-ab29-9b60ae652e2e"
                                type="video/mp4"
                              />
                              Your browser does not support HTML5 video.
                              </video>
                          ) : (
                                <div className="introVideoBlank col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <span className="introVideoUploadInstruction"><small>
                                    Please click on "Edit video" option above and
                                    upload your introduction video.
                                  <br />
                                    Tips:
                                  <br />1. Video should be in Landscape
                                  <br />2. It should be made in good lighting.
                                  <br />3. It is only a 1 minute video
                                  <br />4. Should be shot through a good camera, can be a phone camera as long as the quality is clear.
                                  <br />5. First/Last greeting in Japanese gives better impression to the companies.
                                  <br />6. Mention why you would like to work in Japan.
                                  <br />7. Good Smile
                                  <br />8. Good Volume of your speak</small><br /><br />
                                  <br />Here is an introduction video guideline for a reference
                                    <div className="btn btn-sm btn-outline-info" 
                                      onClick={()=>this.renderInstructionVideo()}
                                      >
                                      <span>Instruction Video</span>
                                    </div>
                                  </span><br />
                                  
                                <Modal show={this.state.showInstructionVideo} onHide={this.stopRenderInstructionVideo}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>Instruction Video</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                  {this.state.instructionVideo.length>0?
                                      <video className="introVideo" poster={preview} controls controlsList="nodownload">
                                      <source
                                        // src="https://firebasestorage.googleapis.com/v0/b/onetro-company.appspot.com/o/IntroVideo%2FIntroVideo_Instruction.mp4?alt=media&token=25c553a4-7bde-49c9-8163-d55d1eb16e1b"
                                        src={this.state.instructionVideo}
                                        type="video/mp4"
                                      />
                                      Your browser does not support HTML5 video.
                                    </video>:
                                    <div></div>
                                    }
                                  </Modal.Body>
                                  
                                </Modal>

                                </div>
                            )}
                        </div>
                      </div>
                      <div className="chip col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            {this.state.candidate.active ? (
                              <div className="row">
                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">

                                  <div className="ring-container">
                                    <div className="ringring" />
                                    <div className="circle" />
                                  </div>
                                </div>
                                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">

                                  <span className="txtLive">
                                    Your profile is live and visible to
                                    recruiters.
                                    </span>
                                </div>
                              </div>
                            ) : (
                                <div className="row">
                                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">

                                      <div className="ring-container">
                                        <div className="ringringOffLine" />
                                        <div className="circleOffLine" />
                                      </div>
                                    </div>         
                                    <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">

                                    <span className="txtLive">
                                      Your profile is not Live and pending for
                                      approval.
                                    </span>
                                    <span className="help-tip">
                                    <p>
                                    {this.state.candidate.profileOfflineNote?this.state.candidate.profileOfflineNote.split(',')
                                    .map((item:any,j:any)=>{
                                          return <span className="offlineNoteSpan" key={j}>{item}</span>
                                    }):<span></span>}</p>
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                            <div className="btn-group">
                              <div className="btn">
                                {this.state.socialInfoEdit === true ? (
                                  
                                  <span
                                    className="update btn btn-sm btn-outline-success"
                                    onClick={() => this.stopSocialInfoEditing()}
                                  >
                                    <small>Save</small>
                                  </span>
                                ) : (
                                   
                                    <span
                                      className="edit btn btn-sm btn-outline-info"
                                      onClick={() =>
                                        this.startSocialInfoEditing()
                                      }
                                    >
                                      <small>Edit Bio</small>
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                          {this.state.socialInfoEdit ? (
                            <div className="row">
                              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <small>
                                  <strong>Profile Picture</strong>
                                </small>
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                name="newProfilePic"
                                className="introVideoUploadControl col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                onChange={e => {
                                  this.handleNewProfilePicUpload(e);
                                }}
                              />
                              <ProgressBar
                                className="progressBar"
                                animated
                                now={this.state.progress}
                              />
                              <br />
                            </div>
                          ) : (
                              <div />
                            )}
                        <div className="row">
                          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                             <div className="row">

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgbox text-center">
                              <img
                                src={
                                  this.state.candidate.img ||
                                  "https://firebasestorage.googleapis.com/v0/b/onetrowebapiservice.appspot.com/o/ProfilePicture%2Favatar_man.png?alt=media&token=20f9c874-c323-4f33-8080-4ca8c97157e3"
                                }
                                alt="Person"
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 badge text-center">
                            <div className="row">
                              <div className="socialInfoStarlbl col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                <span>Stars </span>
                              
                              <span className="socialInfocount">{this.state.candidate.starsEarned}</span>
                              </div>
                            </div>
                            </div>
                          </div>
                          </div>
                          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-left">
                                {this.state.socialInfoEdit ? (
                                  <div>
                                    <label>
                                      <small>
                                        <strong>Name</strong>
                                      </small>
                                    </label>
                                    <input
                                      type="text"
                                      onChange={e => this.handleObjectChange(e)}
                                      className="form-control"
                                      name="name"
                                      id="name"
                                      placeholder="Example: John Doe"
                                      value={this.state.candidate.name}
                                    />
                                  </div>
                                ) : (
                                    <h5>{this.state.candidate.name}</h5>
                                  )}
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                                {this.state.socialInfoEdit ? (
                                  <div>
                                    <label>
                                      <small>
                                        <strong>Place</strong>
                                      </small>
                                    </label>
                                    
                                    <AutoSuggest
                                      handleChange={this.handleChangePlace}
                                      options={countryOptions}
                                      isMulti={false}
                                      creatable={false}
                                      defaultValue={
                                        this.state.candidate.place
                                          ? this.state.candidate.place
                                          : ""
                                      }
                                    />
                                  </div>
                                ) : (
                                    <span className="skillSetLocation">
                                      {this.state.candidate.place ? (
                                        <i className="material-icons skillSetLocation">
                                          place
                                        </i>
                                      ) : (
                                          <span>
                                            | click edit and update your place |
                                        </span>
                                        )}
                                      {this.state.candidate.place}
                                    </span>
                                  )}
                              </div>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                               <form className="form-horizontal">
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>Job Profile</strong>
                                        </small>
                                      </label>
                                      
                                      <AutoSuggest
                                        handleChange={
                                          this.handleChangeJobProfile
                                        }
                                        options={jobProfileOptions}
                                        isMulti={false}
                                        creatable={false}
                                        defaultValue={
                                          this.state.candidate.JobProfile
                                            ? this.state.candidate.JobProfile
                                            : ""
                                        }
                                      />
                                    </div>
                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="jbProfile"
                                        >
                                          <small>
                                            <small>Job Profile:</small>
                                          </small>
                                        </label>
                                        <div className="col-lg-9 socialInfolbl">
                                          <span id="jbProfile">
                                            {this.state.candidate.JobProfile ? (
                                              <span className="itemName">
                                                {this.state.candidate.JobProfile}
                                              </span>
                                            ) : (
                                                <span className="skillSetLocation">
                                                  | click edit and update your Job
                                                  Profile |
                                              </span>
                                              )}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>Current Company</strong>
                                        </small>
                                      </label>
                                      <input
                                        type="text"
                                        onChange={e =>
                                          this.handleObjectChange(e)
                                        }
                                        className="form-control"
                                        name="currentCompany"
                                        id="currentCompany"
                                        placeholder="Ex: Onetro,Willings"
                                        value={
                                          this.state.candidate.currentCompany
                                        }
                                      />
                                    </div>
                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="currCompany"
                                        >
                                          <small>
                                            <small>Company:</small>
                                          </small>
                                        </label>
                                        <div className="col-lg-9 socialInfolbl">
                                          <span id="currCompany">
                                            {this.state.candidate
                                              .currentCompany ? (
                                                <span className="itemName">
                                                  {
                                                    this.state.candidate
                                                      .currentCompany
                                                  }
                                                </span>
                                              ) : (
                                                <span className="skillSetLocation">
                                                  | click edit and update your
                                                  current company name |
                                              </span>
                                              )}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>Skills</strong>
                                        </small>
                                      </label>
                                      
                                      <AutoSuggest
                                        handleChange={this.handleChangeSkills}
                                        options={skillOptions}
                                        isMulti={true}
                                        creatable={true}
                                        defaultValue={
                                          this.state.candidate.skills
                                            ? this.state.candidate.skills
                                            : null
                                        }
                                      />
                                      {this.state.skillsInEditMode ? (
                                        <div className="alert-skill alert-danger">
                                          <small>
                                            <small>
                                              Skills should be "," separated.
                                              Example: JavaScript,HTML/CSS,C++
                                              </small>
                                          </small>
                                        </div>
                                      ) : null}
                                    </div>
                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="techSkill"
                                        >
                                          <small>
                                            <small>Technical Skills:</small>
                                          </small>
                                        </label>
                                        <div
                                          className="col-lg-9 socialInfolbl"
                                          id="techSkill"
                                        >
                                          {this.state.candidate.skills ? (
                                            this.state.candidate.skills.map(
                                              (skill: any) => (
                                                <p
                                                  key={skill.id}
                                                  className="skills"
                                                >
                                                  {skill.value
                                                    ? skill.value
                                                    : skill.name}
                                                </p>
                                              )
                                            )
                                          ) : (
                                              <span className="skillSetLocation">
                                                | click edit and update your
                                                technical Skills |
                                            </span>
                                            )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>Spoken Languages</strong>
                                        </small>
                                      </label>
                                     
                                      <AutoSuggest
                                        handleChange={
                                          this.handleChangeSpokenLanguage
                                        }
                                        options={languageOptions}
                                        isMulti={true}
                                        creatable={false}
                                        defaultValue={
                                          this.state.candidate.spokenLanguages
                                            ? this.state.candidate
                                              .spokenLanguages
                                            : null
                                        }
                                      />
                                      {this.state.spokenLanguageInEditMode ? (
                                        <div className="alert-skill alert-danger">
                                          <small>
                                            <small>
                                              Languages should be "," separated.
                                              Example: English,Japanese
                                              </small>
                                          </small>
                                        </div>
                                      ) : null}
                                    </div>
                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="lang"
                                        >
                                          <small>
                                            <small>Languages:</small>
                                          </small>
                                        </label>
                                        <div
                                          className="col-lg-9 socialInfolbl"
                                          id="lang"
                                        >
                                          {this.state.candidate
                                            .spokenLanguages ? (
                                              this.state.candidate.spokenLanguages.map(
                                                (language: any) => (
                                                  <p
                                                    key={language.id}
                                                    className="skills"
                                                  >
                                                    {language.value
                                                      ? language.value
                                                      : language.name}
                                                  </p>
                                                )
                                              )
                                            ) : (
                                              <span className="skillSetLocation">
                                                | click edit and update your other
                                                spoken languages |
                                            </span>
                                            )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>SkypeId</strong>
                                        </small>
                                      </label>
                                      <input
                                        type="text"
                                        onChange={e =>
                                          this.handleObjectChange(e)
                                        }
                                        className="form-control"
                                        name="skypeId"
                                        id="skypeId"
                                        placeholder="Skype Id"
                                        value={this.state.candidate.skypeId}
                                      />
                                    </div>
                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="currCompany"
                                        >
                                          <small>
                                            <small>SkypeId:</small>
                                          </small>
                                        </label>
                                        <div className="col-lg-9 socialInfolbl">
                                          <span id="currCompany">
                                            {this.state.candidate.skypeId ? (
                                              <span className="itemName">
                                                <a
                                                  href={
                                                    "skype:" +
                                                    this.state.candidate.skypeId
                                                  }
                                                >
                                                  {this.state.candidate.skypeId}
                                                </a>
                                              </span>
                                            ) : (
                                                <span className="skillSetLocation">
                                                  | click edit and update your
                                                  current skypeID |
                                              </span>
                                              )}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>E-Mail</strong>
                                        </small>
                                      </label>
                                      <input
                                        type="text"
                                        onChange={e =>
                                          this.handleObjectChange(e)
                                        }
                                        className="form-control"
                                        name="email"
                                        id="email"
                                        placeholder="Ex: example@onetro.com"
                                        value={this.state.candidate.email}
                                      />
                                    </div>
                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="currCompany"
                                        >
                                          <small>
                                            <small>Email:</small>
                                          </small>
                                        </label>
                                        <div className="col-lg-9 socialInfolbl">
                                          <span id="currCompany">
                                            {this.state.candidate.email ? (
                                              <span className="itemName">
                                                <a
                                                  href={
                                                    "mailto:" +
                                                    this.state.candidate.email
                                                  }
                                                >
                                                  {this.state.candidate.email}
                                                </a>
                                              </span>
                                            ) : (
                                                <span className="skillSetLocation">
                                                  | click edit and update your
                                                  current email id|
                                              </span>
                                              )}
                                          </span>
                                        </div>
                                      </div>

                                      // <a href="skype:" {...this.state.candidate.SkypeId}>{this.state.candidate.SkypeId}</a>
                                      // <i className="material-icons text-success icon-blue">video_call<h6>{this.state.candidate.SkypeId}</h6></i>
                                    )}
                                </div>
                                <div className="form-group text-left">
                                  {this.state.socialInfoEdit ? (
                                    <div>
                                      <label>
                                        <small>
                                          <strong>Date of Birth:</strong>
                                        </small>
                                      </label><br/>
                                      
                                        <DatePicker
                                          className="datePicker form-control"
                                          selected={this.state.dob}
                                          onChange={this.handleChangeDOB}
                                          dateFormat="d MMMM, yyyy"
                                          placeholderText="Click to select a date"
                                          showMonthDropdown
                                          showYearDropdown
                                        />
                                      </div>

                                  ) : (
                                      <div className="row">
                                        <label
                                          className="control-label col-lg-3 socialInfolbl"
                                          htmlFor="dob"
                                        >
                                          <small>
                                            <small>Date of Birth:</small>
                                          </small>
                                        </label>
                                        <div className="col-lg-9 socialInfolbl">
                                          <span id="dob">
                                            {this.state.candidate.dob ? (
                                              <span className="itemName">
                                                {new Intl.DateTimeFormat('en-GB', { 
                                                  year: 'numeric', 
                                                  month: 'long', 
                                                  day: '2-digit' 
                                                }).format(this.state.dob)}
                                              </span>
                                            ) : (
                                                <span className="skillSetLocation">
                                                  | click edit and update your date
                                                  of birth |
                                              </span>
                                              )}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                                
                              </form>
                              </div><br/><br/>
                              <div className="col-lg-12">
                              {this.state.socialInfoEdit === true ? (

                                <button
                                  className="update btn btn-md form-control btn-outline-success col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                  onClick={() => this.stopSocialInfoEditing()}
                                >
                                  Save
                                </button>
                              ) : (
                                <div/>
                                )}
                          </div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                      <div className="col-lg-12 chip TabNav">
                        <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item">
                            <a
                              className="nav-link active profileDetailsTabLink"
                              id="workExperience-tab"
                              data-toggle="tab"
                              href="#workExperience"
                              role="tab"
                              aria-controls="workExperience"
                              aria-selected="true"
                            >
                              Experience
                              </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link profileDetailsTabLink"
                              id="education-tab"
                              data-toggle="tab"
                              href="#education"
                              role="tab"
                              aria-controls="education"
                              aria-selected="false"
                            >
                              Education
                              </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link profileDetailsTabLink"
                              id="project-tab"
                              data-toggle="tab"
                              href="#project"
                              role="tab"
                              aria-controls="project"
                              aria-selected="false"
                            >
                              Projects
                              </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link profileDetailsTabLink"
                              id="certificate-tab"
                              data-toggle="tab"
                              href="#certificate"
                              role="tab"
                              aria-controls="certificate"
                              aria-selected="false"
                            >
                              Certifications
                            </a>
                          </li>
                        </ul>
                        <div
                          className="tab-content candidateDetailsTab"
                          id="myTabContent"
                        >
                          <div
                            className="tab-pane fade show active"
                            id="workExperience"
                            role="tabpanel"
                            aria-labelledby="workExperience-tab"
                          >
                            <CareerHistory
                              workexperience={this.state.workexperience}
                            />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="education"
                            role="tabpanel"
                            aria-labelledby="education-tab"
                          >
                            <AcademicBackground
                              education={this.state.education}
                            />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="project"
                            role="tabpanel"
                            aria-labelledby="project-tab"
                          >
                            <ProjectExperience project={this.state.projects} />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="certificate"
                            role="tabpanel"
                            aria-labelledby="certificate-tab"
                          >
                            <Certifications
                              certificate={this.state.certificates}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                    <div className="row">
                      <Badges
                        jobExperience={this.state.candidate.experience}
                        certificateAchieved={this.state.certificates.length}
                        internshipCompleted={
                          this.state.candidate.noOfInternship
                        }
                      />
                    </div>
                    <div className="row">
                      <Expertise expertise={this.state.expertise} />
                    </div>
                    <div className="row">
                      <Referral referredBy={this.state.candidate.referredBy} referredTo={this.state.candidate.referredTo} />
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-lg-1 hidden-md hidden-sm hidden-xs" />
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <Footer />
        </div>  */}
        #endregion
          </Col>
            {/* <Col xs={0} sm={1} md={4} lg={6}></Col> */}

        </Row>
        </Layout>

        </div>
    );
  }
}

export default HomePage;
