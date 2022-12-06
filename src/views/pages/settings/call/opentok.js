import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  OTSession,
  OTStreams,
  preloadScript,
  OTSubscriber,
  OTPublisher,
} from "opentok-react";
import { pushCloseSignal } from "../../../../redux/actions/data-list/";
import "../../../../assets/scss/plugins/extensions/opentok.scss";
import video from "../../../../assets/img/call/ID25_14_btn_op_video.png";
import mic from "../../../../assets/img/call/ID25_14_btn_op_mic.png";
import video_off from "../../../../assets/img/call/ID25_14_btn_op_video_off.png";
import mic_off from "../../../../assets/img/call/ID25_14_btn_op_mic_off.png";
import Axios from "axios";
import { connect } from "react-redux";
import { history } from "../../../../history";
import AES256 from "aes-everywhere";
import { SERVER_URL, SERVER_URL2 } from "../../../../config";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";
import { FormattedMessage } from "react-intl";

class ConsultingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: [],
      error: null,
      connected: false,
      camerastate: true,
      micstate: true,
      disconnect: false,
      onsubscribe: false,
      connectedtag: true,
      conncheckmodal: false,
      okmodal: false,

      error: null,
      publishScreen: false,
    };

    this.connectionCheck = this.connectionCheck.bind(this);
    this.sessionEventHandlers = {
      connectionCreated: (event) => {
        console.log("connection created", event);
      },
      connectionDestroyed: (event) => {
        console.log("connection destroyed", event);
        setTimeout(() => this.connectionCheck(), 1000);
      },
      sessionConnected: (event) => {
        console.log("Client connect to a session");
      },
      sessionDisconnected: (event) => {
        console.log("Client disConnect to a session");
      },
      sessionReconnected: (event) => {
        console.log("session reconnected");
      },
    };

    this.publishEvents = {
      publishConnected: () => {
        this.setState({ pconnected: true });
      },
      publishDisconnected: () => {
        this.setState({ pconnected: false });
      },
    };

    this.publisherScreenEventHandlers = {
      accessDenied: () => {
        this.toggleScreensharefail();
        console.log("User denied access to media Screen source");
      },
      streamCreated: () => {
        console.log("Publisher SCreen created");
      },
      mediaStopped: () => {
        this.toggleScreensharefail();
        console.log("Publisher Screen Stopped");
      },
      streamDestroyed: ({ reason }) => {
        this.toggleScreensharefail();
        console.log(`Publisher Screen destroyed because: ${reason}`);
      },
    };
  }

  connCheckModal = () => {
    this.setState((prevState) => ({
      conncheckmodal: !prevState.conncheckmodal,
    }));
  };

  toggleScreensharefail = () => {
    this.props.toggleScreenshare();
  };

  okModal = () => {
    this.setState((prevState) => ({
      okmodal: !prevState.okmodal,
    }));
  };

  goPatientInfo = () => {
    this.props.pushCloseSignal(
      this.props.user.login.values.loggedInUser.username,
      this.props.appo.APPOINT_NUM,
      "0",
      this.props.cipher.rsapublickey.publickey
    );
    history.push("/patientinfo");
  };

  connectionCheck = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    console.log("connection destroyed");

    Axios.get(`${SERVER_URL2}/doctor/treatment/involve-state`, {
      params: {
        c_key: encryptedrsapkey,
        c_value: AES256.encrypt(
          JSON.stringify({
            user_id: this.props.user.login.values.loggedInUser.username,
            appoint_num: this.props.appo.APPOINT_NUM,
          }),
          AESKey
        ),
      },
    })
      .then((response) => {
        let patstate = decryptByAES(response.data.data);
        if (patstate.STATE_PAT === "2") {
          this.okModal();
        } else {
          this.connCheckModal();
        }
      })
      .catch((err) => console.log(err));
  };

  cameraState = () => {
    this.setState((prevState) => ({
      camerastate: !prevState.camerastate,
    }));
  };

  micState = () => {
    this.setState((prevState) => ({
      micstate: !prevState.micstate,
    }));
  };

  onError = (err) => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  };

  check = () => {
    console.log(this.state);
  };

  disconnectSession = () => {
    this.setState({ connectedtag: false });
    // this.props.pushCloseSignal(
    //   this.props.user.login.values.loggedInUser.username,
    //   this.props.appo.APPOINT_NUM,
    //   "2"
    // );
  };

  childFunction = () => {
    this.props.parentFunction(this.state.onsubscribe);
  };

  onSubscribe = () => {
    this.setState({
      onsubscribe: "Y",
    });
    this.childFunction();
  };

  subscribeCheck = () => {
    this.setState((prevState) => ({
      sconnected: !prevState.sconnected,
    }));
  };

  onPublishScreen = () => {
    console.log("Publish Screen Success");
    this.setState({ error: null });
  };

  onPublishScreenError = (error) => {
    console.log("Publish Screen Error", error);
    this.setState({ error, publishScreen: false });
    window.location.reload();
  };

  toggleScreenshare = () => {
    this.setState((state) => ({
      publishScreen: !state.publishScreen,
    }));
  };

  onError2 = (err) => {
    this.setState({ error: `Failed to publish: ${err.message}` });
    // alert(
    //   "인터넷 상태로 인해 화면공유에 오류가 발생하였습니다\n화면공유를 다시 시도해 주십시오"
    // );
    this.toggleScreensharefail();
    // window.location.reload();
  };

  onError = (err) => {
    this.setState({ error: `Failed to publish: ${err.message}` });
    this.toggleScreensharefail();
  };

  render() {
    return (
      <div>
        <OTSession
          className="col-12 m-0 p-0 d-flex"
          apiKey={this.props.apikey}
          sessionId={this.props.session}
          token={this.props.token}
          onError={this.onError}
          eventHandlers={this.sessionEventHandlers}
        >
          {/* {this.state.error ? <div id="error">{this.state.error}</div> : null} */}

          {this.props.screenshare === true ? (
            <OTPublisher
              className="col-6"
              properties={{
                showControls: false,
                videoSource: "screen",
              }}
              eventHandlers={this.publisherScreenEventHandlers}
              onError={this.onError}
            />
          ) : null}
          {this.state.connectedtag === true ? (
            <OTPublisher
              properties={{
                // width: 200,
                // height: 200,
                showControls: false,
                publishAudio: this.props.micstate,
                publishVideo: this.props.camerastate,
                videoSource:
                  this.props.cameraset === ""
                    ? undefined
                    : this.props.cameraset,
                audioSource:
                  this.props.micset === "" ? undefined : this.props.micset,
                // videoSource: undefined,
                // audioSource: undefined,
              }}
              onPublish={this.onPublishScreen}
              onError={this.onError}
            />
          ) : null}
          <OTStreams>
            <OTSubscriber
              className="otsubscriber col-6 m-0 p-0"
              properties={{
                showControls: false,
              }}
              onSubscribe={this.onSubscribe}
              onError={this.onError}
              eventHandlers={this.subscriberEventHandlers}
            />
          </OTStreams>

          {/* <div className="buttons">
            <img
              src={this.state.micstate === true ? mic : mic_off}
              onClick={this.micState}
              style={{ cursor: "pointer", width: "40px" }}
              className="ml-1"
            />
            <img
              src={this.state.camerastate === true ? video : video_off}
              onClick={this.cameraState}
              style={{ cursor: "pointer", width: "40px" }}
              className="ml-1"
            />
            <img
              src={call}
              onClick={this.disconnectSession}
              style={{ cursor: "pointer", width: "40px" }}
            />
          </div> */}
        </OTSession>
        <Modal isOpen={this.state.conncheckmodal} toggle={this.connCheckModal}>
          <ModalHeader toggle={this.connCheckModal}>
            <b>오류</b>
          </ModalHeader>
          <ModalBody>
            화상진료가 비정상 종료되었습니다.
            <br />
            재입장할 때까지 대기해주세요.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.connCheckModal}>
              <FormattedMessage id="확인" />
            </Button>
            {/* <Button color="primary" outline onClick={this.goPatientInfo}>
              전화끊기
            </Button> */}
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.okmodal} toggle={this.okModal}>
          <ModalHeader toggle={this.okModal}>
            <b>
              {" "}
              <FormattedMessage id="확인" />
            </b>
          </ModalHeader>
          <ModalBody>화상진료가 종료되었습니다.</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.okModal}>
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    appo: state.dataList.appointment,
    dataList: state.dataList,
    cipher: state.auth.cipher,
  };
};

export default preloadScript(
  connect(mapStateToProps, { pushCloseSignal })(ConsultingRoom)
);
