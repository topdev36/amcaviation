import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { submit2FA } from "service/BackendApi";

const TwoFactor = ({ qrCode, set2FASuccess }) => {
  const [code2Fa, set2FaCode] = useState("");
  const [error2Fa, set2FaError] = useState(false);

  const onSubmitClick = async () => {
    let ret = await submit2FA(code2Fa);
    if (ret.data.success) {
      set2FASuccess();
    } else {
      set2FaError(true);
    }
  };
  useEffect(() => {
    console.log(qrCode);
  }, [qrCode]);

  return (
    <Box>
      {qrCode !== "" && (
        <Box>
          <h2>Please scan this QR code to enable 2FA</h2>
          <img src={qrCode} />
        </Box>
      )}
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <TextField
            error={error2Fa}
            helperText= {error2Fa ? "Invalid 2FA Code" : ""}
            size="small"
            placeholder="2FA Code"
            value={code2Fa}
            onChange={(e) => {
              set2FaCode(e.target.value);
              set2FaError(false);
            }}
            sx={{ input: { textAlign: "center" } }}
          ></TextField>
        </Grid>
        <Grid item xs={12} textAlign="center" sx={{ pt: 2 }}>
          <Button variant="outlined" onClick={onSubmitClick}>
            Verify
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default TwoFactor;
