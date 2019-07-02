import React, { Component } from "react";
import preview from "../../../assets/images/introPreview.png"

import {
    firebaseService,
    candidateAuth,
    candidateDatabase,
    candidateStorage,
    companyDatabase,
    companyStorage
} from "../../../services/FirebaseCandidateService";
import imgloader from '../../../assets/images/imgloader.gif'
import {
    countries,
    expertisationOptions,
    workExperienceOptions,
    skillsets,
    languages
} from "../HomePage/AutoComplete/data";
import {
    AutoComplete, Select,
    Upload, Card,
    DatePicker, Popover,
    Form, Input, Alert, Spin,
    Typography, Row, Col, Modal,
    Affix, Layout, Badge, Divider,
    notification, Icon, Progress,
    Steps, Button, message
} from 'antd';
const { Title, Text } = Typography;
const Option = Select.Option;

const ButtonGroup = Button.Group;
import 'antd/dist/antd.css';
import './style.css';
// import Modal from "react-modal";


const skillOptions: any = [];
skillsets.map((skill: any) => {
    skillOptions.push(<Option key={skill.key}>{skill.label}</Option>);
});
const languageOptions: any = [];
languages.map((language: any) => {
    languageOptions.push(<Option key={language.key}>{language.label}</Option>);
});
const expertiseOptions: any = [];
expertisationOptions.map((expertise: any) => {
    expertiseOptions.push(<Option key={expertise.key}>{expertise.label}</Option>);
});

interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
    [key: string]: any;
}


class IntroductionVideo extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            candidate: {},
            loading: true,
            saveInProgress: false,
            fileList: [],
            instructionVideo: "",
            showInstructionVideo: false,
            progress: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        const candidateID = sessionStorage.getItem("candidateID");
        if (candidateID != null) {
            companyDatabase
                .collection("CandidateInfo")
                .doc(candidateID)
                .get()
                .then((doc: any) => {
                    var data = doc.data();
                    this.setState({
                        candidate: data,
                    });
                })
                .then(() => {
                    this.setState({ loading: false });
                });
        }
    }
    validateRequiredFields = () => {
        let flag = true;
        this.setState({
            errSkill: { status: '', msg: '' },
            errSpokenLanguage: { status: '', msg: '' }
        });
        if (this.state.candidate.skills.length === 0) {
            this.setState({
                errSkill: { status: 'error', msg: 'Please enter your technical skills.' }
            });
            flag = false;
        }
        if (this.state.candidate.spokenLanguages.length === 0) {
            this.setState({
                errSpokenLanguage: { status: 'error', msg: 'Please enter your spoken languages.' }
            });
            flag = false;
        }

        return flag;
    }
    handleSubmit = (e: any) => {
        e.preventDefault();
        if (this.validateRequiredFields()) {
            this.setState({ saveInProgress: true });
            companyDatabase
                .collection("CandidateInfo")
                .doc(this.state.candidate.id)
                .update({
                    skills: this.state.candidate.skills,
                    spokenLanguages: this.state.candidate.spokenLanguages,
                    expertise: this.state.candidate.expertise
                })
                .then(() => {
                    this.setState({
                        skillInfoEdit: true,
                        saveInProgress: false,
                        progress: 0
                    });
                    message.success('Data updated successfully');

                })
                .catch(function (error: any) {
                    message.error('Error in updating data !');
                });
        }
        else {
            message.error('Error in updating data !');
            this.setState({ skillInfoEdit: false });
        }

    };
    handleEdit = () => {
        this.setState({ skillInfoEdit: false });
    };
    openNotificationWithIcon = () => {
        notification.open({
            message: 'Insufficient Information',
            description:
                'Please update missing information in this page to proceed in next page.',
            duration: 0,
            icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

        });
    };
    validateSkillInfoTab = () => {
        let flagError = false;
        if (!this.validateRequiredFields())
            flagError = true;

        if (flagError) {
            this.openNotificationWithIcon();
            this.setState({ skillInfoEdit: false });
        }
        else {
            const editFlag = this.state.skillInfoEdit;
            if (!editFlag) {
                notification.open({
                    message: 'Save your information',
                    description:
                        'Please save your data before proceed to next step.',
                    duration: 0,
                    icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

                });
            }
            else {
                this.props.nextStep();
            }
        }
    }

    startintroVideoEditing = () => {
        this.setState({ introVideoEdit: true });
    };
    stopintroVideoEditing = () => {
        if (this.state.fileList.length > 0) {
            companyStorage
                .ref()
                .child(`IntroVideo/${this.state.candidate.id}.mp4`)
                .put(this.state.fileList[0])
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
                                            fileList: [],
                                            progress: 0
                                        });
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
    validateIntroVideoInfoTab = () => {
        if (this.state.candidate.video) {
            if (this.state.introVideoEdit) {
                notification.open({
                    message: 'Save your information',
                    description:
                        'Please save your data before proceed to next step.',
                    duration: 0,
                    icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

                });
            }
            else {
                this.props.nextStep();
            }
        }
        else {

            notification.open({
                message: 'Missing information',
                description:
                    'Please upload your Introduction video before proceed to next step.',
                duration: 0,
                icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

            });
        }
    }

    render() {
        const { saveInProgress, fileList } = this.state;

        const events = {
            onRemove: (file: any) => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file: any) => {

                var arr: any[] = [];
                arr.push(file);

                this.setState({
                    fileList: arr,
                });
                return false;
            },
            fileList,
        };
        return (
            <React.Fragment>
                {this.state.loading ?
                    <Card title={<Title level={4} style={{ marginBottom: 0 }}>Introduction Video</Title>}>
                        <Spin tip='Loading...'>
                            <Alert
                                message="Please wait !!"
                                description="System is gathering information from the server."
                                type="info"
                            />
                        </Spin>
                    </Card>
                    :

                    <Card title={<Title level={4} style={{ marginBottom: 0 }}>Introduction Video</Title>}
                        extra={this.state.introVideoEdit === true ?
                            <Button type="primary" style={{ marginTop: 10 }}
                                onClick={() => this.stopintroVideoEditing()}
                            >Save</Button>
                            :
                            <Button type="dashed" style={{ marginTop: 10 }}
                                onClick={() => this.startintroVideoEditing()}
                            >Edit</Button>

                        }
                    >
                        <Row>
                            <ButtonGroup style={{ width: '100%' }}>
                                <Button style={{ width: '50%' }} type="default" onClick={() => this.props.prevStep()}>
                                    <Icon type="left" />
                                    Go back
                </Button>
                                <Button style={{ width: '50%' }} type="default" onClick={() => this.validateIntroVideoInfoTab()}>
                                    Go forward
                    <Icon type="right" />
                                </Button>
                            </ButtonGroup>
                        </Row>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                        <Row>
                            <Row style={{ textAlign: 'left' }}>
                                {this.state.introVideoEdit ?
                                    <div>
                                        <Upload {...events}>
                                            <Button>
                                                <Icon type="upload" />
                                                Select File
                                            </Button>
                                        </Upload>
                                    </div> : null}

                            </Row>
                            <Row>
                                {this.state.introVideoEdit ?
                                    <Progress percent={this.state.progress} size="small" status="active" />
                                    : null}
                            </Row>
                            <Row>
                                {this.state.candidate.video ? (
                                    <video
                                        className="introVideo"
                                        controls
                                        controlsList="nodownload"
                                    >
                                        <source
                                            src={this.state.candidate.video}
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

                                            <Modal
                                                title="Instruction Video"
                                                visible={this.state.showInstructionVideo}
                                                onOk={this.stopRenderInstructionVideo}
                                                onCancel={this.stopRenderInstructionVideo}
                                            >
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
                                            </Modal>
                                        </div>

                                    )}
                            </Row>
                        </Row>


                    </Card>
                }
            </React.Fragment>
        )
    }

}



export default IntroductionVideo;

