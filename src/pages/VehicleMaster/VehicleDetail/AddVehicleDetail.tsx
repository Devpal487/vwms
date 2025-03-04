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

const AddVehicleDetail = (props: Props) => {
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const { defaultValues } = getISTDate();
   const [toaster, setToaster] = useState(false);

   const [zoneValue, setZoneValue] = useState("");
   const [zoneOption, setzoneOption] = useState([
      { value: -1, label: t("text.zoneID") },
   ]);
   const [categoryValue, setCategoryValue] = useState("");
   const [categoryOption, setCategoryOption] = useState([
      { value: -1, label: t("text.Category") },
   ]);
   const [itemTypeValue, setItemTypeValue] = useState("");
   const [itemTypeOption, setitemTypeOption] = useState([
      { value: -1, label: t("text.Type") },
   ]);
   const [unitValue, setUnitValue] = useState("");
   const [unitOption, setUnitOption] = useState([
      { value: -1, label: t("text.Unit") },
   ]);
   const [taxValue, setTaxValue] = useState("");
   const [taxOption, setTaxOption] = useState([
      { value: -1, label: t("text.Tax") },
   ]);
   const [vehicleTypeValue, setVehicleTypeValue] = useState("");
   const [vehicleTypeOption, setVehicleTypeOption] = useState([
      { value: -1, label: t("text.VehicleType") },
   ]);
   const [brandValue, setBrandValue] = useState("");
   const [brandOption, setBrandOption] = useState([
      { value: -1, label: t("text.BrandName") },
   ]);
   const [fuelTypeValue, setFuelTypeValue] = useState("");
   const [fuelTypeOption, setFuelTypeOption] = useState([
      { value: -1, label: t("text.FuelType") },
   ]);

   const [empValue, setEmpValue] = useState("");
   const [departmentValue, setDepartmentValue] = useState("");
   const [designationValue, setDesignationValue] = useState("");
   const [empOption, setEmpOption] = useState([
      { value: 1, label: t("text.EmpName"), department: "", designation: "" },
   ]);

   useEffect(() => {
      getzoneData();
      getCategoryData();
      getItemTypeData();
      getUnitData();
      getTaxData();
      getVehicletypeData();
      getBrandData();
      getFuelTypeData();
      getEmpData();
   }, []);

   const getzoneData = async () => {
      const collectData = {
         "zoneID": -1
      };
      const response = await api.post(`ZoneMaster/GetZone`, collectData);
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

   const getCategoryData = async () => {
      const collectData = {
         "itemCategoryId": -1
      };
      const response = await api.post(`ItemCategory/GetItemCategory`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["itemCategory"],
            value: data[index]["itemCategoryId"],
         });
      }
      setCategoryOption(arr);
   };

   const getItemTypeData = async () => {
      const collectData = {
         "itemTypeMasterId": -1
      };
      const response = await api.post(`ItemCategory/GetItemType`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["itemType"],
            value: data[index]["itemTypeMasterId"],
         });
      }
      setitemTypeOption(arr);
   };

   const getUnitData = async () => {
      const collectData = {
         "unitId": -1
      };
      const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["unitName"],
            value: data[index]["unitId"],
         });
      }
      setUnitOption(arr);
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
            label: data[index]["taxName"],
            value: data[index]["taxId"],
         });
      }
      setTaxOption(arr);
   };

   const getVehicletypeData = async () => {
      const response = await api.get(`Master/GetVehicleType?VehicleTypeId=-1`);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["vehicleTypename"],
            value: data[index]["vehicleTypeId"],
         });
      }
      setVehicleTypeOption(arr);
   }

   const getBrandData = async () => {
      const response = await api.get(`Master/GetBrand?brandid=-1`);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["brandname"],
            value: data[index]["brandId"],
         });
      }
      setBrandOption(arr);
   }

   const getFuelTypeData = async () => {
      const response = await api.get(`Master/GetFuelType?brandid=-1`);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["fuelTypename"],
            value: data[index]["fuelTypeId"],
         });
      }
      setFuelTypeOption(arr);
   }

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





   const formik = useFormik({
      initialValues: {
         "itemMasterId": 0,
         "itemName": "",
         "itemCode": "",
         "itemTypeId": 0,
         "itemFlag": "I",
         "itemCategoryId": 0,
         "unitId": 0,
         "empId": 0,
         "vZoneID": 0,
         "taxId": 0,
         "purchaseYear": 0,
         "modelNo": "",
         "serialNo": "",
         "vehicleNo": "",
         "tankCapacity": 0,
         "actPrice": 0,
         "hsnCode": "",
         "filename": "",
         "chesisNo": "",
         "qcApplicable": true,
         "depreciationRate": 0,
         "createdBy": "",
         "updatedBy": "",
         "mileage": 0,
         "createdOn": defaultValues,
         "updatedOn": defaultValues,
         "zoneName": "",
         "vehiclePhotoFile": "",
         "vehicleTypeId": 0,
         "brandTypeId": 0,
         "fuelTypeId": 0,
         "devid": "",
         "vehicleWeight": 0
      },
      // validationSchema: Yup.object({
      //    indentNo: Yup.string()
      //       .required(t("text.reqIndentNum")),
      // }),

      onSubmit: async (values) => {
         const response = await api.post(`Master/UpsertVehicleDetail`, values);
         if (response.data.status === 1) {
            toast.success(response.data.message);
            navigate("/vehiclemaster/VehicleDetail")
         } else {
            setToaster(true);
            toast.error(response.data.message);
         }
      },
   });



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
                        {t("text.AddVehicleDetail")}
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


                     {/* zone */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={zoneOption}
                           value={zoneValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("vZoneID", parseInt(newValue.value));
                              formik.setFieldValue("zoneName", newValue.label.toString());
                              setZoneValue(newValue?.label)
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.Zone")} required={false} />}
                                 name="vZoneID"
                                 id="vZoneID"
                                 placeholder={t("text.Zone")}
                              />
                           )}
                        />
                     </Grid>

                     {/* Vehicle name */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TranslateTextField
                           label={t("text.VehicleName")}
                           value={formik.values.itemName}
                           onChangeText={(text: string) => formik.setFieldValue("itemName", text)}
                           required={true}
                           lang={lang}
                        />

                     </Grid>

                     {/* code */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Code")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="itemCode"
                           id="itemCode"
                           value={formik.values.itemCode}
                           placeholder={t("text.Code")}
                           onChange={(e) => {
                              formik.setFieldValue("itemCode", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* hsn code */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.HSNCode")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="hsnCode"
                           id="hsnCode"
                           value={formik.values.hsnCode}
                           placeholder={t("text.HSNCode")}
                           onChange={(e) => {
                              formik.setFieldValue("hsnCode", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* category */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={categoryOption}
                           value={categoryValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("itemCategoryId", parseInt(newValue.value));
                              setCategoryValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.Category")} required={false} />}
                                 name="itemCategoryId"
                                 id="itemCategoryId"
                                 placeholder={t("text.Category")}
                              />
                           )}
                        />
                     </Grid>

                     {/* type */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={itemTypeOption}
                           value={itemTypeValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("itemTypeId", parseInt(newValue.value))
                              setItemTypeValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.Type")} required={false} />}
                                 name="itemTypeId"
                                 id="itemTypeId"
                                 placeholder={t("text.Type")}
                              />
                           )}
                        />
                     </Grid>

                     {/* unit */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={unitOption}
                           value={unitValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("unitId", parseInt(newValue.value));
                              setUnitValue(newValue?.label);

                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.Unit")} required={false} />}
                                 name="unitId"
                                 id="unitId"
                                 placeholder={t("text.Unit")}
                              />
                           )}
                        />
                     </Grid>

                     {/* tax */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={taxOption}
                           value={taxValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("taxId", parseInt(newValue.value));
                              setTaxValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.Tax")} required={false} />}
                                 name="taxId"
                                 id="taxId"
                                 placeholder={t("text.Tax")}
                              />
                           )}
                        />
                     </Grid>

                     {/* model no */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.ModelNo")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="modelNo"
                           id="modelNo"
                           value={formik.values.modelNo}
                           placeholder={t("text.ModelNo")}
                           onChange={(e) => {
                              formik.setFieldValue("modelNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* vehicle number */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VehicleNo")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="vehicleNo"
                           id="vehicleNo"
                           value={formik.values.vehicleNo}
                           placeholder={t("text.VehicleNo")}
                           onChange={(e) => {
                              formik.setFieldValue("vehicleNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* serial no */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.serialNo")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="serialNo"
                           id="serialNo"
                           value={formik.values.serialNo}
                           placeholder={t("text.serialNo")}
                           onChange={(e) => {
                              formik.setFieldValue("serialNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* chesis no */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.ChesisNo")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="chesisNo"
                           id="chesisNo"
                           value={formik.values.chesisNo}
                           placeholder={t("text.ChesisNo")}
                           onChange={(e) => {
                              formik.setFieldValue("chesisNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* purchase year */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.PurchaseYear")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="purchaseYear"
                           id="purchaseYear"
                           value={formik.values.purchaseYear || 0}
                           placeholder={t("text.PurchaseYear")}
                           onChange={(e) => {
                              formik.setFieldValue("purchaseYear", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* under control of */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={empValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("empId", parseInt(newValue.value));
                              setEmpValue(newValue?.label);
                              setDepartmentValue(newValue?.department);
                              setDesignationValue(newValue?.designation);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.UnderControlOf")} required={false} />}
                                 name="empId"
                                 id="empId"
                                 placeholder={t("text.UnderControlOf")}
                              />
                           )}
                        />
                     </Grid>

                     {/* department */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Department")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="Department"
                           id="Department"
                           value={departmentValue}
                           placeholder={t("text.Department")}
                           disabled={true}
                        />
                     </Grid>

                     {/* designation */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Designation")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="Designation"
                           id="Designation"
                           value={designationValue}
                           placeholder={t("text.Designation")}
                           disabled={true}
                        />
                     </Grid>

                     {/* vehicle type */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={vehicleTypeOption}
                           value={vehicleTypeValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("vehicleTypeId", parseInt(newValue.value));
                              setVehicleTypeValue(newValue?.label);

                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.VehicleType")} required={false} />}
                                 name="vehicleTypeId"
                                 id="vehicleTypeId"
                                 placeholder={t("text.VehicleType")}
                              />
                           )}
                        />
                     </Grid>

                     {/* brand */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={brandOption}
                           value={brandValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("brandTypeId", parseInt(newValue.value));
                              setBrandValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.Brand")} required={false} />}
                                 name="brandTypeId"
                                 id="brandTypeId"
                                 placeholder={t("text.Brand")}
                              />
                           )}
                        />
                     </Grid>

                     {/* fuel type */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={fuelTypeOption}
                           value={fuelTypeValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              //console.log(newValue?.value);
                              formik.setFieldValue("fuelTypeId", parseInt(newValue.value));
                              setFuelTypeValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.FuelType")} required={false} />}
                                 name="fuelTypeId"
                                 id="fuelTypeId"
                                 placeholder={t("text.FuelType")}
                              />
                           )}
                        />
                     </Grid>

                     {/* vehicle weight */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VehicleWeightKG")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="vehicleWeight"
                           id="vehicleWeight"
                           value={formik.values.vehicleWeight || 0}
                           placeholder={t("text.VehicleWeightKG")}
                           onChange={(e) => {
                              formik.setFieldValue("vehicleWeight", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* vehicle mileage */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VehicleMileageKMPL")}
                                 required={false}
                              />
                           }

                           variant="outlined"
                           fullWidth
                           size="small"
                           name="mileage"
                           id="mileage"
                           value={formik.values.mileage || 0}
                           placeholder={t("text.VehicleMileageKMPL")}
                           onChange={(e) => {
                              formik.setFieldValue("mileage", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* vehicle device id */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VehicleDeviceId")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="devid"
                           id="devid"
                           value={formik.values.devid}
                           placeholder={t("text.VehicleDeviceId")}
                           onChange={(e) => {
                              formik.setFieldValue("devid", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* Actual price */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.ActualPrice")}
                                 required={false}
                              />
                           }

                           variant="outlined"
                           fullWidth
                           size="small"
                           name="actPrice"
                           id="actPrice"
                           value={formik.values.actPrice || 0}
                           placeholder={t("text.ActualPrice")}
                           onChange={(e) => {
                              formik.setFieldValue("actPrice", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* Tank capacity */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.TankCapacity")}
                                 required={false}
                              />
                           }

                           variant="outlined"
                           fullWidth
                           size="small"
                           name="tankCapacity"
                           id="tankCapacity"
                           value={formik.values.tankCapacity || ""}
                           placeholder={t("text.TankCapacity")}
                           onChange={(e) => {
                              formik.setFieldValue("tankCapacity", parseInt(e.target.value));
                           }}
                        />
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

export default AddVehicleDetail;