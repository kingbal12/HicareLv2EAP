import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
} from "reactstrap";
import Radio from "../../../../components/@vuexy/radio/RadioVuexy";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Search } from "react-feather";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Fragment } from "react";
import previmg from "../../../../assets/img/portrait/small/Sample_User_Icon.png";
import moment from "moment";
import {
  getVitalDataAll,
  resetVitalData,
  serachVitalData,
  getVitalSettingData,
  convertUnit,
} from "../../../../redux/actions/data-list/";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "../../../../assets/scss/plugins/extensions/recharts.scss";
import pressure_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure1.png";
import pressure_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure3.png";
import pressure_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure4.png";
import pressure_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure5.png";
import pulse_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse1.png";
import pulse_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse3.png";
import pulse_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse4.png";
import pulse_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse5.png";
import weight_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight1.png";
import weight_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight3.png";
import weight_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight4.png";
import weight_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight5.png";
import glucose_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose1.png";
import glucose_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose3.png";
import glucose_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose4.png";
import glucose_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose5.png";
import temperature_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature1.png";
import temperature_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature3.png";
import temperature_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature4.png";
import temperature_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature5.png";
import spo2_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 1.png";
import spo2_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 3.png";
import spo2_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 4.png";
import spo2_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 5.png";
import setting from "../../../../assets/img/dashboard/ID16_27_setting.png";
import { FormattedMessage } from "react-intl";
import Countdown from "react-countdown";

class VitalData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpbutton: true,
      pulsebutton: true,
      webutton: true,
      glbutton: true,
      tempbutton: true,
      spo2button: true,
      bandbutton: true,
      periodname: "",
      startdate: "",
      enddate: "",
      startpicker: new Date(),
      endpicker: new Date(),
      convertmodal: false,
      length: "",
      weight: "",
      temperature: "",
    };
  }

  componentDidMount() {
    console.log(this.props.user);
    console.log(this.props.dataList);
  }

  handlebp = () => {
    this.setState((prevState) => ({
      bpbutton: !prevState.bpbutton,
    }));
  };

  handlepulse = () => {
    this.setState((prevState) => ({
      pulsebutton: !prevState.pulsebutton,
    }));
  };

  handlewe = () => {
    this.setState((prevState) => ({
      webutton: !prevState.webutton,
    }));
  };

  handlegl = () => {
    this.setState((prevState) => ({
      glbutton: !prevState.glbutton,
    }));
  };

  handletemp = () => {
    this.setState((prevState) => ({
      tempbutton: !prevState.tempbutton,
    }));
  };

  handlespo2 = () => {
    this.setState((prevState) => ({
      spo2button: !prevState.spo2button,
    }));
  };

  handleband = () => {
    this.setState((prevState) => ({
      bandbutton: !prevState.bandbutton,
    }));
  };

  handleStartPicker = () => {
    this.setState((prevState) => ({
      startpickerbtn: !prevState.startpickerbtn,
    }));
  };

  handleEndPicker = () => {
    this.setState((prevState) => ({
      endpickerbtn: !prevState.endpickerbtn,
    }));
  };

  handlePeriod = (periodname) => {
    this.setState(
      { periodname, startpicker: new Date(), endpicker: new Date() },
      () => {
        if (this.state.periodname === "today") {
          this.props.resetVitalData();
          this.setState(
            {
              startdate: moment().format("YYYYMMDD"),
              enddate: moment().format("YYYY-MM-DD"),
              startpicker: "",
              endpicker: "",
            },
            () => {
              this.props.getVitalDataAll(
                this.props.pinfo.PATIENT_ID,
                this.state.startdate
              );

              // 암호화
              // this.props.getVitalDataAll(
              //   this.props.pinfo.PATIENT_ID,
              //   this.state.startdate,
              //   this.props.cipher.rsapublickey.publickey
              // );
            }
          );
        } else if (this.state.periodname === "week") {
          this.props.resetVitalData();
          this.setState(
            {
              startdate: moment().add(-6, "days").format("YYYYMMDD"),
              enddate: moment().format("YYYY-MM-DD"),
              startpicker: "",
              endpicker: "",
            },
            () => {
              this.props.getVitalDataAll(
                this.props.pinfo.PATIENT_ID,
                this.state.startdate
              );

              // 암호화
              // this.props.getVitalDataAll(
              //   this.props.pinfo.PATIENT_ID,
              //   this.state.startdate,
              //   this.props.cipher.rsapublickey.publickey
              // );
            }
          );
        } else if (this.state.periodname === "month") {
          this.props.resetVitalData();
          this.setState(
            {
              startdate: moment().add(-29, "days").format("YYYYMMDD"),
              enddate: moment().format("YYYY-MM-DD"),
              startpicker: "",
              endpicker: "",
            },
            () => {
              this.props.getVitalDataAll(
                this.props.pinfo.PATIENT_ID,
                this.state.startdate
              );
              // 암호화
              // this.props.getVitalDataAll(
              //   this.props.pinfo.PATIENT_ID,
              //   this.state.startdate,
              //   this.props.cipher.rsapublickey.publickey
              // );
            }
          );
        } else if (this.state.periodname === "months") {
          this.props.resetVitalData();
          this.setState(
            {
              startdate: moment().add(-89, "days").format("YYYYMMDD"),
              enddate: moment().format("YYYY-MM-DD"),
              startpicker: "",
              endpicker: "",
            },
            () => {
              this.props.getVitalDataAll(
                this.props.pinfo.PATIENT_ID,
                this.state.startdate
              );
              // 암호화
              // this.props.getVitalDataAll(
              //   this.props.pinfo.PATIENT_ID,
              //   this.state.startdate,
              //   this.props.cipher.rsapublickey.publickey
              // );
            }
          );
        }
      }
    );
  };

  serachVitalData = () => {
    this.props.resetVitalData();
    this.setState({ periodname: "", startdate: "", enddate: "" });

    // 암호화
    this.props.serachVitalData(
      this.props.pinfo.PATIENT_ID,
      this.state.startpicker,
      this.state.endpicker,
      this.props.cipher.rsapublickey.publickey
    );
  };

  goVitatDataSetting = (e) => {
    e.preventDefault();
    this.props.getVitalSettingData(
      this.props.user.login.values.loggedInUser.username,
      this.props.pinfo.PATIENT_ID
    );

    // 암호화
    // this.props.getVitalSettingData(
    //   this.props.user.login.values.loggedInUser.username,
    //   this.props.pinfo.PATIENT_ID,
    //   this.props.cipher.rsapublickey.publickey
    // );
  };

  componentDidMount = () => {
    this.setState({
      length: sessionStorage.getItem("UNIT_LENGTH"),
      weight: sessionStorage.getItem("UNIT_WEIGHT"),
      temperature: sessionStorage.getItem("UNIT_TEMP"),
    });
  };

  convertSave = () => {
    window.sessionStorage.setItem("UNIT_LENGTH", this.state.length);
    window.sessionStorage.setItem("UNIT_WEIGHT", this.state.weight);
    window.sessionStorage.setItem("UNIT_TEMP", this.state.temperature);
    this.convertModal();
    this.props.convertUnit(
      this.props.user.login.values.loggedInUser.username,
      this.state.length,
      this.state.weight,
      this.state.temperature,
      this.props.cipher.rsapublickey.publickey
    );
    this.serachVitalData();
  };

  convertModal = () => {
    this.setState((prevState) => ({
      convertmodal: !prevState.convertmodal,
    }));
  };

  render() {
    let { startpicker, endpicker } = this.state;

    let profile_preview = null;

    profile_preview = (
      <div className="dz-thumb ">
        <div className="dz-thumb-inner">
          <img
            width="100px"
            height="100px"
            src={previmg}
            className="dz-img"
            style={{ borderRadius: "100%" }}
            alt=""
          />
        </div>
      </div>
    );

    return (
      <Fragment>
        {/* 단위 변경 Modal */}
        <Modal
          isOpen={this.state.convertmodal}
          toggle={this.convertModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.convertModal}>측정 단위 설정</ModalHeader>
          <ModalBody>
            <FormGroup>
              <div className="text-bold-600">측정 단위를 선택하세요</div>
              <div className="d-flex mt-1">
                <div className="mr-4" style={{ marginTop: "4px" }}>
                  길이
                </div>
                <div className="mr-2 ml-5">
                  <Radio
                    label="cm(센티미터)"
                    defaultChecked={this.state.length === "cm" ? true : false}
                    name="length"
                    value="cm"
                    onChange={(e) => this.setState({ length: e.target.value })}
                  />
                </div>
                <div>
                  <Radio
                    label="in(인치)"
                    defaultChecked={this.state.length === "in" ? true : false}
                    name="length"
                    value="in"
                    onChange={(e) =>
                      this.setState({
                        length: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="d-flex mt-1">
                <div className="mr-4" style={{ marginTop: "4px" }}>
                  무게
                </div>
                <div className="mr-2 ml-5">
                  <Radio
                    label="kg(킬로그램)"
                    defaultChecked={this.state.weight === "kg" ? true : false}
                    name="weight"
                    value="kg"
                    onChange={(e) => this.setState({ weight: e.target.value })}
                  />
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Radio
                    label="lb(파운드)"
                    defaultChecked={this.state.weight === "lb" ? true : false}
                    name="weight"
                    value="lb"
                    onChange={(e) =>
                      this.setState({
                        weight: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="d-flex mt-1">
                <div className="mr-4" style={{ marginTop: "4px" }}>
                  온도
                </div>
                <div className="ml-5 mr-2">
                  <Radio
                    label="℃(섭씨)"
                    defaultChecked={
                      this.state.temperature === "c" ? true : false
                    }
                    name="temp"
                    value="c"
                    onChange={(e) =>
                      this.setState({ temperature: e.target.value })
                    }
                  />
                </div>
                <div style={{ marginLeft: "35px" }}>
                  <Radio
                    label="℉(화씨)"
                    defaultChecked={
                      this.state.temperature === "f" ? true : false
                    }
                    name="temp"
                    value="f"
                    onChange={(e) =>
                      this.setState({
                        temperature: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormGroup>
            <Button color="primary" onClick={this.convertSave}>
              <FormattedMessage id="Save" />
            </Button>
          </ModalBody>
        </Modal>
        {/* 환자정보, 버튼 모음 Row */}
        <Row>
          <Col className="col-12">
            <table id="tblTopBar">
              <tbody>
                <tr>
                  <th>
                    <div
                      id="tblTopBarTh"
                      style={{
                        marginLeft: "24px",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#113055",
                      }}
                    >
                      {this.props.pinfo.L_NAME + this.props.pinfo.F_NAME}
                    </div>
                  </th>
                  <th style={{ maxWidth: "150px" }}>
                    <div
                      style={{
                        fontWeight: "400",
                      }}
                    >
                      {this.props.appo === null ? null : this.props.topappotime}
                    </div>

                    {this.props.appo === null ? null : this.props.appo
                        .MEDICAL_KIND === "1" ? (
                      <div
                        style={{
                          color: "#a29eaf",
                          fontWeight: "400",
                        }}
                      >
                        General Treatment
                      </div>
                    ) : this.props.appo.MEDICAL_KIND === "2" ? (
                      <div
                        style={{
                          color: "#a29eaf",
                          fontWeight: "400",
                        }}
                      >
                        원격상담, 로컬 협진
                      </div>
                    ) : this.props.appo.MEDICAL_KIND === "3" ? (
                      <div
                        style={{
                          color: "#a29eaf",
                          fontWeight: "400",
                        }}
                      >
                        Second Opnion
                      </div>
                    ) : null}
                  </th>
                  <th className="text-left">
                    <h5 id="vitalIcons">
                      {this.props.pinfo.BP === "01" ? (
                        <img id="혈압" src={pressure_1} alt="pressure_1" />
                      ) : this.props.pinfo.BP === "99" ? (
                        <img id="혈압" src={pressure_1} alt="pressure_1" />
                      ) : this.props.pinfo.BP === "02" ? (
                        <img id="혈압" src={pressure_5} alt="pressure_5" />
                      ) : this.props.pinfo.BP === "03" ? (
                        <img id="혈압" src={pressure_4} alt="pressure_4" />
                      ) : this.props.pinfo.BP === "04" ? (
                        <img id="혈압" src={pressure_3} alt="pressure_3" />
                      ) : null}
                      {this.props.pinfo.PULSE === "01" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="맥박"
                          src={pulse_1}
                          alt="pulse_1"
                        />
                      ) : this.props.pinfo.PULSE === "99" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="맥박"
                          src={pulse_1}
                          alt="pulse_1"
                        />
                      ) : this.props.pinfo.PULSE === "02" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="맥박"
                          src={pulse_5}
                          alt="pulse_5"
                        />
                      ) : this.props.pinfo.PULSE === "03" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="맥박"
                          src={pulse_4}
                          alt="pulse_4"
                        />
                      ) : this.props.pinfo.PULSE === "04" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="맥박"
                          src={pulse_3}
                          alt="pulse_3"
                        />
                      ) : null}
                      {this.props.pinfo.BW === "01" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체중"
                          src={weight_1}
                          alt="weight_1"
                        />
                      ) : this.props.pinfo.BW === "99" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체중"
                          src={weight_1}
                          alt="weight_1"
                        />
                      ) : this.props.pinfo.BW === "02" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체중"
                          src={weight_5}
                          alt="weight_5"
                        />
                      ) : this.props.pinfo.BW === "03" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체중"
                          src={weight_4}
                          alt="weight_4"
                        />
                      ) : this.props.pinfo.BW === "04" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체중"
                          src={weight_3}
                          alt="weight_3"
                        />
                      ) : null}
                      {this.props.pinfo.BS === "01" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="혈당"
                          src={glucose_1}
                          alt="glucose_1"
                        />
                      ) : this.props.pinfo.BS === "99" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="혈당"
                          src={glucose_1}
                          alt="glucose_1"
                        />
                      ) : this.props.pinfo.BS === "02" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="혈당"
                          src={glucose_5}
                          alt="glucose_5"
                        />
                      ) : this.props.pinfo.BS === "03" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="혈당"
                          src={glucose_4}
                          alt="glucose_4"
                        />
                      ) : this.props.pinfo.BS === "04" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="혈당"
                          src={glucose_3}
                          alt="glucose_3"
                        />
                      ) : null}
                      {this.props.pinfo.TEMPERATURE === "01" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체온"
                          src={temperature_1}
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "99" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체온"
                          src={temperature_1}
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "02" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체온"
                          src={temperature_5}
                          alt="temperature_5"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "03" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체온"
                          src={temperature_4}
                          alt="temperature_4"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "04" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="체온"
                          src={temperature_3}
                          alt="temperature_3"
                        />
                      ) : null}
                      {this.props.pinfo.SPO2 === "01" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="산소포화도"
                          src={spo2_1}
                          alt="spo2_1"
                        />
                      ) : this.props.pinfo.SPO2 === "99" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="산소포화도"
                          src={spo2_1}
                          alt="spo2_1"
                        />
                      ) : this.props.pinfo.SPO2 === "02" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="산소포화도"
                          src={spo2_5}
                          alt="spo2_5"
                        />
                      ) : this.props.pinfo.SPO2 === "03" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="산소포화도"
                          src={spo2_4}
                          alt="spo2_4"
                        />
                      ) : this.props.pinfo.SPO2 === "04" ? (
                        <img
                          style={{ marginLeft: "8px" }}
                          id="산소포화도"
                          src={spo2_3}
                          alt="spo2_3"
                        />
                      ) : null}
                    </h5>
                    <UncontrolledTooltip placement="bottom" target="혈압">
                      <FormattedMessage id="혈압" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="맥박">
                      <FormattedMessage id="맥박" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="체중">
                      <FormattedMessage id="체중" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="혈당">
                      <FormattedMessage id="혈당" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="체온">
                      <FormattedMessage id="체온" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="산소포화도">
                      <FormattedMessage id="SPO2" />
                    </UncontrolledTooltip>
                  </th>
                  <th>
                    {this.props.appo === null ? (
                      ""
                    ) : moment(this.props.rtime).add(-15, "m") <= moment() &&
                      moment() <= moment(this.props.rtime) ? (
                      <Countdown date={moment(this.props.rtime)}></Countdown>
                    ) : (
                      ""
                    )}
                  </th>
                  <th
                    id="tblBottomBarTh"
                    style={{ paddingRight: "24px" }}
                    className="text-right"
                  >
                    {this.props.appo === null ? null : this.props.appo
                        .APPOINT_STATE === "AF" ||
                      this.props.appo.APPOINT_STATE === "VF" ||
                      this.props.appo.APPOINT_STATE === "TF" ? (
                      moment(this.props.rtime).add(-15, "m") > moment() ||
                      moment() >
                        moment(this.props.rtime).add(30, "m") ? null : (
                        <Button
                          disabled={
                            moment() > moment(this.props.rtime).add(-5, "m")
                              ? false
                              : true
                          }
                          onClick={this.goCallSetting}
                          color="primary"
                        >
                          진료실 입장
                        </Button>
                      )
                    ) : null}
                  </th>
                  <th id="tblBottomBarTh">
                    <img
                      src={setting}
                      onClick={this.goVitatDataSetting}
                      width="30px"
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>

        <Row className="mt-4 flex-wrap">
          <Col xl="9" lg="12" md="12" sm="12" className="d-flex">
            <h5 className="text-bold-600 align-self-center">
              <FormattedMessage id="선택 항목" />
            </h5>
            <ButtonGroup className="ml-1">
              <Button.Ripple
                outline={this.state.bpbutton === true ? false : true}
                color="primary"
                onClick={this.handlebp}
              >
                <FormattedMessage id="혈압" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.pulsebutton === true ? false : true}
                color="primary"
                onClick={this.handlepulse}
              >
                <FormattedMessage id="맥박" />
              </Button.Ripple>{" "}
              <Button.Ripple
                outline={this.state.webutton === true ? false : true}
                color="primary"
                onClick={this.handlewe}
              >
                <FormattedMessage id="체중" />
              </Button.Ripple>{" "}
              <Button.Ripple
                outline={this.state.glbutton === true ? false : true}
                color="primary"
                onClick={this.handlegl}
              >
                <FormattedMessage id="혈당" />
              </Button.Ripple>{" "}
              <Button.Ripple
                outline={this.state.tempbutton === true ? false : true}
                color="primary"
                onClick={this.handletemp}
              >
                <FormattedMessage id="체온" />
              </Button.Ripple>{" "}
              <Button.Ripple
                outline={this.state.spo2button === true ? false : true}
                color="primary"
                onClick={this.handlespo2}
              >
                <FormattedMessage id="SPO2" />
              </Button.Ripple>{" "}
              <Button.Ripple
                outline={this.state.bandbutton === true ? false : true}
                color="primary"
                onClick={this.handleband}
              >
                SmartBand
              </Button.Ripple>{" "}
              {/* <Button.Ripple color="primary" onClick={this.check}>산소포화도</Button.Ripple>{" "} */}
            </ButtonGroup>
          </Col>

          <Col xl="3" lg="12" md="12" sm="12" className="text-right">
            <button
              onClick={() => this.convertModal()}
              className={`btn ${
                this.state.convertmodal === true
                  ? "btn-primary"
                  : "btn-outline-primary text-primary"
              }`}
            >
              단위 설정
            </button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="col-6 d-flex">
            <h5 className="text-bold-600 align-self-center">
              <FormattedMessage id="기간" />
            </h5>

            <ButtonGroup className="ml-4">
              <button
                // disabled={this.state.startpickerbtn===true || this.state.endpickerbtn===true?true:false}
                onClick={() => this.handlePeriod("today")}
                className={`btn ${
                  this.state.periodname === "today"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
              >
                <FormattedMessage id="오늘" />
              </button>
              <button
                // disabled={this.state.startpickerbtn===true || this.state.endpickerbtn===true?true:false}
                onClick={() => this.handlePeriod("week")}
                className={`btn ${
                  this.state.periodname === "week"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
              >
                <FormattedMessage id="1주" />
              </button>

              <button
                // disabled={this.state.startpickerbtn===true || this.state.endpickerbtn===true?true:false}
                onClick={() => this.handlePeriod("month")}
                className={`btn ${
                  this.state.periodname === "month"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
              >
                <FormattedMessage id="1개월" />
              </button>

              <button
                // disabled={this.state.startpickerbtn===true || this.state.endpickerbtn===true?true:false}
                onClick={() => this.handlePeriod("months")}
                className={`btn ${
                  this.state.periodname === "months"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
              >
                <FormattedMessage id="3개월" />
              </button>
            </ButtonGroup>
          </Col>

          <Col className="col-6 d-flex justify-content-end">
            <h5 className="text-bold-600 align-self-center">
              <FormattedMessage id="직접입력" />
            </h5>
            <Flatpickr
              className="form-control col-3 align-self-center ml-1"
              value={startpicker}
              onChange={(date) => {
                this.setState({ startpicker: date });
                this.handleStartPicker();
              }}
            />
            <h5 className="text-bold-600 align-self-center mx-1"> - </h5>
            <Flatpickr
              className="form-control col-3 align-self-center"
              value={endpicker}
              onChange={(date) => {
                this.setState({ endpicker: date });
                this.handleEndPicker();
              }}
            />
            <Button.Ripple
              className="ml-1 align-self-center"
              color="primary"
              onClick={this.serachVitalData}
            >
              <Search size={14} />
            </Button.Ripple>
          </Col>
        </Row>

        <Row className="mt-4">
          {this.props.bpdata.length === 0 ? null : this.state.bpbutton ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">
                        <FormattedMessage id="혈압" />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg="12" className="justify-content-center">
                      {/* <h6 className="text-bold-600">{this.state.startdate===""?this.state.startpicker: this.state.startdate}</h6> ~ <h6 className="text-bold-600">{this.startdate===""?this.state.endpicker:this.state.enddate}</h6> */}
                    </Col>
                  </Row>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.bpdata}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="Sys"
                          type="monotone"
                          dataKey="SYS_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          name="Dia"
                          type="monotone"
                          dataKey="DIA_VAL"
                          stroke="#1565C0"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {this.props.pulstdata.length === 0 ? null : this.state.pulsebutton ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">
                        <FormattedMessage id="맥박" />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.pulstdata}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="맥박"
                          type="monotone"
                          dataKey="PULSE_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {this.props.wedata.length === 0 ? null : this.state.webutton ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">
                        <FormattedMessage id="체중" />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.wedata}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="몸무게"
                          type="monotone"
                          dataKey="WEIGHT_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          name="BMI"
                          type="monotone"
                          dataKey="BMI_VAL"
                          stroke="#1565C0"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {this.props.bsdata.length === 0 ? null : this.state.glbutton ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">
                        <FormattedMessage id="혈당" />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.bsdata}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="혈당"
                          type="monotone"
                          dataKey="GLUCOSE_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {this.props.tempdata.length === 0 ? null : this.state.tempbutton ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">
                        <FormattedMessage id="체온" />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.tempdata}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="체온"
                          type="monotone"
                          dataKey="TEMP_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {this.props.spo2data.length === 0 ? null : this.state.spo2button ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">
                        <FormattedMessage id="SPO2" />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.spo2data}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="SPO2"
                          type="monotone"
                          dataKey="SPO2_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {this.props.banddata.length === 0 ? null : this.state.bandbutton ===
            false ? null : (
            <Col lg="6" md="12">
              <Card>
                <CardHeader className="justify-content-center">
                  <Row>
                    <Col lg="12">
                      <h5 className="text-bold-600">SmartBand</h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="recharts-wrapper">
                    <ResponsiveContainer>
                      <LineChart
                        width={500}
                        height={300}
                        data={this.props.banddata}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 10 }} dataKey="CREATE_TIME" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          name="Calorie"
                          type="monotone"
                          dataKey="CAL_VAL"
                          stroke="#EA5455"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          name="Walk"
                          type="monotone"
                          dataKey="WALK_VAL"
                          stroke="#1565C0"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          name="Pulse"
                          type="monotone"
                          dataKey="PULSE_VAL"
                          stroke="#3cb371"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    dataList: state.dataList,
    appo: state.dataList.appointment,
    pinfo: state.dataList.patient,
    cslist: state.dataList.csdata,
    bpdata: state.dataList.BP,
    pulstdata: state.dataList.PULSE,
    tempdata: state.dataList.TEMP,
    bsdata: state.dataList.BS,
    wedata: state.dataList.WE,
    spo2data: state.dataList.SPO2,
    banddata: state.dataList.BAND,
    cipher: state.auth.cipher,
    topappotime: state.dataList.topappotime,
    rtime: state.dataList.rtime,
  };
};

export default connect(mapStateToProps, {
  getVitalDataAll,
  serachVitalData,
  resetVitalData,
  getVitalSettingData,
  convertUnit,
})(VitalData);
