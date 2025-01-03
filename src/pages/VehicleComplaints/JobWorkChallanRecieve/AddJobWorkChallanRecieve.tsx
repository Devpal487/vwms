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
import { useFormik, validateYupSchema } from "formik";
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

const AddJobWorkChallanRecieve = (props: Props) => {

  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");


  const [tableData, setTableData] = useState([{
    id: 0,
    challanRcvNo: 0,
    jobCardId: 0,
    serviceId: 0,
    serviceCharge: 0,
    vendorId: 0,
    remark: "",
    cgstid: 0,
    sgstid: 0,
    gstid: 0,
    cgst: 0,
    sgst: 0,
    gst: 0,
    unitId: 0,
    qty: 0,
    amount: 0,
    netAmount: 0,
    serviceName: "",
    unitName: ""
  }]);
  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), name: "", empId: "" },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);
  const [serviceOption, setServiceOption] = useState([
    { value: -1, label: t("text.Services") },
  ]);
  const [unitOption, setUnitOption] = useState([
    { value: -1, label: t("text.Unit") },
  ]);
  const [taxOption, setTaxOption] = useState([
    { value: -1, label: t("text.Tax") },
  ]);
  const [challanNo, setChallanNo] = useState(0);

  useEffect(() => {
    getVehicleDetails();
    getVendorData();
    getServiceData();
    getUnitData();
    getTaxData();
    setTableDataValues();
    getChallanNo();
  }, []);

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

  const getVehicleDetails = async () => {
    const response = await api.get(
      `Master/GetVehicleDetail?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo,
      name: Item.itemName,
      empId: Item.empId
    }));
    setVehicleOption(arr);
  };



  const getTaxData = async () => {
    const collectData = {
      "taxId": -1
    };
    const response = await api.post(`UnitMaster/GetTaxMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxPercentage"],
        value: data[index]["taxId"],
      });
    }
    setTaxOption(arr);
  };


  


  const setTableDataValues = () => {
    const data = location.state.jobWorkChallanDetail;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        id: 0,
        challanRcvNo: 0,
        jobCardId: data[index].jobCardId,
        serviceId: data[index].serviceId,
        serviceCharge: data[index].serviceCharge,
        vendorId: data[index].vendorId,
        remark: data[index].remark,
        cgstid: data[index].cgstid,
        sgstid: data[index].sgstid,
        gstid: data[index].gstid,
        cgst: data[index].cgst,
        sgst: data[index].sgst,
        gst: data[index].gst,
        unitId: data[index].unitId,
        qty: data[index].qty,
        amount: data[index].amount,
        netAmount: data[index].netAmount,
        serviceName: data[index].serviceName,
        unitName: data[index].unitName
      });
    }
    setTableData(arr);
  }


  const getChallanNo = async () => {
    const collectData = {
      "jobCardId": -1,
      "challanNo": -1
    };
    const response = await api.post(
      `Master/GetJobWorkChallan`,
      collectData
    );
    const data = response.data.data;
    data.map((e: any) => {
      if (e.jobCardId === location.state.jobCardId) {
        setChallanNo(e.challanNo);
      }
    })
  }


  const validateRow = (row: any) => {
    return row.serviceId && row.serviceName && row.amount > 0;
  };


  const formik = useFormik({
    initialValues: {
      "challanRcvNo": 0,
      "challanRcvDate": "2024-12-24T09:48:34.720Z",
      "challanNo": challanNo || location.state.challanNo,
      "complainId": location.state.complainId,
      "empId": location.state.empId,
      "itemId": location.state.itemId,
      "jobCardId": location.state.jobCardId,
      "vendorId": location.state.vendorId,
      "remark": location.state.remark,
      "estAmount": location.state.netAmount,
      "serviceAmount": location.state.serviceAmount,
      "itemAmount": location.state.itemAmount,
      "netAmount": location.state.netAmount,
      "createdBy": "",
      "updatedBy": "",
      "createdOn": "2024-12-24T09:48:34.720Z",
      "updatedOn": "2024-12-24T09:48:34.720Z",
      "releasedBy": "",
      "postedBy": "",
      "releasedOn": "2024-12-24T09:48:34.720Z",
      "postedOn": "2024-12-24T09:48:34.720Z",
      "companyId": 0,
      "fyId": location.state.fyId,
      "cgst": location.state.cgst,
      "sgst": location.state.sgst,
      "gst": location.state.gst,
      "cgstid": location.state.cgstid,
      "sgstid": location.state.sgstid,
      "gstid": location.state.gstid,
      "challanRcvDoc": "",
      "jobWorkChallanRcvDetail": [],
      "file": "",
      "vehicleNo": location.state.vehicleNo,
      "vendorName": location.state.vendorName,
      "empName": location.state.empName,
      "jobCardNo": location.state.jobCardNo,
      "jobCardDate": location.state.jobCardDate,
      "challanDate": location.state.challanDate,
    },


    onSubmit: async (values) => {
      const validTableData = tableData.filter(validateRow);
      if (validTableData.length === 0) {
        toast.error("Please add some data in table for further process");
        return;
      }
      const response = await api.post(`Master/UpsertJobWorkChallanRcv`, { ...values, jobWorkChallanRcvDetail: validTableData });
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/vehiclecomplaint/JobWorkChallanRecieve")
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
    if (event === "file") {
      setModalImg(formik.values.file);
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
          "data:image/png;base64," + formik.values.file;
        console.log(outputCheck);
      } catch (error) {
        console.error("Error converting image file to Base64:", error);
      }
    }
  };


  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;
    let unitRate = 0;
    if (field === 'serviceId') {
      newData[index].serviceId = newData[index].serviceId;
    }
    if (field === 'serviceName') {
      newData[index].serviceName = newData[index].serviceName;
    }
    if (field === 'qty') {
      newData[index].qty = newData[index].qty;
    }
    if (field === 'unitId') {
      newData[index].unitId = newData[index].unitId;
    }
    if (field === 'unitName') {
      newData[index].unitName = newData[index].unitName;
    }
    if (field === 'amount') {
      newData[index].amount = newData[index].amount;
    }
    // if (field === 'netAmount') {
    //   newData[index].netAmount = newData[index].amount + newData[index].amount * (newData[index].gst / 100);
    // }
    if (field === 'gst') {
      newData[index].gst = newData[index].gst;
      newData[index].cgst = (newData[index].amount * (newData[index].gst / 200)).toFixed(2);
      newData[index].sgst = (newData[index].amount * (newData[index].gst / 200)).toFixed(2);
      newData[index].netAmount = (newData[index].amount + newData[index].amount * (newData[index].gst / 100)).toFixed(2);
    }
    // if (field === 'cgst') {
    //   newData[index].cgst = newData[index].cgst;
    // }
    // if (field === 'sgst') {
    //   newData[index].sgst = newData[index].sgst;
    // }
    if (field === 'serviceCharge') {
      newData[index].serviceCharge = newData[index].serviceCharge;
    }
    newData[index].amount = newData[index].serviceCharge * newData[index].qty;
    newData[index].netAmount = newData[index].serviceCharge * newData[index].qty;

    setTableData(newData);

    if (newData[index].serviceId && newData[index].unitId > 0 && newData[index].qty && newData[index].amount > 0) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
    let total = 0;
    tableData.forEach(row => {
      total += row.amount;
    })
    formik.setFieldValue("netAmount", total + total * (newData[index].gst / 100));
    formik.setFieldValue("serviceAmount", total);
  };

  const addRow = () => {
    setTableData([...tableData, {
      id: 0,
      challanRcvNo: 0,
      jobCardId: 0,
      serviceId: 0,
      serviceCharge: 0,
      vendorId: 0,
      remark: "",
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
      cgst: 0,
      sgst: 0,
      gst: 0,
      unitId: 0,
      qty: 0,
      amount: 0,
      netAmount: 0,
      serviceName: "",
      unitName: ""
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
                {t("text.AddJobWorkChallanRecieve")}
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


              {/* VehicleNumber */}
              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vehicleOption}
                  value={formik.values.vehicleNo}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemId", newValue?.value)
                    formik.setFieldValue("vehicleNo", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.VehicleNo")} required={true} />}
                      name="zoneMaster.zoneID"
                      id="zoneMaster.zoneID"
                      placeholder={t("text.VehicleNo")}
                    />
                  )}
                />
              </Grid>


              {/* Challan Recieve Number */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanRcvNo")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="challanRcvNo"
                  id="challanRcvNo"
                  value={formik.values.challanRcvNo}
                  placeholder={t("text.ChallanRcvNo")}
                  onChange={(e) => {
                    formik.setFieldValue("challanRcvNo", parseInt(e.target.value) || "");
                  }}
                />
              </Grid>

              {/* Challan Recieve Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanRcvDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="challanRcvDate"
                  id="challanRcvDate"
                  value={formik.values.challanRcvDate}
                  placeholder={t("text.ChallanRcvDate")}
                  onChange={(e) => {
                    formik.setFieldValue("challanRcvDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Challan Number */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanNo")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="challanNo"
                  id="challanNo"
                  value={formik.values.challanNo}
                  placeholder={t("text.ChallanNo")}
                  onChange={(e) => {
                    formik.setFieldValue("challanNo", parseInt(e.target.value))
                  }}
                />
              </Grid>

              {/* Challan Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="challanDate"
                  id="challanDate"
                  value={formik.values.challanDate}
                  placeholder={t("text.ChallanDate")}
                  onChange={(e) => {
                    formik.setFieldValue("challanDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              {/* Vendor */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorOption}
                  value={formik.values.vendorName}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("vendorId", newValue?.value);
                    formik.setFieldValue("vendorName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Vendor")} required={true} />}
                      name="vendorName"
                      id="vendorName"
                      placeholder={t("text.Vendor")}
                    />
                  )}
                />
                {/* {formik.touched.zoneID && formik.errors.zoneID && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneID}</div>
                )} */}
              </Grid>

              {/* Challan est. item amount */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanEstAmount")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="estAmount"
                  id="estAmount"
                  value={formik.values.estAmount}
                  placeholder={t("text.ChallanEstAmount")}
                  onChange={(e) => {
                    formik.setFieldValue("estAmount", e.target.value)
                  }}
                />
              </Grid>

              {/* Close Date */}
              {/* <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanCloseDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ChallanCloseDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}


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
                    onChange={(e) => otherDocChangeHandler(e, "file")}
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
                    {formik.values.file == "" ? (
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

                        src={"data:image/png;base64," + formik.values.file}
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
                      onClick={() => modalOpenHandle("file")}
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


              <Grid item xs={12} md={12} lg={12}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black",
                  }}
                >
                  <thead
                    style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}
                  >
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Action")}
                      </th>

                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                          width: "300px"
                        }}
                      >
                        {t("text.Name")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Unit")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Quantity")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.UnitRate")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Amount")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.GstRate")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.CGST")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.SGST")}
                      </th>

                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.NetAmount")}
                      </th>
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
                            size="small"
                            onChange={(e: any, newValue: any) => {
                              console.log(newValue?.value);
                              handleInputChange(index, 'serviceId', newValue?.value);
                              handleInputChange(index, 'serviceName', newValue?.label);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={<CustomLabel text={t("text.ServiceName")} required={false} />}
                                name="serviceName"
                                id="serviceName"
                                placeholder={t("text.ServiceName")}
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
                            onChange={(e) => handleInputChange(index, 'qty', parseFloat(e.target.value) || 0)}
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
                            value={row.serviceCharge}
                            onChange={(e) => handleInputChange(index, 'serviceCharge', parseFloat(e.target.value) || 0)}
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
                            value={row.serviceCharge * row.qty}
                            onChange={(e) => handleInputChange(index, 'amount', (row.serviceCharge * row.qty) || 0)}
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
                            options={taxOption}
                            value={row.gst}
                            fullWidth
                            size="small"
                            onChange={(e: any, newValue: any) => {
                              handleInputChange(index, 'gst', parseFloat(newValue.label) || 0);
                              handleInputChange(index, 'gstId', newValue.value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={<CustomLabel text={t("text.GstRate")} required={false} />}
                                name="gst"
                                id="gst"
                                placeholder={t("text.GstRate")}
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
                            value={row.cgst}
                            onChange={(e) => handleInputChange(index, 'cgst', parseFloat(e.target.value) || 0)}
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
                            value={row.sgst}
                            onChange={(e) => handleInputChange(index, 'sgst', parseFloat(e.target.value) || 0)}
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
                            value={row.amount + row.amount * (row.gst / 100)}
                            //onChange={(e) => handleInputChange(index, 'netAmount', (row.serviceCharge * row.qty) || 0)}
                            size="small"
                            inputProps={{ "aria-readonly": true }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7}></td>
                      <td colSpan={2} style={{ fontWeight: "bold" }}>
                        {t("text.TotalServiceAmount")}
                      </td>
                      <td colSpan={1}>
                        <b>:</b>{formik.values.serviceAmount}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={7}></td>
                      <td colSpan={2} style={{ fontWeight: "bold", borderTop: "1px solid black" }}>
                        {t("text.NetAmount")}
                      </td>
                      <td colSpan={1} style={{ borderTop: "1px solid black" }}>
                        <b>:</b>{formik.values.netAmount}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
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

export default AddJobWorkChallanRecieve;