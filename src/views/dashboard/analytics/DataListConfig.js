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
  X,
} from "react-feather";
import { connect } from "react-redux";
import {
  resetPastConsult,
  getAppData,
  getMonAppData,
  resetAppData,
  resetAppointData,
  getNameData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
} from "../../../redux/actions/data-list/";
import Sidebar from "./DataListSidebar";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../assets/scss/pages/data-list.scss";
import Call from "../../../assets/img/dashboard/ID9_07_table_method_call.png";
import Video from "../../../assets/img/dashboard/ID9_07_table_method_video.png";
import Vital_1 from "../../../assets/img/dashboard/ID9_07_table_vital1.png";
import Vital_2 from "../../../assets/img/dashboard/ID9_07_table_vital2.png";
import Vital_3 from "../../../assets/img/dashboard/ID9_07_table_vital3.png";
import Vital_4 from "../../../assets/img/dashboard/ID9_07_table_vital4.png";
import Vital_5 from "../../../assets/img/dashboard/ID9_07_table_vital5.png";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { Input, ButtonGroup } from "reactstrap";
import "../../../assets/scss/pages/allwrap.scss";
const chipColors = {
  "on hold": "warning",
  delivered: "success",
  pending: "primary",
  canceled: "danger",
};

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

const CustomHeader = (props) => {
  return <div></div>;
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
        this.state.medicalkinds,
        this.props.cipher.rsapublickey.publickey
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

  state = {
    user: this.props.user.login.values.loggedInUser.username,
    name: "",
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
        minWidth: "230px",
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
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.APPOINT_STATE === "PF"
              ? "예약 완료"
              : row.APPOINT_STATE === "AF"
              ? "예약 확정"
              : row.APPOINT_STATE === "TF" || row.APPOINT_STATE === "RF"
              ? "진료 완료"
              : row.APPOINT_STATE === "VW"
              ? "판독 진행 중"
              : row.APPOINT_STATE === "VF"
              ? "판독 완료"
              : ""}
          </p>
        ),
      },
      {
        name: <FormattedMessage id="name" />,
        selector: "name",
        minWidth: "200px",
        center: true,
        cell: (row) => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            <div className="user-info text-truncate ml-xl-50 ml-0">
              <span
                data-tag="allowRowEvents"
                title={row.F_NAME}
                className="d-block text-bold-500 text-truncate mb-0"
              >
                {row.L_NAME + row.F_NAME}
              </span>
            </div>
          </div>
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
            {row.BIRTH_DT}
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
                src={Vital_5}
                alt="Vital_5"
              />
            ) : row.VITAL_STATE === "01" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_1"
                title="측정값이 없습니다."
                src={Vital_1}
                alt="Vital_1"
              />
            ) : row.VITAL_STATE === "99" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_99"
                title="측정값이 없습니다."
                src={Vital_1}
                alt="Vital_99"
              />
            ) : row.VITAL_STATE === "02" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_4"
                title="정상"
                src={Vital_4}
                alt="Vital_4"
              />
            ) : row.VITAL_STATE === "03" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_3"
                title="주의"
                src={Vital_3}
                alt="Vital_3"
              />
            ) : row.VITAL_STATE === "04" ? (
              <img
                data-tag="allowRowEvents"
                id="Vital_2"
                title="위험"
                src={Vital_2}
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
        this.state.medicalkinds,
        this.props.cipher.rsapublickey.publickey
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
            this.state.medicalkinds,
            this.props.cipher.rsapublickey.publickey
          );
        } else {
          this.props.getAppData(
            this.state.user,
            this.props.parsedFilter.perPage,
            1,
            this.state.appointstate,
            this.state.medicalkinds,
            this.props.cipher.rsapublickey.publickey
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
            this.state.medicalkinds,
            this.props.cipher.rsapublickey.publickey
          );
        } else {
          this.props.getMonAppData(
            this.state.user,
            this.props.parsedFilter.perPage,
            1,
            this.state.appointstate,
            this.state.medicalkinds,
            this.props.cipher.rsapublickey.publickey
          );
        }
      }
    }
  }

  goPatientList(id, apnum) {
    this.props.resetVitalData();
    this.props.resetPastConsult();
    this.props.getPatientInfo(
      this.state.user,
      id,
      apnum,
      this.props.cipher.rsapublickey.publickey
    );
    this.props.getVitalData(id, this.props.cipher.rsapublickey.publickey);
  }

  handleFilter = (e) => {
    this.setState({ name: e.target.value });
  };

  search = (e) => {
    e.preventDefault();
    if (this.state.name !== "") {
      this.props.getNameData(
        this.state.user,
        5,
        1,
        this.state.name,
        this.props.cipher.rsapublickey.publickey
      );
    }
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
      key: this.props.cipher.rsapublickey.publickey,
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
    if (this.props.startend === "d") {
      this.props.getAppData(
        this.state.user,
        perPage,
        page.selected + 1,
        this.state.appointstate,
        this.state.medicalkinds,
        this.props.cipher.rsapublickey.publickey
      );
    } else {
      this.props.getMonAppData(
        this.state.user,
        perPage,
        page.selected + 1,
        this.state.appointstate,
        this.state.medicalkinds,
        this.props.cipher.rsapublickey.publickey
      );
    }

    this.setState({ currentPage: page.selected });
  };

  getStep = () => {
    let selectedpage = { selected: 0 };
    if (this.props.startend === "d") {
      this.handlePagination(selectedpage);
      this.props.getAppData(
        this.state.user,
        5,
        1,
        this.state.appointstate,
        this.state.medicalkinds,
        this.props.cipher.rsapublickey.publickey
      );
    } else {
      this.handlePagination(selectedpage);
      this.props.getMonAppData(
        this.state.user,
        5,
        1,
        this.state.appointstate,
        this.state.medicalkinds,
        this.props.cipher.rsapublickey.publickey
      );
    }
  };

  onView = (mdkinds, appstate) => {
    let selectedpage = { selected: 0 };
    if (this.props.startend === "d") {
      this.handlePagination(selectedpage);
      this.setState({ medicalkinds: mdkinds, appointstate: appstate }, () => {
        this.props.getAppData(
          this.state.user,
          5,
          1,
          this.state.appointstate,
          this.state.medicalkinds,
          this.props.cipher.rsapublickey.publickey
        );
      });
    } else {
      this.handlePagination(selectedpage);
      this.setState({ medicalkinds: mdkinds }, () => {
        this.props.getMonAppData(
          this.state.user,
          5,
          1,
          this.state.appointstate,
          this.state.medicalkinds,
          this.props.cipher.rsapublickey.publickey
        );
      });
    }
  };

  render() {
    let {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
    } = this.state;
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
          <ButtonGroup className="my-1">
            <button
              style={{ paddingLeft: "22px", paddingRight: "22px" }}
              className={`btn ${
                this.state.medicalkinds === "'1','2','3'"
                  ? "text-primary text-bold-600"
                  : "text-secondary text-bold-600"
              }`}
              onClick={() => {
                this.onView("'1','2','3'", "'PF','AF','VW','VF','TF','RF'");
              }}
            >
              전체
            </button>
            <button
              style={{ paddingLeft: "15px", paddingRight: "15px" }}
              className={`btn ${
                this.state.medicalkinds === "'1'"
                  ? "text-primary text-bold-600"
                  : "text-secondary text-bold-600"
              }`}
              onClick={() => {
                this.onView("'1'", "'PF','AF','VW','VF','TF','RF'");
              }}
            >
              <FormattedMessage id="normaldiagnosis" />
            </button>

            <button
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
              className={`btn ${
                this.state.medicalkinds === "'2'"
                  ? "text-primary text-bold-600"
                  : "text-secondary text-bold-600"
              }`}
              onClick={() => {
                this.onView("'2'", "'PF','AF','VW','VF','TF','RF'");
              }}
            >
              <FormattedMessage id="cooperation" />
            </button>

            <button
              style={{ paddingLeft: "15px", paddingRight: "15px" }}
              className={`btn ${
                this.state.medicalkinds === "'3'"
                  ? "text-primary text-bold-600"
                  : "text-secondary text-bold-600"
              }`}
              onClick={() => {
                this.onView("'3'", "'PF','AF','VW','VF','TF','RF'");
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
              {(internalmedicine) => <option value="'PF'">예약 완료</option>}
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
  resetAppData,
  resetAppointData,
  getNameData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
})(DataListConfig);
