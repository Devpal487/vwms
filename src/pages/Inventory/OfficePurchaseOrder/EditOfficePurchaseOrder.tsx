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
  Modal,
  Box,
} from "@mui/material";
import nopdf from '../../../assets/images/imagepreview.jpg'
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import dayjs from "dayjs";
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
  { value: 'Immediately', label: 'Immediately' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Repeated', label: 'Repeated' },
  { value: 'Complete', label: 'Complete' },
];

const EditOfficePurchaseOrder = () => {
 const { defaultValues } = getISTDate();
      const [docOpen, setDocOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const initialRowData:any ={
    "sno": 0,
    "id": -1,
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
    "itemName": "",

  }
  // const [items, setItems] = useState<any>([
  //   {

  //     "sno": 0,
  //     "id": -1,
  //     "orderId": 0,
  //     "itemId": 0,
  //     "quantity": 0,
  //     "rate": 0,
  //     "amount": 0,
  //     "gstId": 0,
  //     "gstRate": 0,
  //     "cgst": 0,
  //     "sgst": 0,
  //     "igst": 0,
  //     "cgstid": 0,
  //     "sgstid": 0,
  //     "igstid": 0,
  //     "gst": 0,
  //     "netAmount": 0,
  //     "fyId": 0,
  //     "srn": 0,
  //     "balQuantity": 0,
  //     "isDelete": true,
  //     "itemName": "",

  //     // id: -1,
  //     // purchaseid: 1,
  //     // user_Id: -1,
  //     // ItemNameId: "",
  //     // unit: "",
  //     // qty: "",
  //     // rate: "",
  //     // amount: 0,
  //     // tax1: 0,
  //     // taxId1: 0,
  //     // tax2: "P",
  //     // discount: "",
  //     // discountAmount: 0,
  //     // netamount: 0,
  //     // documentNo: "",
  //     // documentDate: "",
  //     // invoiceNo: "",
  //     // supplier: "",
  //     // orderNo: "",
  //     // mrnNo: "",
  //     // mrnDate: "",
  //     // taxId3: "",
  //     // tax3: "",
  //   },
  // ]);
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxOption, setTaxOption] = useState<any>([]);
  const [itemOption, setitemOption] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [vendorOptions, setVendorOptions] = useState<any>([]);
   const [vendorData, setVendorData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
]);
const [panOpens, setPanOpen] = React.useState(false);
const [modalImg, setModalImg] = useState("");
const [Opens, setOpen] = React.useState(false);
const [Img, setImg] = useState("");
 const [taxData, setTaxData] = useState<any>([]);
  // const back = useNavigate();
 const [orderOption, setorderOption] = useState([
        { value: -1, label: t("text.id") },
    ]);
  useEffect(() => {
    getTaxData();
    GetitemData();
    GetUnitData();
    getVendorData();
    getPurchaseorderId(location.state.orderId);
    GetIndentID();
  }, []);
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
                label: `${item.name}`,
                value: item.venderId,
                details: item,
            })) || [];

        setVendorData([
            { value: "-1", label: t("text.SelectVendor") },
            ...arr,
        ] as any);
    }
};

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
  const result = await api.post(`UnitMaster/GetTaxMaster
`, {
      taxId: -1,
  });
  if (result.data.status === 1) {
      const arr =
          result?.data?.data?.map((item: any) => ({
              label: `${item.taxPercentage}`,
              value: item.taxId,
          })) || [];

      setTaxData([{ value: "-1", label: t("text.tax") }, ...arr]);
  }
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


  // const getPurchaseorderId = async (id: any) => {
  //   const result = await api.post(`PurchaseOrder/GetPurchaseOrder`, {
  //     orderId: id,
  //   });
  //   const response = result.data.data[0]["purchaseOrderDetail"];
  //   console.log("purchaseOrderDetail", response);

  //   for (let i = 0; i < response.length; i++) {
  //     setItems([response[i]]);
  //   }
  // };

  const getPurchaseorderId = (id: any) => {

    api.post(`PurchaseOrder/GetPurchaseOrder`,{ orderId: id } )
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const data = response.data.data[0]['purchaseOrderDetail'];
          if (data != null) {
            const arr = data?.map((item: any) => {
              return {
"sno": item.sno,
    "id": item.id,
    "orderId": item.orderId,
    "itemId": item.itemId,
    "quantity": item.quantity,
    "rate": item.rate,
    "amount": item.amount,
    "gstId": item.gstId,
    "gstRate": item.gstRate,
    "cgst": item.cgst,
    "sgst": item.sgst,
    "igst": item.igst,
    "cgstid": item.cgstid,
    "sgstid": item.sgstid,
    "igstid": item.igstid,
    "gst": item.gst,
    "netAmount": item.netAmount,
    "fyId": item.fyId,
    "srn": item.srn,
    "balQuantity": item.balQuantity,
    "isDelete": item.isDelete,
    "itemName": item.itemName,
              }
            })
            setTableData(arr);
            updateTotalAmounts(arr);
            // if (arr.length > 0 ) {
            //   addRow();
            // }
          }
        } else {

          console.error("No MRN data found or the data structure is incorrect.");
        }
      })
      .catch((error) => {
        console.error("Error fetching MRN data:", error);
      });
  };
  
  useEffect(() => {
    if (tableData.length > 0 && isRowFilled(tableData[tableData.length - 1]) && tableData[tableData.length - 1].id !== -1) {
      addRow(); // Call addRow to add a new initial row
    }
  }, [tableData]);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };

    if (field === "orderNo" || field === "vendor") {
      const selectedItem = orderOption.find(
        (option: any) => option.value === value
      );
      if (selectedItem) {
        item = {
          ...item,
          mrnType: selectedItem.value.toString(),
          orderId: selectedItem.value,
          orderNo: selectedItem.label,
        };
      }
    } else if (field === "itemId") {
      const selectedItem = itemOption.find(
        (option: any) => option.value === value
      );
      if (selectedItem) {
        item = {
          ...item,
          itemId: selectedItem.value,
          itemName: selectedItem.label,
          item: selectedItem.details,
        };
      }
    } else if (field === "batchNo") {
      item.batchNo = value.toString();
    } else if (field === "mrnQty") {
      item.mrnQty = value === "" ? 0 : parseFloat(value);
    } else if (field === "acceptQty") {
      item.acceptQty = value === "" ? 0 : parseFloat(value);
    } else if (field === "rejectQty") {
      item.rejectQty = value === "" ? 0 : parseFloat(value);
    } else if (field === "rate") {
      item.rate = value === "" ? 0 : parseFloat(value);
    } else if (field === "gstId") {
      const selectedTax: any = taxData.find((tax: any) => tax.value === value);
      if (selectedTax) {
        item.gstRate = parseFloat(selectedTax.label) || 0;
        item.gstId = selectedTax.value || 0;
        item.cgstid = selectedTax.value || 0;
        item.sgstid = selectedTax.value || 0;
        item.igstid = 0;
      }
    } else {
      item[field] = value;
    }

    // Fill in default quantities if editing row
    if (field === "edit" && item) {
      item.mrnQty = item.mrnQty || 0;
      item.acceptQty = item.acceptQty || 0;
      item.rejectQty = item.rejectQty || 0;
    }

    // Calculate amount if required fields are filled
    if (item.mrnQty && item.rate) {
      item.amount = (parseFloat(item.mrnQty) || 0) * (parseFloat(item.rate) || 0);
    }

    // Calculate GST and total amount if gstRate is selected
    if (item.gstRate) {
      item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100).toFixed(2);
      item.sgst = (parseFloat(item.gst) / 2).toFixed(2);
      item.cgst = (parseFloat(item.gst) / 2).toFixed(2);
      item.igst = 0;
    }

    // Calculate net amount
    item.netAmount = (parseFloat(item.amount) + parseFloat(item.gst || "0")).toFixed(2);

    formik.setFieldValue("totalAmount", item.netAmount);

    updatedItems[index] = item;
    setTableData(updatedItems);
    updateTotalAmounts(updatedItems);

    if (isRowFilled(item) && index === updatedItems.length - 1) {
      addRow();
    }
  };
  console.log("tableData.....", tableData);
  const isRowFilled = (row: any) => {
    console.log("isRowFilled", row);
    return (
      row.orderNo &&
      row.itemId &&
      row.batchNo &&
      row.balQuantity > 0 &&
      row.quantity > 0 &&
      row.rate > 0
    );
  };
  const updateTotalAmounts = (data: any[]) => {
    console.log("updateTotalAmounts", data);
    const totals = data.reduce(
      (acc, row) => {
        acc.totalAmount += parseFloat(row.amount) || 0;
        acc.totalCGST += parseFloat(row.cgst) || 0;
        acc.totalSGST += parseFloat(row.sgst) || 0;
        acc.totalIGST += parseFloat(row.igst) || 0;
        acc.totalGrossAmount += parseFloat(row.netAmount) || 0;
        return acc;
      },
      {
        totalAmount: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        totalGrossAmount: 0,
      }
    );

    formik.setValues({
      ...formik.values,
      totalAmount: totals.totalAmount,
      totalCGST: totals.totalCGST,
      totalSGST: totals.totalSGST,
      totalIGST: totals.totalIGST,
     // totalGrossAmount: totals.totalGrossAmount,
    });
  };
  const deleteRow = (index: number) => {
    if (tableData.length === 1) {
      // If there's only one row, reset it to initial values
      setTableData([{ ...initialRowData }]);
    } else {
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    }
    updateTotalAmounts(tableData);
  };

  const addRow = () => {
    console.log("HI")
    // setTableData([...tableData, { ...initialRowData }]);
    setTableData((prevData) => [...prevData, { ...initialRowData }]);
  };
  console.log(location)
 

//   const validateItem = (item: any) => {
//     return (
//         item.itemNameId && item.itemNameId !== -1 &&
//     (item.unit || item.unit === 0) &&
//     parseFloat(item.qty) > 0 &&
//     parseFloat(item.rate) > 0 &&
//     parseFloat(item.amount) >= 0 &&
//     (parseFloat(item.tax1) >= 0 || item.tax1 === "") &&
//     (parseFloat(item.taxId1) >= 0 || item.taxId1 === "") &&
//     (parseFloat(item.discount) >= 0 || item.discount === "") &&
//     parseFloat(item.discountAmount) >= 0 &&
//     parseFloat(item.netAmount) >= 0
//     );
// };

  const formik = useFormik({
    initialValues: {
      "sno": location.state.sno,
      "orderId": location.state.orderId,
      "indentId": location.state.indentId,
      "orderNo": location.state.orderNo,
      "orderDate": dayjs(location.state.orderDate).format("YYYY-MM-DD"),
      "vendorId": location.state.vendorId,
      "name": location.state.name,
      "billingAddress": location.state.billingAddress,
      "shippingAddress": location.state.shippingAddress,
      "totalAmount": location.state.totalAmount,
      "totalCGST": location.state.totalCGST,
      "totalSGST": location.state.totalSGST,
      "totalIGST": location.state.totalIGST,
      "netAmount": location.state.netAmount,
      "status": location.state.status,
      "orderType": location.state.orderType,
      "createdBy": location.state.createdBy,
      "updatedBy": location.state.updatedBy,
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": location.state.companyId,
      "fyId": location.state.fyId,
      "releasedBy": location.state.releasedBy,
      "postedBy": location.state.postedBy,
      "releasedOn": dayjs(location.state.releasedOn).format("YYYY-MM-DD"),
      "postedOn": dayjs(location.state.postedOn).format("YYYY-MM-DD"),
      "pOrderDoc": location.state.pOrderDoc,
      "isSelected": location.state.isSelected,
      "file": location.state.file,
      "fileOldName": location.state.fileOldName,
      "indentNo": location.state.indentNo,
      "unitId": location.state.unitId,
      "itemName": location.state.itemName,
      "unitName": location.state.unitName,
      purchaseOrderDetail: [],
     
    },
    // validationSchema: Yup.object().shape({
    //   document_No: Yup.string().required(t("Document No. required")),
    //   orderNo: Yup.string().required(t("Order No. required")),
    //   doc_Date: Yup.date().required(t("Order Date required")),
    //   p_InvoiceDate: Yup.date().required(t("Invoice Date required")),
    //   supplierName: Yup.string().required(t("Supplier Name required")),
    // }),
    onSubmit: async (values) => {
      const isFirstRowDefault = tableData[0] &&
      tableData[0].id === -1 &&
      tableData[0].sno === 0 &&
      tableData[0].orderId === 0 &&
      tableData[0].itemId === 0 &&
      tableData[0].quantity === 0 &&
      tableData[0].rate === 0 &&
      tableData[0].amount === "" &&
      tableData[0].gstId === 0 &&
      tableData[0].gstRate === "" &&
      tableData[0].cgst === "" &&
      tableData[0].sgst === "" &&
      tableData[0].igst === "" &&
      tableData[0].cgstid === "" &&
      tableData[0].sgstid === "" &&
      tableData[0].igstid === "" &&
      tableData[0].gst === "" &&
      tableData[0].netAmount === "" &&
      tableData[0].fyId === "" &&
      tableData[0].srn === "" &&
      tableData[0].balQuantity === "" &&
      tableData[0].isDelete === true &&
      tableData[0].itemName === "" &&
      Object.keys(tableData[0].item).length === 0;

    if (isFirstRowDefault) {
      alert("Please add values in the table before submitting.");
      return;
    }

    const filteredTableData = tableData.filter(row => {
      return !(
        row.sno === 0 &&
        row.id === -1 &&
        row.orderId === 0 &&
        row.itemId === 0 &&
        row.quantity === 0 &&
        row.rate === 0 &&
        row.amount === 0 &&
        row.gstId === 0 &&
        row.gstRate === 0 &&
        row.cgst === 0 &&
        row.sgst === 0 &&
        row.igst === 0 &&
        row.cgstid === 0 &&
        row.sgstid === 0 &&
        row.igstid === 0 &&
        row.gst === 0 &&
        row.netAmount === 0 &&
        row.fyId === 0 &&
        row.srn === 0 &&
        row.balQuantity === 0 &&
        row.isDelete === true &&
        row.itemName === "" &&
        Object.keys(row.item).length === 0
      );
    });

    const response = await api.post(`PurchaseOrder/UpsertPurchaseOrder`, {
      ...values,
      purchaseOrderDetail: filteredTableData,
    });
         if (response.data.status === 1) {
                       setToaster(false);
                       toast.success(response.data.message);
                       navigate("/Inventory/OfficePurchaseOrder");
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
                {t("text.EditOfficePurchaseOrder")}
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
                                                <CustomLabel text={t("text.enterIndentNo")} required={true} />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.indentNo && formik.errors.indentNo && (
                                    <div style={{ color: "red", margin: "5px" }}></div>
                                )}
                            </Grid>




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
                                    disabled
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("status", newValue?.value.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            disabled
                                            label={<CustomLabel text={t("text.SelectStatus")} required={false} />}
                                        />
                                    )}
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
                                            // eslint-disable-next-line jsx-a11y/alt-text
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
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="p_InvoiceDate"
                                    name="p_InvoiceDate"
                                    label={
                                        <CustomLabel
                                            text={t("text.p_InvoiceDate")}
                                            required={true}
                                        />
                                    }
                                    value={formik.values.p_InvoiceDate}
                                    placeholder={t("text.p_InvoiceDate")}
                                    size="small"
                                    type="date"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={
                                        formik.touched.p_InvoiceDate &&
                                        Boolean(formik.errors.p_InvoiceDate)
                                    }
                                    helperText={
                                        formik.touched.p_InvoiceDate && formik.errors.p_InvoiceDate
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
                                           // GetIndentIDById(newValue?.value);
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
                                    <div style={{ color: "red", margin: "5px" }}></div>
                                )}
                            </Grid>


              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorOptions}
                  fullWidth
                  size="small"
                  value={
                    vendorOptions.find(
                      (option: any) =>
                        option.value == formik.values.supplierName
                    ) || null
                  }
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "supplierName",
                      newValue?.value?.toString()
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.Vendorname")}
                          required={false}
                        />
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
                            </Grid> */}

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
                       // src={"data:image/png;base64," + modalImg}
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
              </Grid> */}

              {/* <Grid item lg={4} xs={12}>
                <TextField
                  id="orderNo"
                  name="orderNo"
                  label={
                    <CustomLabel text={t("text.orderNo")} required={true} />
                  }
                  value={formik.values.orderNo}
                  placeholder={t("text.orderNo")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.orderNo && Boolean(formik.errors.orderNo)
                  }
                  helperText={
                    formik.touched.orderNo &&
                    (typeof formik.errors.orderNo === "string"
                      ? formik.errors.orderNo
                      : "")
                  }
                />
              </Grid> */}



              <Grid item lg={12} md={12} xs={12}>
              <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
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
                      <th
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
                    {tableData.map((item: any, index: any) => (
                      <tr
                        key={item.id}
                        style={{ border: "1px solid black", padding: "2px" }}
                      >
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
                            value={itemOption.find(
                              (opt: any) => opt.value === Number(item.itemNameId)
                            )}
                            onChange={(e: any) =>
                              handleInputChange(
                                index,
                                "ItemNameId",
                                e.target.value
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <CustomLabel
                                    text={t("text.selectItem")}
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
                          }}
                        >
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={unitOptions}
                            fullWidth
                            size="small"
                            value={unitOptions.find(
                              (opt: any) => opt.value === Number(item.unit)
                            )}
                            onChange={(e: any) =>
                              handleInputChange(index, "unit", e.target.value)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <CustomLabel
                                    text={t("text.selectUnit")}
                                    required={false}
                                  />
                                }
                              />
                            )}
                          />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <TextField
                            type="text"
                            value={item.qty}
                            onChange={(event) => {
                              const value: any = event.target.value;
                              handleInputChange(index, "qty", value);
                            }}
                            onFocus={e => e.target.select()}
                            inputProps={{
                              step: "any",
                              min: "0",
                            }}
                            size="small"
                          />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <TextField
                            type="text"
                            value={item.rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                handleInputChange(
                                  index,
                                  "rate",
                                  value === "" ? "" : value
                                );
                              }
                            }}
                            onFocus={e => e.target.select()}
                            inputProps={{
                              step: "any",
                              min: "0",
                            }}
                            size="small"
                          />
                        </td>
                        {/* <td>{item.amount.toFixed(2)}</td> */}
                        <td>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={taxOption}
                            fullWidth
                            size="small"
                            value={taxOption.find(
                              (opt: any) => opt.value === Number(item.tax1)
                            )}
                            onChange={(e, newValue: any) =>
                              handleInputChange(
                                index,
                                "tax1",
                                newValue?.value?.toString()
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <CustomLabel
                                    text={t("text.tax")}
                                    required={false}
                                  />
                                }
                              />
                            )}
                          />
                        </td>
                        <td>{item.taxId1}</td>
                        <td>
                          <Select
                            value={item.tax2}
                            onChange={(e) =>
                              handleInputChange(index, "tax2", e.target.value)
                            }
                            size="small"
                          >
                            <MenuItem value="P">Pct(%)</MenuItem>
                            <MenuItem value="F">Fix</MenuItem>
                          </Select>
                        </td>
                        <td>
                          <TextField
                            type="text"
                            value={item.discount}
                            onChange={(event) =>
                              handleInputChange(
                                index,
                                "discount",
                                event.target.value
                              )
                            }
                            size="small"
                          />
                        </td>
                        {/* <td>{item.discountAmount.toFixed(2)}</td>
                        <td>{safeToFixed(item.netamount)}</td> */}
                        {/* <td>{item.netamount?.toFixed(2) || 0.00}</td> */}
                        <td>
                          <Button
                            onClick={() => deleteRow(index)}
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
                          {/* {totalAmount.toFixed(2)} */}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>

            </div>  </Grid>


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
                    {t("text.update")}
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

export default EditOfficePurchaseOrder;