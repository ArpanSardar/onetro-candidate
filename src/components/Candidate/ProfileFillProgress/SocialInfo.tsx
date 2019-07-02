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
    jobProfiles,
    workExperienceOptions,
    // workExperiences,
    skillOptions,
    languageOptions
} from "../HomePage/AutoComplete/data";
import {
    AutoComplete, Select,
    Upload, Modal,Spin,
    DatePicker, Popover,
    Form, Input,Card,Alert,
    Typography, Row, Col,
    Affix, Layout, Badge, Divider,
    notification, Icon, Progress,
    Steps, Button, message
} from 'antd';
const { Title, Text } = Typography;
const Option = Select.Option;

const { Header, Footer, Sider, Content } = Layout;
const ButtonGroup = Button.Group;
import 'antd/dist/antd.css';
import { ProgressBar, Navbar, Nav } from "react-bootstrap";
import moment from 'moment';
import './style.css';

const emailRegEx = RegExp(
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
);
interface IProps {
    [key: string]: any;

}
interface IDispProps { }
interface IState {
    [key: string]: any;
}


class SocialInfo extends React.Component<IProps & IDispProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            candidate: {},
            currentTab: 0,
            previewVisible: false,
            previewImage: '',
            socialInfoEdit: true,
            loading: true,
            imageloading: false,
            saveInProgress: false,
            newProfilePic: {},
            newProfilePicURL: "",
            errName: { status: '', msg: '' },
            errDOB: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errJobProfile: { status: '', msg: '' },
            errExperience: { status: '', msg: '' },
            errEmail: { status: '', msg: '' }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleObjectChange = this.handleObjectChange.bind(this);
        this.handleChangePlace = this.handleChangePlace.bind(this);
        this.handleChangeJobProfile = this.handleChangeJobProfile.bind(this);
        this.handleChangeDOB = this.handleChangeDOB.bind(this);
        this.handleChangeExperience = this.handleChangeExperience.bind(this);
        this.handleImageUploadChange = this.handleImageUploadChange.bind(this);
        this.handleBeforeImageUpload = this.handleBeforeImageUpload.bind(this);
    }
    handleImagePreviewCancel = () => this.setState({ previewVisible: false });
    handleImagePreview = (file: any) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handleBeforeImageUpload = (file: any) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }
    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    handleImageUploadChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({
                imageloading: true
            });
            return;
        }
        if (info.file.status === 'done') {

            let file = info.file.originFileObj;
            var reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    newProfilePic: file,
                    newProfilePicURL: reader.result,
                    candidate: { ...this.state.candidate, img: reader.result },
                    imageloading: false
                });
            };
            reader.readAsDataURL(info.file.originFileObj);
        }

    }
    handleObjectChange(e: any) {
        let target = e.target;
        let value = target.value;
        let name = target.id;

        if (name === 'email') {
            if (!emailRegEx.test(value)) {
                this.setState({
                    errEmail: { status: 'error', msg: 'Please enter your communication E-Mail in proper format.' }
                });
            }
            else {
                this.setState({
                    errEmail: { status: '', msg: '' }
                });
            }
        }
        this.setState({
            candidate: { ...this.state.candidate, [name]: value }
        });
    }
    handleChangePlace(place: any) {
        if (place.length === 0) {
            this.setState({
                errPlace: { status: 'error', msg: 'Please enter your country.' }
            });
        }
        else {
            this.setState({
                errPlace: { status: '', msg: '' }
            });
        }
        this.setState({
            candidate: { ...this.state.candidate, place: place ? place : "" }
        });
    }
    handleChangeJobProfile(JobProfile: any) {
        if (JobProfile.length === 0) {
            this.setState({
                errJobProfile: { status: 'error', msg: 'Please enter your Job Profile. Ex: Software Developer.' }
            });
        }
        else {
            this.setState({
                errJobProfile: { status: '', msg: '' }
            });
        }
        this.setState({
            candidate: { ...this.state.candidate, JobProfile: JobProfile ? JobProfile : "" }
        });
    }
    handleChangeExperience(experience: any) {
        if (experience.length === 0 || experience === '0') {
            this.setState({
                errExperience: { status: 'error', msg: 'Please enter your experience. Ex: 5+ Years.' }
            });
        }
        else {
            this.setState({
                errExperience: { status: '', msg: '' }
            });
        }
        this.setState({
            candidate: { ...this.state.candidate, experience: experience ? experience : "" }
        });
    }
    handleChangeDOB = (date: any, dateString: any) => {
        if (dateString.length === 0) {
            this.setState({
                errDOB: { status: 'error', msg: 'Please enter your Date of Birth.' }
            });
        }
        else {
            this.setState({
                errDOB: { status: '', msg: '' }
            });
        }
        this.setState({
            candidate: { ...this.state.candidate, dob: dateString },
        });
    };
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
            errName: { status: '', msg: '' },
            errDOB: { status: '', msg: '' },
            errPlace: { status: '', msg: '' },
            errJobProfile: { status: '', msg: '' },
            errExperience: { status: '', msg: '' },
            errEmail: { status: '', msg: '' }
        });
            if (!this.state.candidate.name) {

            this.setState({
                errName: { status: 'error', msg: 'Please enter your name.' }
            });
            flag = false;
        }
            if (!this.state.candidate.place) {

            this.setState({
                errPlace: { status: 'error', msg: 'Please enter your country.' }
            });
            flag = false;
        }
            if (!this.state.candidate.JobProfile) {

            this.setState({
                errJobProfile: { status: 'error', msg: 'Please enter your Job Profile. Ex: Software Developer' }
            });
            flag = false;
        }
            if (!this.state.candidate.experience|| this.state.candidate.experience === '0') {

            this.setState({
                errExperience: { status: 'error', msg: 'Please enter your experience. Ex: 5+ Years.' }
            });
            flag = false;
        }
            if (!this.state.candidate.dob) {

            this.setState({
                errDOB: { status: 'error', msg: 'Please enter your Date of Birth.' }
            });
            flag = false;
        }
        if (!emailRegEx.test(this.state.candidate.email)) {
            this.setState({
                errEmail: { status: 'error', msg: 'Please enter your communication E-Mail in proper format.' }
            });
            flag = false;
        }
        return flag;
    }
    handleSubmit = (e: any) => {
        e.preventDefault();
        if (this.validateRequiredFields()) {
            // message.success('Data updated successfully');
            this.setState({ saveInProgress: true });
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
                        skypeId: this.state.candidate.skypeId,
                        email: this.state.candidate.email,
                        dob: this.state.candidate.dob
                      })
                      .then(() => {
                        this.setState({
                          newProfilePic: {},
                          newProfilePicURL: "",
                          socialInfoEdit: true,
                          saveInProgress:false,
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
        companyDatabase
            .collection("CandidateInfo")
            .doc(this.state.candidate.id)
            .update({
                name: this.state.candidate.name,
                place: this.state.candidate.place,
                JobProfile: this.state.candidate.JobProfile,
                experience: this.state.candidate.experience,
                skypeId: this.state.candidate.skypeId,
                email: this.state.candidate.email,
                dob: this.state.candidate.dob,
            })
            .then(() => {
                  this.setState({
                    socialInfoEdit: true,
                    newProfilePic: {},
                    newProfilePicURL: "",
                    saveInProgress:false,
                    progress: 0
                  });
                message.success('Data updated successfully');

            })
            .catch(function (error: any) {
                message.error('Error in updating data !');
            });
        }
        }
        else {
            message.error('Error in updating data !');
            this.setState({ socialInfoEdit: false });
        }
        
    };
    handleEdit = () => {
        this.setState({ socialInfoEdit: false });
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
    validateSocialInfoTab=()=>{
        let flagError=false;
        if(!this.validateRequiredFields())
          flagError=true;
    
        if(flagError)
        {
          this.openNotificationWithIcon();
          this.setState({socialInfoEdit:false});
        }
        else
        {
            const editFlag= this.state.socialInfoEdit;
            if(!editFlag){
                notification.open({
                    message: 'Save your information',
                    description:
                      'Please save your data before proceed to next step.',
                    duration: 0,
                    icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />
              
                  });
            }
            else{
                this.props.nextStep();
            }
        }
      }
    render() {
        const { currentTab } = this.state;
        const { previewVisible, previewImage, fileList } = this.state;
        const experienceOptions = workExperienceOptions.map((d: any) => <Option key={d.value}>{d.label}</Option>);
        const uploadButton = (
            <div>
                <Icon type={this.state.imageloading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <React.Fragment>
            {this.state.loading?
                <Card title={<Title level={4} style={{ marginBottom: 0 }}>About You</Title>}>
                    <Spin tip='Loading...'>
                        <Alert
                        message="Please wait !!"
                        description="System is gathering information from the server."
                        type="info"
                        />
                    </Spin>
                </Card>
                :
            <Card title={<Title level={4} style={{ marginBottom: 0 }}>About You</Title>}
            extra={
                <Button type="dashed" style={{ marginTop: 10 }} onClick={this.handleEdit} disabled={!this.state.socialInfoEdit}>Edit</Button>
            }
            >
                <Row>

<ButtonGroup style={{ width: '100%' }}>
    <Button style={{ width: '50%' }} type="default" disabled={true}>
        <Icon type="left" />
        Go back
        </Button>
    <Button style={{ width: '50%' }} type="default" onClick={() => this.validateSocialInfoTab()}>
        Go forward
            <Icon type="right" />
    </Button>
</ButtonGroup>
</Row>
                            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                <Form layout={'vertical'} onSubmit={this.handleSubmit}>
                    <Form.Item
                        style={{ marginBottom: 5, marginTop: 5,paddingBottom:0, textAlign:'left' }}
                        label={<span className={!this.state.socialInfoEdit?'required':''}>Profile Picture</span>}
                        >
                        <div className="clearfix">
                            <Badge count={this.state.candidate.starsEarned ? this.state.candidate.starsEarned + ' ★' : '0 ★'} >
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    disabled={this.state.socialInfoEdit}
                                    // onPreview={this.handleImagePreview}
                                    onChange={this.handleImageUploadChange}
                                    beforeUpload={this.handleBeforeImageUpload}
                                >
                                    {/* {fileList.length>=1? null : uploadButton} */}
                                    {this.state.candidate.img ?
                                        <img className="profileImage" src={this.state.imageloading ? imgloader : this.state.candidate.img} alt="avatar" />
                                        : uploadButton}
                                </Upload>
                            </Badge>
                        </div>
                        {this.state.socialInfoEdit ? null
                            : <React.Fragment>
                                <Badge color='red' />
                                <small><i><Text disabled>Click on the image above to upload new.</Text></i></small><br/>
                                <Badge color='red' />
                                <small><i><Text disabled>Only JPG file less than 2 MB of size is allowed.</Text></i></small>
                            </React.Fragment>
                        }
                        
                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.socialInfoEdit?'required':''}>Name</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errName.status}
                        help={this.state.errName.msg}
                    >
                        <Input
                            disabled={this.state.socialInfoEdit}
                            placeholder="Example: John Doe"
                            value={this.state.candidate.name}
                            id='name'
                            onChange={this.handleObjectChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.socialInfoEdit?'required':''}>Date of Birth</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errDOB.status}
                        help={this.state.errDOB.msg}
                    >
                        <DatePicker
                            disabled={this.state.socialInfoEdit}
                            value={this.state.candidate.dob ? moment(this.state.candidate.dob, 'DD/MM/YYYY') : this.state.candidate.dob}
                            // value={this.state.candidate.dob}
                            allowClear
                            onChange={this.handleChangeDOB}
                            format={'DD/MM/YYYY'}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.socialInfoEdit?'required':''}>Current Location</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errPlace.status}
                        help={this.state.errPlace.msg}
                    >
                        <AutoComplete
                            disabled={this.state.socialInfoEdit}
                            dataSource={countries}
                            placeholder="Example: India"
                            id='place'
                            value={this.state.candidate.place}
                            onChange={this.handleChangePlace}
                            allowClear={true}
                            filterOption={(inputValue: any, option: any) =>
                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.socialInfoEdit?'required':''}>Job Profile</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errJobProfile.status}
                        help={this.state.errJobProfile.msg}
                    >
                        <AutoComplete
                            disabled={this.state.socialInfoEdit}
                            dataSource={jobProfiles}
                            placeholder="Example: Software Developer"
                            id='JobProfile'
                            value={this.state.candidate.JobProfile}
                            onChange={this.handleChangeJobProfile}
                            allowClear={true}
                            filterOption={(inputValue: any, option: any) =>
                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />

                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.socialInfoEdit?'required':''}>Years of Experience</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errExperience.status}
                        help={this.state.errExperience.msg}
                    >
                        <Select
                            showSearch
                            disabled={this.state.socialInfoEdit}
                            value={this.state.candidate.experience === "0" ? null : this.state.candidate.experience}
                            placeholder="Example: 2+ Years"
                            optionFilterProp="children"
                            onChange={this.handleChangeExperience}
                            filterOption={false}
                        >
                            {experienceOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={<span className={!this.state.socialInfoEdit?'required':''}>E-Mail</span>}
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                        validateStatus={this.state.errEmail.status}
                        help={this.state.errEmail.msg}
                    >
                        <Input
                            disabled={this.state.socialInfoEdit}
                            placeholder="Example: john@live.com"
                            value={this.state.candidate.email}
                            id='email'
                            onChange={this.handleObjectChange}
                        />
                    </Form.Item>
                    <Form.Item label="Skype ID"
                        style={{ marginBottom: 5, marginTop: 5, textAlign:'left' }}
                    >
                        <Input
                            disabled={this.state.socialInfoEdit}
                            placeholder="Example: john@live.com"
                            value={this.state.candidate.skypeId}
                            id='skypeId'
                            onChange={this.handleObjectChange}
                        />
                    </Form.Item>
                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />

                    <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                        <Button 
                        loading={this.state.saveInProgress} 
                        type="primary" 
                        disabled={this.state.socialInfoEdit} 
                        htmlType="submit" 
                        block>Save</Button>
                    </Form.Item>
                </Form>
                
            </Card>
    }
    </React.Fragment>
        )
    }
}


export default SocialInfo;

