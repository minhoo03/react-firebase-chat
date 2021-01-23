import firebase from 'firebase/app'

// firebase의 인증/DB/storage 사용
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyBsCPU-NL4ipGStwMi2W4SBe090Jih2SGA",
    authDomain: "chat-app-f1e82.firebaseapp.com",
    projectId: "chat-app-f1e82",
    storageBucket: "chat-app-f1e82.appspot.com",
    messagingSenderId: "6226487917",
    appId: "1:6226487917:web:1f53695b244fd99d6e6d64",
    measurementId: "G-0XCDHSXPQ3"
  };

// 프로젝트 이름, storage, 도메인.. 전부 사용
firebase.initializeApp(firebaseConfig);
// firebase.analytics(); 통계 보여줌

export default firebase