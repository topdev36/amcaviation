import { Button, Grid } from "@mui/material";
import {logout} from "service/BackendApi";

const Header = ({onLogout, isLoggedIn}) => {
	const onClickLogout = async () => {
		let ret = await logout();
		if(ret.data.success){
			onLogout();
		}
	}
	return (
		<Grid container>
            <Grid item sx={{textAlign: "left", pt: "10px"}}>
                <img src="logo.png" alt="Logo" height="65px"></img>
            </Grid>     
			{isLoggedIn && <Button onClick={onClickLogout} variant="outlined" size="small" sx={{m: "32px 0px 0px auto", height: "30px"}}>Log out</Button>}
		</Grid>
	);
};
export default Header;
