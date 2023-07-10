import React from "react";
import {
  Button,
  Row,
  Col,
  ButtonGroup,
  TabContent,
  TabPane,
  UncontrolledTooltip,
} from "reactstrap";
import { getPastConulstList } from "../../../../redux/actions/data-list";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Fragment } from "react";
import classnames from "classnames";
import BPSetting from "./BPSetting";
import PulseSetting from "./PulseSetting";
import WESetting from "./WESetting";
import BSSetting from "./BSSetting";
import TempSetting from "./TempSetting";
import SPO2Setting from "./SPO2Setting";
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
import Countdown from "react-countdown";
import { FormattedMessage } from "react-intl";
import moment from "moment";

class VitalDataSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      bpbutton: false,
      pulsebutton: false,
      webutton: false,
      glbutton: false,
      tempbutton: false,
      spo2button: false,
      periodname: "",
      startdate: "",
      enddate: "",
      startpicker: new Date(),
      endpicker: new Date(),
      resetedit: 1,
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        resetedit: this.state.resetedit + 1,
      });
    }
  };

  render() {
    return (
      <Fragment>
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
                        원격상담 & 로컬 진료
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
                        <img id="맥박" src={pulse_1} alt="pulse_1" />
                      ) : this.props.pinfo.PULSE === "99" ? (
                        <img id="맥박" src={pulse_1} alt="pulse_1" />
                      ) : this.props.pinfo.PULSE === "02" ? (
                        <img id="맥박" src={pulse_5} alt="pulse_5" />
                      ) : this.props.pinfo.PULSE === "03" ? (
                        <img id="맥박" src={pulse_4} alt="pulse_4" />
                      ) : this.props.pinfo.PULSE === "04" ? (
                        <img id="맥박" src={pulse_3} alt="pulse_3" />
                      ) : null}
                      {this.props.pinfo.BW === "01" ? (
                        <img id="체중" src={weight_1} alt="weight_1" />
                      ) : this.props.pinfo.BW === "99" ? (
                        <img id="체중" src={weight_1} alt="weight_1" />
                      ) : this.props.pinfo.BW === "02" ? (
                        <img id="체중" src={weight_5} alt="weight_5" />
                      ) : this.props.pinfo.BW === "03" ? (
                        <img id="체중" src={weight_4} alt="weight_4" />
                      ) : this.props.pinfo.BW === "04" ? (
                        <img id="체중" src={weight_3} alt="weight_3" />
                      ) : null}
                      {this.props.pinfo.BS === "01" ? (
                        <img id="혈당" src={glucose_1} alt="glucose_1" />
                      ) : this.props.pinfo.BS === "99" ? (
                        <img id="혈당" src={glucose_1} alt="glucose_1" />
                      ) : this.props.pinfo.BS === "02" ? (
                        <img id="혈당" src={glucose_5} alt="glucose_5" />
                      ) : this.props.pinfo.BS === "03" ? (
                        <img id="혈당" src={glucose_4} alt="glucose_4" />
                      ) : this.props.pinfo.BS === "04" ? (
                        <img id="혈당" src={glucose_3} alt="glucose_3" />
                      ) : null}
                      {this.props.pinfo.TEMPERATURE === "01" ? (
                        <img
                          id="체온"
                          src={temperature_1}
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "99" ? (
                        <img
                          id="체온"
                          src={temperature_1}
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "02" ? (
                        <img
                          id="체온"
                          src={temperature_5}
                          alt="temperature_5"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "03" ? (
                        <img
                          id="체온"
                          src={temperature_4}
                          alt="temperature_4"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "04" ? (
                        <img
                          id="체온"
                          src={temperature_3}
                          alt="temperature_3"
                        />
                      ) : null}
                      {this.props.pinfo.SPO2 === "01" ? (
                        <img id="산소포화도" src={spo2_1} alt="spo2_1" />
                      ) : this.props.pinfo.SPO2 === "99" ? (
                        <img id="산소포화도" src={spo2_1} alt="spo2_1" />
                      ) : this.props.pinfo.SPO2 === "02" ? (
                        <img id="산소포화도" src={spo2_5} alt="spo2_5" />
                      ) : this.props.pinfo.SPO2 === "03" ? (
                        <img id="산소포화도" src={spo2_4} alt="spo2_4" />
                      ) : this.props.pinfo.SPO2 === "04" ? (
                        <img id="산소포화도" src={spo2_3} alt="spo2_3" />
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
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row className="mt-5 flex-wrap">
          <Col className="col-12 d-flex">
            <h4 className="text-bold-600 align-self-center">
              <FormattedMessage id="선택 항목" />
            </h4>
            <ButtonGroup className="ml-1">
              <Button.Ripple
                outline={this.state.bpbutton === true ? false : true}
                color="primary"
                className={classnames({
                  active: this.state.activeTab === "1",
                })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <FormattedMessage id="혈압" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.pulsebutton === true ? false : true}
                color="primary"
                className={classnames({
                  active: this.state.activeTab === "2",
                })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <FormattedMessage id="맥박" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.webutton === true ? false : true}
                color="primary"
                className={classnames({
                  active: this.state.activeTab === "3",
                })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                <FormattedMessage id="체중" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.glbutton === true ? false : true}
                color="primary"
                className={classnames({
                  active: this.state.activeTab === "4",
                })}
                onClick={() => {
                  this.toggle("4");
                }}
              >
                <FormattedMessage id="혈당" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.tempbutton === true ? false : true}
                color="primary"
                className={classnames({
                  active: this.state.activeTab === "5",
                })}
                onClick={() => {
                  this.toggle("5");
                }}
              >
                <FormattedMessage id="체온" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.spo2button === true ? false : true}
                color="primary"
                className={classnames({
                  active: this.state.activeTab === "6",
                })}
                onClick={() => {
                  this.toggle("6");
                }}
              >
                <FormattedMessage id="SPO2" />
              </Button.Ripple>
              {/* <Button.Ripple color="primary" onClick={this.check}>산소포화도</Button.Ripple>{" "} */}
            </ButtonGroup>
          </Col>
        </Row>
        <TabContent className="mt-5" activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <BPSetting resetedit={this.state.resetedit} />
          </TabPane>
          <TabPane tabId="2">
            <PulseSetting resetedit={this.state.resetedit} />
          </TabPane>
          <TabPane tabId="3">
            <WESetting resetedit={this.state.resetedit} />
          </TabPane>
          <TabPane tabId="4">
            <BSSetting resetedit={this.state.resetedit} />
          </TabPane>
          <TabPane tabId="5">
            <TempSetting resetedit={this.state.resetedit} />
          </TabPane>
          <TabPane tabId="6">
            <SPO2Setting resetedit={this.state.resetedit} />
          </TabPane>
        </TabContent>
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
    topappotime: state.dataList.topappotime,
    rtime: state.dataList.rtime,
  };
};

export default connect(mapStateToProps, { getPastConulstList })(
  VitalDataSetting
);
