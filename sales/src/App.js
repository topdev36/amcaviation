import { ThemeProvider, createTheme } from "@mui/material/styles";
import i18nInit from "i18n.jsx";
import "App.css";
import { useEffect } from "react";
import Contract from "components/Contract";
import Header from "components/Header";
import { GoogleLogin } from "react-google-login";
import TwoFactor from "components/TwoFactor";
import { gapi } from "gapi-script";
import { login, logout } from "service/BackendApi";
import { useState } from "react";
import { useCookies } from "react-cookie";

// import useAuth from "hooks/useAuth"
// import { AuthProvider } from "context/AuthContext";
const gClientId =
  "339776108293-rinl0ka6o8f89lnuqdjvp8trcalev72u.apps.googleusercontent.com";
// "339776108293-ogvu8s3rg1tlnhq76puodbjsp0ne3878.apps.googleusercontent.com";

const myTheme = createTheme({
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  const [cookies, setCookie] = useCookies(['statusLogin']);
  const [qrcode, setQRCode] = useState("");

  useEffect(() => {
    i18nInit();
    function start() {
      gapi.client.init({
        clientId: gClientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
    if(cookies.statusLogin != 2)
      setCookie("statusLogin", 0);
  }, []);

  const onFailure = (res) => {
    console.log("faile", res);
  };

  const onGoogleSuccess = async (res) => {
    let gdata = res;
    console.log("google user selected:", gdata);
    var ret = (await login(gdata.tokenId)).data;
    console.log(ret);
    if (ret.success) {
      setQRCode(ret.qrcode);
      if(ret.qrcode != "")
        setCookie("statusLogin", 3);      
      else
        setCookie("statusLogin", 1);      
    }
    // try {
    // 	let success = await login(gdata.email, 2, {
    // 		gId: res.googleId,
    // 		gAT: res.accessToken,
    // 	});
    // 	if (success) navigate("/home");
    // 	refreshTokenSetup(res);
    // } catch (e) {
    // 	console.log(e);
    // }
  };

  return (
    <ThemeProvider theme={myTheme}>
      {/* <AuthProvider> */}
      <div className="App">
        <Header></Header>
        {cookies.statusLogin == 2 ? (
          <Contract></Contract>
        ) : cookies.statusLogin == 1 || cookies.statusLogin == 3 ? (
          <TwoFactor qrCode={qrcode} set2FASuccess={() => setCookie("statusLogin", 2)} />
        ) : (
          <GoogleLogin
            clientId={gClientId}
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={onGoogleSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
            className="GOOGLE"
            scope="profile"
          />
        )}
      </div>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
