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
import { Pending } from "@mui/icons-material";

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

const EditMaintainanceWarrantyMaster = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();

  const [itemValue, setItemValue] = useState();
  const [vendorValue, setVendorValue] = useState();
  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo") },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);


  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");


  useEffect(() => {
    getVehicleDetails();
    getVendorData();
  }, []);

  const getLabelById = (option: any, id: any) => {
    const obj = option.find((item: any) => item.value === id);
    return obj ? obj.label : "";
  };

  const getVehicleDetails = async () => {
    const response = await api.get(
      `Master/GetVehicleDetail?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo
    }));
    setVehicleOption(arr);
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




  const formik = useFormik({
    initialValues: {
      "id": location.state.id,
      "effDate": location.state.effDate,
      "type": location.state.type,
      "vendorId": location.state.vendorId,
      "itemId": location.state.itemId,
      "fromDate": location.state.fromDate,
      "toDate": location.state.toDate,
      "remark": location.state.remark,
      "attachment": location.state.statement,
      "attachmentName": location.state.attachmentName,
      "createdBy": location.state.createdBy,
      "updatedBy": location.state.updatedBy,
      "createdOn": location.state.createdOn,
      "updatedOn": location.state.updatedOn,
      "companyId": location.state.companyId,
      "fyId": location.state.fyId,
      "file": location.state.file
    },

    onSubmit: async (values) => {

      const response = await api.post(`Master/UpsertMantenanceWarranty`, values);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/vehiclemaster/MaintainanceWarrantyMaster")
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
                {t("text.EditMaintainanceWarranty")}
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

              {/* Vehicle Number */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vehicleOption}
                  value={getLabelById(vehicleOption, formik.values.itemId)}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemId", newValue?.value);
                    setItemValue(newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.VehicleNo")} required={true} />}
                      name="itemId"
                      id="itemId"
                      placeholder={t("text.VehicleNo")}
                    />
                  )}
                />
                {/* {formik.touched.zoneID && formik.errors.zoneID && (
                   <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneID}</div>
                 )} */}
              </Grid>

              {/* Vendor */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorOption}
                  value={getLabelById(vendorOption, formik.values.vendorId)}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("vendorId", newValue?.value);
                    setVendorValue(newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Vendor")} required={true} />}
                      name="vendorId"
                      id="vendorId"
                      placeholder={t("text.Vendor")}
                    />
                  )}
                />
                {/* {formik.touched.zoneID && formik.errors.zoneID && (
                   <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneID}</div>
                 )} */}
              </Grid>


              {/* effective data */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EffectiveDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="effDate"
                  id="effDate"
                  value={formik.values.effDate}
                  placeholder={t("text.EffectiveDate")}
                  onChange={(e) => {
                    formik.setFieldValue("effDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>

              {/* Status */}
              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={["Completed", "Pending", "Inprocess"]}
                  //value={zoneValue}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);


                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Status")} required={true} />}
                      name="status"
                      id="status"
                      placeholder={t("text.Status")}
                    />
                  )}
                />
              </Grid> */}

              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.fromDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="fromDate"
                  id="fromDate"
                  value={formik.values.fromDate}
                  placeholder={t("text.fromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("fromDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}

              </Grid>

              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.toDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="toDate"
                  id="toDate"
                  value={formik.values.toDate}
                  placeholder={t("text.toDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}
              </Grid>


              {/* remark */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.Remark")}
                  value={formik.values.remark}
                  onChangeText={(text: string) => formik.setFieldValue("remark", text)}
                  required={true}
                  lang={lang}
                />

              </Grid>


              <Grid item lg={8} sm={8} xs={12}></Grid>


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
              {/* <Grid container spacing={1} item>
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
                    label={<CustomLabel text={t("text.AttachedImage")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => {
                      otherDocChangeHandler(e, "file");
                    }}
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
                        src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={`data:image/jpg;base64,${formik.values.file}`}
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
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid> */}


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

export default EditMaintainanceWarrantyMaster;