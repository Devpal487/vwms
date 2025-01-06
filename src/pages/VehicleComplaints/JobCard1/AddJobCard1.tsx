
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider, Table,
  MenuItem,
  TextField,
  Typography,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  AutocompleteRenderInputParams,
  FormControl,
  Modal,
  Box,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from '@mui/icons-material/Delete';
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";
import { json } from "stream/consumers";
import ReactQuill from "react-quill";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { FormatItalic } from "@mui/icons-material";
import { setTimeout } from "timers/promises";


type Props = {};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const AddJobCard1 = (props: Props) => {
  const location = useLocation();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [taxData, setTaxData] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [itemOption, setitemOption] = useState<any>([]);
  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), vehicleName: "", empId: "" },
  ]);
  const [empOption, setEmpOption] = useState([
    { value: 1, label: t("text.EmpName"), department: "", designation: "" },
  ]);
  const [serviceOption, setServiceOption] = useState([
    { value: -1, label: t("text.Services") },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);
  const [unitOption, setUnitOption] = useState([
    { value: -1, label: t("text.Unit") },
  ]);
  const [complainOption, setComplainOption] = useState([{
    "sno": 0,
    "compId": 0,
    "itemID": 0,
    "complaintType": "",
    "complaintDoc": "",
    "empId": 0,
    "approveEmp4": 0,
    "approveEmp3": 0,
    "approveEmp2": 0,
    "approveEmp1": 0,
    "complaint": "",
    "complaintNo": "",
    "createdBy": "",
    "updatedBy": "",
    "status": "Initial",
    "currentReading": 0,
    "createdOn": defaultValues,
    "complaintDate": defaultValues,
    "updatedOn": defaultValues,
    "compAppdt": defaultValues,
    "jobCardNo": "",
    "file": "",
    "fileOldName": "",
    "vehicleNo": "",
    "vehicleName": "",
    "empName": ""
  },]);
  const [deptValue, setDeptValue] = useState("");
  const [desgValue, setDesgValue] = useState("");
  const [jobCardId, setJobCardId] = useState(0);

  const [jobCardData, setJobCardData] = useState([{
    "jobCardId": 0,
    "jobCardNo": "",
    "fileNo": "",
    "imageFile": "",
    "jobCardDate": defaultValues,
    "complainId": 0,
    "complainDate": defaultValues,
    "empId": 0,
    "itemId": 0,
    "currenReading": 0,
    "complain": "",
    "status": "",
    "serviceType": "",
    "createdBy": "",
    "updatedBy": "",
    "createdOn": defaultValues,
    "updatedOn": defaultValues,
    "companyId": 0,
    "fyId": 0,
    "totalItemAmount": 0,
    "totalServiceAmount": 0,
    "netAmount": 0,
    "itemName": "",
    "empName": "",
    "serviceDetail": [
      {
        "id": 0,
        "jobCardId": 0,
        "serviceId": 0,
        "amount": 0,
        "jobWorkReq": true,
        "vendorId": 0,
        "challanRemark": "",
        "challanNo": 0,
        "challanDate": defaultValues,
        "challanRcvNo": 0,
        "challanRcvDate": defaultValues,
        "challanStatus": "",
        "netAmount": 0,
        //"qty": 0,
        //"unitRate": 0,
        //"unitId": 0,
        // "vendorName": "",
        // "serviceName": "",
        //"unitName": "",
        "cgstid": 0,
        "sgstid": 0,
        "gstid": 0,
        //"gst": 0
      }
    ],
    "itemDetail": [
      {
        "id": 0,
        "jobCardId": 0,
        "itemId": 0,
        "indentId": 0,
        "indentNo": "",
        "qty": 0,
        "rate": 0,
        "batchNo": "",
        "amount": 0,
        "gstId": 0,
        "gstRate": 0,
        "cgst": 0,
        "sgst": 0,
        "igst": 0,
        "netAmount": 0,
        "srno": 0,
        "isDelete": true,
        "prevReading": 0
      }
    ],
    "update": true
  }]);

  const [items, setItems] = useState<any>([
    {
      "id": 0,
      "jobCardId": 0,
      "itemId": 0,
      "indentId": 0,
      "indentNo": "",
      "qty": 0,
      "rate": 0,
      "batchNo": "",
      "amount": 0,
      "gstId": 0,
      "gstRate": 0,
      "cgst": 0,
      "sgst": 0,
      "igst": 0,
      "netAmount": 0,
      "srno": 0,
      "isDelete": true,
      "prevReading": 0
    },
  ]);
  const [tableData, setTableData] = useState([
    {
      id: 0,
      jobCardId: 0,
      serviceId: 0,
      amount: 0,
      jobWorkReq: true,
      vendorId: 0,
      challanRemark: "",
      challanNo: 0,
      challanDate: defaultValues,
      challanRcvNo: 0,
      challanRcvDate: defaultValues,
      challanStatus: "",
      netAmount: 0,
      // qty: 0,
      //  unitRate: 0,
      //  unitId: 0,
      //   vendorName: "",
      //serviceName: "",
      //   unitName: "",
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
      //  gst: 0
    }
  ]);

  const [vehicleName, setVehicleName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemId, setItemId] = useState(0);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");

  useEffect(() => {
    getVehicleDetails();
    getEmpData();
    getServiceData();
    getVendorData();
    getUnitData();
    getComplainData();
    GetitemData();
    getTaxData();
    GetIndentID();
    setVehicleName(location.state?.vehicleName);
    getJobCardData();
    // const timeoutId = setTimeout(() => {
    //   setDesgValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.designation || "");
    //   setDeptValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.department || "");
    // }, 300);
    // return () => clearTimeout(timeoutId);

  }, []);
  const GetIndentID = async () => {
    const collectData = {
      indentId: -1,
      indentNo: "",
      empId: -1,
    };


    const response = await api.post(`Master/GetIndent`, collectData);
    const data = response.data.data;
    console.log("indent option", data)
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["indentNo"],
        value: data[index]["indentId"],

      });
    };
    setIndentOptions(arr);
  };
  const getTaxData = async () => {
    const result = await api.post(`UnitMaster/GetTaxMaster
`, {
      taxId: -1,
    });
    if (result.data.status === 1) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.taxPercentage}`,
          value: item.taxId,
        })) || [];

      setTaxData([{ value: "-1", label: t("text.tax") }, ...arr]);
    }
  };
  const GetitemData = async () => {
    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.get(`ItemMaster/GetItemMaster`, {});
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setitemOption(arr);
  };

  const getVehicleDetails = async () => {
    const response = await api.get(
      `Master/GetVehicleDetail?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo,
      vehicleName: Item.itemName,
      empId: Item.empId
    }));
    setVehicleOption(arr);
  };

  const getUnitData = async () => {
    const collectData = {
      "unitId": -1
    };
    const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
    const data = response.data.data;
    //console.log("Vendor data==>  ",data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOption(arr);
  };

  const getVendorData = async () => {
    const collectData = {
      "venderId": -1,
      "countryId": -1,
      "stateId": -1,
      "cityId": -1
    };
    const response = await api.post(`Master/GetVendorMaster`, collectData);
    const data = response.data.data;
    //console.log("Vendor data==>  ",data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["name"],
        value: data[index]["venderId"],
      });
    }
    setVendorOption(arr);
  };

  const getEmpData = async () => {
    const collectData = {
      "empid": -1,
      "userId": ""
    };
    const response = await api.post(`Employee/GetEmployee`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
        department: data[index]["departmentName"],
        designation: data[index]["designationName"],
      });
    }
    setEmpOption(arr);
  };




  const getComplainData = async () => {
    const collectData = {
      "id": -1,
      "empid": -1,
      "itemId": -1
    };
    const response = await api.post(`Master/GetComplaint`, collectData);
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      ...Item,
      value: Item.compId,
      compId: Item.compId,
      complaintDate: Item.complaintDate,
      complaint: Item.complaint,
    }));
    setComplainOption(arr);
  };

  const getServiceData = async () => {
    const collectData = {
      "serviceId": -1
    };
    const response = await api.post(`ServiceMaster/GetServiceMaster`, collectData);
    const data = response.data.data;
    //console.log("Vendor data==>  ",data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["serviceName"],
        value: data[index]["serviceId"],
      });
    }
    setServiceOption(arr);
  };

  const getJobCardData = async () => {
    const collectData = {
      "jobCardId": -1,
      "status": ""
    };
    const response = await api.post(`Master/GetJobCard`, collectData);
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      ...Item,
    }));
    setJobCardData(arr);
  };


  const validateRow = (row: any) => {
    // return row.serviceName && row.vendorId && row.qty && row.unitRate > 0;
  };



  const formik = useFormik({
    initialValues: {
      "jobCardId": 0,
      "jobCardNo": "",
      "fileNo": "",
      "imageFile": "",
      "jobCardDate": defaultValues,
      "complainId": location.state?.compId || 0,
      "complainDate": location.state?.complaintDate || defaultValues,
      "empId": location.state?.empId || 0,
      "itemId": location.state?.itemID || 0,
      "currenReading": location.state?.currentReading || 0,
      "complain": location.state?.complaint || "",
      "status": "inprogress",
      "serviceType": "",
      "createdBy": "",
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "totalItemAmount": 0,
      "totalServiceAmount": 0,
      "netAmount": 0,
      "vehicleNo": location.state?.vehicleNo || "",
      "empName": location.state?.empName || "",
      "serviceDetail": location.state?.serviceDetail || [],
      "itemDetail": location.state?.itemDetail || [],
      "update": true

      //...location.state,
    },
    onSubmit: async (values) => {
      const validItems = items.filter((item: any) => validateItem(item));
      const validTableData = tableData.filter(validateRow);
      // if (validTableData.length === 0) {
      //   toast.error("Please add some data in table for further process");
      //   return;
      // }
      if (validItems.length === 0) {
        alert("Please fill in at least one valid item.");
        return;
      }

      const response = await api.post(`Master/UpsertJobCardInhouse`, { ...values, serviceDetail: validTableData, itemDetail: validItems });
      if (response.data.status === 1) {
        toast.success(response.data.message);
        setJobCardId(response.data.data.jobCardId);
        setIsVisible(true);
        //navigate("/vehiclecomplaint/JobCard");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const handleGenerateChallan = async (values: any) => {
    const validTableData = tableData.filter(validateRow);
    if (validTableData.length === 0) {
      toast.error("Please add some data in table for further process");
      return;
    }
    const response = await api.post(`Master/GenerateJobWorkChallan`, { ...values, serviceDetail: validTableData });
    if (response.data.status === 1) {
      toast.success(response.data.message);
      setJobCardId(response.data.data.jobCardId);
    } else {
      setToaster(true);
      toast.error(response.data.message);
    }
  };


  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;

    if (field === 'serviceId') {
      newData[index].serviceId = newData[index].serviceId;
    }
    // if (field === 'serviceName') {
    //   newData[index].serviceName = newData[index].serviceName;
    // }
    if (field === 'amount') {
      newData[index].amount = newData[index].amount;
    }
    if (field === 'vendorId') {
      newData[index].vendorId = newData[index].vendorId;
    }
    if (field === 'challanRemark') {
      newData[index].challanRemark = newData[index].challanRemark;
    }
    if (field === 'challanNo') {
      newData[index].challanNo = newData[index].challanNo;
    }
    if (field === 'challanStatus') {
      newData[index].challanStatus = newData[index].challanStatus;
    }
    if (field === 'netAmount') {
      newData[index].netAmount = newData[index].netAmount;
    }
    // if (field === 'qty') {
    //   newData[index].qty = newData[index].qty;
    // }
    // if (field === 'unitRate') {
    //   newData[index].unitRate = newData[index].unitRate;
    // }
    // if (field === 'unitId') {
    //   newData[index].unitId = newData[index].unitId;
    // }
    // if (field === 'vendorName') {
    //   newData[index].vendorName = newData[index].vendorName;
    // }
    // if (field === 'unitName') {
    //   newData[index].unitName = newData[index].unitName;
    // }
    //newData[index].amount = newData[index].unitRate * newData[index].qty;
    //  newData[index].netAmount = newData[index].unitRate * newData[index].qty;

    setTableData(newData);

    if (newData[index].serviceId && newData[index].vendorId > 0) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
    let total = 0;
    tableData.forEach(row => {
      total += row.amount;
    })
    formik.setFieldValue("netAmount", total);
    formik.setFieldValue("totalServiceAmount", total);
    formik.setFieldValue("totalItemAmount", total);
  };

  const addRow = () => {
    setTableData([...tableData, {
      id: 0,
      jobCardId: 0,
      serviceId: 0,
      amount: 0,
      jobWorkReq: true,
      vendorId: 0,
      challanRemark: "",
      challanNo: 0,
      challanDate: defaultValues,
      challanRcvNo: 0,
      challanRcvDate: defaultValues,
      challanStatus: "",
      netAmount: 0,
      //qty: 0,
      //  unitRate: 0,
      // unitId: 0,
      //  vendorName: "",
      //   serviceName: "",
      //  unitName: "",
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
      //  gst: 0
    },
    ]);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        "id": 0,
        "jobCardId": 0,
        "itemId": 0,
        "indentId": 0,
        "indentNo": "",
        "qty": 0,
        "rate": 0,
        "batchNo": "",
        "amount": 0,
        "gstId": 0,
        "gstRate": 0,
        "cgst": 0,
        "sgst": 0,
        "igst": 0,
        "netAmount": 0,
        "srno": 0,
        "isDelete": true,
        "prevReading": 0
      },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    let item = { ...updatedItems[index] };

    if (field === "itemId") {
      const selectedItem = itemOption.find((option: any) => option.value === value);
      if (selectedItem) {
        item = {
          ...item,
          itemId: selectedItem.value,
          itemMaster: selectedItem.itemDetails
        };
        item.unit = selectedItem.itemDetails.unit || "";
        item.rate = selectedItem.itemDetails.rate || 0;
      }
    } else if (field === "rate") {
      item.rate = value === '' ? 0 : parseFloat(value);
    } else if (field === "qty") {
      item.qty = value === '' ? 0 : parseFloat(value);
    } else if (field === "gstRate") {
      item.gstRate = value === '' ? 0 : parseFloat(value);
    } else if (field === "indentNo") {
      item.indentNo = value;
    } else if (field === "preReading") {
      item.preReading = value;
    } else {
      item[field] = value;
    }

    // Ensure amount, gst, and netAmount are calculated only when all required values are filled.
    if (item.qty && item.rate && item.indentNo && item.preReading) {
      item.amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
      item.gst = (item.amount * (parseFloat(item.gstRate) || 0)) / 100;
      item.netAmount = item.amount + item.gst;
    } else {
      item.amount = 0;
      item.gst = 0;
      item.netAmount = 0;
    }

    updatedItems[index] = item;
    setItems(updatedItems);

    if (validateItem(item) && index === items.length - 1) {
      handleAddItem();
    }
  };

  const deleteRow = (index: any) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const validateItem = (item: any) => {
    console.log("item validateItem", item);
    return (
      item.itemId &&
      item.unit &&
      item.qty > 0 &&
      item.rate > 0 &&
      item.amount >= 0 &&
      item.gstRate >= 0 &&
      item.netAmount >= 0
    );
  };


  const back = useNavigate();

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>

          <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.AddJobCard")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l: any) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Divider />
          <br />
          <ToastContainer />
          <form onSubmit={formik.handleSubmit}>

            <Grid container spacing={2}>

              {/* RadioButton */}
              <Grid item xs={12} sm={12} lg={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="status"
                    name="status"
                    value={formik.values.status}
                    onChange={(event) => formik.setFieldValue("status", event.target.value)}
                  >
                    <FormControlLabel
                      value="Complete"
                      control={<Radio color="primary" />}
                      label={t("text.Complete")}

                    />
                    <FormControlLabel
                      value="JobWork"
                      control={<Radio color="primary" />}
                      label={t("text.JobWork")}
                    />
                    <FormControlLabel
                      value="inprogress"
                      control={<Radio color="primary" />}
                      label={t("text.InProgress")}
                    />

                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* File number */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.jobCardNo")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="jobCardNo"
                  id="jobCardNo"
                  value={formik.values.jobCardNo}
                  placeholder={t("text.jobCardNo")}
                  onChange={(e) => {
                    formik.setFieldValue("jobCardNo", e.target.value.toString());
                    setDesgValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.designation || "");
                    setDeptValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.department || "");
                  }}
                />
              </Grid>


           {/* job card Date */}
           <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.JobCardDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="jobCardDate"
                  id="jobCardDate"
                  value={formik.values.jobCardDate}
                  placeholder={t("text.JobCardDate")}
                  onChange={(e) => {
                    formik.setFieldValue("jobCardDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* VehicleNumber */}
              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vehicleOption.filter(e => {
                    for (let i = 0; i < complainOption.length; i++) {
                      if (e.value == complainOption[i].itemID) {
                        return e;
                      }
                    }
                  })}
                  ref={inputRef}
                  value={formik.values.vehicleNo}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if(!newValue){
                      return;
                    }else{
                    setItemId(newValue?.value);
                    formik.setFieldValue("vehicleNo", newValue?.label);
                    formik.setFieldValue("itemId", newValue?.value);
                    formik.setFieldValue("empId", newValue?.empId);
                    formik.setFieldValue("empName", empOption[empOption.findIndex(e => e.value == newValue?.empId)].label);
                    setDesgValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].designation);
                    setDeptValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].department);
                    setVehicleName(newValue?.vehicleName);
                    console.log(complainOption);
                    formik.setFieldValue("complainId", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.compId);
                    formik.setFieldValue("complain", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.complaint);
                    formik.setFieldValue("complainDate", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.complaintDate);
                    formik.setFieldValue("currenReading", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.currentReading);
                    formik.setFieldValue("status", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.status || "complete");
                    setTableData(jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.serviceDetail || [{
                      id: 0,
                      jobCardId: 0,
                      serviceId: 0,
                      amount: 0,
                      jobWorkReq: true,
                      vendorId: 0,
                      challanRemark: "",
                      challanNo: 0,
                      challanDate: defaultValues,
                      challanRcvNo: 0,
                      challanRcvDate: defaultValues,
                      challanStatus: "",
                      netAmount: 0,
                      // qty: 0,
                      // unitRate: 0,
                      // unitId: 0,
                      // vendorName: "",
                      // serviceName: "",
                      // unitName: "",
                      cgstid: 0,
                      sgstid: 0,
                      gstid: 0,
                  //    gst: 0
                    }]);
                    formik.setFieldValue("jobCardId", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.jobCardId || 0);
                    formik.setFieldValue("jobCardNo", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.jobCardNo || "");
                    formik.setFieldValue("fileNo", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.fileNo || "");
                  }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.VehicleNo")} required={true} />}
                      name="vehicleNo"
                      id="vehicleNo"
                      placeholder={t("text.VehicleNo")}
                    />
                  )}
                />
              </Grid>

              {/* Vehicle name */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.VehicleName")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="VehicleName"
                  id="VehicleName"
                  value={vehicleName}
                  placeholder={t("text.VehicleName")}
                  onChange={(e) => {
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Job Card Number */}
              {/* <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.JobCardNo")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="jobCardNo"
                  id="jobCardNo"
                  value={formik.values.jobCardNo}
                  placeholder={t("text.JobCardNo")}
                  onChange={(e) => {
                    formik.setFieldValue("jobCardNo", e.target.value.toString())
                  }}
                />
              </Grid> */}

              {/* UnderControlOf */}
              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  value={formik.values.empName}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                    formik.setFieldValue("empName", newValue?.label);
                    setDesgValue(newValue?.designation);
                    setDeptValue(newValue?.department);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.UnderControlOf")} required={true} />}
                      name="empName"
                      id="empName"
                      placeholder={t("text.UnderControlOf")}
                    />
                  )}
                />
              </Grid>

              {/* Department*/}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Department")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="deptValue"
                  id="deptValue"
                  value={deptValue}
                  placeholder={t("text.Department")}
                  onChange={(e) => {
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              {/* Designation*/}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Designation")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="desgValue"
                  id="desgValue"
                  value={desgValue}
                  placeholder={t("text.Designation")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* CurrentReadingKM */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ReadingKM")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="currenReading"
                  id="currenReading"
                  value={formik.values.currenReading}
                  placeholder={t("text.ReadingKM")}
                  onChange={(e) => {
                    formik.setFieldValue("currenReading", parseFloat(e.target.value) || 0);
                  }}
                />
              </Grid>

              <Grid item lg={12} md={12} xs={12} >
                <ReactQuill
                  id="complaint"
                  theme="snow"
                  value={formik.values.complain}
                  onChange={(content) => formik.setFieldValue("complain", content)}
                  onBlur={() => formik.setFieldTouched("complain", true)}
                  modules={modules}
                  formats={formats}
                  //  style={{ backgroundColor: "white", minHeight: "200px" }} 
                  placeholder="Enter your complaint here"
                />
              </Grid>
              {/* Complaint
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Complaint")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="complain"
                  id="complain"
                  value={formik.values.complain}
                  placeholder={t("text.Complaint")}
                  onChange={(e) => {
                    formik.setFieldValue("complain", e.target.value);
                  }}
                />
              </Grid> */}





              <Grid item xs={12}>
                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
                  <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                    <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                      <tr>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.Services")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.Status")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.Vendor")}</th>
                        {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Quantity")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.UnitRate")}</th> */}
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Amount")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.NetAmount")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Reading")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.ChallanNo")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Remark1")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={row.id} style={{ border: '1px solid black' }}>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <DeleteIcon
                              onClick={() => {
                                if (tableData.length > 1) {
                                  deleteRow(index)
                                } else {
                                  alert("Atleast one row should be there");
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              // textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={serviceOption}
                              value={row.serviceId}
                              // value={row.serviceName}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue?.value);
                                handleInputChange(index, 'serviceId', newValue?.value);
                                handleInputChange(index, 'serviceName', newValue?.label);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={
                                    <CustomLabel
                                      text={t("text.SelectServices")}
                                      required={false}
                                    />
                                  }
                                />
                              )}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                              // textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["JobWork"]}
                              value={row.challanStatus}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                handleInputChange(index, 'challanStatus', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={
                                    <CustomLabel
                                      text={t("text.Status")}
                                      required={false}
                                    />
                                  }
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              // textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={vendorOption}
                              // value={row.vendorName}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue?.value);
                                handleInputChange(index, 'vendorId', newValue?.value);
                                handleInputChange(index, 'vendorName', newValue?.label);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={
                                    <CustomLabel
                                      text={t("text.Vendor")}
                                      required={false}
                                    />
                                  }
                                />
                              )}
                            />
                          </td>

                          {/* <td
                          style={{
                            border: "1px solid black",
                            // textAlign: "center",
                          }}
                        >
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={unitOption}
                            value={row.unitName}
                            fullWidth
                            size="small"
                            onChange={(e: any, newValue: any) => {
                              console.log(newValue?.value);
                              handleInputChange(index, 'unitId', newValue?.value);
                              handleInputChange(index, 'unitName', newValue?.label);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <CustomLabel
                                    text={t("text.Unit")}
                                    required={false}
                                  />
                                }
                              />
                            )}
                          />
                        </td> */}
                          {/* <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            width: "10rem"
                          }}
                        >
                          <TextField
                            value={row.qty}
                            onChange={(e) => {
                              handleInputChange(index, 'qty', parseInt(e.target.value) || 0);
                              formik.setFieldValue("totalServiceAmount", formik.values.totalServiceAmount + row.qty * row.unitRate);
                              setTotalAmount(row.qty * row.unitRate);
                            }}
                            size="small"
                            inputProps={{ "aria-readonly": true }}
                          />
                        </td> */}
                          {/* <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            width: "10rem"
                          }}
                        >
                          <TextField
                            value={row.unitRate}
                            onChange={(e) => handleInputChange(index, 'unitRate', parseFloat(e.target.value) || 0)}
                            size="small"
                            inputProps={{ "aria-readonly": true }}
                          />
                        </td> */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              //value={row.qty * row.unitRate}
                              onChange={(e) => {
                                handleInputChange(index, 'amount', parseFloat(e.target.value) || 0);
                                formik.setFieldValue("totalServiceAmount", formik.values.totalServiceAmount);
                                //handleInputChange(index, 'netAmount',);
                                // setTotalAmount(row.qty * row.unitRate);
                              }}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              // value={row.qty * row.unitRate}
                              onChange={(e) => {
                                // handleInputChange(index, 'netAmount', parseFloat((row.qty * row.unitRate).toString()) || 0);
                              }}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              //value={row.challanStatus}
                              //onChange={(e) => handleInputChange(index, 'challanStatus', (e.target.value))}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.challanNo}
                              onChange={(e) => handleInputChange(index, 'challanNo', parseInt(e.target.value) || 0)}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.challanRemark}
                              onChange={(e) => handleInputChange(index, 'challanRemark', (e.target.value))}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </Table>
                </div> </Grid>


              {true && (
                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: `var(--header-background)`, // Use the same color as previous buttons
                      color: "white",
                      padding: "6px 12px", // Smaller padding for a smaller size
                      fontSize: "12px", // Smaller font size
                      borderRadius: "8px",
                      minWidth: "120px", // Set consistent button width
                      textAlign: "center",
                    }}
                    onClick={() => {
                      const validTableData = tableData.filter(validateRow);
                      if (validTableData.length === 0) {
                        alert("Please add some data in table for further process");
                        return;
                      } else {
                        formik.setFieldValue("status", "jobwork");
                        handleGenerateChallan(formik.values);
                      }
                    }}
                  >
                    {t("text.JobWorkChallan")}
                  </Button>

                </Grid>
              )}

              <Grid item xs={12}>
                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
                  <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                    <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                      <tr>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.itemName")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.quantity")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Rate")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.indentNo")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.preReading")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.gst")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.gstRate")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Sgst")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Cgst")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Igst")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.netAmount")}</th>

                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any, index: any) => (
                        <tr key={item.id} style={{ border: '1px solid black' }}>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <DeleteIcon
                              onClick={() => deleteRow(index)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              // textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={itemOption}
                              fullWidth
                              size="small"

                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "itemId",
                                  newValue?.value
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}

                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              // textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={unitOption}
                              //value={row.unitName}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue?.value);
                                handleInputChange(index, 'unitId', newValue?.value);
                                handleInputChange(index, 'unitName', newValue?.label);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={
                                    <CustomLabel
                                      text={t("text.Unit")}
                                      required={false}
                                    />
                                  }
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              //value={row.qty}
                              // onChange={(e) => {
                              //   handleInputChange(index, 'qty', parseInt(e.target.value) || 0);
                              //   formik.setFieldValue("totalServiceAmount", formik.values.totalServiceAmount );
                              //   setTotalAmount(row.qty * row.unitRate);
                              // }}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              // value={row.rate}
                              onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",

                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={indentOptions}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                console.log("check value", newValue);
                                if (newValue) {
                                  //  GetIndentIDById(newValue?.value);
                                  formik.setFieldValue("indentId", newValue?.value);
                                  formik.setFieldValue("indentNo", newValue?.label?.toString() || "");
                                }
                              }}
                              renderInput={(params: any) => (
                                <TextField
                                  {...params}
                                  label={
                                    <CustomLabel text={t("text.enterIndentNo")} required={true} />
                                  }
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",

                            }}
                          >
                            <TextField
                              // value={row.challanStatus}
                              onChange={(e) => handleInputChange(index, 'prereading', (e.target.value))}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={taxData}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(index, "gstId", newValue?.value)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}

                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              //  value={row.cgst.toFixed(2)}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              //  value={row.cgst.toFixed(2)}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              // value={row.sgst.toFixed(2)}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              //   value={row.igst.toFixed(2)}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={item.netAmount}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.ItemAmount")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.CGST")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.SGST")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.IGST")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold", borderTop: "1px solid black" }}>
                          {t("text.TotalItemAmount")}
                        </td>
                        <td colSpan={6} style={{ borderTop: "1px solid black" }}>
                          <b>:</b>{formik.values.totalItemAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalOutsourceItemAmount")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalServiceAmount")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>{formik.values.totalServiceAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalAmount")}
                        </td>
                        <td colSpan={6}>
                          <b>:</b>{formik.values.netAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>   </Grid>
              {true && (
                <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
                  container
                  spacing={2} // Adds spacing between buttons
                  justifyContent="flex-start" // Aligns buttons to the left; use 'center' or 'flex-end' as needed
                  alignItems="center"
                >
                  {/* Indent Generate Button */}
                  <Grid item>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: `var(--header-background)`, // Use the same color as previous buttons
                        color: "white",
                        padding: "6px 12px", // Smaller padding for a smaller size
                        fontSize: "12px", // Smaller font size
                        borderRadius: "8px",
                        minWidth: "120px", // Set consistent button width
                        textAlign: "center",
                      }}
                      onClick={() => {
                        const validTableData = tableData.filter(validateRow);
                        if (validTableData.length === 0) {
                          alert("Please add some data in table for further process");
                          return;
                        } else {
                          formik.setFieldValue("status", "indentGenerate");
                        }
                      }}
                    >
                      {t("text.indentGenerate")}
                    </Button>
                  </Grid>

                  {/* Indent Print Button */}
                  <Grid item>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: `var(--header-background)`, // Use the same color as previous buttons
                        color: "white",
                        padding: "6px 12px", // Smaller padding for a smaller size
                        fontSize: "12px", // Smaller font size
                        borderRadius: "8px",
                        minWidth: "120px", // Set consistent button width
                        textAlign: "center",
                      }}
                      onClick={() => {
                        const validTableData = tableData.filter(validateRow);
                        if (validTableData.length === 0) {
                          alert("Please add some data in table for further process");
                          return;
                        } else {
                          formik.setFieldValue("status", "indentprint");
                        }
                      }}
                    >
                      {t("text.indentprint")}
                    </Button>
                  </Grid>
                </Grid>

              )}
              <Grid container spacing={3} item></Grid>
              {/* vendor evaluation*/}
              <Grid
                container
                spacing={2}
                justifyContent="flex-end" // Align buttons to the right
                alignItems="center"
                style={{ marginTop: "10px" }}
              >
                {/* Vendor Evaluation Button */}
                <Grid item>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      minWidth: "120px", // Set a fixed width
                      textAlign: "center",
                    }}
                    onClick={() => {
                      const validTableData = tableData.filter(validateRow);
                      if (validTableData.length === 0) {
                        alert("Please add some data in table for further process");
                        return;
                      } else {
                        formik.setFieldValue("status", "vendorevaluation");
                      }
                    }}
                  >
                    {t("text.vendorevaluation")}
                  </Button>

                </Grid>


                {/* Submit Button */}
                <Grid item >
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      minWidth: "120px", // Set a fixed width
                      textAlign: "center",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                </Grid>

                {/* Reset Button */}
                <Grid item >
                  <Button
                    type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "#F43F5E",
                      color: "white",
                      minWidth: "120px", // Set a fixed width
                      textAlign: "center",
                    }}
                    onClick={() => {
                      formik.resetForm();
                      console.log(totalAmount);
                    }}
                  >
                    {t("text.reset")}
                  </Button>
                </Grid>
              </Grid>

              {isVisible && (
                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "#0000ff",
                      color: "white",
                      marginTop: "10px",
                      padding: "8px 16px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      width: "100px",
                    }}
                    onClick={() => {
                      const validTableData = tableData.filter(validateRow);
                      if (validTableData.length === 0) {
                        toast.error("Please add some data in table for further process");
                        return;
                      }
                      navigate("/vehiclecomplaint/AddJobWorkChallan", {
                        state: { ...formik.values, serviceDetail: validTableData, jobCardId: jobCardId, challanNo: validTableData[0].challanNo },
                      });

                    }}
                  >
                    {t("text.Next")}
                    <ArrowForwardIcon />
                  </Button>
                </Grid>
              )}

            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "formula",
  "code-block",
];
export default AddJobCard1;