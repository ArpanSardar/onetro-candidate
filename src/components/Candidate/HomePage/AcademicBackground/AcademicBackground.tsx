import React, { Component } from "react";
import swal from "sweetalert";
import {
  firebaseService,
  candidateAuth,
  candidateDatabase,
  candidateStorage,
  companyDatabase,
  companyStorage
} from "../../../../services/FirebaseCandidateService";
import DatePicker from "react-datepicker";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import '../CareerHistory/style.css';
import { Skeleton,Divider,Empty ,notification,Icon,Progress,Steps, Button, message } from 'antd';
import 'antd/dist/antd.css';

interface IProps {
  [key: string]: any;
}

interface IState {
  [key: string]: any;
}

class AcademicBackground extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      education: [],
      educationEditIDX: -1,
      newEducationFields: {},
      instituteName: "",
      degree: "",
      schedule: "",
      activity: "",
      description: "",
      newStartDate:null,
      newEndDate:null,
      loading:true
    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", msg, type);
  }
  educationHandleChange = (e: any, propName: any, index: any) => {
    if(propName=="startDate" ||propName=="endDate"){
      this.setState({
        education: this.state.education.map((item: any, j: any) =>
          j === index ? { ...item, [propName]: e===null?null:firebaseService.firestore.Timestamp.fromDate(e) } : item
        )
      });
    }
    else{
      const { value } = e.target;
    this.setState({
      education: this.state.education.map((item: any, j: any) =>
        j === index ? { ...item, [propName]: value } : item
      )
    });
  }
  };
  startEducationEditing = (index: any) => {
    this.setState({ educationEditIDX: index });
  };
  stopEducationEditing = (index: any) => {
    this.setState({ educationEditIDX: -1 });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        .update({
          education: this.state.education
        })
        .then(() => {
          // this.AlertMessage("Data updated successfully", "success");
          message.success('Data updated successfully');

        })
        .catch(function(error: any) {
          message.error('Error in data update.');

        });
    }
  };
  handleEducationPostings = (index: any) => {
    this.state.educationEditIDX === index;
  };
  deleteEducationPressed = (index: any) => {
    swal({
      title: "Are you sure you want to delete？",
      // text: "一旦募集を削除すると、元に戻すことはできません",
      icon: "warning",
      dangerMode: true
    }).then((willDelete: any) => {
      if (willDelete) {
        this.handleDeleteEducation(index);
      } else {
      }
    });
  };
  handleDeleteEducation = (index: any) => {
    this.setState({
      education: this.state.education.filter(
        (job: any, jobindex: any) => jobindex != index
      )
    });
    
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        .update({
          education: this.state.education.filter(
            (job: any, i: any) => i != index
          )
        })
        .then(() => {
          // this.AlertMessage("Data deleted successfully", "success");
          message.warning('Data deleted !');

        })
        .catch(function(error) {
          message.error('Error removing data.');
        });
    }
  };

  onNewEducationFieldChange = (updatedValue: any) => {
    this.setState({
      newEducationFields: {
        ...this.state.newEducationFields,
        ...updatedValue
      }
    });
  };
  onchangeNewEducation = (e: any) => {
    this.onNewEducationFieldChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  saveNewEducation = (e: any) => {
    e.preventDefault();
    var newArray = this.state.education.slice();
    newArray.push(this.state.newEducationFields);
    this.setState({
      education: newArray,
      // candidate: { ...this.state.candidate, education: newArray }
    });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        //   .set({ ...this.state.candidate, education: newArray })
        .update({ education: newArray })
        .then(() => {
          // this.AlertMessage("Data addedd successfully", "success");
          message.success('Data added successfully');

        })
        .catch(function(error: any) {
          message.error('Error while adding new data.');
        });
    }
    this.setState({
      instituteName: "",
      degree: "",
      schedule: "",
      activity: "",
      description: "",
      newStartDate:null,
      newEndDate:null
    });
    this.onNewEducationFieldChange({
      instituteName: "",
      degree: "",
      schedule: "",
      activity: "",
      description: "",
      newStartDate:null,
      newEndDate:null
    });
  };
  handleChangeNewStartDate = (value: any) => {
    this.onNewEducationFieldChange({ startDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      newStartDate: value
    });
  };
  handleChangeNewEndDate = (value: any) => {
    this.onNewEducationFieldChange({ endDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      newEndDate: value
    });
  };
  // componentDidUpdate(prevProps: any) {
  //   if (prevProps.education !== this.props.education) {
  //     this.setState({
  //       education: this.props.education
  //     });
  //   }
  // }
  componentDidMount() {
    companyDatabase
      .collection("CandidateInfo")
      .where("id", "==", sessionStorage.getItem("candidateID"))
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = doc.data();
          this.setState({
            education: data.education            
          });
        });
      })
      .then(()=>{
        this.setState({
          loading: false           
        });
      })
      // this.setState({
      //   education: this.props.education
      // });
    
  }
  openNotificationWithIcon = () => {
    notification.open({
      message: 'Insufficient Information',
      description:
        'Please update your Education information in this page to proceed in next page.',
      duration: 0,
      icon: <Icon type="exclamation-circle" style={{ color: '#FF0000' }} />

    });
  };
  validateEducationInfoTab=()=>{
    let flagError=false;
    if(this.state.education.length===0)
      flagError=true;

    if(flagError)
    {
      this.openNotificationWithIcon();
    }
    else
    {
      this.props.nextStep();
    }
  }
  render() {
    console.log(this.props.education);

    return (

      <React.Fragment>
        {this.state.loading?
         <Skeleton active/>
        :
        <React.Fragment>

        <div className="row">
        {this.props.navigationVisible?
        <div className="steps-action col-lg-12">
        <Button style={{ marginLeft: 8 }} onClick={() => this.props.prevStep()}>
        <Icon type="left" />
          Previous
        </Button>
        <Button type="primary" onClick={() => this.validateEducationInfoTab()}>
            Next
            <Icon type="right" />
        </Button>
        
        </div>
        :null
        }
        <Divider>Academic Background</Divider>
        <div id="modalEducation" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="close">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body text-left">
                    <form>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Institute Name</strong>
                          </small>
                        </label>
                        <input
                          type="text"
                          onChange={e => this.onchangeNewEducation(e)}
                          className="form-control"
                          name="instituteName"
                          id="instituteName"
                          value={this.state.instituteName}
                          placeholder="Ex: Stanford University"
                          required
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Start Date</strong>
                          </small>
                        </label>
                        <DatePicker
                          className="datePicker form-control"
                          selected={this.state.newStartDate}
                          onChange={this.handleChangeNewStartDate}
                          dateFormat="d MMMM, yyyy"
                          placeholderText="Click to select start date"
                          showMonthDropdown
                          showYearDropdown
                          selectsStart
                          startDate={this.state.newStartDate}
                          endDate={this.state.newEndDate}
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>End Date</strong>
                            &ensp;
                          <small><strong><span className="currentCompanyNote">Do not select End Date if this is your Current Academy.</span></strong></small>
                          </small>
                        </label>
                        <DatePicker
                          className="datePicker form-control"
                          selected={this.state.newEndDate}
                          onChange={this.handleChangeNewEndDate}
                          dateFormat="d MMMM, yyyy"
                          placeholderText="Click to select end date"
                          showMonthDropdown
                          showYearDropdown
                          selectsEnd
                          startDate={this.state.newStartDate}
                          endDate={this.state.newEndDate}
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Degree</strong>
                          </small>
                        </label>
                        <input
                          type="text"
                          onChange={e => this.onchangeNewEducation(e)}
                          className="form-control"
                          name="degree"
                          id="degree"
                          value={this.state.degree}
                          placeholder="Ex: B. Tech or Bachelor of Technology"
                          required
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Activities/Projects</strong>
                          </small>
                        </label>
                        <textarea
                          onChange={e => this.onchangeNewEducation(e)}
                          className="form-control"
                          name="activity"
                          id="activity"
                          rows={2}
                          value={this.state.activity}
                          placeholder="Ex: Active participant on social service."
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Description</strong>
                          </small>
                        </label>
                        <textarea
                          onChange={e => this.onchangeNewEducation(e)}
                          className="form-control"
                          name="description"
                          id="description"
                          value={this.state.description}
                          rows={3}
                          placeholder="Ex: Full time Degree in Computer Science."
                        />
                      </div>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={this.saveNewEducation}
                        type="button"
                        data-dismiss="modal"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        <div className="row">
            {this.state.education.length===0?
              <div className="col-lg-12">
              <Empty />
              </div>
              :
              <React.Fragment>
              {this.state.education.map((work: any, index: any) => (
                <div key={index} className="chipProfileDetails col-lg-12">
                  <div className="row">
                  {/* <div className="col-lg-9" />*/}
                    <div className="col-lg-12 text-right">
                        <div className="btn-group-sm">
                          <div className="btn btn-sm">
                            {this.state.educationEditIDX === index ? (
                              <span className="update" onClick={() => this.stopEducationEditing(index)}><small>Save</small></span>

                            ) : (
                              <span className="edit" onClick={() => this.startEducationEditing(index)}><small>Edit</small></span>

                            )}
                          </div>
                          <div
                            className="btn btn-sm"
                            // onClick={() => this.deleteEducationPressed(index)}
                          >
                            {this.state.educationEditIDX === index ? (
                              <div />
                            ) : (
                              <span className="delete" onClick={() => this.deleteEducationPressed(index)}><small>Delete</small></span>

                            )}
                          </div>
                        </div>
                        <hr/>
                      </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      {this.state.educationEditIDX === index ? (
                        <div className="form-group input-group-md">
                          <label>
                            <small>
                              <strong>Institute Name</strong>
                            </small>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="instituteName"
                            value={work.instituteName}
                            placeholder="Ex: Stanford University"
                            onChange={(e: any) => {
                              this.educationHandleChange(e, "instituteName", index);
                            }}
                            required
                          />
                          
                        </div>
                      ) : (
                        <div>
                          <span className="workExperience-Title">
                            {work.instituteName}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                      {this.state.educationEditIDX === index ? (
                        <div className="form-group input-group-md">
                          <label>
                            <small>
                              <strong>Start Date</strong>
                            </small>
                          </label>
                        
                          <DatePicker
                            className="datePicker form-control"
                            selected={work.startDate?work.startDate.toDate():null}
                            onChange={(e: any) => {
                              this.educationHandleChange(e, "startDate", index);
                            }}
                            dateFormat="d MMMM, yyyy"
                            placeholderText="Click to select start date"
                            showMonthDropdown
                            showYearDropdown
                            selectsStart
                            startDate={work.startDate?work.startDate.toDate():null}
                            endDate={work.endDate?work.endDate.toDate():null}
                          />
                          <label>
                            <small>
                              <strong>End Date</strong>
                            </small>
                          </label>
                          <DatePicker
                            className="datePicker form-control"
                            selected={work.endDate?work.endDate.toDate():null}
                            onChange={(e: any) => {
                              this.educationHandleChange(e, "endDate", index);
                            }}
                            dateFormat="d MMMM, yyyy"
                            placeholderText="Click to select a date"
                            showMonthDropdown
                            showYearDropdown
                            selectsStart
                            startDate={work.startDate?work.startDate.toDate():null}
                            endDate={work.endDate?work.endDate.toDate():null}
                          />
                        </div>
                      ) : (
                          <span className="skillSetLocation">
                            <i className="material-icons">
                              schedule
                            </i>
                            {work.startDate ? (
                              <span>
                              <span className="itemName">
                                {new Intl.DateTimeFormat('en-GB', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: '2-digit' 
                                }).format(work.startDate.toDate())}
                              </span>~
                              {work.endDate ?
                              <span className="itemName">
                                {new Intl.DateTimeFormat('en-GB', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: '2-digit' 
                                }).format(work.endDate.toDate())}
                              </span>:<span className="itemName">Present</span>
                            }
                            </span>
                            ) : (
                                <span className="itemName">
                                  | click edit and update time period |
                              </span>
                              )}
                          </span>
                      )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      {this.state.educationEditIDX === index ? (
                        <div className="form-group input-group-md">
                          <label>
                            <small>
                              <strong>Degree</strong>
                            </small>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="degree"
                            value={work.degree}
                            placeholder="Ex: B.Tech or Bachelor of Technology"
                            onChange={(e: any) => {
                              this.educationHandleChange(e, "degree", index);
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="workExperience-CpmpanyName">
                            {work.degree}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-12">
                      {this.state.educationEditIDX === index ? (
                        <div className="form-group input-group-md">
                          <label>
                            <small>
                              <strong>Activities/Projects</strong>
                            </small>
                          </label>
                          <textarea
                            onChange={(e: any) => {
                              this.educationHandleChange(e, "activity", index);
                            }}
                            className="form-control"
                            name="activity"
                            id="activity"
                            rows={2}
                            placeholder="Ex: Active participant in social service."
                            value={work.activity}
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="description">{work.activity}</p>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-12">
                      {this.state.educationEditIDX === index ? (
                        <div className="form-group input-group-md">
                          <label>
                            <small>
                              <strong>Description</strong>
                            </small>
                          </label>
                          <textarea
                            onChange={(e: any) => {
                              this.educationHandleChange(e, "description", index);
                            }}
                            className="form-control"
                            name="description"
                            id="description"
                            rows={3}
                            placeholder="Ex: Full time degree on Computer Science."
                            value={work.description}
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="description">{work.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))}
              </React.Fragment>
            }
        </div>
        <div className="row">
        <Button type="dashed" block size={'large'} data-toggle="modal"
              data-target="#modalEducation">
          <Icon type="plus" />
          Add Education Details
          <Icon type="plus" />
        </Button>
        </div>
        </React.Fragment>

        }
      </React.Fragment>
    );
  }
}

export default AcademicBackground;
