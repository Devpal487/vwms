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

const EditJobCard = (props: Props) => {
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
  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "imageFile") {
      setModalImg("formik.values.imageFile");
    }
  };


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
      "indentinv": []
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



  const ConvertBase64 = (file: Blob) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    console.log("check");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg)$/)) {
        alert("Only image files (jpg, jpeg) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    };
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

              {/* RadioButton */}
              <Grid item xs={12} sm={12} lg={12}>
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.FileNo")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.JobCardDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.VehicleName")}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* UnderControlOf */}
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
                      label={<CustomLabel text={t("text.UnderControlOf")} required={true} />}
                      name="zoneMaster.zoneID"
                      id="zoneMaster.zoneID"
                      placeholder={t("text.UnderControlOf")}
                    />
                  )}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.JobCardNo")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.Department")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.Designation")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.Complaint")}
                  onChange={formik.handleChange}
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
                  name="routeDate"
                  id="routeDate"
                  //value={formik.values.routeDate}
                  placeholder={t("text.ReadingKM")}
                  onChange={formik.handleChange}
                />
              </Grid>


              <Grid item xs={12}>
                <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                  <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                    <tr>
                      <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width:"20rem" }}>{t("text.Services")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Status")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Vendor")}</th>
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
                          type="number"
                          defaultValue={0.0}
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
                        <b>:</b>
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
                        <b>:</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}></td>
                      <td colSpan={2} style={{ fontWeight: "bold" }}>
                        {t("text.TotalAmount")}
                      </td>
                      <td colSpan={1}>
                        <b>:</b>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Grid>


              {/* attachment */}
              <Grid container lg={12} sm={12} xs={12} sx={{ padding: "1rem" }}>
                <Grid item xs={12} md={4} sm={4} sx={{ marginTop: "3rem" }}>
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.Attachment")}
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
                    {"" == "" ? (
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
                        src={"formik.values.imageFile"}
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

export default EditJobCard;