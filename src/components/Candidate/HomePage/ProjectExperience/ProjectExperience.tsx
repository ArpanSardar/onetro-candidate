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
import '../CareerHistory/style.css';
import { Skeleton,Divider,notification,Icon,Progress,Steps, Button, message } from 'antd';
import 'antd/dist/antd.css';

interface IProps {
  [key: string]: any;
}

interface IState {
  [key: string]: any;
}

class ProjectExperience extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      project: [],
      projectEditIDX: -1,
      newProjectFields: {},
      title: "",
      organization: "",
      schedule: "",
      place: "",
      description: "",
      newStartDate:null,
      newEndDate:null,
      loading:true

    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", 'Data updated successfully', type);
  }
  projectHandleChange = (e: any, propName: any, index: any) => {
    if(propName=="startDate" ||propName=="endDate"){
      this.setState({
        project: this.state.project.map((item: any, j: any) =>
          j === index ? { ...item, [propName]: e===null?null:firebaseService.firestore.Timestamp.fromDate(e) } : item
        )
      });
    }
    else{
    const { value } = e.target;
    this.setState({
      project: this.state.project.map((item: any, j: any) =>
        j === index ? { ...item, [propName]: value } : item
      )
    });
  }
  };
  startProjectEditing = (index: any) => {
    this.setState({ projectEditIDX: index });
  };
  stopProjectEditing = (index: any) => {
    this.setState({ projectEditIDX: -1 });
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
          // this.AlertMessage("Data updated successfully", "success");
        })
        .catch(function(error: any) {
          message.error('Error while updating data');
        });
    }
  };
  handleProjectPostings = (index: any) => {
    this.state.projectEditIDX === index;
  };
  deleteProjectPressed = (index: any) => {
    swal({
      title: "Are you sure you want to delete this data?",
      // text: "一旦募集を削除すると、元に戻すことはできません",
      icon: "warning",
      dangerMode: true
    }).then((willDelete: any) => {
      if (willDelete) {
        this.handleDeleteProject(index);
      } else {
      }
    });
  };
  handleDeleteProject = (index: any) => {
    this.setState({
      project: this.state.project.filter(
        (job: any, projectindex: any) => projectindex != index
      )
    });
    // const _candidate = this.state.candidate;
    // _candidate.project = this.state.project;

    // this.setState({
    //   candidate: _candidate
    // });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        .update({
          project: this.state.project.filter((job: any, i: any) => i != index)
        })
        .then(() => {
          message.warning('Data deleted !');

        })
        .catch(function(error) {
          message.error('Error in deleting data !');
        });
    }
  };

  onNewProjectFieldChange = (updatedValue: any) => {
    this.setState({
      newProjectFields: {
        ...this.state.newProjectFields,
        ...updatedValue
      }
    });
  };
  onchangeNewProject = (e: any) => {
    this.onNewProjectFieldChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleChangePlace = (value: any) => {
    // console.log('place Selected: ' );
    // console.log(value);
    this.onNewProjectFieldChange({ place: value });
    this.setState({
      place: value
    });
  }
  handleChangeSkills = (value: any) => {
    // console.log('skills Selected: ' );
    // console.log(value);
    this.onNewProjectFieldChange({ skillsUsed: value });
    this.setState({
      skillsUsed: value
    });
  }
  saveNewProject = (e: any) => {
    e.preventDefault();
    var newArray = this.state.project.slice();
    newArray.push(this.state.newProjectFields);
    this.setState({
      project: newArray,
      // candidate: { ...this.state.candidate, project: newArray }
    });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        //   .set({ ...this.state.candidate, project: newArray })
        .update({ project: newArray })

        .then(() => {
          message.success('Data added successfully');

          // this.AlertMessage("New project information created.", "success");
        })
        .catch(function(error: any) {
          message.error('Error in adding data !');
        });
    }
    this.setState({
      title: "",
      organization: "",
      schedule: "",
      place: "",
      description: ""
    });
    this.onNewProjectFieldChange({
      title: "",
      organization: "",
      schedule: "",
      place: "",
      description: ""
    });
  };
 
  handleChangeNewStartDate = (value: any) => {
    this.onNewProjectFieldChange({ startDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      newStartDate: value
    });
  };
  handleChangeNewEndDate = (value: any) => {
    this.onNewProjectFieldChange({ endDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      newEndDate: value
    });
  };

  // componentDidUpdate(prevProps: any) {
  //   if (prevProps.project !== this.props.project) {
  //     this.setState({
  //       project: this.props.project
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
            project: data.project
          });
        });
      })
      .then(()=>{
        this.setState({
          loading: false           
        });
      });
      // this.setState({
      //   project: this.props.project
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
            Previous
            <Icon type="left" />
          </Button>
          <Button type="primary" onClick={() => this.props.nextStep()}>
              Next
              <Icon type="right" />
          </Button>
          
        </div>:null}
        <Divider>Project Details</Divider>

          
          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 sm-text-left xs-text-left lg-text-right md-text-right">
            
            <div id="modalProject" className="modal fade" role="dialog">
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
                            <strong>Project Name</strong>
                          </small>
                        </label>
                        <input
                          type="text"
                          onChange={e => this.onchangeNewProject(e)}
                          className="form-control"
                          name="title"
                          id="title"
                          value={this.state.title}
                          placeholder="Ex: Radio broadcast system"
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
                          <small><strong><span className="currentCompanyNote">Do not select End Date if this is your Current Project.</span></strong></small>
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
                            <strong>Associated with</strong>
                          </small>
                        </label>
                        <input
                          type="text"
                          onChange={e => this.onchangeNewProject(e)}
                          className="form-control"
                          name="organization"
                          id="organization"
                          value={this.state.organization}
                          placeholder="Ex: College Project"
                          required
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Place</strong>
                          </small>
                        </label>
                        <AutoSuggest
                          handleChange={this.handleChangePlace}
                          options={countryOptions}
                          isMulti={false}
                          creatable={false}
                          defaultValue=''
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Skills Used</strong>
                          </small>
                        </label>
                        <AutoSuggest
                          handleChange={this.handleChangeSkills}
                          options={skillOptions}
                          isMulti={true}
                          creatable={true}
                          defaultValue={
                            this.state.skillsUsed
                              ? this.state.skillsUsed
                              : null
                          }
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Description</strong>
                          </small>
                        </label>
                        <textarea
                          onChange={e => this.onchangeNewProject(e)}
                          className="form-control"
                          name="description"
                          id="description"
                          value={this.state.description}
                          rows={3}
                          placeholder="Ex: An open source manga reading and tracking tool built with Vue.js, Vuex, Vuetify with Node.js and MongoDB on the backend."
                        />
                      </div>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={this.saveNewProject}
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
        </div>
        <hr />
        {/* {this.state.project.length > 0 ? null : 
                      <div> <h1 className="workExperience-Title">
                      No Record Found
                      </h1> </div>
                    } */}
       <div className="row">
        {this.state.project
          ? this.state.project.map((project: any, index: any) => (
              <div key={index} className="chipProfileDetails col-lg-12">
                <div className="row">
                  {/*<div className="col-lg-9" />*/}
                  <div className="col-lg-12 text-right">
                      <div className="btn-group-sm">
                        <div className="btn btn-sm">
                          {this.state.projectEditIDX === index ? (
                            <span
                              className="update"
                              onClick={() => this.stopProjectEditing(index)}
                            >
                              <small>Save</small>
                            </span>
                          ) : (
                            <span
                              className="edit"
                              onClick={() =>
                                this.startProjectEditing(index)
                              }
                            >
                              <small>Edit</small>
                            </span>
                          )}
                        </div>
                        <div
                          className="btn btn-sm"
                          // onClick={() => this.deleteProjectPressed(index)}
                        >
                          {this.state.projectEditIDX === index ? (
                            <div />
                          ) : (
                            <span
                              className="delete"
                              onClick={() =>
                                this.deleteProjectPressed(index)
                              }
                            >
                              <small>Delete</small>
                            </span>
                          )}
                        </div>
                      </div>
                      <hr/>
                    </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    {this.state.projectEditIDX === index ? (
                      <div className="form-group input-group-md">
                        <label>
                          <small>
                            <strong>Project Name</strong>
                          </small>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="title"
                          value={project.title}
                          onChange={(e: any) => {
                            this.projectHandleChange(e, "title", index);
                          }}
                        />
                        </div>
                    ) : (
                      <div>
                        <span className="workExperience-Title">
                          {project.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                    {this.state.projectEditIDX === index ? (
                      <div className="form-group input-group-md">
                              <label>
                            <small>
                              <strong>Start Date</strong>
                            </small>
                          </label>
                          <DatePicker
                            className="datePicker form-control"
                            selected={project.startDate?project.startDate.toDate():null}
                            onChange={(e: any) => {
                              this.projectHandleChange(e, "startDate", index);
                            }}
                            dateFormat="d MMMM, yyyy"
                            placeholderText="Click to select start date"
                            showMonthDropdown
                            showYearDropdown
                            selectsStart
                            startDate={project.startDate?project.startDate.toDate():null}
                            endDate={project.endDate?project.endDate.toDate():null}
                          />
                          <label>
                            <small>
                              <strong>End Date</strong>
                            </small>
                          </label>
                          <DatePicker
                            className="datePicker form-control"
                            selected={project.endDate?project.endDate.toDate():null}
                            onChange={(e: any) => {
                              this.projectHandleChange(e, "endDate", index);
                            }}
                            dateFormat="d MMMM, yyyy"
                            placeholderText="Click to select a date"
                            showMonthDropdown
                            showYearDropdown
                            selectsStart
                            startDate={project.startDate?project.startDate.toDate():null}
                            endDate={project.endDate?project.endDate.toDate():null}
                          />
                        
                      </div>
                    ) : (
                      <div>
                        <span className="skillSetLocation">
                          <i className="material-icons">
                            schedule
                          </i>
                          {project.startDate ? (
                          <span>
                          <span className="itemName">
                            {new Intl.DateTimeFormat('en-GB', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: '2-digit' 
                            }).format(project.startDate.toDate())}
                          </span>~
                          {project.endDate?
                          <span className="itemName">
                          {new Intl.DateTimeFormat('en-GB', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: '2-digit' 
                          }).format(project.endDate.toDate())}
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
                  {this.state.projectEditIDX === index ? (
                      <div className="form-group input-group-md">
                        
                        <label>
                          <small>
                            <strong>Associated with</strong>
                          </small>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="organization"
                          value={project.organization}
                          onChange={(e: any) => {
                            this.projectHandleChange(
                              e,
                              "organization",
                              index
                            );
                          }}
                        />
                        
                      </div>
                    ) : (
                      <div>
                       
                        <span className="workExperience-CpmpanyName">
                          {project.organization}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-left">
                  {this.state.projectEditIDX === index ? (
                      <div className="form-group input-group-md">
                        <label>
                          <small>
                            <strong>Place</strong>
                          </small>
                        </label>
                        <AutoSuggest
                          handleChange={(value: any) => {
                            this.projectHandleChange({target:{value:value}}, "place", index);
                          }}
                          // handleChange={this.handleChangePlace}
                          options={countryOptions}
                          isMulti={false}
                          creatable={false}
                          defaultValue={project.place ? project.place : null}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="skillSetLocation">
                          <i className="material-icons">
                            place
                          </i>
                          {project.place}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-12">
                  {this.state.projectEditIDX === index ? (
                      <div className="form-group input-group-md">
                        <label>
                          <small>
                            <strong>Skills Used</strong>
                          </small>
                        </label>
                        <AutoSuggest
                          handleChange={(value: any) => {
                            this.projectHandleChange(
                              {target:{value : value}},
                              "skillsUsed",
                              index
                            );
                          }}
                          // handleChange={this.handleChangeSkills}
                          options={skillOptions}
                          isMulti={true}
                          creatable={true}
                          defaultValue={
                            project.skillsUsed
                              ? project.skillsUsed
                              : null
                          }
                        />
                      </div>
                    ) : (
                      <div>
                       <span className="workExperience-CpmpanyName">
                          {project.skillsUsed ? (
                            project.skillsUsed.map(
                              (skill: any) => (
                                <p key={skill.id} className="skills">
                                  {skill.value ? skill.value : skill.name}
                                </p>
                              )
                            )
                          ) : (
                            <span className="skillSetLocation">
                              | click edit and update project skills used |
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-lg-12">
                    {this.state.projectEditIDX === index ? (
                      <div className="form-group input-group-md">
                        <label>
                          <small>
                            <strong>Description</strong>
                          </small>
                        </label>
                        <textarea
                          onChange={(e: any) => {
                            this.projectHandleChange(
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
                          value={project.description}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="description">{project.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
          </div>
          <div className="row">
        <Button type="dashed" block size={'large'} data-toggle="modal"
              data-target="#modalProject">
          <Icon type="plus" />
          Add Project Details
          <Icon type="plus" />
        </Button>
        </div>
        </React.Fragment>

        }
      </React.Fragment>
    );
  }
}

export default ProjectExperience;
