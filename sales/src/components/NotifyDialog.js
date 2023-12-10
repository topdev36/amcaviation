import * as React from "react";
import PropTypes from "prop-types";
import { Button, Box, Grid, Dialog, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast, { Toaster } from "react-hot-toast";

function NotifyDialog(props) {
  const { onClose, open, paylink } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box
        sx={{
          padding: 3,
          ".MuiInputBase-input": { padding: "2px 5px", textAlign: "center" },
          ".MuiGrid-container": { mt: "5px", mb: "5px" },
        }}
      >
        <Toaster />
        <Typography textAlign="center">
          Payment link generated successfully!
        </Typography>
        <Typography textAlign="center">
          Link: <a href={paylink} target="_blank">{paylink}</a>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              try {
                navigator.clipboard.writeText(paylink);
                toast("Copied!");
              } catch (e) {
                toast("Copy requires ssl");
              }
            }}
          >
            <ContentCopyIcon fontSize="small"></ContentCopyIcon>
          </Button>
        </Typography>
        <Grid container>
          <Grid item sx={{ margin: "auto" }}>
            <Button variant="outlined" onClick={() => handleClose()}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

NotifyDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NotifyDialog;
