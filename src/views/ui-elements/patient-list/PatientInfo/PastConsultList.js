import React from "react";
import { Table, Row, Col, UncontrolledTooltip } from "reactstrap";
import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import {
  gettokbox,
  getPharmacy,
  pushCloseSignal,
} from "../../../../redux/actions/data-list/";
import { history } from "../../../../history";
import DataListConfig from "./DataListConfig";
import queryString from "query-string";
import ncall from "../../../../assets/img/dashboard/ID13_11_method_call1.png";
import call from "../../../../assets/img/dashboard/ID13_11_method_call2.png";
import nvideo from "../../../../assets/img/dashboard/ID13_11_method_video1.png";
import video from "../../../../assets/img/dashboard/ID13_11_method_video2.png";
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
import moment from "moment";
import DateCountdown from "react-date-countdown-timer";

class PastConsultList extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: 0,
      cards: props.cousultlist,
      user: this.props.user.login.values.loggedInUser.username,
      name: "",
      data: [],
      totalPages: 0,
      currentPage: 0,
      allData: [],
      value: "",
      rowsPerPage: 5,
      sidebar: false,
      currentData: null,
      selected: [],
      totalRecords: 0,
      sortIndex: [],
      addNew: "",
      viewfilemodal: false,
      viewprescriptionmodal: false,
    };
  }

  viewFileModal = () => {
    this.setState((prevState) => ({
      viewfilemodal: !prevState.viewfilemodal,
    }));
  };

  viewPrescriptionModal = () => {
    this.setState((prevState) => ({
      viewprescriptionmodal: !prevState.viewprescriptionmodal,
    }));
  };

  toggle(e) {
    let event = e.target.dataset.event;
    this.setState({ collapse: this.state.collapse === event ? 0 : event });
  }

  handlePagination = (page) => {
    let { parsedFilter, getData } = this.props;
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 5;

    this.props.getData(
      this.state.user,
      perPage,
      page.selected + 1,
      this.props.cipher.rsapublickey.publickey
    );
    this.setState({ currentPage: page.selected });
  };

  goCallSetting = (e) => {
    e.preventDefault();
    if (
      moment() >= moment(this.props.rtime).add(-5, "m") &&
      moment() <= moment(this.props.rtime).add(15, "m")
    ) {
      this.props.gettokbox(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        this.props.cipher.rsapublickey.publickey
      );
      this.props.getPharmacy(
        this.props.pinfo.PATIENT_ID,
        this.props.cipher.rsapublickey.publickey
      );
      this.props.pushCloseSignal(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        "1",
        this.props.cipher.rsapublickey.publickey
      );
    } else {
      alert("진료실은 5분 전부터 입장 가능합니다.");
    }
  };

  goPhoneConsult = (e) => {
    e.preventDefault();
    if (
      moment() >= moment(this.props.rtime).add(-5, "m") &&
      moment() <= moment(this.props.rtime).add(15, "m")
    ) {
      this.props.getPharmacy(
        this.props.pinfo.PATIENT_ID,
        this.props.cipher.rsapublickey.publickey
      );
      history.push("/pages/phoneconsulting");
    } else {
      alert("진료실은 5분 전부터 입장 가능합니다.");
    }
  };

  render() {
    return (
      <div>
        {/* 환자정보, 버튼 모음 Row */}
        <Row>
          <Col className="col-12 mb-2">
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
                      {this.props.pinfo.FIRST_YN === "N" ? "재진" : "초진"}
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
                  </th>
                  {this.props.appo === null ? (
                    <th id="tblBottomBarTh" className="text-right">
                      <img src={ncall} alt="call" className="mr-1" />
                      <img src={nvideo} alt="nvideo" />
                    </th>
                  ) : this.props.appo.APPOINT_KIND === "1" ? (
                    <th id="tblBottomBarTh">
                      <img
                        onClick={this.goPhoneConsult}
                        src={call}
                        alt="call"
                        style={{ cursor: "pointer" }}
                      />
                      <img src={nvideo} alt="nvideo" />
                    </th>
                  ) : this.props.appo.APPOINT_KIND === "2" ? (
                    <th id="tblBottomBarTh" className="text-right">
                      <img src={ncall} alt="call" className="mr-1" />
                      <img
                        onClick={this.goCallSetting}
                        src={video}
                        alt="video"
                        style={{ cursor: "pointer" }}
                      />
                    </th>
                  ) : null}
                </tr>
              </thead>
            </table>
            <UncontrolledTooltip placement="bottom" target="혈압">
              혈압
            </UncontrolledTooltip>
            <UncontrolledTooltip placement="bottom" target="맥박">
              맥박
            </UncontrolledTooltip>
            <UncontrolledTooltip placement="bottom" target="체중">
              체중
            </UncontrolledTooltip>
            <UncontrolledTooltip placement="bottom" target="혈당">
              혈당
            </UncontrolledTooltip>
            <UncontrolledTooltip placement="bottom" target="체온">
              체온
            </UncontrolledTooltip>
            <UncontrolledTooltip placement="bottom" target="산소포화도">
              산소포화도
            </UncontrolledTooltip>
          </Col>
        </Row>
        <Row className="mt-3 mb-1 mx-2">
          <Col lg="6" md="12">
            <h4 className="page-header text-bold-600">Consulting</h4>
          </Col>
          <Col lg="3" md="12"></Col>
          {/* {this.props.appo===null?null:   */}
          {/* <Col lg="3" md="12" className="text-left d-flex justify-content-center" style={{border:"1px solid #B8B8C2", borderRadius: "5px"}}>  
              <h5 className="align-self-center text-primary mr-1" style={{paddingTop:"0.3rem"}}>진료 시작까지</h5>
                {this.props.appo===null?null:
                <span  style={{paddingTop:"0.2rem"}}>
                  <DateCountdown 
                    className="align-self-center text-primary"
                    datefrom= {moment(this.props.rtime).add("-15","m")}
                    dateTo= {this.props.rtime}
                    // callback={()=>alert('Hello')} 
                    locales_plural={['년','월','일','시','분',"초"]} />
                </span>  
                }
              <h5 className="align-self-center text-primary" style={{paddingTop:"0.3rem"}}>남았습니다.</h5>
            </Col> */}
          {/* } */}
        </Row>

        <DataListConfig
          parsedFilter={queryString.parse(this.props.location.search)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    dataList: state.dataList,
    appo: state.dataList.appointment,
    pinfo: state.dataList.patient,
    cousultlist: state.dataList.pastconsultlist,
    totalpage: state.dataList.totalPages,
    rtime: state.dataList.rtime,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  gettokbox,
  getPharmacy,
  pushCloseSignal,
})(PastConsultList);
