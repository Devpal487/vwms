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

const EditVehicleDetail = (props: Props) => {
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const { defaultValues, defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);
   const location = useLocation();


   const [zoneOption, setzoneOption] = useState([
      { value: -1, label: t("text.zoneID") },
   ]);

   const [categoryOption, setCategoryOption] = useState([
      { value: -1, label: t("text.Category") },
   ]);

   const [itemTypeOption, setitemTypeOption] = useState([
      { value: -1, label: t("text.Type") },
   ]);

   const [unitOption, setUnitOption] = useState([
      { value: -1, label: t("text.Unit") },
   ]);

   const [taxOption, setTaxOption] = useState([
      { value: -1, label: t("text.Tax") },
   ]);

   const [vehicleTypeOption, setVehicleTypeOption] = useState([
      { value: -1, label: t("text.VehicleType") },
   ]);

   const [brandOption, setBrandOption] = useState([
      { value: -1, label: t("text.BrandName") },
   ]);

   const [fuelTypeOption, setFuelTypeOption] = useState([
      { value: -1, label: t("text.FuelType") },
   ]);

   const [empValue, setEmpValue] = useState("");

   const [empOption, setEmpOption] = useState([
      { value: 1, label: t("text.EmpName"), department: "", designation: "" },
   ]);

   const [panOpens, setPanOpen] = React.useState(false);
   const [modalImg, setModalImg] = useState("");
   const [Opens, setOpen] = React.useState(false);
   const [Img, setImg] = useState("");

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
         itemMasterId: location.state?.itemMasterId || 0,
         itemName: location.state?.itemName || "",
         itemCode: location.state?.itemCode || "",
         itemTypeId: location.state?.itemTypeId || 0,
         itemFlag: location.state?.itemFlag || "v",
         itemCategoryId: location.state?.itemCategoryId || 0,
         unitId: location.state?.unitId || 0,
         empId: location.state?.empId || 0,
         vZoneID: location.state?.vZoneID || 0,
         taxId: location.state?.taxId || 0,
         purchaseYear: location.state?.purchaseYear || 0,
         modelNo: location.state?.modelNo || "",
         serialNo: location.state?.serialNo.toString() || "",
         vehicleNo: location.state?.vehicleNo || "",
         tankCapacity: location.state?.tankCapacity || 0,
         actPrice: location.state?.actPrice || 0,
         hsnCode: location.state?.hsnCode || "",
         filename: location.state?.filename || "",
         chesisNo: location.state?.chesisNo || "",
         qcApplicable: location.state?.qcApplicable ?? true,  // Ensuring boolean default works properly
         depreciationRate: location.state?.depreciationRate || 0,
         createdBy: location.state?.createdBy || "adminvm",
         updatedBy: location.state?.updatedBy || "adminvm",
         mileage: location.state?.mileage || 0,
         createdOn: location.state?.createdOn || defaultValues,
         updatedOn: location.state?.updatedOn || defaultValues,
         zoneName: location.state?.zoneName || "",
         vehiclePhotoFile: location.state?.vehiclePhotoFile || "",
         deptName: location.state?.deptName || "",
         desigName: location.state?.desigName || "",
         vehicleTypeId: location.state?.vehicleTypeId || 0,
         brandTypeId: location.state?.brandTypeId || 0,
         fuelTypeId: location.state?.fuelTypeId || 0,
         devid: location.state?.devid || "",
         vehicleWeight: location.state?.vehicleWeight || 0,
         empName: location.state?.empName || "",
         unitName: location.state?.unitName || "",
         itemCatName: location.state?.itemCatName || "",
         taxName: location.state?.taxName || "",
         vehicleType: location.state?.vehicleType || "",
         fuelName: location.state?.fuelName || "",
         brandName: location.state?.brandName || "",
      },
      validationSchema: Yup.object({
         itemName: Yup.string()
            .required(t("Vehicle Name is required")),
         vehicleNo: Yup.string()
            .required(t("Vehicle Number is required")),
      }),

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


   const handlePanClose = () => {
      setPanOpen(false);
   };

   const modalOpenHandle = (event: string) => {
      setPanOpen(true);
      const base64Prefix = "data:image/jpeg;base64,";

      let imageData = '';
      switch (event) {
         case "filename":
            imageData = formik.values.filename;
            break;
         case "vehiclePhotoFile":
            imageData = formik.values.vehiclePhotoFile;
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
                        {t("text.EditVehicleDetail")}
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
                           value={formik.values.zoneName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("vZoneID", parseInt(newValue?.value || -1));
                              formik.setFieldValue("zoneName", newValue.label);
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

                        {formik.touched.itemName && formik.errors.itemName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemName.toString()}</div>
                        )}

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
                           value={formik.values.itemCatName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("itemCategoryId", parseInt(newValue.value));
                              formik.setFieldValue("itemCatName", newValue.label);
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
                           value={itemTypeOption[itemTypeOption.findIndex(item => item.value === formik.values.itemTypeId)]?.label || ""}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              console.log(newValue?.value);
                              formik.setFieldValue("itemTypeId", parseInt(newValue.value))

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
                           value={formik.values.unitName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("unitId", parseInt(newValue.value));
                              formik.setFieldValue("unitName", newValue.label);
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
                           value={formik.values.taxName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("taxId", parseInt(newValue.value));
                              formik.setFieldValue("taxName", newValue.label);
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
                                 required={true}
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
                        {formik.touched.vehicleNo && formik.errors.vehicleNo && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleNo.toString()}</div>
                        )}
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
                           value={formik.values.empName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("empId", parseInt(newValue.value));
                              formik.setFieldValue("empName", newValue.label);
                              formik.setFieldValue("deptName", newValue?.department);
                              formik.setFieldValue("desigName", newValue?.designation);
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
                           value={formik.values.deptName}
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
                           value={formik.values.desigName}
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
                           value={formik.values.vehicleType}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              console.log(newValue?.value);
                              formik.setFieldValue("vehicleTypeId", parseInt(newValue.value));
                              formik.setFieldValue("vehicleType", newValue.label);
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
                           value={formik.values.brandName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("brandTypeId", parseInt(newValue.value));
                              formik.setFieldValue("brandName", newValue.label);
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
                           value={formik.values.fuelName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("fuelTypeId", parseInt(newValue.value));
                              formik.setFieldValue("fuelName", newValue.label);

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
                                    {t("text.RCDocument")}
                                 </strong>
                              }
                              size="small"
                              fullWidth
                              style={{ backgroundColor: "white" }}
                              onChange={(e: any) => otherDocChangeHandler(e, "filename")}
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
                           {formik.values.filename ? (
                              <img
                                 src={
                                    /^(data:image\/(jpeg|jpg|png|xLSPtxB61|9j);base64,)/.test(formik.values.filename)
                                       ? formik.values.filename
                                       : `data:image/jpeg;base64,${formik.values.filename}`
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
                              onClick={() => modalOpenHandle("filename")}
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
                                    {t("text.VehicleImage")}
                                 </strong>
                              }
                              size="small"
                              fullWidth
                              style={{ backgroundColor: "white" }}
                              onChange={(e: any) => otherDocChangeHandler(e, "vehiclePhotoFile")}
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
                           {formik.values.vehiclePhotoFile ? (
                              <img
                                 src={
                                    /^(data:image\/(jpeg|jpg|png|xLSPtxB61|9j);base64,)/.test(formik.values.vehiclePhotoFile)
                                       ? formik.values.vehiclePhotoFile
                                       : `data:image/jpeg;base64,${formik.values.vehiclePhotoFile}`
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
                              onClick={() => modalOpenHandle("vehiclePhotoFile")}
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

export default EditVehicleDetail;