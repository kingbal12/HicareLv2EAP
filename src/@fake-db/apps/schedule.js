import mock from "../mock";

let data = {
  data: [
      { id: 1, start: "2025-07-28T09:00:00", end: "2025-07-28T09:30:00" },
      { id: 2, start: "2025-07-28T09:30:00", end: "2025-07-28T10:00:00" },
      { id: 3, start: "2025-07-29T13:00:00", end: "2025-07-29T13:30:00" },
      { id: 4, start: "2025-07-30T15:00:00", end: "2025-07-30T15:30:00" }
    ]
}

// GET : Calendar Events
mock.onGet("/doctor/appointment/schedules").reply(() => {
  return [200, data]
})