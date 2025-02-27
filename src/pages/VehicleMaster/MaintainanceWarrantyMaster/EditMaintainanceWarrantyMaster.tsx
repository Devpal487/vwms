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
import { getId, getISTDate } from "../../../utils/Constant";
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
  const userId = getId();

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
    fetchImage();
    console.log("location", JSON.stringify(location.state));
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

  const fetchImage = async (id: any = location.state?.id || 0) => {
    const collectData = {
      "maintenanceId": id,
      "vendorId": -1,
      "itemId": -1,
      "companyId": -1
    };
    const response = await api.post(
      `Master/GetMaintenanceWarranty`,
      collectData
    );
    const data = response.data.data;
    formik.setFieldValue("attachment", data[0].attachment.replace(/^data:image\/(jpeg|jpg|png|9j);base64,/, ""));
  }




  const formik = useFormik({
    initialValues: {
      id: location.state?.id || 0,
      empId: location.state?.empId || 0,
      effDate: dayjs(location.state?.effDate).format("YYYY-MM-DD") || defaultValues,
      type: location.state?.type || "",
      vendorId: location.state?.vendorId || null,
      itemId: location.state?.itemId || null,
      fromDate: dayjs(location.state?.fromDate).format("YYYY-MM-DD") || defaultValues,
      toDate: dayjs(location.state?.toDate).format("YYYY-MM-DD") || defaultValues,
      remark: location.state?.remark || "",
      attachment: location.state?.attachment || "",
      attachmentName: location.state?.attachmentName || "",
      createdBy: location.state?.createdBy || "",
      updatedBy: userId,
      createdOn: location.state?.createdOn || defaultValues,
      updatedOn: location.state?.updatedOn || defaultValues,
      companyId: location.state?.companyId || 0,
      fyId: location.state?.fyId || 0,
      file: location.state?.file || "",
      empName: location.state?.empName || "",
      vehicleNo: location.state?.vehicleNo || "",
      vendorName: location.state?.vendorName || ""
    },

    validationSchema: Yup.object({
      itemId: Yup.string()
        .required(t("text.reqVehNum")),
      vendorId: Yup.string()
        .required(t("text.reqVendorName")),
      // fromDate: Yup.string()
      //   .required(t("text.reqFromDate")),
      // todate: Yup.string()
      //   .required(t("text.reqToDate")),
      // effDate: Yup.string()
      //   .required(t("text.reqEffectiveDate")),
    }),

    onSubmit: async (values) => {

      const response = await api.post(`Master/UpsertMantenanceWarranty`, values);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/vehiclemanagement/vehiclemaster/maintenance/warranty")
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });



  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: string) => {
    setPanOpen(true);
    const base64Prefix = "data:image/jpeg;base64,";

    let imageData = '';
    switch (event) {
      case "attachment":
        imageData = formik.values.attachment;
        break;
      default:
        imageData = '';
    }
    if (imageData) {
      const imgSrc = imageData.startsWith(base64Prefix) ? imageData : base64Prefix + imageData;
      console.log("imageData", imgSrc);
      setImg(imgSrc);
    } else {
      setImg('');
    }
  };

  const otherDocChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, params: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (only allow images)
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
      alert("Only .jpg, .jpeg, or .png image files are allowed.");
      event.target.value = ''; // Clear input field
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;

      // Use regex to remove the base64 prefix dynamically
      const base64Content = base64String.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");

      if (base64Content) {
        formik.setFieldValue(params, base64Content); // Store the stripped base64 string
      } else {
        alert("Error processing image data.");
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };

    reader.readAsDataURL(file);
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
                {location.state.isView ? t("text.MaintainanceWarranty") : t("text.EditMaintainanceWarranty")}
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
                  value={formik.values.vehicleNo}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemId", parseInt(newValue?.value));
                    formik.setFieldValue("vehicleNo", newValue?.label);
                    formik.setFieldValue("empId", parseInt(newValue?.empId));
                    formik.setFieldValue("empName", newValue?.empName);
                    setItemValue(newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectVehicleNum")} required={true} />}
                      name="itemId"
                      id="itemId"
                      placeholder={t("text.SelectVehicleNum")}
                    />
                  )}
                />
                {formik.touched.itemId && formik.errors.itemId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemId.toString()}</div>
                )}
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
                    formik.setFieldValue("vendorId", parseInt(newValue?.value));
                    formik.setFieldValue("vendorName", newValue?.label);
                    setVendorValue(newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectVendor")} required={true} />}
                      name="vendorId"
                      id="vendorId"
                      placeholder={t("text.SelectVendor")}
                    />
                  )}
                />
                {formik.touched.vendorId && formik.errors.vendorId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.vendorId.toString()}</div>
                )}
              </Grid>


              {/* effective data */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EffectiveDate")}
                      required={true}
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
                {/* {formik.touched.effDate && formik.errors.effDate && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.effDate.toString()}</div>
                )} */}
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
                {/* {formik.touched.fromDate && formik.errors.fromDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.fromDate.toString()}
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
                {/* {formik.touched.toDate && formik.errors.toDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.toDate.toString()}
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
                    onChange={(e: any) => otherDocChangeHandler(e, "attachment")}
                  />
                </Grid>

                <Grid xs={12} md={4} sm={4} item></Grid>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.attachment ? (
                    <img
                      src={
                        /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.attachment)
                          ? formik.values.attachment
                          : `data:image/jpeg;base64,${formik.values.attachment}`
                      }
                      alt="Complaint Document Preview"
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                        objectFit: "cover",  // Ensures proper scaling
                      }}
                    />
                  ) : (
                    <img
                      src={nopdf}
                      alt="No document available"
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  )}

                  <Typography
                    onClick={() => modalOpenHandle("attachment")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                      padding: "20px",
                    }}
                    role="button"
                    aria-label="Preview Document"
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>


                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {Img ? (
                      <img
                        src={Img}
                        alt="Preview"
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <Typography>No Image to Preview</Typography>
                    )}
                  </Box>
                </Modal>
              </Grid>


              {/* Submit Button */}
              <Grid item lg={6} sm={6} xs={12}>
                {location.state.isView ? "" : (
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.update")}
                  </Button>
                )}
              </Grid>

              {/* Reset Button */}
              <Grid item lg={6} sm={6} xs={12}>
                {location.state.isView ? "" : (
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
                )}
              </Grid>

            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EditMaintainanceWarrantyMaster;