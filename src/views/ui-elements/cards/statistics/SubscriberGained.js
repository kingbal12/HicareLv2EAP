import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Fragment } from "react";
import CountToday from "../../../../assets/img/dashboard/ID9_07_btn_count_today.png";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getDayAppoints } from "../../../../redux/actions/appoint/";

class SubscriberGained extends React.Component {
  render() {
    return (
      <Fragment>
        <FormattedMessage id="todayapp">
          {(todayapp) => (
            <StatisticsCard
              icon={
                <img
                  src={CountToday}
                  alt="CountToday"
                  onClick={this.props.getDayAppoints}
                  style={{ cursor: "pointer" }}
                />
              }
              statTitle={todayapp}
              today={this.props.today}
              stat={this.props.countd}
              stat1={this.props.countdkind1}
              stat2={this.props.countdkind2}
              stat3={this.props.countdkind3}
              type="area"
            />
          )}
        </FormattedMessage>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  getDayAppoints,
})(SubscriberGained);
