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
import { Skeleton,Divider,notification,Icon,Progress,Steps, Button, message } from 'antd';
import 'antd/dist/antd.css';

interface IProps {
  [key: string]: any;
}

interface IState {
  [key: string]: any;
}

class Certifications extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      certificate: [],
      certificateEditIDX: -1,
      newCertificateFields: {},
      title: "",
      link: "",
      issueDate: null,
      description: "",
      certficateDate:{},
      loading:true

    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", 'Data updated successfully', type);
  }
  certificateHandleChange = (e: any, propName: any, index: any) => {
    if(propName=="issueDate"){
      this.setState({
        certificate: this.state.certificate.map((item: any, j: any) =>
          j === index ? { ...item, [propName]: e===null?null:firebaseService.firestore.Timestamp.fromDate(e) } : item
        )
      });
    }
    else{
    const { value } = e.target;
    this.setState({
      certificate: this.state.certificate.map((item: any, j: any) =>
        j === index ? { ...item, [propName]: value } : item
      )
    });
  }
  };
  startCertificateEditing = (index: any) => {
    this.setState({ certificateEditIDX: index });
  };
  stopCertificateEditing = (index: any) => {
    this.setState({ certificateEditIDX: -1 });
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
          // this.AlertMessage("Data updated successfully", "success");
        })
        .catch(function(error: any) {
          message.error('Error in updating data !');
        });
    }
  };
  handleCertificatePostings = (index: any) => {
    this.state.certificateEditIDX === index;
  };
  deleteCertificatePressed = (index: any) => {
    swal({
      title: "Are you sure you want to delete?",
      // text: "一旦募集を削除すると、元に戻すことはできません",
      icon: "warning",
      dangerMode: true
    }).then((willDelete: any) => {
      if (willDelete) {
        this.handleDeleteCertificate(index);
      } else {
      }
    });
  };
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
            (job: any, i: any) => i != index
          )
        })
        .then(() => {
          message.warning('Data deleted !');
          // this.AlertMessage("Certificate details deleted", "success");
        })
        .catch(function(error) {
          message.error('Error in deleting data !');
        });
    }
  };

  onNewCertificateFieldChange = (updatedValue: any) => {
    this.setState({
      newCertificateFields: {
        ...this.state.newCertificateFields,
        ...updatedValue
      }
    });
  };
  onchangeNewCertificate = (e: any) => {
    this.onNewCertificateFieldChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  saveNewCertificate = (e: any) => {
    e.preventDefault();
    var newArray = this.state.certificate.slice();
    newArray.push(this.state.newCertificateFields);
    this.setState({
      certificate: newArray,
      // candidate: { ...this.state.candidate, certificate: newArray }
    });
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        //   .set({ ...this.state.candidate, certificate: newArray })
        .update({ certificate: newArray })

        .then(() => {
          message.success('Data added successfully');

          // this.AlertMessage("Certificate details added.", "success");
        })
        .catch(function(error: any) {
          message.error('Error in adding data !');
        });
    }
    this.setState({
      title: "",
      link: "",
      issueDate: null,
      description: ""
    });
    this.onNewCertificateFieldChange({
      title: "",
      link: "",
      issueDate: null,
      description: ""
    });
  };
  // componentDidMount() {
  //   this.setState({
  //     certificate: this.props.certificate
  //   });
  // }
  handleChangeissueDate = (value: any) => {
    this.onNewCertificateFieldChange({ issueDate: value===null?null:firebaseService.firestore.Timestamp.fromDate(value) });
    this.setState({
      issueDate: value
    });
  };
  // componentDidUpdate(prevProps: any) {
  //   if (prevProps.certificate !== this.props.certificate) {
  //     this.setState({
  //       certificate: this.props.certificate
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
            certificate: data.certificate
          });
        });
      })
      .then(()=>{
        this.setState({
          loading: false           
        });
      });
      // this.setState({
      //   certificate: this.props.certificate
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
        <Divider>Certificate Details</Divider>
  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 sm-text-left xs-text-left lg-text-right md-text-right">
            
            <div id="modalCertificate" className="modal fade" role="dialog">
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
                            <strong>Certificate Name</strong>
                          </small>
                        </label>
                        <input
                          type="text"
                          onChange={e => this.onchangeNewCertificate(e)}
                          className="form-control"
                          name="title"
                          id="title"
                          value={this.state.title}
                          placeholder="Ex: Google Developer Challenge Scholarship, Udacity"
                          required
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Link</strong>
                          </small>
                        </label>
                        <input
                          type="text"
                          onChange={e => this.onchangeNewCertificate(e)}
                          className="form-control"
                          name="link"
                          id="link"
                          value={this.state.link}
                          placeholder="Ex: www.Google.com\certificate1"
                          required
                        />
                      </div>
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Issue Date</strong>
                          </small>
                        </label>
                        <DatePicker
                          className="datePicker form-control"
                          selected={this.state.issueDate}
                          onChange={this.handleChangeissueDate}
                          dateFormat="d MMMM, yyyy"
                          placeholderText="Click to select start date"
                          showMonthDropdown
                          showYearDropdown
                        />
                      </div>
                     
                      <div className="form-group input-group-sm">
                        <label>
                          <small>
                            <strong>Description</strong>
                          </small>
                        </label>
                        <textarea
                          onChange={e => this.onchangeNewCertificate(e)}
                          className="form-control"
                          name="description"
                          id="description"
                          value={this.state.description}
                          rows={3}
                          placeholder="Ex: The Google Ads certification is a professional accreditation that Google offers 
                          to individuals who demonstrate proficiency in basic and advanced aspects of Google Ads."
                        />
                      </div>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={this.saveNewCertificate}
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
        </div><hr/>
        {/* {this.state.certificate.length > 0 ? null : 
                      <div> <h1 className="workExperience-Title">
                      No Record Found
                      </h1> </div>
                    } */}
                            <div className="row">

        {this.state.certificate.map((certificate: any, index: any) => (
          <div key={index} className="chipProfileDetails col-lg-12">
            <div className="row">
              {/*<div className="col-lg-9" />*/}
              <div className="col-lg-12 text-right">
                  <div className="btn-group-sm">
                    <div className="btn btn-sm">
                      {this.state.certificateEditIDX === index ? (
                        <span className="update" onClick={() => this.stopCertificateEditing(index)}><small>Save</small></span>

                      ) : (
                        <span className="edit" onClick={() => this.startCertificateEditing(index)}><small>Edit</small></span>

                      )}
                    </div>
                    <div
                      className="btn btn-sm"
                      // onClick={() => this.deleteCertificatePressed(index)}
                    >
                      {this.state.certificateEditIDX === index ? (
                        <div />
                      ) : (
                        <span className="delete" onClick={() => this.deleteCertificatePressed(index)}><small>Delete</small></span>

                      )}
                    </div>
                  </div>
                  <hr/>
                </div>

              <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                {this.state.certificateEditIDX === index ? (
                  <div className="form-group input-group-md">
                  <label>
                          <small>
                            <strong>Certificate Name</strong>
                          </small>
                        </label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Ex: Google Developer Challenge Scholarship, Udacity"
                      value={certificate.title}
                      onChange={(e: any) => {
                        this.certificateHandleChange(e, "title", index);
                      }}
                    />
                    <br />
                    <label>
                          <small>
                            <strong>Link</strong>
                          </small>
                        </label>
                    <input
                      className="form-control"
                      type="text"
                      name="link"
                      placeholder="Certificate Link: www.google.com\crtificate1"
                      value={certificate.link}
                      onChange={(e: any) => {
                        this.certificateHandleChange(e, "link", index);
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <span className="workExperience-Title">
                      {certificate.title}
                    </span>
                    <br />
                    <span className="workExperience-CpmpanyName">
                      {certificate.link}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 lg-text-right md-text-right sm-text-left xs-text-lef">
                {this.state.certificateEditIDX === index ? (
                  <div className="form-group input-group-md">
                  <label>
                    <small>
                      <strong>Time Period</strong>
                    </small>
                  </label>
                    <DatePicker
                      className="datePicker form-control"
                      selected={certificate.issueDate?certificate.issueDate.toDate():null}
                      onChange={(e: any) => {
                        this.certificateHandleChange(e, "issueDate", index);
                      }}
                      dateFormat="d MMMM, yyyy"
                      placeholderText="Click to select start date"
                      showMonthDropdown
                      showYearDropdown
                    />
                  </div>
                ) : (
                    <span className="skillSetLocation">
                      <i className="material-icons">
                        schedule
                      </i>
                      {certificate.issueDate ? (
                        <span>
                        <span className="itemName">
                          {new Intl.DateTimeFormat('en-GB', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: '2-digit' 
                          }).format(certificate.issueDate.toDate())}
                        </span>
                      </span>
                      ) : (
                          <span className="itemName">
                            | click edit and update time period |
                        </span>
                        )}                    
                        </span>
                   )}
              </div>
              <div className="col-lg-12">
                {this.state.certificateEditIDX === index ? (
                  <div className="form-group input-group-md">
                  <label>
                          <small>
                            <strong>Description</strong>
                          </small>
                        </label>
                    <textarea
                      onChange={(e: any) => {
                        this.certificateHandleChange(e, "description", index);
                      }}
                      className="form-control"
                      name="description"
                      id="description"
                      placeholder="Ex: The Google Ads certification is a professional accreditation that Google 
                      offers to individuals who demonstrate proficiency in basic and advanced aspects of Google Ads."
                      rows={3}
                      value={certificate.description}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="description">{certificate.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
        <div className="row">
        <Button type="dashed" block size={'large'} data-toggle="modal"
              data-target="#modalCertificate">
          <Icon type="plus" />
          Add Certificate Details
          <Icon type="plus" />
        </Button>
        </div>
        </React.Fragment>

        }
      </React.Fragment>
    );
  }
}

export default Certifications;
