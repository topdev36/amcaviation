import {
  Grid,
  Box,
  Typography,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getContract, requestApproveContract } from "service/BackendApi";

const Main = () => {
  const params = useParams();
  const [approveContract, setApproveContract] = useState(false);
  const [approveCancelPolicy, setApproveCancelPolicy] = useState(false);
  const [approvePrivacyPolicy, setApprovePrivacyPolicy] = useState(false);
  const [name, setName] = useState("");
  const [timeApproved, setTimeApproved] = useState("");
  const [allApproved, setAllApproved] = useState(false);
  const [sum, setSum] = useState(0);
  const [tx, setTx] = useState([]);
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    getContract(params.id, cbGetContract);
  }, []);

  const onApproveAll = () => {
    if (name !== "") {
      requestApproveContract(params.id, name, cbRequestApproveContract);
    }
    else toast("Please type your name");
  };

  const cbRequestApproveContract = (data) => {
    if(data.success == true){
      setAllApproved(true);
      setName(data.signed_by);
      setTimeApproved((new Date(data.signed_time)).toLocaleDateString() + " " + (new Date(data.signed_time)).toLocaleTimeString());
    }
  }

  const cbGetContract = (data) => {
    if (data) {
      let amounts = [],
        status = [],
        links = [];
      data.txs.map((tx, index) => {
        amounts.push(tx.amount);
        status.push(tx.status);
        links.push(tx.link);
        return 0;
      });
      setTx(amounts);
      setLinks(links);
      setStatus(status);
      setSum(data.sum);
      if(data.signed_by !== "" && data.signed_time !== null){
        setApproveContract(true);
        setApprovePrivacyPolicy(true);
        setApproveCancelPolicy(true);
        setAllApproved(true);
        setName(data.signed_by);
        setTimeApproved((new Date(data.signed_time)).toLocaleDateString() + " " + (new Date(data.signed_time)).toLocaleTimeString());
      }
    }
  };
  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        display: sum ? "block" : "none",
        padding: 2
      }}
    >
      <Toaster />
      <h1>Welcome to AMC Aviation Payment</h1>
      <Typography>
        I hereby denote that I received, read and acknowledge
      </Typography>
      <Grid
        container
        textAlign={"left"}
        sx={{ maxWidth: "50%", margin: "auto" }}
      >
        <Grid item xs={12}>
          <Checkbox
            disabled={allApproved}
            checked={approveContract}
            onClick={(e) => {
              setApproveContract(!approveContract);
            }}
          ></Checkbox>
          Contract
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            disabled={allApproved}
            checked={approveCancelPolicy}
            onClick={(e) => {
              setApproveCancelPolicy(!approveCancelPolicy);
            }}
          ></Checkbox>
          Cancellation Policy
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            disabled={allApproved}
            checked={approvePrivacyPolicy}
            onClick={(e) => {
              setApprovePrivacyPolicy(!approvePrivacyPolicy);
            }}
          ></Checkbox>
          Privacy Policy
        </Grid>
      </Grid>
      <TextField
        disabled={allApproved}
        placeholder="Full Name"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{display: allApproved ? "none" : "initial"}}
      ></TextField>
      <Button
        disabled={allApproved}
        onClick={(e) => onApproveAll()}
        sx={{
          visibility:
            approveContract && approveCancelPolicy && approvePrivacyPolicy
              ? "visible"
              : "hidden",
        }}
      >
        {allApproved ? "Accepted by " + name + " at " + timeApproved : "Save & Proceed"}
      </Button>

      <Box sx={{ mt: 2, display: allApproved ? "block" : "none" }}>
        <Typography>
          {tx.length > 1 ? "Due to online payment limits, there more than one payments are required. To pay, click one by one." : "To pay, click the link below."}
        </Typography>
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={6} md={6} sx={{ textAlign: "right", pr: 3 }}>
            Total pay amount:
          </Grid>
          <Grid item xs={2} md={2} sx={{ textAlign: "left", mr: "auto" }}>
            <Typography sx={{ color: "blue" }}>€{sum}</Typography>
          </Grid>
        </Grid>
        {tx.map((value, index) => {
          return (
            <Grid container>
              <Grid item xs={6} md={6} sx={{ textAlign: "right", pr: 3 }}>
                Pay
              </Grid>
              <Grid item xs={2} md={2} sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "blue" }}>€{value}</Typography>
              </Grid>
              <Grid item xs={4} md={4} sx={{ textAlign: "left" }}>
                {status[index] == "Completed" ? (
                  "Paid"
                ) : (
                  <a href={links[index]} target="_blank">[Link{index + 1}]</a>
                )}
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
};
export default Main;
