import mock from "../mock";

let patientsdata = {
  COUNT: 20,
  PATIENT_LIST: Array.from({ length: 20 }, (_, i) => {
    const id = (i + 1).toString().padStart(4, "0"); // 0001, 0002 ...
    const gender = i % 2 === 0 ? "M" : "F";
    return {
      PATIENT_ID: `P${id}`,
      F_NAME: gender === "M" ? `홍길동${i+1}` : `김영희${i+1}`,
      GENDER: gender,
      AGE: 20 + (i % 40), // 20~59세
      BIRTH_DT: `19${80 + (i % 20)}-0${(i % 9) + 1}-15`, // 1980~1999년
      NOTE_DX: i % 3 === 0 ? "고혈압" : i % 3 === 1 ? "당뇨" : "건강",
      FIRST_YN: i % 2 === 0 ? "Y" : "N",
      "1_STATE": `${110 + (i % 10)}/${70 + (i % 5)}`, // BP
      "2_STATE": 60 + (i % 20), // Pulse
      "3_STATE": 36 + ((i % 5) * 0.1), // Temp
      "4_STATE": 90 + (i % 15), // Blood sugar
      "5_STATE": 95 + (i % 5), // SpO2
      "6_STATE": 50 + (i % 20) // Body weight
    };
  })
};

// GET : Patients
mock.onGet("/doctor/patient/patients").reply((config) => {
  // 실제 서버처럼 params 읽기
  const { page_amount, page_num } = config.params;
  const amount = Number(page_amount) || 10;
  const page = Number(page_num) || 1;

  // 페이징 처리
  const start = (page - 1) * amount;
  const end = start + amount;
  const pageList = patientsdata.PATIENT_LIST.slice(start, end);

  const responseData = {
    COUNT: patientsdata.COUNT,
    PATIENT_LIST: pageList
  };

  return [200, { data: responseData }];
});