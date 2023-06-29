import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import "../../../../assets/scss/pages/authentication.scss";
import classnames from "classnames";
import FindId from "./FindId";
import FindPw from "./FindPw";
import { ChevronLeft } from "react-feather";
import { history } from "../../../../history";
import { FormattedMessage } from "react-intl";

class Login extends React.Component {
  state = {
    activeTab: "1",
  };
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };
  render() {
    return (
      <Row className="m-0 h-100 d-flex align-items-center justify-content-center">
        <Card className="bg-find login-card  mb-0">
          <Col md="12" className="p-0">
            <Card className="rounded-0 mb-0 px-2 login-tabs-container">
              <Nav tabs className="px-0 mt-4 justify-content-center">
                <NavItem>
                  <NavLink
                    style={{ paddingRight: "38px", paddingLeft: "38px" }}
                    className={classnames({
                      active: this.state.activeTab === "1",
                    })}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    <h5
                      className={
                        this.state.activeTab === "1" ? "" : "text-secondary"
                      }
                    >
                      <FormattedMessage id="Find ID" />
                    </h5>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ paddingRight: "38px", paddingLeft: "38px" }}
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    <h5
                      className={
                        this.state.activeTab === "2" ? "" : "text-secondary"
                      }
                    >
                      <FormattedMessage id="Find Password" />
                    </h5>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <FindId />
                </TabPane>
                <TabPane tabId="2">
                  <FindPw />
                </TabPane>
              </TabContent>
            </Card>
          </Col>
        </Card>
      </Row>
    );
  }
}
export default Login;
