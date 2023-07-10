import React from "react";
import "../../../../assets/scss/plugins/mdfschedule/react-big-calendar.css";
import "../../../../assets/scss/plugins/mdfschedule/react-big-calendar.scss";
import {
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Modal,
  FormGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { connect } from "react-redux";
import {
  fetchEvents,
  handleSidebar,
  addEvent,
  handleSelectedEvent,
  updateEvent,
  updateDrag,
  updateResize,
  clearSchedule,
  mdfpostSchedules,
  nextfetchEvents,
  deleteSchedule,
} from "../../../../redux/actions/calendar/index";
import { ChevronLeft, ChevronRight } from "react-feather";
import Radio from "../../../../components/@vuexy/radio/RadioVuexy";
import { FormattedMessage } from "react-intl";
import { history } from "../../../../history";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);
const eventColors = {
  business: "bg-success",
  work: "bg-warning",
  personal: "bg-danger",
  others: "bg-primary",
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
    };
  }

  render() {
    return (
      <div className="calendar-header mb-2 d-flex justify-content-between flex-wrap">
        <div className="month-label d-flex flex-column text-center text-md-right mt-1 mt-md-0">
          <div className="calendar-navigation">
            <ChevronLeft
              style={{ cursor: "pointer" }}
              onClick={() => this.props.onNavigate("PREV")}
              size={24}
            />

            <ChevronRight
              style={{ cursor: "pointer" }}
              className="ml-2"
              onClick={() => this.props.onNavigate("NEXT")}
              size={24}
            />

            <div
              className="month d-inline-block mx-75 text-bold-500 font-medium-2 align-middle text-center"
              style={{ minWidth: "150px" }}
            >
              {this.props.label}
            </div>
          </div>
        </div>
        <div>
          <FormattedMessage id="개별삭제" />
        </div>
      </div>
    );
  }
}

class CalendarApp extends React.Component {
  clearschedule = (e) => {
    e.preventDefault();
    this.props.clearSchedule();
  };

  schedulemodal = () => {
    this.setState((prevState) => ({
      schedulemodal: !prevState.schedulemodal,
    }));
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.app.events.length !== state.events ||
      props.app.sidebar !== state.sidebar ||
      props.app.selectedEvent !== state.eventInfo
    ) {
      let dateToObj = props.app.events.map((event) => {
        // 여기서 날짜 포맷이 다시 바뀌는중
        event.start = new Date(event.start);
        event.end = new Date(event.end);

        return event;
      });
      return {
        events: dateToObj,
        sidebar: props.app.sidebar,
        eventInfo: props.app.selectedEvent,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      userid: props.user.login.values.loggedInUser.username,
      events: [],
      views: {
        month: true,
        week: true,
        day: true,
      },
      id: 1,
      auto: "true",
      rperiod: "1",
      holiday: "N",
      modal: false,
      weekstart: "",
      weekend: "",
      prdweekend: "",
      schedulemodal: false,
      overlap: "F",
    };
  }

  async componentDidMount() {
    if (window.name != "reload") {
      window.name = "reload";
      window.location.reload(true);
      if (localStorage.getItem("firstyn") === "y") {
        if (localStorage.getItem("lang") === "en") {
          alert("New members, please register the schedule.");
        } else {
          alert("신규회원은 스케쥴을 등록해주세요");
        }
      }
    } else window.name = "";

    await this.onNavigate(new Date(), "week");
    console.log(this.props.app.events);
    this.loadschedule();
  }

  handleRepeatPeriod = (rperiod) => {
    this.setState({
      rperiod,
      prdweekend: moment(this.state.weekend).add(parseInt(rperiod), "weeks")._d,
    });
  };

  handleEventColors = (event) => {
    return { className: eventColors[event.label] };
  };

  nOverLapMoveEvent = (updatedEvent) => {
    console.log(this.state.overlap);
    if (this.state.overlap === "F") {
      this.props.updateDrag(updatedEvent);
    } else {
      if (localStorage.getItem("lang") === "en") {
        alert("Duplicate schedule registration is not possible.");
      } else {
        alert("일정 중복 등록은 불가능합니다.");
      }
    }
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;
    const idx = events.indexOf(event);
    let allDay = event.allDay;
    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }
    const updatedEvent = { ...event, start, end, allDay };
    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);
    this.setState({
      events: nextEvents,
    });

    // 중복제한
    this.state.events.some((x) => {
      if (start > x.start && start < x.end && end > x.start && end < x.end) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (start < x.start && end > x.end) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(start).format("YYYY-MM-DD-HH-mm") ===
          moment(x.start).format("YYYY-MM-DD-HH-mm") &&
        start < x.end &&
        end > x.end
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(start).format("YYYY-MM-DD-HH-mm") ===
          moment(x.start).format("YYYY-MM-DD-HH-mm") &&
        start < x.end &&
        end < x.end
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        start < x.start &&
        end > x.start &&
        moment(end).format("YYYY-MM-DD-HH-mm") <=
          moment(x.end).format("YYYY-MM-DD-HH-mm")
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        start > x.start &&
        end > x.start &&
        moment(end).format("YYYY-MM-DD-HH-mm") <=
          moment(x.end).format("YYYY-MM-DD-HH-mm")
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(start).format("YYYY-MM-DD-HH-mm") ===
          moment(x.start).format("YYYY-MM-DD-HH-mm") &&
        moment(end).format("YYYY-MM-DD-HH-mm") ===
          moment(x.end).format("YYYY-MM-DD-HH-mm")
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else {
        this.setState({ overlap: "F" });
      }
    });

    setTimeout(this.nOverLapMoveEvent(updatedEvent), 500);
  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });

    this.props.updateResize({ ...event, start, end });
  };

  handleSelectEvent = (event) => {
    let filteredState = this.state.events.filter((i) => i.id === event.id);
    this.props.handleSidebar(true);
    this.props.handleSelectedEvent(filteredState[0]);
    this.setState({
      eventInfo: filteredState[0],
    });
  };

  nOverLapAddEvent = (id) => {
    if (this.state.overlap === "F") {
      this.props.addEvent({
        id,
        start: this.state.startDate,
        end: this.state.endDate,
      });
    } else {
      if (localStorage.getItem("lang") === "en") {
        alert("Duplicate schedule registration is not possible.");
      } else {
        alert("일정 중복 등록은 불가능합니다.");
      }
    }
  };

  handleAddEvent = (id) => {
    this.setState({ id: this.state.id + 1 }, console.log(this.state.events));
    this.props.handleSidebar(false);

    // 중복제한
    this.state.events.some((x) => {
      if (
        moment(this.state.startDate) > moment(x.start) &&
        moment(this.state.startDate) < moment(x.end) &&
        moment(this.state.endDate) > moment(x.start) &&
        moment(this.state.endDate) < moment(x.end)
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(this.state.startDate) < moment(x.start) &&
        moment(this.state.endDate) > moment(x.end)
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(this.state.startDate) >= moment(x.start) &&
        moment(this.state.startDate) < moment(x.end) &&
        moment(this.state.endDate) > moment(x.end)
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(this.state.startDate) < moment(x.start) &&
        moment(this.state.endDate) > moment(x.start) &&
        moment(this.state.endDate) <= moment(x.end)
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else if (
        moment(this.state.startDate) === moment(x.start) &&
        moment(this.state.endDate) === moment(x.end)
      ) {
        this.setState({ overlap: "Y" });
        return true;
      } else {
        this.setState({ overlap: "F" });
      }
    });

    setTimeout(this.nOverLapAddEvent(id), 500);
  };

  onNavigate = (date, view, action) => {
    let start, end;
    if (view === "week") {
      start = moment(date).startOf("week")._d;
      end = moment(date).endOf("week")._d;
      this.setState({ weekstart: start, weekend: end });
      if (action === "PREV" || action === "NEXT") {
        start = moment(date).startOf("week")._d;
        end = moment(date).endOf("week")._d;
        this.setState({ events: [] }, () => {
          this.setState({ weekstart: start, weekend: end }, () =>
            this.loadschedule()
          );
        });
      }
    } else {
      alert(
        "스케쥴 수정 도중 오류가 발생하였습니다. 관리자에게 문의부탁드립니다."
      );
    }
  };

  loadschedule = () => {
    this.props.fetchEvents(
      this.state.userid,
      this.state.weekstart,
      this.state.weekend,
      this.props.cipher.rsapublickey.publickey
    );
  };

  modifychedule = (e) => {
    e.preventDefault();
    this.schedulemodal();
  };

  postschedule = (e) => {
    e.preventDefault();
    this.props.mdfpostSchedules(
      this.state.userid,
      this.state.weekstart,
      this.state.auto === "true" ? this.state.prdweekend : this.state.weekend,
      this.state.holiday,
      this.state.rperiod,
      this.state.events,
      this.props.cipher.rsapublickey.publickey
    );

    if (localStorage.getItem("firstyn") === "y") {
      sessionStorage.setItem("convertModal", "true");
      history.push("/analyticsDashboard");
    } else {
      sessionStorage.setItem("convertModal", "false");
    }
  };

  // 이벤트 개별 삭제 함수
  onSelectEvent(pEvent) {
    const r = window.confirm("이 스케쥴을 삭제하시겠습니까?");
    if (r === true) {
      this.setState(
        (prevState, props) => {
          const revents = [...prevState.events];
          const idx = revents.indexOf(pEvent);
          revents.splice(idx, 1);
          this.state.events = revents;
        },
        () => this.props.deleteSchedule(this.state.events)
      );
    }
  }

  render() {
    const { events, views, sidebar } = this.state;
    const today = new Date();

    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="app-calendar position-relative"
      >
        <div
          className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
          onClick={() => {
            this.props.handleSidebar(false);
            this.props.handleSelectedEvent(null);
          }}
        ></div>
        <Card className="mb-0">
          <CardBody>
            <DragAndDropCalendar
              style={{ height: "400px", position: "relative" }}
              // formats={dayFormat}
              min={
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  8
                )
              }
              max={
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  20
                )
              }
              culture="kr"
              localizer={localizer}
              events={events}
              onEventDrop={this.moveEvent}
              onEventResize={this.resizeEvent}
              startAccessor="start"
              onNavigate={this.onNavigate}
              endAccessor="end"
              resourceAccessor="url"
              defaultView="week"
              views={views}
              dayLayoutAlgorithm="no-overlap"
              // 15분 간격 설정(기존은 30분)
              step={15}
              components={{ toolbar: Toolbar }}
              eventPropGetter={this.handleEventColors}
              popup={false}
              onSelectSlot={({ start, end }) => {
                this.setState({
                  startDate: new Date(start),
                  endDate: new Date(end),
                });
                this.handleAddEvent(this.state.id);
                console.log("---------------------", this.state.startDate);
              }}
              selectable={true}
              // 이벤트 클릭 시 함수 설정
              onSelectEvent={(event) => this.onSelectEvent(event)}
            />
            <div className="pt-1 text-right">
              <Button
                className="mr-2"
                color="primary"
                outline
                type="button"
                size="lg"
                onClick={this.clearschedule}
              >
                <FormattedMessage id="Reset" />
              </Button>
              <Button
                color="primary"
                type="button"
                size="lg"
                onClick={this.modifychedule}
              >
                <FormattedMessage id="Save" />
              </Button>
            </div>

            <Modal
              isOpen={this.state.schedulemodal}
              toggle={this.schedulemodal}
              className="modal-dialog-centered"
            >
              <ModalHeader toggle={this.schedulemodal}>
                {" "}
                <FormattedMessage id="Setting" />{" "}
              </ModalHeader>
              <ModalBody>
                <div className="text-bold-600">
                  <FormattedMessage id="repeat_caution" />
                </div>

                <FormGroup className="mt-1">
                  <div>
                    <FormattedMessage id="repeat_setting1" />
                  </div>
                  <div id="auto" className="d-inline-block mr-1">
                    <FormattedMessage id="yes2">
                      {(yes2) => (
                        <Radio
                          label={yes2}
                          defaultChecked={
                            this.state.auto === "true" ? true : false
                          }
                          name="auto"
                          value="true"
                          onChange={(e) =>
                            this.setState({ auto: e.target.value })
                          }
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="d-inline-block mr-1">
                    <FormattedMessage id="no">
                      {(no) => (
                        <Radio
                          label={no}
                          defaultChecked={
                            this.state.auto === "false" ? true : false
                          }
                          name="auto"
                          value="false"
                          onChange={(e) =>
                            this.setState({
                              auto: e.target.value,
                              rperiod: "1",
                            })
                          }
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </FormGroup>
                <FormGroup>
                  <div>
                    <FormattedMessage id="repeat_setting2" />
                  </div>
                  <ButtonGroup>
                    <button
                      disabled={this.state.auto == "true" ? false : true}
                      onClick={() => this.handleRepeatPeriod("4")}
                      className={`btn ${
                        this.state.rperiod === "4"
                          ? "btn-primary"
                          : "btn-outline-primary text-primary"
                      }`}
                    >
                      <FormattedMessage id="1개월" />
                    </button>

                    <button
                      disabled={this.state.auto == "true" ? false : true}
                      onClick={() => this.handleRepeatPeriod("8")}
                      className={`btn ${
                        this.state.rperiod === "8"
                          ? "btn-primary"
                          : "btn-outline-primary text-primary"
                      }`}
                    >
                      <FormattedMessage id="2개월" />
                    </button>

                    <button
                      disabled={this.state.auto == "true" ? false : true}
                      onClick={() => this.handleRepeatPeriod("12")}
                      className={`btn ${
                        this.state.rperiod === "12"
                          ? "btn-primary"
                          : "btn-outline-primary text-primary"
                      }`}
                    >
                      <FormattedMessage id="3개월" />
                    </button>
                  </ButtonGroup>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" outline onClick={this.schedulemodal}>
                  <FormattedMessage id="취소" />
                </Button>
                <Button
                  color="primary"
                  onClick={(this.schedulemodal, this.postschedule)}
                >
                  <FormattedMessage id="Save" />
                </Button>
              </ModalFooter>
            </Modal>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    app: state.calendar,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  fetchEvents,
  handleSidebar,
  addEvent,
  handleSelectedEvent,
  updateEvent,
  updateDrag,
  updateResize,
  clearSchedule,
  mdfpostSchedules,
  nextfetchEvents,
  deleteSchedule,
})(CalendarApp);
