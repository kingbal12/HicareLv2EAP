import React, { Component } from "react";
import {
  Progress,
  Row,
  Col,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../../../history";
import {
  Edit,
  Trash,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
} from "react-feather";
import { connect } from "react-redux";
import {
  getPaymentData,
  getPaymentTotalData,
  getNameData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
} from "../../../../redux/actions/data-list";
import Sidebar from "../notice/DataListSidebar";
import Chip from "../../../../components/@vuexy/chips/ChipComponent";
import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/allwrap.scss";
import "../../../../assets/scss/pages/data-list.scss";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";
import axios from "axios";
import { FormattedMessage } from "react-intl";

const chipColors = {
  "on hold": "warning",
  delivered: "success",
  pending: "primary",
  canceled: "danger",
};

const selectedStyle = {
  selectedHighlighStyle: {
    backgroundColor: "rgba(115,103,240,.05)",
    color: "#7367F0 !important",
    boxShadow: "0 0 1px 0 #7367F0 !important",
    "&:hover": {
      transform: "translateY(0px) !important",
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
    <div
      // className="data-list-header"
      style={{ backgroundColor: "white", borderColor: "1px #E7EFF3" }}
    >
      <UncontrolledDropdown className="data-list-rows-dropdown d-md-block d-none mt-2 mb-1">
        <DropdownToggle color="">
          <span className="align-middle mx-50">{`${rowPage} Page`}</span>
          <ChevronDown size={15} />
        </DropdownToggle>
        <DropdownMenu tag="div" right>
          <DropdownItem tag="a">5 Page</DropdownItem>
          <DropdownItem tag="a">10 Page</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

class DataListConfig extends Component {
  constructor(props) {
    super(props);
    let lastday = String(
      new Date(this.state.year, this.state.month, 0).getDate()
    );
    if (this.props.parsedFilter.perPage === undefined) {
      this.props.getPaymentData(
        this.state.user,
        this.state.year + this.state.month + "01",
        this.state.year + this.state.month + lastday,
        this.state.rowsPerPage,
        this.state.currentPage,
        this.props.cipher.rsapublickey.publickey
      );
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.dataList.paydata.length !== state.data.length ||
      state.currentPage !== props.parsedFilter.page
    ) {
      return {
        data: props.dataList.paydata,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.paytotalPages,
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
    year: moment().utc().format("YYYY"),
    month: moment().utc().format("MM"),
    lastday: "",
    name: "",
    data: [],
    totalPages: 0,
    currentPage: 1,
    columns: [
      {
        name: "No",
        selector: "gender",
        sortable: false,
        minWidth: "150px",
        center: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.APPOINT_NUM}</p>,
      },
      {
        name: "진료일시",
        selector: "gender",
        sortable: false,
        // center: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {moment(row.APPOINT_TIME).format("MMMM DD, YYYY")}
          </p>
        ),
      },
      {
        name: "이름",
        selector: "name",
        sortable: false,
        minWidth: "200px",
        // center: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">{row.L_NAME + row.F_NAME}</p>
          // <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
          //   <div className="user-info text-truncate ml-xl-50 ml-0">
          //     <span
          //       title={row.F_NAME}
          //       className="d-block text-bold-500 text-truncate mb-0"
          //     >

          //     </span>
          //   </div>
          // </div>
        ),
      },

      {
        name: "구분",
        selector: "gender",
        sortable: false,
        // center: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {row.MEDICAL_KIND === "1"
              ? "일반진료"
              : row.MEDICAL_KIND === "2"
              ? "원격상담 & 로컬 진료"
              : "Second Opinion"}
          </p>
        ),
      },
      {
        name: "진행 상태",
        selector: "age",
        sortable: false,
        // center: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {row.APPOINT_STATE === "TF" ? "완료" : "취소"}
          </p>
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
    totaldata: this.props.dataList.totalpaydata,
  };

  thumbView = this.props.thumbView;

  componentDidMount() {
    // window.location.reload();
    if (this.props.parsedFilter.perPage !== undefined) {
      this.setState({
        lastday: String(
          new Date(this.state.year, this.state.month, 0).getDate()
        ),
      });

      this.props.getPaymentData(
        this.state.user,
        this.state.year + this.state.month + "01",
        this.state.year + this.state.month + this.state.lastday,
        this.props.parsedFilter.perPage,
        this.props.parsedFilter.page,
        this.props.cipher.rsapublickey.publickey
      );
    }

    this.setState(
      {
        lastday: String(
          new Date(this.state.year, this.state.month, 0).getDate()
        ),
      },
      () =>
        // axios
        // .get("https://teledoc.hicare.net:446/v1/doctor/treatment/payments", {
        //   params: {
        //     user_id: this.state.user,
        //     start_date: this.state.year+this.state.month+"01",
        //     end_date: this.state.year+this.state.month+this.state.lastday,
        //     page_amount: 500000,
        //     page_num: 1
        //   }
        // })
        // .then(response => {
        //   let len = response.data.data.PAY_LIST.length
        //   let totalPay = new Array();
        //   let sumtotal = 0;
        //   for (let i=0; i<len; i++) {
        //     let jsonObj		= new Object();
        //     jsonObj.PAY_TOTAL = response.data.data.PAY_LIST[i].PAY_TOTAL
        //     jsonObj = JSON.stringify(jsonObj);
        //     totalPay.push(JSON.parse(jsonObj));
        //     if (len>0) {sumtotal= totalPay[i].PAY_TOTAL+sumtotal}
        //   }
        //  this.setState({totaldata:totalPay})
        // })
        // .catch(err => console.log(err))
        this.props.getPaymentTotalData(
          this.state.user,
          this.state.year + this.state.month + "01",
          this.state.year + this.state.month + this.state.lastday,
          this.props.cipher.rsapublickey.publickey
        )
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.thumbView) {
      this.thumbView = false;
      let columns = [
        {
          name: "Image",
          selector: "img",
          minWidth: "220px",
          cell: (row) => <img src={row.img} height="100" alt={row.name} />,
        },
        {
          name: "Name",
          selector: "name",
          sortable: false,
          minWidth: "250px",
          cell: (row) => (
            <p title={row.name} className="text-truncate text-bold-500 mb-0">
              {row.name}
            </p>
          ),
        },
        {
          name: "Category",
          selector: "category",
          sortable: false,
        },
        {
          name: "Popularity",
          selector: "popularity",
          sortable: false,
          cell: (row) => (
            <Progress
              className="w-100 mb-0"
              color={row.popularity.color}
              value={row.popularity.popValue}
            />
          ),
        },
        {
          name: "Order Status",
          selector: "order_status",
          sortable: false,
          cell: (row) => (
            <Chip
              className="m-0"
              color={chipColors[row.order_status]}
              text={row.order_status}
            />
          ),
        },
        {
          name: "Price",
          selector: "price",
          sortable: false,
          cell: (row) => `$${row.price}`,
        },
        {
          name: "Actions",
          sortable: false,
          cell: (row) => (
            <ActionsComponent
              row={row}
              getPaymentData={this.props.getPaymentData}
              parsedFilter={this.props.parsedFilter}
              currentData={this.handleCurrentData}
              deleteRow={this.handleDelete}
            />
          ),
        },
      ];
      this.setState({ columns });
    }
  }

  goPatientList(id) {
    // id.preventDefault()
    this.props.resetVitalData();
    this.props.getPatientInfo(
      this.state.user,
      id,
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
        5,
        1,
        this.state.name,
        this.props.cipher.rsapublickey.publickey
      );
    }
  };

  handleRowsPerPage = (value) => {
    let { parsedFilter, getPaymentData } = this.props;
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    history.push(`/pages/paymentmanagement?page=${page}&perPage=${value}`);
    this.setState({ currentPage: page, rowsPerPage: value });
    getPaymentData({
      user_id: this.state.user,
      start_date: this.state.year + this.state.month + "01",
      end_date: this.state.year + this.state.month + this.state.lastday,
      page: parsedFilter.page,
      perPage: value,
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
    let { parsedFilter, getPaymentData } = this.props;
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 5;
    let urlPrefix = this.props.thumbView
      ? "/data-list/thumb-view/"
      : "/pages/paymentmanagement";
    history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
    // getData({ page: page.selected + 1, perPage: perPage })
    getPaymentData(
      this.state.user,
      this.state.year + this.state.month + "01",
      this.state.year + this.state.month + this.state.lastday,
      perPage,
      page.selected + 1,
      this.props.cipher.rsapublickey.publickey
    );
    this.setState({ currentPage: page.selected });
  };

  getpay = () => {
    this.setState(
      {
        lastday: String(
          new Date(this.state.year, this.state.month, 0).getDate()
        ),
      },
      () =>
        this.props.getPaymentData(
          this.state.user,
          this.state.year + this.state.month + "01",
          this.state.year + this.state.month + this.state.lastday,
          5,
          1,
          this.props.cipher.rsapublickey.publickey
        )
    );

    this.props.getPaymentTotalData(
      this.state.user,
      this.state.year + this.state.month + "01",
      this.state.year + this.state.month + this.state.lastday,
      this.props.cipher.rsapublickey.publickey
    );
  };

  check = () => {
    this.setState(
      {
        lastday: String(
          new Date(this.state.year, this.state.month, 0).getDate()
        ),
      },
      () => console.log(this.state)
    );
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

    let headers = [
      { label: "No", key: "APPOINT_NUM" },
      { label: "진료일시", key: "APPOINT_TIME" },
      { label: "환자 성", key: "L_NAME" },
      { label: "환자 이름", key: "F_NAME" },
      { label: "환자ID", key: "USER_ID" },
      {
        label: "구분(1=일반진료, 2=협진, 3=Second Opinion)",
        key: "MEDICAL_KIND",
      },
      { label: "진행 상태", key: "APPOINT_STATE" },
    ];

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
        <div className="col-12 mx-0 px-0">
          <div className=" mb-2">
            <h4>
              <FormattedMessage id="진료비 청구내역" />
            </h4>
          </div>

          <Card className="mx-0" id="payment_cardshadow">
            <CardBody>
              <div
                className="col-12 d-flex justify-content-between"
                style={{
                  fontSize: "16px",
                  color: "#113055",
                  fontWeight: "700",
                }}
              >
                <div className="col-3 px-0" style={{ marginLeft: "5px" }}>
                  월별 통계
                </div>
                <div className="col-3 d-flex px-0">
                  <Input
                    style={{
                      border: "0px",
                    }}
                    type="select"
                    name="select"
                    id="select"
                    value={this.state.year}
                    onChange={(e) => this.setState({ year: e.target.value })}
                  >
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </Input>

                  <Input
                    style={{ marginBottom: "0.5rem", border: "0px" }}
                    type="select"
                    name="select"
                    id="select"
                    className="ml-2"
                    value={this.state.month}
                    onChange={(e) =>
                      this.setState({ month: e.target.value }, () =>
                        this.getpay()
                      )
                    }
                  >
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </Input>
                </div>
              </div>
              <div className="ml-2">
                현재 시점 기준으로 진료가 완료되거나 취소된 예약만이 합산됩니다.
              </div>
              <div className="px-0 mx-0 col-12 d-flex mt-2">
                <div id="littlecard">
                  <CardHeader
                    style={{
                      fontWeight: "400",
                      color: "#6E6B7B",
                    }}
                  >
                    전체
                  </CardHeader>
                  <CardBody
                    style={{
                      fontWeight: "500",
                      color: "#1565C0",
                      fontSize: "21px",
                    }}
                    className="d-flex justify-content-end"
                  >
                    {this.props.dataList.countsmon.COUNT_MON}
                  </CardBody>
                </div>

                <div id="littlecard">
                  <CardHeader
                    style={{
                      fontWeight: "400",
                      color: "#6E6B7B",
                    }}
                  >
                    일반 진료
                  </CardHeader>
                  <CardBody
                    style={{
                      fontWeight: "500",
                      color: "#4B94F2",
                      fontSize: "21px",
                    }}
                    className="d-flex justify-content-end"
                  >
                    {this.props.dataList.countsmon.COUNT_M_KIND1}
                  </CardBody>
                </div>

                <div id="littlecard">
                  <CardHeader
                    style={{
                      fontWeight: "400",
                      color: "#6E6B7B",
                    }}
                  >
                    원격상담 &amp; 로컬 진료
                  </CardHeader>
                  <CardBody
                    style={{
                      fontWeight: "500",
                      color: "#576EF2",
                      fontSize: "21px",
                    }}
                    className="d-flex justify-content-end"
                  >
                    {this.props.dataList.countsmon.COUNT_M_KIND2}
                  </CardBody>
                </div>

                <div id="littlecard">
                  <CardHeader
                    style={{
                      fontWeight: "400",
                      color: "#6E6B7B",
                    }}
                  >
                    Second Opinion
                  </CardHeader>
                  <CardBody
                    style={{
                      fontWeight: "500",
                      color: "#F2C641",
                      fontSize: "21px",
                    }}
                    className="d-flex justify-content-end"
                  >
                    {this.props.dataList.countsmon.COUNT_M_KIND3}
                  </CardBody>
                </div>

                <div id="littlecard">
                  <CardHeader
                    style={{
                      fontWeight: "400",
                      color: "#6E6B7B",
                    }}
                  >
                    취소
                  </CardHeader>
                  <CardBody
                    style={{
                      fontWeight: "500",
                      color: "#A29EAF",
                      fontSize: "21px",
                    }}
                    className="d-flex justify-content-end"
                  >
                    {this.props.dataList.countsmon.COUNT_M_CANCEL}
                  </CardBody>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        {/* <Row>
          <Col md="12" className="d-flex justify-content-end px-0">
            <UncontrolledDropdown className="data-list-rows-dropdown d-md-block d-none mt-2 mb-1">
              <DropdownToggle color="" className="sort-dropdown">
                <span className="align-middle mx-50">{`${rowPage} Page`}</span>
                <ChevronDown size={15} />
              </DropdownToggle>
              <DropdownMenu tag="div" right>
                <DropdownItem
                  tag="a"
                  onClick={() => props.handleRowsPerPage(5)}
                >
                  5 Page
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  onClick={() => props.handleRowsPerPage(10)}
                >
                  10 Page
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
        </Row> */}
        {/* <Button className="ml-2" color='primary' outline onClick={this.seeState}>검색</Button> */}
        <DataTable
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
          responsive
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
        />

        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getPaymentData={this.props.getPaymentData}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar,
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
        <div className="mt-1 mb-1">
          <CSVLink
            filename={
              moment().format("YYYY-MM-DD").toString() + "-PaymentRecord"
            }
            data={this.props.dataList.totalpaydata}
            headers={headers}
          >
            <Button
              disabled={this.props.dataList.paydata.length === 0 ? true : false}
              color="primary"
              type="button"
            >
              <FormattedMessage id="다운로드" />
            </Button>
          </CSVLink>
        </div>
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
  getPaymentData,
  getPaymentTotalData,
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
