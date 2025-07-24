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
        </span>
        <span
          style={{ fontSize: "7px" }}
          className="ml-3 float-md-left d-block d-md-inline-block mt-25"
        >
        </span>
        <span
          style={{ fontSize: "7px" }}
          className="ml-3 float-md-left d-block d-md-inline-block mt-25"
        >
          <br/>
          <br/>
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
