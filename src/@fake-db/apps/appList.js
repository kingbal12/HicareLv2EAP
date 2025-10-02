import mock from "../mock";

const stateValues = ["00", "01", "02", "03", "04", "99"];
const appStateValues = ["'PF'", "'AF'", "'VW'", "'VF'", "'TF'", "'RF'"];

function getRandomState() {
  return stateValues[Math.floor(Math.random() * stateValues.length)];
}

function getRandomAppState() {
  return appStateValues[Math.floor(Math.random() * appStateValues.length)];
}

// 시간 포맷 함수 (yyyy.MM.dd AM/PM hh:mm)
function formatTime(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${yyyy}.${mm}.${dd} ${ampm} ${hours}:${minutes}`;
}

let appointsdata = {
  COUNT_APP: 10,
  APPOINT_LIST: Array.from({ length: 10 }, (_, i) => {
    const id = (i + 1).toString().padStart(4, "0");
    const appnum = (i + 1).toString().padStart(5, "0");
    const gender = i % 2 === 0 ? "M" : "F";

    // 오늘 날짜 기준 30분 간격 시간 생성
    const baseTime = new Date();
    baseTime.setHours(9, 0, 0, 0); // 오전 9시부터 시작
    const appointTime = new Date(baseTime.getTime() + i * 30 * 60000);

    return {
      APPOINT_KIND: "2", // "1", "2"
      APPOINT_NUM: `A${appnum}`,
      MEDICAL_KIND: ((i % 3) + 1).toString(), // "1","2","3"
      APPOINT_TIME: formatTime(appointTime),
      BIRTH_DT: `19${80 + (i % 20)}-0${(i % 9) + 1}-15`,
      FIRST_YN: i % 2 === 0 ? "Y" : "N",
      L_NAME: "",
      F_NAME: gender === "M" ? `홍길동${i + 1}` : `김영희${i + 1}`,
      NOTE_DX: i % 3 === 0 ? "고혈압" : i % 3 === 1 ? "당뇨" : "건강",
      PATIENT_ID: `P${id}`,
      SYMPTOM: "기타",
      VITAL_STATE: getRandomState(),
      GENDER: gender,
      AGE: 20 + (i % 40),
      APPOINT_STATE: getRandomAppState()
    };
  })
};

// GET : Appoints
mock.onGet("/doctor/appointment/dashboard").reply((config) => {
  const { page_amount, page_num, f_name, app_states, medical_kinds } = config.params;
  const amount = Number(page_amount) || 10;
  const page = Number(page_num) || 1;

  let filteredList = appointsdata.APPOINT_LIST;

  // 이름 필터
  if (f_name && f_name.trim() !== "") {
    filteredList = filteredList.filter((p) =>
      p.F_NAME.includes(f_name.trim())
    );
  }

  // 진료 종류 필터
  if (medical_kinds && medical_kinds.trim() !== "") {
    const kinds = medical_kinds.replace(/'/g, "").split(",");
    filteredList = filteredList.filter((p) =>
      kinds.includes(p.MEDICAL_KIND)
    );
  }

  // 예약 상태 필터
  if (app_states && app_states.trim() !== "") {
    const states = app_states.replace(/'/g, "").split(",");
    filteredList = filteredList.filter((p) =>
      states.includes(p.APPOINT_STATE.replace(/'/g, ""))
    );
  }

  // 페이지네이션
  const start = (page - 1) * amount;
  const end = start + amount;
  const pageList = filteredList.slice(start, end);

  // 오늘과 이번 달 기준 카운트 계산
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const todayStr = `${yyyy}.${mm}.${dd}`;
  const monthStr = `${yyyy}.${mm}`;

  // 오늘 카운트
  const todayCount = appointsdata.APPOINT_LIST.reduce((acc, item) => {
    if (item.APPOINT_TIME.startsWith(todayStr)) {
      acc[item.MEDICAL_KIND] = (acc[item.MEDICAL_KIND] || 0) + 1;
    }
    return acc;
  }, {});

  // 이번 달 카운트
  const monthCount = appointsdata.APPOINT_LIST.reduce((acc, item) => {
    if (item.APPOINT_TIME.startsWith(monthStr)) {
      acc[item.MEDICAL_KIND] = (acc[item.MEDICAL_KIND] || 0) + 1;
    }
    return acc;
  }, {});

  const responseData = {
    COUNT_APP: filteredList.length,
    APPOINT_LIST: pageList,
    TODAY_COUNT_BY_KIND: todayCount,
    MONTH_COUNT_BY_KIND: monthCount
  };

  return [200, { data: responseData }];
});
