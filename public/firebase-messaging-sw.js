importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js");
console.log("sw.js 실행됨");

let docdata = "";

// const config = {
//   apiKey: "AIzaSyCMvdBZyG3ox-CRl3fTTYmjbag-b_C3NHM",
//   authDomain: "hicare-t.firebaseapp.com",
//   projectId: "hicare-t",
//   storageBucket: "hicare-t.appspot.com",
//   messagingSenderId: "671016231005",
//   appId: "1:671016231005:web:89dda34bf7af594f246db4",
//   measurementId: "G-0N2DEZY0E6",
// };

var config = {
  apiKey: "AIzaSyAMiyzuGLBHAk4K18Q4Bla4ljA4cfUf-oM",
  authDomain: "i4h-hicare.firebaseapp.com",
  databaseURL: "https://i4h-hicare.firebaseio.com",
  projectId: "i4h-hicare",
  storageBucket: "i4h-hicare.appspot.com",
  messagingSenderId: "575076484827",
  appId: "1:575076484827:web:b15851500503c4c2432efe",
  measurementId: "G-5H09HRTQQT",
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
// messaging.usePublicVapidKey(
//   "BB4XHw8moH2jMsi3RvCLcAGbPAETd5PvZD9__dNIXLX0HKFSDcjl8qDwIvmMF3g3cSKRhceXg4dnx20sOo81WQs"
// );
messaging.usePublicVapidKey(
  "BL0eTL3wIbAxmATwORsjQ-pNPCQBYrFNofCAr1xnArzbBjkRDreJLmiXYd-ySpazU-GTEAhtThWIhCLxYLvTGvY"
);
messaging.setBackgroundMessageHandler(function (payload) {
  const title = "Hello World";
  const options = {
    body: payload.data.status,
  };
  return self.registration.showNotification(title, options);
});

messaging.onBackgroundMessage(function (payload) {
  let strDT = payload.data["gcm.notification.doctor_id"];
  docdata = payload.data;
  messagedata = payload.data;
  console.log("백그라운드", docdata);
});
