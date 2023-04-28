import axios from "axios";
import { history } from "../../../history";
import moment from "moment";
import AES256 from "aes-everywhere";
import { SERVER_URL, SERVER_URL2, SERVER_URL_TEST } from "../../../config";
import { encryptByPubKey, decryptByAES, AESKey } from "../auth/cipherActions";
import { FormattedMessage, injectIntl } from "react-intl";

const formatDate = (scheduleda) => {
  let formatted_date =
    scheduleda.getFullYear() +
    "-" +
    ("0" + (scheduleda.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + scheduleda.getDate()).slice(-2) +
    " " +
    ("0" + scheduleda.getHours()).slice(-2) +
    ":" +
    ("0" + scheduleda.getMinutes()).slice(-2);
  return formatted_date;
};

const utcFormatDate = (scheduleda) => {
  let utcscheduleda = moment
    .utc(scheduleda.toISOString())
    .format("YYYY-MM-DD HH:mm");
  console.log("utc:", utcscheduleda);
  return utcscheduleda;
};

const localFormDate = (scheduleda) => {
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format();
  return localscheduledate;
};

const localFormDateCal = (scheduleda) => {
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format();
  return localscheduledate;
};

const localFormDateSub = (scheduleda) => {
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format("hh:mm A");
  return localscheduledate;
};

export const fisrtFetchEvents = () => {
  return async (dispatch) => {
    await axios
      .get("/api/apps/calendar/events")
      .then((response) => {
        dispatch({ type: "FETCH_EVENTS", events: response.data });
      })
      .catch((err) => console.log(err));
  };
};

export const clearSchedule = () => {
  return (dispatch) => {
    dispatch({ type: "CLEAR_EVENTS", events: [] });
  };
};

export const deleteSchedule = (revents) => {
  return (dispatch) => {
    dispatch({ type: "DELETE_EVENTS", events: revents });
  };
};

export const calendarfetchEvents = (
  userid,
  monthstart,
  monthend,
  mdkinds,
  key
) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      start_date: monthstart,
      end_date: monthend,
      medical_kinds: mdkinds,
      page_amount: "00",
      page_num: "1",
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/appointment/appointments`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let caldata = decryptByAES(response.data.data);
        console.log("캘린더 :", caldata);
        if (response.data.status === "200") {
          let length = caldata.LIST.length;

          let appointmentsdata = new Array();
          for (let i = 0; i < length; i++) {
            let jsonObj = new Object();
            jsonObj.id = i + 1;
            jsonObj.title =
              localFormDateSub(caldata.LIST[i].APPOINT_TIME) +
              " " +
              caldata.LIST[i].L_NAME +
              caldata.LIST[i].F_NAME;
            jsonObj.start = localFormDateCal(caldata.LIST[i].APPOINT_TIME);
            jsonObj.end = localFormDateCal(caldata.LIST[i].APPOINT_TIME);

            if (caldata.LIST[i].MEDICAL_KIND === "1") {
              jsonObj.label = "info";
            } else if (caldata.LIST[i].MEDICAL_KIND === "2") {
              jsonObj.label = "success";
            } else {
              jsonObj.label = "work";
            }

            jsonObj.selectable = false;
            jsonObj = JSON.stringify(jsonObj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            appointmentsdata.push(JSON.parse(jsonObj));
          }
          console.log(appointmentsdata);
          dispatch({ type: "CALENDAR_FETCH_EVENTS", events: appointmentsdata });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const fetchEvents = (user_id, weekstart, weekend, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: user_id,
      start_date: weekstart,
      end_date: weekend,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/appointment/schedules`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        if (response.data.status === "200") {
          let schedule = decryptByAES(response.data.data);
          let schelength = schedule.length;

          let uniueschedulestart = schedule.filter((obj, index, arr) => {
            return arr.findIndex((t) => t.end === obj.start) === -1;
          });

          let uniuescheduleend = schedule.filter((obj, index, arr) => {
            return arr.findIndex((t) => t.start === obj.end) === -1;
          });

          let uniqueschedule = new Array();

          for (let i = 0; i < uniueschedulestart.length; i++) {
            let jsonObj = new Object();
            jsonObj.id = uniueschedulestart[i].id;
            jsonObj.start = localFormDate(uniueschedulestart[i].start);
            jsonObj.end = localFormDate(uniuescheduleend[i].end);
            jsonObj = JSON.stringify(jsonObj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            uniqueschedule.push(JSON.parse(jsonObj));
          }

          let weekempty;
          if (schelength === 0) {
            weekempty = "Y";
          } else {
            weekempty = "N";
          }

          dispatch({
            type: "FETCH_EVENTS",
            events: uniqueschedule,
            empty: weekempty,
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const nextfetchEvents = (user_id, weekstart, weekend, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: user_id,
      start_date: weekstart,
      end_date: weekend,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/appointment/schedules`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let nextweek = decryptByAES(response.data.data);
        let nextweekempty;
        if (nextweek.length === 0) {
          nextweekempty = "Y";
        } else {
          nextweekempty = "N";
        }

        dispatch({
          type: "NEXT_FETCH_EVENTS",
          events: nextweek,
          empty: nextweekempty,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const handleSidebar = (bool) => {
  return (dispatch) => dispatch({ type: "HANDLE_SIDEBAR", status: bool });
};

export const addEvent = (event) => {
  return (dispatch) => {
    dispatch({ type: "ADD_EVENT", event });
  };
};

export const postSchedules = (userid, holiday, rperiod, events, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  return (dispatch) => {
    let dateToObj = events.map((event) => {
      event.start = utcFormatDate(event.start);
      event.end = utcFormatDate(event.end);
      return event;
    });
    console.log(events);
    axios
      .post(`${SERVER_URL}/doctor/appointment/schedules`, {
        c_key: encryptedrsapkey,
        c_value: AES256.encrypt(
          JSON.stringify({
            user_id: userid,
            holiday_yn: holiday,
            count: rperiod,
            events: dateToObj,
          }),
          AESKey
        ),
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          alert("스케줄 설정이 저장되었습니다.\n로그인페이지로 이동합니다.");
          history.push("/");
        } else if (response.data.status === "400") {
          alert(
            "등록된 스케줄이 없습니다.\n로그인 이후 스케줄을 수정해주시기 바랍니다.\n로그인페이지로 이동합니다."
          );
          history.push("/");
        } else {
          alert(
            "스케줄 설정에 문제가 발생했습니다.\n관리자에게 문의 바랍니다."
          );
        }
      })
      .catch((err) => console.log(err));
  };
};

export const finishSchedules = (userid, holiday, rperiod, events, key) => {
  // 15분 나누기 관련 코드
  let mdfevent = [];
  let staticevent = [];
  let addid = 1000;

  events.forEach((element, index) => {
    if (element.end - element.start > 900000) {
      const startd = element.start;
      const endd = new Date(element.end);
      let loop = new Date(startd.setMinutes(startd.getMinutes() - 15));

      while (loop < endd) {
        console.log("loop : ", loop);

        let date = {
          id: addid++,
          start: loop,
          end: new Date(loop.setMinutes(loop.getMinutes() + 15)),
        };
        mdfevent.push(date);

        loop = date.end;
      }

      mdfevent.pop();
    } else {
      staticevent.push(element);
    }
  });

  mdfevent.push.apply(mdfevent, staticevent);
  events = mdfevent;
  // 만약 테스트시 안된다면 8시 되기 전 15분짜리 스케쥴을 추가 push 함수 활용
  let encryptedrsapkey = encryptByPubKey(key);
  return (dispatch) => {
    let dateToObj = events.map((event) => {
      event.start = utcFormatDate(event.start);
      event.end = utcFormatDate(event.end);
      return event;
    });
    console.log(events, "업데이트 이벤트");
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/appointment/schedules`,
        c_key: encryptedrsapkey,
        c_value: AES256.encrypt(
          JSON.stringify({
            user_id: userid,
            holiday_yn: holiday,
            count: rperiod,
            events: dateToObj,
          }),
          AESKey
        ),
        method: "POST",
      })

      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          alert("The schedule has been modified.");
          window.location.reload();
        } else if (response.data.status === "400") {
          alert(
            "수정된 스케줄 저장에 문제가 발생했습니다. 스케줄이 비어있는 주부터 설정을 시작해주세요"
          );
        } else {
          alert(
            "수정된 스케줄 저장에 문제가 발생했습니다. 관리자에게 문의 바랍니다."
          );
        }
      })
      .catch((err) => console.log(err));
  };
};

export const mdfpostSchedules = (
  userid,
  holiday,
  weekstart,
  rperiod,
  events,
  key
) => {
  // 15분 나누기 관련 코드
  let mdfevent = [];
  let staticevent = [];
  let addid = 1000;

  events.forEach((element, index) => {
    if (element.end - element.start > 900000) {
      const startd = element.start;
      const endd = new Date(element.end);
      let loop = new Date(startd.setMinutes(startd.getMinutes() - 15));

      while (loop < endd) {
        console.log("loop : ", loop);

        let date = {
          id: addid++,
          start: loop,
          end: new Date(loop.setMinutes(loop.getMinutes() + 15)),
        };
        mdfevent.push(date);

        loop = date.end;
      }

      mdfevent.pop();
    } else {
      staticevent.push(element);
    }
  });

  mdfevent.push.apply(mdfevent, staticevent);
  events = mdfevent;

  // 만약 테스트시 안된다면 8시 되기 전 15분짜리 스케쥴을 추가 push 함수 활용
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      start_date: utcFormatDate(weekstart),
      end_date: utcFormatDate(weekend),
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/appointment/schedules`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "DELETE",
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
  };
};

export const endchedules = (userid, weekstart, weekend, events, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  return (dispatch) => {
    let dateToObj = events.map((event) => {
      event.start = utcFormatDate(event.start);
      event.end = utcFormatDate(event.end);
      return event;
    });

    console.log(events, "업데이트 이벤츠");
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/appointment/schedules`,
        c_key: encryptedrsapkey,
        c_value: AES256.encrypt(
          JSON.stringify({
            user_id: userid,
            start_date: weekstart,
            end_date: weekend,
            events: dateToObj,
          }),
          AESKey
        ),
        method: "PUT",
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          // alert("스케쥴이 정상적으로 수정되었습니다.");
          alert("The schedule has been modified.");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };
};

export const updateEvent = (event) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_EVENT", event });
  };
};

export const updateDrag = (event) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_DRAG", event });
  };
};

export const updateResize = (event) => {
  return (dispatch) => {
    dispatch({ type: "EVENT_RESIZE", event });
  };
};

export const handleSelectedEvent = (event) => {
  return (dispatch) => dispatch({ type: "HANDLE_SELECTED_EVENT", event });
};
