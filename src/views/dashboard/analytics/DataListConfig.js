import React, { Component, Fragment } from "react";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../../history";
import {
  Edit,
  Trash,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { connect } from "react-redux";
import {
  resetPastConsult,
  getAppData,
  getMonAppData,
  getNameData,
  updateData,
  addData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
  sendMessage,
} from "../../../redux/actions/data-list/";
import Sidebar from "./DataListSidebar";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../assets/scss/pages/data-list.scss";
import vital_white from "../../../assets/img/dashboard/icon_chain_vital_dashboard_white.png";
import vital_blue from "../../../assets/img/dashboard/icon_chain_vital_dashboard_blue.png";
import vital_yellow from "../../../assets/img/dashboard/icon_chain_vital_dashboard_yellow.png";
import vital_red from "../../../assets/img/dashboard/icon_chain_vital_dashboard_red.png";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import {
  ButtonGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
} from "reactstrap";
import Radio from "../../../components/@vuexy/radio/RadioVuexy";
import "../../../assets/scss/pages/allwrap.scss";

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important",
      },
    },
  },
};

const ActionsComponent = (props) => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row);
        }}
      />
      <Trash
        className="cursor-pointer"
        size={20}
        onClick={() => {
          props.deleteRow(props.row);
        }}
      />
    </div>
  );
};

class DataListConfig extends Component {
  constructor(props) {
    super(props);
    if (this.props.parsedFilter.perPage === undefined) {
      this.props.getAppData(
        this.state.user,
        this.state.rowsPerPage,
        this.state.currentPage,
        this.state.appointstate,
        this.state.medicalkinds
      );
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (
      props.dataList.apdata.length !== state.data.length ||
      state.currentPage !== props.parsedFilter.page
    ) {
      return {
        data: props.dataList.apdata,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.aptotalPages,
        currentPage: parseInt(props.parsedFilter.page) - 1,
        rowsPerPage: parseInt(props.parsedFilter.perPage),
        totalRecords: props.dataList.totalRecords,
        sortIndex: props.dataList.sortIndex,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  putStateModal = () => {
    this.setState((prevState) => ({
      putstatemodal: !prevState.putstatemodal,
    }));
  };

  afModal = () => {
    this.setState((prevState) => ({
      afmodal: !prevState.afmodal,
      appointnum: "",
    }));
  };

  acModal = () => {
    this.setState((prevState) => ({
      acmodal: !prevState.acmodal,
    }));
  };

  acInfoModal = () => {
    this.setState((prevState) => ({
      acinfomodal: !prevState.acinfomodal,
    }));
  };

  confirmFunc = () => {
    window.location.reload();
  };

  putStateAf = (username, appnum, state, acinfo, key) => {
    this.props.sendMessage(username, appnum, state, acinfo, key);
    this.putStateModal();
    this.afModal();
  };

  acClick = () => {
    this.putStateModal();
    this.acInfoModal();
  };

  putStateAc = (username, appnum, state, acinfo, key) => {
    this.props.sendMessage(username, appnum, state, acinfo, key);
    this.acInfoModal();
    this.acModal();
  };

  state = {
    user: this.props.user.login.values.loggedInUser.username,
    name: "",
    putstatemodal: false,
    afmodal: false,
    acinfomodal: false,
    acinfo: "1",
    acmodal: false,
    appointnum: "",
    data: [],
    totalPages: 0,
    currentPage: 1,
    columns: [
      {
        name: <FormattedMessage id="진료일시" />,
        selector: "gender",
        sortable: false,
        minWidth: "230px",

        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {moment(row.APPOINT_TIME).format("YYYY.MM.DD A hh:mm")}
          </p>
        ),
      },
      {
        name: "구분",
        sortable: false,
        minWidth: "200px",
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.MEDICAL_KIND === "1" ? (
              <FormattedMessage id="normaldiagnosis" />
            ) : row.MEDICAL_KIND === "2" ? (
              <FormattedMessage id="cooperation" />
            ) : row.MEDICAL_KIND === "3" ? (
              <FormattedMessage id="secondop" />
            ) : (
              ""
            )}
          </p>
        ),
      },

      {
        name: "진행 상태",
        sortable: false,
        minWidth: "230px",
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0 d-flex ">
            {row.APPOINT_STATE === "PF"
              ? "예약 확정 전"
              : row.APPOINT_STATE === "AF"
              ? "예약 확정"
              : row.APPOINT_STATE === "TF" || row.APPOINT_STATE === "RF"
              ? "진료 완료"
              : row.APPOINT_STATE === "VW"
              ? "판독 진행 중"
              : row.APPOINT_STATE === "VF"
              ? "판독 완료"
              : ""}
            {row.APPOINT_STATE === "PF" ? (
              <Button
                onClick={() =>
                  this.setState({ appointnum: row.APPOINT_NUM }, () => {
                    this.putStateModal();
                  })
                }
                className="ml-1"
                color="primary"
                size="sm"
              >
                예약확정
              </Button>
            ) : null}
          </p>
        ),
      },
      {
        name: <FormattedMessage id="name" />,
        selector: "name",
        minWidth: "200px",
        center: false,
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.L_NAME + row.F_NAME}
          </p>
        ),
      },

      {
        name: <FormattedMessage id="성별" />,
        selector: "gender",
        sortable: false,
        center: false,
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.GENDER === "1" ? (
              <FormattedMessage id="남성" />
            ) : row.GENDER === "2" ? (
              <FormattedMessage id="여성" />
            ) : (
              <FormattedMessage id="선택안함" />
            )}
          </p>
        ),
      },
      {
        name: <FormattedMessage id="나이" />,
        selector: "age",
        sortable: false,
        center: false,
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.AGE}
          </p>
        ),
      },
      {
        name: <FormattedMessage id="생년월일" />,
        selector: "birthday",
        sortable: false,
        center: false,
        cell: (row) => (
          <p
            data-tag="allowRowEvents"
            className="text-bold-500 text-truncate mb-0"
          >
            {moment(row.BIRTH_DT).format("YYYY.MM.DD")}
          </p>
        ),
      },
      {
        name: "Vital Data",
        center: true,
        cell: (row) => (
          <p
            data-tag="allowRowEvents"
            className="text-bold-500 text-truncate mb-0"
          >
            {row.VITAL_STATE === "00" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_5"
                title="연동기기가 없습니다."
                src={vital_white}
                alt="Vital_5"
              />
            ) : row.VITAL_STATE === "01" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_1"
                title="측정값이 없습니다."
                src={vital_white}
                alt="Vital_1"
              />
            ) : row.VITAL_STATE === "99" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_99"
                title="측정값이 없습니다."
                src={vital_white}
                alt="Vital_99"
              />
            ) : row.VITAL_STATE === "02" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_4"
                title="정상"
                src={vital_blue}
                alt="Vital_4"
              />
            ) : row.VITAL_STATE === "03" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_3"
                title="주의"
                src={vital_yellow}
                alt="Vital_3"
              />
            ) : row.VITAL_STATE === "04" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_2"
                title="위험"
                src={vital_red}
                alt="Vital_2"
              />
            ) : null}
          </p>
        ),
      },
      // {
      //   name: <FormattedMessage id="차트보기" />,
      //   center: true,
      //   cell: (row) => (
      //     <img
      //       src={chartimage}
      //       alt="chartimage"
      //       onClick={() => this.goPatientList(row.PATIENT_ID, row.APPOINT_NUM)}
      //       style={{ cursor: "pointer", width: "25px" }}
      //     />
      //   ),
      // },
    ],
    allData: [],
    value: "",
    rowsPerPage: 5,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
    string1: true,
    string2: false,
    string3: false,
    medicalkinds: "'1','2','3'",
    appointstate: "'PF','AF','VW','VF','TF','RF'",
    today: true,
  };

  thumbView = this.props.thumbView;

  componentDidMount() {
    if (this.props.parsedFilter.perPage !== undefined) {
      this.props.getAppData(
        this.state.user,
        // this.props.parsedFilter.perPage,
        // this.props.parsedFilter.page,
        5,
        1,
        this.state.appointstate,
        this.state.medicalkinds
      );
    }
  }

  componentDidUpdate(prevState) {
    let selectedpage = { selected: 0 };
    if (prevState.startend !== this.props.startend) {
      this.handlePagination(selectedpage);
      if (this.props.startend === "d") {
        this.handlePagination(selectedpage);
        if (this.props.parsedFilter.perPage === undefined) {
          this.props.getAppData(
            this.state.user,
            5,
            1,
            this.state.appointstate,
            this.state.medicalkinds
          );
        } else {
          this.props.getAppData(
            this.state.user,
            this.props.parsedFilter.perPage,
            1,
            this.state.appointstate,
            this.state.medicalkinds
          );
        }
      } else {
        this.handlePagination(selectedpage);
        if (this.props.parsedFilter.perPage === undefined) {
          this.props.getMonAppData(
            this.state.user,
            5,
            1,
            this.state.appointstate,
            this.state.medicalkinds
          );
        } else {
          this.props.getMonAppData(
            this.state.user,
            this.props.parsedFilter.perPage,
            1,
            this.state.appointstate,
            this.state.medicalkinds
          );
        }
      }
    }
  }

  goPatientList(id, apnum) {
    this.props.resetVitalData();
    this.props.resetPastConsult();
    this.props.getPatientInfo(this.state.user, id, apnum);
    this.props.getVitalData(id);
  }

  handleFilter = (e) => {
    this.setState({ name: e.target.value });
  };

  handleRowsPerPage = (value) => {
    let { parsedFilter, getAppData } = this.props;
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    history.push(`/analyticsDashboard?page=${page}&perPage=${value}`);
    this.setState({ currentPage: page, rowsPerPage: value });
    getAppData({
      user_id: this.state.user,
      page: parsedFilter.page,
      perPage: value,
      appointstate: this.state.appointstate,
      mdkinds: this.state.medicalkinds,
    });
    // getData({ user_id: this.state.user, page_num: parsedFilter.page, page_amount: value })
  };

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean });
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  handlePagination = (page) => {
    let { parsedFilter, getAppData } = this.props;
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 5;
    let urlPrefix = this.props.thumbView
      ? "/data-list/thumb-view/"
      : "/analyticsDashboard";
    history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
    // getData({ page: page.selected + 1, perPage: perPage })
    if (this.state.today === true) {
      this.props.getAppData(
        this.state.user,
        perPage,
        page.selected + 1,
        this.state.appointstate,
        this.state.medicalkinds
      );
    } else {
      this.props.getMonAppData(
        this.state.user,
        perPage,
        page.selected + 1,
        this.state.appointstate,
        this.state.medicalkinds
      );
    }

    this.setState({ currentPage: page.selected });
  };

  getStep = () => {
    let selectedpage = { selected: 0 };
    if (this.state.today === true) {
      this.handlePagination(selectedpage);
      this.props.getAppData(
        this.state.user,
        5,
        1,
        this.state.appointstate,
        this.state.medicalkinds
      );
    } else {
      this.handlePagination(selectedpage);
      this.props.getMonAppData(
        this.state.user,
        5,
        1,
        this.state.appointstate,
        this.state.medicalkinds
      );
    }
  };

  onView = (mdkinds, appstate) => {
    let selectedpage = { selected: 0 };
    if (this.state.today === true) {
      this.handlePagination(selectedpage);
      this.setState({ medicalkinds: mdkinds, appointstate: appstate }, () => {
        this.props.getAppData(
          this.state.user,
          5,
          1,
          this.state.appointstate,
          this.state.medicalkinds
        );
      });
    } else {
      this.handlePagination(selectedpage);
      this.setState({ medicalkinds: mdkinds, appointstate: appstate }, () => {
        this.props.getMonAppData(
          this.state.user,
          5,
          1,
          this.state.appointstate,
          this.state.medicalkinds
        );
      });
    }
  };

  render() {
    let { columns, data, allData, totalPages, value, currentData, sidebar } =
      this.state;
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}
      >
        <div
          style={{
            height: "72px",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#FFFEFE",
          }}
          id="cardshadow"
          className="d-flex align-self-center"
        >
          <Modal
            isOpen={this.state.putstatemodal}
            toggle={this.putStateModal}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader toggle={this.putStateModal}></ModalHeader>
            <ModalBody>
              예약 승인할 경우, 취소가 불가능합니다. <br />
              응급환자로 인한 진료취소는[kimmary@hicare.net]으로 <br />
              [환자명/연락처/예약일시]를 작성하여 메일 발송해주시기 바랍니다
            </ModalBody>
            <ModalFooter className="justify-content-center">
              <Button
                color="primary"
                onClick={() =>
                  this.putStateAf(
                    this.props.user.login.values.loggedInUser.username,
                    this.state.appointnum,
                    "AF",
                    this.state.acinfo,
                    this.props.cipher.rsapublickey.publickey
                  )
                }
              >
                예약 확정
              </Button>
              <Button color="primary" onClick={() => this.acClick()}>
                예약 취소
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.acinfomodal}
            toggle={this.acInfoModal}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader toggle={this.acInfoModal}>취소 사유 선택</ModalHeader>
            <ModalBody>
              <FormGroup>
                <div id="acinfo" className="d-inline-block mr-1">
                  <Radio
                    label="학회 및 세미나"
                    defaultChecked={this.state.acinfo === "1" ? true : false}
                    name="acinfo"
                    value="1"
                    onChange={(e) => this.setState({ acinfo: e.target.value })}
                  />
                </div>
                <div className="d-inline-block mr-1">
                  <Radio
                    label="수술"
                    name="acinfo"
                    value="2"
                    onChange={(e) => this.setState({ acinfo: e.target.value })}
                  />
                </div>
                <div className="d-inline-block mr-1">
                  <Radio
                    label="해외 출장"
                    name="acinfo"
                    value="3"
                    onChange={(e) => this.setState({ acinfo: e.target.value })}
                  />
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter className="justify-content-center">
              <Button
                color="primary"
                onClick={() =>
                  this.putStateAc(
                    this.props.user.login.values.loggedInUser.username,
                    this.state.appointnum,
                    "TD",
                    this.state.acinfo,
                    this.props.cipher.rsapublickey.publickey
                  )
                }
              >
                예약 취소
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.afmodal}
            toggle={this.afModal}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader toggle={this.afModal}>예약 확정</ModalHeader>
            <ModalBody>예약이 확정되었습니다.</ModalBody>
            <ModalFooter className="justify-content-center">
              <Button color="primary" onClick={() => this.confirmFunc()}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.acmodal}
            toggle={this.acModal}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader toggle={this.acModal}>예약 취소</ModalHeader>
            <ModalBody>예약이 취소되었습니다.</ModalBody>
            <ModalFooter className="justify-content-center">
              <Button color="primary" onClick={() => this.confirmFunc()}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>
          <ButtonGroup className="ml-1 my-1">
            <button
              style={
                this.state.medicalkinds === "'1','2','3'"
                  ? { paddingLeft: "22px", paddingRight: "22px" }
                  : {
                      paddingLeft: "22px",
                      paddingRight: "22px",
                      color: "#C7D1DA",
                    }
              }
              className={`btn ${
                this.state.medicalkinds === "'1','2','3'"
                  ? "text-primary text-bold-600"
                  : "text-bold-600"
              }`}
              onClick={() => {
                this.onView("'1','2','3'", "'PF','AF','VW','VF','TF','RF'");
              }}
            >
              전체
            </button>
            <button
              style={
                this.state.medicalkinds === "'1'"
                  ? { paddingLeft: "15px", paddingRight: "15px" }
                  : {
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      color: "#C7D1DA",
                    }
              }
              className={`btn ${
                this.state.medicalkinds === "'1'"
                  ? "text-primary text-bold-600"
                  : "text-bold-600"
              }`}
              onClick={() => {
                this.onView("'1'", "'PF','AF','VW','VF','TF','RF'");
              }}
            >
              <FormattedMessage id="normaldiagnosis" />
            </button>

            <button
              style={
                this.state.medicalkinds === "'2'"
                  ? { paddingLeft: "20px", paddingRight: "20px" }
                  : {
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      color: "#C7D1DA",
                    }
              }
              className={`btn ${
                this.state.medicalkinds === "'2'"
                  ? "text-primary text-bold-600"
                  : "text-bold-600"
              }`}
              onClick={() => {
                this.onView("'2'", "'PF','AF','VW','VF','TF','RF'");
              }}
            >
              <FormattedMessage id="cooperation" />
            </button>

            <button
              style={
                this.state.medicalkinds === "'3'"
                  ? { paddingLeft: "15px", paddingRight: "15px" }
                  : {
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      color: "#C7D1DA",
                    }
              }
              className={`btn ${
                this.state.medicalkinds === "'3'"
                  ? "text-primary text-bold-600"
                  : "text-bold-600"
              }`}
              onClick={() => {
                this.setState({ medicalkinds: "'3'" }, () => {
                  this.onView("'3'", "'PF','AF','VW','VF','TF','RF'");
                });
              }}
            >
              <FormattedMessage id="secondop" />
            </button>
          </ButtonGroup>

          <Input
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "80px",
              border: "none",
            }}
            id="select"
            className="col-1"
            type="select"
            name="select"
            value={this.state.appointstate}
            onChange={(e) =>
              this.setState({ appointstate: e.target.value }, () =>
                this.getStep()
              )
            }
          >
            <FormattedMessage id="internalmedicine">
              {(internalmedicine) => (
                <option value="'PF','AF','VW','VF','TF','RF'">진행 상태</option>
              )}
            </FormattedMessage>
            <FormattedMessage id="internalmedicine">
              {(internalmedicine) => <option value="'PF'">예약 확정 전</option>}
            </FormattedMessage>
            <FormattedMessage id="gynecologyobsterics">
              {(gynecologyobsterics) => <option value="'AF'">예약 확정</option>}
            </FormattedMessage>
            {this.state.medicalkinds === "'3'" ? (
              <Fragment>
                <FormattedMessage id="gynecologyobsterics">
                  {(gynecologyobsterics) => (
                    <option value="'VW'">판독 진행 중</option>
                  )}
                </FormattedMessage>
                <FormattedMessage id="dermatology">
                  {(dermatology) => <option value="'VF'">판독 완료</option>}
                </FormattedMessage>
              </Fragment>
            ) : this.state.medicalkinds === "'1','2','3'" ? (
              <Fragment>
                <FormattedMessage id="gynecologyobsterics">
                  {(gynecologyobsterics) => (
                    <option value="'VW'">판독 진행 중</option>
                  )}
                </FormattedMessage>
                <FormattedMessage id="dermatology">
                  {(dermatology) => <option value="'VF'">판독 완료</option>}
                </FormattedMessage>
              </Fragment>
            ) : null}
            <FormattedMessage id="urology">
              {(urology) => <option value="'TF','RF'">진료 완료</option>}
            </FormattedMessage>
          </Input>
          <div className="col-4"></div>
          <ButtonGroup className="col-2">
            {this.state.medicalkinds === "'3'" ? (
              <div style={{ width: "105px" }}></div>
            ) : (
              <button
                style={
                  this.state.today === true
                    ? { paddingLeft: "22px", paddingRight: "22px" }
                    : {
                        paddingLeft: "22px",
                        paddingRight: "22px",
                        color: "#C7D1DA",
                      }
                }
                className={`btn ${
                  this.state.today === true
                    ? "text-primary text-bold-600"
                    : "text-bold-600"
                }`}
                onClick={() => {
                  let selectedpage = { selected: 0 };
                  this.setState({ today: true }, () => {
                    this.handlePagination(selectedpage);
                  });
                }}
              >
                오늘
              </button>
            )}

            <button
              style={
                this.state.today === false
                  ? { paddingLeft: "15px", paddingRight: "15px" }
                  : {
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      color: "#C7D1DA",
                    }
              }
              className={`btn ${
                this.state.today === false
                  ? "text-primary text-bold-600"
                  : "text-bold-600"
              }`}
              onClick={() => {
                let selectedpage = { selected: 0 };
                this.setState({ today: false }, () => {
                  this.handlePagination(selectedpage);
                });
              }}
            >
              전체
            </button>
          </ButtonGroup>
        </div>
        <DataTable
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0px 0px 20px rgba(164, 199, 239, 0.2) ",
          }}
          columns={columns}
          data={value.length ? allData : data}
          pagination
          paginationServer
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
              activeClassName="active"
              forcePage={
                this.props.parsedFilter.page
                  ? parseInt(this.props.parsedFilter.page - 1)
                  : 0
              }
              onPageChange={(page) => this.handlePagination(page)}
            />
          )}
          noHeader
          // selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onRowClicked={(data) =>
            this.goPatientList(data.PATIENT_ID, data.APPOINT_NUM)
          }
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm",
          }}
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getAppData={this.props.getAppData}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar,
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    startend: state.appoints.appoints.startend,
    user: state.auth,
    dataList: state.dataList,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  resetPastConsult,
  getAppData,
  getMonAppData,
  getNameData,
  updateData,
  addData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
  sendMessage,
})(DataListConfig);
