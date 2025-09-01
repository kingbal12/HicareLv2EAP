import mock from "../mock";
import moment from "moment";

// 고정된 vital 데이터
const fixedVitalData = {
  GLUCOSE_LIST: Array.from({ length: 6 }, (_, i) => ({
    CREATE_TIME: moment().utc().add(-i, "days").format("YYYY-MM-DD HH:mm:ss"),
    GLUCOSE_VAL: 80 + i * 5, // 혈당값
  })),
  PRESSURE_LIST: Array.from({ length: 6 }, (_, i) => ({
    CREATE_TIME: moment().utc().add(-i, "days").format("YYYY-MM-DD HH:mm:ss"),
    SYS_VAL: 120 + i, // 수축기 혈압
    DIA_VAL: 80 + i,  // 이완기 혈압
    PULSE_VAL: 70 + i, // 맥박
  })),
  SPO2_LIST: Array.from({ length: 6 }, (_, i) => ({
    CREATE_TIME: moment().utc().add(-i, "days").format("YYYY-MM-DD HH:mm:ss"),
    SPO2_VAL: 95 + (i % 3), // 산소포화도
  })),
  TEMP_LIST: Array.from({ length: 6 }, (_, i) => ({
    CREATE_TIME: moment().utc().add(-i, "days").format("YYYY-MM-DD HH:mm:ss"),
    TEMP_VAL: 36.5 + i * 0.1, // 체온
  })),
  WEIGHT_LIST: Array.from({ length: 6 }, (_, i) => ({
    CREATE_TIME: moment().utc().add(-i, "days").format("YYYY-MM-DD HH:mm:ss"),
    WEIGHT_VAL: 65 + i * 0.5, // 체중
  })),
  BAND_LIST: Array.from({ length: 6 }, (_, i) => ({
    CREATE_TIME: moment().utc().add(-i, "days").format("YYYY-MM-DD HH:mm:ss"),
    STEP_COUNT: 5000 + i * 500, // 걸음 수
    CALORIE: 200 + i * 20,      // 소모 칼로리
  })),
};

// GET : Patient Vital
mock.onGet("/doctor/patient/patient-vital").reply((config) => {
  const { patient_id, start_date, end_date } = config.params || {};

  // patient_id는 무시하고 항상 같은 vital 데이터 반환
  const responseData = {
    status: "200",
    data: fixedVitalData,
  };

  return [200, responseData];
});
