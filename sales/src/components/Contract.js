import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Button,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import EnhancedTable from "./EnhancedTable";
import AddDialog from "./AddDialog";
import NotifyDialog from "./NotifyDialog";
import { getAllContracts, deleteContracts } from "service/BackendApi";
import toast, { Toaster } from "react-hot-toast";

const Contract = () => {
  const [fOpenAddDlg, setAddOpen] = useState(false);
  const [fContractAdd, setFContractAdd] = useState(true);
  const [orderID, setOrderID] = useState(Date.now());
  const [fOpenNotifyDlg, setNotifyOpen] = useState(false);
  const [paylink, setPaylink] = useState("");
  const [pattern, setPattern] = useState("");
  const [contracts, setContractData] = useState([]);
  var idTimer = 0;

  useEffect(() => {
    getAllContracts(cbGetAllContracts);
  }, []);

  const cbGetAllContracts = (contractData) => {
    let newContracts = [];
    contractData.map((data, index) => {
      let amounts = [],
        status = [];
      data.txs.map((tx, index) => {
        amounts.push(tx.amount);
        status.push(tx.status);
      });
      newContracts = newContracts.concat(
        createData(
          data.creation,
          data.date,
          data.quote_id,
          data.aircraft,
          data.sum,
          data.link,
          amounts,
          status,
          data.signed_by,
          data.signed_time
        )
      );
    });
    setContractData(newContracts);
    setTimeout(() => {
      getAllContracts(cbGetAllContracts);
    }, 5000);
  };

  const onDeleteContracts = (selected) => {
    deleteContracts(selected, cbDelete);
  };

  const cbDelete = (res) => {
    if (res.success) {
      toast(res.numDeleted + " row(s) deleted.");
      getAllContracts(cbGetAllContracts);
    }
  };

  const onFilter = (e) => {
    let value = e.target.value;
    setPattern(value);
  };

  const isDuplicateContract = (quote_id) => {
    return contracts.filter((d) => d.quote_id == quote_id).length > 0;
  };

  const handleAddContractClick = () => {
    setFContractAdd(true);
    setOrderID("");    
    setAddOpen(true);
  };

  const handleAddOrderClick = () => {
    setFContractAdd(false);
    setOrderID(Date.now());
    setAddOpen(true);
  };

  const handleAddDialogClose = (result) => {
    setAddOpen(false);
    if (result && result.success) {
      let newContracts = [];
      newContracts = newContracts.concat(
        contracts,
        createData(
          result.creation,
          result.date,
          result.quote_id,
          result.aircraft,
          result.sum,
          result.link,
          result.arrTx,
          result.status,
          "",
          null
        )
      );
      setContractData(newContracts);
      setPaylink(result.link);
      setNotifyOpen(true);
    }
  };

  const handleNotifyDialogClose = () => {
    setNotifyOpen(false);
  };

  function createData(
    creation,
    date,
    quote_id,
    aircraft,
    sum,
    link,
    transaction,
    status,
    signed_by,
    signed_time
  ) {
    return {
      creation,
      date,
      quote_id,
      aircraft,
      sum,
      link,
      transaction,
      status,
      signed_by,
      signed_time,
    };
  }

  const headCells = [
    {
      id: "creation",
      numeric: false,
      disablePadding: false,
      label: "Creation",
      sortable: false,
    },
    {
      id: "date",
      numeric: false,
      disablePadding: false,
      label: "Date",
      sortable: false,
    },
    {
      id: "quote_id",
      numeric: false,
      disablePadding: false,
      label: "Quote ID",
      sortable: true,
    },
    {
      id: "aircraft",
      numeric: false,
      disablePadding: false,
      label: "Aircraft",
      sortable: true,
    },
    {
      id: "sum",
      numeric: false,
      disablePadding: false,
      label: "Sum",
      sortable: true,
    },
    {
      id: "pay_link",
      numeric: false,
      disablePadding: false,
      label: "Pay Link",
      sortable: false,
    },
    {
      id: "transaction",
      numeric: false,
      disablePadding: false,
      label: "Transaction",
      sortable: false,
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
      sortable: false,
    },
    {
      id: "signed_by",
      numeric: false,
      disablePadding: false,
      label: "Accepted By",
      sortable: false,
    },
    {
      id: "signed_time",
      numeric: false,
      disablePadding: false,
      label: "Accepted At",
      sortable: false,
    },
  ];
  return (
    <Box>
      <Button
        variant="contained"
        sx={{ mr: "20px" }}
        onClick={() => handleAddContractClick()}
      >
        Add Contract
      </Button>
      <Button
        variant="contained"
        sx={{ mr: "20px" }}
        onClick={() => handleAddOrderClick()}
      >
        Add Invoice
      </Button>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Quote ID"
        label="Search By"
        onChange={onFilter}
        sx={
          {
            // ".MuiSvgIcon-root": { fontSize: "1.2rem" },
            // ".MuiOutlinedInput-root": {
            //     fontSize: "14px",
            //     paddingLeft: "2px",
            // },
            // ".MuiOutlinedInput-input": { padding: "4px 5px" },
          }
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      ></TextField>
      <EnhancedTable
        headCells={headCells}
        rowData={contracts.filter((d) =>
          d.quote_id.toUpperCase().includes(pattern.toUpperCase())
        )}
        onDeleteRows={onDeleteContracts}
      ></EnhancedTable>

      <AddDialog
        open={fOpenAddDlg}
        isContractAdd={fContractAdd}
        onClose={handleAddDialogClose}
        isExist={isDuplicateContract}
        orderID={orderID}
      />
      <NotifyDialog
        open={fOpenNotifyDlg}
        onClose={handleNotifyDialogClose}
        paylink={paylink}
      ></NotifyDialog>
    </Box>
  );
};

export default Contract;
