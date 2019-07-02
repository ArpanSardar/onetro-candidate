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

interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
    [key: string]: any;
}


class EducationInfo extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            education: [],
            educationEditIDX: -1,
            newEducationFields: {},
            instituteName: "",
            degree: "",
            schedule: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
            loading: true,
            saveInProgress: false,
            errDegree: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errDuration: { status: '', msg: '' },
            errInstituteName: { status: '', msg: '' },
            editErrDegree: { status: '', msg: '' },
            editErrPlace: { status: '', msg: '' },
            editErrDuration: { status: '', msg: '' },
            editErrInstituteName: { status: '', msg: '' },
            showModal: false
        };
        this.handleEducationChange = this.handleEducationChange.bind(this);
        this.handleNewEducationChange = this.handleNewEducationChange.bind(this);

    }

    startEducationEditing = (index: any) => {
        this.setState({ educationEditIDX: index });
    };
    stopEducationEditing = (index: any) => {
        if(this.validateRequiredFields())
        {
            this.setState({saveInProgress:true });

            var candidateId = sessionStorage.getItem("candidateID");
            if (candidateId != null) {
                companyDatabase
                    .collection("CandidateInfo")
                    .doc(candidateId)
                    .update({
                        education: this.state.education
                    })
                    .then(() => {
                        message.success('Data updated successfully');
                        this.setState({
                            educationEditIDX: -1,
                            saveInProgress:false,
                            editErrDegree: { status: '', msg: '' },
                            editErrPlace: { status: '', msg: '' },
                            editErrDuration: { status: '', msg: '' },
                            editErrInstituteName: { status: '', msg: '' },
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
    handleDeleteEducation = (index: any) => {
        this.setState({
          education: this.state.education.filter(
            (education: any, educationindex: any) => educationindex != index
          )
        });

        var candidateId = sessionStorage.getItem("candidateID");
        if (candidateId != null) {
          companyDatabase
            .collection("CandidateInfo")
            .doc(candidateId)
            .update({
              education: this.state.education.filter(
                (education: any, i: any) => i != index
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
    handleEducationChange = (e: any, propName: any, index: any) => {
        if (propName == "startDate" || propName == "endDate") {
            const { value } = e.target;
            if(value.length>1)
            {
                this.setState({
                    editErrDuration: { status: '', msg: '' }
                });
            }
            else{
                this.setState({
                    editErrDuration: { status: 'error', msg: 'Please enter duration in this institute.' }
                });
            }
            this.setState({
                education: this.state.education.map((item: any, j: any) =>
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
                if(propName==='degree')
                {
                    this.setState({
                        editErrDegree: { status: 'error', msg: 'Please enter Academic degree.' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        editErrPlace: { status: 'error', msg: 'Please enter Institute location.' }
                    });
                }
                if(propName==='instituteName')
                {
                    this.setState({
                        editErrInstituteName: { status: 'error', msg: 'Please enter Institute Name.' }
                    });
                }
            }
            else {
                if(propName==='degree')
                {
                    this.setState({
                        editErrDegree: { status: '', msg: '' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        editErrPlace: { status: '', msg: '' }
                    });
                }
                if(propName==='instituteName')
                {
                    this.setState({
                        editErrInstituteName: { status: '', msg: '' }
                    });
                }
            }
            this.setState({
                education: this.state.education.map((item: any, j: any) =>
                    j === index ? { ...item, [propName]: value } : item
                )
            });
        }
    }
    handleNewEducationChange = (e: any, propName: any) => {
        //This function is the onChange event of all the fields in new Education
        if (propName == "newStartDate" || propName == "newEndDate") {
            const { value } = e.target;
            // console.log('value :',value)
            if(value.length>1)
            {
                this.setState({
                    errDuration: { status: '', msg: '' }
                });
            }
            else{
                this.setState({
                    errDuration: { status: 'error', msg: 'Please enter duration in this institute.' }
                });
            }

            this.setState({
                newEducationFields: {
                    ...this.state.newEducationFields,
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
                if(propName==='degree')
                {
                    this.setState({
                        errDegree: { status: 'error', msg: 'Please enter Academic degree.' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        errPlace: { status: 'error', msg: 'Please enter Institute location.' }
                    });
                }
                if(propName==='instituteName')
                {
                    this.setState({
                        errInstituteName: { status: 'error', msg: 'Please enter Institute Name.' }
                    });
                }
            }
            else {
                if(propName==='degree')
                {
                    this.setState({
                        errDegree: { status: '', msg: '' }
                    });
                }
                if(propName==='place')
                {
                    this.setState({
                        errPlace: { status: '', msg: '' }
                    });
                }
                if(propName==='instituteName')
                {
                    this.setState({
                        errInstituteName: { status: '', msg: '' }
                    });
                }
            }
            this.onNewEducationFieldChange({ [propName]: value });
            this.setState({
                [propName]: value
            });
        }
    };
    onNewEducationFieldChange = (updatedValue: any) => {
        //This function is to create the new Education object
        this.setState({
            newEducationFields: {
                ...this.state.newEducationFields,
                ...updatedValue
            }
        });
    };

    saveNewEducation = (e: any) => {
        e.preventDefault();
        if(this.validateRequiredNewFields())
        {
        this.setState({ saveInProgress: true });
        var newArray = this.state.education.slice();
        newArray.push(this.state.newEducationFields);
        this.setState({
            education: newArray
        });
        var candidateId = sessionStorage.getItem("candidateID");
        if (candidateId != null) {
            companyDatabase
                .collection("CandidateInfo")
                .doc(candidateId)
                .update({ education: newArray })
                .then(() => {
                    this.setState({ saveInProgress: false,showModal: false });
                    message.success('Data added successfully');
                })
                .catch(function (error: any) {
                    message.error('Error while adding data !');
                });
        }
        this.setState({
            instituteName: "",
            degree: "",
            schedule: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
            errDegree: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errDuration: { status: '', msg: '' },
            errInstituteName: { status: '', msg: '' },
        });
        this.onNewEducationFieldChange({
            instituteName: "",
            degree: "",
            schedule: "",
            place: "",
            description: "",
            newStartDate: null,
            newEndDate: null,
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
                        education: data.education,
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
            errDegree: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errInstituteName: { status: '', msg: '' },
            errDuration: { status: '', msg: '' }
        });

        if (!this.state.degree) {
            this.setState({
                errDegree: { status: 'error', msg: 'Please enter Academic degree.' }
            });
            flag = false;
        }
        if (!this.state.place) {
            this.setState({
                errPlace: { status: 'error', msg: 'Please enter your institute location.' }
            });
            flag = false;
        }
        if (this.state.instituteName.length===0) {
            this.setState({
                errInstituteName: { status: 'error', msg: 'Please enter your Institute Name.' }
            });
            flag = false;
        }
        if (!this.state.newStartDate) {
            this.setState({
                errDuration: { status: 'error', msg: 'Please enter duration in this institute.' }
            });
            flag = false;
        }
        return flag;
    }
    validateRequiredFields = () => {
        let flag = true;
        const arr= this.state.education;
        this.setState({
            editErrDegree: { status: '', msg: '' },
            editErrPlace: { status: '', msg: '' },
            editErrInstituteName: { status: '', msg: '' },
            editErrDuration: { status: '', msg: '' }
        });
        if (!arr[this.state.educationEditIDX].degree) {
            this.setState({
                editErrDegree: { status: 'error', msg: 'Please enter Academic degree.' }
            });
            flag = false;
        }
        if (!arr[this.state.educationEditIDX].place) {
            this.setState({
                editErrPlace: { status: 'error', msg: 'Please enter your institute location.' }
            });
            flag = false;
        }
        if (arr[this.state.educationEditIDX].instituteName.length===0) {
            this.setState({
                editErrInstituteName: { status: 'error', msg: 'Please enter your Institute Name.' }
            });
            flag = false;
        }
        if (!arr[this.state.educationEditIDX].startDate) {
            this.setState({
                editErrDuration: { status: 'error', msg: 'Please enter duration in this institute.' }
            });
            flag = false;
        }
        return flag;
    }
   
    openNotificationWithIcon = () => {
        notification.open({
            message: 'Insufficient Information',
            description:
                'Please update missing information in this page to proceed in next page.',
            duration: 0,
            icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

        });
    };
    validateEducationInfoTab = () => {
        let flagError = false;
        if (this.state.educationEditIDX>=0)
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
            <Card title={<Title level={4} style={{ marginBottom: 0 }}>Education Details</Title>}>
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
                        <Button style={{ width: '50%' }} type="default" onClick={() => this.validateEducationInfoTab()}>
                            Go forward
                            <Icon type="right" />
                        </Button>
                    </ButtonGroup>
                </Row>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                <Row>
                    {this.state.education.length>0?
                    <React.Fragment>
                    {this.state.education.map((education: any, index: any) => (
                        <Card key={index} type="inner" title={'Education #' + (index + 1)} style={{ marginTop: 10 }}
                            extra={
                                <div className="btn-group-sm">
                                    <div className="btn btn-sm ">
                                        {this.state.educationEditIDX === index ? (
                                            <span className="update" onClick={() => this.stopEducationEditing(index)}><small>Save</small></span>
                                        ) : (
                                                <span className="edit" onClick={() => this.startEducationEditing(index)}><small>Edit</small></span>
                                            )}
                                    </div>
                                    <div className="btn btn-sm">
                                        {this.state.educationEditIDX === index ?
                                            null
                                            :
                                            <Popconfirm
                                                title="Are you sure delete this entry?"
                                                onConfirm={() => this.handleDeleteEducation(index)}
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
                                    label={<span className={this.state.educationEditIDX === index?'required':''}>Institute Name</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    validateStatus={this.state.educationEditIDX === index?this.state.editErrInstituteName.status:''}
                                    help={this.state.educationEditIDX === index?this.state.editErrInstituteName.msg:''}
                                >
                                    <Input
                                        disabled={this.state.educationEditIDX === index ? false : true}
                                        placeholder="Example: Harvard University"
                                        value={education.instituteName}
                                        id='instituteName'
                                        onChange={(e: any) => {
                                            this.handleEducationChange(e, "instituteName", index);
                                        }}
                                    />
                                </Form.Item>
                                
                                <Form.Item
                                    label={<span className={this.state.educationEditIDX === index?'required':''}>Institute Location</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    validateStatus={this.state.educationEditIDX === index?this.state.editErrPlace.status:''}
                                    help={this.state.educationEditIDX === index?this.state.editErrPlace.msg:''}
                                >
                                    <AutoComplete
                                        disabled={this.state.educationEditIDX === index ? false : true}
                                        dataSource={countries}
                                        placeholder="Example: United States"
                                        id='place'
                                        value={education.place}
                                        onChange={(value: any) => {
                                            this.handleEducationChange({ target: { value: value } }, "place", index);
                                        }}
                                        allowClear={true}
                                        filterOption={(inputValue: any, option: any) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span className={this.state.educationEditIDX === index?'required':''}>Degree</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                validateStatus={this.state.educationEditIDX === index?this.state.editErrDegree.status:''}
                                help={this.state.educationEditIDX === index?this.state.editErrDegree.msg:''}
                                >
                                    <Input
                                        disabled={this.state.educationEditIDX === index ? false : true}
                                        placeholder="Example: B.Tech"
                                        value={education.degree}
                                        id='degree'
                                        onChange={(e: any) => { this.handleEducationChange(e, "degree", index); }}
                                    />
                                </Form.Item>
                                
                                <Form.Item
                                    label={this.state.educationEditIDX === index ?
                                        <span className='required'>
                                            Duration&nbsp;
                                          <Tooltip title="Please select a future date if this is your current pursuing degree.">
                                                <Icon type="info-circle" theme="twoTone" />
                                            </Tooltip>
                                        </span> : <span className=''>Duration</span>
                                    }
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                    validateStatus={this.state.educationEditIDX === index?this.state.editErrDuration.status:''}
                                    help={this.state.educationEditIDX === index?this.state.editErrDuration.msg:''}
                                >
                                    <RangePicker
                                        allowClear
                                        disabled={this.state.educationEditIDX === index ? false : true}
                                        value={education.startDate ? [moment(education.startDate, 'DD/MM/YYYY'), moment(education.endDate, 'DD/MM/YYYY')] : [education.startDate, education.endDate]}
                                        format={'DD/MM/YYYY'}
                                        onChange={(value: any) => {
                                            this.handleEducationChange({ target: { value: value } }, "startDate", index);
                                        }}
                                    />
                                    <br />
                                    {moment(education.endDate) > moment(new Date()) ? <Checkbox style={{ marginTop: 5 }} defaultChecked disabled>Pursuing Degree</Checkbox> : <div />}
                                </Form.Item>
                                <Form.Item
                                    label="Description"
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                                // validateStatus={this.state.errName.status}
                                // help={this.state.errName.msg}
                                >
                                    <TextArea
                                        disabled={this.state.educationEditIDX === index ? false : true}
                                        placeholder="Example: Enter any additional information you want to provide here like the marks or grade obtained in this degree"
                                        autosize={{ minRows: 2, maxRows: 5 }}
                                        value={education.description}
                                        id="description"
                                        onChange={(e: any) => {
                                            this.handleEducationChange(e, "description", index);
                                        }}
                                    />
                                </Form.Item>
                               {this.state.educationEditIDX === index ?
                                    <React.Fragment>
                                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                                        <Form.Item style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}>
                                            <Button
                                                loading={this.state.saveInProgress}
                                                type="primary"
                                                disabled={this.state.educationEditIDX === index ? false : true}
                                                // htmlType="submit"
                                                block
                                                onClick={() => this.stopEducationEditing(index)}
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
                        Add Education
                        </Button>

                    <Modal
                        title="Add new Education"
                        style={{ top: 20 }}
                        onOk={this.saveNewEducation}
                        onCancel={() => {
                            this.setState({
                                showModal: false,
                                instituteName: "",
                                degree: "",
                                schedule: "",
                                place: "",
                                description: "",
                                newStartDate: null,
                                newEndDate: null,
                                errDegree: { status: '', msg: '' },
                                errPlace: { status: '', msg: '' },
                                errDuration: { status: '', msg: '' },
                                errInstituteName: { status: '', msg: '' },
                            })
                        }}
                        visible={this.state.showModal}
                        footer={[
                            <Button key="back" onClick={() => {
                                this.setState({
                                    showModal: false,
                                    instituteName: "",
                                    degree: "",
                                    schedule: "",
                                    place: "",
                                    description: "",
                                    newStartDate: null,
                                    newEndDate: null,
                                    errDegree: { status: '', msg: '' },
                                    errPlace: { status: '', msg: '' },
                                    errDuration: { status: '', msg: '' },
                                    errInstituteName: { status: '', msg: '' },
                                })
                            }}>
                                Cancel
                                    </Button>,
                            <Button key="submit" type="primary" loading={this.state.saveInProgress} onClick={this.saveNewEducation}>
                                Submit
                                    </Button>,
                        ]}
                    >
                        <Form layout={'vertical'}>
                            <Form.Item
                                label={<span className="required">Institute Name</span>}
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errInstituteName.status}
                            help={this.state.errInstituteName.msg}
                            >
                                <Input
                                    placeholder="Example: Harvard University"
                                    value={this.state.instituteName}
                                    id='instituteName'
                                    onChange={(e: any) => {
                                        this.handleNewEducationChange(e, "instituteName");
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                               label={<span className="required">Institute Location</span>}
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errPlace.status}
                            help={this.state.errPlace.msg}
                            >
                                <AutoComplete
                                    dataSource={countries}
                                    placeholder="Example: United States"
                                    id='place'
                                    value={this.state.place}
                                    onChange={(value: any) => {
                                        this.handleNewEducationChange({ target: { value: value } }, "place");
                                    }}
                                    allowClear={true}
                                    filterOption={(inputValue: any, option: any) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                    label={<span className="required">Degree</span>}
                                    style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errDegree.status}
                            help={this.state.errDegree.msg}
                            >
                                <Input
                                    placeholder="Example: B.Tech"
                                    value={this.state.degree}
                                    id='degree'
                                    onChange={(e: any) => { this.handleNewEducationChange(e, "degree"); }}
                                />
                            </Form.Item>
                            
                            <Form.Item
                                label={
                                    <span className="required">
                                        Duration&nbsp;
                                          <Tooltip title="Please select a future date if this is your current pursuing degree.">
                                            <Icon type="info-circle" theme="twoTone" />
                                        </Tooltip>
                                    </span>
                                }
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            validateStatus={this.state.errDuration.status}
                            help={this.state.errDuration.msg}
                            >
                                <RangePicker
                                    allowClear
                                    value={this.state.newStartDate ? [moment(this.state.newStartDate, 'DD/MM/YYYY'), moment(this.state.newEndDate, 'DD/MM/YYYY')] : [this.state.newStartDate, this.state.newEndDate]}
                                    format={'DD/MM/YYYY'}
                                    onChange={(value: any) => {
                                        this.handleNewEducationChange({ target: { value: value } }, "newStartDate");
                                    }}
                                />
                                <br />
                                {moment(this.state.newEndDate) > moment(new Date()) ? <Checkbox style={{ marginTop: 5 }} defaultChecked disabled>Pursuing degree.</Checkbox> : <div />}
                            </Form.Item>
                            
                            <Form.Item
                                label="Description"
                                style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                            // validateStatus={this.state.errName.status}
                            // help={this.state.errName.msg}
                            >
                                <TextArea
                                    placeholder="Example: Enter any additional information you want to provide here like the marks or grade obtained in this degree"
                                    autosize={{ minRows: 2, maxRows: 5 }}
                                    value={this.state.description}
                                    id="description"
                                    onChange={(e: any) => {
                                        this.handleNewEducationChange(e, "description");
                                    }}
                                />
                            </Form.Item>
                            </Form>


                    </Modal>

                </Row>
                
                </React.Fragment>}
            </Card>
        )
    }
}


export default EducationInfo;

