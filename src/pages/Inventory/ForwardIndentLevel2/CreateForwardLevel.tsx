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
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    TableCell,
    TableRow,
    TableBody,
    TableContainer,
    TableHead,
    Paper,
    AutocompleteRenderInputParams,
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
import dayjs from "dayjs";

type Props = {};

const unitOptions = [
    { value: 'grams', label: 'Grams' },
    { value: 'kilograms', label: 'Kilograms' },
    { value: 'liters', label: 'Liters' },
    { value: 'pieces', label: 'Pieces' },
];

const CreateForwardLevel = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [lang, setLang] = useState<Language>("en");
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [isIndentSelected, setIsIndentSelected] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [items, setItems] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    console.log("🚀 ~ CreateIndentForm ~ tableData:", tableData)
    const [indentOptions, setIndentOptions] = useState([
        { value: "-1", label: t("text.SelectindentNo"), emp_name: '', indentDate: '', storeId: '' },
    ]);
    const [itemOption, setitemOption] = useState([
        { value: -1, label: t("text.itemMasterId") },
    ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);
    useEffect(() => {
        GetIndentID();
        GetitemData();
        GetUnitData();
    }, []);

    const GetIndentID = async () => {
        const collectData = {
            indentID: -1,
        };
        const response = await api.post(`indentParent/GetindentParent`, collectData);
        const data = response.data.data;
        console.log("indent option", data)
        const arr = [];

        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["indentNo"] + ' - ' + data[index]['emp_name'],
                value: data[index]["indentID"],
                emp_name: data[index]['emp_name'],
                indentDate: data[index]['indentDate'],
                storeId: data[index]['storeId'],
                reqBefDate: data[index]['reqBefDate']
            });
        };
        setIndentOptions(arr);
    };

    const GetIndentIDById = async (indentId:any) => {
        const collectData = {
            indentID: indentId,
        };
        const response = await api.post(`indentParent/GetindentParent`, collectData);
        const data = response.data.data;
        console.log("indent option", data[0]['indentinv'])
        let arr:any = [];
        if(data[0]['indentinv'] != null){
        for(let i=0; i<data[0]['indentinv'].length; i++){
            arr.push({id:i+1,
            itemID:data[0]['indentinv'][i]['itemID'],
            itemName:data[0]['indentinv'][i]['itemName'],
            unit:data[0]['indentinv'][i]['unit'],
            qty:data[0]['indentinv'][i]['qty'],
            rate:data[0]['indentinv'][i]['rate'],
            amount:data[0]['indentinv'][i]['amount']})
        };
        setTableData(arr);
        setIsIndentSelected(true);
    }
    };

    console.log("check table", tableData)

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
        setitemOption(arr);
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


    const handleActionChange = (event: any) => {
        setSelectedAction(event.target.value);
    };

    const validateRow = (row: any) => {
        return row.itemName && row.unit && row.qty >= 1 && row.rate > 0;
    };

    const formik = useFormik({
        initialValues: {
            "indentID": -1,
            "indentNo": "",
            "indentDate": "",
            "reqBefDate": "",
            "deptID": 0,
            "emp_name": "",
            "remark": "",
            "instID": 0,
            "sessionID": 0,
            "approve": "",
            "user_id": 0,
            "divisionId": 0,
            "forward_Status": "",
            "forward_By": 0,
            "forward_On": defaultValues,
            "storeId": 0,
            "l3_Status": "",
            "l3_By": 0,
            "l3_On": defaultValues,
            "mode": "",
            "estimateNo": "",
            "workType": "",
            "proposalNo": "",
            "patCodeNo": "",
            "toStoreId": 0,
            "toDivisionId": 0,
            "is_PMN": "",
            "stage": "",
            "indentinv": []
        },

        validationSchema: Yup.object({
            indentNo: Yup.string()
                .required(t("text.reqIndentNum")),
            emp_name: Yup.string()
                .required(t("text.reqEmpName")),
        }),

        
        onSubmit: async (values) => {

            const validTableData = tableData.filter(validateRow);

            if (validTableData.length === 0) {
                toast.error("Please add some data in table for further process");
                return;
            }

            const response = await api.post(
                `indentParent/AddUpdateindentParent`,
                { ...values, indentinv: validTableData }
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                navigate("/Inventory/IndentForm");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });

    

    const handleInputChange = (index: any, field: any, value: any) => {
        const updatedData = [...tableData];
        updatedData[index][field] = value;

        // Recalculate the amount if qty or rate is updated
        if (field === 'qty' || field === 'rate') {
            const qty = updatedData[index].qty || 0;
            const rate = updatedData[index].rate || 0;
            updatedData[index].amount = (qty * rate).toFixed(2) || 0;
        }

        setTableData(updatedData);
    };
    const deleteRow = (index: number) => {
        const updatedData = tableData.filter((_: any, i: number) => i !== index);
        setTableData(updatedData);
    };
    



    const back = useNavigate();



    const addRow = () => {
        setTableData([...tableData, { indentID: -1, itemID: -1, id: tableData.length + 1, itemName: '', unit: '', qty: 0, rate: 0, amount: 0 }]);
    };


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
                                {t("text.CreateIndentForwardLevel")}
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
                                            GetIndentIDById(newValue?.value);
                                            formik.setFieldValue("indentNo", newValue?.value);
                                            formik.setFieldValue("emp_name", newValue?.emp_name);
                                            formik.setFieldValue("indentDate", dayjs(newValue?.indentDate).format('YYYY-MM-DD'));
                                            formik.setFieldValue("reqBefDate", dayjs(newValue?.reqBefDate).format('YYYY-MM-DD'));
                                            formik.setFieldValue("storeId", newValue?.storeId);
                                           // handleAddItem(newValue);


                                        }
                                    }}
                                    // renderInput={function (params: AutocompleteRenderInputParams): React.ReactNode {
                                    //     throw new Error("Function not implemented.");
                                    // } }
                                    value={
                                        indentOptions.find((opt) => (opt.value) === (formik.values.indentNo)) || null
                                    }
                                    renderInput={(params: any) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel text={t("text.SelectIndentNo")} />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.indentNo && formik.errors.indentNo && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentNo}</div>
                                )}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="indentDate"
                                    name="indentDate"
                                    label={<CustomLabel text={t("text.SelectindentDate")} required={false} />}
                                    value={formik.values.indentDate}
                                    placeholder={t("text.SelectindentDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="reqBefDate"
                                    name="reqBefDate"
                                    label={<CustomLabel text={t("text.SelectreqBefDate")} required={false} />}
                                    value={formik.values.reqBefDate}
                                    placeholder={t("text.SelectreqBefDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="emp_name"
                                    name="emp_name"
                                    label={<CustomLabel text={t("text.emp_name")} required={true} />}
                                    value={formik.values.emp_name}
                                    placeholder={t("text.emp_name")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.emp_name && formik.errors.emp_name && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.emp_name}</div>
                                )}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="store"
                                    name="store"
                                    label={
                                        <CustomLabel text={t("text.store")} required={false} />
                                    }
                                    value={formik.values.storeId}
                                    placeholder={t("text.store")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid container item spacing={2} alignItems="center">

                                <Grid item xs={10} md={3} lg={3}>
                                    <Typography variant="h6" style={{ marginRight: '10px' }}>
                                        Action:
                                    </Typography>
                                </Grid>

                                <Grid item xs={10} md={5} lg={5}>
                                    <RadioGroup
                                        row
                                        value={selectedAction}
                                        onChange={handleActionChange}
                                        style={{ justifyContent: 'center', display: 'flex' }}
                                    >
                                        <FormControlLabel
                                            value="Pass"
                                            control={
                                                <Radio
                                                    style={{
                                                        color: selectedAction === 'Pass' ? 'blue' : 'gray',
                                                        width: '20px',
                                                        height: '20px',
                                                    }}
                                                />
                                            }
                                            label={t("text.Pass")}
                                        />
                                        <FormControlLabel
                                            value="Refuse"
                                            control={
                                                <Radio
                                                    style={{
                                                        color: selectedAction === 'Refuse' ? 'blue' : 'gray',
                                                        width: '20px',
                                                        height: '20px',
                                                    }}
                                                />
                                            }
                                            label={t("text.Refuse")}
                                        />
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <FormControlLabel control={<Checkbox />} label="Show Existing" />
                            </Grid>


                            {isIndentSelected && (
                                <Grid item xs={12}>
                                <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                                    <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                                        <tr>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}></th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Item Name</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Unit</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Balance Quantity</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Approved Quantity</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Rate</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Total Amount</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row: any, index: any) => (
                                            <tr key={row.id} style={{ border: '1px solid black' }}>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                    <Checkbox
                                                        checked={row.selected || false}
                                                        onChange={(e) => handleInputChange(index, 'selected', e.target.checked)}
                                                        color="primary"
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>

                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={itemOption}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e, newValue) => handleInputChange(index, 'itemName', newValue?.label)}
                                                        value={
                                                            itemOption.find((opt) => (opt.value) === parseInt(row?.itemName)) || null
                                                        }
                                                        renderInput={(params: any) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <CustomLabel text='Select item' />
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>

                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={unitOptions}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e, newValue) => handleInputChange(index, 'unit', newValue?.label)}
                                                        value={
                                                            unitOptions.find((opt: any) => (opt.value) === parseInt(row?.unit)) || null
                                                        }
                                                        renderInput={(params: any) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <CustomLabel text='Select unit' />
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </td>

                                                <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        // type="text"
                                                        value={row.qty}
                                                        onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={row.qty || 0}
                                                        onChange={(e) => handleInputChange(index, 'approvedQty', e.target.value)}
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        // type="text"
                                                        value={row.rate}
                                                        onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                                                        inputProps={{ readOnly: true }}
                                                    />
                                                </td>

                                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                    <TextField
                                                        // type="number"
                                                        value={row.amount || 0}
                                                        size="small"
                                                        inputProps={{ readOnly: true }}
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => deleteRow(index)}>
                                                    <DeleteIcon />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Grid>
                            )}

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
                                        {t("text.Approve")}
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

                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    id="indentNo"
                                    name="indentNo"
                                    label={
                                        <CustomLabel text={t("text.indentNo")} required={false} />
                                    }
                                    value={formik.values.indentNo}
                                    placeholder={t("text.indentNo")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid> */}
                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    id="indentDate"
                                    name="indentDate"
                                    label={<CustomLabel text={t("text.indentDate")} required={false} />}
                                    value={formik.values.indentDate}
                                    placeholder={t("text.indentDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid> */}
                            {/* <Grid item lg={4} xs={12}>
                                <TextField
                                    id="ToDate"
                                    name="ToDate"
                                    label={<CustomLabel text={t("text.ToDate")} required={false} />}
                                    value={formik.values.indentDate}
                                    placeholder={t("text.ToDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid> */}


                            {/* <Grid item lg={6} sm={6} xs={12}>
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
                                        {t("text.showAll")}
                                    </Button>
                                </Grid>
                            </Grid> */}
                            {/* <Grid item lg={6} sm={6} xs={12}>
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
                            </Grid> */}

                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default CreateForwardLevel;