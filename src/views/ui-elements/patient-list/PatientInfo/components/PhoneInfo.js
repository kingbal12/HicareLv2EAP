import React, { Component } from "react";
import { Button } from "reactstrap";
import "../../../../../assets/scss/pages/prescription.scss";
import Select from "react-select";
import { getKmedicineList } from "../../../../../redux/actions/appoint";
import { connect } from "react-redux";
import { SERVER_URL2 } from "../../../../../config";
import axios from "axios";
import ReactHTMLDatalist from "react-html-datalist";
import AES256 from "aes-everywhere";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../../redux/actions/auth/cipherActions";

class PhoneInfo extends Component {
  static defaultProps = {
    info: {
      name: "이름",
      id: 0,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      searchmedicineall: "",
      searchfdamedicine: "",
      editing: true,
      name: "",
      kdruglist: [],
      fdadruglist: [],
    };
  }

  handleRemove = () => {
    // 삭제 버튼이 클릭되면 onRemove 에 id 넣어서 호출
    const { info, onRemove } = this.props;
    onRemove(info.id);
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        drug_name: this.state.searchmedicineall,
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/ko-drugs`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })

      .then((response) => {
        let kmedicinelist = decryptByAES(response.data.data);
        console.log(kmedicinelist);

        const mapkmedicinelist = kmedicinelist.LIST.map((item) => {
          return { value: item.EDI_CODE, text: item.DRUGNAME };
        });

        this.setState({ kdruglist: mapkmedicinelist }, () =>
          console.log(this.state.kdruglist)
        );
      })
      .catch((err) => console.log(err));
  }

  handleChangeSelect = (selectedOption) => {
    const { info, onUpdate } = this.props;
    this.setState({ name: selectedOption.value }, () =>
      onUpdate(info.id, {
        name: this.state.name,
      })
    );
  };

  getFdaMedList = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        edi_code: this.state.searchfdamedicine,
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/fda-drugs`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })

      .then((response) => {
        let fdamedicinelist = decryptByAES(response.data.data);
        console.log(fdamedicinelist);

        const mapfdamedicinelist = fdamedicinelist.LIST.map((item) => {
          return {
            value: item.FDA_CODE,
            label: item.DRUGNAME,
            status: item.FDA_STATUS,
          };
        });

        this.setState({ fdadruglist: mapfdamedicinelist }, () =>
          console.log(this.state.fdadruglist)
        );
      })
      .catch((err) => console.log(err));
  };

  render() {
    const style = {
      width: "575px",
      height: "48px",
      border: "1px solid #c7d1da",
    };

    const { editing } = this.state;

    const customStyles = {
      controlContainer: (provided, state) => ({
        ...provided,
        width: "172px",
      }),
      option: (provided, state) => ({
        ...provided,
        width: "172px",
        height: "32px",
      }),

      control: (base) => ({
        ...base,
        width: 172,
      }),
    };

    const theme = (theme: Theme) => ({
      ...theme,
      spacing: {
        ...theme.spacing,
        controlHeight: 32,
        controlWidth: 172,
        baseUnit: 2,
      },
    });

    // var { searchmedicine } = this.state;

    if (editing) {
      // 수정모드
      return (
        <div className="d-flex mx-0" style={style}>
          <div id="searchbox">
            <ReactHTMLDatalist
              name={"searchfdamedicine"}
              onChange={this.handleChange}
              classNames={"classone classtwo"}
              options={this.state.kdruglist}
            />
            <button id="searchbutton" onClick={this.getFdaMedList}>
              변환
            </button>
          </div>
          <div className="d-flex" id="searchbox">
            <div style={{ width: "172px" }}>
              <Select
                styles={customStyles}
                onChange={this.handleChangeSelect}
                name="name"
                options={this.state.fdadruglist}
                className="React"
                classNamePrefix="select"
                theme={theme}
              />
            </div>
            <button id="searchbutton" onClick={this.handleRemove}>
              삭제
            </button>
          </div>
        </div>
      );
    }

    // 일반모드
    const { name } = this.props.info;

    return (
      <div style={style}>
        <div>
          <b>{name}</b>
          <Button onClick={this.handleToggleEdit}>변환</Button>
        </div>
        <Button onClick={this.handleRemove}>삭제</Button>
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
    cslist: state.dataList.csdata,
    bpdata: state.dataList.BP,
    pulstdata: state.dataList.PULSE,
    tempdata: state.dataList.TEMP,
    bsdata: state.dataList.BS,
    wedata: state.dataList.WE,
    spo2data: state.dataList.SPO2,
    rtime: state.dataList.rtime,
    pharmacy: state.dataList.pharmacy,

    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  getKmedicineList,
})(PhoneInfo);
