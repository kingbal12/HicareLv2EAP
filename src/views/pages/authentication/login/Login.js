import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  TabContent,
  TabPane,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import classnames from "classnames";
import "../../../../assets/scss/pages/authentication.scss";
import LoginAuth0 from "./LoginAuth0";
import LoginJWT from "./LoginJWT";
import HicareLogo from "../../../../assets/img/logo/logo1.png";
import { IntlContext } from "../../../../utility/context/Internationalization";
import ReactCountryFlag from "react-country-flag";
import { ChevronLeft, ChevronDown, ChevronUp, Globe } from "react-feather";

class Login extends React.Component {
  state = {
    activeTab: "1",
    langDropdown: false,
  };

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  handleLangDropdown = () =>
    this.setState({ langDropdown: !this.state.langDropdown });

  render() {
    return (
      <Row className="m-0 h-100 d-flex align-items-center justify-content-center">
        <Card className="bg-authentication login-card mb-0">
          <Row>
            <Col md="12" className="p-0">
              <Row className="d-flex  w-100 justify-content-end navrow">
                <Col
                  style={{ height: "40px" }}
                  lg="5"
                  md="5"
                  className="d-flex justify-content-end"
                >
                  {/* <ul className="nav">
                    <IntlContext.Consumer>
                      {(context) => {
                        let langArr = {
                          ko: "Korean",
                          en: "English",
                        };
                        return (
                          <Dropdown
                            tag="li"
                            className="dropdown-language nav-item"
                            isOpen={this.state.langDropdown}
                            toggle={this.handleLangDropdown}
                            data-tour="language"
                          >
                            {context.state.locale === null ? (
                              <DropdownToggle tag="a" className="nav-link">
                                Language Setting
                              </DropdownToggle>
                            ) : (
                              <DropdownToggle tag="a" className="nav-link">
                                <span>
                                  <Globe className="globeicon" />
                                </span>
                                <span className="d-sm-inline-block d-none text-capitalize align-middle ml-50">
                                  {langArr[context.state.locale]}
                                </span>
                                <span>
                                  {this.state.langDropdown === false ? (
                                    <ChevronDown className="chevronicon" />
                                  ) : (
                                    <ChevronUp className="chevronicon" />
                                  )}
                                </span>
                              </DropdownToggle>
                            )}

                            <DropdownMenu right>
                              <DropdownItem
                                tag="a"
                                onClick={(e) => context.switchLanguage("ko")}
                              >
                                <span className="ml-1">한국어</span>
                              </DropdownItem>
                              <DropdownItem
                                tag="a"
                                onClick={(e) => context.switchLanguage("en")}
                              >
                                <span className="ml-1">English</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        );
                      }}
                    </IntlContext.Consumer>
                  </ul> */}
                </Col>
              </Row>
              <Card className="mx-1">
                <CardHeader className="pb-3 pt-3 d-flex justify-content-center">
                  <Col lg="8" md="8" className="d-flex justify-content-center">
                    <img
                      src={HicareLogo}
                      alt="HicareLogo"
                      style={{ width: "149px" }}
                    />
                  </Col>
                </CardHeader>

                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <LoginJWT />
                  </TabPane>
                  <TabPane tabId="2"></TabPane>
                  <TabPane tabId="3">
                    <LoginAuth0 />
                  </TabPane>
                </TabContent>
              </Card>
            </Col>
          </Row>
        </Card>
      </Row>
    );
  }
}
export default Login;
