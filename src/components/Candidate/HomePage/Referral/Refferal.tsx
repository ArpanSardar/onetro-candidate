import React, { Component } from "react";
import swal from "sweetalert";
import { companyDatabase } from "../../../../services/FirebaseCandidateService";
import "./style.css";
import { Card, Button } from "react-bootstrap";
import referImage from "../../../../assets/images/refer.jpg";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  ViberShareButton,
  ViberIcon,
  LineShareButton,
  LineIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';

interface IProps {
  referredBy: string;
  referredTo: any;
}

interface IState {
  [key: string]: any;
}

const referralMessage = "Interested in getting a job in Japan? Enroll yourself on Onetro. While signing up your profile. Please enter referral email: '" + sessionStorage.getItem("candidateEmail") + "' Website Link - https://candidate.onetro.jp";
const emailSubject = "Your friend invite you to join ONETRO! sender: " + sessionStorage.getItem("candidateEmail");
const candidateEmail = sessionStorage.getItem("candidateEmail");

const referralWebsiteLink = "https://candidate.onetro.jp";

class Referral extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      referredBy: "",
      referredTo: []

    };
  }
  AlertMessage(msg: any, type: any) {
    swal("Done", 'You have added ' + msg + ' as your invitee friend', type);
  }
  handleChange(e: any) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }
  componentDidUpdate(prevProps: any) {
    if (prevProps !== this.props) {
      this.setState({
        referredBy: this.props.referredBy,
        referredTo: this.props.referredTo
      });
    }
  }

  onchangeReferralCode = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  saveReferredBy = () => {
    var candidateId = sessionStorage.getItem("candidateID");
    if (candidateId != null && candidateEmail == this.state.referredBy) {
      swal("Warning!", 'You can not use your own email id as you referral person. Please try again', 'warning');
      return;
    }
    if (candidateId != null) {
      companyDatabase
        .collection("CandidateInfo")
        .doc(candidateId)
        .update({
          referredBy: this.state.referredBy
        })
        .then(() => {
          this.AlertMessage(this.state.referredBy, "success");
        })
        .catch(function (error: any) { });
    }
  };
  render() {
    return (
      <div className="sidebarRightBottom col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
        <div className="row">
          <Card style={{ width: '100%' }}>
            <Card.Img variant="top" src={referImage} />
            <Card.Body>
              <Card.Title>Referrals</Card.Title>
              <Card.Text>
                Refer friends and win <strong>3 STARS</strong> for each friend after their profile is successfully launched after review!
              </Card.Text>
              <Button variant="primary" data-toggle="modal" data-target="#modalReferralInvite">Refer a Friend</Button>
              {/* <Button variant="outline-primary" data-toggle="modal" data-target="#modalReferralInput">Have a Code?</Button> */}
            </Card.Body>
          </Card>
          <div id="modalReferralInvite" className="modal fade" role="dialog">
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
                  <Card className="text-center">
                    <Card.Header>YOUR REFERRAL EMAIL</Card.Header>
                    <Card.Body>
                      <Card.Title>{candidateEmail}</Card.Title>
                      <Card.Text>
                        Share the above referral email as a referral code to your friend and request them to use this during signup. On successful creation of your friends account with us, you will be awarded 3 stars
                      </Card.Text>
                      {/* <Button variant="primary">Go somewhere</Button> */}
                      <div className="row">
                        <FacebookShareButton
                          url={referralWebsiteLink}
                          quote={referralMessage}
                          className="Demo__some-network__share-button col">
                          <FacebookIcon
                            size={32}
                            round />
                        </FacebookShareButton>
                        <WhatsappShareButton
                          url={referralWebsiteLink}
                          title={referralMessage}
                          separator=":: "
                          className="Demo__some-network__share-button col">
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <LinkedinShareButton
                          url={referralWebsiteLink}
                          title={referralMessage}
                          windowWidth={750}
                          windowHeight={600}
                          className="Demo__some-network__share-button col">
                          <LinkedinIcon
                            size={32}
                            round />
                        </LinkedinShareButton>
                        <LineShareButton
                          url={referralWebsiteLink}
                          title={referralMessage}
                          className="Demo__some-network__share-button col">
                          <LineIcon
                            size={32}
                            round />
                        </LineShareButton>
                        <ViberShareButton
                          url={referralWebsiteLink}
                          title={emailSubject}
                          body={referralMessage}
                          className="Demo__some-network__share-button col">
                          <ViberIcon
                            size={32}
                            round />
                        </ViberShareButton>
                        <EmailShareButton
                          url={referralWebsiteLink}
                          subject={emailSubject}
                          body={referralMessage}
                          className="Demo__some-network__share-button col">
                          <EmailIcon
                            size={32}
                            round />
                        </EmailShareButton>

                      </div>
                    </Card.Body>
                    <Card.Footer className="text-muted">** 1 star = JPY5000 ($45 approx) **</Card.Footer>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div id="modalReferralInput" className="modal fade" role="dialog">
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
                <h3>Have a Referral email id?</h3>
                <div className="modal-body text-left">
                  <form>
                    <div className="form-group input-group-sm">
                      <label>
                        <strong>Enter you Friend's Referral email id</strong>
                      </label>

                      <input
                        type="email"
                        onChange={e => this.onchangeReferralCode(e)}
                        className="form-control"
                        name="referredBy"
                        id="referredBy"
                        value={this.state.referredBy}
                        placeholder="Enter Your invitee Friend's referral email id"
                        required
                      />
                    </div>
                    {/* <div className="alert alert-danger">
                      Value should be "," separated. Example: Project
                      Management,Client Engagement,Communication
                    </div> */}

                  </form>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={this.saveReferredBy}
                    type="button"
                    data-dismiss="modal"
                  >
                    Done
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="referralList col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h6>Referrals Made</h6>
            <hr />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
            {this.state.referredTo && this.state.referredTo.length > 0 ? <span>
              {this.state.referredTo.map((referredTo: any) => (
                <p key={referredTo.email}>{referredTo.email}</p>
              ))}</span>
              :
              <span>| No referrals found! Click Refer a Friend button and Refer your friend now to earn more stars!|</span>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Referral;
