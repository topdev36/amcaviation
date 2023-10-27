import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getTxInfo } from "service/BackendApi";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "../utils";
import Card from "react-credit-cards";
import '../styles.css';
import 'react-credit-cards/es/styles-compiled.css';

const Payment = () => {
  const params = useParams();
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [txId, setTxId] = useState(0);
  const [paid_time, setPaidTime] = useState("");

  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [issuer, setIssuer] = useState("");
  const [focused, setFocused] = useState("");
  const [formData, setFormData] = useState(null);

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

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setIssuer(issuer);
    }
  };

  const handleInputFocus = ({ target }) => {
    setFocused(target.name);
  };

  const handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
      setNumber(target.value)
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
      setExpiry(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
      setCvc(target.value);
    }    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("You have finished payment!");
    e.target.reset();
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
        <div key="Payment">
          <div className="App-payment">
            <h1>Enter your payment details</h1>
            <h4>please input your information below</h4>
            <Card
              number={number}
              name={name}
              expiry={expiry}
              cvc={cvc}
              focused={focused}
              callback={handleCallback}
            />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <small>Name on card:</small>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  pattern="[a-z A-Z-]+"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <div className="form-group">
                <small>Card Number:</small>

                <input
                  type="tel"
                  name="number"
                  className="form-control"
                  placeholder="Card Number"
                  pattern="[\d| ]{16,22}"
                  maxLength="19"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>

              <div className="form-group">
                <small>Expiration Date:</small>

                <input
                  type="tel"
                  name="expiry"
                  className="form-control"
                  placeholder="Valid Thru"
                  pattern="\d\d/\d\d"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <div className="form-group">
                <small>CVC:</small>

                <input
                  type="tel"
                  name="cvc"
                  className="form-control"
                  placeholder="CVC"
                  pattern="\d{3}"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <input type="hidden" name="issuer" value={issuer} />
              <div className="form-actions">
                <button>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Box>
  );
};
export default Payment;
