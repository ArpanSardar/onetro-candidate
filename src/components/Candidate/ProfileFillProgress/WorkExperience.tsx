import React, { Component } from "react";
import swal from "sweetalert";

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
    Upload, Modal, Card, Alert,
    DatePicker, Popover, Tooltip,
    Form, Input, Popconfirm, Spin,
    Typography, Row, Col, Checkbox,
    Affix, Layout, Badge, Divider,
    notification, Icon, Progress,
    Steps, Button, message, Empty
} from 'antd';
const { Title, Text } = Typography;
const { TextArea } = Input;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;
import 'antd/dist/antd.css';
import './style.css';
import moment from 'moment';


const skillOptions: any = [];
skillsets.map((skill: any) => {
    skillOptions.push(<Option key={skill.key}>{skill.label}</Option>);
});

interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
    [key: string]: any;
}


class WorkExperience extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            workexperience: [],
            workExperienceEditIDX: -1,
            newWorkExperienceFields: {},
            title: "",
            company: "",
            schedule: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
            skillsUsed: [],
            loading: true,
            saveInProgress: false,
            errCompany: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errDuration: { status: '', msg: '' },
            errTitle: { status: '', msg: '' },
            errSkill: { status: '', msg: '' },
            editErrCompany: { status: '', msg: '' },
            editErrPlace: { status: '', msg: '' },
            editErrDuration: { status: '', msg: '' },
            editErrTitle: { status: '', msg: '' },
            showModal: false
        };
        this.handleWorkExperienceChange = this.handleWorkExperienceChange.bind(this);
        this.handleNewWorkExperienceChange = this.handleNewWorkExperienceChange.bind(this);

    }

    startWorkExperienceEditing = (index: any) => {
        this.setState({ workExperienceEditIDX: index });
    };
    stopWorkExperienceEditing = (index: any) => {
        if (this.validateRequiredFields()) {
            this.setState({ saveInProgress: true });

            var candidateId = sessionStorage.getItem("candidateID");
            if (candidateId != null) {
                companyDatabase
                    .collection("CandidateInfo")
                    .doc(candidateId)
                    .update({
                        workExperience: this.state.workexperience
                    })
                    .then(() => {
                        message.success('Data updated successfully');
                        this.setState({
                            workExperienceEditIDX: -1,
                            saveInProgress: false,
                            editErrCompany: { status: '', msg: '' },
                            editErrPlace: { status: '', msg: '' },
                            editErrDuration: { status: '', msg: '' },
                            editErrTitle: { status: '', msg: '' },
                            // errSkill: { status: '', msg: '' }
                        });
                    })
                    .catch(function (error: any) {
                        message.error('Error in data update !');
                    });
            } else {
                message.error('Error in updating information. Please login again and try.');
            }
        }
        else {
            message.error('Please provide required information !');
        }
    }
    handleDeleteWorkExperience = (index: any) => {
        this.setState({
            workexperience: this.state.workexperience.filter(
                (work: any, workindex: any) => workindex != index
            )
        });

        var candidateId = sessionStorage.getItem("candidateID");
        if (candidateId != null) {
            companyDatabase
                .collection("CandidateInfo")
                .doc(candidateId)
                .update({
                    workExperience: this.state.workexperience.filter(
                        (work: any, i: any) => i != index
                    )
                })
                .then(() => {
                    message.warning('Data deleted !');
                })
                .catch(function (error) {
                    message.error('Error while removing data !');
                });
        }
    };
    handleWorkExperienceChange = (e: any, propName: any, index: any) => {
        if (propName == "startDate" || propName == "endDate") {
            const { value } = e.target;
            if (value.length > 1) {
                this.setState({
                    editErrDuration: { status: '', msg: '' }
                });
            }
            else {
                this.setState({
                    editErrDuration: { status: 'error', msg: 'Please enter Work duration in this company.' }
                });
            }
            this.setState({
                workexperience: this.state.workexperience.map((item: any, j: any) =>
                    j === index ? {
                        ...item,
                        startDate: value[0] ? value[0].format('DD/MM/YYYY') : null,
                        endDate: value[1] ? value[1].format('DD/MM/YYYY') : null
                    } : item
                )
            });
        }
        else {
            const { value } = e.target;
            if (!value) {
                if (propName === 'company') {
                    this.setState({
                        editErrCompany: { status: 'error', msg: 'Please enter Company Name.' }
                    });
                }
                if (propName === 'place') {
                    this.setState({
                        editErrPlace: { status: 'error', msg: 'Please enter Work location.' }
                    });
                }
                if (propName === 'title') {
                    this.setState({
                        editErrTitle: { status: 'error', msg: 'Please enter Work title.' }
                    });
                }
            }
            else {
                if (propName === 'company') {
                    this.setState({
                        editErrCompany: { status: '', msg: '' }
                    });
                }
                if (propName === 'place') {
                    this.setState({
                        editErrPlace: { status: '', msg: '' }
                    });
                }
                if (propName === 'title') {
                    this.setState({
                        editErrTitle: { status: '', msg: '' }
                    });
                }
            }
            this.setState({
                workexperience: this.state.workexperience.map((item: any, j: any) =>
                    j === index ? { ...item, [propName]: value } : item
                )
            });
        }
    }
    handleNewWorkExperienceChange = (e: any, propName: any) => {
        //This function is the onChange event of all the fields in new WorkExperience
        if (propName == "newStartDate" || propName == "newEndDate") {
            const { value } = e.target;
            // console.log('value :',value)
            if (value.length > 1) {
                this.setState({
                    errDuration: { status: '', msg: '' }
                });
            }
            else {
                this.setState({
                    errDuration: { status: 'error', msg: 'Please enter Work duration in this company.' }
                });
            }

            this.setState({
                newWorkExperienceFields: {
                    ...this.state.newWorkExperienceFields,
                    startDate: value[0] ? value[0].format('DD/MM/YYYY') : null,
                    endDate: value[1] ? value[1].format('DD/MM/YYYY') : null,
                }
            });
            this.setState({
                newStartDate: value[0] ? value[0].format('DD/MM/YYYY') : null,
                newEndDate: value[1] ? value[1].format('DD/MM/YYYY') : null,
            });
        }
        else {
            const { value } = e.target;
            if (!value) {
                if (propName === 'company') {
                    this.setState({
                        errCompany: { status: 'error', msg: 'Please enter Company Name.' }
                    });
                }
                if (propName === 'place') {
                    this.setState({
                        errPlace: { status: 'error', msg: 'Please enter Work location.' }
                    });
                }
                if (propName === 'title') {
                    this.setState({
                        errTitle: { status: 'error', msg: 'Please enter Work title.' }
                    });
                }
            }
            else {
                if (propName === 'company') {
                    this.setState({
                        errCompany: { status: '', msg: '' }
                    });
                }
                if (propName === 'place') {
                    this.setState({
                        errPlace: { status: '', msg: '' }
                    });
                }
                if (propName === 'title') {
                    this.setState({
                        errTitle: { status: '', msg: '' }
                    });
                }
            }
            this.onNewWorkExperienceFieldChange({ [propName]: value });
            this.setState({
                [propName]: value
            });
        }
    };
    onNewWorkExperienceFieldChange = (updatedValue: any) => {
        //This function is to create the new WorkExperience object
        this.setState({
            newWorkExperienceFields: {
                ...this.state.newWorkExperienceFields,
                ...updatedValue
            }
        });
    };

    saveNewWorkExperience = (e: any) => {
        e.preventDefault();
        if (this.validateRequiredNewFields()) {
            this.setState({ saveInProgress: true });
            var newArray = this.state.workexperience.slice();
            newArray.push(this.state.newWorkExperienceFields);
            this.setState({
                workexperience: newArray
            });
            var candidateId = sessionStorage.getItem("candidateID");
            if (candidateId != null) {
                companyDatabase
                    .collection("CandidateInfo")
                    .doc(candidateId)
                    .update({ workExperience: newArray })
                    .then(() => {
                        this.setState({ saveInProgress: false, showModal: false });
                        message.success('Data added successfully');
                    })
                    .catch(function (error: any) {
                        message.error('Error while adding data !');
                    });
            }
            this.setState({
                title: "",
                company: "",
                schedule: "",
                place: "",
                description: "",
                newStartDate: null,
                newEndDate: null,
                skillsUsed: [],
                errCompany: { status: '', msg: '' },
                errPlace: { status: '', msg: '' },
                errDuration: { status: '', msg: '' },
                errTitle: { status: '', msg: '' },
                errSkill: { status: '', msg: '' }
            });
            this.onNewWorkExperienceFieldChange({
                title: "",
                company: "",
                schedule: "",
                place: "",
                description: "",
                newStartDate: null,
                newEndDate: null,
                skillsUsed: []
            });
        }
        else {
            message.error('Please provide required information !');
        }
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
                        workexperience: data.workExperience,
                    });
                })
                .then(() => {
                    this.setState({ loading: false });
                });
        }
    }
    validateRequiredNewFields = () => {
        let flag = true;
        this.setState({
            errCompany: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errTitle: { status: '', msg: '' },
            errDuration: { status: '', msg: '' }
        });

        if (!this.state.company) {
            this.setState({
                errCompany: { status: 'error', msg: 'Please enter Company name.' }
            });
            flag = false;
        }
        if (!this.state.place) {
            this.setState({
                errPlace: { status: 'error', msg: 'Please enter your Work location.' }
            });
            flag = false;
        }
        if (this.state.title.length === 0) {
            this.setState({
                errTitle: { status: 'error', msg: 'Please enter your Work title.' }
            });
            flag = false;
        }
        if (!this.state.newStartDate) {
            this.setState({
                errDuration: { status: 'error', msg: 'Please enter Work duration in this company.' }
            });
            flag = false;
        }
        return flag;
    }
    validateRequiredFields = () => {
        let flag = true;
        const arr = this.state.workexperience;
        this.setState({
            editErrCompany: { status: '', msg: '' },
            editErrPlace: { status: '', msg: '' },
            editErrTitle: { status: '', msg: '' },
            editErrDuration: { status: '', msg: '' }
        });
        if (!arr[this.state.workExperienceEditIDX].company) {
            this.setState({
                editErrCompany: { status: 'error', msg: 'Please enter Company name.' }
            });
            flag = false;
        }
        if (!arr[this.state.workExperienceEditIDX].place) {
            this.setState({
                editErrPlace: { status: 'error', msg: 'Please enter your Work location.' }
            });
            flag = false;
        }
        if (arr[this.state.workExperienceEditIDX].title.length === 0) {
            this.setState({
                editErrTitle: { status: 'error', msg: 'Please enter your Work title.' }
            });
            flag = false;
        }
        if (!arr[this.state.workExperienceEditIDX].startDate) {
            this.setState({
                editErrDuration: { status: 'error', msg: 'Please enter Work duration in this company.' }
            });
            flag = false;
        }
        return flag;
    }

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
    validateWorkExperienceInfoTab = () => {
        let flagError = false;
        if (this.state.workExperienceEditIDX >= 0)
            flagError = true;

        if (flagError) {

            notification.open({
                message: 'Save your information',
                description:
                    'You have some unsaved data in this page. Please save before proceed to next step.',
                duration: 0,
                icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

            });
        }
        else {
            this.props.nextStep();
        }
    }
    render() {
        return (
            <Card title={<Title level={4} style={{ marginBottom: 0 }}>Work Experience</Title>}>
                {this.state.loading ?
                    <Spin tip='Loading...'>
                        <Alert
                            message="Please wait !!"
                            description="System is gathering information from the server."
                            type="info"
                        />
                    </Spin>
                    : <React.Fragment>
                        <Row>

                            <ButtonGroup style={{ width: '100%' }}>
                                <Button style={{ width: '50%' }} type="default" onClick={() => this.props.prevStep()}>
                                    <Icon type="left" />
                                    Go back
    </Button>
                                <Button style={{ width: '50%' }} type="default" onClick={() => this.validateWorkExperienceInfoTab()}>
                                    Go forward
        <Icon type="right" />
                                </Button>
                            </ButtonGroup>
                        </Row>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                        <Row>
                            {this.state.workexperience.length > 0 ?
                                <React.Fragment>
                                    {this.state.workexperience.map((work: any, index: any) => (
                                        <Card key={index} type="inner" title={'Work Experience #' + (index + 1)} style={{ marginTop: 10 }}
                                            extra={
                                                <div className="btn-group-sm">
                                                    <div className="btn btn-sm ">
                                                        {this.state.workExperienceEditIDX === index ? (
                                                            <span className="update" onClick={() => this.stopWorkExperienceEditing(index)}><small>Save</small></span>
                                                        ) : (
                                                                <span className="edit" onClick={() => this.startWorkExperienceEditing(index)}><small>Edit</small></span>
                                                            )}
                                                    </div>
                                                    <div className="btn btn-sm">
                                                        {this.state.workExperienceEditIDX === index ?
                                                            null
                                                            :
                                                            <Popconfirm
                                                                title="Are you sure delete this task?"
                                                                onConfirm={() => this.handleDeleteWorkExperience(index)}
                                                                // onCancel={cancel}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <span className="delete"><small>Delete</small></span>
                                                            </Popconfirm>
                                                        }
                                                    </div>
                                                </div>
                                            }>

                                            <Form layout={'vertical'}>
                                                <Form.Item
                                                    label={<span className={this.state.workExperienceEditIDX === index ? 'required' : ''}>Company Name</span>}
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                    validateStatus={this.state.workExperienceEditIDX === index ? this.state.editErrCompany.status : ''}
                                                    help={this.state.workExperienceEditIDX === index ? this.state.editErrCompany.msg : ''}
                                                >
                                                    <Input
                                                        disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                        placeholder="Example: Willings."
                                                        value={work.company}
                                                        id='company'
                                                        onChange={(e: any) => { this.handleWorkExperienceChange(e, "company", index); }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={<span className={this.state.workExperienceEditIDX === index ? 'required' : ''}>Work Location</span>}
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                    validateStatus={this.state.workExperienceEditIDX === index ? this.state.editErrPlace.status : ''}
                                                    help={this.state.workExperienceEditIDX === index ? this.state.editErrPlace.msg : ''}
                                                >
                                                    <AutoComplete
                                                        disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                        dataSource={countries}
                                                        placeholder="Example: Japan"
                                                        id='place'
                                                        value={work.place}
                                                        onChange={(value: any) => {
                                                            this.handleWorkExperienceChange({ target: { value: value } }, "place", index);
                                                        }}
                                                        allowClear={true}
                                                        filterOption={(inputValue: any, option: any) =>
                                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                        }
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={this.state.workExperienceEditIDX === index ?
                                                        <span className='required'>
                                                            Duration&nbsp;
                                          <Tooltip title="Please select a future date if this is your current company.">
                                                                <Icon type="info-circle" theme="twoTone" />
                                                            </Tooltip>
                                                        </span> : <span className=''>Duration</span>
                                                    }
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                    validateStatus={this.state.workExperienceEditIDX === index ? this.state.editErrDuration.status : ''}
                                                    help={this.state.workExperienceEditIDX === index ? this.state.editErrDuration.msg : ''}
                                                >
                                                    <RangePicker
                                                        allowClear
                                                        disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                        value={work.startDate ? [moment(work.startDate, 'DD/MM/YYYY'), moment(work.endDate, 'DD/MM/YYYY')] : [work.startDate, work.endDate]}
                                                        format={'DD/MM/YYYY'}
                                                        onChange={(value: any) => {
                                                            this.handleWorkExperienceChange({ target: { value: value } }, "startDate", index);
                                                        }}
                                                    />
                                                    <br />
                                                    {moment(work.endDate) > moment(new Date()) ? <Checkbox style={{ marginTop: 5 }} defaultChecked disabled>Current Company</Checkbox> : <div />}
                                                </Form.Item>
                                                <Form.Item
                                                    label={<span className={this.state.workExperienceEditIDX === index ? 'required' : ''}>Work Title</span>}
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                    validateStatus={this.state.workExperienceEditIDX === index ? this.state.editErrTitle.status : ''}
                                                    help={this.state.workExperienceEditIDX === index ? this.state.editErrTitle.msg : ''}
                                                >
                                                    <Input
                                                        disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                        placeholder="Example: Technical Lead."
                                                        value={work.title}
                                                        id='title'
                                                        onChange={(e: any) => {
                                                            this.handleWorkExperienceChange(e, "title", index);
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Description"
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                // validateStatus={this.state.errName.status}
                                                // help={this.state.errName.msg}
                                                >
                                                    <TextArea
                                                        disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                        placeholder="Example: Enter additional information like team size, responsibilities etc."
                                                        autosize={{ minRows: 2, maxRows: 5 }}
                                                        value={work.description}
                                                        id="description"
                                                        onChange={(e: any) => {
                                                            this.handleWorkExperienceChange(e, "description", index);
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Skills Used"
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                // validateStatus={this.state.errSkill.status}
                                                // help={this.state.errSkill.msg}
                                                >
                                                    <Select mode="tags"
                                                        disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                        labelInValue={true}
                                                        style={{ width: '100%' }}
                                                        placeholder="Example: HTML CSS"
                                                        id='skills'
                                                        value={work.skillsUsed}
                                                        onChange={(value: any) => {
                                                            this.handleWorkExperienceChange({ target: { value: value } }, "skillsUsed", index);
                                                        }}>
                                                        {skillOptions}
                                                    </Select>
                                                </Form.Item>
                                                {this.state.workExperienceEditIDX === index ?
                                                    <React.Fragment>
                                                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                                                        <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                                                            <Button
                                                                loading={this.state.saveInProgress}
                                                                type="primary"
                                                                disabled={this.state.workExperienceEditIDX === index ? false : true}
                                                                // htmlType="submit"
                                                                block
                                                                onClick={() => this.stopWorkExperienceEditing(index)}
                                                            >Save</Button>
                                                        </Form.Item>
                                                    </React.Fragment>
                                                    :
                                                    null}

                                            </Form>
                                        </Card>
                                    ))}
                                </React.Fragment>
                                :
                                <Empty></Empty>}
                        </Row>
                        <Row>
                            <Button style={{ marginTop: 8 }} type="dashed" block onClick={() => { this.setState({ showModal: true }) }}>
                                <Icon type="plus-circle" />
                                Add Experience
                        </Button>

                            <Modal
                                title="Add new Experience"
                                style={{ top: 20 }}
                                onOk={this.saveNewWorkExperience}
                                onCancel={() => {
                                    this.setState({
                                        showModal: false,
                                        title: "",
                                        company: "",
                                        schedule: "",
                                        place: "",
                                        description: "",
                                        newStartDate: null,
                                        newEndDate: null,
                                        skillsUsed: [],
                                        errCompany: { status: '', msg: '' },
                                        errPlace: { status: '', msg: '' },
                                        errDuration: { status: '', msg: '' },
                                        errTitle: { status: '', msg: '' },
                                        errSkill: { status: '', msg: '' }
                                    })
                                }}
                                visible={this.state.showModal}
                                footer={[
                                    <Button key="back" onClick={() => {
                                        this.setState({
                                            showModal: false,
                                            title: "",
                                            company: "",
                                            schedule: "",
                                            place: "",
                                            description: "",
                                            newStartDate: null,
                                            newEndDate: null,
                                            skillsUsed: [],
                                            errCompany: { status: '', msg: '' },
                                            errPlace: { status: '', msg: '' },
                                            errDuration: { status: '', msg: '' },
                                            errTitle: { status: '', msg: '' },
                                            errSkill: { status: '', msg: '' }
                                        })
                                    }}>
                                        Cancel
                                    </Button>,
                                    <Button key="submit" type="primary" loading={this.state.saveInProgress} onClick={this.saveNewWorkExperience}>
                                        Submit
                                    </Button>,
                                ]}
                            >
                                <Form layout={'vertical'}>
                                    <Form.Item
                                        label={<span className="required">Company Name</span>}
                                        style={{ marginBottom: 5, marginTop: 5 }}
                                        validateStatus={this.state.errCompany.status}
                                        help={this.state.errCompany.msg}
                                    >
                                        <Input
                                            placeholder="Example: Willings."
                                            value={this.state.company}
                                            id='company'
                                            onChange={(e: any) => { this.handleNewWorkExperienceChange(e, "company"); }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="required">Work Location</span>}
                                        style={{ marginBottom: 5, marginTop: 5 }}
                                        validateStatus={this.state.errPlace.status}
                                        help={this.state.errPlace.msg}
                                    >
                                        <AutoComplete
                                            dataSource={countries}
                                            placeholder="Example: Japan"
                                            id='place'
                                            value={this.state.place}
                                            onChange={(value: any) => {
                                                this.handleNewWorkExperienceChange({ target: { value: value } }, "place");
                                            }}
                                            allowClear={true}
                                            filterOption={(inputValue: any, option: any) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <span className="required">
                                                Duration&nbsp;
                                          <Tooltip title="Please select a future date if this is your current company.">
                                                    <Icon type="info-circle" theme="twoTone" />
                                                </Tooltip>
                                            </span>
                                        }
                                        style={{ marginBottom: 5, marginTop: 5 }}
                                        validateStatus={this.state.errDuration.status}
                                        help={this.state.errDuration.msg}
                                    >
                                        <RangePicker
                                            allowClear
                                            value={this.state.newStartDate ? [moment(this.state.newStartDate, 'DD/MM/YYYY'), moment(this.state.newEndDate, 'DD/MM/YYYY')] : [this.state.newStartDate, this.state.newEndDate]}
                                            format={'DD/MM/YYYY'}
                                            onChange={(value: any) => {
                                                this.handleNewWorkExperienceChange({ target: { value: value } }, "newStartDate");
                                            }}
                                        />
                                        <br />
                                        {moment(this.state.newEndDate) > moment(new Date()) ? <Checkbox style={{ marginTop: 5 }} defaultChecked disabled>Current Company</Checkbox> : <div />}
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="required">Work Title</span>}
                                        style={{ marginBottom: 5, marginTop: 5 }}
                                        validateStatus={this.state.errTitle.status}
                                        help={this.state.errTitle.msg}
                                    >
                                        <Input
                                            placeholder="Example: Software Developer"
                                            value={this.state.title}
                                            id='title'
                                            onChange={(e: any) => {
                                                this.handleNewWorkExperienceChange(e, "title");
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Description"
                                        style={{ marginBottom: 5, marginTop: 5 }}
                                    // validateStatus={this.state.errName.status}
                                    // help={this.state.errName.msg}
                                    >
                                        <TextArea
                                            placeholder="Example: Enter additional information like team size, responsibilities etc."
                                            autosize={{ minRows: 2, maxRows: 5 }}
                                            value={this.state.description}
                                            id="description"
                                            onChange={(e: any) => {
                                                this.handleNewWorkExperienceChange(e, "description");
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Skills Used"
                                        style={{ marginBottom: 5, marginTop: 5 }}
                                    // validateStatus={this.state.errSkill.status}
                                    // help={this.state.errSkill.msg}
                                    >
                                        <Select mode="tags"
                                            labelInValue={true}
                                            style={{ width: '100%' }}
                                            placeholder="Example: HTML CSS"
                                            value={this.state.skillsUsed}
                                            onChange={(value: any) => {
                                                this.handleNewWorkExperienceChange({ target: { value: value } }, "skillsUsed");
                                            }}>
                                            {skillOptions}
                                        </Select>
                                    </Form.Item>
                                </Form>


                            </Modal>

                        </Row>

                    </React.Fragment>}
            </Card>
        )
    }
}


export default WorkExperience;

