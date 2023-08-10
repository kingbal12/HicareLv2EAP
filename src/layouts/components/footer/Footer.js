import React from "react";
import ScrollToTop from "react-scroll-up";
import { Button } from "reactstrap";
import { Heart, ArrowUp } from "react-feather";
import classnames from "classnames";
import moment from "moment";

const Footer = (props) => {
  let footerTypeArr = ["sticky", "static", "hidden"];
  return (
    <footer
      style={{ backgroundColor: "#113055" }}
      className={classnames("footer ", {
        "footer-static":
          props.footerType === "static" ||
          !footerTypeArr.includes(props.footerType),
        "d-none": props.footerType === "hidden",
      })}
    >
      <p
        style={{
          width: "1368px",
          marginRight: "auto",
          marginLeft: "auto",
          color: "#FFFEFE",
        }}
        className="mb-0 clearfix"
      >
        <span className="float-md-left d-block d-md-inline-block mt-25">
          Copyright ⓒ {moment().format("YYYY")} HicareNet Inc. Hicare ALL RIGHT
          RESERVED.
        </span>
        <span
          style={{ fontSize: "7px" }}
          className="ml-3 float-md-left d-block d-md-inline-block mt-25"
        >
          - 환자용 App / 의사용 Web 관련 문의 : 김승찬 소장
          sckim@iot4health.co.kr 010-5202-3246 <br />- 판독시스템 관련 문의 :
          권지혜 책임 jhkwon@infinitt.com 010-5066-7517
        </span>
        <span
          style={{ fontSize: "7px" }}
          className="ml-3 float-md-left d-block d-md-inline-block mt-25"
        >
          - 그 외 문의 : 김마리 과장 kimmary@hicare.net 010-7607-0725
        </span>
      </p>
      {props.hideScrollToTop === false ? (
        <ScrollToTop showUnder={160}>
          <Button color="primary" className="btn-icon scroll-top">
            <ArrowUp size={15} />
          </Button>
        </ScrollToTop>
      ) : null}
    </footer>
  );
};

export default Footer;
