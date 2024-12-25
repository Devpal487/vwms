import {
    Autocomplete,
    Button,
    CardContent,
    Grid,
    Divider, Table,
    TextField,
    Typography,
    TextareaAutosize,
    Modal,
    Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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

const CreateJobWorkChallanReceive = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [lang, setLang] = useState<Language>("en");
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [storeOption, setstoreOption] = useState([
        { value: -1, label: t("text.id") },
    ]);

    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);
    const [itemOption, setitemOption] = useState<any>([]);
    const [empOption, setempOption] = useState<any>([]);
    const [challanOption, setchallanOption] = useState<any>([]);
    const [Img, setImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [vendorDetail, setVendorDetail] = useState<any>();
    const [totalAmount, setTotalAmount] = useState(0);
    const [items, setItems] = useState<any>([
        {
            id: -1,
            challanNo: -1,
            jobCardId: -1,
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
    const [taxData, setTaxData] = useState([]);

    const handlePanClose1 = () => {
        setOpen(false);
    };

    const modalOpenHandle1 = (event: string) => {
        setOpen(true);
        const base64Prefix = "data:image/jpg;base64,";

        let imageData = '';
        switch (event) {
            case "challanRcvDoc":
                imageData = formik.values.challanRcvDoc;
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
        GetJWChallanData();
    }, []);

    const GetJWChallanData = async () => {
        const response = await api.get( `JobWorkChallan/GetJobWorkChallan`,{headers: { "ChallanNo": -1}});
        const data = response.data.data;
        const arr = data.map((item: any) => ({
            label: item.challanNo,
            value: item.challanNo,
            date: item.challanDate,
            vendor: item.vendorId,
            totalAmount: item.netAmount,
            itemDetails: item
        }));
        setchallanOption([{ value: -1, label: t("text.SelectChallanNo") }, ...arr]);
    };

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
        setUnitOptions(arr);
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
                { value: "-1", label: t("text.SelectTax") },
                ...arr,
            ] as any);
        }
    };


    const formik = useFormik({
        initialValues: {
            "challanRcvNo": 0,
            "challanRcvDate": defaultValues,
            "challanNo": 0,
            "complainId": 0,
            "empId": 0,
            "itemId": 0,
            "jobCardId": 0,
            "vendorId": 0,
            "remark": "",
            "estAmount": '',
            "serviceAmount": 0,
            "itemAmount": 0,
            "netAmount": 0,
            "createdBy": "",
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "releasedBy": "",
            "postedBy": "",
            "releasedOn": defaultValues,
            "postedOn": defaultValues,
            "companyId": 0,
            "fyId": 0,
            "cgst": 0,
            "sgst": 0,
            "gst": 0,
            "cgstid": 0,
            "sgstid": 0,
            "gstid": 0,
            "challanRcvDoc": "",
            "jobWorkChallanRcvDetail": [],
            "jobWorkChallanRcvItemDetail": [],
            "srn": 0,
            "jobWorkChallan": {},
            "vehicleItem": {},
            "taxGST": {},
            "taxCGST": {},
            "taxSGST": {  },
            "allTax": 0,
            "serviceNetAmount": 0,
            "file": "",
            "fileOldName": "",
            "vehicleNo": "",
            "name": "",
            "jobCardNo": "",
            "jobCardDate": defaultValues,
            "challanDate": ""
          },
        onSubmit: async (values: any) => {

            const validItems = items.filter((item: any) => validateItem(item));

            if (validItems.length === 0) {
                alert("Please fill in at least one valid item.");
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

            const response = await api.post(
                `JobWorkChallan/AddUpdateJobWorkChallan`,
                { ...values, jobWorkChallanItemDetail: updatedItems }
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                navigate("/Inventory/JobWorkChallan");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });

    const handleVendorSelect = (event: any, newValue: any) => {
        if (newValue && newValue.value !== "-1") {
            formik.setFieldValue("jobWorkChallanDetail[0].vendorMaster", newValue.details);
            formik.setFieldValue("jobWorkChallanDetail[0].vendorMaster.vendorId", newValue.value);
            setVendorDetail(newValue.details);
        } else {
            formik.setFieldValue("jobWorkChallanDetail[0].vendorMaster", "");
            formik.setFieldValue("jobWorkChallanDetail[0].vendorMaster.vendorId", "");
            setVendorDetail(null);
        }
    };

    const back = useNavigate();



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
            const selectedItem = itemOption.find((option: any) => option.value.toString() === value);
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
            item.rate = value === '' ? '' : (value);
        } else if (["qty", "gstRate"].includes(field)) {
            item[field] = value === '' ? 0 : parseFloat(value);
        } else {
            item[field] = value;
        }

        if (typeof item.qty === 'number' && typeof item.rate === 'number') {
            item.amount = item.qty * item.rate;
        } else {
            item.amount = 0;
        }

        if (typeof item.amount === 'number' && typeof item.gstRate === 'number') {
            item.gst = (item.amount * item.gstRate) / 100;
        } else {
            item.gst = 0;
        }

        item.netAmount = (item.amount || 0) + (item.gst || 0);

        updatedItems[index] = item;
        setItems(updatedItems);

        if (validateItem(item) && index === items.length - 1) {
            handleAddItem();
        }
    };

    const validateItem = (item: any) => {
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
                                {t("text.Createjwchallanreceive")}
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

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="challanNo"
                                    name="challanNo"
                                    label={<CustomLabel text={t("text.challanRcvNo")} required={false} />}
                                    value={formik.values.challanNo}
                                    placeholder={t("text.challanRcvNo")}
                                    size="small"
                                    fullWidth
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="challanDate"
                                    name="challanDate"
                                    label={<CustomLabel text={t("text.challanRcvDate")} required={false} />}
                                    value={formik.values.challanDate}
                                    placeholder={t("text.challanRcvDate")}
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
                                    options={challanOption}
                                    fullWidth
                                    size="small"
                                    // onChange={handleVendorSelect}
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("challanNo", newValue?.value);
                                        formik.setFieldValue("challanDate", newValue?.date);
                                        formik.setFieldValue("vendorId", newValue?.vendor);
                                        formik.setFieldValue("estAmount", newValue?.totalAmount);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectChallanNo")} />}
                                        />
                                    )}
                                />
                            </Grid>

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
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={empOption}
                                    value={empOption.find((option: any) => option.value === formik.values.vendorId)}
                                    fullWidth
                                    size="small"
                                    //onChange={handleVendorSelect}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectVendor")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="estAmount"
                                    name="estAmount"
                                    label={<CustomLabel text={t("text.estAmount")} required={false} />}
                                    value={formik.values.estAmount}
                                    placeholder={t("text.estAmount")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="challanDate"
                                    name="challanDate"
                                    label={<CustomLabel text={t("text.CloseDate")} required={false} />}
                                    value={formik.values.challanDate}
                                    placeholder={t("text.CloseDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
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
                                        onChange={(e) => otherDocChangeHandler(e, "challanRcvDoc")}
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
                                        {formik.values.challanRcvDoc == "" ? (
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
                                                src={`data:image/jpg;base64,${formik.values.challanRcvDoc}`}
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
                                            onClick={() => modalOpenHandle1("challanRcvDoc")}
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
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <select
                                                        value={item.itemId || ''}
                                                        onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                                                        style={{ width: "95%", height: "35px" }}
                                                    >
                                                        <option value="">Select Item</option>
                                                        {itemOption.map((option: any) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <select
                                                        value={item.unit || ''}
                                                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                                        style={{ width: "95%", height: "35px" }}
                                                    >
                                                        <option value="">Select Unit</option>
                                                        {unitOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <TextField
                                                        type="text"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                                        inputProps={{ step: "any", min: "0" }}
                                                        size="small"
                                                    />
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <TextField
                                                        type="text"
                                                        value={item.rate ?? ''}
                                                        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                                        inputProps={{ step: "any", min: "0" }}
                                                        size="small"
                                                    />
                                                </td>
                                                <td>{(item.amount || 0).toFixed(2)}</td>
                                                <td>
                                                    {/* <TextField
                      type="text"
                      value={item.gstRate}
                      onChange={(e) => handleItemChange(index, "gstRate", e.target.value)}
                      inputProps={{ step: "any", min: "0" }}
                      size="small"
                  /> */}
                                                    <select
                                                        value={item.gstRate}
                                                        onChange={(e) => handleItemChange(index, "gstRate", e.target.value)}
                                                        style={{ width: "95%", height: "35px" }}
                                                    >
                                                        {/* <option value="">Select GST Rate</option> */}
                                                        {taxData.map((option: any) => (
                                                            <option key={option.value} value={option.label}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>{(item.gst || 0).toFixed(2)}</td>
                                                <td>{(item.netAmount || 0).toFixed(2)}</td>
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
                                            <td colSpan={7} style={{ textAlign: "right" }}>
                                                <strong style={{ color: "#fff" }}>
                                                    {t("text.totalAmount")}:
                                                </strong>
                                            </td>
                                            <td colSpan={2}>
                                                <strong style={{ color: "#fff" }}>
                                                    {totalAmount.toFixed(2)}
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

export default CreateJobWorkChallanReceive;
