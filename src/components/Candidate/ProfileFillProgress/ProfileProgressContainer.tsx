import React, { Component } from "react";
import {
    firebaseService,
    candidateAuth,
    candidateDatabase,
    candidateStorage,
    companyDatabase,
    companyStorage
} from "../../../services/FirebaseCandidateService";
import {
    Typography, Row, Col,
    Affix, Layout, Badge, Divider,
    notification, Icon, Progress,
    Steps, Button, message
} from 'antd';
const { Title } = Typography;

const { Header, Footer, Sider, Content } = Layout;
const ButtonGroup = Button.Group;
import 'antd/dist/antd.css';
import { ProgressBar, Modal, Navbar, Nav } from "react-bootstrap";
import SocialInfo from './SocialInfo';
import Skillset from './Skillset';
import WorkExperience from './WorkExperience';
import EducationInfo from './EducationInfo';
import ProjectDetails from './ProjectDetails';
import CertificateDetails from './CertificateDetails';
import IntroductionVideo from './IntroVideo';
import ProfileComplete from './ProfileComplete';
interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
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

class ProfileProgressContainer extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            candidate: {},
            currentTab: 0,
            loading: false,
            tabProgress: 0
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        const candidateID = sessionStorage.getItem("candidateID");
        if (candidateID != null) {
            companyDatabase
                .collection("CandidateInfo")
                .doc(candidateID)
                .get()
                .then((doc: any) => {
                    var data = doc.data();
                    var tabNo = 0;
                    if (data.video)
                        tabNo = 7;
                    else if (data.certificate.length > 0)
                        tabNo = 6;
                    else if (data.project.length > 0)
                        tabNo = 5;
                    else if (data.education.length > 0)
                        tabNo = 4;
                    else if (data.workExperience.length > 0)
                        tabNo = 3;
                    else if (data.skills.length > 0)
                        tabNo = 2;
                    else if (data.dob)
                        tabNo = 1;
                    else
                        tabNo = 0;
                    this.setState({
                        candidate: data,
                        currentTab: tabNo,
                        tabProgress: Math.round((tabNo / 7) * 100)
                    });
                })
                .then(() => {
                    this.setState({ loading: false });
                });
        }
    }

    nextStep = () => {
        const { currentTab, tabProgress } = this.state;
        this.setState({
            currentTab: currentTab + 1
        });
        if (tabProgress < Math.round(((currentTab + 1) / 7) * 100)) {
            this.setState({
                tabProgress: Math.round(((currentTab + 1) / 7) * 100)
            });
        }
    }
    prevStep = () => {
        const { currentTab } = this.state;
        this.setState({
            currentTab: currentTab - 1
        });
    }

    render() {
        const { currentTab } = this.state;
        return (
            <Row>
                <Col xs={0} sm={0} md={6} lg={6}>
                <Steps progressDot current={this.state.currentTab} direction="vertical" style={{marginTop:90, textAlign:'left',marginLeft:25}}>
                    <Step title="Step 1" description="About you" />
                    <Step title="Step 2" description="Skillset" />
                    <Step title="Step 3" description="Education" />
                    <Step title="Step 4" description="WorkExperience" />
                    <Step title="Step 5" description="Projects" />
                    <Step title="Step 6" description="Certificates" />
                    <Step title="Step 7" description="IntroductionVideo" />
                    <Step title="Final" description="Complete" />
                </Steps>
                </Col>
                <Col xs={24} sm={24} md={18} lg={12}>
                    <Row>
                        {this.state.candidate.currentTab===7 ?
                            <Title level={2}>Congratulations !!</Title>
                            : <Title level={2}>Complete your profile</Title>
                        }
                    </Row>
                    <Row>
                        {this.state.loading ? null :
                            <ProgressBar now={this.state.tabProgress} label={`${this.state.tabProgress} %`} />
                        }
                    </Row>
                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                    <Row>
                        {
                            (() => {
                                switch (currentTab) {
                                    case 0:
                                        return (<SocialInfo nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 1:
                                        return (<Skillset nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 2:
                                        return (<EducationInfo nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 3:
                                        return (<WorkExperience nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 4:
                                        return (<ProjectDetails nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 5:
                                        return (<CertificateDetails nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 6:
                                        return (<IntroductionVideo nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    case 7:
                                        return (<ProfileComplete nextStep={this.nextStep} prevStep={this.prevStep} />);
                                    default:
                                        return null;
                                }
                            }
                            )()
                        }
                    </Row>

                    {/* <Affix offsetBottom={20}> */}
                    {/* <ButtonGroup style={{ width: '100%' }}>
                        <Button style={{ width: '50%' }} type="default">
                            <Icon type="left" />
                            Go back
                        </Button>
                        <Button style={{ width: '50%'}} type="default">
                            Go forward
                            <Icon type="right" />
                        </Button>
                    </ButtonGroup>     */}
                    {/* </Affix> */}

                </Col>
                <Col xs={0} sm={0} md={0} lg={6}></Col>
            </Row>

        )
    }
}
export default ProfileProgressContainer;

