import React, { Component } from "react";
import swal from "sweetalert";
import { companyDatabase } from "../../../../services/FirebaseCandidateService";
import "./style.css";
import AutoSuggest from '../AutoComplete/AutoSuggest';
import {workExperienceOptions, noOfInternships} from '../AutoComplete/data';
import { Skeleton,Divider,notification,Icon,Progress,Steps, Button, message } from 'antd';
import 'antd/dist/antd.css';

interface IProps {
  [key: string]: any;
}

interface IState {
  [key: string]: any;
}
class Badges extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      jobExperience: 0,
      certificateAchieved: 0,
      internshipCompleted: 0,
      editFlag: false
    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", msg, type);
  }
  handleChange(e: any) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleChangeJobExperience = (value: string) =>{
    this.setState({
      jobExperience: value
    });
  }
  handleChangeinternshipCompleted = (value: string) =>{
    this.setState({
      internshipCompleted: value
    });
  }
  // componentDidUpdate(prevProps: any) {
  //   if (prevProps.jobExperience !== this.props.jobExperience) {
  //     this.setState({
  //       jobExperience: this.props.jobExperience
  //     });
  //   }
  //   if (prevProps.certificateAchieved !== this.props.certificateAchieved) {
  //     this.setState({
  //       certificateAchieved: this.props.certificateAchieved
  //     });
  //   }
  //   if (prevProps.internshipCompleted !== this.props.internshipCompleted) {
  //     this.setState({
  //       internshipCompleted: this.props.internshipCompleted
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
            jobExperience: data.experience,
            certificateAchieved: data.certificate.length,
            internshipCompleted: data.noOfInternship
          
          });
        });
      })
    
      // this.setState({
      //   jobExperience: this.props.jobExperience,
      //   certificateAchieved: this.props.certificateAchieved,
      //   internshipCompleted: this.props.internshipCompleted
      // });
  }
  stopRightBarEditing = () => {
    this.setState({ editFlag: false });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        .update({
          experience: this.state.jobExperience,
          noOfInternship: this.state.internshipCompleted
        }).then(()=>{
          message.success('Data updated successfully');

          // this.AlertMessage("Data updated successfully", "success");
        });
    }
  };
  startRightBarEditing = () => {
    this.setState({ editFlag: true });
  };
  render() {
    return (
      <React.Fragment>
      <div className="sidebarRight col-lg-12">
        <div className="row">
          <div className="col-lg-12 btn text-center">
            {this.state.editFlag ? (
              
              <span
                className="update btn btn-sm btn-outline-success"
                onClick={() => this.stopRightBarEditing()}
              >
                <small className="edit">Save</small>
              </span>
            ) : (
              // <i className=""
              //      onClick={() => this.startRightBarEditing()}>Edit Badges</i>
              <span
                className="edit btn btn-sm btn-outline-info"
                onClick={() => this.startRightBarEditing()}
              >
                <small className="edit">Edit</small>
              </span>
            )}
          </div>
          <div className="col-lg-12">
            <i className="material-icons ">card_travel</i>
            <br />
            {this.state.editFlag ? (
              <div className="form-group sidebarRight-form-group">
                
                <AutoSuggest
                  handleChange={this.handleChangeJobExperience}
                  options={workExperienceOptions}
                  isMulti={false}
                  defaultValue={this.state.jobExperience ? this.state.jobExperience : null}
                  creatable={false}
                />
              </div>
            ) : (
              <span>
                <b className="boldNumbers">{this.state.jobExperience?
                <span>{this.state.jobExperience}</span>
                :0
                }</b>
              </span>
            )}

            <p>Job Experience</p>
          </div>
          <div className="col-lg-12">
            <i className="material-icons ">school</i>
            <br />
            
            <span>
              <b className="boldNumbers">{this.state.certificateAchieved}</b>
            </span>
            
            <p>Certificates Achieved</p>
          </div>
          <div className="col-lg-12">
            <i className="material-icons ">description</i>
            <br />
            {this.state.editFlag ? (
              <div className="form-group sidebarRight-form-group">
                <AutoSuggest
                  handleChange={this.handleChangeinternshipCompleted}
                  options={noOfInternships}
                  isMulti={false}
                  creatable={false}
                  defaultValue={this.state.internshipCompleted ? this.state.internshipCompleted : null}
                />
              </div>
            ) : (
              <span>
                <b className="boldNumbers">{this.state.internshipCompleted}</b>
              </span>
            )}
            <p>No. of Internships completed</p>
          </div>
        </div>
      </div>
      {/* <Expertise/> */}
      </React.Fragment>
    );
  }
}
export default Badges;
