import React, { Component } from "react";
import {
  Button,
  Progress,
  Card,
  Input,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBody,
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
} from "react-feather";
import { connect } from "react-redux";
import {
  getFaq,
  getNameFaqData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
  // eData
} from "../../../../redux/actions/data-list/";
import Sidebar from "./DataListSidebar";
import Chip from "../../../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import moment from "moment";
import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/data-list.scss";
import Axios from "axios";
import { FormattedMessage } from "react-intl";
import AES256 from "aes-everywhere";
import { SERVER_URL2 } from "../../../../config";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";

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

const localFormDate = (scheduleda) => {
  console.log("utc", scheduleda);
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format("MMMM, DD");
  console.log("locale:", localscheduledate);
  return localscheduledate;
};

const CustomHeader = (props) => {
  return (
    <div className="data-list-headerjustify-content-between">
      <h3 className="text-bold-600">FAQ</h3>
      <Card
        className="mt-1"
        style={{ backgroundColor: "#F8F8F8", height: "11rem" }}
      >
        <Row className="px-3 pt-1">
          <h4 className="text-bold-600">
            <FormattedMessage id="faq타이틀1" />
          </h4>
        </Row>
        <Row className="px-3">
          <h4 className="text-bold-600">
            <FormattedMessage id="faq타이틀2" />
          </h4>
        </Row>
        <Row className=" d-flex  justify-content-between  mt-2  px-3">
          <Input
            className="col-10"
            type="text"
            placeholder="Search"
            onChange={(e) => props.handleFilter(e)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                props.search(e);
              }
            }}
          />

          <Button color="primary" outline onClick={(e) => props.search(e)}>
            <FormattedMessage id="검색" />
          </Button>
        </Row>
      </Card>
    </div>
  );
};

class DataListConfig extends Component {
  constructor(props) {
    super(props);
    if (this.props.parsedFilter.perPage === undefined) {
      this.props.getFaq(
        this.state.rowsPerPage,
        this.state.currentPage,
        this.props.cipher.rsapublickey.publickey
      );
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (
      props.dataList.data.length !== state.data.length ||
      state.currentPage !== props.parsedFilter.page
    ) {
      return {
        data: props.dataList.faqdata,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.faqtotalPages,
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
        name: "No.",
        selector: "name",
        sortable: false,
        minWidth: "200px",
        center: true,
        cell: (row) => (
          <div
            data-tag="allowRowEvents"
            className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1"
          >
            <div className="user-info text-truncate ml-xl-50 ml-0">
              <span
                data-tag="allowRowEvents"
                title={row.F_NAME}
                className="d-block text-bold-500 text-truncate mb-0"
              >
                {row.SEQ}
              </span>
            </div>
          </div>
        ),
      },

      {
        name: <FormattedMessage id="Title" />,
        selector: "gender",
        sortable: false,
        center: true,
        cell: (row) => (
          <p data-tag="allowRowEvents" className="text-bold-500 mb-0">
            {row.TITLE}
          </p>
        ),
      },
      // {
      //   name: "작성자",
      //   selector: "age",
      //   sortable: false,
      //   center:true,
      //   cell: row => <p data-tag="allowRowEvents" className="text-bold-500 mb-0">{row.AUTH_NM}</p>
      // },
      {
        name: <FormattedMessage id="Date" />,
        selector: "birthday",
        sortable: false,
        center: true,
        cell: (row) => (
          <p
            data-tag="allowRowEvents"
            className="text-bold-500 text-truncate mb-0"
          >
            {localFormDate(row.CREATE_TIME)}
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
    seq: 0,
    faqmodal: false,
    faqtitle: "",
    faqcontent: "",
  };

  thumbView = this.props.thumbView;

  componentDidMount() {
    if (this.props.parsedFilter.perPage !== undefined) {
      this.props.getFaq(
        this.props.parsedFilter.perPage,
        this.props.parsedFilter.page,
        this.props.cipher.rsapublickey.publickey
      );
    }
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
              getFaq={this.props.getFaq}
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
    this.props.getNameFaqData(
      5,
      1,
      this.state.name,
      this.props.cipher.rsapublickey.publickey
    );
  };

  handleRowsPerPage = (value) => {
    let { parsedFilter, getFaq } = this.props;
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    history.push(`/pages/newfaq?page=${page}&perPage=${value}`);
    this.setState({ currentPage: page, rowsPerPage: value });
    getFaq({
      page: parsedFilter.page,
      perPage: value,
      key: this.props.cipher.rsapublickey.publickey,
    });
    // getFaq({ user_id: this.state.user, page_num: parsedFilter.page, page_amount: value })
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
    let { parsedFilter, getFaq } = this.props;
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 5;
    let urlPrefix = this.props.thumbView
      ? "/data-list/thumb-view/"
      : "/pages/newfaq";
    history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
    getFaq(
      perPage,
      page.selected + 1,
      this.props.cipher.rsapublickey.publickey
    );
    this.setState({ currentPage: page.selected });
  };

  getFaqeOne = (seq, key) => {
    let encryptedrsapkey = encryptByPubKey(key);
    let value = AES256.encrypt(
      JSON.stringify({
        seq: seq,
      }),
      AESKey
    );
    Axios.get(`${SERVER_URL2}/doctor/setting/faq`, {
      params: {
        c_key: encryptedrsapkey,
        c_value: value,
      },
    }).then((response) => {
      if (response.data.status === "200") {
        let faqdata = decryptByAES(response.data.data);
        this.setState({
          faqtitle: faqdata.TITLE,
          faqcontent: faqdata.CONTENTS,
          faqmodal: true,
        });
      } else {
        alert("FAQ를 불러오지 못하였습니다.");
      }
    });
  };

  faqModal = () => {
    this.setState((prevState) => ({
      faqmodal: !prevState.faqmodal,
    }));
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
        <Modal
          isOpen={this.state.faqmodal}
          toggle={this.faqModal}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={this.faqModal}>
            {this.state.faqtitle}
          </ModalHeader>
          <ModalBody className="mx-1">
            <Card className="mt-1">
              <CardBody className="pt-1">{this.state.faqcontent}</CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.faqModal}>
              확인
            </Button>
          </ModalFooter>
        </Modal>
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
          onRowClicked={(data) =>
            this.getFaqeOne(data.SEQ, this.props.cipher.rsapublickey.publickey)
          }
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
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
          getFaq={this.props.getFaq}
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
  getFaq,
  getNameFaqData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
  resetVitalData,
  getPatientInfo,
  getVitalData,
})(DataListConfig);
