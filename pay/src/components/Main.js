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
import ContactDialog from "./ContactDialog";

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
    const [fContactDlgOpen, setContactDlgOpen] = useState(false);

    useEffect(() => {
        getContract(params.id, cbGetContract);
    }, []);

    const onApproveAll = () => {
        requestApproveContract(params.id, name, cbRequestApproveContract);
    };

    const handleContactDlgClose = () => {
        setContactDlgOpen(false);
    };

    const handleContactDlgOpen = (e) => {
        e.preventDefault();
        setContactDlgOpen(true);
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
            {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img src="logo.png" alt="Logo" height="60px" />
                <Typography
                    sx={{
                        ml: "30px",
                        my: "auto",
                        fontWeight: "600",
                        fontSize: "20px",
                    }}
                >
                    Welcome to {isContractPayment ? "AMC Aviation" : "Invoice"}{" "}
                    Payment
                </Typography>
            </Box> */}

            <Box>
                <Box sx={{ display: "inline-block", mt: 2}}>
                    <img src="logo.png" alt="Logo" height="60px" style={{verticalAlign: "middle"}} />
                </Box>
                <Box sx={{ display: "inline-block", mt: 2}}>
                    <Typography
                        sx={{
                            ml: "30px",
                            my: "auto",
                            fontWeight: "600",
                            fontSize: "20px",
                        }}
                    >
                        Welcome to{" "}
                        {isContractPayment ? "AMC Aviation" : "Invoice"} Payment
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
                {isContractPayment && (
                    <h3
                        style={{
                            border: "1px #d29266 solid",
                            borderRadius: "6px",
                            padding: "4px",
                            color: "#79103b",
                            fontWeight: "600",
                        }}
                    >
                        Trip details
                    </h3>
                )}
                <Grid
                    container
                    sx={{ color: "#d29266", fontSize: "1.17em", mt: 4 }}
                >
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
                            {/* <Grid xs={6} textAlign="right">
                                <Typography>Date: </Typography>
                            </Grid>
                            <Grid xs={6} textAlign="left" sx={{ pl: 2 }}>
                                <Typography>{tripDate}</Typography>
                            </Grid> */}
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
            <h3
                style={{
                    border: "1px #d29266 solid",
                    borderRadius: "6px",
                    padding: "4px",
                    color: "#79103b",
                    fontWeight: "normal",
                    marginTop: "32px",
                }}
            >
                I hereby denote that I received, read and acknowledged:
            </h3>
            <Grid
                container
                textAlign={"left"}
                sx={{
                    maxWidth: isContractPayment ? "90%" : "60%",
                    margin: "auto",
                    my: 4,
                }}
                className="smCenter"
            >
                <Grid item xs={12} sm={isContractPayment ? 4 : 6}>
                    <Checkbox
                        disabled={allApproved}
                        checked={approveContract}
                        onClick={(e) => {
                            setApproveContract(!approveContract);
                        }}
                    ></Checkbox>
                    <a
                        target="_blank"
                        href={"https://" + domain + "/" + filename}
                    >
                        {isContractPayment ? "Contract" : "Invoice"}
                    </a>
                </Grid>
                {isContractPayment && (
                    <Grid item xs={12} sm={isContractPayment ? 4 : 6}>
                        <Checkbox
                            disabled={allApproved}
                            checked={approveCancelPolicy}
                            onClick={(e) => {
                                setApproveCancelPolicy(!approveCancelPolicy);
                            }}
                        ></Checkbox>
                        <a
                            target="_blank"
                            href={
                                "https://" + domain + "/cancellation_policy.pdf"
                            }
                        >
                            Cancellation Policy
                        </a>
                    </Grid>
                )}
                <Grid item xs={12} sm={isContractPayment ? 4 : 6}>
                    <Checkbox
                        disabled={allApproved}
                        checked={approvePrivacyPolicy}
                        onClick={(e) => {
                            setApprovePrivacyPolicy(!approvePrivacyPolicy);
                        }}
                    ></Checkbox>
                    <a
                        target="_blank"
                        href={"https://" + domain + "/privacy_policy.pdf"}
                    >
                        Privacy Policy
                    </a>
                </Grid>
            </Grid>
            <Box sx={{ width: "70%", margin: "20px auto" }}>
                <TextField
                    disabled={allApproved}
                    placeholder="Full Name"
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{
                        display: allApproved ? "none" : "initial",
                        ".MuiOutlinedInput-input": {
                            border: "1px #79103b solid",
                        },
                        ".MuiOutlinedInput-notchedOutline, .MuiInputBase-root":
                            { border: "none" },
                    }}
                ></TextField>
            </Box>
            {allApproved ? (
                <h4 style={{ color: "#009540", fontWeight: "normal" }}>
                    Accepted by {name} at {timeApproved}
                </h4>
            ) : (
                <Fade
                    in={
                        approveContract &&
                        (!isContractPayment || approveCancelPolicy) &&
                        approvePrivacyPolicy &&
                        name != ""
                    }
                >
                    <Button
                        disabled={allApproved}
                        onClick={(e) => onApproveAll()}
                        sx={{
                            background: "#79103b",
                            color: "#fff",
                            padding: "8px 25px",
                            mt: 4,
                            "&:hover": { background: "#9e114b" },
                        }}
                    >
                        <Typography>Save & Proceed</Typography>
                    </Button>
                </Fade>
            )}

            <Box
                sx={{
                    mt: 2,
                    display: allApproved ? "block" : "none",
                    color: "#79103b",
                }}
            >
                <Box
                    sx={{
                        border: "1px #d29266 solid",
                        borderRadius: "6px",
                    }}
                >
                    {tx.length > 1 ? (
                        <p
                            style={{
                                textAlign: "left",
                                margin: "10px 10px",
                                display: "inline-block",
                            }}
                            className="txtMultiTxNotice"
                        >
                            Due to online payment limit for a single
                            transaction, more than one payment link is required.
                            Please follow each link separately:
                        </p>
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                margin: "20px 0px",
                            }}
                        >
                            To pay, click the link below.
                        </p>
                    )}
                </Box>
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <img src="cards.svg"></img>
                </Box>
                <Grid container sx={{ mt: 4, fontWeight: "bold" }}>
                    <Grid item xs={5} md={6} sx={{ textAlign: "right", pr: 3 }}>
                        Total pay amount:
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{ textAlign: "left", mr: "auto" }}
                    >
                        <Typography sx={{ fontWeight: "bold" }}>
                            €{sum}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ borderColor: "#d29266", mb: 1 }}></Divider>
                {tx.map((value, index) => {
                    return (
                        <Grid container sx={{ mt: 0.5 }}>
                            <Grid
                                item
                                xs={5}
                                md={6}
                                sx={{ textAlign: "right", pr: 3 }}
                            ></Grid>
                            <Grid item xs={3} md={2} sx={{ textAlign: "left" }}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    €{value}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} md={4} sx={{ textAlign: "left" }}>
                                <a
                                    href={links[index]}
                                    style={{ textDecoration: "none" }}
                                >
                                    {status[index] == "Completed" ? (
                                        <Typography
                                            style={{
                                                borderRadius: "2px",
                                                padding: "1px 8px",
                                                background: "#009540",
                                                cursor: "pointer",
                                                color: "#fff",
                                                display: "inline-block",
                                            }}
                                        >
                                            Paid
                                        </Typography>
                                    ) : (
                                        <Typography
                                            style={{
                                                borderRadius: "2px",
                                                padding: "1px 8px",
                                                background: "#79103b",
                                                cursor: "pointer",
                                                color: "#fff",
                                                display: "inline-block",
                                            }}
                                        >
                                            Pay
                                        </Typography>
                                    )}
                                </a>
                            </Grid>
                        </Grid>
                    );
                })}
            </Box>
            <Divider sx={{ mt: 7, mb: 2, borderColor: "#d29266" }}></Divider>
            <Box>
                <Box sx={{ mt: "10px", mr: "20px", display: "inline-block" }}>
                    <a href="https://amcaviation.eu/">
                        <Typography
                            sx={{
                                border: "1px #d29266 solid",
                                borderRadius: "6px",
                                color: "#79103b",
                                display: "inline-block",
                                padding: "8px 25px",
                                cursor: "pointer",
                                fontSize: "14px",
                            }}
                        >
                            AMC Homepage
                        </Typography>
                    </a>
                </Box>
                <Box sx={{ mt: "10px", display: "inline-block" }}>
                    <a onClick={handleContactDlgOpen}>
                        <Typography
                            sx={{
                                border: "1px #d29266 solid",
                                borderRadius: "6px",
                                color: "#79103b",
                                display: "inline-block",
                                padding: "8px 25px",
                                cursor: "pointer",
                                fontSize: "14px",
                            }}
                        >
                            AMC Contact Sales
                        </Typography>
                    </a>
                </Box>
            </Box>
            <ContactDialog
                open={fContactDlgOpen}
                onClose={handleContactDlgClose}
            ></ContactDialog>
        </Box>
    );
};
export default Main;
