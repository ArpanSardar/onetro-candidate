import React, { Component } from "react";
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
    Upload, Modal,Spin,
    DatePicker, Popover,
    Form, Input,Alert,Card,
    Typography, Row, Col,
    Affix, Layout, Badge, Divider,
    notification, Icon, Progress,
    Steps, Button, message
} from 'antd';
const { Title, Text } = Typography;
const Option = Select.Option;

const ButtonGroup = Button.Group;
import 'antd/dist/antd.css';
import './style.css';

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


class Skillset extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            candidate: {},
            skillInfoEdit: true,
            loading: true,
            saveInProgress: false,
            errSkill: { status: '', msg: '' },
            errSpokenLanguage: { status: '', msg: '' },

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSpokenLanguageChange = this.handleSpokenLanguageChange.bind(this);
        this.handleTechnicalSkillChange = this.handleTechnicalSkillChange.bind(this);
        this.handleExpertiseChange=this.handleExpertiseChange.bind(this);
    }

    handleTechnicalSkillChange = (value: any) => {
        if (value.length === 0) {
            this.setState({
                errSkill: { status: 'error', msg: 'Please enter your technical skills.' }
            });
        }
        else {
            this.setState({
                errSkill: { status: '', msg: '' }
            });
        }
        this.setState({
            candidate: { ...this.state.candidate, skills: value }
        });
    }
    handleSpokenLanguageChange= (value: any) => {
        if (value.length === 0) {
            this.setState({
                errSpokenLanguage: { status: 'error', msg: 'Please enter your spoken language.' }
            });
        }
        else {
            this.setState({
                errSpokenLanguage: { status: '', msg: '' }
            });
        }
        this.setState({
            candidate: { ...this.state.candidate, spokenLanguages: value}
        });
    }
    handleExpertiseChange=(value:any)=>{
        this.setState({
            candidate: { ...this.state.candidate, expertise: value}
        });
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
    render() {
            return (
                <React.Fragment>

                {this.state.loading?
                <Card title={<Title level={4} style={{ marginBottom: 0 }}>Your Skillsets</Title>}>
                    <Spin tip='Loading...'>
                        <Alert
                        message="Please wait !!"
                        description="System is gathering information from the server."
                        type="info"
                        />
                    </Spin>
                </Card>
                :
                <Card title={<Title level={4} style={{ marginBottom: 0 }}>Your Skillsets</Title>}
                extra={
                    <Button type="dashed" style={{ marginTop: 10 }} onClick={this.handleEdit} disabled={!this.state.skillInfoEdit}>Edit</Button>
                    }
                >

                <React.Fragment>
                {/* <Row type="flex" justify="space-around" align="bottom">
                    <Col span={20}>
                        <Title level={4} style={{ marginBottom: 0 }}>Your Skillsets</Title>
                    </Col>
                    <Col span={4}>
                        <Button type="dashed" style={{ marginTop: 10 }} onClick={this.handleEdit} disabled={!this.state.skillInfoEdit}>Edit</Button>
                    </Col>

                </Row> */}
                <Row>

<ButtonGroup style={{ width: '100%' }}>
    <Button style={{ width: '50%' }} type="default" onClick={() => this.props.prevStep()}>
        <Icon type="left" />
        Go back
    </Button>
    <Button style={{ width: '50%' }} type="default" onClick={() => this.validateSkillInfoTab()}>
        Go forward
        <Icon type="right" />
    </Button>
</ButtonGroup>
</Row>
                <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                <Form layout={'vertical'} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label={<span className={!this.state.skillInfoEdit?'required':''}>Technical Skills</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errSkill.status}
                        help={this.state.errSkill.msg}
                    >
                        <Select mode="tags"
                            disabled={this.state.skillInfoEdit}
                            labelInValue={true}
                            style={{ width: '100%' }}
                            placeholder="Example: HTML CSS"
                            id='skills'
                            value={this.state.candidate.skills}
                            onChange={this.handleTechnicalSkillChange}>
                            {skillOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.skillInfoEdit?'required':''}>Spoken Languages</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errSpokenLanguage.status}
                        help={this.state.errSpokenLanguage.msg}
                    >
                        <Select mode="tags"
                            maxTagCount={5}
                            disabled={this.state.skillInfoEdit}
                            labelInValue={true}
                            style={{ width: '100%' }}
                            placeholder="Example: English Japanese"
                            id='spokenLanguages'
                            value={this.state.candidate.spokenLanguages}
                            onChange={this.handleSpokenLanguageChange}>
                            {languageOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Your Expertisation"
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                    >
                         <Select mode="tags"
                            maxTagCount={5}
                            disabled={this.state.skillInfoEdit}
                            // labelInValue={true}
                            style={{ width: '100%' }}
                            placeholder="Example: Client Management"
                            id='expertise'
                            value={this.state.candidate.expertise}
                            onChange={this.handleExpertiseChange}
                            >
                            {expertiseOptions}
                        </Select>
                    </Form.Item>
                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                    <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                        <Button
                            loading={this.state.saveInProgress}
                            type="primary"
                            disabled={this.state.skillInfoEdit}
                            htmlType="submit"
                            block>Save</Button>
                    </Form.Item>
                </Form>
                <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                
            </React.Fragment>        
                </Card>

                }
           </React.Fragment>        
            )
        }
}


export default Skillset;

