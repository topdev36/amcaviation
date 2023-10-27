import { Grid } from "@mui/material";

const Header = () => {
	return (
		<Grid container>
            <Grid item sx={{textAlign: "left", pt: "10px"}}>
                <img src="logo.png" alt="Logo" height="65px"></img>
            </Grid>            
		</Grid>
	);
};
export default Header;
