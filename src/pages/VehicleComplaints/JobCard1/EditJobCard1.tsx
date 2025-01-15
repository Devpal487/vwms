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
import React, { useEffect, useState } from "react";
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

const EditJobCard1 = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();
  const [taxData, setTaxData] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
  ]);
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
  const [complainOption, setComplainOption] = useState([
    { value: -1, label: t("text.Complain"), empId: "", jobCardNo: "" },
  ]);
  const [deptValue, setDeptValue] = useState("");
  const [desgValue, setDesgValue] = useState("");

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
    }
  ]);

  const [vehicleName, setVehicleName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

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
    setTableData(formik.values.serviceDetail);
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
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["complaint"],
        value: data[index]["compId"],
        empId: data[index]["empId"],
        jobCardNo: data[index]["jobCardNo"],
      });
    }
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

  const validateRow = (row: any) => {
    return row.serviceName && row.serviceId && row.vendorId && row.challanNo > 0;
  };



  const formik = useFormik({
    initialValues: {
      "jobCardId": location.state.jobCardId,
      "jobCardNo": location.state.jobCardNo,
      "fileNo": location.state.fileNo,
      "imageFile": location.state.imageFile,
      "jobCardDate": location.state.jobCardDate,
      "complainId": location.state.complainId,
      "complainDate": location.state.complainDate,
      "empId": location.state.empId,
      "itemId": location.state.itemId,
      "currenReading": location.state.currenReading,
      "complain": location.state.complain,
      "status": location.state.status,
      "serviceType": location.state.serviceType,
      "createdBy": location.state.createdBy,
      "updatedBy": location.state.updatedBy,
      "createdOn": location.state.createdOn,
      "updatedOn": location.state.updatedOn,
      "companyId": location.state.companyId,
      "fyId": location.state.fyId,
      "totalItemAmount": location.state.totalItemAmount,
      "totalServiceAmount": location.state.totalServiceAmount,
      "netAmount": location.state.netAmount,
      "itemName": location.state.itemName,
      "empName": location.state.empName,
      "serviceDetail": location.state.serviceDetail,
      "update": true
    },
    onSubmit: async (values) => {

      const validTableData = tableData.filter(validateRow);
      if (validTableData.length === 0) {
        toast.error("Please add some data in table for further process");
        return;
      }
      const response = await api.post(`Master/UpsertJobCard`, { ...values, serviceDetail: validTableData });
      console.log("@@@@===>>", values);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/vehiclecomplaint/JobCard");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });



  // const handlePanClose = () => {
  //   setPanOpen(false);
  // };
  // const modalOpenHandle = (event: any) => {
  //   setPanOpen(true);
  //   if (event === "jobCardModel.imageFile") {
  //     setModalImg(formik.values.imageFile);
  //   }
  // };
  // const ConvertBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // const base64ToByteArray = (base64: string): Uint8Array => {
  //   // Remove the data URL scheme if it exists
  //   const base64String = base64.split(",")[1];

  //   // Decode the Base64 string
  //   const binaryString = window.atob(base64String);
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);

  //   // Convert binary string to Uint8Array
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }

  //   return bytes;
  // };

  // const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  //   let binary = "";
  //   const len = uint8Array.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(uint8Array[i]);
  //   }
  //   return window.btoa(binary);
  // };

  // const otherDocChangeHandler = async (event: any, params: string) => {
  //   console.log("Image file change detected");

  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const fileNameParts = file.name.split(".");
  //     const fileExtension =
  //       fileNameParts[fileNameParts.length - 1].toLowerCase();

  //     if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
  //       alert(
  //         "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
  //       );
  //       event.target.value = null;
  //       return;
  //     }

  //     try {
  //       const base64Data = (await ConvertBase64(file)) as string;
  //       console.log("Base64 image data:", base64Data);

  //       // Convert Base64 to Uint8Array
  //       const byteArray = base64ToByteArray(base64Data);
  //       console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

  //       // Convert Uint8Array to base64 string
  //       const base64String = uint8ArrayToBase64(byteArray);
  //       console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

  //       // Set value in Formik
  //       formik.setFieldValue(params, base64String);

  //       let outputCheck =
  //         "data:image/png;base64," + formik.values.imageFile;
  //       console.log(outputCheck);
  //     } catch (error) {
  //       console.error("Error converting image file to Base64:", error);
  //     }
  //   }
  // };

  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;

    if (field === 'serviceId') {
      newData[index].serviceId = newData[index].serviceId;
    }
    if (field === 'serviceName') {
      newData[index].serviceName = newData[index].serviceName;
    }
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
    if (field === 'qty') {
      newData[index].qty = newData[index].qty;
    }
    if (field === 'unitRate') {
      newData[index].unitRate = newData[index].unitRate;
    }
    if (field === 'unitId') {
      newData[index].unitId = newData[index].unitId;
    }
    if (field === 'vendorName') {
      newData[index].vendorName = newData[index].vendorName;
    }
    if (field === 'unitName') {
      newData[index].unitName = newData[index].unitName;
    }
    newData[index].amount = newData[index].unitRate * newData[index].qty;
    newData[index].netAmount = newData[index].unitRate * newData[index].qty;

    setTableData(newData);

    if (newData[index].serviceId && newData[index].vendorName && newData[index].challanNo > 0) {
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
      challanDate: "2024-12-20T11:08:20.068Z",
      challanRcvNo: 0,
      challanRcvDate: "2024-12-20T11:08:20.068Z",
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
                {t("text.EditJobCard")}
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
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid container spacing={2}>
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
                                    value="complete"
                                    control={<Radio color="primary" />}
                                    label={t("text.Complete")}
              
                                  />
                                  <FormControlLabel
                                    value="jobwork"
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

              {/* RadioButton */}
              {/* <Grid item xs={12} sm={12} lg={12}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="licensing"
                    name="radio-buttons-group"
                  >
                    <div style={{ display: "flex" }}>
                      <FormControlLabel value="complete" control={<Radio />} label={t("text.Complete")} />
                      <FormControlLabel value="jobwork" control={<Radio />} label={t("text.JobWork")} />
                      <FormControlLabel value="inprogress" control={<Radio />} label={t("text.InProgress")} />
                    </div>
                  </RadioGroup>
                </FormControl>
              </Grid> */}

              {/* File number */}
              {/* <Grid item xs={12} md={4} sm={4}>
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
                  }}
                />
              </Grid> */}


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
                  options={vehicleOption}
                  value={formik.values.itemName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("itemName", newValue?.label);
                    formik.setFieldValue("itemId", newValue?.value);
                    formik.setFieldValue("empId", newValue?.empId);
                    formik.setFieldValue("empName", empOption[empOption.findIndex(e => e.value == newValue?.empId)].label);
                    formik.setFieldValue("complain", complainOption[complainOption.findIndex(e => e.empId == newValue?.empId)].label);
                    formik.setFieldValue("complainId", complainOption[complainOption.findIndex(e => e.empId == newValue?.empId)].value);
                    setDesgValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].designation);
                    setDeptValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].department);
                    setVehicleName(newValue?.vehicleName);
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
              <Grid item xs={12} md={4} sm={4}>
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
              </Grid>

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



              <Grid item xs={12}>
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
                            options={serviceOption}
                            value={row.serviceName}
                            fullWidth
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
                          <TextField
                            value={row.challanStatus}
                            onChange={(e) => handleInputChange(index, 'challanStatus', (e.target.value))}
                            size="small"
                            inputProps={{ "aria-readonly": true }}
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
                            value={row.qty * row.unitRate}
                            onChange={(e) => {
                              handleInputChange(index, 'amount', parseFloat(e.target.value) || 0);
                              formik.setFieldValue("totalServiceAmount", formik.values.totalServiceAmount + row.qty * row.unitRate);
                              handleInputChange(index, 'netAmount', parseFloat((row.qty * row.unitRate).toString()) || 0);
                              setTotalAmount(row.qty * row.unitRate);
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
                            value={row.qty * row.unitRate}
                            onChange={(e) => {
                              handleInputChange(index, 'netAmount', parseFloat((row.qty * row.unitRate).toString()) || 0);
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
                            // value={row.challanStatus}
                            // onChange={(e) => handleInputChange(index, 'challanStatus', (e.target.value))}
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
              </Grid>

              {true && (
                <Grid item lg={6} sm={6} xs={12}>
                  {/* <Button
                    type="button"
                    style={{
                      backgroundColor: "#0000ff",
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
                        formik.setFieldValue("status", "jobwork");
                      }
                    }}
                  >
                    {t("text.JobWorkChallan")}
                  </Button> */}
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
                    }
                  }}
                >
                  {t("text.JobWorkChallan")}
                </Button>

                </Grid>
              )}

              <Grid item xs={12}>
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
                    {tableData.map((row, index) => (
                      <tr key={row.id} style={{ border: '1px solid black' }}>
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
                            value={row.netAmount}
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
              </Grid>
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
  <Grid item>
    <Button
      type="submit"
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
  <Grid item>
    <Button
      type="reset"
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


            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EditJobCard1;