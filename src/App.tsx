// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css'
// import "./themes/Zephyr/bootstrap.min.css"
import {Route, Routes} from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary";
import { MyErrorFallback } from "./components/MyErrorFallback";
import { PageProtokoll } from "./components/PageProtokoll";
import { PageAdmin } from "./components/PageAdmin";
import { PageEintrag } from "./components/PageEintrag";
import { PageIndex } from "./components/PageIndex";
import { PagePrefs } from "./components/PagePrefs";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Header } from "./components/Header";
import { LoginDialog } from "./components/LoginDialog";
import { useEffect, useState } from "react";
import { LoginContext, LoginInfo } from "./components/LoginContext";
import { getLogin } from "./backend/api";

function App() {

  const [loginInfo, setLoginInfo] = useState<LoginInfo | false>(false);

  useEffect(() => {
    (async() => {
      const login = await getLogin();
      setLoginInfo(login)
    })();
  }, []
  )
  
  return (
    <>
      <ErrorBoundary FallbackComponent={MyErrorFallback}>
        <LoginContext.Provider value={{loginInfo, setLoginInfo}}>
          <Header></Header>
          <Routes>
            <Route path="/" element={<PageIndex/>}></Route>
            <Route path="/protokoll/:protokollId" element={<PageProtokoll/>}></Route>
            <Route path="/eintrag/:eintragId" element={<PageEintrag/>}></Route>
            <Route path="/admin" element={<PageAdmin/>}></Route>
            <Route path="/prefs" element={<PagePrefs/>}></Route>
          </Routes>
        </LoginContext.Provider>
      </ErrorBoundary>
    </>
  );

}

export default App;
