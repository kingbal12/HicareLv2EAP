import React, { Component } from "react";
import {
  Button,
  Progress,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
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
  getData,
  getNameData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
  resetAppointData,
  resetAppData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
  resetSearchName,
  // eData
} from "../../../redux/actions/data-list";
import Sidebar from "./DataListSidebar";
import Chip from "../../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";

import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../assets/scss/pages/data-list.scss";
import { Fragment } from "react";
import pressure_1 from "../../../assets/img/mdstateicon/ID12_08_vital_pressure1.png";
import pressure_3 from "../../../assets/img/mdstateicon/ID12_08_vital_pressure3.png";
import pressure_4 from "../../../assets/img/mdstateicon/ID12_08_vital_pressure4.png";
import pressure_5 from "../../../assets/img/mdstateicon/ID12_08_vital_pressure5.png";
import pulse_1 from "../../../assets/img/mdstateicon/ID12_08_vital_pulse1.png";
import pulse_3 from "../../../assets/img/mdstateicon/ID12_08_vital_pulse3.png";
import pulse_4 from "../../../assets/img/mdstateicon/ID12_08_vital_pulse4.png";
import pulse_5 from "../../../assets/img/mdstateicon/ID12_08_vital_pulse5.png";
import weight_1 from "../../../assets/img/mdstateicon/ID12_08_vital_weight1.png";
import weight_3 from "../../../assets/img/mdstateicon/ID12_08_vital_weight3.png";
import weight_4 from "../../../assets/img/mdstateicon/ID12_08_vital_weight4.png";
import weight_5 from "../../../assets/img/mdstateicon/ID12_08_vital_weight5.png";
import glucose_1 from "../../../assets/img/mdstateicon/ID12_08_vital_glucose1.png";
import glucose_3 from "../../../assets/img/mdstateicon/ID12_08_vital_glucose3.png";
import glucose_4 from "../../../assets/img/mdstateicon/ID12_08_vital_glucose4.png";
import glucose_5 from "../../../assets/img/mdstateicon/ID12_08_vital_glucose5.png";
import temperature_1 from "../../../assets/img/mdstateicon/ID12_08_vital_temperature1.png";
import temperature_3 from "../../../assets/img/mdstateicon/ID12_08_vital_temperature3.png";
import temperature_4 from "../../../assets/img/mdstateicon/ID12_08_vital_temperature4.png";
import temperature_5 from "../../../assets/img/mdstateicon/ID12_08_vital_temperature5.png";
import spo2_1 from "../../../assets/img/mdstateicon/ID12_08_vital_spo2 1.png";
import spo2_3 from "../../../assets/img/mdstateicon/ID12_08_vital_spo2 3.png";
import spo2_4 from "../../../assets/img/mdstateicon/ID12_08_vital_spo2 4.png";
import spo2_5 from "../../../assets/img/mdstateicon/ID12_08_vital_spo2 5.png";
import chartimage from "../../../assets/img/dashboard/ID09_07_chart.png";
import { FormattedMessage } from "react-intl";
import moment from "moment";

const chipColors = {
  "on hold": "warning",
  delivered: "success",
  pending: "primary",
  canceled: "danger",
};

const selectedStyle = {
  head: {
    style: {
      height: "40px",
      border: "1px solid #E7EFF3",
      marginBottom: "3px",
    },
  },
  headCells: {
    style: {
      backgroundColor: "#f4f7fc !important",
      height: "40px",
    },
  },
  rows: {
    style: {
      height: "56px",
    },
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
  let rowPage;
  if (isNaN(props.rowsPerPage)) {
    rowPage = 5;
  } else {
    rowPage = props.rowsPerPage;
  }
  return (
    <div className="data-list-header d-flex justify-content-between flex-wrap">
      <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2 col-8 px-0">
        <div className="filter-section col-5 px-0">
          <FormattedMessage id="nameSearch">
            {(nameSearch) => (
              <Input
                type="text"
                placeholder={nameSearch}
                onChange={(e) => props.handleFilter(e)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    props.search(e);
                  }
                }}
              />
            )}
          </FormattedMessage>
        </div>
        <Button
          style={{ maxHeight: "43px" }}
          className="ml-2"
          color="primary"
          outline
          onClick={(e) => props.search(e)}
        >
          <FormattedMessage id="검색" />
        </Button>
      </div>
      <UncontrolledDropdown className="data-list-rows-dropdown d-md-block d-none mt-2 mb-1">
        <DropdownToggle color="" className="sort-dropdown">
          <span className="align-middle mx-50">{`${rowPage} item per page`}</span>
          <ChevronDown size={15} />
        </DropdownToggle>
        <DropdownMenu tag="div" right>
          <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(5)}>
            5 item per page
          </DropdownItem>
          <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(10)}>
            10 item per page
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

class DataListConfig extends Component {
  constructor(props) {
    super(props);
    if (this.props.parsedFilter.perPage === undefined) {
      this.props.getData(
        this.state.user,
        this.state.rowsPerPage,
        this.state.currentPage
      );
      // 암호화
      // this.props.getData(
      //   this.state.user,
      //   this.state.rowsPerPage,
      //   this.state.currentPage,
      //   this.props.cipher.rsapublickey.publickey
      // );
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (
      props.dataList.data.length !== state.data.length ||
      state.currentPage !== props.parsedFilter.page
    ) {
      return {
        data: props.dataList.data,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.totalPages,
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
        name: <FormattedMessage id="name" />,
        selector: "name",
        sortable: false,
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
                {row.F_NAME}
              </span>
            </div>
          </div>
        ),
      },

      {
        name: <FormattedMessage id="성별" />,
        selector: "gender",
        sortable: false,
        center: true,
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.GENDER === "1" || row.GENDER === "3" ? "M" : "F"}
          </p>
        ),
      },
      {
        name: <FormattedMessage id="나이" />,
        selector: "age",
        sortable: false,
        center: true,
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
        center: true,
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
          <Fragment>
            {row.BP === "01" ? (
              <img
                data-tag="allowRowEvents"
                id="혈압"
                src={pressure_1}
                alt="pressure_1"
              />
            ) : row.BP === "99" ? (
              <img
                data-tag="allowRowEvents"
                id="혈압"
                src={pressure_1}
                alt="pressure_1"
              />
            ) : row.BP === "02" ? (
              <img
                data-tag="allowRowEvents"
                id="혈압"
                src={pressure_5}
                alt="pressure_5"
              />
            ) : row.BP === "03" ? (
              <img
                data-tag="allowRowEvents"
                id="혈압"
                src={pressure_4}
                alt="pressure_4"
              />
            ) : row.BP === "04" ? (
              <img
                data-tag="allowRowEvents"
                id="혈압"
                src={pressure_3}
                alt="pressure_3"
              />
            ) : null}
            {row.PULSE === "01" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="맥박"
                src={pulse_1}
                alt="pulse_1"
              />
            ) : row.PULSE === "99" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="맥박"
                src={pulse_1}
                alt="pulse_1"
              />
            ) : row.PULSE === "02" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="맥박"
                src={pulse_5}
                alt="pulse_5"
              />
            ) : row.PULSE === "03" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="맥박"
                src={pulse_4}
                alt="pulse_4"
              />
            ) : row.PULSE === "04" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="맥박"
                src={pulse_3}
                alt="pulse_3"
              />
            ) : null}
            {row.BW === "01" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체중"
                src={weight_1}
                alt="weight_1"
              />
            ) : row.BW === "99" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체중"
                src={weight_1}
                alt="weight_1"
              />
            ) : row.BW === "02" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체중"
                src={weight_5}
                alt="weight_5"
              />
            ) : row.BW === "03" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체중"
                src={weight_4}
                alt="weight_4"
              />
            ) : row.BW === "04" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체중"
                src={weight_3}
                alt="weight_3"
              />
            ) : null}
            {row.BS === "01" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="혈당"
                src={glucose_1}
                alt="glucose_1"
              />
            ) : row.BS === "99" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="혈당"
                src={glucose_1}
                alt="glucose_1"
              />
            ) : row.BS === "02" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="혈당"
                src={glucose_5}
                alt="glucose_5"
              />
            ) : row.BS === "03" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="혈당"
                src={glucose_4}
                alt="glucose_4"
              />
            ) : row.BS === "04" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="혈당"
                src={glucose_3}
                alt="glucose_3"
              />
            ) : null}
            {row.TEMPERATURE === "01" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체온"
                src={temperature_1}
                alt="temperature_1"
              />
            ) : row.TEMPERATURE === "99" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체온"
                src={temperature_1}
                alt="temperature_1"
              />
            ) : row.TEMPERATURE === "02" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체온"
                src={temperature_5}
                alt="temperature_5"
              />
            ) : row.TEMPERATURE === "03" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체온"
                src={temperature_4}
                alt="temperature_4"
              />
            ) : row.TEMPERATURE === "04" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="체온"
                src={temperature_3}
                alt="temperature_3"
              />
            ) : null}
            {row.SPO2 === "01" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="산소포화도"
                src={spo2_1}
                alt="spo2_1"
              />
            ) : row.SPO2 === "99" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="산소포화도"
                src={spo2_1}
                alt="spo2_1"
              />
            ) : row.SPO2 === "02" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="산소포화도"
                src={spo2_5}
                alt="spo2_5"
              />
            ) : row.SPO2 === "03" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="산소포화도"
                src={spo2_4}
                alt="spo2_4"
              />
            ) : row.SPO2 === "04" ? (
              <img
                style={{ marginLeft: "8px" }}
                data-tag="allowRowEvents"
                id="산소포화도"
                src={spo2_3}
                alt="spo2_3"
              />
            ) : null}
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
          </Fragment>

          // 가운데로 옮길것
        ),
      },
      {
        name: <FormattedMessage id="차트보기" />,
        center: true,
        cell: (row) => (
          <img
            src={chartimage}
            alt="chartimage"
            onClick={() => this.goPatientList(row.PATIENT_ID)}
            style={{ cursor: "pointer", width: "25px" }}
          />
        ),
      },
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
  };

  thumbView = this.props.thumbView;

  componentDidMount() {
    if (this.props.parsedFilter.perPage !== undefined) {
      this.props.getData(
        this.state.user,
        this.props.parsedFilter.perPage,
        this.props.parsedFilter.page
      );
    }
  }

  async goPatientList(id) {
    // 환자 상세페이지 작업 후 주석 풀기
    // this.props.resetVitalData();
    // await this.props.getPatientInfo(this.state.user, id, "");
    // await this.props.getVitalData(id);
  }

  handleFilter = (e) => {
    this.setState({ name: e.target.value });
  };

  handleKeyPress = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      alert("엔터키 눌림");
    }
  };

  search = (e) => {
    e.preventDefault();
    if (this.state.name !== "") {
      history.push(`/patients-list?page=1&perPage=5&name=${this.state.name}`)
      this.props.getNameData(
        this.state.user,
        5,
        1,
        this.state.name
      );
    }
  };

handleRowsPerPage = (value) => {
  const { parsedFilter, getData, getNameData } = this.props;
  const name = (this.state.name || "").trim();

  history.push(`/patients-list?page=1&perPage=${value}&name=${encodeURIComponent(name)}`);
  this.setState({ rowsPerPage: value });

  const run = name ? getNameData : getData; 
  run(this.state.user, value, 1, name);     
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
  const { parsedFilter, getData, getNameData } = this.props;
  const perPage = Number(parsedFilter?.perPage) || this.state.rowsPerPage || 5;
  const name = (this.state.name || "").trim();

  history.push(`/patients-list?page=${page.selected + 1}&perPage=${perPage}&name=${encodeURIComponent(name)}`);

  const run = name ? getNameData : getData;
  run(this.state.user, perPage, page.selected + 1, name); 
  this.setState({ currentPage: page.selected });
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
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}
      >
        {/* <Button className="ml-2" color='primary' outline onClick={this.seeState}>검색</Button> */}
        <DataTable
          style={{ boxShadow: "0px 0px 20px rgba(164, 199, 239, 0.2) " }}
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
          subHeader
          // selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
          onRowClicked={(data) => this.goPatientList(data.PATIENT_ID)}
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              search={this.search}
              handleSidebar={this.handleSidebar}
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              index={sortIndex}
            />
          }
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
          getData={this.props.getData}
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
    user: state.auth,
    dataList: state.dataList,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  getData,
  getNameData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
  resetAppData,
  resetAppointData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
  resetSearchName,
})(DataListConfig);
