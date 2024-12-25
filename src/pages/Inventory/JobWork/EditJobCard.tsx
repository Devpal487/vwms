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
    TextareaAutosize,
    Table,
    Modal,
    Box,
    Select,
    IconButton,
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
import nopdf from "../../../assets/images/imagepreview.jpg";
import { Language } from "react-transliterate";
import AddIcon from '@mui/icons-material/Add'

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




const CreateJobCard = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const { defaultValues } = getISTDate();



    const [lang, setLang] = useState<Language>("en");

    const [toaster, setToaster] = useState(false);
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");
    const [empOption, setempOption] = useState<any>([]);

    const [approveEmp1, setApproveEmp1] = useState<any>('');



    const initialRowData = {
        id: 0,
        jobCardId: 0,
        itemId: 0,
        indentId: 0,
        indentNo: "",
        qty: 0,
        rate: 0,
        batchNo: "",
        amount: 0,
        gstId: 0,
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        netAmount: 0,
        srno: 0,
        isDelete: true,
        prevReading: 0

    };
    const [tableData, setTableData] = useState<any>([{ ...initialRowData }]);
    console.log('tableData', tableData);

    const initialServiceRowData = {
        serviceId: 0,
        serviceName: "",
        status: "",
        vendor: "",
        serviceAmount: 0,
        netServiceAmount: 0,
        reading: "",
        challanNo: "",
        remark: "",
        serviceDate: "",
        isCompleted: false
    };

    const [serviceTable, setServiceTable] = useState<any>([{ ...initialServiceRowData }]);
    console.log("serviceTable", serviceTable);
    const [taxData, setTaxData] = useState([]);

    const [orderOption, setorderOption] = useState<any>([
        { value: -1, label: t("text.id") },
    ]);
    const [itemOption, setitemOption] = useState([
        { value: -1, label: t("text.itemMasterId") },
    ]);
    const [selectedItem1, setSelectedItem1] = useState("");
    const [selectedItem2, setSelectedItem2] = useState("");
    const [vendorData, setVendorData] = useState([
        { value: "-1", label: t("text.SelectvendorId") }
    ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);
    // const [empOption, setempOption] = useState([
    //     { value: "-1", label: t("text.empid") },
    // ]);
    const [taxOption, setTaxOption] = useState([]);



    const [selectedVendor, setSelectedVendor] = useState("");
    const [indentOptions, setIndentOptions] = useState([]);

    const handlePanClose1 = () => {
        setOpen(false);
    };
    // const defaultValues: string = new Date().toISOString().split('T')[0];




    useEffect(() => {
        getVendorData();
        getTaxData();
        GetitemData();
        GetempData();
        GetUnitData();


        GetIndentData();
    }, []);
    useEffect(() => {
        const totalItemAmount = tableData.reduce((sum: any, row: any) => sum + (row.totalItem || 0), 0);
        formik.setFieldValue('totalItemAmount', totalItemAmount.toFixed(2));
    }, [tableData]);

    const GetIndentData = async () => {
        try {
            const response = await axios.get('indentParent/GetMaxindentNo', {
                headers: { 'indentID': '-1' },
            });

            const data = response.data.data;


            if (data && data.length > 0) {
                const arr = data.map((item: any) => ({
                    label: item.indentNo,
                    value: item.indentID,
                }));

                setIndentOptions(arr);
            }
        } catch (error) {
            console.error("Error fetching indent data:", error);
        }
    };

    const GetitemData = async () => {
        const collectData = {
            itemMasterId: -1,
        };
        try {
            const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
            const data = response.data.data;
            const arr = data.map((item: any) => ({
                label: item.itemName,
                value: item.itemMasterId,
                details: item, // Store the full item data here
            }));
            setitemOption(arr);
        } catch (error) {
            console.error("Error fetching item data:", error);
        }
    };

    const GetempData = async () => {
        const collectData = {
            empid: -1,
            userId: "",
            empName: "",
            empMobileNo: "",
            empDesignationId: -1,
            empDeptId: -1,
            empStateId: -1,
            empCountryID: -1,
            empCityId: -1,
            empPincode: 0,
            roleId: ""
        };
        const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["empName"],
                value: data[index]["empid"],
                details: data
            });
        }
        setempOption([{ value: "-1", label: t("text.SelectEmployeeName"), details: "" }, ...arr]);
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





    const getTaxData = async () => {
        const result = await api.post(`TaxMaster/GetTaxMaster`, {
            taxId: -1,
        });
        if (result.data.isSuccess) {
            const arr:any =
                result?.data?.data?.map((item: any) => ({
                    label: `${item.taxPercentage}`,
                    value: item.taxId,
                })) || [];


            setTaxData([
                { value: "-1", label: t("text.SelectTax") },
                ...arr,
            ] as any);
        }

        //setTaxOption(arr);
    }
    // const Getempitem = async () => {
    //     const collectData = {
    //         empid: -1,
    //         userId: "",
    //         empName: "",
    //         empMobileNo: "",
    //         empDesignationId: -1,
    //         empDeptId: -1,
    //         empStateId: -1,
    //         empCountryID: -1,
    //         empCityId: -1,
    //         empPincode: 0,
    //         roleId: ""
    //     };
    //     const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
    //     const data = response.data.data;
    //     const arr = [];
    //     for (let index = 0; index < data.length; index++) {
    //         arr.push({
    //             label: data[index]["empName"],
    //             value: data[index]["empName"],
    //         });
    //     }
    //     setempOption(arr);

    // };
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

    const handleVendorSelect = (event: any, newValue: any) => {
        console.log(newValue);
        if (newValue && newValue.value !== "-1") {

            formik.setFieldValue("approveEmp1", newValue.value);

            const selectedDetail = newValue.details.find((detail: any) => {
                console.log("Checking detail:", detail);
                return detail.empid === newValue.value;
            });

            if (selectedDetail) {
                console.log("Matching Detail:", selectedDetail);
                formik.setFieldValue("approveEmployee1", selectedDetail);
                setApproveEmp1(selectedDetail);
            } else {
                console.log("No matching detail found");
            }
        } else {
            formik.setFieldValue("approveEmployee1", '');
            setApproveEmp1('');
        }
    };


    const modalOpenHandle1 = (event: string) => {
        setOpen(true);
        const base64Prefix = "data:image/jpg;base64,";

        let imageData = '';
        switch (event) {
            case "file":
                if (formik.values.complaintItem && formik.values.complaintItem[0]) {
                    imageData = formik.values.complaintItem[0].file;
                  }
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
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = base64String.split(',')[1];
            formik.setFieldValue(params, base64Data);
            console.log(`File '${file.name}' loaded as base64 string`);
            console.log("base64Data", base64Data);
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
    };

    const handleServiceInputChange = (index: number, field: string, value: any) => {
        // Clone the service table data to avoid direct mutation
        const newServiceData = [...serviceTable];

        // Update specific fields based on the field parameter
        if (field === 'serviceId') {
            newServiceData[index].serviceId = value;
        } else if (
            field === 'serviceName' ||
            field === 'status' ||
            field === 'vendor' ||
            field === 'reading' ||
            field === 'challanNo' ||
            field === 'remark' ||
            field === 'serviceDate'
        ) {
            newServiceData[index][field] = String(value);
        } else if (field === 'serviceAmount') {
            newServiceData[index].serviceAmount = typeof value === 'string' ? parseFloat(value) : value;
            newServiceData[index].netServiceAmount = parseFloat((Number(newServiceData[index].serviceAmount) || 0).toFixed(2));
        } else if (field === 'isCompleted') {
            newServiceData[index][field] = value === 'true';
        }

        // Update the service table state
        setServiceTable(newServiceData);

        // Add a new row if required fields are filled and this is the last row
        if (areRequiredFieldsFilled(newServiceData[index]) && index === newServiceData.length - 1) {
            addServiceRow();
        }
    };

    // Function to check if the required fields are filled in a row
    const areRequiredFieldsFilled = (row: any) => {
        const { serviceId, serviceName, vendor } = row;
        return serviceId && serviceName && vendor;
    };


    const handleInputChange = (index: number, field: string, value: any) => {
        const newData: any = [...tableData];
        newData[index][field] = typeof value === 'string' ? parseFloat(value) : value;


        if (field === 'indentNo') {
            newData[index][field] = String(value);
        }



        if (field === 'quantity' && newData[index].quantity < 0) {
            newData[index].quantity = 0;
        }

        if (field === 'quantity' || field === 'rate') {
            newData[index].amount = (Number(newData[index].quantity) || 0) * (Number(newData[index].rate) || 0);
        }

        if (field === 'gstId') {
            const selectedTax: any = taxData.find((tax: any) => tax.value === newData[index][field]);
            if (selectedTax) {
                newData[index].gstRate = parseFloat(selectedTax.label) || 0;
                newData[index].gst = newData[index].gstRate;
            }
        }

        if (field === 'amount' || field === 'gstRate' || field === 'gstId') {
            const gstAmount = (Number(newData[index].amount) || 0) * (Number(newData[index].gstRate) || 0) / 100;
            const isInterStateTransaction = false;

            if (isInterStateTransaction) {
                newData[index].igst = Number(gstAmount.toFixed(2));
                newData[index].igstid = newData[index].gstId;
                newData[index].cgst = 0;
                newData[index].sgst = 0;
                newData[index].cgstid = 0;
                newData[index].sgstid = 0;
            } else {
                newData[index].igst = 0;
                newData[index].igstid = 0;
                newData[index].cgst = Number((gstAmount / 2).toFixed(2));
                newData[index].sgst = Number((gstAmount / 2).toFixed(2));
                newData[index].cgstid = newData[index].gstId;
                newData[index].sgstid = newData[index].gstId;
            }
        }

        // Calculate Total Tax and Net Amount
        newData[index].netAmount = parseFloat(
            (
                (Number(newData[index].amount) || 0) +
                (Number(newData[index].cgst) || 0) +
                (Number(newData[index].sgst) || 0) +
                (Number(newData[index].igst) || 0)
            ).toFixed(2)
        );

        // Set total item amount
        newData[index].totalItem = newData[index].amount + (Number(newData[index].cgst) || 0) + (Number(newData[index].sgst) || 0) + (Number(newData[index].igst) || 0);

        setTableData(newData);
        // setServiceTable(newData);
        updateTotalAmounts(newData);

        if (isRowFilled(newData[index]) && index === newData.length - 1) {
            addRow();
        }
    };
    const isRowFilled = (row: any) => {
        return row.orderNo && row.item && row.batchNo && row.quantity > 0 && row.rate > 0;
    };


    const updateTotalAmounts = (data: any[]) => {
        const totals = data.reduce((acc, row) => {
            acc.totalAmount += row.amount;
            acc.totalCGST += row.cgst;
            acc.totalSGST += row.sgst;
            acc.totalIGST += row.igst;
            acc.totalGrossAmount += row.netAmount;
            return acc;
        }, {
            totalAmount: 0,
            totalCGST: 0,
            totalSGST: 0,
            totalIGST: 0,
            totalGrossAmount: 0
        });

        formik.setValues({
            ...formik.values,
            ...totals
        });
    };



    const deleteRow = (index: number) => {
        if (tableData.length === 1) {
            // If there's only one row, reset it to initial values
            setTableData([{ ...initialRowData }]);
            setServiceTable([{ ...initialServiceRowData }]); // Reset the serviceTable to initial values
        } else {
            // Filter out the row in both tableData and serviceTable by index
            const newTableData = tableData.filter((_: any, i: number) => i !== index);
            const newServiceTable = serviceTable.filter((_: any, i: number) => i !== index);

            setTableData(newTableData);
            setServiceTable(newServiceTable);
        }

        // Update total amounts after deletion
        updateTotalAmounts(tableData);
    };

    const addServiceRow = () => {
        setServiceTable([...serviceTable, { ...initialServiceRowData }])

    }

    const addRow = () => {
        setTableData([...tableData, { ...initialRowData }]);
    };

    const formik = useFormik({
        initialValues: {

            jobCardId: 0,
            jobCardNo: "",
            jobCardDate: defaultValues,
            complainId: 0,
            complainDate: defaultValues,
            empId: 0,
            itemId: 0,
            currenReading: 0,
            complain: "",
            status: "",
            serviceType: "",
            createdBy: defaultValues,
            updatedBy: defaultValues,
            createdOn: defaultValues,
            updatedOn: defaultValues,
            companyId: 0,
            fyId: 0,
            totalItemAmount: 0,
            totalServiceAmount: 0,
            netAmount: 0,
            itemName: "",
            empName: "",
            serviceDetail: [],
            itemDetail: [initialRowData],
            srno: 0,
            type: "",
            inHouse: "",
            outSource: "",
            vehicleNo: "",
            complaintItem: [
                {
                    compId: 0,
                    itemID: 2147483647,
                    complaintType: "",
                    complaintDoc: "",
                    empId: 2147483647,
                    approveEmp4: 0,
                    approveEmp3: 0,
                    approveEmp2: 0,
                    approveEmp1: 0,
                    complaint: defaultValues,
                    complaintNo: defaultValues,
                    createdBy: defaultValues,
                    updatedBy: defaultValues,
                    status: "",
                    currentReading: 0,
                    createdOn: defaultValues,
                    complaintDate: defaultValues,
                    updatedOn: defaultValues,
                    compAppdt: defaultValues,
                    jobCardNo: "",
                    srno: 0,
                    file: "",
                    fileOldName: "",
                    totaldays: 0,
                    outDate: defaultValues,
                    outId: 0,
                    vehicleNo: "",
                    update: true
                  },
            ],
            totaldays: 0,
            vendorId: 0,
            update: true







        },


        onSubmit: async (values) => {
            console.log("values", values);
            values.serviceDetail = serviceTable;

            values.itemDetail = tableData;

            const response = await api.post(`JobCard/AddUpdateJobCard`, values);
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/Inventory/JobCardMaster");
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
                </Grid>
   */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={itemOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.details);
                                        formik.setFieldValue("data", newValue?.details);
                                        formik.setFieldValue("itemID", newValue?.value);
                                    }}
                                    renderInput={(params: any) => (
                                        <TextField
                                            {...params}
                                            label="Select Item"
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.jobCardNo")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="jobCardNo"
                                    id="jobCardNo"
                                    // type="date"
                                    value={formik.values.jobCardNo}
                                    placeholder={t("text.jobCardNo")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="jobCardDate"
                                    name="jobCardDate"
                                    label={<CustomLabel text={t("text.jobCardDate")} required={false} />}
                                    value={formik.values.jobCardDate}
                                    placeholder={t("text.jobCardDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    label={<CustomLabel text={t("text.departmentName")} required={false} />}
                                    value={approveEmp1?.departmentName || " "}
                                    placeholder={t("text.departmentName")}
                                    size="small"
                                    fullWidth
                                    // onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                /> */}
                            {/* </Grid> */}

                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    label={<CustomLabel text={t("text.designationName")} required={false} />}
                                    value={approveEmp1?.designationName || '--'}
                                    placeholder={t("text.designationName")}
                                    size="small"
                                    fullWidth
                                    //onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid> */}


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.complain")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="complain"
                                    id="complain"
                                    // type="date"
                                    value={formik.values.complain}
                                    placeholder={t("text.complain")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue:any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.empId")}
                        />
                      }
                    />
                  )}
                />
              </Grid>
                             {/* <Grid item xs={12} sm={4} lg={4}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={empOption}
                                    fullWidth
                                    size="small"
                                    onChange={handleVendorSelect}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                             label={<CustomLabel text={t("text.SelectEmployee")} />
                                    onChange={(event, newValue) => {
                                                console.log(newValue?.value);
                                                formik.setFieldValue("emp_name", newValue?.label);
                                                formik.setFieldValue("empid", newValue?.value?.toString());
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={<CustomLabel text={t("text.emp_name")} />}

                                                />
                                            )}
                                        />
                             </Grid>  */}

                          




                           


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
                                        label={<CustomLabel text={t("text.AttachedImage")} />}
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
                                    {formik.values.complaintItem[0].file == "" ? (
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
                                            src={`data:image/jpg;base64,${formik.values.complaintItem[0].file}`}
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
                            <Modal open={Opens} onClose={handlePanClose1}>
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
                                            src={`data:image/jpg;base64,${formik.values.complaintItem[0].file}}`}
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
                        
                        <Grid item lg={12} md={12} xs={12}>
                            <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                                <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>

                                    <tr>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Service</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Status</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Vendor</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Amount</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Net Amount</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Reading</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Challan No</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Remark</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Action</th>
                                        <IconButton onClick={addServiceRow} style={{ color: '#f5f5f5' }}>
                                            <AddIcon />
                                        </IconButton>

                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceTable.map((row: any, index: any) => (
                                        <tr key={row.id} style={{ border: '1px solid black' }}>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <select
                                                    value={selectedItem1}
                                                    onChange={(e) => setSelectedItem1(e.target.value)}
                                                    style={{ width: '95%', height: '35px' }}
                                                >
                                                    <option value="">Select item</option>
                                                    {itemOption.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <Select
                                                    value={row.status}
                                                    onChange={(e) => handleServiceInputChange(index, 'status', e.target.value)}
                                                    size="small"
                                                >
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                    <MenuItem value="Uncompleted">Uncompleted</MenuItem>
                                                </Select>
                                            </td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <select
                                                    value={selectedVendor}
                                                    onChange={(e) => setSelectedVendor(e.target.value)}
                                                    style={{ width: '95%', height: '35px' }}
                                                >
                                                    {vendorData.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <TextField
                                                    type="number"
                                                    value={row.amount}
                                                    size="small"
                                                    onChange={(e) => handleServiceInputChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <TextField
                                                    type="number"
                                                    value={row.netAmount}
                                                    size="small"
                                                    onChange={(e) => handleServiceInputChange(index, 'netAmount', parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <TextField
                                                    value={row.reading}
                                                    size="small"
                                                    onChange={(e) => handleServiceInputChange(index, 'reading', e.target.value)}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <TextField
                                                    value={row.challanNo}
                                                    size="small"
                                                    onChange={(e) => handleServiceInputChange(index, 'challanNo', e.target.value)}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <TextField
                                                    value={row.remark}
                                                    size="small"
                                                    onChange={(e) => handleServiceInputChange(index, 'remark', e.target.value)}
                                                />
                                            </td>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <div>
                                <Table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid black" }}>
                                    <thead style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}>
                                        <tr>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Item</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Unit</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Quantity</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Rate</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Indent No</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Pre Reading</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>GST Rate</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Total Tax</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>Total Item</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}> Action </th>
                                            <IconButton onClick={addRow} style={{ color: '#f5f5f5' }}>
                                                <AddIcon />
                                            </IconButton>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row: any, index: number) => (
                                            <tr key={row.id} style={{ border: "1px solid black" }}>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                    <select
                                                        value={row.item || ''}
                                                        onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                                                        style={{ width: '95%', height: '35px' }}
                                                    >
                                                        <option value="">Select item</option>
                                                        {itemOption.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                    <select
                                                        value={row.unit}
                                                        onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                                                        style={{ width: '95%', height: '35px' }}
                                                    >
                                                        <option value="">Select unit</option>
                                                        {unitOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                    <TextField
                                                        type="number"
                                                        value={row.quantity}
                                                        size="small"
                                                        onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <TextField
                                                        size="small"
                                                        value={row.rate}
                                                        onChange={(e) => handleInputChange(index, "rate", parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <TextField value={row.indentNo} size="small" onChange={(e) => handleInputChange(index, "indentNo", e.target.value)} />
                                                </td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <TextField value={row.preReading} size="small" onChange={(e) => handleInputChange(index, "preReading", e.target.value)} />
                                                </td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <select
                                                        value={row.gstId || ""}
                                                        onChange={(e) => handleInputChange(index, "gstId", parseInt(e.target.value, 10))}
                                                        style={{ width: "95%", height: "35px" }}
                                                    >
                                                        <option value="">Select GST</option>
                                                        {taxData.map((option: any) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}%
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>{row.cgst + row.sgst + row.igst}</td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>{row.totalItem}</td>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Grid>

                        <Grid container item spacing={2} xs={12} md={12} lg={12}>
                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="TotalServiceAmount"
                                    name="TotalServiceAmount"  // Accessing totalItemAmount from the first item in the itemDetail array
                                    label={
                                        <CustomLabel
                                            text={t("text.TotalServiceAmount")}
                                            required={false}
                                        />
                                    }
                                    value={formik.values.totalServiceAmount}  // Access totalItemAmount from the first item
                                    placeholder={t("text.TotalServiceAmount")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onBlur={formik.handleBlur}
                                    inputProps={{
                                        readOnly: true,
                                        onClick: (e) => {
                                            e.currentTarget.focus();
                                            formik.setFieldError(
                                                "TotalServiceAmount",  // Setting error path correctly
                                                t("text.TotalServiceAmount")
                                            );
                                        },
                                        onFocus: (e) => {
                                            formik.setFieldError(
                                                "TotalServiceAmount",  // Setting error path correctly
                                                t("text.TotalAmountReadOnly")
                                            );
                                        },
                                    }}
                                    error={
                                        formik.touched.totalServiceAmount &&
                                        Boolean(formik.errors.totalServiceAmount)
                                    }
                                    helperText={
                                        formik.touched.totalServiceAmount &&
                                        formik.errors.totalServiceAmount
                                    }
                                    FormHelperTextProps={{ style: { color: "red" } }}
                                />
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="TotalItemAmount"
                                    name="TotalItemAmount"
                                    label="Total Item Amount"
                                    value={formik.values.totalItemAmount}
                                    placeholder="Total Item Amount"
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: 'white' }}
                                    onBlur={formik.handleBlur}
                                    inputProps={{
                                        readOnly: true,
                                        onClick: (e) => {
                                            e.currentTarget.focus();
                                            formik.setFieldError('TotalItemAmount', 'This field is read-only');
                                        },
                                        onFocus: (e) => {
                                            formik.setFieldError('totalItemAmount', 'This field is read-only');
                                        }
                                    }}
                                    error={formik.touched.totalItemAmount && Boolean(formik.errors.totalItemAmount)}
                                    helperText={formik.touched.totalItemAmount && formik.errors.totalItemAmount}
                                    FormHelperTextProps={{ style: { color: 'red' } }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                    <TextField
                                        id="totalTax"
                                        name="totalTax"
                                        label={
                                            <CustomLabel
                                                text={t("text.totalTax")}
                                                required={false}
                                            />
                                        }
                                        // value={(
                                        //     (parseFloat(formik.values.totalCGST?.toString()) || 0) +
                                        //     (parseFloat(formik.values.totalSGST?.toString()) || 0) +
                                        //     (parseFloat(formik.values.totalIGST?.toString()) || 0)
                                        // ).toFixed(2)} // Ensures the value is formatted to two decimal places

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

                                        FormHelperTextProps={{ style: { color: "red" } }}
                                    />
                                </Grid>

                            {/* <Grid item lg={4} xs={12}>
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
                                </Grid> */}
                        </Grid>






                        {/* <Grid item xs={12} md={12} lg={12}>
                  <TextareaAutosize
                    placeholder="Remark"
                    minRows={1}
                    onChange={(e:any)=> formik.setFieldValue("remark", e.target.value)}
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
   */}
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
        </div>
    );
};

export default CreateJobCard;
