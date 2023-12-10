import {
  Grid,
  Box,
  Typography,
  Checkbox,
  TextField,
  Button,
  Divider,
  Fade,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getContract, requestApproveContract } from "service/BackendApi";
import domain from "common/common";

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
  const [tripDate, setTripDate] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [quote_id, setQuoteID] = useState("");
  const [isContractPayment, setIsContract] = useState(true);
  const [filename, setFileName] = useState("");

  useEffect(() => {
    getContract(params.id, cbGetContract);
  }, []);

  const onApproveAll = () => {
    requestApproveContract(params.id, name, cbRequestApproveContract);
  };

  const cbRequestApproveContract = (data) => {
    if (data.success == true) {
      setAllApproved(true);
      setName(data.signed_by);
      setTimeApproved(
        new Date(data.signed_time).toLocaleDateString("en-GB") +
          " " +
          new Date(data.signed_time).toLocaleTimeString("en-GB")
      );
    }
  };

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
      setAircraft(data.aircraft);
      setTripDate(data.date);
      setFileName(data.filename);
      setQuoteID(data.quote_id);
      if (data.aircraft === "") setIsContract(false);
      else setIsContract(true);
      if (data.signed_by !== "" && data.signed_time !== null) {
        setApproveContract(true);
        setApprovePrivacyPolicy(true);
        setApproveCancelPolicy(true);
        setAllApproved(true);
        setName(data.signed_by);
        setTimeApproved(
          new Date(data.signed_time).toLocaleDateString("en-GB") +
            " " +
            new Date(data.signed_time).toLocaleTimeString("en-GB")
        );
      }
    }
  };
  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        display: sum ? "block" : "none",
        padding: 2,
      }}
    >
      <Toaster />
      <h1>
        Welcome to {isContractPayment ? "AMC Aviation" : "Invoice"} Payment
      </h1>
      <Box>
        {isContractPayment && <h3>Trip Details</h3>}
        <Grid container>
          <Grid xs={6} textAlign="right">
            <Typography>
              {isContractPayment ? "Quote" : "Invoice"} ID:{" "}
            </Typography>
          </Grid>
          <Grid xs={6} textAlign="left" sx={{ pl: 2 }}>
            <Typography>{quote_id}</Typography>
          </Grid>
          {isContractPayment && (
            <>
              <Grid xs={6} textAlign="right">
                <Typography>Date: </Typography>
              </Grid>
              <Grid xs={6} textAlign="left" sx={{ pl: 2 }}>
                <Typography>{tripDate}</Typography>
              </Grid>
              <Grid xs={6} textAlign="right">
                <Typography>Aircraft: </Typography>
              </Grid>
              <Grid xs={6} textAlign="left" sx={{ pl: 2 }}>
                <Typography>{aircraft}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Divider sx={{ mt: 2, mb: 2 }}></Divider>
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
          <a target="_blank" href={"https://" + domain + "/" + filename}>
            {isContractPayment ? "Contract" : "Invoice"}
          </a>
        </Grid>
        {isContractPayment && (
          <Grid item xs={12}>
            <Checkbox
              disabled={allApproved}
              checked={approveCancelPolicy}
              onClick={(e) => {
                setApproveCancelPolicy(!approveCancelPolicy);
              }}
            ></Checkbox>
            <a
              target="_blank"
              href={"https://" + domain + "/cancellation_policy.pdf"}
            >
              Cancellation Policy
            </a>
          </Grid>
        )}
        <Grid item xs={12}>
          <Checkbox
            disabled={allApproved}
            checked={approvePrivacyPolicy}
            onClick={(e) => {
              setApprovePrivacyPolicy(!approvePrivacyPolicy);
            }}
          ></Checkbox>
          <a target="_blank" href={"https://" + domain + "/privacy_policy.pdf"}>
            Privacy Policy
          </a>
        </Grid>
      </Grid>
      <TextField
        disabled={allApproved}
        placeholder="Full Name"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ display: allApproved ? "none" : "initial" }}
      ></TextField>
      <Button disabled={allApproved} onClick={(e) => onApproveAll()}>
        {allApproved ? (
          "Accepted by " + name + " at " + timeApproved
        ) : (
          <Fade
            in={
              approveContract &&
              (!isContractPayment || approveCancelPolicy) &&
              approvePrivacyPolicy &&
              name != ""
            }
          >
            <Typography>Save & Proceed</Typography>
          </Fade>
        )}
      </Button>

      <Box sx={{ mt: 2, display: allApproved ? "block" : "none" }}>
        <Typography>
          {tx.length > 1
            ? "Due to online payment limits, there more than one payments are required. To pay, click one by one."
            : "To pay, click the link below."}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <img src="cards.svg"></img>
        </Box>
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
              <Grid
                item
                xs={6}
                md={6}
                sx={{ textAlign: "right", pr: 3 }}
              ></Grid>
              <Grid item xs={2} md={2} sx={{ textAlign: "left" }}>
                <Typography sx={{ color: "blue" }}>€{value}</Typography>
              </Grid>
              <Grid item xs={4} md={4} sx={{ textAlign: "left" }}>
                <a href={links[index]}>
                  {status[index] == "Completed" ? "Paid" : "Click to pay"}
                </a>
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
};
export default Main;
