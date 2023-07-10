import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { FormattedMessage } from "react-intl";
// import Chart from "react-apexcharts"

import "../../../assets/scss/pages/allwrap.scss";

class StatisticsCards extends React.Component {
  render() {
    return (
      <Card id="cardshadow" style={{ height: "160px" }}>
        <CardBody
          className={`${
            this.props.className ? this.props.className : "stats-card-body"
          } d-flex ${
            !this.props.iconRight && !this.props.hideChart
              ? "flex-column align-items-start"
              : this.props.iconRight
              ? "justify-content-between flex-row-reverse align-items-center"
              : this.props.hideChart && !this.props.iconRight
              ? "justify-content-center flex-column text-center"
              : null
          } ${!this.props.hideChart ? "pb-0" : "pb-2"} pt-2`}
        >
          {/* <div className="icon-section">
            <div
              className={`avatar avatar-stats p-50 m-0 ${
                this.props.iconBg
                  ? `bg-rgba-${this.props.iconBg}`
                  : "bg-rgba-primary"
              }`}
              style={{ cursor: "default" }}
            >
              <div className="avatar-content">{this.props.icon}</div>
            </div>
          </div> */}
          <div
            className="title-section col-12 d-flex justify-content-between px-0 mb-1"
            style={{ borderBottom: "1px solid #e7eff3" }}
          >
            {/* <h2
              className={`mb-0 text-bold-600 ${
                this.props.iconBg ? `warning` : "primary"
              }`}
            > */}
            <p className="text-bold-600" style={{ color: "#113055" }}>
              {this.props.statTitle}
              <span
                style={{
                  fontWeight: "400",
                  color: "#A29EAF",
                  marginLeft: "16px",
                }}
              >
                {this.props.today}
              </span>
            </p>
            {/* </h2> */}
            <h2
              className="text-bold-600 text-right"
              style={{ color: "#1565C0" }}
            >
              {this.props.stat}
            </h2>
          </div>
        </CardBody>
        <Row className="mx-2 my-1">
          <Col sm="4">
            <Row>
              <h3 style={{ color: "#6E6B7B" }}>{this.props.stat1}</h3>
            </Row>
            <Row style={{ color: "#A29EAF" }}>
              {/* <Row className="text-bold-500"> */}
              <FormattedMessage id="normaldiagnosis" />
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <h3 style={{ color: "#6E6B7B" }}>{this.props.stat2}</h3>
            </Row>
            <Row style={{ color: "#A29EAF" }}>
              {/* <Row className="text-bold-500"> */}
              <FormattedMessage id="cooperation" />
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <h3 style={{ color: "#6E6B7B" }}>{this.props.stat3}</h3>
            </Row>
            <Row style={{ color: "#A29EAF" }}>
              {/* <Row className="text-bold-500"> */}
              <FormattedMessage id="secondop" />
            </Row>
          </Col>
        </Row>
        {/* {!this.props.hideChart && (
          <Chart
            options={this.props.options}
            series={this.props.series}
            type={this.props.type}
            height={this.props.height ? this.props.height : 100}
          />
        )} */}
      </Card>
    );
  }
}
export default StatisticsCards;
