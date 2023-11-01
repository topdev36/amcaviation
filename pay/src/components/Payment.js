import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getTxInfo } from "service/BackendApi";

const Payment = () => {
  const params = useParams();
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [txId, setTxId] = useState(0);
  const [paid_time, setPaidTime] = useState("");

  useEffect(() => {
    getTxInfo(params.id, params.txid, cbGetTxInfo);
  }, []);

  const cbGetTxInfo = (res) => {
    if (res) {
      setAmount(res.amount);
      setStatus(res.status);
      setTxId(res.id);
      setPaidTime(res.paid_time);
    }
  };

  return (
    <Box>
      <Toaster />
      {status == "Completed" ? (
        <h1>
          {" "}
          €{amount} already sent on {paid_time}.
        </h1>
      ) : (
        <h1>Pay {params.txid} - €{amount}</h1>
      )}
    </Box>
  );
};
export default Payment;
