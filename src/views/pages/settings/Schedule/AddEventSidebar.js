import React from "react"
import { X, Tag } from "react-feather"
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Button,
  Card, CardBody, ButtonGroup
} from "reactstrap"
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"

const eventColors = {
  business: "chip-success",
  work: "chip-warning",
  personal: "chip-danger",
  others: "chip-primary"
}
class AddEvent extends React.Component {
  state = {
    selectedDay: null,
    startDate: new Date(),
    endDate: new Date(),
    title: "",
    label: null,
    allDay: true,
    selectable: true
  }
  handleSelectDay = sday => {
    this.setState({
      sday
    })
  }

  handleDateChange = date => {
    this.setState({
      startDate: date
    })
  }

  handleEndDateChange = date => {
    this.setState({
      endDate: date
    })
  }

  handleLabelChange = label => {
    this.setState({
      label
    })
  }

  handleAddEvent = id => {
    this.props.handleSidebar(false)
    this.props.addEvent({
      id: id,
      title: this.state.title,
      start: this.state.startDate,
      end: this.state.endDate,
      label: this.state.label === null ? "others" : this.state.label,
      allDay: this.state.allDay,
      selectable: this.state.selectable
    })
    this.setState({
      startDate: new Date(),
      endDate: new Date(),
      title: "",
      label: null,
      allDay: true,
      selectable: true
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.eventInfo === null ? "" : nextProps.eventInfo.title,
      url: nextProps.eventInfo === null ? "" : nextProps.eventInfo.url,
      startDate:
        nextProps.eventInfo === null
          ? new Date()
          : new Date(nextProps.eventInfo.start),
      endDate:
        nextProps.eventInfo === null
          ? new Date()
          : new Date(nextProps.eventInfo.end),
      label: nextProps.eventInfo === null ? null : nextProps.eventInfo.label,
      allDay: nextProps.eventInfo === null ? true : nextProps.eventInfo.allDay,
      selectable:
        nextProps.eventInfo === null ? true : nextProps.eventInfo.selectable
    })
  }

  render() {
    let events = this.props.events.map(i => i.id)
    let lastId = events.pop()
    let newEventId = lastId + 1
    return (
      <div
        className={`add-event-sidebar bg-primary ${
          this.props.sidebar ? "show" : "hidden"
        }`}
      >
        <div className="header d-flex justify-content-between bg-primary">
          <h3 className="text-bold-600 mb-0 color-white">
            {this.props.eventInfo !== null &&
            this.props.eventInfo.title.length > 0
              ? "Update Schedule"
              : "Add Schedule"}
          </h3>
          <div
            className="close-icon cursor-pointer"
            onClick={() => this.props.handleSidebar(false)}
          >
            <X size={20} />
          </div>
        </div>
        <Card className="add-event-body">
          <div className="category-action d-flex justify-content-between my-50">
            <div className="event-category">
              <h5><strong>요일을 선택해주세요</strong></h5>
              <ButtonGroup size="sm">
                <button
                  onClick={() => this.handleSelectDay("monday")}
                  className={`btn ${
                    this.state.sday === "monday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  월
                </button>

                <button
                  onClick={() => this.handleSelectDay("tuesday")}
                  className={`btn ${
                    this.state.sday === "tuesday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  화
                </button>
                
                <button
                  onClick={() => this.handleSelectDay("wednesday")}
                  className={`btn ${
                    this.state.sday === "wednesday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  수
                </button>
                
                <button
                  onClick={() => this.handleSelectDay("thursday")}
                  className={`btn ${
                    this.state.sday === "thursday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  목
                </button>

                <button
                  onClick={() => this.handleSelectDay("friday")}
                  className={`btn ${
                    this.state.sday === "friday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  금
                </button>

                <button
                  onClick={() => this.handleSelectDay("saturday")}
                  className={`btn ${
                    this.state.sday === "saturday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  토
                </button>

                <button
                  onClick={() => this.handleSelectDay("sunday")}
                  className={`btn ${
                    this.state.sday === "sunday"
                      ? "btn-primary"
                      : "btn-outline-primary text-primary"
                  }`}
                >
                  일
                </button>
              </ButtonGroup>
              {/* {this.state.label !== null ? (
                <div className={`chip ${eventColors[this.state.label]}`}>
                  <div className="chip-body">
                    <div className="chip-text text-capitalize">
                      {this.state.label}
                    </div>
                  </div>
                </div>
              ) : null} */}
            </div>
            {/* <div className="category-dropdown">
              <UncontrolledDropdown>
                <DropdownToggle tag="div" className="cursor-pointer">
                  <Tag size={18} />
                </DropdownToggle>
                <DropdownMenu tag="ul" right>
                  <DropdownItem
                    tag="li"
                    onClick={() => this.handleLabelChange("business")}
                  >
                    <span className="bullet bullet-success bullet-sm mr-50"></span>
                    <span>Business</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="li"
                    onClick={() => this.handleLabelChange("work")}
                  >
                    <span className="bullet bullet-warning bullet-sm mr-50"></span>
                    <span>Work</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="li"
                    onClick={() => this.handleLabelChange("personal")}
                  >
                    <span className="bullet bullet-danger bullet-sm mr-50"></span>
                    <span>Personal</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="li"
                    onClick={() => this.handleLabelChange("others")}
                  >
                    <span className="bullet bullet-primary bullet-sm mr-50"></span>
                    <span>Others</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div> */}
          </div>
          <div className="add-event-fields mt-2">
            <FormGroup className="form-label-group">
              <Input
                type="text"
                id="EventTitle"
                placeholder="Event Title"
                value={this.state.title}
                onChange={e => this.setState({ title: e.target.value })}
              />
              <Label for="EventTitle">Event Title</Label>
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Flatpickr
                id="startDate"
                className="form-control"
                value={this.state.startDate}
                onChange={date => this.handleDateChange(date)}
                options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Flatpickr
                id="endDate"
                className="form-control"
                value={this.state.endDate}
                onChange={date => this.handleEndDateChange(date)}
                options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", }}
              />
            </FormGroup>
          </div>

          
          <div className="mt-1">
            <div>
              <strong>자동반복설정을 하시겠습니까?</strong>
            </div>
            <div className="d-inline-block mr-1">
              <Radio label="네" defaultChecked={true} name="autorepeat" />
            </div>
            <div className="d-inline-block mr-1">
              <Radio
                label="아니오"
                defaultChecked={false}
                name="autorepeat"
              />
            </div>
          </div>

          <div className="mt-1">
            <div>
              <strong>공휴일은 제외하시겠습니까?</strong>
            </div>
            <div className="d-inline-block mr-1">
              <Radio label="네" defaultChecked={true} name="holiday"/>
            </div>
            <div className="d-inline-block mr-1">
              <Radio
                label="아니오"
                defaultChecked={false}
                name="holiday"
              />
            </div>
          </div>
          
          <hr className="my-2" />
          <div className="add-event-actions text-right mb-1">
            <Button.Ripple
              disabled={this.state.title.length > 0 ? false : true}
              color="primary"
              onClick={() => {
                console.log(this.state)
                this.props.handleSidebar(false)
                if (
                  this.props.eventInfo === null ||
                  this.props.eventInfo.title.length <= 0
                )
                  this.handleAddEvent(newEventId)
                else
                  this.props.updateEvent({
                    id: this.props.eventInfo.id,
                    title: this.state.title,
                    label: this.state.label,
                    start: this.state.startDate,
                    end: this.state.endDate,
                    allDay: true,
                    selectable: true
                  })
              }}
            >
              {this.props.eventInfo !== null &&
              this.props.eventInfo.title.length > 0
                ? "Update Event"
                : "Add Event"}
            </Button.Ripple>
            <Button.Ripple
              className="ml-1"
              color="flat-danger"
              onClick={() => {
                this.props.handleSidebar(false)
                if (this.props.handleSelectedEvent)
                  this.props.handleSelectedEvent(null)
                else return null
              }}
            >
              Cancel
            </Button.Ripple>
          </div>
        </Card>
      </div>
    )
  }
}

export default AddEvent
