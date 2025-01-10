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
import { getISTDate } from "../../../utils/Constant";

type Props = {};



const CreateMaterialRecieptNote = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const initialRowData: any = {

    "sno": 0,
    "id": -1,
    "mrnId": 0,
    "orderId": 0,
    "orderNo": "",
    "batchNo": "",
    "serialNo": "",
    "qcStatus": "",
    "itemId": 0,
    "balQuantity": 0,
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
    "netAmount": 0,
    "unitId": 0,
    "qcApplicable": true


  };
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
    getMRNNo();
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
    setUnitOptions(arr);
  };
  const getMRNNo = async () => {
    const result = await api.get(`QualityCheck/GetMaxcMrnNo`);
    if (result?.data.status === 1) {
      formik.setFieldValue("mrnNo", result.data.data[0]["mrnNo"]);
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
      "orderId": -1,
      "indentId": -1
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

  const formik = useFormik({
    initialValues: {

      "sno": 0,
      "mrnId": 0,
      "mrnNo": "",
      "mrnDate": defaultValues,
      "mrnType": "",
      "vendorId": null,
      "bill_ChalanNo": "",
      "bill_ChalanDate": defaultValues,
      "shipmentNo": "",
      "remark": "",
      "totalAmount": 0,
      "totalCGST": 0,
      "totalSGST": 0,
      "totalIGST": 0,
      "totalGrossAmount": 0,
      "disPer": 0,
      "disAmt": 0.0,
      "netAmount": 0.0,
      "qcApplicable": true,
      "qcStatus": "",
      "createdBy": "",
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "mrnDetail": []


    },
    onSubmit: async (values) => {

      const isFirstRowDefault = tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].mrnId === 0 &&
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

      const filteredTableData = tableData.filter(row => {
        return !(
          row.id === -1 &&
          row.mrnId === 0 &&
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

      const response = await api.post(`QualityCheck/UpsertMrn`, {
        ...values,
        mrnDetail: filteredTableData,
      });
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/Inventory/MRNForm");
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
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.createMaterialRecieptNote")}
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
              <Grid item lg={12} xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.qcApplicable}
                        onChange={formik.handleChange}
                        name="qcApplicable"
                      />
                    }
                    label={t("text.QCApplicable")}
                  />
                </FormGroup>
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="mrnNo"
                  name="mrnNo"
                  label={
                    <CustomLabel text={t("text.mrnNo")} required={false} />
                  }
                  value={formik.values.mrnNo}
                  size="small"
                  fullWidth
                  InputLabelProps={{ "aria-readonly": true }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="mrnDate"
                  name="mrnDate"
                  label={
                    <CustomLabel text={t("text.mrnDate")} required={true} />
                  }
                  value={formik.values.mrnDate}
                  placeholder={t("text.mrnDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={mrnTypeOption}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("mrnType", newValue?.value.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.mrnType")}
                          required={false}
                        />
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

              <Grid container item spacing={2} xs={12} md={12} lg={12}>
                <Grid item lg={12} xs={12}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    {t("text.Vendordetails")}
                  </Typography>
                </Grid>
                <Divider />

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
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <div style={{ overflow: "scroll", margin: 0, padding: 0 }}>
                
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
                        {t("text.BatchNo")}
                      </th>

                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.unit")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.BalQty")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.ApproveQty")}
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
                                //     text={t("text.selectorderNo")}
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
                          <TextField
                            // value={row.batchNo}
                            size="small"
                            onChange={(e) => handleInputChange(index, "batchNo", e.target.value)}
                          />
                        </td>
                        <td style={{ border: "1px solid black", textAlign: "center" }}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={unitOptions}
                            value={
                              unitOptions.find((opt) => (opt.value) === row?.unitId) || null
                            }
                            fullWidth
                            size="small"
                            onChange={(e, newValue: any) =>
                              handleInputChange(index, "unitId", newValue?.value)
                            }
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                              //  label={<CustomLabel text={t("text.selectUnit")} />}
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
                            size="small"
                            // value={row.balQuantity}
                            onChange={(e) => handleInputChange(index, "balQuantity", e.target.value)}
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
                            // value={row.quantity}
                            onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
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
                            // value={row.rate}
                            onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                            inputProps={{ step: "any", min: "0" }}
                          />
                        </td>
                        {/* <td
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
                        </td> */}
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
                                //   <CustomLabel
                                //     text={t("text.tax")}
                                //     required={false}
                                //   />
                                // }
                              />
                            )}
                          />
                        </td>
                        {/* <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }} ,
                        >
                          <TextField
                            value={row.gst}
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
                      <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {t("text.Totalnetamount")}

                      </td>
                      <td style={{ textAlign: "center", border: "1px solid black" }}>
                        {tableData.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {t("text.Totaltaxamount")}


                      </td>
                      <td style={{ textAlign: "center", border: "1px solid black" }}>
                        {tableData.reduce((acc, row) => acc + (parseFloat(row.gst) || 0), 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {t("text.Totalgrossamount")}

                      </td>
                      <td style={{ textAlign: "center", border: "1px solid black" }}>
                        {tableData.reduce((acc, row) => acc + (parseFloat(row.netAmount) || 0), 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </Grid>
            {/* 
              <Grid container item spacing={2} xs={12} md={12} lg={12}>
                <Grid item lg={4} xs={12}>
                  <TextField
                    id="totalAmount"
                    name="totalAmount"
                    label={
                      <CustomLabel
                        text={t("text.totalAmount")}
                        required={false}
                      />
                    }
                    value={formik.values.totalAmount}
                    placeholder={t("text.totalAmount")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      readOnly: true,
                      onClick: (e) => {
                        e.currentTarget.focus();
                        formik.setFieldError(
                          "totalAmount",
                          t("text.totalAmountReadOnly")
                        );
                      },
                      onFocus: (e) => {
                        formik.setFieldError(
                          "totalAmount",
                          t("text.totalAmountReadOnly")
                        );
                      },
                    }}
                    error={
                      formik.touched.totalAmount &&
                      Boolean(formik.errors.totalAmount)
                    }
                    helperText={
                      formik.touched.totalAmount && formik.errors.totalAmount
                    }
                    FormHelperTextProps={{ style: { color: "red" } }}
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <TextField
                    id="totalTax"
                    name="totalTax"
                    label={
                      <CustomLabel text={t("text.totalTax")} required={false} />
                    }
                    value={(
                      (parseFloat(formik.values.totalCGST) || 0) +
                      (parseFloat(formik.values.totalSGST) || 0) +
                      (parseFloat(formik.values.totalIGST) || 0)
                    ).toFixed(2)} // Ensures the value is formatted to two decimal places
                    placeholder={t("text.totalTax")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      readOnly: true,
                      onClick: (e) => {
                        e.currentTarget.focus();
                        formik.setFieldError(
                          "totalTax",
                          t("text.totalTaxReadOnly")
                        );
                      },
                      onFocus: (e) => {
                        formik.setFieldError(
                          "totalTax",
                          t("text.totalTaxReadOnly")
                        );
                      },
                    }}
                    // error={
                    //   formik.touched.totalTax &&
                    //   Boolean(formik.errors.totalTax)
                    // }
                    // helperText={
                    //   formik.touched.totalTax && formik.errors.totalTax
                    // }
                    FormHelperTextProps={{ style: { color: "red" } }}
                  />
                </Grid>
                {/* <Grid item lg={4} xs={12}>
                  <TextField
                    id="totalCGST"
                    name="totalCGST"
                    label={
                      <CustomLabel
                        text={t("text.totalCGST")}
                        required={false}
                      />
                    }
                    value={formik.values.totalCGST}
                    placeholder={t("text.totalCGST")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      readOnly: true,
                      onClick: (e) => {
                        e.currentTarget.focus();
                        formik.setFieldError(
                          "totalCGST",
                          t("text.totalCGSTReadOnly")
                        );
                      },
                      onFocus: (e) => {
                        formik.setFieldError(
                          "totalCGST",
                          t("text.totalCGSTReadOnly")
                        );
                      },
                    }}
                    error={
                      formik.touched.totalCGST &&
                      Boolean(formik.errors.totalCGST)
                    }
                    helperText={
                      formik.touched.totalCGST && formik.errors.totalCGST
                    }
                    FormHelperTextProps={{ style: { color: "red" } }}
                  />
                </Grid> */}
            {/* <Grid item lg={4} xs={12}>
                  <TextField
                    id="totalSGST"
                    name="totalSGST"
                    label={
                      <CustomLabel
                        text={t("text.totalSGST")}
                        required={false}
                      />
                    }
                    value={formik.values.totalSGST}
                    placeholder={t("text.totalSGST")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      readOnly: true,
                      onClick: (e) => {
                        e.currentTarget.focus();
                        formik.setFieldError(
                          "totalSGST",
                          t("text.totalSGSTReadOnly")
                        );
                      },
                      onFocus: (e) => {
                        formik.setFieldError(
                          "totalSGST",
                          t("text.totalSGSTReadOnly")
                        );
                      },
                    }}
                    error={
                      formik.touched.totalSGST &&
                      Boolean(formik.errors.totalSGST)
                    }
                    helperText={
                      formik.touched.totalSGST && formik.errors.totalSGST
                    }
                    FormHelperTextProps={{ style: { color: "red" } }}
                  />
                </Grid> */}
            {/* <Grid item lg={4} xs={12}>
                  <TextField
                    id="totalIGST"
                    name="totalIGST"
                    label={
                      <CustomLabel
                        text={t("text.totalIGST")}
                        required={false}
                      />
                    }
                    value={formik.values.totalIGST}
                    placeholder={t("text.totalIGST")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      readOnly: true,
                      onClick: (e) => {
                        e.currentTarget.focus();
                        formik.setFieldError(
                          "totalIGST",
                          t("text.totalIGSTReadOnly")
                        );
                      },
                      onFocus: (e) => {
                        formik.setFieldError(
                          "totalIGST",
                          t("text.totalIGSTReadOnly")
                        );
                      },
                    }}
                    error={
                      formik.touched.totalIGST &&
                      Boolean(formik.errors.totalIGST)
                    }
                    helperText={
                      formik.touched.totalIGST && formik.errors.totalIGST
                    }
                    FormHelperTextProps={{ style: { color: "red" } }}
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <TextField
                    id="totalGrossAmount"
                    name="totalGrossAmount"
                    label={
                      <CustomLabel
                        text={t("text.totalGrossAmount")}
                        required={false}
                      />
                    }
                    value={formik.values.totalGrossAmount}
                    placeholder={t("text.totalGrossAmount")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      readOnly: true,
                      onClick: (e) => {
                        e.currentTarget.focus();
                        formik.setFieldError(
                          "totalGrossAmount",
                          t("text.totalGrossAmountReadOnly")
                        );
                      },
                      onFocus: (e) => {
                        formik.setFieldError(
                          "totalGrossAmount",
                          t("text.totalGrossAmountReadOnly")
                        );
                      },
                    }}
                    error={
                      formik.touched.totalGrossAmount &&
                      Boolean(formik.errors.totalGrossAmount)
                    }
                    helperText={
                      formik.touched.totalGrossAmount &&
                      formik.errors.totalGrossAmount
                    }
                    FormHelperTextProps={{ style: { color: "red" } }}
                  />
                </Grid>
              </Grid> */}


            <Grid item xs={12} md={12} lg={12}>
              <TextField
                placeholder={t("text.Remark")}

                value={formik.values.remark}
                onChange={(e: any) => formik.setFieldValue("remark", e.target.value)}
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
    </div >
  );
};

export default CreateMaterialRecieptNote;

