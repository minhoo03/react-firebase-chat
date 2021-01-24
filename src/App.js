import React, { useEffect } from "react";
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import ChatPage from './components/ChatPage/ChatPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'

import firebase from './firebase'

function App(props) {

let history = useHistory()

  useEffect(() => {
    // 인자 설명 -> 옵저버 : 유저의 상태를 계속 지켜봄
    firebase.auth().onAuthStateChanged(user => {
      console.log('user',user)
      if(user) {
        // 로그인이 된 상태
        history.push('/')
      } else {
        // 로그인 X
        history.push('/login')
      }
    })
  }, [])

  return (
    // history는 Router 안에서 작동 가능
    // App.js는 BrowserRouter 밖에 있었기에 index.js에서 Router로 감싸주기로 함
      <Switch>
        <Route exact path="/" component={ChatPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
  );
}
export default App;
