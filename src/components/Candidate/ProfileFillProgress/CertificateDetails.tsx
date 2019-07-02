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

interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
    [key: string]: any;
}


class CertificateDetails extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            certificate: [],
            certificateEditIDX: -1,
            newCertificateFields: {},
            title: "",
            link: "",
            description: "",
            issueDate: null,
            loading: true,
            saveInProgress: false,
            errLink: { status: '', msg: '' },
            errDuration: { status: '', msg: '' },
            errTitle: { status: '', msg: '' },
            errIssueDate: { status: '', msg: '' },
            editErrLink: { status: '', msg: '' },
            editErrDuration: { status: '', msg: '' },
            editErrTitle: { status: '', msg: '' },
            editErrIssueDate: { status: '', msg: '' },
            showModal: false
        };
        this.handleCertificateChange = this.handleCertificateChange.bind(this);
        this.handleNewCertificateChange = this.handleNewCertificateChange.bind(this);

    }

    startCertificateEditing = (index: any) => {
        this.setState({ certificateEditIDX: index });
    };
    stopCertificateEditing = (index: any) => {
        if (this.validateRequiredFields()) {
            this.setState({ saveInProgress: true });

            var candidateId = sessionStorage.getItem("candidateID");
            if (candidateId != null) {
                companyDatabase
                    .collection("CandidateInfo")
                    .doc(candidateId)
                    .update({
                        certificate: this.state.certificate
                    })
                    .then(() => {
                        message.success('Data updated successfully');
                        this.setState({
                            certificateEditIDX: -1,
                            saveInProgress: false,
                            editErrTitle: { status: '', msg: '' },
                            editErrIssueDate: { status: '', msg: '' },
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
    handleDeleteCertificate = (index: any) => {
        this.setState({
            certificate: this.state.certificate.filter(
                (certificate: any, certificateindex: any) => certificateindex != index
            )
        });

        var candidateId = sessionStorage.getItem("candidateID");
        if (candidateId != null) {
            companyDatabase
                .collection("CandidateInfo")
                .doc(candidateId)
                .update({
                    certificate: this.state.certificate.filter(
                        (certificate: any, i: any) => i != index
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
    handleCertificateChange = (e: any, propName: any, index: any) => {
        if (propName === 'issueDate') {
            const { value } = e.target;
            if (value) {
                this.setState({
                    editErrIssueDate: { status: '', msg: '' }
                });
            }
            else {
                this.setState({
                    editErrIssueDate: { status: 'error', msg: 'Please enter Certificate issue date.' }
                });
            }
            this.setState({
                certificate: this.state.certificate.map((item: any, j: any) =>
                    j === index ? { ...item, issueDate: value ? value.format('DD/MM/YYYY') : null } : item
                )
            });

        }
        else {
            const { value } = e.target;
            if (!value) {
                if (propName === 'title') {
                    this.setState({
                        editErrTitle: { status: 'error', msg: 'Please enter Certificate title.' }
                    });
                }
            }
            else {

                if (propName === 'title') {
                    this.setState({
                        editErrTitle: { status: '', msg: '' }
                    });
                }
            }
            this.setState({
                certificate: this.state.certificate.map((item: any, j: any) =>
                    j === index ? { ...item, [propName]: value } : item
                )
            });
        }
    }
    handleNewCertificateChange = (e: any, propName: any) => {
        //This function is the onChange event of all the fields in new certificate
        if (propName === 'issueDate') {
            const { value } = e.target;
            if (value) {
                this.setState({
                    errIssueDate: { status: '', msg: '' }
                });
            }
            else {
                this.setState({
                    errIssueDate: { status: 'error', msg: 'Please enter Certificate issue date.' }
                });
            }

            this.onNewCertificateFieldChange({ issueDate: value ? value.format('DD/MM/YYYY') : null });
            this.setState({
                issueDate: value ? value.format('DD/MM/YYYY') : null
            });
        }
        else {
            const { value } = e.target;
            if (!value) {
                if (propName === 'title') {
                    this.setState({
                        errTitle: { status: 'error', msg: 'Please enter Certificate title.' }
                    });
                }
            }
            else {

                if (propName === 'title') {
                    this.setState({
                        errTitle: { status: '', msg: '' }
                    });
                }
            }
            this.onNewCertificateFieldChange({ [propName]: value });
            this.setState({
                [propName]: value
            });
        }
    };
    onNewCertificateFieldChange = (updatedValue: any) => {
        //This function is to create the new certificate object
        this.setState({
            newCertificateFields: {
                ...this.state.newCertificateFields,
                ...updatedValue
            }
        });
    };

    saveNewCertificate = (e: any) => {
        e.preventDefault();
        if (this.validateRequiredNewFields()) {
            this.setState({ saveInProgress: true });
            var newArray = this.state.certificate.slice();
            newArray.push(this.state.newCertificateFields);
            this.setState({
                certificate: newArray
            });
            var candidateId = sessionStorage.getItem("candidateID");
            if (candidateId != null) {
                companyDatabase
                    .collection("CandidateInfo")
                    .doc(candidateId)
                    .update({ certificate: newArray })
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
                link: "",
                issueDate: null,
                description: "",
                errIssueDate: { status: '', msg: '' },
                errTitle: { status: '', msg: '' },
            });
            this.onNewCertificateFieldChange({
                title: "",
                link: "",
                issueDate: null,
                description: ""
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
                        certificate: data.certificate,
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
            errTitle: { status: '', msg: '' },
            errIssueDate: { status: '', msg: '' }
        });

        if (this.state.title.length === 0) {
            this.setState({
                errTitle: { status: 'error', msg: 'Please enter Certificate title.' }
            });
            flag = false;
        }
        if (!this.state.issueDate) {
            this.setState({
                errIssueDate: { status: 'error', msg: 'Please enter certificate issue date.' }
            });
            flag = false;
        }
        return flag;
    }
    validateRequiredFields = () => {
        let flag = true;
        const arr = this.state.certificate;
        this.setState({
            editErrTitle: { status: '', msg: '' },
            editErrIssueDate: { status: '', msg: '' }
        });
        if (arr[this.state.certificateEditIDX].title.length === 0) {
            this.setState({
                editErrTitle: { status: 'error', msg: 'Please enter certificate title.' }
            });
            flag = false;
        }
        if (!arr[this.state.certificateEditIDX].issueDate) {
            this.setState({
                editErrIssueDate: { status: 'error', msg: 'Please enter certificate issue date.' }
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
    validateCertificateInfoTab = () => {
        let flagError = false;
        if (this.state.certificateEditIDX >= 0)
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
            <Card title={<Title level={4} style={{ marginBottom: 0 }}>Certificate Details</Title>}>

                {this.state.loading ?
                    <Spin tip='Loading...'>
                        <Alert
                            message="Please wait !!"
                            description="System is gathering information from the server."
                            type="info"
                        />
                    </Spin>
                    :
                    <React.Fragment>
                        <Row>
                            <ButtonGroup style={{ width: '100%' }}>
                                <Button style={{ width: '50%' }} type="default" onClick={() => this.props.prevStep()}>
                                    <Icon type="left" />
                                    Go back
                        </Button>
                                <Button style={{ width: '50%' }} type="default" onClick={() => this.validateCertificateInfoTab()}>
                                    Go forward
                            <Icon type="right" />
                                </Button>
                            </ButtonGroup>
                        </Row>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                        <Row>
                            {this.state.certificate.length > 0 ?
                                <React.Fragment>
                                    {this.state.certificate.map((certificate: any, index: any) => (
                                        <Card key={index} type="inner" title={'Certificate #' + (index + 1)} style={{ marginTop: 10 }}
                                            extra={
                                                <div className="btn-group-sm">
                                                    <div className="btn btn-sm ">
                                                        {this.state.certificateEditIDX === index ? (
                                                            <span className="update" onClick={() => this.stopCertificateEditing(index)}><small>Save</small></span>
                                                        ) : (
                                                                <span className="edit" onClick={() => this.startCertificateEditing(index)}><small>Edit</small></span>
                                                            )}
                                                    </div>
                                                    <div className="btn btn-sm">
                                                        {this.state.certificateEditIDX === index ?
                                                            null
                                                            :
                                                            <Popconfirm
                                                                title="Are you sure delete this entry?"
                                                                onConfirm={() => this.handleDeleteCertificate(index)}
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
                                                    label={<span className={this.state.certificateEditIDX === index ? 'required' : ''}>Title</span>}
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                    validateStatus={this.state.certificateEditIDX === index ? this.state.editErrTitle.status : ''}
                                                    help={this.state.certificateEditIDX === index ? this.state.editErrTitle.msg : ''}
                                                >
                                                    <Input
                                                        disabled={this.state.certificateEditIDX === index ? false : true}
                                                        placeholder="Example: Microsoft ASP.NET professional certificate"
                                                        value={certificate.title}
                                                        id='title'
                                                        onChange={(e: any) => {
                                                            this.handleCertificateChange(e, "title", index);
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={<span>Certificate Link</span>}
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                // validateStatus={this.state.certificateEditIDX === index?this.state.editErrLink.status:''}
                                                // help={this.state.certificateEditIDX === index?this.state.editErrLink.msg:''}
                                                >
                                                    <Input
                                                        disabled={this.state.certificateEditIDX === index ? false : true}
                                                        placeholder="Example: Certificate link"
                                                        value={certificate.link}
                                                        id='link'
                                                        onChange={(e: any) => { this.handleCertificateChange(e, "link", index); }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label={<span className={this.state.certificateEditIDX === index ? 'required' : ''}>Issue date</span>}
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                    validateStatus={this.state.certificateEditIDX === index ? this.state.editErrIssueDate.status : ''}
                                                    help={this.state.certificateEditIDX === index ? this.state.editErrIssueDate.msg : ''}
                                                >
                                                    <DatePicker
                                                        disabled={this.state.certificateEditIDX === index ? false : true}
                                                        value={certificate.issueDate ? moment(certificate.issueDate, 'DD/MM/YYYY') : certificate.issueDate}
                                                        allowClear
                                                        onChange={(value: any) => { this.handleCertificateChange({ target: { value: value } }, "issueDate", index); }}
                                                        format={'DD/MM/YYYY'}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Description"
                                                    style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                                // validateStatus={this.state.errName.status}
                                                // help={this.state.errName.msg}
                                                >
                                                    <TextArea
                                                        disabled={this.state.certificateEditIDX === index ? false : true}
                                                        placeholder="Example: Information about the certificate."
                                                        autosize={{ minRows: 2, maxRows: 5 }}
                                                        value={certificate.description}
                                                        id="description"
                                                        onChange={(e: any) => {
                                                            this.handleCertificateChange(e, "description", index);
                                                        }}
                                                    />
                                                </Form.Item>
                                                {this.state.certificateEditIDX === index ?
                                                    <React.Fragment>
                                                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                                                        <Form.Item style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}>
                                                            <Button
                                                                loading={this.state.saveInProgress}
                                                                type="primary"
                                                                disabled={this.state.certificateEditIDX === index ? false : true}
                                                                // htmlType="submit"
                                                                block
                                                                onClick={() => this.stopCertificateEditing(index)}
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
                                Add Certificate
                        </Button>

                            <Modal
                                title="Add new Certificate"
                                style={{ top: 20 }}
                                onOk={this.saveNewCertificate}
                                onCancel={() => {
                                    this.setState({
                                        showModal: false,
                                        title: "",
                                        link: "",
                                        description: "",
                                        issueDate: null,
                                        errIssueDate: { status: '', msg: '' },
                                        errTitle: { status: '', msg: '' }
                                    })
                                }}
                                visible={this.state.showModal}
                                footer={[
                                    <Button key="back" onClick={() => {
                                        this.setState({
                                            showModal: false,
                                            title: "",
                                            link: "",
                                            description: "",
                                            issueDate: null,
                                            errIssueDate: { status: '', msg: '' },
                                            errTitle: { status: '', msg: '' }
                                        })
                                    }}>
                                        Cancel
                                    </Button>,
                                    <Button key="submit" type="primary" loading={this.state.saveInProgress} onClick={this.saveNewCertificate}>
                                        Submit
                                    </Button>,
                                ]}
                            >
                                <Form layout={'vertical'}>
                                    <Form.Item
                                        label={<span className="required">Certificate Title</span>}
                                        style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                        validateStatus={this.state.errTitle.status}
                                        help={this.state.errTitle.msg}
                                    >
                                        <Input
                                            placeholder="Example: Microsoft ASP.NET professional certificate"
                                            value={this.state.title}
                                            id='title'
                                            onChange={(e: any) => {
                                                this.handleNewCertificateChange(e, "title");
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={<span>Certificate Link</span>}
                                        style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                    // validateStatus={this.state.errLink.status}
                                    // help={this.state.errLink.msg}
                                    >
                                        <Input
                                            placeholder="Example: Certificate link"
                                            value={this.state.link}
                                            id='link'
                                            onChange={(e: any) => { this.handleNewCertificateChange(e, "link"); }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="required">Duration</span>}
                                        style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                        validateStatus={this.state.errIssueDate.status}
                                        help={this.state.errIssueDate.msg}
                                    >
                                        <DatePicker
                                            value={this.state.issueDate ? moment(this.state.issueDate, 'DD/MM/YYYY') : this.state.issueDate}
                                            allowClear
                                            // onChange={(e: any) => { this.handleNewCertificateChange(e, "issueDate"); }}
                                            onChange={(value: any) => { this.handleNewCertificateChange({ target: { value: value } }, "issueDate"); }}

                                            format={'DD/MM/YYYY'}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Description"
                                        style={{ marginBottom: 5, marginTop: 5, textAlign: 'left' }}
                                    // validateStatus={this.state.errName.status}
                                    // help={this.state.errName.msg}
                                    >
                                        <TextArea
                                            placeholder="Example: Information about the certificate."
                                            autosize={{ minRows: 2, maxRows: 5 }}
                                            value={this.state.description}
                                            id="description"
                                            onChange={(e: any) => {
                                                this.handleNewCertificateChange(e, "description");
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


export default CertificateDetails;

