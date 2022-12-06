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
} from "reactstrap";
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
} from "../../../../redux/actions/data-list";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "../../../../assets/scss/plugins/extensions/recharts.scss";
import pressure_1 from "../../../../assets/img/dashboard/ID12_08_vital_pressure1.png";
import pressure_2 from "../../../../assets/img/dashboard/ID12_08_vital_pressure2.png";
import pressure_3 from "../../../../assets/img/dashboard/ID12_08_vital_pressure3.png";
import pressure_4 from "../../../../assets/img/dashboard/ID12_08_vital_pressure4.png";
import pressure_5 from "../../../../assets/img/dashboard/ID12_08_vital_pressure5.png";
import pulse_1 from "../../../../assets/img/dashboard/ID12_08_vital_pulse1.png";
import pulse_2 from "../../../../assets/img/dashboard/ID12_08_vital_pulse2.png";
import pulse_3 from "../../../../assets/img/dashboard/ID12_08_vital_pulse3.png";
import pulse_4 from "../../../../assets/img/dashboard/ID12_08_vital_pulse4.png";
import pulse_5 from "../../../../assets/img/dashboard/ID12_08_vital_pulse5.png";
import weight_1 from "../../../../assets/img/dashboard/ID12_08_vital_weight1.png";
import weight_2 from "../../../../assets/img/dashboard/ID12_08_vital_weight2.png";
import weight_3 from "../../../../assets/img/dashboard/ID12_08_vital_weight3.png";
import weight_4 from "../../../../assets/img/dashboard/ID12_08_vital_weight4.png";
import weight_5 from "../../../../assets/img/dashboard/ID12_08_vital_weight5.png";
import glucose_1 from "../../../../assets/img/dashboard/ID12_08_vital_glucose1.png";
import glucose_2 from "../../../../assets/img/dashboard/ID12_08_vital_glucose2.png";
import glucose_3 from "../../../../assets/img/dashboard/ID12_08_vital_glucose3.png";
import glucose_4 from "../../../../assets/img/dashboard/ID12_08_vital_glucose4.png";
import glucose_5 from "../../../../assets/img/dashboard/ID12_08_vital_glucose5.png";
import temperature_1 from "../../../../assets/img/dashboard/ID12_08_vital_temperature1.png";
import temperature_2 from "../../../../assets/img/dashboard/ID12_08_vital_temperature2.png";
import temperature_3 from "../../../../assets/img/dashboard/ID12_08_vital_temperature3.png";
import temperature_4 from "../../../../assets/img/dashboard/ID12_08_vital_temperature4.png";
import temperature_5 from "../../../../assets/img/dashboard/ID12_08_vital_temperature5.png";
import spo2_1 from "../../../../assets/img/dashboard/ID12_08_vital_spo2 1.png";
import spo2_2 from "../../../../assets/img/dashboard/ID12_08_vital_spo2 2.png";
import spo2_3 from "../../../../assets/img/dashboard/ID12_08_vital_spo2 3.png";
import spo2_4 from "../../../../assets/img/dashboard/ID12_08_vital_spo2 4.png";
import spo2_5 from "../../../../assets/img/dashboard/ID12_08_vital_spo2 5.png";
import setting from "../../../../assets/img/dashboard/ID16_27_setting.png";
import { FormattedMessage } from "react-intl";

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
      periodname: "",
      startdate: "",
      enddate: "",
      startpicker: new Date(),
      endpicker: new Date(),
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
                this.state.startdate,
                this.props.cipher.rsapublickey.publickey
              );
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
                this.state.startdate,
                this.props.cipher.rsapublickey.publickey
              );
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
                this.state.startdate,
                this.props.cipher.rsapublickey.publickey
              );
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
                this.state.startdate,
                this.props.cipher.rsapublickey.publickey
              );
            }
          );
        }
      }
    );
  };

  serachVitalData = (e) => {
    e.preventDefault();
    this.props.resetVitalData();
    this.setState({ periodname: "", startdate: "", enddate: "" });
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
      this.props.pinfo.PATIENT_ID,
      this.props.cipher.rsapublickey.publickey
    );
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
        {/* 환자정보, 버튼 모음 Row */}
        <Row>
          <Col className="col-12">
            <table id="tblTopBar">
              <thead>
                <tr className="table-primary text-center ">
                  <th id="tblTopBarTh">
                    <h5 style={{}}>
                      {this.props.appo === null
                        ? null
                        : this.props.appo.APPOINT_TIME}
                    </h5>
                  </th>
                  <th>
                    <h5 className="text-bold-600">{this.props.pinfo.F_NAME}</h5>
                  </th>
                  <th>
                    <h5 className="text-bold-600">
                      {this.props.pinfo.GENDER === "1" ||
                      this.props.pinfo.GENDER === "3"
                        ? "M"
                        : "F"}
                    </h5>
                  </th>
                  <th>
                    <h5 className="text-bold-600">{this.props.pinfo.AGE}</h5>
                  </th>
                  <th>
                    <h5 className="text-bold-600">
                      {this.props.pinfo.BIRTH_DT}
                    </h5>
                  </th>
                  <th>
                    <h5 className="text-bold-600">
                      {this.props.pinfo.NOTE_DX}
                    </h5>
                  </th>
                  <th>
                    <h5 className="text-bold-600">
                      {this.props.pinfo.FIRST_YN === "N" ? (
                        <FormattedMessage id="재진" />
                      ) : (
                        <FormattedMessage id="초진" />
                      )}
                    </h5>
                  </th>
                  <th className="text-center">
                    <h5 id="vitalIcons">
                      {this.props.pinfo.BP === "00" ? (
                        <img
                          id="혈압"
                          src={pressure_2}
                          width="35px"
                          alt="pressure_2"
                        />
                      ) : this.props.pinfo.BP === "01" ? (
                        <img
                          id="혈압"
                          src={pressure_1}
                          width="35px"
                          alt="pressure_1"
                        />
                      ) : this.props.pinfo.BP === "99" ? (
                        <img
                          id="혈압"
                          src={pressure_1}
                          width="35px"
                          alt="pressure_1"
                        />
                      ) : this.props.pinfo.BP === "02" ? (
                        <img
                          id="혈압"
                          src={pressure_5}
                          width="35px"
                          alt="pressure_5"
                        />
                      ) : this.props.pinfo.BP === "03" ? (
                        <img
                          id="혈압"
                          src={pressure_4}
                          width="35px"
                          alt="pressure_4"
                        />
                      ) : this.props.pinfo.BP === "04" ? (
                        <img
                          id="혈압"
                          src={pressure_3}
                          width="35px"
                          alt="pressure_3"
                        />
                      ) : null}
                      {this.props.pinfo.PULSE === "00" ? (
                        <img
                          id="맥박"
                          src={pulse_2}
                          width="35px"
                          alt="pulse_2"
                        />
                      ) : this.props.pinfo.PULSE === "01" ? (
                        <img
                          id="맥박"
                          src={pulse_1}
                          width="35px"
                          alt="pulse_1"
                        />
                      ) : this.props.pinfo.PULSE === "99" ? (
                        <img
                          id="맥박"
                          src={pulse_1}
                          width="35px"
                          alt="pulse_1"
                        />
                      ) : this.props.pinfo.PULSE === "02" ? (
                        <img
                          id="맥박"
                          src={pulse_5}
                          width="35px"
                          alt="pulse_5"
                        />
                      ) : this.props.pinfo.PULSE === "03" ? (
                        <img
                          id="맥박"
                          src={pulse_4}
                          width="35px"
                          alt="pulse_4"
                        />
                      ) : this.props.pinfo.PULSE === "04" ? (
                        <img
                          id="맥박"
                          src={pulse_3}
                          width="35px"
                          alt="pulse_3"
                        />
                      ) : null}
                      {this.props.pinfo.BW === "00" ? (
                        <img
                          id="체중"
                          src={weight_2}
                          width="35px"
                          alt="weight_2"
                        />
                      ) : this.props.pinfo.BW === "01" ? (
                        <img
                          id="체중"
                          src={weight_1}
                          width="35px"
                          alt="weight_1"
                        />
                      ) : this.props.pinfo.BW === "99" ? (
                        <img
                          id="체중"
                          src={weight_1}
                          width="35px"
                          alt="weight_1"
                        />
                      ) : this.props.pinfo.BW === "02" ? (
                        <img
                          id="체중"
                          src={weight_5}
                          width="35px"
                          alt="weight_5"
                        />
                      ) : this.props.pinfo.BW === "03" ? (
                        <img
                          id="체중"
                          src={weight_4}
                          width="35px"
                          alt="weight_4"
                        />
                      ) : this.props.pinfo.BW === "04" ? (
                        <img
                          id="체중"
                          src={weight_3}
                          width="35px"
                          alt="weight_3"
                        />
                      ) : null}
                      {this.props.pinfo.BS === "00" ? (
                        <img
                          id="혈당"
                          src={glucose_2}
                          width="35px"
                          alt="glucose_2"
                        />
                      ) : this.props.pinfo.BS === "01" ? (
                        <img
                          id="혈당"
                          src={glucose_1}
                          width="35px"
                          alt="glucose_1"
                        />
                      ) : this.props.pinfo.BS === "99" ? (
                        <img
                          id="혈당"
                          src={glucose_1}
                          width="35px"
                          alt="glucose_1"
                        />
                      ) : this.props.pinfo.BS === "02" ? (
                        <img
                          id="혈당"
                          src={glucose_5}
                          width="35px"
                          alt="glucose_5"
                        />
                      ) : this.props.pinfo.BS === "03" ? (
                        <img
                          id="혈당"
                          src={glucose_4}
                          width="35px"
                          alt="glucose_4"
                        />
                      ) : this.props.pinfo.BS === "04" ? (
                        <img
                          id="혈당"
                          src={glucose_3}
                          width="35px"
                          alt="glucose_3"
                        />
                      ) : null}
                      {this.props.pinfo.TEMPERATURE === "00" ? (
                        <img
                          id="체온"
                          src={temperature_2}
                          width="35px"
                          alt="temperature_2"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "01" ? (
                        <img
                          id="체온"
                          src={temperature_1}
                          width="35px"
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "99" ? (
                        <img
                          id="체온"
                          src={temperature_1}
                          width="35px"
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "02" ? (
                        <img
                          id="체온"
                          src={temperature_5}
                          width="35px"
                          alt="temperature_5"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "03" ? (
                        <img
                          id="체온"
                          src={temperature_4}
                          width="35px"
                          alt="temperature_4"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "04" ? (
                        <img
                          id="체온"
                          src={temperature_3}
                          width="35px"
                          alt="temperature_3"
                        />
                      ) : null}
                      {this.props.pinfo.SPO2 === "00" ? (
                        <img
                          id="산소포화도"
                          src={spo2_2}
                          width="35px"
                          alt="spo2_2"
                        />
                      ) : this.props.pinfo.SPO2 === "01" ? (
                        <img
                          id="산소포화도"
                          src={spo2_1}
                          width="35px"
                          alt="spo2_1"
                        />
                      ) : this.props.pinfo.SPO2 === "99" ? (
                        <img
                          id="산소포화도"
                          src={spo2_1}
                          width="35px"
                          alt="spo2_1"
                        />
                      ) : this.props.pinfo.SPO2 === "02" ? (
                        <img
                          id="산소포화도"
                          src={spo2_5}
                          width="35px"
                          alt="spo2_5"
                        />
                      ) : this.props.pinfo.SPO2 === "03" ? (
                        <img
                          id="산소포화도"
                          src={spo2_4}
                          width="35px"
                          alt="spo2_4"
                        />
                      ) : this.props.pinfo.SPO2 === "04" ? (
                        <img
                          id="산소포화도"
                          src={spo2_3}
                          width="35px"
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
                  {/* <th id="tblBottomBarTh"><img src={setting} onClick={this.goVitatDataSetting}  width="25px" style={{cursor:"pointer"}} /></th> */}
                </tr>
              </thead>
            </table>
          </Col>
        </Row>

        <Row className="mt-4 flex-wrap">
          <Col xl="12" lg="12" md="12" sm="12" className="d-flex">
            <h5 className="text-bold-600 align-self-center">선택 항목</h5>
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
              {/* <Button.Ripple color="primary" onClick={this.check}>산소포화도</Button.Ripple>{" "} */}
            </ButtonGroup>
          </Col>

          <Col xl="12" lg="12" md="12" sm="12" className="d-flex ml-auto mt-1">
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
        </Row>
        <Row className="mt-2">
          <Col
            xl="12"
            lg="12"
            md="12"
            sm="12"
            className="d-flex align-self-center"
          >
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
            <h5 className="text-bold-600 align-self-center">-</h5>
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
                          name="수축기"
                          type="monotone"
                          dataKey="SYS_VAL"
                          stroke="#EA5455"
                        />
                        <Line
                          name="이완기"
                          type="monotone"
                          dataKey="DIA_VAL"
                          stroke="#7367F0"
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
                          stroke="#7367F0"
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
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  getVitalDataAll,
  serachVitalData,
  resetVitalData,
  getVitalSettingData,
})(VitalData);
