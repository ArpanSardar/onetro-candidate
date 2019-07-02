import React, { Component } from "react";
import swal from "sweetalert";
import { companyDatabase } from "../../../../services/FirebaseCandidateService";
import "./style.css";
import { Skeleton,Divider,notification,Icon,Progress,Steps, Button, message } from 'antd';
import 'antd/dist/antd.css';

interface IProps {
  [key: string]: any;
}

interface IState {
  [key: string]: any;
}
class Expertise extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      expertise: [],
      expertiseText: ""
    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", 'Data updated successfully', type);
  }
  handleChange(e: any) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }
  // componentDidUpdate(prevProps: any) {
  //   if (prevProps.expertise !== this.props.expertise) {
  //     this.setState({
  //       expertise: this.props.expertise,
  //       expertiseText: this.props.expertise.join(",")
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
            expertise: data.expertise,
            expertiseText: data.expertise.join(",")
          });
        });
      })
      // this.setState({
      //   expertise: this.props.expertise,
      //   expertiseText: this.props.expertise.join(",")
      // });
  }
  //   stopRightBottomBarEditing=()=>{
  //     this.setState({editFlag:false});
  //     var candidateId = sessionStorage.getItem("candidateID");
  //     if (candidateId != null) {
  //     companyDatabase
  //               .collection("CandidateInfoTEST")
  //               .doc(candidateId)
  //               .update({
  //                 expertise: this.state.expertise,
  //               })
  //   }
  // }
  //   startRightBottomBarEditing=()=>{
  //     this.setState({editFlag:true});

  // }
  onchangeExpertisation = (e: any) => {
    // this.onNewCertificateFieldChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  saveExpertise = () => {
    if (this.state.expertiseText.length > 0) {
      var arr = this.state.expertiseText.split(",");
      this.setState({ expertise: arr });
    } else {
      this.setState({ expertise: [] });
    }

    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        .update({
          expertise:
            this.state.expertiseText.length > 0
              ? this.state.expertiseText.split(",")
              : []
        })
        .then(() => {
          message.success('Data updated successfully');

            //  this.AlertMessage("Data updated", "success");
        })
        .catch(function(error: any) {
          message.error('Error in updating data !');

        });
    }
  };
  render() {
    return (
      <div className="sidebarRightBottom col-lg-12">
        <div className="row">
          <div className="col-lg-12 btn text-center">
            
            <span
              className="edit btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#modalExpertise"
            >
              <small className="edit">Edit</small>
            </span>
          </div>

          <div id="modalExpertise" className="modal fade" role="dialog">
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
                        <strong>Expertisation</strong>
                      </label>
                      <textarea
                        onChange={e => this.onchangeExpertisation(e)}
                        className="form-control"
                        name="expertiseText"
                        id="expertiseText"
                        value={this.state.expertiseText}
                        rows={2}
                        placeholder="Example: Project Management,Client Engagement,Communication"
                      />
                    </div>
                    <div className="alert alert-danger">
                      Value should be "," separated. Example: Project
                      Management,Client Engagement,Communication
                    </div>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={this.saveExpertise}
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
          <div className="expertiseStyle col-lg-12">
            <h6>Expertise</h6>
            <hr />
          </div>
          <div className="col-lg-12 text-center">
          {this.state.expertise.length>0?<span>
            {this.state.expertise.map((expertise: any) => (
              <p key={expertise}>{expertise}</p>
            ))}</span>
            :
            <span>| click edit and update Expertisation |</span>
          }
          </div>
        </div>
      </div>
    );
  }
}
export default Expertise;
