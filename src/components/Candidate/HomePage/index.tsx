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
            </Col>
            {/* <Col xs={0} sm={1} md={4} lg={6}></Col> */}

        </Row>
        </Layout>

        </div>
    );
  }
}

export default HomePage;
