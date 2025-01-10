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

  Table,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { lang } from "moment";

import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import { getISTDate } from "../../../utils/Constant";
type Props = {};
const CreateQualityCheck = (props: Props) => {
  let navigate = useNavigate();
  const [lang, setLang] = useState<Language>("en");
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const initialRowData: any = {
    id: -1,
    qcId: 0,
    mrnId: 0,
    orderId: 0,
    orderNo: "",
    itemId: 0,
    mrnQty: 0,
    acceptQty: 0,
    rejectQty: 0,
    rate: 0,
    amount: 0,
    gstId: 0,
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    netAmount: 0,
    reason: "",
    batchNo: "",
    unitId: 0,
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);
  const [qcOptions, setQcOptions] = useState([]);
  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  type MrnOption = {
    label: string;
    value: number;
  };
  const [itemOption, setitemOption] = useState<any>([]);
  const [mrnNoOptions, setmrnNoOptions] = useState<MrnOption[]>([]);
  const mrnTypeOption = [
    { value: "-1", label: t("text.selectMRN") },
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];
  useEffect(() => {
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetmrnData();
    GetQcData();
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
  const GetmrnData = async () => {
    const collectData = {
      mrnId: -1,
    };
    const response = await api.post(`QualityCheck/GetMrn`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["mrnNo"],
        value: data[index]["mrnId"],
      });
    }
    setmrnNoOptions(arr);
  };
  const GetQcData = async () => {
    try {
      const response = await api.get(`QualityCheck/GetMaxQcNo`, {
        headers: {},
      });
      const data = response.data.data;
      if (data && data.length > 0) {
        const latestQcNo = data[0]["qcNo"];
        formik.setFieldValue("qcNo", latestQcNo);
        const arr = data.map((item: any) => ({
          label: item.qcNo,
          value: item.qcId,
        }));
        setQcOptions(arr);
      }
    } catch (error) {
      console.error("Error fetching QC data:", error);
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
  const getTaxData = async () => {
    const result = await api.post(`UnitMaster/GetTaxMaster`, {
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
  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue && newValue.value !== "-1") {
      setVendorDetail(newValue.details);
      formik.setFieldValue("vendorId", newValue.value);
    } else {
      setVendorDetail(null);
      formik.setFieldValue("vendorId", null);
    }
  };
  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };
    if (field === "orderNo") {
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
        item.cgst = selectedTax.value || 0;
        item.sgst = selectedTax.value || 0;
        item.igst = 0;
      }
    } else {
      item[field] = value;
    }
    if (item.mrnQty && item.rate) {
      item.amount =
        (parseFloat(item.mrnQty) || 0) * (parseFloat(item.rate) || 0);
    }
    if (item.gstRate) {
      item.gst = (
        (item.amount * (parseFloat(item.gstRate) || 0)) /
        100
      ).toFixed(2);
      item.sgst = (parseFloat(item.gst) / 2).toFixed(2);
      item.cgst = (parseFloat(item.gst) / 2).toFixed(2);
      item.igst = 0;
    }
    item.netAmount = (
      parseFloat(item.amount) + parseFloat(item.gst || "0")
    ).toFixed(2);
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
  const formik = useFormik({
    initialValues: {
      qcId: 0,
      qcNo: "",
      qcDate: defaultValues,
      mrnId: 0,
      mrnType: "",
      vendorId: 0,
      bill_ChalanNo: "",
      bill_ChalanDate: defaultValues,
      shipmentNo: "",
      remark: "",
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
      srn: 0,
      amount: 0,
      vendor: "",
      mrnDate: defaultValues,
      mrnNo: "",
      qcDetail: [],
    },

    validationSchema: Yup.object({
      qcDate: Yup.string().required(t("text.reqQcDate")),
      bill_ChalanNo: Yup.string().required(t("text.reqBillNum")),
      bill_ChalanDate: Yup.string().required(t("text.reqBillDate")),
    }),

    onSubmit: async (values) => {
      const isFirstRowDefault =
        tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].qcId === 0 &&
        tableData[0].mrnId === 0 &&
        tableData[0].orderId === 0 &&
        tableData[0].orderNo === "" &&
        tableData[0].itemId === 0 &&
        tableData[0].mrnQty === "" &&
        tableData[0].acceptQty === "" &&
        tableData[0].rejectQty === "" &&
        tableData[0].rate === "" &&
        tableData[0].amount === "" &&
        tableData[0].gstId === "" &&
        tableData[0].gstRate === "" &&
        tableData[0].cgst === "" &&
        tableData[0].sgst === "" &&
        tableData[0].igst === "" &&
        //  tableData[0].gst === "" &&
        tableData[0].netAmount === "" &&
        tableData[0].reason === "" &&
        tableData[0].batchNo === "" &&
        tableData[0].unitId === 0 &&
        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      const filteredTableData = tableData.filter((row) => {
        return !(
          row.id === -1 &&
          row.qcId === 0 &&
          row.mrnId === 0 &&
          row.orderId === "" &&
          row.orderNo === "" &&
          row.itemId === "" &&
          row.mrnQty === "" &&
          row.acceptQty === "" &&
          row.rejectQty === "" &&
          // row.quantity === "" &&
          row.rate === "" &&
          row.amount === "" &&
          row.gstId === "" &&
          row.gstRate === "" &&
          row.cgst === "" &&
          row.sgst === "" &&
          row.igst === "" &&
          //row.gst === "" &&
          row.netAmount === "" &&
          row.reason === "" &&
          row.batchNo === "" &&
          row.unitId === 0 &&
          Object.keys(row.item).length === 0
        );
      });

      // values.vendor = vendorDetail;

      const response = await api.post(`QualityCheck/UpsertQc`, {
        ...values,
        qcDetail: filteredTableData,
      });
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/Inventory/QualityCheck");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const back = useNavigate();

  console.log("formik.values", formik.values);

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
          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
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
                {t("text.createQualityCheck")}
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
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="qcNo"
                  name="qcNo"
                  label={<CustomLabel text={t("text.qcNo")} required={false} />}
                  value={formik.values.qcNo}
                  placeholder={t("text.qcNo")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="qcDate"
                  name="qcDate"
                  label={
                    <CustomLabel text={t("text.qcDate")} required={true} />
                  }
                  value={formik.values.qcDate}
                  placeholder={t("text.qcDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.qcDate && formik.errors.qcDate && (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.qcDate}
                  </div>
                )}
              </Grid>
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={mrnNoOptions}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (newValue) {
                      formik.setFieldValue(
                        "mrnId",
                        parseInt(newValue.value, 10)
                      ); // Cast to integer
                      formik.setFieldValue("mrnNo", newValue.label); // Store mrnNo as string
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.mrnNo")} required={false} />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="bill_ChalanNo"
                  name="bill_ChalanNo"
                  label={
                    <CustomLabel
                      text={t("text.bill_ChalanNo")}
                      required={true}
                    />
                  }
                  value={formik.values.bill_ChalanNo}
                  placeholder={t("text.bill_ChalanNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bill_ChalanNo &&
                  formik.errors.bill_ChalanNo && (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.bill_ChalanNo}
                    </div>
                  )}
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="bill_ChalanDate"
                  name="bill_ChalanDate"
                  label={
                    <CustomLabel
                      text={t("text.bill_ChalanDate")}
                      required={true}
                    />
                  }
                  type="date"
                  value={formik.values.bill_ChalanDate}
                  placeholder={t("text.bill_ChalanDate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.bill_ChalanDate &&
                  formik.errors.bill_ChalanDate && (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.bill_ChalanDate}
                    </div>
                  )}
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="shipmentNo"
                  name="shipmentNo"
                  label={
                    <CustomLabel text={t("text.shipmentNo")} required={false} />
                  }
                  value={formik.values.shipmentNo}
                  placeholder={t("text.shipmentNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              {vendorDetail?.gstinNo && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorGstin")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.gstinNo}
                    placeholder={t("text.vendorGstin")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
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
              <Grid
                item
                lg={12}
                md={12}
                xs={12}
                textAlign={"center"}
                fontSize={12}
                fontWeight={800}
              ></Grid>
              

              <Grid item xs={12} md={12} lg={12}>
                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
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
                          {t("text.OrderNo")}
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
                          {t("text.BatchNo")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.MrnQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.AcceptQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.RejectQty")}
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
                          {t("text.Reason")}
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
                              options={orderOption}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "orderNo",
                                  newValue?.value
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // label={
                                  //   <CustomLabel
                                  //     text={t("text.selectOrder")}
                                  //     required={false}
                                  //   />
                                  // }
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
                                  //   <CustomLabel
                                  //     text={t("text.selectItem")}
                                  //     required={false}
                                  //   />
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
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.batchNo}
                              size="small"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "batchNo",
                                  e.target.value
                                )
                              }
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
                              value={row.mrnQty}
                              onChange={(e) =>
                                handleInputChange(index, "mrnQty", e.target.value)
                              }
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
                              value={row.acceptQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "acceptQty",
                                  e.target.value
                                )
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
                              size="small"
                              value={row.rejectQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "rejectQty",
                                  e.target.value
                                )
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
                              size="small"
                              //  value={row.rate}
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
                          {/* <td
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
                            //  value={taxData.find((opt: any) => opt.value == row.gstId)}
                            onChange={(e: any, newValue: any) =>
                              handleInputChange(index, "gstId", newValue?.value)
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
                        </td> */}
                          {/* <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <TextField
                            value={(row.cgst + row.sgst + row.igst) || 0}
                            size="small"
                            inputProps={{ readOnly: true }}
                          />
                        </td> */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              //value={row.cgst.toFixed(2)}
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
                              // value={row.sgst.toFixed(2)}
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
                              // value={row.igst.toFixed(2)}
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
                          <td style={{ textAlign: "right" }}>
                            <TextField
                              type="text"
                              value={row.reason}
                              onChange={(event) => {
                                const value: any = event.target.value;
                                handleInputChange(index, "reason", value);
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
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={14}
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
                          colSpan={14}
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
                              (acc, row) =>
                                acc + (parseFloat(row.sgst + row.cgst) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={14}
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
                </div>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  placeholder="Remark"

                  onChange={(e: any) =>
                    formik.setFieldValue("remark", e.target.value)
                  }
                  style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid #ccc",

                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    resize: "none",
                  }}
                />
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

export default CreateQualityCheck;
