// import {
//     Button,
//     CardContent,
//     Grid,
//     Divider,
//     TextField,
//     Typography,
//     TableContainer,
//     TableCell,

//     TableRow,
//     TableHead,
//     Table,
//     TableBody,
//     Select,
//     MenuItem,
//     Paper,
//     Autocomplete,
//     Box,
//     Modal,
// } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import CustomLabel from "../../../CustomLable";
// import api from "../../../utils/Url";
// import { Language } from "react-transliterate";
// import Languages from "../../../Languages";
// import { getISTDate } from "../../../utils/Constant";

// const style = {
//     position: "absolute" as "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "180vh",
//     height: "85vh",
//     bgcolor: "#f5f5f5",
//     border: "1px solid #000",
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 10,
// };
// const StatusOption = [
//     { value: '1', label: '2022-2023' },
//     { value: '2', label: '2023-2024' },
//     { value: '3', label: '2024-2025' },
//     { value: '4', label: '2025-2026' },
// ];

// const CreateStockGeneral = () => {
//     const navigate = useNavigate();

//     const { defaultValues } = getISTDate();
//     const { t } = useTranslation();
//     const [lang, setLang] = useState<Language>("en");
//     const [toaster, setToaster] = useState(false);
//     const [tableData, setTableData] = useState<any>([
//         {
//             id: -1,
//             purchaseid: -1,
//             user_Id: -1,
//             itemNameId: "",
//             unit: "",
//             qty: '',
//             rate: '',
//             amount: 0,
//             tax1: 0,
//             taxId1: 0,
//             tax2: "",
//             discount: '',
//             discountAmount: 0,
//             netAmount: 0,
//             documentNo: "",
//             documentDate: "",
//             invoiceNo: "",
//             supplier: "",
//             orderNo: "",
//             mrnNo: "",
//             mrnDate: "",
//             taxId3: "",
//             tax3: "",
//         },
//     ]);
//     const [indentOptions, setIndentOptions] = useState([
//         { value: "-1", label: t("text.SelectindentNo") },
//     ]);
//     const [taxOption, setTaxOption] = useState<any>([]);
//     const [itemOption, setitemOption] = useState<any>([]);
//     const [unitOptions, setUnitOptions] = useState<any>([]);
//     const [vendorOptions, setVendorOptions] = useState<any>([]);
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [panOpens, setPanOpen] = React.useState(false);
//     const [modalImg, setModalImg] = useState("");
//     const [Opens, setOpen] = React.useState(false);
//     const [Img, setImg] = useState("");
//     console.log("items", tableData);
// const[BatchNo,setBatchNo]=useState("");
//     const back = useNavigate();

//     useEffect(() => {
//         //  getPurchaseOrderNo();
//         getTaxData();
//         GetitemData();
//         GetUnitData();
//         getBATCHNo();
//         // getVendorData();
//         // GetIndentID();
//     }, []);
//   const getBATCHNo = async () => {
//     const result = await api.get(`QualityCheck/GetMaxBatchNo`);
//     if (result?.data.status === 1) {
//       formik.setFieldValue("batchNo", result.data.data[0]["batchNo"]);
//     }
//   };
//     // const GetIndentID = async () => {
//     //     const collectData = {
//     //         indentId: -1,
//     //         indentNo: "",
//     //         empId: -1,
//     //     };


//     //     const response = await api.post(`IndentMaster/GetIndent`, collectData);
//     //     const data = response.data.data;
//     //     console.log("indent option", data)
//     //     const arr = [];
//     //     for (let index = 0; index < data.length; index++) {
//     //         arr.push({
//     //             label: data[index]["indentNo"],
//     //             value: data[index]["indentId"],

//     //         });
//     //     };
//     //     setIndentOptions(arr);
//     // };
//     // const getVendorData = async () => {
//     //     const result = await api.post(`VendorMaster/Ge3tVendorMaster`, { venderId: -1 });
//     //     const data = result.data.data;
//     //     const arr = [];
//     //     for (let index = 0; index < data.length; index++) {
//     //         arr.push({
//     //             label: data[index]["name"],
//     //             value: data[index]["venderId"],
//     //         });
//     //     }
//     //     setVendorOptions([{ value: "-1", label: t("text.supplierName") }, ...arr]);
//     // };

//     // const getPurchaseOrderNo = async () => {
//     //     const result = await api.get(`PurchaseInvoice/GetMaxPurchaseNo`);
//     //     formik.setFieldValue(
//     //         "p_InvoiceNo",
//     //         result.data.data[0]["orderNo"]
//     //     );
//     // };



//     // const getTaxData = async () => {
//     //     const res = await api.post(`TaxMaster/GetTaxMaster`, { taxId: -1 });
//     //     const arr =
//     //         res?.data?.data?.map((item: any) => ({
//     //             label: `${item.taxName} - ${item.taxPercentage}`,
//     //             value: item.taxId,
//     //         })) || [];

//     //     setTaxOption([{ value: "-1", label: t("text.tax") }, ...arr]);
//     // };
//     const getTaxData = async () => {
//         const result = await api.post(`UnitMaster/GetTaxMaster
//     `, {
//             taxId: -1,
//         });
//         if (result.data.status === 1) {
//             const arr =
//                 result?.data?.data?.map((item: any) => ({
//                     label: `${item.taxName} - ${item.taxPercentage}`,
//                     value: item.taxId,
//                 })) || [];

//             setTaxOption([{ value: "-1", label: t("text.tax") }, ...arr]);
//         }
//     };

//     const GetitemData = async () => {
//         const collectData = {
//             itemMasterId: -1,
//         };
//         const response = await api.get(`ItemMaster/GetItemMaster`, {});
//         const data = response.data.data;
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["itemName"],
//                 value: data[index]["itemMasterId"],
//             });
//         };
//         setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
//     };
//     const GetUnitData = async () => {
//         const collectData = {
//             unitId: -1,
//         };
//         const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
//         const data = response.data.data;
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["unitName"],
//                 value: data[index]["unitId"],
//             });
//         }
//         setUnitOptions(arr);
//     };



//     const validateItem = (item: any) => {
//         return (
//             item.itemNameId && item.itemNameId !== -1 &&
//             (item.unit || item.unit === 0) &&
//             parseFloat(item.qty) > 0 &&
//             parseFloat(item.rate) > 0 
//            // parseFloat(item.amount) >= 0 &&
//             // (parseFloat(item.tax1) >= 0 || item.tax1 === "") &&
//             // (parseFloat(item.taxId1) >= 0 || item.taxId1 === "") &&
//             // (parseFloat(item.discount) >= 0 || item.discount === "") &&
//             // parseFloat(item.discountAmount) >= 0 &&
//             // parseFloat(item.netAmount) >= 0
//         );
//     };

//     const formik = useFormik({
//         initialValues: {





//             "sno": 0,
//             "entryNo": 0,
//             "batchNo": "",
//             "itemId": 0,
//             "unitID": 0,
//             "rate": 0,
//             "inQty": 0,
//             "outQty": 0,
//             "voucherId": 0,
//             "stockBinId": 0,
//             "voucherType": "",
//             "voucherDate": defaultValues,
//             "createdBy": "",
//             "updatedBy": "",
//             "createdOn": defaultValues,
//             "updatedOn": defaultValues,
//             "expiryDate": defaultValues,
//             "companyId": 0,
//             "gstRate": 0,
//             "cgst": 0,
//             "sgst": 0,
//             "igst": 0,
//             "gstid": 0,
//             "cgstid": 0,
//             "sgstid": 0,
//             "igstid": 0,
//             "fyearId": 0,
//             "itemMaster": {
//                 //   "itemMasterId": 0,
//                 //   "itemName": "",
//                 //   "itemCode": "",
//                 //   "itemTypeId": 0,
//                 //   "itemFlag": "",
//                 //   "itemCategoryId": 0,
//                 //   "unitId": 0,
//                 //   "empId": 0,
//                 //   "vZoneID": 0,
//                 //   "taxId": 0,
//                 //   "purchaseYear": 0,
//                 //   "modelNo": "",
//                 //   "serialNo": "",
//                 //   "vehicleNo": "",
//                 //   "tankCapacity": 0,
//                 //   "actPrice": 0,
//                 //   "hsnCode": "",
//                 //   "filename": "",
//                 //   "chesisNo": "",
//                 //   "qcApplicable": true,
//                 //   "depreciationRate": 0,
//                 //   "createdBy": "",
//                 //   "updatedBy": "",
//                 //   "mileage": 0,
//                 //   "createdOn": defaultValues,
//                 //   "updatedOn": defaultValues,
//                 //   "zoneName": "",
//                 //   "vehiclePhotoFile": "",
//                 //   "vehicleTypeId": 0,
//                 //   "brandTypeId": 0,
//                 //   "fuelTypeId": 0,
//                 //   "devid": "",
//                 //   "vehicleWeight": 0
//             },
//             "companyMaster": {
//                 //   "id": 0,
//                 //   "name": "",
//                 //   "cityId": 0,
//                 //   "establishYear": 0,
//                 //   "address": "",
//                 //   "pincode": 0,
//                 //   "officeNo": "",
//                 //   "mobileNo": "",
//                 //   "emailId": "",
//                 //   "websiteName": "",
//                 //   "director": "",
//                 //   "companyLogo": "",
//                 //   "gstnNo": "",
//                 //   "panNo": "",
//                 //   "createdBy": "",
//                 //   "updatedBy": "",
//                 //   "createdOn": defaultValues,
//                 //   "updatedOn": defaultValues,
//                 //   "cityName": ""
//             },
//             "finnacialYear": {
//                 //   "fnId": 0,
//                 //   "financialYear": "",
//                 //   "fromDate": defaultValues,
//                 //   "toDate":defaultValues ,
//                 //   "currentYear": true,
//                 //   "createdBy": "",
//                 //   "updatedBy": "",
//                 //   "createdOn": defaultValues,
//                 //   "updatedOn": defaultValues,
//             },
//             "stockledgerlist": [],
//             "unitName": ""





//             // indentNo: "",
//             // batchNo: "",
//             // expiryDate:"",
//             // imageFile: "",
//             // id: -1,
//             // document_No: "",
//             // p_InvoiceNo: "",
//             // doc_Date: "",
//             // p_InvoiceDate: "",
//             // supplierName: "",
//             // orderNo: "",
//             // tax: "",
//             // freight: "",
//             // amount: "",
//             // acc_code: "",
//             // others: "",
//             // remark: "",
//             // instId: -1,
//             // sessionId: -1,
//             // purchaseinv: [],


//         },
//         validationSchema: Yup.object().shape({
//             // document_No: Yup.string().required(t("text.reqDocumentNum")),
//             // orderNo: Yup.string().required(t("text.reqOrderNum")),
//             // doc_Date: Yup.date().required(t("text.reqOrderDate")),
//             // p_InvoiceDate: Yup.date().required(t("text.reqInvDate")),
//             // supplierName: Yup.string().required(t("text.reqSuppName")),
//         }),
//         onSubmit: async (values) => {
//             console.log("Form Submitted with values:", values);
//             const validItems = tableData.filter((item: any) => validateItem(item));

//             // Check if there are valid items
//             // if (validItems.length === 0) {
//             //     alert("Please fill in at least one valid item.");
//             //     return;
//             // }

//             // Map the valid items, setting values at the first index
//             const updatedItems = validItems.map((item: any, index: any) => {
//                 //const documentDate = values.doc_Date;

//                 const baseItem = {
//                     ...item,
//                     id: item.id,
//                     purchaseid: item.purchaseid,
//                     user_Id: item.user_Id,
//                     itemNameId: item.itemNameId.toString(),
//                     unit: item.unit.toString(),
//                     qty: item.qty,
//                     rate: item.rate,
//                     amount: item.amount,
//                     tax1: item.tax1,
//                     taxId1: item.taxId1,
//                     tax2: item.tax2,
//                     discount: item.discount,
//                     discountAmount: item.discountAmount,
//                     netAmount: item.netAmount,
//                     // documentNo: values.document_No,
//                     // documentDate: documentDate,
//                     // invoiceNo: values.p_InvoiceNo,
//                     // supplier: values.supplierName,
//                     // orderNo: values.orderNo,
//                     // mrnNo: "",
//                     // mrnDate: documentDate,
//                     taxId3: "",
//                     tax3: "",
//                 };

//                 if (index === 0) {
//                     return baseItem;
//                 }
//                 return item;
//             });

//             console.log("Form Submitted with values:", values);
//             console.log("Updated Items:", updatedItems);

//             try {
//                 const response = await api.post(
//                     `StockLedger/UpsertStockLedger`,
//                     {
//                         ...values,
//                         // id: values.id.toString(),
//                         // instId: values.instId.toString(),
//                         // sessionId: values.sessionId.toString(),
//                         purchaseinv: updatedItems
//                     }
//                 );
//                 if (response.data.isSuccess) {
//                     setToaster(true);
//                     toast.success(response.data.mesg);
//                     navigate("/Inventory/StockGeneral");
//                 } else {
//                     setToaster(true);
//                     toast.error(response.data.mesg);
//                 }
//             } catch (error) {
//                 setToaster(true);
//                 toast.error(t("error.network"));
//             }
//         },
//     });

//     const handleInputChange = (index: any, field: any, value: any) => {
//         const updatedItems = [...tableData];
//         const item = updatedItems[index];

//         if (["qty", "rate", "discount", "tax1"].includes(field)) {
//             value = value === '' ? '0' : value;
//         }

//         item[field] = value;

//         item.amount = parseFloat(item.qty || '0') * parseFloat(item.rate || '0');
//         let abc = (item.amount * parseFloat(item.tax1 || '0')) / 100;
//         item.taxId1 = abc.toString();

//         item.discountAmount =
//             item.tax2 === "P"
//                 ? (item.amount * parseFloat(item.discount || '0')) / 100
//                 : parseFloat(item.discount || '0');

//         item.netAmount =
//             item.amount + parseFloat(item.taxId1 || '0') - item.discountAmount;

//         setTableData(updatedItems);

//         if (validateItem(item) && index === tableData.length - 1) {
//             handleAddItem();
//         }
//     };

//     const deleteRow = (index: any) => {
//         const updatedItems = tableData.filter((_: any, i: any) => i !== index);
//         setTableData(updatedItems);
//     };
//     const handleAddItem = () => {
//         setTableData([
//             ...tableData,
//             {
//                 itemNameId: "",
//                 unit: "",
//                 qty: 0,
//                 rate: 0,
//                 amount: 0,
//                 tax1: "",
//                 taxId1: "",
//                 tax2: "P",
//                 discount: 0,
//                 discountAmount: 0,
//                 netAmount: 0,
//                 // documentNo: formik.values.document_No,
//                 // documentDate: formik.values.doc_Date,
//                 // invoiceNo: formik.values.p_InvoiceNo,
//                 // supplier: formik.values.supplierName,
//                 // orderNo: formik.values.orderNo,
//                 mrnNo: "",
//                 mrnDate: "",
//                 taxId3: "",
//                 tax3: "",
//             },
//         ]);
//     };

//     useEffect(() => {
//         const calculatedTotalAmount = tableData.reduce(
//             (acc: any, item: any) => acc + item.netAmount,
//             0
//         );
//         setTotalAmount(calculatedTotalAmount);
//         formik.setFieldValue('amount', calculatedTotalAmount.toFixed(2));
//     }, [tableData]);


//     return (
//         <div>
//             <div
//                 style={{
//                     padding: "5px",
//                     backgroundColor: "#ffffff",
//                     borderRadius: "5px",
//                     border: ".5px solid #FF7722",
//                     marginTop: "3vh",
//                 }}
//             >
//                 <CardContent>
//                     <Grid item xs={12} container spacing={2}>
//                         <Grid item lg={2} md={2} xs={2} marginTop={2}>
//                             <Button
//                                 type="submit"
//                                 onClick={() => back(-1)}
//                                 variant="contained"
//                                 style={{
//                                     backgroundColor: "blue",
//                                     width: 20,
//                                 }}
//                             >
//                                 <ArrowBackSharpIcon />
//                             </Button>
//                         </Grid>
//                         <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
//                             <Typography
//                                 gutterBottom
//                                 variant="h5"
//                                 component="div"
//                                 sx={{ padding: "20px" }}
//                                 align="center"
//                             >
//                                 {t("text.CreateStockGeneral")}
//                             </Typography>
//                         </Grid>

//                         <Grid item lg={3} md={3} xs={3} marginTop={3}>
//                             <select
//                                 className="language-dropdown"
//                                 value={lang}
//                                 onChange={(e) => setLang(e.target.value as Language)}
//                             >
//                                 {Languages.map((l: any) => (
//                                     <option key={l.value} value={l.value}>
//                                         {l.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </Grid>
//                     </Grid>
//                     <Divider />
//                     <br />
//                     <form onSubmit={formik.handleSubmit}>
//                         {toaster && <ToastApp />}
//                         <Grid item xs={12} container spacing={2}>
//                             <Grid item xs={12} sm={4} lg={3}>
//                                 <TextField
//                                     label={
//                                         <CustomLabel
//                                             text={t("text.enterbatchNo")}
//                                             required={true}
//                                         />
//                                     }
//                                     //variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                    name="batchNo"
//                                     id="batchNo"
//                                     value={formik.values.batchNo}
//                                     //placeholder={t("text.enterbatchNo")}
//                                   //  onChange={formik.handleChange}
//                                 />
//                                 {/* {formik.touched.batchNo && formik.errors.batchNo ? (
//                                     <div style={{ color: "red", margin: "5px" }}>
//                                         {formik.errors.batchNo}
//                                     </div>
//                                 ) : null} */}
//                             </Grid>





//                             <Grid item lg={3} xs={12}>
//                                 <TextField
//                                     id="voucherDate"
//                                     name="voucherDate"
//                                     label={
//                                         <CustomLabel
//                                             text={t("text.StockDate")}
//                                             required={true}
//                                         />
//                                     }
//                                     value={formik.values.voucherDate}
//                                     placeholder={t("text.StockDate")}
//                                     size="small"
//                                     type="date"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     InputLabelProps={{ shrink: true }}
//                                     error={
//                                         formik.touched.voucherDate &&
//                                         Boolean(formik.errors.voucherDate)
//                                     }
//                                     helperText={
//                                         formik.touched.voucherDate && formik.errors.voucherDate
//                                     }
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={3} lg={3}>
//                                 <TextField
//                                     label={
//                                         <CustomLabel
//                                             text={t("text.enterexpiryDate")}
//                                             required={false}
//                                         />
//                                     }
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     name="expiryDate"
//                                     id="expiryDate"
//                                     type="date"
//                                     value={formik.values.expiryDate}
//                                     placeholder={t("text.enterexpiryDate")}
//                                     onChange={formik.handleChange}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>




//                             <Grid item xs={12} sm={3} lg={3}>
//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={StatusOption}
//                                     fullWidth
//                                     size="small"
//                                     onChange={(event: any, newValue: any) => {
//                                         formik.setFieldValue("status", newValue?.value.toString());
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label={<CustomLabel text={t("text.financialyear")} required={false} />}
//                                         />
//                                     )}
//                                 />
//                             </Grid>






//                             <Grid item lg={12} md={12} xs={12} textAlign={"center"} fontSize={12} fontWeight={800}>
//                                 {/* <Typography
//                                     variant="h6"
//                                     textAlign="center"
//                                 >
//                                     {t("text.Purchaseorderdetails")}
//                                 </Typography> */}

//                             </Grid>
//                             {/* 
//                             <Grid item lg={12} md={12} xs={12}>
                           
//                                 <Table
//                                     style={{
//                                         borderCollapse: "collapse",
//                                         width: "100%",
//                                         border: "1px solid black",
//                                     }}
//                                 >
//                                     <thead
//                                         style={{ backgroundColor: "#2B4593", color: "#f5f5f5" }}
//                                     >
//                                         <tr>

//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.ItemName")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Unit")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Quantity")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Rate")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Amount")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Tax")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.TaxAmount")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.DiscountType")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Discount")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.DiscountAmount")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.NetAmount")}
//                                             </th>
//                                             <th
//                                                 style={{
//                                                     border: "1px solid black",
//                                                     textAlign: "center",
//                                                     padding: "5px",
//                                                 }}
//                                             >
//                                                 {t("text.Action")}
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody style={{ padding: "2px" }}>
//                                         {items.map((item: any, index: any) => (
//                                             <tr key={item.id} style={{ border: "1px solid black", padding: "2px" }}>
                                              
//                                                 <td
//                                                     style={{
//                                                         border: "1px solid black",
//                                                         textAlign: "center",
//                                                     }}
//                                                 >
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={itemOption}
//                                                         fullWidth
//                                                         size="small"
//                                                         onChange={(e: any, newValue: any) =>
//                                                             handleItemChange(
//                                                                 index,
//                                                                 "itemNameId",
//                                                                 newValue?.value
//                                                             )
//                                                         }
//                                                         renderInput={(params) => (
//                                                             <TextField
//                                                                 {...params}
//                                                                 label={
//                                                                     <CustomLabel text={t("text.selectItem")} required={false} />
//                                                                 }
//                                                             />
//                                                         )}
//                                                     />

//                                                 </td>
//                                                 <td
//                                                     style={{
//                                                         border: "1px solid black",
//                                                         textAlign: "center",
//                                                     }}
//                                                 >
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={unitOptions}
//                                                         fullWidth
//                                                         size="small"
//                                                         onChange={(e: any, newValue: any) => handleItemChange(index, "unit", newValue?.value)}
//                                                         renderInput={(params) => (
//                                                             <TextField
//                                                                 {...params}
//                                                                 label={
//                                                                     <CustomLabel text={t("text.selectUnit")} required={false} />
//                                                                 }
//                                                             />
//                                                         )}
//                                                     />
//                                                 </td>
//                                                 <td style={{ textAlign: "right" }}>
//                                                     <TextField
//                                                         type="text"
//                                                         value={item.qty}
//                                                         onChange={(event) => {
//                                                             const value: any = event.target.value;
//                                                             handleItemChange(index, "qty", value);
                                                            
//                                                         }}
//                                                         inputProps={{
//                                                             step: "any",
//                                                             min: "0"
//                                                         }}
//                                                         size="small"
//                                                     />
//                                                 </td>
//                                                 <td style={{ textAlign: "right" }} >
//                                                     <TextField
//                                                         type="text"
//                                                         value={item.rate}
//                                                         onChange={(e) => {
//                                                             const value = e.target.value;
//                                                             if (value === '' || /^\d*\.?\d*$/.test(value)) {
//                                                                 handleItemChange(
//                                                                     index,
//                                                                     "rate",
//                                                                     value === '' ? '' : (value)
//                                                                 )
//                                                             }
//                                                         }}
//                                                         inputProps={{
//                                                             step: "any",
//                                                             min: "0"
//                                                         }}
//                                                         size="small"
//                                                     />
//                                                 </td>
//                                                 <td>{item.amount.toFixed(2)}</td>
//                                                 <td>

//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={taxOption}
//                                                         fullWidth
//                                                         size="small"
//                                                         onChange={(e, newValue: any) =>
//                                                             handleItemChange(
//                                                                 index,
//                                                                 "tax1",
//                                                                 newValue?.value?.toString()
//                                                             )
//                                                         }
//                                                         renderInput={(params) => (
//                                                             <TextField
//                                                                 {...params}
//                                                                 label={
//                                                                     <CustomLabel text={t("text.tax")} required={false} />
//                                                                 }
//                                                             />
//                                                         )}
//                                                     />
//                                                 </td>
//                                                 <td>{item.taxId1}</td>
//                                                 <td>
//                                                     <Select
//                                                         value={item.tax2}
//                                                         onChange={(e) =>
//                                                             handleItemChange(index, "tax2", e.target.value)
//                                                         }
//                                                         size="small"
//                                                     >
//                                                         <MenuItem value="P">Pct(%)</MenuItem>
//                                                         <MenuItem value="F">Fix</MenuItem>
//                                                     </Select>
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         type="text"
//                                                         value={item.discount}
//                                                         onChange={(event) =>
//                                                             handleItemChange(
//                                                                 index,
//                                                                 "discount",
//                                                                 (event.target.value)
//                                                             )
//                                                         }
//                                                         size="small"
//                                                     />
//                                                 </td>
//                                                 <td>{item.discountAmount.toFixed(2)}</td>
//                                                 <td>{item.netAmount.toFixed(2)}</td>
//                                                 <td>
//                                                     <Button
//                                                         onClick={() => handleRemoveItem(index)}
//                                                         variant="text"
//                                                         color="secondary"
//                                                     >
//                                                         <DeleteIcon />
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                         <tr style={{ backgroundColor: "#2B4593" }}>
//                                             <td colSpan={10} style={{ textAlign: "right" }}>
//                                                 <strong style={{ color: "#fff" }}>
//                                                     {t("text.totalAmount")}:
//                                                 </strong>
//                                             </td>
//                                             <td colSpan={3}>
//                                                 <strong style={{ color: "#fff" }}>
//                                                     {totalAmount.toFixed(2)}
//                                                 </strong>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </Table>
                                
//                             </Grid>

//                               <Grid item xs={12}> */}


//                             <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
//                                 <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
//                                     <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
//                                         <tr>

//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.itemName")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.quantity")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Rate")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.gst")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.cgst")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.sgst")}</th>
//                                             {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.totalAmount")}</th> */}


//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {tableData.map((row: any, index: any) => (
//                                             <tr key={row.id} style={{ border: '1px solid black' }}>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => {
//                                                     if (tableData.length > 1) {
//                                                         deleteRow(index)
//                                                     } else {
//                                                         alert("There should be atleast one row")
//                                                     }
//                                                 }}>
//                                                     <DeleteIcon />
//                                                 </td>

//                                                 <td
//                                                     style={{
//                                                         border: "1px solid black",
//                                                         // textAlign: "center",
//                                                     }}
//                                                 >
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={itemOption}
//                                                         fullWidth
//                                                         size="small"
//                                                         onChange={(e: any, newValue: any) => {
//                                                             if (!newValue) {
//                                                                 return;
//                                                             } else {
//                                                                 handleInputChange(
//                                                                     index,
//                                                                     "itemId",
//                                                                     newValue?.value
//                                                                 )
//                                                             }
//                                                         }
//                                                         }
//                                                         renderInput={(params) => (
//                                                             <TextField
//                                                                 {...params}

//                                                             />
//                                                         )}
//                                                     />
//                                                 </td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center' }}>

//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={unitOptions}
//                                                         fullWidth
//                                                         size="small"
//                                                         onChange={(e: any, newValue: any) => {
//                                                             if (!newValue) {
//                                                                 return;
//                                                             } else {
//                                                                 handleInputChange(
//                                                                     index,
//                                                                     "unitID",
//                                                                     newValue?.value
//                                                                 )
//                                                             }
//                                                         }
//                                                         }
//                                                         renderInput={(params) => (
//                                                             <TextField
//                                                                 {...params}

//                                                             />
//                                                         )}
//                                                     />

//                                                 </td>


//                                                 <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
//                                                     <TextField

//                                                         size="small"
//                                                         // type="text"
//                                                         value={row.quantity}
//                                                         onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value) || 0)}
//                                                         onFocus={(e) => { e.target.select() }}
//                                                     />
//                                                 </td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
//                                                     <TextField

//                                                         size="small"
//                                                         // type="text"
//                                                         value={row.approveQuantity}
//                                                         onChange={(e) => handleInputChange(index, 'approveQuantity', parseFloat(e.target.value) || 0)}
//                                                         onFocus={(e) => { e.target.select() }}
//                                                     />
//                                                 </td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
//                                                     <TextField

//                                                         size="small"
//                                                         // type="text"
//                                                         value={row.rate}
//                                                         onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
//                                                         onFocus={(e) => { e.target.select() }}
//                                                     />
//                                                 </td>

//                                                 <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
//                                                     <TextField
//                                                         // type="number"
//                                                         value={row.amount.toFixed(2)}
//                                                         size="small"
//                                                         inputProps={{ "aria-readonly": true }}
//                                                         onFocus={(e) => { e.target.select() }}
//                                                     />
//                                                 </td>

//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                     <tfoot>
//                                         <tr>
//                                             <td colSpan={7} style={{ textAlign: "right", fontWeight: "bold" }}>
//                                                 {t("text.Totalnetamount")}

//                                             </td>
//                                             <td style={{ textAlign: "center", border: "1px solid black" }}>
//                                                 {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
//                                             </td>
//                                         </tr>


//                                     </tfoot>
//                                 </Table>
//                             </div>   </Grid>


//                         <Grid item xs={12}>
//                             <div style={{ justifyContent: "space-between", flex: 2 }}>
//                                 <Button
//                                     type="submit"
//                                     variant="contained"
//                                     style={{
//                                         width: "48%",
//                                         backgroundColor: `var(--header-background)`,
//                                         margin: "1%",
//                                     }}
//                                 >
//                                     {t("text.save")}
//                                 </Button>

//                                 <Button
//                                     type="reset"
//                                     variant="contained"
//                                     style={{
//                                         width: "48%",
//                                         backgroundColor: "#F43F5E",
//                                         margin: "1%",
//                                     }}
//                                     onClick={() => formik.resetForm()}
//                                 >
//                                     {t("text.reset")}
//                                 </Button>
                          
//                             </div>
//                     </Grid>
//                 </form>
//             </CardContent>
//         </div>
//         </div >
//     );
// };


// export default CreateStockGeneral;



import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    Divider,
    MenuItem,
    TextField,
    Typography,
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
import { getISTDate } from "../../../utils/Constant";

type Props = {};

const CreateStockGeneral = (props: Props) => {
    let navigate = useNavigate();
    const { defaultValues, defaultValuestime } = getISTDate();
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const [toaster, setToaster] = useState(false);
    const [lang, setLang] = useState<Language>("en");

    const [option, setOption] = useState([
        { value: "-1", label: t("text.SelectItemType") },
    ]);
    const [taxOptions, setTaxOptions] = useState([
        { value: "-1", label: t("text.SelectTaxId") },
    ]);
    // const [itemCategoryOptions, setitemCategoryOptions] = useState([
    //     { value: "-1", label: t("text.itemCategory") },
    // ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [taxIds, setTaxIds] = useState(0);
    const [totalAmountafterTax, setTotalAmountafterTax] = useState(0);

    useEffect(() => {
       // GetitemCategoryData();
        GetItemTypeData();
        GetTaxData();
        GetUnitData()
    }, []);

    const GetItemTypeData = async () => {
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
                taxid: data[index]["taxId"],
            });
        }
        setOption(arr);
    };
    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    const GetTaxData = async () => {
        const collectData = {
            taxId: -1,
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
        setTaxOptions(arr);
    };

    const GetUnitData = async () => {
        const collectData = {
            unitId: -1,
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
        setUnitOptions(arr);
    };
    const formik = useFormik({
        initialValues: {
    "sno": 0,
    "entryNo": 0,
    "batchNo": "",
    "itemId": 0,
    "unitID": 0,
    "rate": 0,
    "inQty": 0,
    "outQty": 0,
    "voucherId": 0,
    "stockBinId": 0,
    "voucherType": "",
    "voucherDate": defaultValues,
    "createdBy": "adminvm",
    "updatedBy": "adminvm",
    "createdOn": defaultValues,
    "updatedOn": defaultValues,
    "expiryDate": defaultValues,
    "companyId": 0,
    "gstRate": 0,
    "cgst": 0,
    "sgst": 0,
    "igst": 0,
    "gstid": 0,
    "cgstid": 0,
    "sgstid": 0,
    "igstid": 0,
    "fyearId": 0,
    "itemMaster": {
      "itemMasterId": 0,
      "itemName": "",
      "itemCode": "",
      "itemTypeId": 0,
      "itemFlag": "",
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
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
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
    "companyMaster": {
      "id": 0,
      "name": "",
      "cityId": 0,
      "establishYear": 0,
      "address": "",
      "pincode": 0,
      "officeNo": "",
      "mobileNo": "",
      "emailId": "",
      "websiteName": "",
      "director": "",
      "companyLogo": "",
      "gstnNo": "",
      "panNo": "",
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "cityName": ""
    },
    "finnacialYear": {
      "fnId": 0,
      "financialYear": "",
      "fromDate": defaultValues,
      "toDate":defaultValues ,
      "currentYear": true,
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
    },
    "stockledgerlist": [],
    "unitName": ""

        },

        validationSchema: Yup.object({
            batchNo: Yup.string().required(t("text.reqBatchnum")),
            inQty: Yup.string().required(t("text.reqQuantity")),
        }),

        onSubmit: async (values) => {
            console.log("Formik", values);
            const response = await api.post(
                `StockLedger/UpsertStockLedger`,
                values
            );
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/storemanagement/stockopening");
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
                    <Typography
                        variant="h5"
                        textAlign="center"
                        style={{ fontSize: "18px", fontWeight: 500 }}
                    >
                        {t("text.CreateStockGeneral")}
                    </Typography>

                    <Grid item sm={4} xs={12}>
                        <Typography style={{ marginTop: "-75px" }}>
                            <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    marginBottom: 15,
                                    marginTop: "45px",
                                    backgroundColor: `var(--header-background)`,
                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button>
                        </Typography>
                    </Grid>
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterbatchNo")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="batchNo"
                                    id="batchNo"
                                    value={formik.values.batchNo}
                                    placeholder={t("text.enterbatchNo")}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.batchNo && formik.errors.batchNo ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.batchNo}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-item"
                                    options={option}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        if (newValue) {
                                            console.log(newValue);
                                            formik.setFieldValue("itemId", newValue?.value);
                                            formik.setFieldValue("gstid", newValue?.taxid);
                                            formik.setFieldValue("itemName", newValue?.label);

                                            setTaxIds(newValue?.taxid);
                                        } else {
                                            formik.setFieldValue("itemId", "");
                                            setTaxIds(0);
                                        }
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectitemId")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-unit"
                                    options={unitOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue);
                                        formik.setFieldValue("unitId", newValue?.value);
                                        formik.setFieldValue("unitName", newValue?.label);
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.enterunitId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterrate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="rate"
                                    id="rate"
                                    value={formik.values.rate}
                                    placeholder={t("text.enterrate")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.inqty")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="inQty"
                                    id="inQty"
                                    type="text"
                                    value={formik.values.inQty}
                                    placeholder={t("text.inqty")}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e: any) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        formik.setFieldValue("inQty", value ? Number(value) : '');
                                        setTotalAmount(Number(value) * Number(formik.values.rate));
                                        const taxValue = taxOptions.find((x: any) => x.value === taxIds);
                                        let taxAmount = Number(value) * Number(formik.values.rate) * Number(taxValue?.label) / 100;
                                        console.log(taxValue);
                                        formik.setFieldValue("gstRate", taxValue?.label);
                                        setTotalTax(taxAmount);
                                        formik.setFieldValue("cgst", taxAmount / 2);
                                        formik.setFieldValue("sgst", taxAmount / 2);
                                        formik.setFieldValue("igst", 0);
                                        formik.setFieldValue("cgstid", -1);
                                        formik.setFieldValue("sgstid", -1);
                                        formik.setFieldValue("igstid", -1);
                                        setTotalAmountafterTax(Number(value) * Number(formik.values.rate) + taxAmount);
                                    }}
                                />
                                {formik.touched.inQty && formik.errors.inQty ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.inQty}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterexpiryDate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="expiryDate"
                                    id="expiryDate"
                                    type="date"
                                    value={formik.values.expiryDate}
                                    placeholder={t("text.enterexpiryDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.totalAmount")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={totalAmount}
                                    placeholder={t("text.totalAmount")}
                                //onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.totalTax")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={totalTax}
                                    placeholder={t("text.totalTax")}
                                // onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.totalAmountafterTax")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={totalAmountafterTax}
                                    placeholder={t("text.totalAmountafterTax")}
                                // onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
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
                            </Grid>
                            <Grid item lg={6} sm={6} xs={12}>
                                <Button
                                    type="reset"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#F43F5E",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={(e: any) => formik.resetForm()}
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

export default CreateStockGeneral;
