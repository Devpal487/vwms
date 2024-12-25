import {
    Button,
    CardContent,
    Grid,
    Divider,
    TextField,
    Typography,
    TableContainer,
    TableCell,
    TableRow,
    TableHead,
    Table,
    TableBody,
    Select,
    MenuItem,
    Paper,
    Autocomplete,
    Box,
    Modal,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import nopdf from '../../../assets/images/imagepreview.jpg'
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import { getISTDate } from "../../../utils/Constant";

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
const StatusOption = [
    { value: 'open', label: 'Open' },
    { value: 'close', label: 'Close' },
  
];

const CreateWorkShopPurchaseOrder = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { defaultValues } = getISTDate();
    const [lang, setLang] = useState<Language>("en");
    const [toaster, setToaster] = useState(false);
    const [items, setItems] = useState<any>([
        {
            "sno": 0,
            "id": -1,
            "orderId": -1,
            "itemId": 0,
            "quantity": 0,
            "rate": 0,
            "amount": 0,
            "gstId": 0,
            "gstRate": 0,
            "cgst": 0,
            "sgst": 0,
            "igst": 0,
            "cgstid": 0,
            "sgstid": 0,
            "igstid": 0,
            "gst": 0,
            "netAmount": 0,
            "fyId": 0,
            "srn": 0,
            "balQuantity": 0,
            "isDelete": true,
            "itemName": ""

            // id: -1,
            // purchaseid: -1,
            // user_Id: -1,
            // itemNameId: "",
            // unit: "",
            // qty: '',
            // rate: '',
            // amount: 0,
            // tax1: 0,
            // taxId1: 0,
            // tax2: "P",
            // discount: '',
            // discountAmount: 0,
            // netAmount: 0,
            // documentNo: "",
            // documentDate: "",
            // invoiceNo: "",
            // supplier: "",
            // orderNo: "",
            // mrnNo: "",
            // mrnDate: "",
            // taxId3: "",
            // tax3: "",
        },
    ]);
    const [indentOptions, setIndentOptions] = useState([
        { value: "-1", label: t("text.SelectindentNo") },
    ]);
    const [docOpen, setDocOpen] = useState(false);
    const [taxOption, setTaxOption] = useState<any>([]);
    const [itemOption, setitemOption] = useState<any>([]);
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [vendorOptions, setVendorOptions] = useState<any>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");
    console.log("items", items);
  const [vendorData, setVendorData] = useState([]);
    const back = useNavigate();

    useEffect(() => {
        getPurchaseOrderNo();
        getTaxData();
        GetitemData();
        GetUnitData();
        getVendorData();
        GetIndentID();
    }, []);

    const GetIndentID = async () => {
        const collectData = {
            indentId: -1,
            indentNo: "",
            empId: -1,
        };


        const response = await api.post(`Master/GetIndent`, collectData);
        const data = response.data.data;
        console.log("indent option", data)
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["indentNo"],
                value: data[index]["indentId"],

            });
        };
        setIndentOptions(arr);
    };

    const getVendorData = async () => {
        const result = await api.post(`Master/GetVendorMaster`, {
         "venderId": -1,
      "countryId": -1, 
      "stateId": -1,
      "cityId": -1
        });
        if (result.data.isSuccess) {
          const arr =
            result?.data?.data?.map((item: any) => ({
              label: `${item.venderId} - ${item.name}`,
              value: item.venderId,
              details: item,
            })) || [];
    
          setVendorData([
            { value: "-1", label: t("text.SelectVendor") },
            ...arr,
          ] as any);
        }
      };
//     const getPurchaseOrderNo = async () => {
//         const collectData = {
//             // "id": -1
// //             "orderId": -1,
// // "indentId": -1
//          };
//         const result = await api.get(`PurchaseOrder/GetPurchaseOrderNo`,{});
//         formik.setFieldValue(
//             "p_InvoiceNo",
//             result.data.data[0]["orderNo"]
//         );
//     };

    // const getPurchaseOrderNo = async () => {
    //     const result = await api.get(`PurchaseOrder/GetPurchaseOrderNo`);
    //     if (result?.data.status === 1) {
    //       formik.setFieldValue("orderNo", result.data.data[0]["orderNo"]);
    //     }
    //   };

    const getPurchaseOrderNo = async () => {
        try {
            const result = await api.get(`PurchaseOrder/GetPurchaseOrderNo`);
            
          
            if (result?.data?.status === 1 && result?.data?.data?.orderNo) {
                formik.setFieldValue("orderNo", result.data.data.orderNo);
            } else {
                console.warn("Order number not found in the API response:", result);
                formik.setFieldValue("orderNo", "");
            }
        } catch (error) {
          
            if (error instanceof Error) {
                console.error("Error while fetching the order number:", error.message);
            } else {
                console.error("An unexpected error occurred:", error);
            }
            formik.setFieldValue("orderNo", ""); 
        }
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
        setUnitOptions([{ value: -1, label: t("text.selectUnit") }, ...arr]);
    };

    const getTaxData = async () => {
        const res = await api.post(`UnitMaster/GetTaxMaster`, { taxId: -1 });
        const arr =
            res?.data?.data?.map((item: any) => ({
                label: `${item.taxName} - ${item.taxPercentage}`,
                value: item.taxId,
            })) || [];

        setTaxOption([{ value: "-1", label: t("text.tax") }, ...arr]);
    };

    const GetitemData = async () => {
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
            });
        };
        setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
    };

    const handlePanClose1 = () => {
        setDocOpen(false);
      };
    
      const modalOpenHandle1 = (event: string) => {
        setDocOpen(true);
        const base64Prefix = "data:image/jpg;base64,";
    
        let imageData = '';
        switch (event) {
          case "pOrderDoc":
            imageData = formik.values.pOrderDoc;
            break;
        }
        if (imageData) {
          console.log("imageData", base64Prefix + imageData);
          setImg(base64Prefix + imageData);
        } else {
          setImg('');
        }
      };
    
      const otherDocChangeHandler = (event: any, params: any) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['jpg'].includes(fileExtension || '')) {
          alert("Only .jpg image file is allowed to be uploaded.");
          event.target.value = '';
          return;
        }
    
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const base64String = e.target?.result as string;
          const base64Data = base64String.split(',')[1];
          formik.setFieldValue(params, base64Data);
    
          formik.setFieldValue('pOrderDoc', fileExtension);
    
    
    
          console.log(`File '${file.name}' loaded as base64 string`);
          console.log("base64Data", base64Data);
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
      };
    
//   const handlePanClose = () => {
//     setPanOpen(false);
//   };
//   const modalOpenHandle = (event: any) => {
//     setPanOpen(true);
//     if (event === "file") {
//       setModalImg(formik.values.file);
//     }
//   };
//   const ConvertBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const base64ToByteArray = (base64: string): Uint8Array => {
//     // Remove the data URL scheme if it exists
//     const base64String = base64.split(",")[1];

//     // Decode the Base64 string
//     const binaryString = window.atob(base64String);
//     const len = binaryString.length;
//     const bytes = new Uint8Array(len);

//     // Convert binary string to Uint8Array
//     for (let i = 0; i < len; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }

//     return bytes;
//   };

//   const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
//     let binary = "";
//     const len = uint8Array.byteLength;
//     for (let i = 0; i < len; i++) {
//       binary += String.fromCharCode(uint8Array[i]);
//     }
//     return window.btoa(binary);
//   };

//   const otherDocChangeHandler = async (event: any, params: string) => {
//     console.log("Image file change detected");

//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       const fileNameParts = file.name.split(".");
//       const fileExtension =
//         fileNameParts[fileNameParts.length - 1].toLowerCase();

//       if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
//         alert(
//           "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
//         );
//         event.target.value = null;
//         return;
//       }

//       try {
//         const base64Data = (await ConvertBase64(file)) as string;
//         console.log("Base64 image data:", base64Data);

//         // Convert Base64 to Uint8Array
//         const byteArray = base64ToByteArray(base64Data);
//         console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

//         // Convert Uint8Array to base64 string
//         const base64String = uint8ArrayToBase64(byteArray);
//         console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

//         // Set value in Formik
//         formik.setFieldValue(params, base64String);

//         let outputCheck =
//           "data:image/png;base64," + formik.values.file;
//         console.log(outputCheck);
//       } catch (error) {
//         console.error("Error converting image file to Base64:", error);
//       }
//     }
//   };


    const validateItem = (item: any) => {
        return (
        //     item.itemNameId && item.itemNameId !== -1 &&
        // (item.unit || item.unit === 0) && 
        // parseFloat(item.qty) > 0 &&
        // parseFloat(item.rate) > 0 &&
        // parseFloat(item.amount) >= 0 &&
        // (parseFloat(item.tax1) >= 0 || item.tax1 === "") &&
        // (parseFloat(item.taxId1) >= 0 || item.taxId1 === "") &&
        // (parseFloat(item.discount) >= 0 || item.discount === "") &&
        // parseFloat(item.discountAmount) >= 0 &&
        // parseFloat(item.netAmount) >= 0
        item.itemId && item.itemId !== -1 &&
    //    (item.unitId || item.unitId === 0) && 
        parseFloat(item.quantity) > 0 &&
        parseFloat(item.rate) > 0 &&
        parseFloat(item.amount) >= 0 &&
(parseFloat(item.cgst) >= 0 || item.cgst === "") &&
        (parseFloat(item.cgstid) >= 0 || item.cgstid === "") &&
       // (parseFloat(item.discount) >= 0 || item.discount === "") &&
    //    parseFloat(item.discountAmount) >= 0 &&
        parseFloat(item.netAmount) >= 0
        );
    };

    const formik = useFormik({
        initialValues: {

            
                "sno": 0,
                "orderId": 0,
                "indentId": 0,
                "orderNo": "",
                "orderDate": defaultValues,
                "vendorId": 0,
                "name": "",
                "billingAddress": "",
                "shippingAddress": "",
                "totalAmount": 0,
                "totalCGST": 0,
                "totalSGST": 0,
                "totalIGST": 0,
                "netAmount": 0,
                "status": "",
                "orderType": "",
                "createdBy": "",
                "updatedBy": "",
                "createdOn": defaultValues,
                "updatedOn": defaultValues,
                "companyId": 0,
                "fyId": 0,
                "releasedBy": "",
                "postedBy": "",
                "releasedOn": defaultValues,
                "postedOn": defaultValues,
                "pOrderDoc": "",
                "purchaseOrderDetail": [],
                "isSelected": true,
                "file": "",
                "fileOldName": "",
                "indentNo": "",
                "unitId": 0,
                "itemName": "",
                "unitName": ""
              

            // indentNo:"",
            // imageFile:"",
            // id: -1,
            // document_No: "",
            // p_InvoiceNo: "",
            // doc_Date: "",
            // p_InvoiceDate: "",
            // supplierName: "",
            // orderNo: "",
            // tax: "",
            // freight: "",
            // amount: "",
            // acc_code: "",
            // others: "",
            // remark: "",
            // instId: -1,
            // sessionId: -1,
            // purchaseinv: [],

            
        },
        // validationSchema: Yup.object().shape({
        //     // document_No: Yup.string().required(t("text.reqDocumentNum")),
        //     // orderNo: Yup.string().required(t("text.reqOrderNum")),
        //     // doc_Date: Yup.date().required(t("text.reqOrderDate")),
        //     // p_InvoiceDate: Yup.date().required(t("text.reqInvDate")),
        //     // supplierName: Yup.string().required(t("text.reqSuppName")),
        // }),
        onSubmit: async (values) => {
            console.log("Form Submitted with values:", values);
            const validItems = items.filter((item: any) => validateItem(item));

            // Check if there are valid items
            // if (validItems.length === 0) {
            //     alert("Please fill in at least one valid item.");
            //     return;
            // }

            // Map the valid items, setting values at the first index
            const updatedItems = validItems.map((item: any, index: any) => {
               // const documentDate = values.doc_Date;

                const baseItem = {


    //                 "sno": 0,
    //   "id": 0,
    //   "orderId": 0,
    //   "itemId": 0,
    //   "quantity": 0,
    //   "rate": 0,
    //   "amount": 0,
    //   "gstId": 0,
    //   "gstRate": 0,
    //   "cgst": 0,
    //   "sgst": 0,
    //   "igst": 0,
    //   "cgstid": 0,
    //   "sgstid": 0,
    //   "igstid": 0,
    //   "gst": 0,
    //   "netAmount": 0,
    //   "fyId": 0,
    //   "srn": 0,
    //   "balQuantity": 0,
    //   "isDelete": true,
    //   "itemName": "string"


                    ...item,
                    id: item.id,
                    orderId: item.orderId,
                    itemId: item.itemId,
                    itemName: item.itemName.toString(),
                  //  unit: item.unit.toString(),
                  quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                    cgst: item.cgst,
                    cgstid: item.cgstid,
                    sgst: item.sgst,
                   // discount: item.discount,
                   // discountAmount: item.discountAmount,
                    netAmount: item.netAmount,
                  // documentNo: values.document_No,
                 //  documentDate: documentDate,
                 //  invoiceNo: values.p_InvoiceNo,
                //  supplier: values.supplierName,
                 //   orderNo: values.orderNo,
                  //  mrnNo: "",
                   //mrnDate: documentDate,
                   igstid: 0,
                   igst: 0,
                };

                if (index === 0) {
                    return baseItem;
                }
                return item;
            });

            console.log("Form Submitted with values:", values);
            console.log("Updated Items:", updatedItems);

            try {
                const response = await api.post(
                    `PurchaseOrder/UpsertPurchaseOrder`,
                    { 
                        ...values, 
                     //   id: values.id.toString(),
                       // instId: values.instId.toString(),
                     //   sessionId: values.sessionId.toString(),
                     purchaseOrderDetail: updatedItems 
                    }
                );
                if (response.data.status===1) {
                    setToaster(true);
                    toast.success(response.data.message);
                    navigate("/Inventory/WorkShopPurchaseOrder");
                } else {
                    setToaster(true);
                    toast.error(response.data.message);
                }
            } catch (error) {
                setToaster(true);
                toast.error(t("error.network"));
            }
        },
    });

    const handleItemChange = (index: any, field: any, value: any) => {
        const updatedItems = [...items];
        const item = updatedItems[index];
    
        if (["quantity", "rate", "cgst"].includes(field)) {
            value = value === '' ? '0' : value;
        }
    
        item[field] = value;
    
        item.amount = parseFloat(item.quantity || '0') * parseFloat(item.rate || '0');
        let abc = (item.amount * parseFloat(item.cgst || '0')) / 100;
        item.cgstid = abc.toString();
    
        item.discountAmount =
            item.sgst === "P"
                ? (item.amount) / 100
                : parseFloat('0');
    
        item.netAmount =
            item.amount + parseFloat(item.cgstid || '0') ;
    
        setItems(updatedItems);
    
        if (validateItem(item) && index === items.length - 1) {
            handleAddItem();
        }
    };

    const handleRemoveItem = (index: any) => {
        const updatedItems = items.filter((_: any, i: any) => i !== index);
        setItems(updatedItems);
    };
    const handleAddItem = () => {
        setItems([
            ...items,
            {

                "sno": 0,
      "id": 0,
      "orderId": 0,
      "itemId": 0,
      "quantity": 0,
      "rate": 0,
      "amount": 0,
      "gstId": 0,
      "gstRate": 0,
      "cgst": 0,
      "sgst": 0,
      "igst": 0,
      "cgstid": 0,
      "sgstid": 0,
      "igstid": 0,
      "gst": 0,
      "netAmount": 0,
      "fyId": 0,
      "srn": 0,
      "balQuantity": 0,
      "isDelete": true,
      "itemName": ""
            //     itemNameId: "",
            //     unit: "",
            //     qty: 0,
            //     rate: 0,
            //     amount: 0,
            //     tax1: "",
            //     taxId1: "",
            //     tax2: "P",
            //     discount: 0,
            //     discountAmount: 0,
            //     netAmount: 0,
            //     //documentNo: formik.values.document_No,
            //     //documentDate: formik.values.doc_Date,
            //    // invoiceNo: formik.values.p_InvoiceNo,
            //   //  supplier: formik.values.supplierName,
            //     orderNo: formik.values.orderNo,
            //     mrnNo: "",
            //     mrnDate: "",
            //     taxId3: "",
            //     tax3: "",
            },
        ]);
    };

    useEffect(() => {
        const calculatedTotalAmount = items.reduce(
            (acc: any, item: any) => acc + item.netAmount,
            0
        );
        setTotalAmount(calculatedTotalAmount);
        formik.setFieldValue('amount', calculatedTotalAmount.toFixed(2));
    }, [items]);


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
                        <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="center"
                            >
                                {t("text.CreateWorkShopPurchaseOrder")}
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


                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.orderNo")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="orderNo"
                                    id="orderNo"
                                    // type="date"
                                    value={formik.values.orderNo}
                               
                                />
                            </Grid> */}

<Grid item lg={4} xs={12} sm={4}>
    <TextField
        id="orderNo"
        name="orderNo"
        label={<CustomLabel text={t("text.orderNo")} required={false} />}
        value={formik.values.orderNo}
        size="small"
        fullWidth
        InputProps={{ readOnly: true }}
    />
</Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="orderDate"
                                    name="orderDate"
                                    label={
                                        <CustomLabel
                                            text={t("text.orderDate")}
                                            required={true}
                                        />
                                    }
                                   value={formik.values.orderDate}
                                    placeholder={t("text.orderDate")}
                                    size="small"
                                    type="date"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={
                                        formik.touched.orderDate &&
                                        Boolean(formik.errors.orderDate)
                                    }
                                    helperText={
                                        formik.touched.orderDate && formik.errors.orderDate
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={indentOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log("check value", newValue);
                                        if (newValue) {
                                         //  GetIndentIDById(newValue?.value);
                                            formik.setFieldValue("indentId", newValue?.value);
                                            formik.setFieldValue("indentNo", newValue?.label?.toString() || "");
                                        }
                                    }}

                                    // value={
                                    //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
                                    // }
                                    renderInput={(params: any) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel text={t("text.enterIndentNo")} required={true}/>
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.indentNo && formik.errors.indentNo && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentNo}</div>
                                )}
                            </Grid>


                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    id="document_No"
                                    name="document_No"
                                    label={
                                        <CustomLabel text={t("text.document_No")} required={true} />
                                    }
                                    value={formik.values.document_No}
                                    placeholder={t("text.document_No")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.document_No &&
                                        Boolean(formik.errors.document_No)
                                    }
                                    helperText={
                                        formik.touched.document_No && formik.errors.document_No
                                    }
                                />
                            </Grid> */}

                          
                          
                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={vendorData}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("name", newValue?.value?.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel text={t("text.Vendorname")} required={false} />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={StatusOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("status", newValue?.value.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectStatus")} required={false} />}
                                        />
                                    )}
                                />
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
              </Grid> */}

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
                    label={<CustomLabel text={t("text.pOrderDoc")} />}
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
                    {formik.values.pOrderDoc == "" ? (
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
                      onClick={() => modalOpenHandle1("file")}
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

                <Modal open={docOpen} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
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
                        src={Img}
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

                            

                         



                            <Grid item lg={12} md={12} xs={12} textAlign={"center"} fontSize={12} fontWeight={800}>
                                {/* <Typography
                                    variant="h6"
                                    textAlign="center"
                                >
                                    {t("text.Purchaseorderdetails")}
                                </Typography> */}

                            </Grid>

                            <Grid item lg={12} md={12} xs={12}>
                                {/* <TableContainer> */}
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
                                                {t("text.Rate")}
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
                                                {t("text.Tax")}
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid black",
                                                    textAlign: "center",
                                                    padding: "5px",
                                                }}
                                            >
                                                {t("text.TaxAmount")}
                                            </th>
                                            {/* <th
                                                style={{
                                                    border: "1px solid black",
                                                    textAlign: "center",
                                                    padding: "5px",
                                                }}
                                            >
                                                {t("text.DiscountType")}
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid black",
                                                    textAlign: "center",
                                                    padding: "5px",
                                                }}
                                            >
                                                {t("text.Discount")}
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid black",
                                                    textAlign: "center",
                                                    padding: "5px",
                                                }}
                                            >
                                                {t("text.DiscountAmount")}
                                            </th> */}
                                            <th
                                                style={{
                                                    border: "1px solid black",
                                                    textAlign: "center",
                                                    padding: "5px",
                                                }}
                                            >
                                                {t("text.NetAmount")}
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
                                    <tbody style={{ padding: "2px" }}>
                                        {items.map((item: any, index: any) => (
                                            <tr key={item.id} style={{ border: "1px solid black", padding: "2px" }}>
                                                {/* <TableCell>{index + 1}</TableCell> */}
                                                <td
                                                    style={{
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={itemOption}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue:any) =>
                                                            handleItemChange(
                                                                index,
                                                                "itemId",
                                                                newValue?.value
                                                            )
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <CustomLabel text={t("text.selectItem")} required={false} />
                                                                }
                                                            />
                                                        )}
                                                    />

                                                </td>
                                                <td
                                                    style={{
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={unitOptions}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue:any) => handleItemChange(index, "unitId", newValue?.value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <CustomLabel text={t("text.selectUnit")} required={false} />
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <TextField
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(event) => {
                                                            const value: any = event.target.value;
                                                            handleItemChange(index, "quantity", value);
                                                            // if (!isNaN(value) || value === '' || value === '.') {
                                                            // }
                                                        }}
                                                        inputProps={{
                                                            step: "any",
                                                            min: "0"
                                                        }}
                                                        size="small"
                                                    />
                                                </td>
                                                <td style={{ textAlign: "right" }} >
                                                    <TextField
                                                        type="text"
                                                        value={item.rate}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                                handleItemChange(
                                                                    index,
                                                                    "rate",
                                                                    value === '' ? '' : (value)
                                                                )
                                                            }
                                                        }}
                                                        inputProps={{
                                                            step: "any",
                                                            min: "0"
                                                        }}
                                                        size="small"
                                                    />
                                                </td>
                                                <td>{item.amount.toFixed(2)}</td>
                                                <td>
                                               
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={taxOption}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e, newValue: any) =>
                                                            handleItemChange(
                                                                index,
                                                                "gst",
                                                                newValue?.value?.toString()
                                                            )
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <CustomLabel text={t("text.tax")} required={false} />
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td>{item.gstId}</td>
                                                {/* <td>
                                                    <Select
                                                        value={item.tax2}
                                                        onChange={(e) =>
                                                            handleItemChange(index, "tax2", e.target.value)
                                                        }
                                                        size="small"
                                                    >
                                                        <MenuItem value="P">Pct(%)</MenuItem>
                                                        <MenuItem value="F">Fix</MenuItem>
                                                    </Select>
                                                </td> */}
                                                {/* <td>
                                                    <TextField
                                                        type="text"
                                                        value={item.discount}
                                                        onChange={(event) =>
                                                            handleItemChange(
                                                                index,
                                                                "discount",
                                                                (event.target.value)
                                                            )
                                                        }
                                                        size="small"
                                                    />
                                                </td> */}
                                                {/* <td>{item.discountAmount.toFixed(2)}</td>*/}
                                                <td>{item.netAmount.toFixed(2)}</td> 
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
                                        <tr style={{ backgroundColor: "#2B4593" }}>
                                            <td colSpan={10} style={{ textAlign: "right" }}>
                                                <strong style={{ color: "#fff" }}>
                                                    {t("text.totalAmount")}:
                                                </strong>
                                            </td>
                                            <td colSpan={3}>
                                                <strong style={{ color: "#fff" }}>
                                                    {totalAmount.toFixed(2)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
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

export default CreateWorkShopPurchaseOrder;
