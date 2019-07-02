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
    Upload, Modal, Card,Alert,
    DatePicker, Popover, Tooltip,
    Form, Input, Popconfirm,Spin,
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


class ProjectDetails extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            project: [],
            projectEditIDX: -1,
            newProjectFields: {},
            title: "",
            organization: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
            skillsUsed: [],
            loading: true,
            saveInProgress: false,
            errOrganization: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            // errDuration: { status: '', msg: '' },
            errTitle: { status: '', msg: '' },
            errSkill: { status: '', msg: '' },
            editErrOrganization: { status: '', msg: '' },
            editErrPlace: { status: '', msg: '' },
            // editErrDuration: { status: '', msg: '' },
            editErrTitle: { status: '', msg: '' },
            editErrSkill: { status: '', msg: '' },
            showModal: false
        };
        this.handleProjectChange = this.handleProjectChange.bind(this);
        this.handleNewProjectChange = this.handleNewProjectChange.bind(this);

    }

    startProjectEditing = (index: any) => {
        this.setState({ projectEditIDX: index });
    };
    stopProjectEditing = (index: any) => {
        if(this.validateRequiredFields())
        {
            this.setState({saveInProgress:true });

            var candidateId = sessionStorage.getItem("candidateID");
            if (candidateId != null) {
                companyDatabase
                    .collection("CandidateInfo")
                    .doc(candidateId)
                    .update({
                        project: this.state.project
                    })
                    .then(() => {
                        message.success('Data updated successfully');
                        this.setState({
                            projectEditIDX: -1,
                            saveInProgress:false,
                            editErrOrganization: { status: '', msg: '' },
                            editErrPlace: { status: '', msg: '' },
                            // editErrDuration: { status: '', msg: '' },
                            editErrTitle: { status: '', msg: '' },
                            editErrSkill: { status: '', msg: '' }
                        });
                    })
                    .catch(function (error: any) {
                        message.error('Error in data update !');
                    });
            }else{
                message.error('Error in updating information. Please login again and try.');
            }
        }
        else{
            message.error('Please provide required information !');
        }
    }
    handleDeleteProject = (index: any) => {
        this.setState({
          project: this.state.project.filter(
            (proj: any, projindex: any) => projindex != index
          )
        });

        var candidateId = sessionStorage.getItem("candidateID");
        if (candidateId != null) {
          companyDatabase
            .collection("CandidateInfo")
            .doc(candidateId)
            .update({
              project: this.state.project.filter(
                (proj: any, i: any) => i != index
              )
            })
            .then(() => {
              message.warning('Data deleted !');
            })
            .catch(function(error) {
              message.error('Error while removing data !');
            });
        }
    };
    handleProjectChange = (e: any, propName: any, index: any) => {
        if (propName == "startDate" || propName == "endDate") {
            const { value } = e.target;
            // if(value.length>1)
            // {
            //     this.setState({
            //         editErrDuration: { status: '', msg: '' }
            //     });
            // }
            // else{
            //     this.setState({
            //         editErrDuration: { status: 'error', msg: 'Please enter Project duration.' }
            //     });
            // }
            this.setState({
                project: this.state.project.map((item: any, j: any) =>
                    j === index ? {
                        ...item,
                        startDate: value[0] ? value[0].format('DD/MM/YYYY') : null,
                        endDate: value[1] ? value[1].format('DD/MM/YYYY') : null
                    } : item
                )
            });
        }
        else if(propName == "skillsUsed"){
            const { value } = e.target;
            if(value.length===0)
            {
                this.setState({
                    editErrSkill: { status: 'error', msg: 'Please enter technical skills used in this project' }
                });
            }
            else{
                this.setState({
                    editErrSkill: { status: '', msg: '' }
                });
            }
            this.setState({
                project: this.state.project.map((item: any, j: any) =>
                    j === index ? {
                        ...item,
                        skillsUsed: value
                    } : item
                )
            });
        }
        else 
        {
            const { value } = e.target;
            if (!value) {
                if(propName==='organization')
                {
                    this.setState({
                        editErrOrganization: { status: 'error', msg: 'Please enter organization Name.' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        editErrPlace: { status: 'error', msg: 'Please enter location of the organization.' }
                    });
                }
                if(propName==='title')
                {
                    this.setState({
                        editErrTitle: { status: 'error', msg: 'Please enter Project title.' }
                    });
                }
            }
            else {
                if(propName==='organization')
                {
                    this.setState({
                        editErrOrganization: { status: '', msg: '' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        editErrPlace: { status: '', msg: '' }
                    });
                }
                if(propName==='title')
                {
                    this.setState({
                        editErrTitle: { status: '', msg: '' }
                    });
                }
            }
            this.setState({
                project: this.state.project.map((item: any, j: any) =>
                    j === index ? { ...item, [propName]: value } : item
                )
            });
        }
    }
    handleNewProjectChange = (e: any, propName: any) => {
        //This function is the onChange event of all the fields in new Project
        if (propName == "newStartDate" || propName == "newEndDate") {
            const { value } = e.target;
            // if(value.length>1)
            // {
            //     this.setState({
            //         errDuration: { status: '', msg: '' }
            //     });
            // }
            // else{
            //     this.setState({
            //         errDuration: { status: 'error', msg: 'Please enter Project duration.' }
            //     });
            // }

            this.setState({
                newProjectFields: {
                    ...this.state.newProjectFields,
                    startDate: value[0] ? value[0].format('DD/MM/YYYY') : null,
                    endDate: value[1] ? value[1].format('DD/MM/YYYY') : null,
                }
            });
            this.setState({
                newStartDate: value[0] ? value[0].format('DD/MM/YYYY') : null,
                newEndDate: value[1] ? value[1].format('DD/MM/YYYY') : null,
            });
        }
        else if(propName==='skillsUsed'){
            const { value } = e.target;
            if(value.length===0)
            {
                this.setState({
                    errSkill: { status: 'error', msg: 'Please enter technical skills used in this project' }
                });
            }
            else{
                this.setState({
                    errSkill: { status: '', msg: '' }
                });
            }

            this.setState({
                newProjectFields: {
                    ...this.state.newProjectFields,
                    skillsUsed: value
                }
            });
            this.setState({
                skillsUsed: value
            });
        }
        else {
            const { value } = e.target;
            if (!value) {
                if(propName==='organization')
                {
                    this.setState({
                        errOrganization: { status: 'error', msg: 'Please enter organization Name.' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        errPlace: { status: 'error', msg: 'Please enter location of the organization.' }
                    });
                }
                if(propName==='title')
                {
                    this.setState({
                        errTitle: { status: 'error', msg: 'Please enter Project title.' }
                    });
                }
            }
            else {
                if(propName==='organization')
                {
                    this.setState({
                        errOrganization: { status: '', msg: '' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        errPlace: { status: '', msg: '' }
                    });
                }
                if(propName==='title')
                {
                    this.setState({
                        errTitle: { status: '', msg: '' }
                    });
                }
            }
            this.onNewProjectFieldChange({ [propName]: value });
            this.setState({
                [propName]: value
            });
        }
    };
    onNewProjectFieldChange = (updatedValue: any) => {
        //This function is to create the new Project object
        this.setState({
            newProjectFields: {
                ...this.state.newProjectFields,
                ...updatedValue
            }
        });
    };

    saveNewProject = (e: any) => {
        e.preventDefault();
        if(this.validateRequiredNewFields())
        {
        this.setState({ saveInProgress: true });
        var newArray = this.state.project.slice();
        newArray.push(this.state.newProjectFields);
        this.setState({
            project: newArray
        });
        var candidateId = sessionStorage.getItem("candidateID");
        if (candidateId != null) {
            companyDatabase
                .collection("CandidateInfo")
                .doc(candidateId)
                .update({ project: newArray })
                .then(() => {
                    this.setState({ saveInProgress: false,showModal: false });
                    message.success('Data added successfully');
                })
                .catch(function (error: any) {
                    message.error('Error while adding data !');
                });
        }
        this.setState({
            title: "",
            organization: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
            skillsUsed: [],
            errOrganization: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            // errDuration: { status: '', msg: '' },
            errTitle: { status: '', msg: '' },
            errSkill: { status: '', msg: '' }
        });
        this.onNewProjectFieldChange({
            title: "",
            organization: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
            skillsUsed: []
        });
    }
    else{
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
                        project: data.project,
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
            errOrganization: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errTitle: { status: '', msg: '' },
            errSkill: { status: '', msg: '' }
            // errDuration: { status: '', msg: '' }
        });

        if (!this.state.organization) {
            this.setState({
                errOrganization: { status: 'error', msg: 'Please enter organization name.' }
            });
            flag = false;
        }
        if (!this.state.place) {
            this.setState({
                errPlace: { status: 'error', msg: 'Please enter location of the organization.' }
            });
            flag = false;
        }
        if (this.state.title.length===0) {
            this.setState({
                errTitle: { status: 'error', msg: 'Please enter your Project title.' }
            });
            flag = false;
        }
        if (this.state.skillsUsed.length===0) {
            this.setState({
                errSkill: { status: 'error', msg: 'Please enter technical skills used in this project.' }
            });
            flag = false;
        }
        // if (!this.state.newStartDate) {
        //     this.setState({
        //         errDuration: { status: 'error', msg: 'Please enter Project duration in this organization.' }
        //     });
        //     flag = false;
        // }
        return flag;
    }
    validateRequiredFields = () => {
        let flag = true;
        const arr= this.state.project;
        this.setState({
            editErrOrganization: { status: '', msg: '' },
            editErrPlace: { status: '', msg: '' },
            editErrTitle: { status: '', msg: '' },
            editErrSkill: { status: '', msg: '' }
            // editErrDuration: { status: '', msg: '' }
        });
        if (!arr[this.state.projectEditIDX].organization) {
            this.setState({
                editErrOrganization: { status: 'error', msg: 'Please enter organization name.' }
            });
            flag = false;
        }
        if (!arr[this.state.projectEditIDX].place) {
            this.setState({
                editErrPlace: { status: 'error', msg: 'Please enter location of the organization.' }
            });
            flag = false;
        }
        if (arr[this.state.projectEditIDX].title.length===0) {
            this.setState({
                editErrTitle: { status: 'error', msg: 'Please enter your Project title.' }
            });
            flag = false;
        }
        if (arr[this.state.projectEditIDX].skillsUsed.length===0) {
            this.setState({
                editErrSkill: { status: 'error', msg: 'Please enter technical skills used in this project.' }
            });
            flag = false;
        }
        // if (!arr[this.state.projectEditIDX].startDate) {
        //     this.setState({
        //         editErrDuration: { status: 'error', msg: 'Please enter Project duration.' }
        //     });
        //     flag = false;
        // }
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
    validateProjectInfoTab = () => {
        let flagError = false;
        if (this.state.projectEditIDX>=0)
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
            <Card title={<Title level={4} style={{ marginBottom: 0 }}>Project Details</Title>}>
            {this.state.loading?
        <Spin tip='Loading...'>
        <Alert
            message="Please wait !!"
            description="System is gathering information from the server."
            type="info"
            />
        </Spin>
    :<React.Fragment>
<Row>

<ButtonGroup style={{ width: '100%' }}>
    <Button style={{ width: '50%' }} type="default" onClick={() => this.props.prevStep()}>
        <Icon type="left" />
        Go back
    </Button>
    <Button style={{ width: '50%' }} type="default" onClick={() => this.validateProjectInfoTab()}>
        Go forward
        <Icon type="right" />
    </Button>
</ButtonGroup>
</Row>
<Divider style={{ marginBottom: 10, marginTop: 10 }} />
                <Row>
                    {this.state.project.length>0?
                    <React.Fragment>
                    {this.state.project.map((proj: any, index: any) => (
                        <Card key={index} type="inner" title={'Project #' + (index + 1)} style={{ marginTop: 10 }}
                            extra={
                                <div className="btn-group-sm">
                                    <div className="btn btn-sm ">
                                        {this.state.projectEditIDX === index ? (
                                            <span className="update" onClick={() => this.stopProjectEditing(index)}><small>Save</small></span>
                                        ) : (
                                                <span className="edit" onClick={() => this.startProjectEditing(index)}><small>Edit</small></span>
                                            )}
                                    </div>
                                    <div className="btn btn-sm">
                                        {this.state.projectEditIDX === index ?
                                            null
                                            :
                                            <Popconfirm
                                                title="Are you sure delete this task?"
                                                onConfirm={() => this.handleDeleteProject(index)}
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
                                    label={<span className={this.state.projectEditIDX === index?'required':''}>Organization Name</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                validateStatus={this.state.projectEditIDX === index?this.state.editErrOrganization.status:''}
                                help={this.state.projectEditIDX === index?this.state.editErrOrganization.msg:''}
                                >
                                    <Input
                                        disabled={this.state.projectEditIDX === index ? false : true}
                                        placeholder="Example: Willings."
                                        value={proj.organization}
                                        id='organization'
                                        onChange={(e: any) => { this.handleProjectChange(e, "organization", index); }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span className={this.state.projectEditIDX === index?'required':''}>Organization Location</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    validateStatus={this.state.projectEditIDX === index?this.state.editErrPlace.status:''}
                                    help={this.state.projectEditIDX === index?this.state.editErrPlace.msg:''}
                                >
                                    <AutoComplete
                                        disabled={this.state.projectEditIDX === index ? false : true}
                                        dataSource={countries}
                                        placeholder="Example: Japan"
                                        id='place'
                                        value={proj.place}
                                        onChange={(value: any) => {
                                            this.handleProjectChange({ target: { value: value } }, "place", index);
                                        }}
                                        allowClear={true}
                                        filterOption={(inputValue: any, option: any) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <span>
                                            Duration&nbsp;
                                          <Tooltip title="Please select a future date if this is your current project.">
                                                <Icon type="info-circle" theme="twoTone" />
                                            </Tooltip>
                                        </span> 
                                    }
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    // validateStatus={this.state.projectEditIDX === index?this.state.editErrDuration.status:''}
                                    // help={this.state.projectEditIDX === index?this.state.editErrDuration.msg:''}
                                >
                                    <RangePicker
                                        allowClear
                                        disabled={this.state.projectEditIDX === index ? false : true}
                                        value={proj.startDate ? [moment(proj.startDate, 'DD/MM/YYYY'), moment(proj.endDate, 'DD/MM/YYYY')] : [proj.startDate, proj.endDate]}
                                        format={'DD/MM/YYYY'}
                                        onChange={(value: any) => {
                                            this.handleProjectChange({ target: { value: value } }, "startDate", index);
                                        }}
                                    />
                                    <br />
                                    {moment(proj.endDate) > moment(new Date()) ? <Checkbox style={{ marginTop: 5 }} defaultChecked disabled>Current Project</Checkbox> : <div />}
                                </Form.Item>
                                <Form.Item
                                    label={<span className={this.state.projectEditIDX === index?'required':''}>Project Title</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    validateStatus={this.state.projectEditIDX === index?this.state.editErrTitle.status:''}
                                    help={this.state.projectEditIDX === index?this.state.editErrTitle.msg:''}
                                >
                                    <Input
                                        disabled={this.state.projectEditIDX === index ? false : true}
                                        placeholder="Example: Technical Lead."
                                        value={proj.title}
                                        id='title'
                                        onChange={(e: any) => {
                                            this.handleProjectChange(e, "title", index);
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Description"
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                // validateStatus={this.state.errName.status}
                                // help={this.state.errName.msg}
                                >
                                    <TextArea
                                        disabled={this.state.projectEditIDX === index ? false : true}
                                        placeholder="Example: Enter additional information like team size, responsibilities etc."
                                        autosize={{ minRows: 2, maxRows: 5 }}
                                        value={proj.description}
                                        id="description"
                                        onChange={(e: any) => {
                                            this.handleProjectChange(e, "description", index);
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span className={this.state.projectEditIDX === index?'required':''}>Skills Used</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    validateStatus={this.state.projectEditIDX === index?this.state.editErrSkill.status:''}
                                    help={this.state.projectEditIDX === index?this.state.editErrSkill.msg:''}
                                >
                                    <Select mode="tags"
                                        disabled={this.state.projectEditIDX === index ? false : true}
                                        labelInValue={true}
                                        style={{ width: '100%' }}
                                        placeholder="Example: HTML CSS"
                                        id='skills'
                                        value={proj.skillsUsed}
                                        onChange={(value: any) => {
                                            this.handleProjectChange({ target: { value: value } }, "skillsUsed", index);
                                        }}>
                                        {skillOptions}
                                    </Select>
                                </Form.Item>
                                {this.state.projectEditIDX === index ?
                                    <React.Fragment>
                                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                                        <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                                            <Button
                                                loading={this.state.saveInProgress}
                                                type="primary"
                                                disabled={this.state.projectEditIDX === index ? false : true}
                                                // htmlType="submit"
                                                block
                                                onClick={() => this.stopProjectEditing(index)}
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
                        <Empty></Empty>        }
                </Row>
                <Row>
                    <Button style={{ marginTop: 8 }} type="dashed" block onClick={() => { this.setState({ showModal: true }) }}>
                        <Icon type="plus-circle" />
                        Add Experience
                        </Button>

                    <Modal
                        title="Add new Experience"
                        style={{ top: 20 }}
                        onOk={this.saveNewProject}
                        onCancel={() => {
                            this.setState({
                                showModal: false,
                                title: "",
                                organization: "",
                                place: "",
                                description: "",
                                newStartDate: null,
                                newEndDate: null,
                                skillsUsed: [],
                                errOrganization: { status: '', msg: '' },
                                errPlace: { status: '', msg: '' },
                                // errDuration: { status: '', msg: '' },
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
                                    organization: "",
                                    place: "",
                                    description: "",
                                    newStartDate: null,
                                    newEndDate: null,
                                    skillsUsed: [],
                                    errOrganization: { status: '', msg: '' },
                                    errPlace: { status: '', msg: '' },
                                    // errDuration: { status: '', msg: '' },
                                    errTitle: { status: '', msg: '' },
                                    errSkill: { status: '', msg: '' }
                                })
                            }}>
                                Cancel
                                    </Button>,
                            <Button key="submit" type="primary" loading={this.state.saveInProgress} onClick={this.saveNewProject}>
                                Submit
                                    </Button>,
                        ]}
                    >
                        <Form layout={'vertical'}>
                            <Form.Item
                                    label={<span className="required">Organization Name</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errOrganization.status}
                            help={this.state.errOrganization.msg}
                            >
                                <Input
                                    placeholder="Example: Willings."
                                    value={this.state.organization}
                                    id='organization'
                                    onChange={(e: any) => { this.handleNewProjectChange(e, "organization"); }}
                                />
                            </Form.Item>
                            <Form.Item
                               label={<span className="required">Organization Location</span>}
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errPlace.status}
                            help={this.state.errPlace.msg}
                            >
                                <AutoComplete
                                    dataSource={countries}
                                    placeholder="Example: Japan"
                                    id='place'
                                    value={this.state.place}
                                    onChange={(value: any) => {
                                        this.handleNewProjectChange({ target: { value: value } }, "place");
                                    }}
                                    allowClear={true}
                                    filterOption={(inputValue: any, option: any) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <span>
                                        Duration&nbsp;
                                          <Tooltip title="Please select a future date if this is your current organization.">
                                            <Icon type="info-circle" theme="twoTone" />
                                        </Tooltip>
                                    </span>
                                }
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            // validateStatus={this.state.errDuration.status}
                            // help={this.state.errDuration.msg}
                            >
                                <RangePicker
                                    allowClear
                                    value={this.state.newStartDate ? [moment(this.state.newStartDate, 'DD/MM/YYYY'), moment(this.state.newEndDate, 'DD/MM/YYYY')] : [this.state.newStartDate, this.state.newEndDate]}
                                    format={'DD/MM/YYYY'}
                                    onChange={(value: any) => {
                                        this.handleNewProjectChange({ target: { value: value } }, "newStartDate");
                                    }}
                                />
                                <br />
                                {moment(this.state.newEndDate) > moment(new Date()) ? <Checkbox style={{ marginTop: 5 }} defaultChecked disabled>Current Project</Checkbox> : <div />}
                            </Form.Item>
                            <Form.Item
                                label={<span className="required">Project Title</span>}
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errTitle.status}
                            help={this.state.errTitle.msg}
                            >
                                <Input
                                    placeholder="Example: Software Developer"
                                    value={this.state.title}
                                    id='title'
                                    onChange={(e: any) => {
                                        this.handleNewProjectChange(e, "title");
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            // validateStatus={this.state.errName.status}
                            // help={this.state.errName.msg}
                            >
                                <TextArea
                                    placeholder="Example: Enter additional information like team size, responsibilities etc."
                                    autosize={{ minRows: 2, maxRows: 5 }}
                                    value={this.state.description}
                                    id="description"
                                    onChange={(e: any) => {
                                        this.handleNewProjectChange(e, "description");
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                    label={<span className="required">Skills Used</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errSkill.status}
                            help={this.state.errSkill.msg}
                            >
                                <Select mode="tags"
                                    labelInValue={true}
                                    style={{ width: '100%' }}
                                    placeholder="Example: HTML CSS"
                                    value={this.state.skillsUsed}
                                    onChange={(value: any) => {
                                        this.handleNewProjectChange({ target: { value: value } }, "skillsUsed");
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


export default ProjectDetails;

