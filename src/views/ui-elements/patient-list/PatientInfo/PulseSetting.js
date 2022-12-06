import React from "react";
import { Form, FormGroup, Button, Input, Row, Col, Table } from "reactstrap";
import { getPastConulstList } from "../../../../redux/actions/data-list";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Fragment } from "react";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { SERVER_URL_TEST } from "../../../../config";

class VitalDataSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      normalBPM: props.vitaldata.PULSE_VAL1,
      dangerBPM: props.vitaldata.PULSE_VAL2,
      edit: props.resetedit,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.resetedit !== prevProps.resetedit) {
      this.setState({
        edit: false,
      });
    }
  };

  edit = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      edit: !prevState.edit,
    }));
  };

  putPulse = (e) => {
    e.preventDefault();

    axios
      .put(`${SERVER_URL_TEST}/doctor/vital/base-pulse`, {
        patient_id: this.props.vitaldata.USER_ID,
        pulse_val1: Number(this.state.normalBPM),
        pulse_val2: Number(this.state.dangerBPM),
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          alert("맥박데이터 세팅이 저장되었습니다.");
        } else if (response.data.status === "400") {
          alert(
            "적정값을 입력하여 주십시오\n값이 올바르지 않거나 너무 크거나 작습니다."
          );
        } else {
          alert("저장도중 문제가 발생하였습니다.");
        }
      });
  };

  render() {
    return (
      <Fragment>
        <Form className="col-12 m-0 p-0" onSubmit={this.putPulse}>
          <Row className="col-12">
            <Table borderless className="m-0 col-12 shadow">
              <thead className="table-primary">
                <tr>
                  <th id="vitalritopth" width={"30%"}></th>
                  <th id="vitalletopth">
                    <h5 className="pl-2">BPM</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <h5 className="pl-4">
                      <FormattedMessage id="정상" />
                    </h5>
                  </th>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.normalBPM}
                        onChange={(e) =>
                          this.setState({ normalBPM: e.target.value })
                        }
                      />
                    </FormGroup>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <h5 className="align-self-center ml-2"> bpm</h5>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.dangerBPM}
                        onChange={(e) =>
                          this.setState({ dangerBPM: e.target.value })
                        }
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <h5 className="pl-4">
                      <FormattedMessage id="위험" />
                    </h5>
                  </th>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 pl-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.dangerBPM}
                        onChange={(e) =>
                          this.setState({ dangerBPM: e.target.value })
                        }
                      />
                    </FormGroup>
                    <h5 className="align-self-center ml-2"> &lsaquo;</h5>
                    <h5 className="align-self-center ml-2"> bpm</h5>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Row className="mt-3">
            <Col md="12" className="pr-3 d-flex flex-row-reverse">
              <Button.Ripple color="primary" type="submit">
                <FormattedMessage id="Save" />
              </Button.Ripple>
              <Button.Ripple
                outline={this.state.edit === true ? false : true}
                color="primary"
                className="mr-1"
                onClick={this.edit}
              >
                <FormattedMessage id="Edit" />
              </Button.Ripple>
            </Col>
          </Row>
        </Form>
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
    vitaldata: state.dataList.vitaldata,
  };
};

export default connect(mapStateToProps, { getPastConulstList })(
  VitalDataSetting
);
