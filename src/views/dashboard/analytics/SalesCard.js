import React from "react";
import { Card, CardBody } from "reactstrap";
import { Award } from "react-feather";

import decorLeft from "../../../assets/img/elements/decore-left.png";
import decorRight from "../../../assets/img/elements/decore-right.png";
import DisplayName from "./DisplayName";
import { connect } from "react-redux";
import moment from "moment";
import { FormattedMessage, injectIntl } from "react-intl";
import { IntlContext } from "../../../utility/context/Internationalization";
import "../../../assets/scss/pages/allwrap.scss";

const today = moment().format("YYYY년 M월 DD일 입니다.");
const etoday = moment().format("YYYY-MM-DD");
const entoday = moment().format("this is M DD, YYYY");

class SalesCard extends React.Component {
  render() {
    return (
      <Card
        style={{
          width: "1368px",
          height: "70px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        id="cardshadow"
      >
        <CardBody style={{ paddingTop: "16px" }}>
          <div>
            <FormattedMessage id="hello" />
            <DisplayName />
            <FormattedMessage id="님" />
          </div>

          <IntlContext.Consumer>
            {(context) => {
              let langArr = {
                ko: "Korean",
                en: "English",
                // "de" : "German",
                // "fr" : "French",
                // "pt" : "Portuguese"
              };
              return (
                <div style={{ color: "#706b7b" }}>
                  {context.state.locale === null ||
                  context.state.locale === "ko" ? (
                    <div>오늘도 좋은 하루 보내세요.</div>
                  ) : (
                    // <div>Today is {etoday}</div>
                    <div>
                      Here is what is happening with your appointment today.
                    </div>
                  )}
                </div>
              );
            }}
          </IntlContext.Consumer>
        </CardBody>
      </Card>
    );
  }
}

export default injectIntl(SalesCard);
