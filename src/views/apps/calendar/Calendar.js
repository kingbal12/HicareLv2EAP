import React from "react";
import { Card, CardBody, ButtonGroup, Row } from "reactstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { connect } from "react-redux";
import {
  calendarfetchEvents,
  handleSidebar,
  addEvent,
  handleSelectedEvent,
  updateEvent,
  updateDrag,
  updateResize,
  clearSchedule,
} from "../../../redux/actions/calendar/index";
import { ChevronLeft, ChevronRight, Check } from "react-feather";
import Calimg from "../../../assets/img/schedule/calendar.png";

import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "../../../assets/scss/plugins/calendars/react-big-calendar.scss";
import "../../../assets/scss/plugins/calendars/react-big-calendar.css";
import { Fragment } from "react";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { history } from "../../../history";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const eventColors = {
  // work: "bg-warning",
  cancellation: "cancellation",
  second: "second",
  collaboration: "collaboration",
  normal: "normal",
};

class Toolbar extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="calendar-header justify-content-between mb-2 d-flex flex-wrap">
          {/* <div>
            <AddEventButton />
          </div> */}
          <div
            className="month-label d-flex flex-column text-center text-md-right"
            style={{ paddingTop: "5px" }}
          >
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
            {/* <div className="event-tags d-none d-sm-flex justify-content-end mt-1">
              <div className="tag mr-1">
                <span className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Business</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-warning bullet-sm mr-50"></span>
                <span>Work</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-danger bullet-sm mr-50"></span>
                <span>Personal</span>
              </div>
              <div className="tag">
                <span className="bullet bullet-primary bullet-sm mr-50"></span>
                <span>Others</span>
              </div>
            </div> */}
          </div>
          <div className="text-center view-options mt-1 mt-sm-0 ml-lg-5 ml-0">
            <ButtonGroup>
              <button
                className={`btn ${
                  this.props.view === "day"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                  this.props.onNavigate("TODAY");
                }}
              >
                Today
              </button>
            </ButtonGroup>

            <ButtonGroup className="ml-5">
              <button
                className={`btn ${
                  this.props.view === "month"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                  this.props.onView("month");
                }}
              >
                Month
              </button>

              <button
                className={`btn ${
                  this.props.view === "week"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                  this.props.onView("week");
                }}
              >
                Week
              </button>
            </ButtonGroup>
          </div>

          <div>
            <button
              type="button"
              style={{
                verticalAlign: "middle",
                height: "44px",
                width: "114px",
                borderRadius: "6px",
                border:
                  "1px solid var(--n-text-disabled-placeholder-muted, #C7D1DA)",
                background: "var(--white-tone, #FFFEFE)",
              }}
              // color="primary"
              onClick={() => history.push("/pages/modifyschedule")}
            >
              <img
                src={Calimg}
                alt=""
                width={16}
                height={16}
                style={{ marginRight: "8px", marginBottom: "1px" }}
              />
              Schedule
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

class CalendarApp extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.app.events.length !== state.events ||
      props.app.sidebar !== state.sidebar ||
      props.app.selectedEvent !== state.eventInfo
    ) {
      let dateToObj = props.app.events.map((event) => {
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
      monthstart: "",
      monthend: "",
      events: [],
      views: {
        month: true,
        week: true,
        day: true,
      },
      eventInfo: null,
      string1: true,
      string2: true,
      string3: true,
      medicalkinds: "'1','2','3'",
    };
  }

  async componentDidMount() {
    await this.onNavigate(new Date(), "month");
    await this.props.calendarfetchEvents(
      this.state.userid,
      this.state.monthstart,
      this.state.monthend,
      this.state.medicalkinds,
      this.props.cipher.rsapublickey.publickey
    );
  }

  handleEventColors = (event) => {
    return { className: eventColors[event.label] };
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
    this.props.updateDrag(updatedEvent);
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

  onNavigate = (date, view, action) => {
    console.log(this.state.events);
    let start, end;
    if (view === "month") {
      console.log(this.state.events);
      start = moment.utc(date).startOf("month")._d;
      end = moment.utc(date).endOf("month")._d;
      this.setState({ monthstart: start, monthend: end });
      if (action === "PREV" || action === "NEXT" || action === "TODAY") {
        start = moment.utc(date).startOf("month")._d;
        end = moment.utc(date).endOf("month")._d;
        this.setState({ monthstart: start, monthend: end }, () => {
          this.props.calendarfetchEvents(
            this.state.userid,
            this.state.monthstart,
            this.state.monthend,
            this.state.medicalkinds,
            this.props.cipher.rsapublickey.publickey
          );
        });
      }
    } else {
      console.log(this.state.events);
      start = moment.utc(date).startOf("month")._d;
      end = moment.utc(date).endOf("month")._d;
      this.setState({ monthstart: start, monthend: end });
      if (action === "PREV" || action === "NEXT" || action === "TODAY") {
        start = moment.utc(date).startOf("month")._d;
        end = moment.utc(date).endOf("month")._d;
        this.setState({ monthstart: start, monthend: end }, () => {
          this.props.calendarfetchEvents(
            this.state.userid,
            this.state.monthstart,
            this.state.monthend,
            this.state.medicalkinds,
            this.props.cipher.rsapublickey.publickey
          );
        });
      }
    }
  };

  makeString1 = () => {
    let selectedpage = { selected: 0 };
    this.setState(
      (prevState) => ({
        string1: !prevState.string1,
      }),
      () => {
        if (
          this.state.string1 === true &&
          this.state.string2 === false &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'1'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === false &&
          this.state.string3 === false
        ) {
          this.props.clearSchedule();
        } else if (
          this.state.string1 === false &&
          this.state.string2 === true &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'2'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === false &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === true &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'1','2'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === false &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'1','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === true &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'1','2','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === true &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'2','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        }
      }
    );
  };

  makeString2 = () => {
    let selectedpage = { selected: 0 };
    this.setState(
      (prevState) => ({
        string2: !prevState.string2,
      }),
      () => {
        if (
          this.state.string1 === true &&
          this.state.string2 === false &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'1'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === false &&
          this.state.string3 === false
        ) {
          this.props.clearSchedule();
        } else if (
          this.state.string1 === false &&
          this.state.string2 === true &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'2'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === false &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === true &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'1','2'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === false &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'1','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === true &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'1','2','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === true &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'2','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        }
      }
    );
  };

  makeString3 = () => {
    let selectedpage = { selected: 0 };
    this.setState(
      (prevState) => ({
        string3: !prevState.string3,
      }),
      () => {
        if (
          this.state.string1 === true &&
          this.state.string2 === false &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'1'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === false &&
          this.state.string3 === false
        ) {
          this.props.clearSchedule();
        } else if (
          this.state.string1 === false &&
          this.state.string2 === true &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'2'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === false &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === true &&
          this.state.string3 === false
        ) {
          this.setState({ medicalkinds: "'1','2'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === false &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'1','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === true &&
          this.state.string2 === true &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'1','2','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        } else if (
          this.state.string1 === false &&
          this.state.string2 === true &&
          this.state.string3 === true
        ) {
          this.setState({ medicalkinds: "'2','3'" }, () => {
            this.props.calendarfetchEvents(
              this.state.userid,
              this.state.monthstart,
              this.state.monthend,
              this.state.medicalkinds,
              this.props.cipher.rsapublickey.publickey
            );
          });
        }
      }
    );
  };

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
        <Card className="shadow-none">
          <CardBody className="p-0">
            <Row>
              <div className="col-2">
                <div
                  className="text-bold-600"
                  style={{
                    marginTop: "26px",
                    marginBottom: "32px",
                  }}
                >
                  원격상담 서비스
                </div>
                <Checkbox
                  color="info"
                  icon={<Check className="vx-icon" size={16} />}
                  defaultChecked={this.state.string1}
                  label={"일반진료"}
                  value="1"
                  onChange={this.makeString1}
                />
                <Checkbox
                  className="mt-1"
                  color="success"
                  icon={<Check className="vx-icon" size={16} />}
                  defaultChecked={this.state.string2}
                  label={"원격상담 & 로컬 진료"}
                  value="2"
                  onChange={this.makeString2}
                />
                <Checkbox
                  className="mt-1"
                  color="warning"
                  icon={<Check className="vx-icon" size={16} />}
                  defaultChecked={this.state.string3}
                  label={"Second Opinion"}
                  value="3"
                  onChange={this.makeString3}
                />
                {/* <div className="mt-5 cancellation">
                  취소된 예약의 경우 붉은색으로 표시됩니다.
                </div> */}
              </div>
              <DragAndDropCalendar
                className="col-10 p-1"
                // formats={formats}
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
                localizer={localizer}
                events={events}
                onEventDrop={this.moveEvent}
                onEventResize={this.resizeEvent}
                timeslots={4}
                step={15}
                dayLayoutAlgorithm="no-overlap"
                onNavigate={this.onNavigate}
                startAccessor="start"
                endAccessor="end"
                resourceAccessor="url"
                // startAccessor={this.getEventDate}
                views={views}
                draggableAccessor={(event) => false}
                components={{
                  toolbar: Toolbar,
                  //   ,week: {
                  //   header: ({ date, localizer }) => localizer.format(date, 'dddd')
                  // }
                }}
                eventPropGetter={this.handleEventColors}
                popup={true}
                // onSelectEvent={event => {
                //   this.handleSelectEvent(event)
                // }}
                onSelectSlot={({ start, end }) => {
                  this.props.handleSidebar(true);
                  this.props.handleSelectedEvent({
                    title: "",
                    label: null,
                    start: new Date(start),
                    end: new Date(end),
                    url: "",
                  });
                }}
                selectable={false}
              />
            </Row>
          </CardBody>
        </Card>
        {/* <AddEventSidebar
          sidebar={sidebar}
          handleSidebar={this.props.handleSidebar}
          addEvent={this.props.addEvent}
          events={this.state.events}
          eventInfo={this.state.eventInfo}
          selectedEvent={this.props.handleSelectedEvent}
          updateEvent={this.props.updateEvent}
          resizable
        /> */}
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
  calendarfetchEvents,
  handleSidebar,
  addEvent,
  handleSelectedEvent,
  updateEvent,
  updateDrag,
  updateResize,
  clearSchedule,
})(CalendarApp);
