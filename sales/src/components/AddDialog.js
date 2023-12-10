import * as React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Box,
  TextField,
  Grid,
  Dialog,
  FormControlLabel,
  FormLabel,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useState, useRef, useEffect } from "react";
import { uploadFile, requestPaymentLink } from "service/BackendApi";
import toast, { Toaster } from "react-hot-toast";

function AddDialog(props) {
  const { onClose, open, isExist, isContractAdd, orderID } = props;
  const [creation, setCreation] = useState("");
  const [date, setDate] = useState("");
  const [quote_id, setQuoteID] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [sum, setSum] = useState("");
  const [email, setEmail] = useState("");
  const [arrTx, setTx] = useState([]);
  const [sumTx, setTxSum] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const inputFile = useRef(null);

  useEffect(() => {
    setQuoteID(orderID.toString());
    setSum("");
    setTxSum(0);
    setEmail("");
    setDate("");
    setAircraft("");
    setNewFileName("");
    if (!isContractAdd) {
      var timeNow =
        new Date().toLocaleDateString("en-GB") +
        " " +
        new Date().toLocaleTimeString("en-GB");
      setCreation(timeNow);
    } else setCreation("");
    setTx([]);
  }, [orderID]);
  function handleFileChange(event) {
    if (event.target.files[0] != undefined) {
      setIsLoading(true);
      uploadFile(event.target.files[0], isContractAdd, cbUpload);
    }
  }

  const cbUpload = (resp) => {
    setIsLoading(false);
    if (!resp) {
      toast("Upload failed! Only .pdf file is allowed.");
      return;
    }

    if (isContractAdd) {
      var data = resp.data;
      if (isExist(data.quote_id)) {
        toast("Existing contract.");
        return;
      }
      setAircraft(data.aircraft);
      setSum(Number(data.sum));
      setDate(data.date);
      setQuoteID(data.quote_id);
      setEmail(data.email);
      setTx([Number(data.sum) > 20000 ? 20000 : Number(data.sum)]);
      setTxSum(Number(data.sum) > 20000 ? 20000 : Number(data.sum));
      setCreation(data.creation);
    }
    setNewFileName(resp.newFileName);
  };

  const handleClose = () => {
    onClose(null);
  };

  const onUploadClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const addTx = () => {
    let newArrTx = [];
    let newTx = Number((sum - sumTx).toFixed(5));
    if (newTx > 20000) newTx = 20000;
    newArrTx = newArrTx.concat(arrTx, newTx);
    setTxSum(sumTx + newTx);
    setTx(newArrTx);
  };

  const removeTx = (index) => {
    let newArrTx = [];
    // if(index == arrTx.length - 1)
    //     newArrTx = newArrTx.concat(arrTx.slice(0, arrTx.length - 2));
    // else
    setTxSum(sumTx - arrTx[index]);
    newArrTx = newArrTx.concat(arrTx.slice(0, index), arrTx.slice(index + 1));
    setTx(newArrTx);
  };

  const onTxValueChanged = (e, index) => {
    if (isNaN(e.target.value)) return;
    let newArrTx = [...arrTx];
    let tmpSum = 0;
    let value = e.target.value;
    if (Number(value) < 0) return;
    if (Number(value) > 20000) value = 20000;
    newArrTx[index] = value;
    newArrTx.forEach((num) => {
      tmpSum += Number(num);
    });
    if (sum <= tmpSum) {
      newArrTx[index] -= tmpSum - sum;
      newArrTx[index] = Number(newArrTx[index].toFixed(5));
      tmpSum = sum;
    }
    setTxSum(tmpSum);
    setTx(newArrTx);
  };

  const infoChanged = (e, idx) => {
    if (idx == "quote_id") {
      if (e.target.value.match(/[^a-zA-Z-0-9]+/) != null) {
        toast("Only alphanumberic and dash can be entered.");
      }
      setQuoteID(e.target.value.replace(/[^a-zA-Z-0-9]+/, ""));
    }
    if (idx == "date") setDate(e.target.value);
    if (idx == "aircraft") setAircraft(e.target.value);
    if (idx == "sum") {
      if (isNaN(e.target.value)) return;
      let val = e.target.value;
      if (Number(val) < 0) return;
      setSum(val);
      if (Number(val) > 20000) val = 20000;
      setTx([val]);
      setTxSum(val);
    }
    if (idx == "email") setEmail(e.target.value);
  };

  const onGenerateLink = () => {
    let params = {
      quote_id: quote_id,
      creation: creation,
      date: date,
      aircraft: aircraft,
      sum: sum,
      txs: arrTx,
      file: newFileName,
      email: email,
    };

    setIsLoading(true);
    requestPaymentLink(params, cbGenerate);
  };

  const cbGenerate = (resp) => {
    setIsLoading(false);
    if (!resp) {
      toast("Pay link can be generated only once.");
      return;
    }
    var ret = {
      success: true,
      link: resp,
      creation: creation,
      date: date,
      quote_id: quote_id,
      aircraft: aircraft,
      sum: sum,
      arrTx: arrTx,
      status: new Array(arrTx.length).fill("Pending"),
    };
    onClose(ret);
    setSum("");
    setTxSum(0);
    setEmail("");
    setDate("");
    setAircraft("");
    setQuoteID("");
    setNewFileName("");
    setCreation("");
    setTx([]);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          padding: 3,
          ".MuiInputBase-input": { padding: "2px 5px", textAlign: "center" },
          ".MuiGrid-container": { mt: "5px", mb: "5px" },
        }}
      >
        <Toaster />
        <Grid container>
          <Grid item sx={{ margin: "auto" }}>
            <Button variant="outlined" onClick={() => onUploadClick()}>
              Upload {isContractAdd ? "contract" : "invoice"}
            </Button>
          </Grid>
        </Grid>
        {isContractAdd && (
          <Grid container>
            <Grid item xs={3}>
              <FormLabel>Date</FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                size="small"
                value={date}
                onChange={(e) => infoChanged(e, "date")}
              ></TextField>
            </Grid>
          </Grid>
        )}
        <Grid container>
          <Grid item xs={3}>
            <FormLabel>{isContractAdd ? "Quote" : "Invoice"} ID</FormLabel>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size="small"
              value={quote_id}
              onChange={(e) => infoChanged(e, "quote_id")}
            ></TextField>
          </Grid>
        </Grid>
        {isContractAdd && (
          <Grid container>
            <Grid item xs={3}>
              <FormLabel>Aircraft</FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                size="small"
                value={aircraft}
                onChange={(e) => infoChanged(e, "aircraft")}
              ></TextField>
            </Grid>
          </Grid>
        )}
        <Grid container>
          <Grid item xs={3}>
            <FormLabel>Sum</FormLabel>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size="small"
              value={sum}
              onChange={(e) => infoChanged(e, "sum")}
            ></TextField>
          </Grid>
        </Grid>
        {isContractAdd && (
          <Grid container>
            <Grid item xs={3}>
              <FormLabel>Recipient Email</FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                size="small"
                value={email}
                onChange={(e) => infoChanged(e, "email")}
              ></TextField>
            </Grid>
          </Grid>
        )}
        {isContractAdd && (
          <Grid container>
            <Grid item xs={3}>
              <FormLabel>Payment</FormLabel>
            </Grid>
          </Grid>
        )}
        {isContractAdd &&
          arrTx.map((amount, index) => {
            return (
              <Grid container key={"txs_" + index}>
                <Grid item xs={7} sx={{ ml: "auto" }}>
                  <TextField
                    size="small"
                    value={amount}
                    onChange={(e) => onTxValueChanged(e, index)}
                    disabled={!isContractAdd}
                  ></TextField>
                </Grid>
                {index == arrTx.length - 1 ? (
                  <Grid
                    item
                    xs={2}
                    sx={{
                      ".MuiButtonBase-root": { padding: "0px !important" },
                    }}
                  >
                    {isContractAdd && (
                      <Button
                        onClick={() => addTx()}
                        disabled={sum <= sumTx || arrTx.length == 5}
                        sx={{ color: "blue" }}
                      >
                        <AddCircleOutlineIcon></AddCircleOutlineIcon>
                      </Button>
                    )}
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={2}
                    sx={{
                      ".MuiButtonBase-root": { padding: "0px !important" },
                    }}
                  >
                    <Button
                      onClick={() => removeTx(index)}
                      sx={{ color: "blue" }}
                    >
                      <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
                    </Button>
                  </Grid>
                )}
              </Grid>
            );
          })}

        <Divider></Divider>
        <Grid container>
          <Grid item sx={{ margin: "auto" }}>
            <Button
              variant="contained"
              disabled={sum != sumTx || sum == 0}
              onClick={() => onGenerateLink()}
            >
              Generate payment link
            </Button>
          </Grid>
        </Grid>
        <input
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    </Dialog>
  );
}

AddDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default AddDialog;
