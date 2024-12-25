import {
  Button,
  CardContent,
  Grid,
  Divider,
  TextField,
  Typography,
  Table,
  Select,
  MenuItem,
  Paper,
  Autocomplete,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import CustomLabel from "../../CustomLable";
import api from "../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../Languages";
import { getISTDate } from "../../utils/Constant";
import { CheckBox } from "@mui/icons-material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import nopdf from "../../assets/images/nopdf.png";

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

const LightInstallationAdd = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);

  const [items, setItems] = useState<any>([
    {
      lightInstallationId: -1,
      lightInstId: -1,
      itemId: 0,
      lightNo: "",
      walt: "",
      itemName: "",
    },
  ]);
  const [taxOption, setTaxOption] = useState([
    { value: "-1", label: t("text.SelectWard") },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [contentOptions, setContentOptions] = useState([
    { value: "-1", label: t("text.SelectItem") },
  ]);

  const [Option, setOption] = useState([
    { value: "-1", label: t("text.SelectZone") },
  ]);


  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "apprImg") {
      setModalImg(formik.values.apprImg);
    }
  };

  const handlePanClose = () => {
    setPanOpen(false);
    
  };
  


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
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg|png)$/)) {
        alert("Only image files (jpg, jpeg,png) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }
  
      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    }
  };
  

  const back = useNavigate();

  useEffect(() => {
    GetDigitalContentData();
    getTaxData();

    getSupliar();
  }, []);

  const getSupliar = async () => {
    const collectData = {
      zoneID: -1,
      user_ID: "",
    };
    const res = await api.post(`Zone/GetZonemaster`, collectData);
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: item.zoneName,
        value: item.zoneID,
      })) || [];

    setOption(arr);
  };
  const getTaxData = async () => {
    const collectData = {
      areaID: -1,
    };
    const res = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: item.areaName,
        value: item.areaID,
      })) || [];

    setTaxOption(arr);
  };

  const GetDigitalContentData = async () => {
    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setContentOptions(arr);
  };

  const formik = useFormik({
    initialValues: {
      lightInstId: -1,
      zoneId: 0,
      wordId: 0,
      poleNo: "",
      instDate: new Date().toISOString().slice(0, 10),
      instBy: 1,
      apprBy: 1,
      apprImg: "",
      apprDate: new Date().toISOString().slice(0, 10),
      zoneName: "",
      wardName: "",
      lightInstalChild: [],
    },

    onSubmit: async (values) => {
     // console.log("Form Submitted with values:", values);

      const validItems = items.filter((item: any) => validateItem(item));

      values.lightInstalChild = validItems;

      try {
        const response = await api.post(
          `LightInstallation/AddUpdateLightInstallation`,
          values
        );
        if (response.data.isSuccess) {
          setToaster(false);
          toast.success(response.data.mesg);
          setTimeout(() => {
            navigate("/installation/LightInstallation");
          }, 700);
        } else {
          setToaster(true);
          toast.error(response.data.mesg);
        }
      } catch (error) {
        setToaster(true);
        toast.error(t("error.network"));
      }
    },
  });

  const validateItem = (item: any) => {
    return item.itemId && item.lightNo && item.walt;
  };

  const handleRemoveItem = (index: any) => {
    const updatedItems = items.filter((_: any, i: any) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index: any, field: any, value: any) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    if (
      validateItem(updatedItems[index]) &&
      index === updatedItems.length - 1
    ) {
      handleAddItem();
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        lightInstallationId: -1,
        lightInstId: -1,
        itemId: 0,
        lightNo: "",
        walt: "",
        itemName: "",
      },
    ]);
  };

  return (
    <div>
      <div
        style={{
          padding: "5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
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
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreateLightInstallation")}
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
            {toaster && <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Option}
                  //   value={
                  //     Option.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("zoneId", newValue?.value);
                    formik.setFieldValue("zoneName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectZone")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOption}
                  //   value={
                  //     Option.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("wordId", newValue?.value);
                    formik.setFieldValue("wardName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectWard")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.LightInstallationDate")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="instDate"
                  id="instDate"
                  type="date"
                  value={formik.values.instDate}
                  placeholder={t("text.LightInstallationDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  label={
                    <CustomLabel text={t("text.apprdate")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="apprDate"
                  id="apprDate"
                  type="date"
                  value={formik.values.apprDate}
                  placeholder={t("text.apprdate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  label={
                    <CustomLabel text={t("text.PoleNo")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="poleNo"
                  id="poleNo"
                  type="text"
                  value={formik.values.poleNo}
                  placeholder={t("text.PoleNo")}
                  onChange={formik.handleChange}
                 
                />
              </Grid>



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
                    label={<CustomLabel text={t("text.apprImg")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "apprImg")}
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
                    {formik.values.apprImg == "" ? (
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
                        src={formik.values.apprImg}
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
                      onClick={() => modalOpenHandle("apprImg")}
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
            

              <Grid item lg={12} md={12} xs={12} textAlign={"center"}>
                {/* <Typography variant="h6" textAlign="center">
                      {t("text.Purchaseorder")}
                    </Typography> */}
              </Grid>

              <Grid item lg={12} md={12} xs={12}>
                {/* <TableContainer> */}
                <div style={{ overflowX: "auto" }}>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <thead
                      style={{ backgroundColor: "#2B4593", color: "#f5f5f5" }}
                    >
                      <tr>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.ItemName")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.lightNo")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.walt")}
                        </th>

                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any, index: any) => (
                        <tr key={item.id} style={{ border: "1px solid black" }}>
                          <td style={{width:"300px"}}>
                            <Autocomplete
                              disablePortal
                              fullWidth
                              id="combo-box-demo"
                              options={contentOptions}
                              size="small"
                              onChange={(event, newValue: any) => {
                                handleItemChange(
                                  index,
                                  "itemId",
                                  newValue?.value
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("text.ItemName")}
                                />
                              )}
                            />
                          </td>

                          <td>
                            <TextField
                              type="text"
                              value={item?.lightNo}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "lightNo",
                                  String(e.target.value)
                                )
                              }
                              
                              fullWidth
                            />
                          </td>
                          <td>
                            <TextField
                              type="text"
                              value={item?.walt}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "walt",
                                  String(e.target.value)
                                )
                              }
                              
                              fullWidth
                            />
                          </td>

                          <td>
                            <Button
                              onClick={() => handleRemoveItem(index)}
                              variant="text"
                              color="secondary"
                            >
                              <DeleteIcon />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {/* </TableContainer> */}
              </Grid>

              <Grid item xs={12}>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: `var(--header-background)`,
                      margin: "1%",
                    }}
                  >
                    {t("text.save")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default LightInstallationAdd;
