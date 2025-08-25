import mock from "../mock";

const stateValues = ["00", "01", "02", "03", "04", "05", "99"];

function getRandomState() {
  return stateValues[Math.floor(Math.random() * stateValues.length)];
}

let patientsdata = {
  COUNT: 20,
  PATIENT_LIST: Array.from({ length: 20 }, (_, i) => {
    const id = (i + 1).toString().padStart(4, "0"); // 0001, 0002 ...
    const gender = i % 2 === 0 ? "M" : "F";
    return {
      PATIENT_ID: `P${id}`,
      F_NAME: gender === "M" ? `홍길동${i + 1}` : `김영희${i + 1}`,
      GENDER: gender,
      AGE: 20 + (i % 40), // 20~59세
      BIRTH_DT: `19${80 + (i % 20)}-0${(i % 9) + 1}-15`, // 1980~1999년
      NOTE_DX: i % 3 === 0 ? "고혈압" : i % 3 === 1 ? "당뇨" : "건강",
      FIRST_YN: i % 2 === 0 ? "Y" : "N",

      "1_STATE": "01",
      "2_STATE": "01",
      "3_STATE": "01",
      "4_STATE": "01",
      "5_STATE": "01",
      "6_STATE": "01"
    };
  })
};

// GET : Patients
mock.onGet("/doctor/patient/patients").reply((config) => {
  const { page_amount, page_num, f_name } = config.params;
  const amount = Number(page_amount) || 10;
  const page = Number(page_num) || 1;

  // name
  let filteredList = patientsdata.PATIENT_LIST;
  if (f_name && f_name.trim() !== "") {
    filteredList = filteredList.filter((p) =>
      p.F_NAME.includes(f_name.trim())
    );
  }

  const start = (page - 1) * amount;
  const end = start + amount;
  const pageList = filteredList.slice(start, end);

  const responseData = {
    COUNT: filteredList.length,
    PATIENT_LIST: pageList
  };

  return [200, { data: responseData }];
});
