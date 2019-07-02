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
import {skillOptions , countryOptions} from '../AutoComplete/data';
import AutoSuggest from '../AutoComplete/AutoSuggest';
import DatePicker from "react-datepicker";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import './style.css';
import { Skeleton,Divider,notification,Icon,Progress,Steps, Button, message } from 'antd';
import 'antd/dist/antd.css';

interface IProps {
  // workexperience: any;
  [key: string]:any;
}

interface IState {
  [key: string]: any;
}

class CareerHistory extends React.Component<IProps, IState> {
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
      newStartDate:null,
      newEndDate:null,
      skills:[],
      loading:true
    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", msg, type);
  }
  workExperienceHandleChange = (e: any, propName: any, index: any) => {
    if(propName=="startDate" ||propName=="endDate")
    {
       this.setState({
        workexperience: this.state.workexperience.map((item: any, j: any) =>
          j === index ? { ...item, [propName]: e===null?null:firebaseService.firestore.Timestamp.fromDate(e) } : item
        )
      });
    }
    else{
    const { value } = e.target;
    this.setState({
      workexperience: this.state.workexperience.map((item: any, j: any) =>
        j === index ? { ...item, [propName]: value } : item
      )
    });
  }
  };
  startWorkExperienceEditing = (index: any) => {
    this.setState({ workExperienceEditIDX: index });
  };
  stopWorkExperienceEditing = (index: any) => {
    this.setState({ workExperienceEditIDX: -1 });
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
          // this.AlertMessage("Data updated successfully", "success");
        })
        .catch(function(error: any) {
          message.error('Error in data update !');
        });
    }
  };
  handleWorkExperiencePostings = (index: any) => {
    this.state.workExperienceEditIDX === index;
  };
  deleteWorkExperiencePressed = (index: any) => {
    swal({
      title: "Are you sure you want to delete？",
      // text: "一旦募集を削除すると、元に戻すことはできません",
      icon: "warning",
      dangerMode: true
    }).then((willDelete: any) => {
      if (willDelete) {
        this.handleDeleteWorkExperience(index);
      } else {
      }
    });
  };
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
          // this.AlertMessage("Data deleted successfully", "success");
        })
        .catch(function(error) {
          message.error('Data while removing data !');
        });
    }
  };

  onNewWorkExperienceFieldChange = (updatedValue: any) => {
    this.setState({
      newWorkExperienceFields: {
        ...this.state.newWorkExperienceFields,
        ...updatedValue
      }
    });
  };
  onchangeNewWorkExperience = (e: any) => {
    this.onNewWorkExperienceFieldChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  saveNewWorkExperience = (e: any) => {
    e.preventDefault();

    var newArray = this.state.workexperience.slice();
    newArray.push(this.state.newWorkExperienceFields);
    this.setState({
      workexperience: newArray
      //   candidate: { ...this.state.candidate, workExperience: newArray }
    });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        //   .set({ ...this.state.candidate, workExperience: newArray })
        .update({ workExperience: newArray })
        .then(() => {
          // this.AlertMessage("Data added successfully", "success");
          message.success('Data added successfully');

        })
        .catch(function(error: any) {
          message.error('Error while adding data !');
        });
    }
    this.setState({
      title: "",
      company: "",
      schedule: "",
      place: "",
      description: "",
      newStartDate:null,
      newEndDate:null,
      skillsUsed:[]
    });
    this.onNewWorkExperienceFieldChange({
      title: "",
      company: "",
      schedule: "",
      place: "",
      description: "",
      newStartDate:null,
      newEndDate:null,
      skillsUsed:[]
    });
  };
  handleChangePlace = (value: any) => {
    this.onNewWorkExperienceFieldChange({ place: value });
    this.setState({
      place: value
    });
  }
  handleChangeSkills = (value: any) => {
    this.onNewWorkExperienceFieldChange({ skillsUsed: value });
    this.setState({
      skillsUsed: value
    });
  }

  handleChangeNewStartDate = (value: any) => {
    this.onNewWorkExperienceFieldChange({ startDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      newStartDate: value
    });
  };
  handleChangeNewEndDate = (value: any) => {
    this.onNewWorkExperienceFieldChange({ endDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      newEndDate: value
    });
  };
  // componentDidUpdate(prevProps: any) {
  //   if (prevProps.workexperience !== this.props.workexperience) {
  //     this.setState({
  //       workexperience: this.props.workexperience
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
            workexperience: data.workExperience
          });
        });
      })
      .then(()=>{
        this.setState({
          loading: false           
        });
      });
      // this.setState({
      //   workexperience: this.props.workexperience
      // });
    
  }

  render() {
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
          <Button type="primary" onClick={() => this.props.nextStep()}>
              Next
              <Icon type="right" />
          </Button>
          
        </div>
        :null}
        <Divider>Work Experience</Divider>

        </div>
        {/* {this.state.workexperience.length > 0 ? null : 
                      <div> <h1 className="workExperience-Title">
                      No Record Found
                      </h1> </div>
                    } */}
        <div className="row">
        {this.state.workexperience.map((work: any, index: any) => (
          <div key={index} className="chipProfileDetails col-lg-12">
            <div  className="row">
              <div className="col-lg-12 text-right">
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
                       :<span className="delete" onClick={() => this.deleteWorkExperiencePressed(index)}><small>Delete</small></span>
                      }
                    </div>
                  </div>
                  <hr/>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                {this.state.workExperienceEditIDX === index ? (
                  <div className="form-group input-group-md">
                    <label>
                      <small>
                        <strong>Job Title</strong>
                      </small>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      value={work.title}
                      onChange={(e: any) => {
                        this.workExperienceHandleChange(e, "title", index);
                      }}
                    />
                   
                  </div>
                ) : (
                  <div>
                    <span className="workExperience-Title">{work.title}</span>
                 </div>
                )}
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                {this.state.workExperienceEditIDX === index ? (
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
                        this.workExperienceHandleChange(e, "startDate", index);
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
                    {/* &ensp; */}
                    <span className="currentCompanyNote form-control text-left"><small><small><strong>Do not select End Date if this is your Current Company.</strong></small></small></span>
                             
                    <DatePicker
                      className="datePicker form-control"
                      selected={work.endDate?work.endDate.toDate():null}
                      onChange={(e: any) => {
                        this.workExperienceHandleChange(e, "endDate", index);
                      }}
                      dateFormat="d MMMM, yyyy"
                      placeholderText="Click to select a date"
                      showMonthDropdown
                      showYearDropdown
                      selectsStart
                      startDate={work.startDate?work.startDate.toDate():null}
                      endDate={work.endDate?work.endDate.toDate():null}
                    />
                    {/* </div> */}
                  </div>
                ) : (
                  <div>
                    
                    <span className="skillSetLocation">
                      <i className="material-icons ">
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
                        {work.endDate?
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
                    
                  </div>
                )}
                
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                {this.state.workExperienceEditIDX === index ? (
                  <div className="form-group input-group-md">
                    <label>
                      <small>
                        <strong>Company Name</strong>
                      </small>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="company"
                      value={work.company}
                      onChange={(e: any) => {
                        this.workExperienceHandleChange(e, "company", index);
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <span className="workExperience-CpmpanyName">
                      {work.company}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                {this.state.workExperienceEditIDX === index ? (
                  <div className="form-group input-group-md">
                    <label>
                      <small>
                        <strong>Place</strong>
                      </small>
                    </label>
                    <AutoSuggest
                          handleChange={(value: any) => {
                            this.workExperienceHandleChange({target:{value:value}}, "place", index);
                          }}
                          // handleChange={this.handleChangePlace}
                          options={countryOptions}
                          isMulti={false}
                          creatable={false}
                          defaultValue={work.place ? work.place : null}
                        />
                  </div>
                ) : (
                  <div>
                    <p className="skillSetLocation">
                      <i className="material-icons ">place</i>
                      {work.place}
                    </p>
                  </div>
                )}
                
              </div>
              <div className="col-lg-12">
              {this.state.workExperienceEditIDX === index ? (
              <div className="form-group input-group-md">
                <label>
                          <small>
                            <strong>Skills Used</strong>
                          </small>
                        </label>
                        <AutoSuggest
                          handleChange={(value: any) => {
                            this.workExperienceHandleChange (
                              {target:{value : value}},
                              "skillsUsed",
                              index
                            );
                          }}
                          creatable={true}
                          options={skillOptions}
                          isMulti={true}
                          defaultValue={
                            work.skillsUsed
                              ? work.skillsUsed
                              : null
                          }
                        />
                      </div>
                      ):
                       <span className="workExperience-CpmpanyName">
                       {work.skillsUsed ? (
                         work.skillsUsed.map(
                           (skill: any) => (
                             <p key={skill.id} className="skills">
                               {skill.value ? skill.value : skill.name}
                             </p>
                           )
                         )
                       ) : (
                         <span className="skillSetLocation">
                           | click edit and update skills used in this work profile |
                         </span>
                       )}
                     </span>
                      }
                      </div>
              <div className="col-lg-12">
                {this.state.workExperienceEditIDX === index ? (
                  <div className="form-group input-group-md">
                    <label>
                      <small>
                        <strong>Description</strong>
                      </small>
                    </label>
                    <textarea
                      onChange={(e: any) => {
                        this.workExperienceHandleChange(
                          e,
                          "description",
                          index
                        );
                      }}
                      className="form-control"
                      name="description"
                      id="description"
                      rows={3}
                      placeholder=""
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
        </div>
        <div className="row">
        <Button type="dashed" block size={'large'} data-toggle="modal"
              data-target="#modalWorkExperience">
          <Icon type="plus" />
          Add Work Experience
          <Icon type="plus" />
        </Button>
        </div>
        </React.Fragment>

        }
      </React.Fragment>
    );
  }
}

export default CareerHistory;
