import { ThemeProvider, createTheme } from "@mui/material/styles";
import i18nInit from "i18n.jsx";
import "App.css";
import { useEffect } from "react";
import Contract from "components/Contract";
import Header from "components/Header";
import { GoogleLogin } from "react-google-login";
// import useAuth from "hooks/useAuth"
// import { AuthProvider } from "context/AuthContext";
const gClientId =
  "707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com";

const myTheme = createTheme({
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  const isAuthenticated = true;

  useEffect(() => {
    i18nInit();
  }, []);

  const onFailure = (res) => {};

  const onGoogleSuccess = async (res) => {
    let gdata = res.profileObj;
    console.log("google user selected:", gdata);

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
        {isAuthenticated ? (
          <Contract></Contract>
        ) : (
          <GoogleLogin
            clientId={gClientId}
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={onGoogleSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
            className="GOOGLE"
          />
        )}
      </div>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
