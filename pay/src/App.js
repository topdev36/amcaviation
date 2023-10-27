import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "App.css";
import { useEffect } from "react";
import Header from "components/Header";
import Main from "./components/Main";
import Payment from "./components/Payment";

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
        <BrowserRouter>
          <Routes>
            <Route path="/:id" element={<Main />} />
            <Route path="/:id/:txid" element={<Payment />} />
          </Routes>
        </BrowserRouter>
      </div>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
