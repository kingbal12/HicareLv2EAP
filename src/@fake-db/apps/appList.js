import mock from "../mock";

const stateValues = ["00", "01", "02", "03", "04", "99"];
const appStateValues = ["'PF'", "'AF'", "'VW'", "'VF'", "'TF'", "'RF'"];

function getRandomState() {
  return stateValues[Math.floor(Math.random() * stateValues.length)];
}

function getRandomAppState() {
  return appStateValues[Math.floor(Math.random() * appStateValues.length)];
}

let appointsdata = {
  COUNT_APP: 10,
  APPOINT_LIST: Array.from({ length: 10 }, (_, i) => {
    const id = (i + 1).toString().padStart(4, "0");
    const appnum = (i + 1).toString().padStart(5, "0");
    const gender = i % 2 === 0 ? "M" : "F";
    return {
      APPOINT_KIND: "2", // "1", "2"
      APPOINT_NUM: `A${appnum}`,
      MEDICAL_KIND: ((i % 3) + 1).toString(), // "1","2","3"
      APPOINT_TIME: "2025.11.01 PM 3:30",
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
mock.onGet(/\/doctor\/appointment\/dashboard$/).reply((config) => {
  const { page_amount, page_num, f_name, app_states, medical_kinds } = config.params;
  const amount = Number(page_amount) || 10;
  const page = Number(page_num) || 1;

  let filteredList = appointsdata.APPOINT_LIST;

  // ✅ 이름 필터
  if (f_name && f_name.trim() !== "") {
    filteredList = filteredList.filter((p) =>
      p.F_NAME.includes(f_name.trim())
    );
  }

  // ✅ 진료 종류 필터
  if (medical_kinds && medical_kinds.trim() !== "") {
    // 여러 개 들어올 수도 있으니 split 처리
    const kinds = medical_kinds.replace(/'/g, "").split(","); // "'1','2'" → ["1","2"]
    filteredList = filteredList.filter((p) =>
      kinds.includes(p.MEDICAL_KIND)
    );
  }

  // ✅ 예약 상태 필터
  if (app_states && app_states.trim() !== "") {
    const states = app_states.replace(/'/g, "").split(","); // "'AF','PF'" → ["AF","PF"]
    filteredList = filteredList.filter((p) =>
      states.includes(p.APPOINT_STATE.replace(/'/g, ""))
    );
  }

  const start = (page - 1) * amount;
  const end = start + amount;
  const pageList = filteredList.slice(start, end);

  const responseData = {
    COUNT_APP: filteredList.length,
    APPOINT_LIST: pageList
  };

  return [200, { data: responseData }];
});
