import mock from "../mock";

let data = {
  data: [
      { id: 1, start: "2025-08-13T09:00:00", end: "2025-08-13T09:30:00" },
      { id: 2, start: "2025-08-14T09:30:00", end: "2025-08-14T10:00:00" },
      { id: 3, start: "2025-08-15T13:00:00", end: "2025-08-15T13:30:00" },
      { id: 4, start: "2025-08-16T15:00:00", end: "2025-08-16T15:30:00" }
    ]
}

// GET : Calendar Events
mock.onGet("/doctor/appointment/schedules").reply(() => {
  return [200, data]
})