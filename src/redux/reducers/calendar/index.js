const initialState = {
  events: [],
  nextevents: [],
  sidebar: false,
  selectedEvent: null,
  weekempty: "",
  nextweekempty: "",
};

const calenderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CALENDAR_FETCH_EVENTS":
      return { ...state, events: action.events };
    case "FETCH_EVENTS":
      return { ...state, events: action.events, weekempty: action.empty };
    case "NEXT_FETCH_EVENTS":
      return {
        ...state,
        nextevents: action.events,
        nextweekempty: action.empty,
      };
    case "CLEAR_EVENTS":
      return { ...state, events: action.events };
    case "DELETE_EVENTS":
      return { ...state, events: action.events };

    case "ADD_EVENT":
      state.events.push(action.event);
      console.log(action.event);
      return { ...state };

    case "UPDATE_EVENT":
      let updatedEvents = state.events.map((event) => {
        if (event.id === action.event.id) {
          return action.event;
        }
        return event;
      });
      return { ...state, events: updatedEvents };
    case "UPDATE_DRAG":
      let eventToDrag = action.event,
        extractedEvent = state.events.map((event) => {
          if (event.id === eventToDrag.id) {
            return eventToDrag;
          }
          return event;
        });
      return { ...state, events: extractedEvent };
    case "EVENT_RESIZE":
      let eventToResize = action.event,
        resizeEvent = state.events.map((event) => {
          if (event.id === eventToResize.id) {
            return eventToResize;
          }
          return event;
        });
      return { ...state, events: resizeEvent };
    case "HANDLE_SIDEBAR":
      return { ...state, sidebar: action.status };
    case "HANDLE_SELECTED_EVENT":
      return { ...state, selectedEvent: action.event };
    default:
      return state;
  }
};

export default calenderReducer;
