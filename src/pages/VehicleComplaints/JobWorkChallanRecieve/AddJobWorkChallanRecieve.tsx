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

  const [zoneOption, setzoneOption] = useState([
    { value: -1, label: t("text.zoneID") },
  ]);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");


  const [tableData, setTableData] = useState([{ ...zoneOption }]);

  useEffect(() => {
    getzoneData();
  }, []);

  const getzoneData = async () => {
    const collectData = {
      "zoneID": -1,
      "user_ID": "",
    };
    const response = await api.post(`Zone/GetZonemaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["zoneName"],
        value: data[index]["zoneID"],
      });
    }
    setzoneOption(arr);
  };




  const formik = useFormik({
    initialValues: {
      "indentID": -1,
      "indentNo": "",
      "indentDate": "",
      "reqBefDate": "",
      "deptID": 0,
      "emp_name": "",
      "remark": "",
      "instID": 0,
      "sessionID": 0,
      "approve": "",
      "user_id": 0,
      "divisionId": 0,
      "forward_Status": "",
      "forward_By": 0,
      "forward_On": defaultValues,
      "storeId": 0,
      "l3_Status": "",
      "l3_By": 0,
      "l3_On": defaultValues,
      "mode": "",
      "estimateNo": "",
      "workType": "",
      "proposalNo": "",
      "patCodeNo": "",
      "toStoreId": 0,
      "toDivisionId": 0,
      "is_PMN": "",
      "stage": "",
      "indentinv": [],
      "file":""
    },
    validationSchema: Yup.object({  
      indentNo: Yup.string()
        .required(t("text.reqIndentNum")),
    }),

    onSubmit: async (values) => {

      const response = await api.post(`AreaWardMaster/AddUpdateAreaWardMaster`, values);
      if (response.data.isSucess) {
        toast.success(response.data.message);
        navigate("/vehiclemaster/LicensingInsuranceMaster")
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
                  options={zoneOption}
                  //value={zoneValue}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ChallanRcvNo")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ChallanRcvDate")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ChallanNo")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ChallanDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              {/* Vendor */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Vendor")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.Vendor")}
                  onChange={formik.handleChange}
                />
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ChallanEstAmount")}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Challan Date */}
              <Grid item xs={12} md={4} sm={4}>
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
                    <tr key={0} style={{ border: "1px solid black" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <DeleteIcon
                          //onClick={() => deleteRow(index)}
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
                          options={[1, 2, 3]}
                          fullWidth
                          size="small"
                          // onChange={(e: any, newValue: any) =>
                          //   handleInputChange(
                          //     index,
                          //     "orderNo",
                          //     newValue?.value
                          //   )
                          // }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <CustomLabel
                                  text={t("text.SelectName")}
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
                          options={[1, 2, 3]}
                          fullWidth
                          size="small"
                          // onChange={(e: any, newValue: any) =>
                          //   handleInputChange(
                          //     index,
                          //     "orderNo",
                          //     newValue?.value
                          //   )
                          // }
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
                          // value={row.batchNo}
                          size="small"
                        //onChange={(e) =>handleInputChange(index,"batchNo",e.target.value)}
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
                          // value={row.batchNo}
                          size="small"
                        //onChange={(e) =>handleInputChange(index,"batchNo",e.target.value)}
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
                          // value={row.batchNo}
                          size="small"
                        //onChange={(e) =>handleInputChange(index,"batchNo",e.target.value)}
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
                          options={[1, 2, 3]}
                          fullWidth
                          size="small"
                          // onChange={(e: any, newValue: any) =>
                          //   handleInputChange(
                          //     index,
                          //     "orderNo",
                          //     newValue?.value
                          //   )
                          // }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <CustomLabel
                                  text="0.00"
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
                          // value={row.batchNo}
                          size="small"
                        //onChange={(e) =>handleInputChange(index,"batchNo",e.target.value)}
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
                          // value={row.batchNo}
                          size="small"
                        //onChange={(e) =>handleInputChange(index,"batchNo",e.target.value)}
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
                          // value={row.batchNo}
                          size="small"
                        //onChange={(e) =>handleInputChange(index,"batchNo",e.target.value)}
                        />
                      </td>
                    </tr>

                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7}></td>
                      <td colSpan={2} style={{ fontWeight: "bold" }}>
                        {t("text.TotalServiceAmount")}
                      </td>
                      <td colSpan={1}>
                        <b>:</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={7}></td>
                      <td colSpan={2} style={{ fontWeight: "bold", borderTop: "1px solid black" }}>
                        {t("text.NetAmount")}
                      </td>
                      <td colSpan={1} style={{ borderTop: "1px solid black" }}>
                        <b>:</b>
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