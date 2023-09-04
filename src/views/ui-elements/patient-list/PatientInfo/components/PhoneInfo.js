import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import "../../../../../assets/scss/pages/prescription.scss";
import Select from "react-select";
import { getKmedicineList } from "../../../../../redux/actions/appoint";
import { connect } from "react-redux";
import { SERVER_URL2 } from "../../../../../config";
import axios from "axios";
import AES256 from "aes-everywhere";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../../redux/actions/auth/cipherActions";

const fdadruglist = [{ value: "21986-2", label: "SPRYCEL" }];

class PhoneInfo extends Component {
  static defaultProps = {
    info: {
      name: "이름",
      label: "",
      id: 0,
      sfdamedicine: "",
      singlevolume: "",
      unit: "",
      number: "",
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      searchmedicineall: "",
      searchfdamedicine: "",
      editing: true,
      name: "",
      volume: "",
      unit: "mg",
      number: "",
      kdruglist: [],
      fdadruglist: [],
      selectedlist: [],
    };
  }

  handleRemove = () => {
    // 삭제 버튼이 클릭되면 onRemove 에 id 넣어서 호출
    const { info, onRemove } = this.props;
    onRemove(info.id);
  };

  handleChange = (e) => {
    const { info, onUpdate } = this.props;
    this.setState({ searchfdamedicine: e.target.value }, () =>
      onUpdate(info.id, {
        sfdamedicine: this.state.searchfdamedicine,
      })
    );
  };

  componentDidMount() {
    console.log(
      this.state.name,
      ":",
      this.state.volume,
      ":",
      this.state.unit,
      this.props.info
    );

    console.log(this.props.info.name);
    if (
      this.props.info.sfdamedicine !== undefined ||
      this.props.info.sfdamedicine !== ""
    ) {
      this.setState({ searchfdamedicine: this.props.info.sfdamedicine });
    }

    if (this.props.info.name !== "") {
      this.setState({
        selectedlist: [
          { value: this.props.info.name, label: this.props.info.label },
        ],
      });
    }

    if (
      this.props.info.singlevolume !== undefined ||
      this.props.info.singlevolume !== ""
    ) {
      this.setState({ volume: this.props.info.singlevolume });
    }

    if (
      this.props.info.unit !== undefined ||
      this.props.info.unit !== "" ||
      this.props.info.unit !== "mg"
    ) {
      this.setState({ unit: this.props.info.unit });
    }

    if (this.props.info.number !== undefined || this.props.info.number !== "") {
      this.setState({ number: this.props.info.number });
    }

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
        label: selectedOption.label,
        name: this.state.name,
      })
    );
  };

  handleChangeVol = (value) => {
    const { info, onUpdate } = this.props;
    this.setState({ volume: " " + value }, () =>
      onUpdate(info.id, {
        volume: this.state.volume + this.state.unit + this.state.number,
        singlevolume: this.state.volume,
      })
    );
  };

  handleChangeUnit = (value) => {
    const { info, onUpdate } = this.props;
    this.setState({ unit: value }, () => {
      onUpdate(info.id, {
        volume: this.state.volume + this.state.unit + this.state.number,
        unit: this.state.unit,
      });
    });
  };

  handleChangeNumber = (value) => {
    const { info, onUpdate } = this.props;
    this.setState({ number: " " + value }, () => {
      onUpdate(info.id, {
        volume: this.state.volume + this.state.unit + this.state.number,
        number: this.state.number,
      });
    });
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

        let mapfdamedicinelist = fdamedicinelist.LIST.map((item) => {
          return {
            value: item.FDA_CODE,
            label: item.DRUGNAME,
          };
        });

        this.setState({ fdadruglist: mapfdamedicinelist });
        const { info, onUpdate } = this.props;
        onUpdate(info.id, {
          name: "",
          label: "",
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const style = {
      width: "100%",
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

    const theme = (theme) => ({
      ...theme,
      spacing: {
        ...theme.spacing,
        controlHeight: 32,
        controlWidth: 172,
        baseUnit: 2,
      },
    });

    if (editing) {
      // 수정모드
      return (
        <div className="d-flex col-12 mx-0 align-items-center" style={style}>
          <div className="px-0 col-4 d-flex align-items-center">
            <Input
              id="fdasearch"
              style={{ height: "32px", marginLeft: "9px" }}
              size="md"
              type="text"
              list="data"
              placeholder="    검색어 입력"
              onChange={this.handleChange}
              value={this.state.searchfdamedicine}
            />
            <datalist id="data">
              {this.state.kdruglist.map((kdruglist, idx) => (
                <option
                  key={idx}
                  value={kdruglist.value}
                  label={kdruglist.text}
                />
              ))}
            </datalist>
            <button id="searchbutton" onClick={this.getFdaMedList}>
              변환
            </button>
          </div>
          <div className="d-flex col-8 pr-0">
            <div className="col-4 px-0">
              {this.props.info.name !== "" ? (
                <Select
                  onChange={this.handleChangeSelect}
                  defaultValue={[
                    {
                      value: this.props.info.name,
                      label: this.props.info.label,
                    },
                  ]}
                  options={this.state.selectedlist}
                  theme={theme}
                />
              ) : (
                <Select
                  onChange={this.handleChangeSelect}
                  defaultValue={this.state.fdadruglist[0]}
                  options={this.state.fdadruglist}
                  theme={theme}
                />
              )}
            </div>

            <div className="col-2 pr-0">
              <Input
                style={{ height: "32px" }}
                type="text"
                value={this.state.volume}
                onChange={(e) => this.handleChangeVol(e.target.value)}
              />
            </div>
            <div className="col-2 pr-0" style={{ paddingLeft: "5px" }}>
              <Input
                className="py-0"
                style={{ height: "32px" }}
                type="select"
                value={this.state.unit}
                onChange={(e) => this.handleChangeUnit(e.target.value)}
                id="select"
              >
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="mcg">mcg</option>
                <option value="ng">ng</option>
                <option value="cc">cc</option>
                <option value="ml">ml</option>
                <option value="ml">bbl</option>
              </Input>
            </div>
            <div className="col-2 pr-0 d-flex">
              <Input
                style={{ height: "32px", width: "40px" }}
                type="text"
                value={this.state.number}
                onChange={(e) => this.handleChangeNumber(e.target.value)}
              />
              <span style={{ height: "27px", marginTop: "7px" }}>회</span>
            </div>
            <div className="col-2 pr-0">
              <button id="delbutton" onClick={this.handleRemove}>
                삭제
              </button>
            </div>
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
