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
import { Header } from "./components/Header";
import { LoginDialog } from "./components/LoginDialog";
import { useEffect, useState } from "react";
import { LoginContext, LoginInfo } from "./components/LoginContext";
import { getLogin } from "./backend/api";
import { CreateProtokoll } from "./components/CreateProtokoll";
import { CreateEintrag } from "./components/CreateEintrag";

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
            <Route path="/protokoll/neu" element={<CreateProtokoll/>}></Route>
            <Route path="/protokoll/:protokollId/eintrag/neu" element={<CreateEintrag/>}></Route>
          </Routes>
        </LoginContext.Provider>
      </ErrorBoundary>
    </>
  );

}

export default App;
