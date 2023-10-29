import { ThemeProvider, createTheme } from "@mui/material/styles";
import i18nInit from "i18n.jsx";
import "App.css";
import { useEffect } from "react";
import Contract from "components/Contract";
import Header from "components/Header";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
// import useAuth from "hooks/useAuth"
// import { AuthProvider } from "context/AuthContext";
const gClientId =
  //   "339776108293-rinl0ka6o8f89lnuqdjvp8trcalev72u.apps.googleusercontent.com";
  "339776108293-ogvu8s3rg1tlnhq76puodbjsp0ne3878.apps.googleusercontent.com";

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
    function start() {
      gapi.client.init({
        clientId: gClientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const onFailure = (res) => {
    console.log("faile", res);
  };

  const onGoogleSuccess = async (res) => {
    let gdata = res;
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
            scope="profile"
          />
        )}
      </div>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
