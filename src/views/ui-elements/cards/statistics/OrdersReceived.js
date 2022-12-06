import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import CountMonth from "../../../../assets/img/dashboard/ID9_07_btn_count_month.png";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getMonAppoints } from "../../../../redux/actions/appoint/";

class OrdersReceived extends React.Component {
  render() {
    return (
      <FormattedMessage id="monthapp">
        {(monthapp) => (
          <StatisticsCard
            icon={
              <img
                src={CountMonth}
                alt="CountMonth"
                onClick={this.props.getMonAppoints}
                style={{ cursor: "pointer" }}
              />
            }
            iconBg="warning"
            today={this.props.today}
            stat={this.props.countm}
            stat1={this.props.countmkind1}
            stat2={this.props.countmkind2}
            stat3={this.props.countmkind3}
            // stat={48}
            statTitle={monthapp}
            type="area"
          />
        )}
      </FormattedMessage>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  getMonAppoints,
})(OrdersReceived);
