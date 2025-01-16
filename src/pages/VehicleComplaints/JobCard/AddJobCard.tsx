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
import dayjs, { Dayjs } from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";
import { json } from "stream/consumers";
import ReactQuill from "react-quill";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { FormatItalic } from "@mui/icons-material";
// import { setTimeout } from "timers/promises";


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

const AddJobCard = (props: Props) => {
  const location = useLocation();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleJWC, setIsVisibleJWC] = useState(0);
  const [isEnable, setIsEnable] = useState(0);
  const inputRef = useRef<HTMLButtonElement>(null);

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
    "jobCardDate": "2025-01-02T08:08:36.700Z",
    "complainId": 0,
    "complainDate": "2025-01-02T08:08:36.700Z",
    "empId": 0,
    "itemId": 0,
    "currenReading": 0,
    "complain": "",
    "status": "",
    "serviceType": "",
    "createdBy": "",
    "updatedBy": "",
    "createdOn": "2025-01-02T08:08:36.700Z",
    "updatedOn": "2025-01-02T08:08:36.700Z",
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
        "challanDate": "2025-01-02T08:08:36.700Z",
        "challanRcvNo": 0,
        "challanRcvDate": "2025-01-02T08:08:36.700Z",
        "challanStatus": "",
        "netAmount": 0,
        "qty": 0,
        "unitRate": 0,
        "unitId": 0,
        "vendorName": "",
        "serviceName": "",
        "unitName": "",
        "cgstid": 0,
        "sgstid": 0,
        "gstid": 0,
        "gst": 0
      }
    ],
    "update": true
  }]);


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
      qty: 0,
      unitRate: 0,
      unitId: 0,
      vendorName: "",
      serviceName: "",
      unitName: "",
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
      gst: 0
    },
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
      qty: 0,
      unitRate: 0,
      unitId: 0,
      vendorName: "",
      serviceName: "",
      unitName: "",
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
      gst: 0
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
    setVehicleName(location.state?.vehicleName);
    getJobCardData();

    setDesgValue(location.state?.designation || "");
    setDeptValue(location.state?.department || "");
    // const timeoutId = setTimeout(() => {
    //   if (desgValue == "" && inputRef.current) {
    //     inputRef.current.click(); // Programmatically click the button
    //   }
    //   // handleAutoFillData(location.state?.itemID || formik.values.itemId, location.state?.empId || 0);
    // }, 500);
    // return () => clearTimeout(timeoutId);
    let total = 0;
    tableData.forEach(row => {
      total += row.amount;
    })
    formik.setFieldValue("netAmount", total);
    formik.setFieldValue("totalServiceAmount", total);
    //formik.setFieldValue("totalItemAmount", total);
  }, []);


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
      "jobCardId": location.state?.jobCardId || -1,
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
    return row.serviceName && row.vendorId && row.qty && row.unitRate > 0;
  };



  const formik = useFormik({
    initialValues: {
      "jobCardId": 0,
      "jobCardNo": "",
      "fileNo": "",
      "imageFile": "",
      "jobCardDate": defaultValues,
      "complainId": location.state?.compId || 0,
      "complainDate": dayjs(location.state?.complaintDate).format("YYYY-MM-DD") || defaultValues,
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
      "totalServiceAmount": location.state?.totalServiceAmount || 0,
      "netAmount": location.state?.netAmount || 0,
      "itemName": location.state?.vehicleNo || "",
      "empName": location.state?.empName || "",
      "serviceDetail": location.state?.serviceDetail || [],
      "update": true

      //...location.state,
    },

    validationSchema: Yup.object({
      fileNo: Yup.string()
        .required("File number is required"),
      itemName: Yup.string()
        .required("Vehicle Number is required"),
    }),

    onSubmit: async (values) => {

      const validTableData = tableData.filter(validateRow);
      if (validTableData.length === 0) {
        toast.error("Please add some data in table for further process");
        return;
      }
      const response = await api.post(`Master/UpsertJobCard`, { ...values, serviceDetail: validTableData });
      if (response.data.status === 1) {
        toast.success(response.data.message);
        setJobCardId(response.data.data.jobCardId);
        setIsVisible(true);
        formik.setFieldValue("jobCardId", response.data.data.jobCardId);
        formik.setFieldValue("jobCardNo", response.data.data.jobCardNo);
        setIsVisibleJWC(isVisibleJWC + 1);
        setIsEnable(isEnable + 1);
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
      toast.success(response.data?.message || "JobWork Challan Generated");
      setJobCardId(response.data.data.jobCardId);
      setIsVisibleJWC(5);
    } else {
      setToaster(true);
      toast.error(response.data.message);
    }
  };


  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "imageFile") {
      setModalImg(formik.values.imageFile);
    }
  };
  const ConvertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const base64ToByteArray = (base64: string): Uint8Array => {
    // Remove the data URL scheme if it exists
    const base64String = base64.split(",")[1];

    // Decode the Base64 string
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    // Convert binary string to Uint8Array
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

  const otherDocChangeHandler = async (event: any, params: string) => {
    console.log("Image file change detected");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
        alert(
          "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
        );
        event.target.value = null;
        return;
      }

      try {
        const base64Data = (await ConvertBase64(file)) as string;
        console.log("Base64 image data:", base64Data);

        // Convert Base64 to Uint8Array
        const byteArray = base64ToByteArray(base64Data);
        console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

        // Convert Uint8Array to base64 string
        const base64String = uint8ArrayToBase64(byteArray);
        console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

        // Set value in Formik
        formik.setFieldValue(params, base64String);

        let outputCheck =
          "data:image/png;base64," + formik.values.imageFile;
        console.log(outputCheck);
      } catch (error) {
        console.error("Error converting image file to Base64:", error);
      }
    }
  };

  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;

    if (field === 'serviceId') {
      newData[index].serviceId = newData[index].serviceId;
      newData[index].serviceName = serviceOption[serviceOption.findIndex(e => e.value == newData[index].serviceId)].label;
    }
    // if (field === 'serviceName') {
    //   newData[index].serviceName = newData[index].serviceName;
    // }
    if (field === 'amount') {
      newData[index].amount = newData[index].amount;
    }
    if (field === 'vendorId') {
      newData[index].vendorId = newData[index].vendorId;
      newData[index].vendorName = vendorOption[vendorOption.findIndex(e => e.value == newData[index].vendorId)].label;
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
    if (field === 'qty') {
      newData[index].qty = newData[index].qty;
    }
    if (field === 'unitRate') {
      newData[index].unitRate = newData[index].unitRate;
    }
    if (field === 'unitId') {
      newData[index].unitId = newData[index].unitId;
      newData[index].unitName = unitOption[unitOption.findIndex(e => e.value == newData[index].unitId)].label;
    }
    // if (field === 'vendorName') {
    //   newData[index].vendorName = newData[index].vendorName;
    // }
    // if (field === 'unitName') {
    //   newData[index].unitName = newData[index].unitName;
    // }
    newData[index].jobCardId = formik.values.jobCardId;
    newData[index].amount = newData[index].unitRate * newData[index].qty;
    newData[index].netAmount = newData[index].unitRate * newData[index].qty;
    newData[index].id = index;
    setTableData(newData);

    if (newData[index].serviceId && newData[index].vendorName && newData[index].qty && newData[index].unitRate > 0) {
      if (index === tableData.length - 1) {
        addRow();
        //setIsVisibleJWC(true);
      }
    }
    let total = 0;
    tableData.forEach(row => {
      total += row.amount;
    })
    formik.setFieldValue("netAmount", total);
    formik.setFieldValue("totalServiceAmount", total);
    // formik.setFieldValue("totalItemAmount", total);
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
      qty: 0,
      unitRate: 0,
      unitId: 0,
      vendorName: "",
      serviceName: "",
      unitName: "",
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
      gst: 0
    },
    ]);
  };

  const deleteRow = (index: any) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };


  const handleAutoFillData = (value: any, empValue: any) => {
    //console.log("@@@@@@@@@@@@@==>>>>>>>>>", value, "         ", empValue)
    formik.setFieldValue("complainId", complainOption[complainOption.findIndex(e => e.itemID == value)]?.compId);
    formik.setFieldValue("complainDate", complainOption[complainOption.findIndex(e => e.itemID == value)]?.complaintDate);
    formik.setFieldValue("currenReading", complainOption[complainOption.findIndex(e => e.itemID == value)]?.currentReading);
    formik.setFieldValue("status", complainOption[complainOption.findIndex(e => e.itemID == value)]?.status);
    if (jobCardData[jobCardData.findIndex(e => e.itemId == value)]?.serviceDetail.length === 0) {
      setTableData(tableData);
    } else {
      setTableData(jobCardData[jobCardData.findIndex(e => e.itemId == value)]?.serviceDetail || [{
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
        qty: 0,
        unitRate: 0,
        unitId: 0,
        vendorName: "",
        serviceName: "",
        unitName: "",
        cgstid: 0,
        sgstid: 0,
        gstid: 0,
        gst: 0
      }]);
    }
    formik.setFieldValue("jobCardId", jobCardData[jobCardData.findIndex(e => e.itemId == value)]?.jobCardId || 0);
    formik.setFieldValue("jobCardNo", jobCardData[jobCardData.findIndex(e => e.itemId == value)]?.jobCardNo || "");
    formik.setFieldValue("fileNo", jobCardData[jobCardData.findIndex(e => e.itemId == value)]?.fileNo || "");
    formik.setFieldValue("complain", complainOption[complainOption.findIndex(e => e.itemID == value)]?.complaint);
    //formik.setFieldValue("empName", empOption[empOption.findIndex(e => e.value == empValue)]?.label || "");
    setDesgValue(empOption[empOption.findIndex(e => e.value == empValue)]?.designation || "N/A");
    setDeptValue(empOption[empOption.findIndex(e => e.value == empValue)]?.department || "N/A");
    //setVehicleName(vehicleOption[vehicleOption.findIndex(e => e.value == value)]?.vehicleName || "N/A");
  }




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
            {/* {toaster === false ? "" : <ToastApp />} */}
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
                      value={"Complete"}
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
                      text={t("text.FileNo")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="fileNo"
                  id="fileNo"
                  value={formik.values.fileNo}
                  placeholder={t("text.FileNo")}
                  onChange={(e) => {
                    formik.setFieldValue("fileNo", e.target.value.toString());
                    setDesgValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.designation || "");
                    setDeptValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.department || "");
                  }}
                  onFocus={(e) => e.target.select()}
                />
                {!formik.values.fileNo && formik.touched.fileNo && formik.errors.fileNo && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.fileNo.toString()}</div>
                )}
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
                  value={formik.values.itemName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if (!newValue) {
                      return;
                    } else {
                      setItemId(newValue?.value);
                      formik.setFieldValue("itemName", newValue?.label);
                      formik.setFieldValue("itemId", newValue?.value);
                      formik.setFieldValue("empId", newValue?.empId);
                      formik.setFieldValue("empName", empOption[empOption.findIndex(e => e.value == newValue?.empId)].label);
                      setDesgValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].designation);
                      setDeptValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].department);
                      setVehicleName(newValue?.vehicleName);

                      formik.setFieldValue("complainId", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.compId);
                      formik.setFieldValue("complain", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.complaint);
                      formik.setFieldValue("complainDate", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.complaintDate);
                      formik.setFieldValue("currenReading", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.currentReading);
                      formik.setFieldValue("status", complainOption[complainOption.findIndex(e => e.itemID == newValue?.value)]?.status || "Complete");
                      // setTableData([...(jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.serviceDetail) ,{
                      //   id: 0,
                      //   jobCardId: 0,
                      //   serviceId: 0,
                      //   amount: 0,
                      //   jobWorkReq: true,
                      //   vendorId: 0,
                      //   challanRemark: "",
                      //   challanNo: 0,
                      //   challanDate: defaultValues,
                      //   challanRcvNo: 0,
                      //   challanRcvDate: defaultValues,
                      //   challanStatus: "",
                      //   netAmount: 0,
                      //   qty: 0,
                      //   unitRate: 0,
                      //   unitId: 0,
                      //   vendorName: "",
                      //   serviceName: "",
                      //   unitName: "",
                      //   cgstid: 0,
                      //   sgstid: 0,
                      //   gstid: 0,
                      //   gst: 0
                      // }]);
                      // formik.setFieldValue("jobCardId", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.jobCardId || 0);
                      // formik.setFieldValue("jobCardNo", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.jobCardNo || "");
                      // formik.setFieldValue("fileNo", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.fileNo || "");
                      // formik.setFieldValue("totalServiceAmount", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.totalServiceAmount || "");
                      // formik.setFieldValue("netAmount", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.netAmount || 0);
                      // console.log("@@@@@@@@@@@@@@@@@@@" + JSON.stringify(jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.serviceDetail))
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.VehicleNo")} required={true} />}
                      name="itemName"
                      id="itemName"
                      placeholder={t("text.VehicleNo")}
                    />
                  )}
                />
                {!formik.values.itemName && formik.touched.itemName && formik.errors.itemName && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemName.toString()}</div>
                )}
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
                  disabled={true}
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                    formik.setFieldValue("empName", newValue?.label);
                    setDesgValue(newValue?.designation);
                    setDeptValue(newValue?.department);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.UnderControlOf")} required={false} />}
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

              {/* <Grid item lg={12} md={12} xs={12} >
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
              </Grid> */}

              {/* Complaint */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterComplaint")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="complain"
                  id="complain"
                  value={formik.values.complain}
                  placeholder={t("text.enterComplaint")}
                  onChange={(e) => {
                    formik.setFieldValue("complain", e.target.value);
                  }}
                />
              </Grid>





              <Grid item xs={12}>
                <div style={{ overflowX: 'scroll', margin: 0, padding: 0 }}>
                  <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                    <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                      <tr>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.Services")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Status")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: "20rem" }}>{t("text.Vendor")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Quantity")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.UnitRate")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Amount")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.NetAmount")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Reading")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.ChallanNo")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Remark")}</th>
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
                              value={row.serviceName}
                              fullWidth
                              sx={{ width: "225px" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                console.log(newValue?.value);
                                handleInputChange(index, 'serviceId', newValue?.value);
                                handleInputChange(index, 'serviceName', newValue?.label);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={
                                //   <CustomLabel
                                //     text={t("text.SelectServices")}
                                //     required={false}
                                //   />
                                // }
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
                                if (!newValue) {
                                  return;
                                }
                                handleInputChange(index, 'challanStatus', newValue);
                              }}
                              sx={{ width: "145px" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={
                                //   <CustomLabel
                                //     text={t("text.Status")}
                                //     required={false}
                                //   />
                                // }
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
                              value={row.vendorName}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                console.log(newValue?.value);
                                handleInputChange(index, 'vendorId', newValue?.value);
                                handleInputChange(index, 'vendorName', newValue?.label);
                              }}
                              sx={{ width: "330px" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={
                                //   <CustomLabel
                                //     text={t("text.Vendor")}
                                //     required={false}
                                //   />
                                // }
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
                              value={row.unitName}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                console.log(newValue?.value);
                                handleInputChange(index, 'unitId', newValue.value);
                                handleInputChange(index, 'unitName', newValue.label);
                              }}
                              sx={{ width: "140px" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={
                                //   <CustomLabel
                                //     text={t("text.Unit")}
                                //     required={false}
                                //   />
                                // }
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
                              value={row.qty}
                              onChange={(e) => {
                                handleInputChange(index, 'qty', parseInt(e.target.value) || 0);
                                formik.setFieldValue("totalServiceAmount", formik.values.totalServiceAmount + row.qty * row.unitRate);
                                setTotalAmount(row.qty * row.unitRate);
                              }}
                              onFocus={(e) => e.target.select()}
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
                              value={row.unitRate}
                              onChange={(e) => handleInputChange(index, 'unitRate', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              sx={{ width: "80px" }}
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
                              value={row.qty * row.unitRate}
                              onChange={(e) => {
                                handleInputChange(index, 'amount', parseFloat(e.target.value) || 0);
                                formik.setFieldValue("totalServiceAmount", formik.values.totalServiceAmount + row.qty * row.unitRate);
                                handleInputChange(index, 'netAmount', parseFloat((row.qty * row.unitRate).toString()) || 0);
                                setTotalAmount(row.qty * row.unitRate);
                              }}
                              onFocus={(e) => e.target.select()}
                              sx={{ width: "90px" }}
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
                              value={row.qty * row.unitRate}
                              onChange={(e) => {
                                handleInputChange(index, 'netAmount', parseFloat((row.qty * row.unitRate).toString()) || 0);
                              }}
                              onFocus={(e) => e.target.select()}
                              size="small"
                              sx={{ width: "90px" }}
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
                              //value={row.reading}
                              //onChange={(e) => handleInputChange(index, 'reading', (e.target.value))}
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
                              disabled={true}
                              value={row.challanNo}
                              onChange={(e) => handleInputChange(index, 'challanNo', parseInt(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
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
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              sx={{ width: "100px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {/* <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.ItemAmount")}
                        </td>
                        <td colSpan={1}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.CGST")}
                        </td>
                        <td colSpan={1}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.SGST")}
                        </td>
                        <td colSpan={1}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.IGST")}
                        </td>
                        <td colSpan={1}>
                          <b>:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold", borderTop: "1px solid black" }}>
                          {t("text.TotalItemAmount")}
                        </td>
                        <td colSpan={1} style={{ borderTop: "1px solid black" }}>
                          <b>:</b>{formik.values.totalItemAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalOutsourceItemAmount")}
                        </td>
                        <td colSpan={1}>
                          <b>:</b>
                        </td>
                      </tr> */}
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalServiceAmount")}
                        </td>
                        <td colSpan={1} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.totalServiceAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalAmount")}
                        </td>
                        <td colSpan={1} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.netAmount || formik.values.totalServiceAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Grid>


              {(isVisibleJWC == 1) ? (
                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "#426aed",
                      color: "white",
                      marginTop: "10px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      width: "200px",
                    }}
                    onClick={() => {
                      const validTableData = tableData.filter(validateRow);
                      if (validTableData.length === 0) {
                        alert("Please add some data in table for further process");
                        return;
                      } else {
                        formik.setFieldValue("status", "JobWork");
                        handleGenerateChallan(formik.values);
                        setIsVisibleJWC(isVisibleJWC + 1)
                        setIsVisible(true);
                      }
                    }}
                  >
                    {t("text.JobWorkChallan")}
                  </Button>

                </Grid>
              ) : (
                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "grey",
                      color: "white",
                      marginTop: "10px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      width: "200px",
                    }}
                    disabled={true}
                    onClick={() => {
                      const validTableData = tableData.filter(validateRow);
                      if (validTableData.length === 0) {
                        alert("Please add some data in table for further process");
                        return;
                      } else {
                        formik.setFieldValue("status", "JobWork");
                        handleGenerateChallan(formik.values);
                      }
                    }}
                  >
                    {t("text.JobWorkChallan")}
                  </Button>

                </Grid>
              )}



              {/* attachment */}
              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.AttachedImage")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "imageFile")}
                  />
                </Grid>
                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {formik.values.imageFile == "" ? (
                      <img
                        // src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={"data:image/png;base64," + formik.values.imageFile}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                          padding: "2px",
                        }}
                      />
                    )}
                    <Typography
                      onClick={() => modalOpenHandle("imageFile")}
                      style={{
                        textDecorationColor: "blue",
                        textDecorationLine: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </Grid>
                </Grid>
                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {modalImg == "" ? (
                      <img
                        //  src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={"data:image/png;base64," + modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>


              {/* Submit Button */}
              <Grid item lg={6} sm={6} xs={12}>
                {(isEnable < 2) ? (
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    disabled={true}
                    style={{
                      backgroundColor: `grey`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                )}

              </Grid>

              {/* Reset Button */}
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    formik.resetForm();
                    console.log(totalAmount);
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
              <Button
                ref={inputRef}
                onClick={(e) => {
                  setTimeout(() => {
                    handleAutoFillData(location.state?.itemID || formik.values?.itemId, location.state?.empId || formik.values.empId);
                    setIsVisible(true);
                  }, 300);
                }}
                sx={{ display: "none" }}
                variant="contained"
                color="secondary"
              >
              </Button>

              {isVisible && (isVisibleJWC > 2 && isEnable > 1) && (
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
                        state: { ...formik.values, serviceDetail: tableData, jobCardId: jobCardId, challanNo: validTableData[0].challanNo },
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
    </div >
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
export default AddJobCard;