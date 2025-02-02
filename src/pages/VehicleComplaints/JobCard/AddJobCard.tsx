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

const AddJobCard = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);

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
      "jobCardId": 0,
      "jobCardNo": "",
      "fileNo": "",
      "imageFile": "",
      "jobCardDate": "2024-12-23T11:56:48.412Z",
      "complainId": 0,
      "complainDate": "2024-12-23T11:56:48.412Z",
      "empId": 0,
      "itemId": 0,
      "currenReading": 0,
      "complain": "",
      "status": "",
      "serviceType": "",
      "createdBy": "",
      "updatedBy": "",
      "createdOn": "2024-12-23T11:56:48.412Z",
      "updatedOn": "2024-12-23T11:56:48.412Z",
      "companyId": 0,
      "fyId": 0,
      "totalItemAmount": 0,
      "totalServiceAmount": 0,
      "netAmount": 0,
      "itemName": "",
      "empName": "",
      "serviceDetail": [],
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



  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "jobCardModel.imageFile") {
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


    setTableData(newData);

    if (newData[index].serviceId && newData[index].vendorName && newData[index].challanNo > 0) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
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
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid container spacing={2}>

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
                  options={vehicleOption}
                  //value={formik.values.itemName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("itemName", newValue?.label);
                    formik.setFieldValue("itemId", newValue?.value);
                    formik.setFieldValue("empId", newValue?.empId);
                    formik.setFieldValue("empName", empOption[empOption.findIndex(e => e.value == newValue?.empId)].label);
                    formik.setFieldValue("complain", complainOption[complainOption.findIndex(e => e.empId == newValue?.empId)].label);
                    formik.setFieldValue("complainId", complainOption[complainOption.findIndex(e => e.empId == newValue?.empId)].value);
                    // formik.setFieldValue("jobCardModel.jobCardNo", complainOption[complainOption.findIndex(e => e.empId == newValue?.empId)].jobCardNo);
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
                  <tfoot>
                    <tr>
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
                    </tr>
                    <tr>
                      <td colSpan={9}></td>
                      <td colSpan={2} style={{ fontWeight: "bold" }}>
                        {t("text.TotalServiceAmount")}
                      </td>
                      <td colSpan={1}>
                        <b>:</b>{formik.values.totalServiceAmount}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}></td>
                      <td colSpan={2} style={{ fontWeight: "bold" }}>
                        {t("text.TotalAmount")}
                      </td>
                      <td colSpan={1}>
                        <b>:</b>{formik.values.netAmount}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Grid>



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
                    onChange={(e) => otherDocChangeHandler(e, "jobCardModel.imageFile")}
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
                      onClick={() => modalOpenHandle("jobCardModel.imageFile")}
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

            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default AddJobCard;