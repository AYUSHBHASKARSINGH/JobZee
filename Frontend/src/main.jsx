import React, { createContext, useState } from "react";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// State management ?? :|
export const Context = createContext({isAuthorized: false});

const Appwrapper = ()=>{
  // user initially authorised nhi hoga
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});


  return(
    <Context.Provider value = {{isAuthorized, setIsAuthorized,user, setUser}} >
      <App />
    </Context.Provider>
  )

}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Appwrapper/>
  </React.StrictMode>,
)
