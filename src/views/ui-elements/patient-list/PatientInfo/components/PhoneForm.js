import React, { Component } from "react";
import "../../../../../assets/scss/pages/prescription.scss";

class PhoneForm extends Component {
  state = {
    name: "",
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = (e) => {
    // 페이지 리로딩 방지
    e.preventDefault();
    // 상태값을 onCreate 를 통하여 부모에게 전달
    this.props.onCreate(this.state);
    // 상태 초기화
    this.setState({
      name: "",
    });
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* <input
          placeholder="이름"
          value={this.state.name}
          onChange={this.handleChange}
          name="name"
        />
        <input
          placeholder="전화번호"
          value={this.state.phone}
          onChange={this.handleChange}
          name="phone"
        /> */}

        <button id="addbutton" type="submit">
          +&nbsp;Add
        </button>
      </form>
    );
  }
}

export default PhoneForm;
