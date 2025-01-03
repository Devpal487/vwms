import {
  Autocomplete,
  Button,
  CardContent,
  Grid,
  Divider,
  TextField,
  Typography,
  TextareaAutosize,
  
  Table,
} from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";

type Props = {};

const EditQualityCheck = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const location = useLocation();

  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  // const [vendorDetail, setVendorDetail] = useState<any>();
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

    item: {},
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);

  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);

  const [itemOption, setitemOption] = useState<any>([]);
  const [qcOptions, setQcOptions] = useState([]);
  const [mrnNoOptions, setmrnNoOptions] = useState([]);

  const mrnTypeOption = [
    { value: "-1", label: t("text.selectMRN") },
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    getQcById(location.state.qcId);
    // getVendorDatabyID(location.state.vendorId);
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetmrnData();
    GetQcData();
  }, []);

  const GetmrnData = async () => {
    try {
      const response = await api.get(`Mrn/GetMaxcMrnNo`, { headers: { 'MrnId': '-1' } },);
      const data = response.data.data;
      if (data && data.length > 0) {
        const latestmrnNo = data[0]["mrnNo"];

        // Set QC number in formik and options
        formik.setFieldValue('mrnNo', latestmrnNo);
        const arr = data.map((item: any) => ({
          label: item.mrnNo,
          value: item.mrnId,
        }));

        setmrnNoOptions(arr);
      }
    } catch (error) {
      console.error("Error fetching QC data:", error);
    }
  };

  const GetQcData = async () => {
    try {
      const response = await api.get(`Qc/GetMaxQcNo`,
        { headers: { 'QcId': '-1' } },
      );

      const data = response.data.data;

      // Assuming the first item in data has the latest QC number
      if (data && data.length > 0) {
        const latestQcNo = data[0]["qcNo"];

        // Set QC number in formik and options
        formik.setFieldValue('qcNo', latestQcNo);
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





  const getQcById = (id: any) => {

    api.get(`Qc/GetQc`, { headers: { QcId: id } })
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const data = response.data.data[0]['qcDetail'];
          if (data != null) {
            const arr = data?.map((item: any) => {
              return {
                id: item.id,
                qcId: item.qcId,
                mrnId: item.mrnId,
                orderId: item.orderId,
                orderNo: item.orderNo,
                batchNo: item.batchNo,
                mrnQty: item.mrnQty,
                acceptQty: item.acceptQty,
                itemId: item.itemId,
                rejectQty: item.rejectQty,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
                gstId: item.gstId,
                gstRate: item.gstRate,
                cgst: item.cgst,
                sgst: item.sgst,
                igst: item.igst,
                gst: item.gst,
                reason: item.reason,
                netAmount: item.netAmount
                //  item: {},
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

  const GetitemData = async () => {
    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
    const data = response.data.data;
    const arr =
      data?.map((item: any) => ({
        label: `${item.itemName}`,
        value: item.itemMasterId,
        details: item,
      })) || [];
    setitemOption([{ value: -1, label: t("text.selectItem"), details: "" }, ...arr]);
  };

  const GetorderData = async () => {
    const collectData = {
      id: -1,
    };
    const response = await api.post(`PurchaseInvoice/GetPurchaseInvoice`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["orderNo"],
        value: data[index]["id"],
      });
    }
    setorderOption(arr);
  };

  const getVendorData = async () => {
    const result = await api.post(`VendorMaster/Ge3tVendorMaster`, {
      venderId: -1,
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

  // const getVendorDatabyID = async (id: any) => {
  //   const result = await api.post(`VendorMaster/Ge3tVendorMaster`, {
  //     venderId: id,
  //   });
  //   if (result.data.isSuccess) {
  //     const arr =
  //       result?.data?.data?.map((item: any) => ({
  //         details: item
  //       })) || [];

  //     setVendorDetail(arr[0]['details']);
  //   }
  // };

  // console.log("setVendorDetail", vendorDetail);

  const getTaxData = async () => {
    const result = await api.post(`TaxMaster/GetTaxMaster`, {
      taxId: -1,
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.taxPercentage}`,
          value: item.taxId,
        })) || [];

      setTaxData([{ value: "-1", label: t("text.tax") }, ...arr]);
    }
  };


  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue) {
      // Set vendorId and vendor name correctly
      formik.setFieldValue("vendor", newValue.details?.name || ""); // Set vendor name
      formik.setFieldValue("vendorId", newValue?.value || 0); // Set vendorId
    } else {
      // Reset values when no vendor is selected
      formik.setFieldValue("vendor", ""); // Reset vendor name
      formik.setFieldValue("vendorId", 0); // Reset vendorId
    }
  };



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
      totalGrossAmount: totals.totalGrossAmount,
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
  const formik = useFormik({
    initialValues: {
      qcId: location.state.id,
      qcNo: location.state.qcNo,
      qcDate: dayjs(location.state.qcDate).format("YYYY-MM-DD"),
      mrnId: location.state.mrnId,
      mrnType: location.state.mrnType,
      vendorId: location.state.vendorId,
      bill_ChalanNo: location.state.bill_ChalanNo,
      bill_ChalanDate: dayjs(location.state.bill_ChalanDate).format("YYYY-MM-DD"),
      shipmentNo: location.state.shipmentNo,
      remark: location.state.remark,
      totalAmount: location.state.totalAmount,
      totalCGST: location.state.totalCGST,
      totalSGST: location.state.totalSGST,
      totalIGST: location.state.totalIGST,
      totalGrossAmount: location.state.totalGrossAmount,
      disPer: location.state.disPer,
      disAmt: location.state.disAmt,
      netAmount: location.state.netAmount,
      // qcApplicable: location.state.qcApplicable,
      // qcStatus: location.state.qcStatus,
      createdBy: defaultValues,
      updatedBy: defaultValues,
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: location.state.companyId,
      fyId: location.state.fyId,
      qcDetail: [],
      vendor: location.state.vendor,
      mrnDate: defaultValues,
      mrnNo: location.state.mrnNo,
      srn: location.state.srn,
    },

    onSubmit: async (values) => {
      const isFirstRowDefault = tableData[0] &&
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
        tableData[0].gst === "" &&
        tableData[0].netAmount === "" &&
        tableData[0].reason === "" &&
        tableData[0].batchNo === "" &&
        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      const filteredTableData = tableData.filter(row => {
        return !(
          row.id === -1 &&
          row.qcId === 0 &&
          row.mrnId === "" &&
          row.orderId === "" &&
          row.orderNo === "" &&
          row.batchNo === "" &&
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
          row.gst === "" &&
          row.netAmount === "" &&
          row.reason === "" &&
          Object.keys(row.item).length === 0
        );
      });
      // values.vendor = vendorDetail;

      const response = await api.post(`Qc/AddUpdateQc`, {
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
            {t("text.EditQualityCheck")}
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
              {/* <Grid item lg={12} xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.qcApplicable}
                        onChange={formik.handleChange}
                        name="qcApplicable"
                      />
                    }
                    label="QC Applicable"
                  />
                </FormGroup>
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="qcNo"
                  name="qcNo"
                  label={
                    <CustomLabel text={t("text.qcNo")} required={false} />
                  }
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
              </Grid>
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={mrnNoOptions}
                  fullWidth
                  size="small"
                  value={mrnNoOptions.find((opt: any) => opt.value === formik.values.mrnId) || null} // Set initial value
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("mrnNo", newValue?.value?.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.mrnNo")}
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
                {/* <Grid item lg={12} xs={12}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    {t("text.Vendordetails")}
                  </Typography>
                </Grid> */}
                <Divider />

                <Grid item lg={4} xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={vendorData}
                    getOptionLabel={(option: any) => option.label}  // Display vendor name
                    // value={
                    //   vendorData.find((vendor: any) => vendor.value === formik.values.vendorId) || null
                    // }  // Select the vendor object based on vendorId from Formik state
                    onChange={(event, newValue) => handleVendorSelect(event, newValue)}  // Call the select handler
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.SelectVendor")} required={false} />}
                      />
                    )}
                  />
                </Grid>


                {/* {vendorDetail?.gstinNo && (
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
                )} */}

                {/* {vendorDetail?.contactPerson && (
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
                )} */}

                {/* {vendorDetail?.permanentAddress && (
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
                )} */}

                {/* {vendorDetail?.mobileNo && (
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
                )} */}
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
                      {

                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.totalTax")}
                        </th>
                      }
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
                            value={orderOption.find((opt: any) => opt.value == row.orderId)}
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
                                label={
                                  <CustomLabel
                                    text={t("text.selectOrder")}
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
                            // textAlign: "center",
                          }}
                        >
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={itemOption}
                            fullWidth
                            size="small"
                            value={itemOption.find((opt: any) => opt.value === row.itemId)}
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
                          <TextField
                            value={row.batchNo}
                            size="small"
                            onChange={(e) => handleInputChange(index, "batchNo", e.target.value)}
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
                            onChange={(e) => handleInputChange(index, "mrnQty", e.target.value)}
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
                            onChange={(e) => handleInputChange(index, "acceptQty", e.target.value)}
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
                            onChange={(e) => handleInputChange(index, "rejectQty", e.target.value)}
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
                            value={row.rate}
                            onChange={(e) => handleInputChange(index, "rate", e.target.value)}
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
                            value={taxData.find((opt: any) => opt.value == row.gstId)}
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
                        </td>
                        <td
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
                        </td>
                        {/* <td
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
                        </td> */}
                        {/* <td
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
                        </td> */}
                        {/* <td
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
                        </td> */}
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
                      <td colSpan={10} style={{ textAlign: "right", fontWeight: "bold" }}>
                      {t("text.Totalnetamount")}
                      </td>
                      <td style={{ textAlign: "center", border: "1px solid black" }}>
                        {tableData.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={10} style={{ textAlign: "right", fontWeight: "bold" }}>
                      {t("text.Totaltaxamount")}
                      </td>
                      <td style={{ textAlign: "center", border: "1px solid black" }}>
                        {tableData.reduce((acc, row) => acc + (parseFloat(row.sgst + row.cgst) || 0), 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={10} style={{ textAlign: "right", fontWeight: "bold" }}>
                      {t("text.Totalgrossamount")}
                      </td>
                      <td style={{ textAlign: "center", border: "1px solid black" }}>
                        {tableData.reduce((acc, row) => acc + (parseFloat(row.netAmount) || 0), 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
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
                <TextareaAutosize
                  placeholder={t("text.Remark")}
                  minRows={1}
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
                  {t("text.update")}
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
    </div>
  );
};

export default EditQualityCheck;