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

const EditPurchaseInvoice = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const [items, setItems] = useState<any>([
    {
      id: -1,
      purchaseid: 1,
      user_Id: -1,
      ItemNameId: "",
      unit: "",
      qty: "",
      rate: "",
      amount: 0,
      tax1: 0,
      taxId1: 0,
      tax2: "P",
      discount: "",
      discountAmount: 0,
      netamount: 0,
      documentNo: "",
      documentDate: "",
      invoiceNo: "",
      supplier: "",
      orderNo: "",
      mrnNo: "",
      mrnDate: "",
      taxId3: "",
      tax3: "",
    },
  ]);
  const [taxOption, setTaxOption] = useState<any>([]);
  const [itemOption, setitemOption] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [vendorOptions, setVendorOptions] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
]);
const [panOpens, setPanOpen] = React.useState(false);
const [modalImg, setModalImg] = useState("");
const [Opens, setOpen] = React.useState(false);
const [Img, setImg] = useState("");
  console.log("items", items);

  const back = useNavigate();

  useEffect(() => {
    getTaxData();
    GetitemData();
    GetUnitData();
    getVendorData();
    getPurchaseInvoiceById(location.state.id);
    GetIndentID();
  }, []);

  const GetIndentID = async () => {
    const collectData = {
        indentId: -1,
        indentNo: "",
        empId: -1,
    };


    const response = await api.post(`IndentMaster/GetIndent`, collectData);
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
    const result = await api.post(`VendorMaster/Ge3tVendorMaster`, {
      venderId: -1,
    });
    const data = result.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["name"],
        value: data[index]["venderId"],
      });
    }
    setVendorOptions([{ value: "-1", label: t("text.supplierName") }, ...arr]);
  };

  const getPurchaseInvoiceById = async (id: any) => {
    const result = await api.post(`PurchaseInvoice/GetPurchaseInvoice`, {
      id: id,
    });
    const response = result.data.data[0]["purchaseinv"];
    console.log("purchaseinv", response);

    for (let i = 0; i < response.length; i++) {
      setItems([response[i]]);
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
    const res = await api.post(`TaxMaster/GetTaxMaster`, { taxId: -1 });
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
    const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
  };
    
 
  const validateItem = (item: any) => {
    return (
        item.itemNameId && item.itemNameId !== -1 &&
    (item.unit || item.unit === 0) && 
    parseFloat(item.qty) > 0 &&
    parseFloat(item.rate) > 0 &&
    parseFloat(item.amount) >= 0 &&
    (parseFloat(item.tax1) >= 0 || item.tax1 === "") &&
    (parseFloat(item.taxId1) >= 0 || item.taxId1 === "") &&
    (parseFloat(item.discount) >= 0 || item.discount === "") &&
    parseFloat(item.discountAmount) >= 0 &&
    parseFloat(item.netAmount) >= 0
    );
};

  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      indentNo:location.state.indentNo,
      imageFile:location.state. imageFile,
      document_No: location.state.document_No,
      p_InvoiceNo: location.state.p_InvoiceNo,
      doc_Date: dayjs(location.state.doc_Date).format("YYYY-MM-DD"),
      p_InvoiceDate: dayjs(location.state.p_InvoiceDate).format("YYYY-MM-DD"),
      supplierName: location.state.supplierName,
      orderNo: location.state.orderNo,
      tax: location.state.tax,
      freight: location.state.freight || 0,
      amount: location.state.amount,
      acc_code: location.state.acc_code,
      others: location.state.others,
      remark: location.state.remark,
      instId: location.state.instId,
      sessionId: location.state.sessionId,
      purchaseinv: [],
    },
    validationSchema: Yup.object().shape({
      document_No: Yup.string().required(t("Document No. required")),
      orderNo: Yup.string().required(t("Order No. required")),
      doc_Date: Yup.date().required(t("Order Date required")),
      p_InvoiceDate: Yup.date().required(t("Invoice Date required")),
      supplierName: Yup.string().required(t("Supplier Name required")),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted with values:", values);
      const validItems = items.filter((item: any) => validateItem(item));

      if (validItems.length === 0) {
        alert("Please fill in at least one valid item.");
        return;
      }

      
      const updatedItems = validItems.map((item: any, index: any) => {
        const documentDate = values.doc_Date;

        const baseItem = {
          ...item,
          id: item.id,
          purchaseid: item.purchaseid,
          user_Id: item.user_Id,
          itemNameId: item.itemNameId.toString(),
          unit: item.unit.toString(),
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
          tax1: item.tax1,
          taxId1: item.taxId1,
          tax2: item.tax2,
          discount: item.discount,
          discountAmount: item.discountAmount,
          netAmount: item.netAmount,
          documentNo: values.document_No,
          documentDate: documentDate,
          invoiceNo: values.p_InvoiceNo,
          supplier: values.supplierName,
          orderNo: values.orderNo,
          mrnNo: "",
          mrnDate: documentDate,
          taxId3: "",
          tax3: "",
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
          `PurchaseInvoice/AddUpdatePurchaseInvoice`,
          { 
            ...values, 
            id: values.id.toString(),
            instId: values.instId.toString(),
            sessionId: values.sessionId.toString(),
            purchaseinv: updatedItems 
        }
        );
        if (response.data.isSuccess) {
          setToaster(false);
          toast.success(response.data.mesg);
          navigate("/Inventory/PurchaseInvoice");
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

  const handleItemChange = (index: any, field: any, value: any) => {
    const updatedItems = [...items];
    const item = updatedItems[index];

    if (["qty", "rate", "discount", "tax1"].includes(field)) {
        value = value === '' ? '0' : value;
    }

    item[field] = value;

    item.amount = parseFloat(item.qty || '0') * parseFloat(item.rate || '0');
    let abc = (item.amount * parseFloat(item.tax1 || '0')) / 100;
    item.taxId1 = abc.toString();

    item.discountAmount =
        item.tax2 === "P"
            ? (item.amount * parseFloat(item.discount || '0')) / 100
            : parseFloat(item.discount || '0');

    item.netAmount =
        item.amount + parseFloat(item.taxId1 || '0') - item.discountAmount;

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
            itemNameId: "",
            unit: "",
            qty: 0,
            rate: 0,
            amount: 0,
            tax1: "",
            taxId1: "",
            tax2: "P",
            discount: 0,
            discountAmount: 0,
            netAmount: 0,
            documentNo: formik.values.document_No,
            documentDate: formik.values.doc_Date,
            invoiceNo: formik.values.p_InvoiceNo,
            supplier: formik.values.supplierName,
            orderNo: formik.values.orderNo,
            mrnNo: "",
            mrnDate: "",
            taxId3: "",
            tax3: "",
        },
    ]);
};

useEffect(() => {
  const calculatedTotalAmount = items.reduce(
    (acc: number, item: any) => acc + (parseFloat(item.netAmount) || 0),
    0
  );
  setTotalAmount(calculatedTotalAmount);
  formik.setFieldValue("amount", calculatedTotalAmount.toFixed(2));
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
                {t("text.EditPurchaseInvoice")}
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

            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.invoiceno")}
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
                            <Grid item lg={4} xs={12}>
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
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="p_InvoiceDate"
                                    name="p_InvoiceDate"
                                    label={
                                        <CustomLabel
                                            text={t("text.vendorcontact")}
                                            required={true}
                                        />
                                    }
                                    value={formik.values.p_InvoiceDate}
                                    placeholder={t("text.vendorcontact")}
                                    size="small"
                                    //type="date"
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
                                    options={StatusOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("status", newValue?.value.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.orderno")} required={false} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="p_InvoiceDate"
                                    name="p_InvoiceDate"
                                    label={
                                        <CustomLabel
                                            text={t("text.orderdate")}
                                            required={true}
                                        />
                                    }
                                    value={formik.values.p_InvoiceDate}
                                    placeholder={t("text.orderdate")}
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





                            <Grid item lg={12} xs={12}>
                                <TextField
                                    id="document_No"
                                    name="document_No"
                                    label={
                                        <CustomLabel text={t("text.vendoraddress")} required={true} />
                                    }
                                    value={formik.values.document_No}
                                    placeholder={t("text.vendoraddress")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.document_No &&
                                        Boolean(formik.errors.document_No)
                                    }
                                    // helperText={
                                    //     formik.touched.document_No && formik.errors.document_No
                                    // }
                                />
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
                    {items.map((item: any, index: any) => (
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
                              handleItemChange(
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
                              handleItemChange(index, "unit", e.target.value)
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
                              handleItemChange(index, "qty", value);
                            }}
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
                                handleItemChange(
                                  index,
                                  "rate",
                                  value === "" ? "" : value
                                );
                              }
                            }}
                            inputProps={{
                              step: "any",
                              min: "0",
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
                            value={taxOption.find(
                              (opt: any) => opt.value === Number(item.tax1)
                            )}
                            onChange={(e, newValue: any) =>
                              handleItemChange(
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
                              handleItemChange(index, "tax2", e.target.value)
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
                              handleItemChange(
                                index,
                                "discount",
                                event.target.value
                              )
                            }
                            size="small"
                          />
                        </td>
                        <td>{item.discountAmount.toFixed(2)}</td>
                        <td>{item.netamount?.toFixed(2) || 0.00}</td>
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

export default EditPurchaseInvoice;