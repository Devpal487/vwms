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
    Modal,
    Box,
    Select,
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
import nopdf from "../../../assets/images/imagepreview.jpg";

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


type Props = {};


const CreateJobWorkChallan = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [lang, setLang] = useState<Language>("en");
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [storeOption, setstoreOption] = useState([
        { value: -1, label: t("text.id") },
    ]);
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [jobCardOptions, setJobCardOptions] = useState<any>([]);
    const [itemOption, setitemOption] = useState<any>([]);
    const [empOption, setempOption] = useState<any>([]);
    const [Img, setImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [vendorDetail, setVendorDetail] = useState<any>();
    const [vendorID, setVendorID] = useState<any>();
    const [totalAmount, setTotalAmount] = useState(0);
    const [items, setItems] = useState<any>([
        {
            id: 0,
            challanNo: 0,
            jobCardId: 0,
            vendorId: 0,
            itemId: 0,
            unit: "",
            qty: '',
            rate: '',
            amount: 0,
            gstId: 0,
            gstRate: 0,
            netAmount: 0,
            "gst": 0,
            "itemMaster": {}
        },
    ]);
    const [jWCDetail, setJWCDetail] = useState<any>([
        {
            "id": 0,
            "challanNo": 0,
            "jobCardId": 0,
            "serviceId": '',
            "serviceCharge": '',
            "vendorId": '',
            "remark": "",
            "srn": 0,
            "isDelete": true,
            "vendorMaster": {},
            "serviceName": ""
        }
    ]);


    const [taxData, setTaxData] = useState([]);

    const handlePanClose1 = () => {
        setOpen(false);
    };

    const modalOpenHandle1 = (event: string) => {
        setOpen(true);
        const base64Prefix = "data:image/jpg;base64,";

        let imageData = '';
        switch (event) {
            case "challanDoc":
                imageData = formik.values.challanDoc;
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

    useEffect(() => {
        getstoreData();
        GetUnitData();
        GetitemData();
        GetVendorData();
        getTaxData();
        getJobCardDate();
    }, []);

    const getJobCardDate = async () => {
        const response = await api.get(`JobCard/GetJobCard`, { headers: { JobCardId: -1 } });
        let result = response?.data?.data
        const arr = result?.map((item: any) => ({
            label: item?.jobCardNo,
            value: item?.jobCardId
        }));
        setJobCardOptions([{ value: "-1", label: t("text.selectJobCard") }, ...arr]);
    }

    const GetitemData = async () => {
        const collectData = {
            itemMasterId: -1,
        };
        const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
        const data = response.data.data;
        const arr = data.map((item: any) => ({
            label: item.itemName,
            value: item.itemMasterId,
            itemDetails: item
        }));
        setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
    };

    const GetVendorData = async () => {
        const collectData = {
            venderId: -1
        };
        const response = await api.post(`VendorMaster/Ge3tVendorMaster`, collectData);
        const data = response.data.data;
        const arr = data.map((vendor: any) => ({
            label: vendor.name,
            value: vendor.venderId,
            details: vendor
        }));
        setempOption([{ value: "-1", label: t("text.SelectVendor") }, ...arr]);
    };

    const getstoreData = async () => {
        const collectData = {
            id: -1,
            unit: -1,
        };
        const response = await api.post(`StoreMaster/GetStoreMaster`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["storeName"],
                value: data[index]["id"],
            });
        }
        setstoreOption(arr);
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
        setUnitOptions([{ value: "-1", label: t("text.selectUnit") }, ...arr] as any) ;
    };

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

            setTaxData([
                { value: "-1", label: t("text.tax") },
                ...arr,
            ] as any);
        }
    };


    const formik = useFormik({
        initialValues: {
            "challanNo": 0,
            "challanDate": "",
            "complainId": 0,
            "empId": 0,
            "itemId": 0,
            "jobCardId": 0,
            "vendorId": 0,
            "createdBy": "",
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "companyId": 0,
            "fyId": 0,
            "serviceAmount": 0,
            "itemAmount": 0,
            "netAmount": 0,
            "status": "",
            "rcvDate": defaultValues,
            "rcvNo": 0,
            "cgst": 0,
            "sgst": 0,
            "gst": 0,
            "cgstid": 0,
            "sgstid": 0,
            "gstid": 0,
            "challanDoc": "",
            "jobWorkChallanDetail": [],
            "jobWorkChallanItemDetail": [],
            "srn": 0,
            "allTax": 0,
            "serviceNetAmount": 0,
            "jobCard": {},
            "file": "",
            "fileOldName": "",
            "vehicleNo": "",
            "jobCardNo": "",
            "complainNo": "",
            "vendor": "",
            "vendorMaster": {}
        },
        onSubmit: async (values: any) => {
            console.log("Formik.values before submitting values", values)

            const validItems = items.filter((item: any) => validateItem(item));
            const jWCDetailValidItems = jWCDetail.filter((item: any) => jWCDetailValidateItem(item));

            if (validItems.length === 0) {
                alert("Please fill in at least one valid item.");
                return;
            }

            if (jWCDetailValidItems.length === 0) {
                // console.log("items jcwDetails", jWCDetailValidItems)
                alert("Please fill in at least one valid item 2.");
                return;
            }

            const updatedItems = validItems.map((item: any, index: any) => {
                const documentDate = values.doc_Date;

                const baseItem = {
                    ...item,
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

            const updatedItemsjWCDetail = jWCDetailValidItems.map((item: any, index: any) => {
                if (!item.serviceId || !item.serviceCharge) {
                    alert("Service ID and Service Charge must be filled.");
                    return;
                }

                const baseItems = {
                    ...item,
                    srn: 0,
                    vendorMaster:vendorDetail,
                    vendorId : vendorID
                };

                if (index === 0) {
                    return baseItems;
                }
                return item;
            }).filter(Boolean); 

            const response = await api.post(
                `JobWorkChallan/AddUpdateJobWorkChallan`,
                { ...values, jobWorkChallanItemDetail: updatedItems, jobWorkChallanDetail: updatedItemsjWCDetail }
            );
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/Inventory/JobWorkChallan");
            } else {
                setToaster(true);
                toast.error(response.data.message);
            }
        },
    });

    const handleVendorSelect = (event: any, newValue: any) => {
        if (newValue && newValue.value !== "-1") {
            setVendorID(newValue?.value)
            setVendorDetail(newValue.details);
        } else {
            setVendorID(null);
            setVendorDetail(null);
        }
    };

    const back = useNavigate();



    const handleAddJWCDetail = () => {
        setJWCDetail([
            ...jWCDetail,
            {
                "jobCardId": '',
                "serviceId": '',
                "serviceCharge": '',
                "vendorId": '',
                "remark": "",
                "serviceName": ""
            },
        ]);
    };

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                vendorId: 0,
                itemId: 0,
                unit: "",
                qty: '',
                rate: '',
                amount: 0,
                gstId: 0,
                gstRate: 0,
                netAmount: 0,
                "gst": 0,
                "itemMaster": {}
            },
        ]);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...items];
        let item = { ...updatedItems[index] };

        if (field === "itemId") {
            const selectedItem = itemOption.find((option: any) => option.value === value);
            if (selectedItem) {
                item = {
                    ...item,
                    itemId: selectedItem.value,
                    itemMaster: selectedItem.itemDetails
                };
                item.unit = selectedItem.itemDetails.unit || "";
                item.rate = selectedItem.itemDetails.rate || 0;
            }
        } else if (field === "rate") {
            item.rate = value === '' ? 0 : parseFloat(value);
        } else if (field === "qty") {
            item.qty = value === '' ? 0 : parseFloat(value);
        } else if (field === "gstRate") {
            item.gstRate = value === '' ? 0 : parseFloat(value);
        } else {
            item[field] = value;
        }
        item.amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
        item.gst = (item.amount * (parseFloat(item.gstRate) || 0)) / 100;
        item.netAmount = item.amount + item.gst;

        updatedItems[index] = item;
        setItems(updatedItems);

        if (validateItem(item) && index === items.length - 1) {
            handleAddItem();
        }
    };

    const handleJWCDetailChange = (index: number, field: string, value: any) => {
        const updatedItems = [...jWCDetail];
        let item = { ...updatedItems[index] };
    
        if (field === "serviceId") {
            const selectedItem = itemOption.find((option: any) => option.value === value);
            if (selectedItem) {
                item.serviceId = selectedItem.value;
                item.serviceName = selectedItem.label;
            }
        } else if (field === "serviceCharge") {
            item.serviceCharge = value;
        }
    
        updatedItems[index] = item;
        setJWCDetail(updatedItems);
        console.log("Updated jWCDetail:", updatedItems);

        // Check if both serviceId and serviceCharge are filled
        if (item.serviceId && item.serviceCharge) {
            // Add a new detail if both fields are filled and it's not the last item
            if (index === updatedItems.length - 1) {
                handleAddJWCDetail();
            }
        }
    };

    // const handleJWCDetailChange = (index: number, field: string, value: any) => {
    //     const updatedItems = [...jWCDetail]; 
    //     let item = { ...updatedItems[index] }; 

    //     if (field === "serviceId") {
    //         const selectedItem = itemOption.find((option: any) => option.value === value);
    //         console.log("serviceId", selectedItem)
    //         if (selectedItem) {
    //             item.serviceId = selectedItem.value; 
    //             item.serviceName = selectedItem.label;
    //         }
    //     } else if (field === "jobCardId") {
    //         item.jobCardId = value; 
    //     } else if (field === "serviceCharge") {
    //         item.serviceCharge = value;
    //     }

    //     updatedItems[index] = item;
    //     setJWCDetail(updatedItems); 

    //     console.log("Updated jWCDetail:", updatedItems);

    //     if (jWCDetailValidateItem(item)) {
    //         if (index === updatedItems.length - 1) {
    //             handleAddJWCDetail();
    //         }
    //     }
    // };

    const validateItem = (item: any) => {
        console.log("item validateItem", item);
        return (
            item.itemId &&
            item.unit &&
            item.qty > 0 &&
            item.rate > 0 &&
            item.amount >= 0 &&
            item.gstRate >= 0 &&
            item.netAmount >= 0
        );
    };

    const jWCDetailValidateItem = (item: any) => {
        console.log("item 2", item);
        return (
            item.serviceId !== "" && 
            item.serviceCharge !== "" && 
            !isNaN(item.serviceCharge) 
        );
    };


    const handleRemoveItem = (index: any) => {
        const updatedItems = items.filter((_: any, i: any) => i !== index);
        setItems(updatedItems);
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
                                {t("text.Createjwchallan")}
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
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={itemOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);
                                        // formik.setFieldValue("vendorId", newValue?.label);
                                        formik.setFieldValue("itemId", newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.selectItem")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    id="challanNo"
                                    name="challanNo"
                                    label={<CustomLabel text={t("text.challanNo")} required={false} />}
                                    value={formik.values.challanNo}
                                    placeholder={t("text.challanNo")}
                                    size="small"
                                    fullWidth
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid> */}

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="challanDate"
                                    name="challanDate"
                                    label={<CustomLabel text={t("text.challanDate")} required={false} />}
                                    value={formik.values.challanDate}
                                    placeholder={t("text.challanDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
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
                                            label={<CustomLabel text={t("text.SelectVendor")} />}
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
                                        label={<CustomLabel text={t("text.AttachedImage")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "challanDoc")}
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
                                        {formik.values.challanDoc == "" ? (
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
                                                src={`data:image/jpg;base64,${formik.values.challanDoc}`}
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
                                            onClick={() => modalOpenHandle1("challanDoc")}
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


                            <Grid item lg={12} md={12} xs={12}>
                                <Table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid black" }}>
                                    <thead style={{ backgroundColor: "#2B4593", color: "#f5f5f5" }}>
                                        <tr>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.ItemName")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Unit")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Quantity")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Rate")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Amount")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.GSTRate")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.TaxAmount")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.NetAmount")}
                                            </th>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Action")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ padding: "2px" }}>
                                        {items.map((item: any, index: any) => (
                                            <tr key={item.id} style={{ border: "1px solid black", padding: "2px" }}>
                                                <td style={{ border: "1px solid black", padding: "2px"  }}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id={`serviceId-${index}`}
                                                        options={itemOption}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue: any) => handleItemChange(index, "itemId", newValue?.value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={<CustomLabel text={t("text.selectItem")} />}
                                                            />
                                                        )}
                                                    />

                                                </td>
                                                <td style={{ border: "1px solid black",  padding: "2px"  }}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id={`serviceId-${index}`}
                                                        options={unitOptions}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue: any) => handleItemChange(index, "unit", newValue?.value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={<CustomLabel text={t("text.selectUnit")} />}
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td style={{  border: "1px solid black",  padding: "2px"    }}>
                                                    <TextField
                                                        type="text"
                                                        onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                                        inputProps={{ step: "any", min: "0" }}
                                                        size="small"
                                                    />
                                                </td>
                                                <td style={{  border: "1px solid black",  paddingTop: "2px", paddingBottom: "2px"    }}>
                                                    <TextField
                                                        type="text"
                                                        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                                        inputProps={{ step: "any", min: "0" }}
                                                        size="small"
                                                    />
                                                </td>
                                                <td style={{ textAlign: "right", border: "1px solid black",  padding: "2px"    }}>{(item.amount || 0).toFixed(2)}</td>
                                                <td style={{ textAlign: "right", border: "1px solid black",  padding: "2px"    }}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id={`serviceId-${index}`}
                                                        options={taxData}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue: any) => handleItemChange(index, "gstRate", newValue?.label)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={<CustomLabel text={t("text.tax")} />}
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td style={{ textAlign: "right", padding: "2px"  }}>{(item.gst || 0).toFixed(2)}</td>
                                                <td style={{ textAlign: "right", padding: "2px"  }}>{(item.netAmount || 0).toFixed(2)}</td>
                                                <td style={{ textAlign: "right", padding: "2px"  }}>
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
                                        <tr style={{ backgroundColor: "#2B4593", padding: "2px"  }}>
                                            <td colSpan={7} style={{ textAlign: "right", padding: "2px"  }}>
                                                <strong style={{ color: "#fff" }}>
                                                    {t("text.totalAmount")}:
                                                </strong>
                                            </td>
                                            <td colSpan={2} style={{ textAlign: "center", padding: "2px"  }}>
                                                <strong style={{ color: "#fff" }}>
                                                    {totalAmount.toFixed(2)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Grid>


                            <Grid item lg={12} md={12} xs={12}>
                                <Table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid black" }}>
                                    <thead style={{ backgroundColor: "#2B4593", color: "#f5f5f5" }}>
                                        <tr>
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.ItemName")}
                                            </th>
                                            {/* <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Unit")}
                                            </th> */}
                                            <th style={{ border: "1px solid black", textAlign: "center", padding: "5px" }}>
                                                {t("text.Amount")}
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody style={{ padding: "2px" }}>
                                        {jWCDetail.map((item: any, index: any) => (
                                            <tr key={item.id} style={{ border: "1px solid black", padding: "2px" }}>
                                                <td style={{ border: "1px solid black", textAlign: "center", padding: "3px" }}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id={`serviceId-${index}`}
                                                        options={itemOption}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue: any) => handleJWCDetailChange(index, "serviceId", newValue?.value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={<CustomLabel text={t("text.selectItem")} />}
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                {/* <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id={`jobCardId-${index}`}
                                                        options={jobCardOptions}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e: any, newValue: any) => handleJWCDetailChange(index, "jobCardId", newValue?.value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={<CustomLabel text={t("text.selectJobCard")} />}
                                                            />
                                                        )}
                                                    />
                                                </td> */}
                                                <td style={{ textAlign: "left", padding: "3px" }}>
                                                    <TextField
                                                        type="text"
                                                        onChange={(e) => handleJWCDetailChange(index, "serviceCharge", e.target.value)}
                                                        inputProps={{ step: "any", min: "0" }}
                                                        size="small"
                                                        style={{ width: "100%" }}
                                                    />
                                                </td>

                                            </tr>
                                        ))}
                                        <tr style={{ backgroundColor: "#2B4593"}}>
                                            <td style={{ padding: "3px" }}>
                                                <strong style={{ color: "#fff", textAlign: "right" }}>
                                                    {t("text.totalAmount")}:
                                                </strong>
                                            </td>
                                            <td style={{ padding: "3px" }}>
                                            <strong style={{ color: "#fff" }}>
                                                    {jWCDetail.reduce((total: number, item: any) => total + (parseFloat(item.serviceCharge) || 0), 0).toFixed(2)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Grid>


                            <Grid item xs={12} md={12} lg={12}>
                                <TextareaAutosize placeholder="Remark" minRows={1}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        resize: 'none',
                                    }} />
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

export default CreateJobWorkChallan;
