import React from "react";
import { SERVER_URL_TEST } from "../../../../config";
import { Form, FormGroup, Button, Input, Row, Col, Table } from "reactstrap";
import { getPastConulstList } from "../../../../redux/actions/data-list";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Fragment } from "react";
import axios from "axios";
import { FormattedMessage } from "react-intl";

class VitalDataSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      normalfasting: props.vitaldata.FAST_VAL1,
      normalpp2: props.vitaldata.PP2_VAL1,
      alertfasting: props.vitaldata.FAST_VAL2,
      dangerfasting: props.vitaldata.FAST_VAL3,
      dagnerpp2: props.vitaldata.PP2_VAL2,
      edit: false,
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

  putBS = (e) => {
    e.preventDefault();

    axios
      .put(`${SERVER_URL_TEST}/doctor/vital/base-glucose`, {
        patient_id: this.props.vitaldata.USER_ID,
        fast_val1: Number(this.state.normalfasting),
        fast_val2: Number(this.state.alertfasting),
        fast_val3: Number(this.state.dangerfasting),
        pp2_val1: Number(this.state.normalpp2),
        pp2_val2: Number(this.state.dagnerpp2),
      })
      .then((response) => {
        if (response.data.status === "200") {
          alert("혈당데이터 세팅이 저장되었습니다.");
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
        <Form action="/" className="col-12 m-0 p-0" onSubmit={this.putBS}>
          <Row className="col-12">
            <Table borderless className="m-0 col-12 shadow">
              <thead className="table-primary">
                <tr>
                  <th id="vitalritopth" width={"15%"}></th>
                  <th>
                    <h5 className="pl-2">Fasting</h5>
                  </th>
                  <th width={"1%"}></th>
                  <th>
                    <h5 className="pl-2">PP2</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="text-center">
                    <h5>
                      <FormattedMessage id="정상" />
                    </h5>
                  </th>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.normalfasting}
                        onChange={(e) =>
                          this.setState({ normalfasting: e.target.value })
                        }
                      />
                    </FormGroup>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <h5 className="align-self-center ml-2"> fast.</h5>
                    <h4
                      className="align-self-center ml-2"
                      style={{ paddingBottom: "3px" }}
                    >
                      {" "}
                      &lsaquo;
                    </h4>
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.alertfasting}
                        onChange={(e) =>
                          this.setState({ alertfasting: e.target.value })
                        }
                      />
                    </FormGroup>
                  </td>
                  <td></td>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.normalpp2}
                        onChange={(e) =>
                          this.setState({ normalpp2: e.target.value })
                        }
                      />
                    </FormGroup>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <h5 className="align-self-center ml-2"> pp2</h5>
                    <h4
                      className="align-self-center ml-2"
                      style={{ paddingBottom: "3px" }}
                    >
                      {" "}
                      &lsaquo;
                    </h4>
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.dagnerpp2}
                        onChange={(e) =>
                          this.setState({ dagnerpp2: e.target.value })
                        }
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-center">
                    <h5>
                      <FormattedMessage id="주의" />
                    </h5>
                  </th>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.alertfasting}
                        onChange={(e) => this.setState({ r: e.target.value })}
                      />
                    </FormGroup>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <h5 className="align-self-center ml-2"> fast.</h5>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.dangerfasting}
                        onChange={(e) =>
                          this.setState({ dangerfasting: e.target.value })
                        }
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-center">
                    <h5>
                      <FormattedMessage id="위험" />
                    </h5>
                  </th>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.dangerfasting}
                        onChange={(e) =>
                          this.setState({ dangerfasting: e.target.value })
                        }
                      />
                    </FormGroup>
                    <h4
                      className="align-self-center ml-2"
                      style={{ paddingBottom: "3px" }}
                    >
                      {" "}
                      &lsaquo;
                    </h4>
                    <h5 className="align-self-center ml-2"> fast.</h5>
                  </td>
                  <td></td>
                  <td className="d-flex align-self-center">
                    <FormGroup className="pt-1 ml-2">
                      <Input
                        type="number"
                        disabled={this.state.edit === true ? false : true}
                        value={this.state.dagnerpp2}
                        onChange={(e) =>
                          this.setState({ dagnerpp2: e.target.value })
                        }
                      />
                    </FormGroup>
                    <h2 className="align-self-center ml-2"> &#8806;</h2>
                    <h5 className="align-self-center ml-2"> pp2.</h5>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
          {/* <Row className="mt-3">
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
          </Row> */}
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
