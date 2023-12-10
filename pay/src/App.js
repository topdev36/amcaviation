import { ThemeProvider, createTheme } from "@mui/material/styles";
import { HashRouter, Routes, Route } from "react-router-dom";
import "App.css";
import { useEffect } from "react";
import Header from "components/Header";
import Main from "./components/Main";

const myTheme = createTheme({
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  useEffect(() => {}, []);

  return (
    <ThemeProvider theme={myTheme}>
      {/* <AuthProvider>
       */}
      <div className="App">
        <Header></Header>
        <HashRouter>
          <Routes>
            <Route path="/:id" element={<Main />} />
          </Routes>
        </HashRouter>
      </div>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
