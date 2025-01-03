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
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import { getISTDate } from "../../../utils/Constant";
import { lang } from "moment";
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
const StatusOption = [
  { value: "Immediately", label: "Immediately" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Repeated", label: "Repeated" },
  { value: "Complete", label: "Complete" },
];

const CreatePurchaseInvoice = () => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();

  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const initialRowData: any = {
    id: -1,
    invoiceId: 0,
    orderId: 0,
    itemId: 0,
    quantity: 0,
    rate: 0,
    amount: 0,
    gstId: 0,
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    netAmount: 0,
    fyId: 0,
    srn: 0,
    balQuantity: 0,
    isDelete: true,
    itemName: "string",
    unitName: "string",
    unitId: 0,
  };
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);

  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  const [itemOption, setitemOption] = useState<any>([]);

  const mrnTypeOption = [
    { value: "-1", label: t("text.selectMRN") },
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    // getPurchaseOrderNo();
    // getTaxData();
    // GetitemData();
    // GetUnitData();
    // getVendorData();
    // GetIndentID();
    //   getMRNNo();
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetUnitData();
  }, []);

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
    }
    setitemOption(arr);
  };

  const GetorderData = async () => {
    const collectData = {
      orderId: -1,
      indentId: -1,
    };
    const response = await api.post(
      `PurchaseOrder/GetPurchaseOrder`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["orderNo"],
        value: data[index]["orderId"],
      });
    }
    setorderOption(arr);
  };
  const getVendorData = async () => {
    const result = await api.post(`Master/GetVendorMaster`, {
      venderId: -1,
      countryId: -1,
      stateId: -1,
      cityId: -1,
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

  const getTaxData = async () => {
    const result = await api.post(
      `UnitMaster/GetTaxMaster
    `,
      {
        taxId: -1,
      }
    );
    if (result.data.status === 1) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.taxPercentage}`,
          value: item.taxId,
        })) || [];

      setTaxData([{ value: "-1", label: t("text.tax") }, ...arr]);
    }
  };

  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue && newValue.value !== "-1") {
      setVendorDetail(newValue.details); // Set vendor details for display
      formik.setFieldValue("vendorId", newValue.value); // Set vendorId in formik
    } else {
      setVendorDetail(null); // Clear vendor details
      formik.setFieldValue("vendorId", null); // Explicitly set vendorId to null
    }
  };
  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };

    if (field === "orderNo") {
      const selectedItem = orderOption.find(
        (option: any) => option.value === value
      );
      console.log(selectedItem);
      if (selectedItem) {
        item = {
          ...item,
          mrnType: selectedItem?.value?.toString(),
          orderId: selectedItem?.value,
          orderNo: selectedItem?.label,
        };
      }
    } else if (field === "itemId") {
      const selectedItem = itemOption.find(
        (option: any) => option.value === value
      );
      console.log(selectedItem);
      if (selectedItem) {
        item = {
          ...item,
          itemId: selectedItem?.value,
          itemName: selectedItem?.label,
          item: selectedItem?.details,
        };
      }
    } else if (field === "batchNo") {
      item.batchNo = value?.toString();
    } else if (field === "balQuantity") {
      item.balQuantity = value === "" ? 0 : parseFloat(value);
    } else if (field === "quantity") {
      item.quantity = value === "" ? 0 : parseFloat(value);
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
        item.gst = item.gstRate;
      }
    } else {
      item[field] = value;
    }
    item.amount =
      (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100).toFixed(
      2
    );
    item.netAmount = (item.amount + (parseFloat(item.gst) || 0)).toFixed(2);
    item.sgst = item.gst / 2;
    item.cgst = item.gst / 2;
    item.igst = 0;

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
      row.quantityquantity > 0 &&
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
      ...totals,
    });
  };

  const deleteRow = (index: number) => {
    if (tableData.length === 1) {
      setTableData([{ ...initialRowData }]);
    } else {
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    }
    updateTotalAmounts(tableData);
  };

  const addRow = () => {
    setTableData([...tableData, { ...initialRowData }]);
  };

  // const GetIndentID = async () => {
  //     const collectData = {
  //         indentId: -1,
  //         indentNo: "",
  //         empId: -1,
  //     };

  //     const response = await api.post(`Master/GetIndent`, collectData);
  //     const data = response.data.data;
  //     console.log("indent option", data)
  //     const arr = [];
  //     for (let index = 0; index < data.length; index++) {
  //         arr.push({
  //             label: data[index]["indentNo"],
  //             value: data[index]["indentId"],

  //         });
  //     };
  //     setIndentOptions(arr);
  // };

  //  const getVendorData = async () => {
  //     const result = await api.post(`Master/GetVendorMaster`, {
  //      "venderId": -1,
  //   "countryId": -1,
  //   "stateId": -1,
  //   "cityId": -1
  //     });
  //     if (result.data.isSuccess) {
  //       const arr =
  //         result?.data?.data?.map((item: any) => ({
  //           label: `${item.venderId} - ${item.name}`,
  //           value: item.venderId,
  //           details: item,
  //         })) || [];

  //       setVendorData([
  //         { value: "-1", label: t("text.SelectVendor") },
  //         ...arr,
  //       ] as any);
  //     }
  //   };

  //   const handleVendorSelect = (event: any, newValue: any) => {
  //     if (newValue && newValue.value !== "-1") {
  //       setVendorDetail(newValue.details); // Set vendor details for display
  //       formik.setFieldValue("vendorId", newValue.value); // Set vendorId in formik
  //     } else {
  //       setVendorDetail(null); // Clear vendor details
  //       formik.setFieldValue("vendorId", null); // Explicitly set vendorId to null
  //     }
  //   };

  //     const getPurchaseOrderNo = async () => {
  //         const collectData = {
  //             "orderId": -1,
  //             "indentId": -1
  //         };
  //         const result = await api.post(`PurchaseOrder/GetPurchaseOrder`, collectData);
  //         const data = result.data.data;
  //         const arr = [];
  //         for (let index = 0; index < data.length; index++) {
  //             arr.push({
  //                 label: data[index]["orderNo"],
  //                 value: data[index]["orderId"],
  //             });
  //         }
  //         setOrderOption([{ value: "-1", label: t("text.orderNo") }, ...arr]);
  //     };

  //     const getPurchaseOrderNo = async () => {
  //         const collectData = {
  //             // "id": -1
  //             "orderId": -1,
  // "indentId": -1
  //          };
  //         const result = await api.post(`PurchaseOrder/GetPurchaseOrder`,collectData);
  //         formik.setFieldValue(
  //             "orderNo",
  //             result.data.data[0]["orderNo"]
  //         );
  //     };

  // const GetUnitData = async () => {
  //     const collectData = {
  //         unitId: -1,
  //     };
  //     const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
  //     const data = response.data.data;
  //     const arr = [];
  //     for (let index = 0; index < data.length; index++) {
  //         arr.push({
  //             label: data[index]["unitName"],
  //             value: data[index]["unitId"],
  //         });
  //     }
  //     setUnitOptions([{ value: -1, label: t("text.selectUnit") }, ...arr]);
  // };

  // const getTaxData = async () => {
  //     const res = await api.post(`UnitMaster/GetTaxMaster`, { taxId: -1 });
  //     const arr =
  //         res?.data?.data?.map((item: any) => ({
  //             label: `${item.taxName} - ${item.taxPercentage}`,
  //             value: item.taxId,
  //         })) || [];

  //     setTaxOption([{ value: "-1", label: t("text.tax") }, ...arr]);
  // };

  // const GetitemData = async () => {
  //     const collectData = {
  //         itemMasterId: -1,
  //     };
  //     const response = await api.get(`ItemMaster/GetItemMaster`, {});
  //     const data = response.data.data;
  //     const arr = [];
  //     for (let index = 0; index < data.length; index++) {
  //         arr.push({
  //             label: data[index]["itemName"],
  //             value: data[index]["itemMasterId"],
  //         });
  //     };
  //     setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
  // };

  // const validateItem = (item: any) => {
  //     return (
  //         item.itemId && item.itemId !== -1 &&
  //       //  (item.unit || item.unit === 0) &&
  //         parseFloat(item.quantity) > 0 &&
  //         parseFloat(item.rate) > 0 &&
  //         parseFloat(item.amount) >= 0 &&
  //         (parseFloat(item.gstRate) >= 0 || item.gstRate === "") &&
  //         (parseFloat(item.gstId) >= 0 || item.gstId === "") &&
  //         (parseFloat(item.disPer) >= 0 || item.disPer === "") &&
  //         parseFloat(item.disAmt) >= 0 &&
  //         parseFloat(item.netAmount) >= 0
  //     );
  // };

  const formik = useFormik({
    initialValues: {
      invoiceId: 0,
      orderId: 0,
      invoiceNo: "",
      invoiceDate: defaultValues,
      orderNo: "",
      orderDate: defaultValues,
      vendorId: 0,
      totalAmount: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      totalGrossAmount: 0,
      disPer: 0,
      disAmt: 0,
      netAmount: 0,
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: 0,
      fyId: 0,
      releasedBy: "",
      postedBy: "",
      releasedOn: defaultValues,
      postedOn: defaultValues,
      srn: 0,
      purchaseInvoiceDetail: [],
    },
    // validationSchema: Yup.object().shape({
    //     document_No: Yup.string().required(t("text.reqDocumentNum")),
    //     orderNo: Yup.string().required(t("text.reqOrderNum")),
    //     doc_Date: Yup.date().required(t("text.reqOrderDate")),
    //     p_InvoiceDate: Yup.date().required(t("text.reqInvDate")),
    //     supplierName: Yup.string().required(t("text.reqSuppName")),
    // }),
    // onSubmit: async (values) => {
    //     console.log("Form Submitted with values:", values);
    //     const validItems = items.filter((item: any) => validateItem(item));

    //     // Check if there are valid items
    //     // if (validItems.length === 0) {
    //     //     alert("Please fill in at least one valid item.");
    //     //     return;
    //     // }

    //     // Map the valid items, setting values at the first index
    //     const updatedItems = validItems.map((item: any, index: any) => {
    //         //   const documentDate = values.doc_Date;

    //         const baseItem = {
    //             ...item,
    //             id: item.id,
    //             invoiceId: item.invoiceId,
    //             orderId: item.orderId,
    //             itemId: item.itemId.toString(),
    //         //    unit: item.unit.toString(),
    //             quantity: item.quantity,
    //             rate: item.rate,
    //             amount: item.amount,
    //             gstRate: item.gstRate,
    //             gstId: item.gstId,
    //           //  tax2: item.tax2,
    //             disPer: item.disPer,
    //             disAmt: item.disAmt,
    //             netAmount: item.netAmount,
    //             //    documentNo: values.document_No,
    //             //   documentDate: documentDate,
    //             //   invoiceNo: values.p_InvoiceNo,
    //             //    supplier: values.supplierName,
    //           //  orderNo: values.orderNo,
    //            // mrnNo: "",
    //             //  mrnDate: documentDate,
    //            // taxId3: "",
    //            // tax3: "",
    //         };

    //         if (index === 0) {
    //             return baseItem;
    //         }
    //         return item;
    //     });

    //     console.log("Form Submitted with values:", values);
    //     console.log("Updated Items:", updatedItems);

    //     try {
    //         const response = await api.post(
    //             `PurchaseInv/UpsertPurchaseInvoice`,
    //             {
    //                 ...values,
    //                 id: values.invoiceId.toString(),
    //                 //  instId: values.instId.toString(),
    //                 //sessionId: values.sessionId.toString(),
    //                 purchaseInvoiceDetail: updatedItems
    //             }
    //         );
    //         if (response.data.status === 1) {
    //             setToaster(true);
    //             toast.success(response.data.message);
    //             navigate("/Inventory/PurchaseInvoice");
    //         } else {
    //             setToaster(true);
    //             toast.error(response.data.message);
    //         }
    //     } catch (error) {
    //         setToaster(true);
    //         toast.error(t("error.network"));
    //     }
    // },

    onSubmit: async (values) => {
      const isFirstRowDefault =
        tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].invoiceId === 0 &&
        //  tableData[0].mrnType === "" &&
        tableData[0].orderId === 0 &&
        tableData[0].orderNo === "" &&
        tableData[0].batchNo === "" &&
        tableData[0].serialNo === "" &&
        tableData[0].qcStatus === "" &&
        tableData[0].itemId === 0 &&
        tableData[0].balQuantity === 0 &&
        tableData[0].quantity === 0 &&
        tableData[0].rate === 0 &&
        tableData[0].amount === 0 &&
        tableData[0].gstId === 0 &&
        tableData[0].gstRate === 0 &&
        tableData[0].cgst === 0 &&
        tableData[0].sgst === 0 &&
        tableData[0].igst === 0 &&
        tableData[0].cgstid === 0 &&
        tableData[0].sgstid === 0 &&
        tableData[0].igstid === 0 &&
        //   tableData[0].gst === "" &&
        tableData[0].netAmount === 0 &&
        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      const filteredTableData = tableData.filter((row) => {
        return !(
          row.id === -1 &&
          row.invoiceId === 0 &&
          //   row.mrnType === "" &&
          row.orderId === 0 &&
          row.orderNo === "" &&
          row.batchNo === "" &&
          row.serialNo === "" &&
          row.qcStatus === "" &&
          row.itemId === 0 &&
          row.balQuantity === 0 &&
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
          row.netAmount === "" &&
          Object.keys(row.item).length === 0
        );
      });
      // const payload = { ...values, vendorId: values.vendorId }; // Only send vendorId
      // console.log("Payload:", payload);

      const payload = { ...values };
      console.log("Payload:", payload);
      //   values.vendorId = vendorDetail;

      const response = await api.post(`PurchaseInv/UpsertPurchaseInvoice`, {
        ...values,
        purchaseInvoiceDetail: filteredTableData,
      });
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/Inventory/PurchaseInvoice");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });
  const back = useNavigate();
  console.log("formik.values", formik.values);

  // const handleItemChange = (index: any, field: any, value: any) => {
  //     const updatedItems = [...items];
  //     const item = updatedItems[index];

  //     if (["quantity", "rate", "cgst"].includes(field)) {
  //         value = value === '' ? '0' : value;
  //     }

  //     item[field] = value;

  //     item.amount = parseFloat(item.quantity || '0') * parseFloat(item.rate || '0');
  //     let abc = (item.amount * parseFloat(item.cgst || '0')) / 100;
  //     item.cgstid = abc.toString();

  //     item.discountAmount =
  //         item.sgst === "P"
  //             ? (item.amount) / 100
  //             : parseFloat('0');

  //     item.netAmount =
  //         item.amount + parseFloat(item.cgstid || '0') ;

  //     setItems(updatedItems);

  //     if (validateItem(item) && index === items.length - 1) {
  //         handleAddItem();
  //     }
  // };

  // const handleRemoveItem = (index: any) => {
  //     const updatedItems = items.filter((_: any, i: any) => i !== index);
  //     setItems(updatedItems);
  // };
  // const handleAddItem = () => {
  //     setItems([
  //         ...items,
  //         {
  //             "sno": 0,
  //             "id": 0,
  //             "invoiceId": 0,
  //             "orderId": 0,
  //             "itemId": 0,
  //             "quantity": 0,
  //             "rate": 0,
  //             "amount": 0,
  //             "gstId": 0,
  //             "gstRate": 0,
  //             "cgst": 0,
  //             "sgst": 0,
  //             "igst": 0,
  //             "netAmount": 0,
  //             "fyId": 0,
  //             "srn": 0,
  //             "balQuantity": 0,
  //             "isDelete": true,
  //         //     itemId: "",
  //         //    // unit: "",
  //         //     quantity: 0,
  //         //     rate: 0,
  //         //     amount: 0,
  //         //     tax1: "",
  //         //     taxId1: "",
  //         //     tax2: "P",
  //         //     discount: 0,
  //         //     discountAmount: 0,
  //         //     netAmount: 0,
  //             // documentNo: formik.values.document_No,
  //             // documentDate: formik.values.doc_Date,
  //             // invoiceNo: formik.values.p_InvoiceNo,
  //             // supplier: formik.values.supplierName,
  //           //  orderNo: formik.values.orderNo,
  //             // mrnNo: "",
  //             // mrnDate: "",
  //             // taxId3: "",
  //             // tax3: "",
  //         },
  //     ]);
  // };

  // useEffect(() => {
  //     const calculatedTotalAmount = items.reduce(
  //         (acc: any, item: any) => acc + item.netAmount,
  //         0
  //     );
  //     setTotalAmount(calculatedTotalAmount);
  //     formik.setFieldValue('amount', calculatedTotalAmount.toFixed(2));
  // }, [items]);

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
            {t("text.CreatePurchaseInvoice")}
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
                    <CustomLabel text={t("text.invoiceno")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="invoiceNo"
                  id="invoiceNo"
                  value={formik.values.invoiceNo}
                  placeholder={t("text.invoiceno")}
                  onChange={(e) => {
                    formik.setFieldValue("invoiceNo", e.target.value);
                  }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="invoiceDate"
                  name="invoiceDate"
                  label={
                    <CustomLabel text={t("text.invoiceDate")} required={true} />
                  }
                  value={formik.values.invoiceDate}
                  placeholder={t("text.invoiceDate")}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.invoiceDate &&
                    Boolean(formik.errors.invoiceDate)
                  }
                  helperText={
                    formik.touched.invoiceDate && formik.errors.invoiceDate
                  }
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={orderOption}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    formik.setFieldValue("orderNo", newValue?.label);
                    formik.setFieldValue("orderId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.orderno")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="orderDate"
                  name="orderDate"
                  label={
                    <CustomLabel text={t("text.orderdate")} required={true} />
                  }
                  value={formik.values.orderDate}
                  placeholder={t("text.orderdate")}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.orderDate && Boolean(formik.errors.orderDate)
                  }
                  helperText={
                    formik.touched.orderDate && formik.errors.orderDate
                  }
                />
              </Grid>

              <Grid item lg={4} xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  size="small"
                  id="combo-box-demo"
                  options={vendorData}
                  onChange={handleVendorSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectVendor")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {vendorDetail?.contactPerson && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorContactPerson")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.contactPerson}
                    placeholder={t("text.vendorContactPerson")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {vendorDetail?.permanentAddress && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorAddress")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.permanentAddress}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {vendorDetail?.mobileNo && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorMobileNo")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.mobileNo}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {/* <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={vendorOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("supplierName", newValue?.value?.toString());
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
                            </Grid> */}

              {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    id="vendorId"
                                    name="vendorId"
                                    label={
                                        <CustomLabel
                                            text={t("text.vendorcontact")}
                                            required={true}
                                        />
                                    }
                                    value={formik.values.vendorId}
                                    placeholder={t("text.vendorcontact")}
                                    size="small"
                                    //type="date"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={
                                        formik.touched.vendorId &&
                                        Boolean(formik.errors.vendorId)
                                    }
                                    helperText={
                                        formik.touched.vendorId && formik.errors.vendorId
                                    }
                                />
                            </Grid> */}

              {/* <Grid item xs={12} sm={4} lg={4}>
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
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentNo}</div>
                                )}
                            </Grid> */}

              {/* <Grid item lg={12} xs={12}>
                                <TextField
                                    id="vendorId"
                                    name="vendorId"
                                    label={
                                        <CustomLabel text={t("text.vendoraddress")} required={true} />
                                    }
                                    value={formik.values.vendorId}
                                    placeholder={t("text.vendoraddress")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.vendorId &&
                                        Boolean(formik.errors.vendorId)
                                    }
                                    helperText={
                                        formik.touched.vendorId && formik.errors.vendorId
                                    }
                                />
                            </Grid> */}

              <Grid
                item
                lg={12}
                md={12}
                xs={12}
                textAlign={"center"}
                fontSize={12}
                fontWeight={800}
              >
                {/* <Typography
                                    variant="h6"
                                    textAlign="center"
                                >
                                    {t("text.Purchaseorderdetails")}
                                </Typography> */}
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
                        {t("text.GSTRate")}
                      </th>

                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        CGST
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        SGST
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        IGST
                      </th>
                      {/* <th
                                                    style={{
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                        padding: "5px",
                                                    }}
                                                >
                                                    {t("text.totalTax")}
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
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={row.id} style={{ border: "1px solid black" }}>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <DeleteIcon
                            onClick={() => deleteRow(index)}
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
                            options={itemOption}
                            fullWidth
                            size="small"
                            onChange={(e: any, newValue: any) =>
                              handleInputChange(
                                index,
                                "itemId",
                                newValue?.value
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // label={
                                //     // <CustomLabel
                                //     //     text={t("text.selectItem")}
                                //     //     required={false}
                                //     // />
                                // }
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
                            onChange={(e: any, newValue: any) =>
                              handleInputChange(
                                index,
                                "unitId",
                                newValue?.value
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                //   label={
                                //       <CustomLabel text={t("text.selectUnit")} required={false} />
                                //   }
                              />
                            )}
                          />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <TextField
                            type="text"
                            value={row.quantity}
                            onChange={(event) => {
                              const value: any = event.target.value;
                              handleInputChange(index, "quantity", value);
                              // if (!isNaN(value) || value === '' || value === '.') {
                              // }
                            }}
                            inputProps={{
                              step: "any",
                              min: "0",
                            }}
                            size="small"
                          />
                        </td>

                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <TextField
                            size="small"
                            // value={row.rate}
                            onChange={(e) =>
                              handleInputChange(index, "rate", e.target.value)
                            }
                            inputProps={{ step: "any", min: "0" }}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <TextField
                            value={row.amount}
                            size="small"
                            inputProps={{ readOnly: true }}
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
                            options={taxData}
                            fullWidth
                            size="small"
                            onChange={(e: any, newValue: any) =>
                              handleInputChange(index, "gstId", newValue?.value)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // label={
                                //     <CustomLabel
                                //         text={t("text.tax")}
                                //         required={false}
                                //     />
                                // }
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
                          <TextField
                            value={row.cgst.toFixed(2)}
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <TextField
                            value={row.sgst.toFixed(2)}
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <TextField
                            value={row.igst.toFixed(2)}
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <TextField
                            value={row.netAmount}
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={10}
                        style={{ textAlign: "right", fontWeight: "bold" }}
                      >
                        {t("text.TotalAmount")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          border: "1px solid black",
                        }}
                      >
                        {tableData
                          .reduce(
                            (acc, row) => acc + (parseFloat(row.amount) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={10}
                        style={{ textAlign: "right", fontWeight: "bold" }}
                      >
                        {t("text.Totaltaxamount")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          border: "1px solid black",
                        }}
                      >
                        {tableData
                          .reduce(
                            (acc, row) => acc + (parseFloat(row.gst) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={10}
                        style={{ textAlign: "right", fontWeight: "bold" }}
                      >
                        {t("text.Totalgrossamount")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          border: "1px solid black",
                        }}
                      >
                        {tableData
                          .reduce(
                            (acc, row) =>
                              acc + (parseFloat(row.netAmount) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
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

export default CreatePurchaseInvoice;
