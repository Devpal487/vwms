


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


const CreateJobcardItemIssue = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [itemValue, setItemValue] = useState();
    const [lang, setLang] = useState<Language>("en");
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [isIndentSelected, setIsIndentSelected] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [items, setItems] = useState<any>([]);
    //const [tableData, setTableData] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([{


        "id": 0,
        "issueId": 0,
        "itemID": 0,
        "batchNo": "",
        "indentId": 0,
        "unitId": 0,
        "reqQty": 0,
        "issueQty": 0,
        "stockQty": 0,
        "itemName": "",
        "indentNo": "",
        "srn": 0,
        "unitName": "",
        //unit:"",
        "returnItem": true,




    }]);
    console.log("🚀 ~ CreateStaffItemreturn ~ tableData:", tableData)
    const [indentOptions, setIndentOptions] = useState([
        { value: "-1", label: t("text.SelectindentNo") },
    ]);
    const [itemOption, setitemOption] = useState([
        { value: -1, label: t("text.itemMasterId") },
    ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);
    const [vehicleOption, setVehicleOption] = useState([
        { value: -1, label: t("text.VehicleNo") },
    ]);

    // const [empOption, setempOption] = useState([
    //     { value: "-1", label: t("text.empid") },
    // ]);
    useEffect(() => {
        GetIndentID();
        GetitemData();
        GetUnitData();
      //  GetempData();
        getVehicleDetails();
    }, []);

    const getVehicleDetails = async () => {
        const response = await api.get(
            `Master/GetVehicleDetail?ItemMasterId=-1`,
        );
        const data = response.data.data;
        const arr = data.map((Item: any, index: any) => ({
            value: Item.itemMasterId,
            label: Item.vehicleNo
        }));
        setVehicleOption(arr);
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



    const GetIndentIDById = async (itemID: any) => {
        const collectData = {
            indentId: itemID,

            //indentId: -1,
            indentNo: "",
            empId: -1,
        };
        const response = await api.post(`Master/GetIndent`, collectData);
        const data = response.data.data[0]['indentDetail'];

        console.log("indent option", data)
        // let arr: any = [];

        const indent = data.map((item: any, index: any) => ({

            id: index + 1,
            "issueId": 0,


            batchNo: item?.batchNo,
            itemID: item?.itemId,
            unitId: item?.unitId,
            issueQty: item?.approveQuantity,
            reqQty: item?.quantity,

            unitName: "",
            //unit:"",
            itemName: "",
            indentNo: "",
            "srn": 0,
            // "unitName": "",
            "returnItem": true


        }))

        setTableData(indent);
        setIsIndentSelected(true);

    };

    console.log("check table", tableData)

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
        // return row.itemName && row.unitId && row.reqQty >= 1;
    };

    const formik = useFormik({
        initialValues: {
            "sno": 0,
            "issueId": 0,
            "issueDate": defaultValues,
            "indentId": 0,
            "issueLocation": "",
            "issueType": "",
            "vehicleitem": 0,
            "empId": -1,
            "createdBy": "",
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "indentNno": "",
            "empName": "",
            "vehicleNo": "",
            // "issueId": 0,
            // "issueDate": defaultValues,
            // "indentId": 0,
            // "issueLocation": "",
            // "issueType": "",
            // "vehicleitem": 0,
            // "empId": null,
            // "createdBy": "",
            // "updatedBy": "",
            // "createdOn": defaultValues,
            // "updatedOn": defaultValues,
            // "indentNo": "",
            // "empName": "",
            // "srn": 0,
            // "jobId": 0,
            // "jobCardNo": "",
            itemIssueDetail: [],


        },

        validationSchema: Yup.object({
            //  indentno: Yup.string()
            //  .required(t("text.reqIndentNum")),
            // empId: Yup.string()
            //     .required(t("text.reqEmpName")),
        }),
        onSubmit: async (values) => {

            const validTableData = tableData;
            values.itemIssueDetail = tableData
            if (validTableData.length === 0) {
                toast.error("Please add some data in table for further process");
                return;
            }
            const response = await api.post(
                `ItemIssue/UpsertItemIssue`,
                values
            );

            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/Inventory/JobcardItemIssue");
            } else {
                setToaster(true);
                toast.error(response.data.message);
            }

        },
    });
    const handleInputChange = (index: any, field: any, value: any) => {
        const updatedData = [...tableData];
        updatedData[index][field] = value;
        setTableData(updatedData);
    };
    const deleteRow = (index: number) => {
        const updatedData = tableData.filter((_: any, i: number) => i !== index);
        setTableData(updatedData);
    };
    const back = useNavigate();
    const addRow = () => {
        setTableData([...tableData, {
            "id": 0,
            "issueId": -1,
            "itemID": 0,
            "unitId": 0,
            "batchNo": "",
            "indentId": 0,
            "reqQty": 0,
            "issueQty": 0,
            "itemName": "",
            "unitName": "",
            "returnItem": true,
            "indentNo": "",
            "stockQty": 0,
        }]);
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
                                {t("text.CreateJobcardItemIssue")}
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
                                {formik.touched.indentNno && formik.errors.indentNno && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentNno}</div>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={vehicleOption}
                                    value={itemValue}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("vehicleitem", newValue?.value);
                                        setItemValue(newValue?.label)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.VehicleNo")} required={true} />}
                                            name="vehicleitem"
                                            id="vehicleitem"
                                            placeholder={t("text.VehicleNo")}
                                        />
                                    )}
                                />

                            </Grid>



                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="issueDate"
                                    name="issueDate"
                                    label={<CustomLabel text={t("text.issueDate")} required={false} />}
                                    value={formik.values.issueDate}
                                    placeholder={t("text.issueDate")} size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>




                            {isIndentSelected && (
                                <Grid item xs={12}>
                                    <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
                                        <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                                            <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                                                <tr>
                                                    <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                                                    {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}></th> */}
                                                    <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Item Name</th>
                                                    <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Unit</th>
                                                    <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Batchno</th>
                                                    <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>stockQty</th>
                                                    <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>reqQty</th>
                                                    <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>issueQty</th>

                                                    {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Total Amount</th> */}

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((row: any, index: any) => (
                                                    <tr key={row.id} style={{ border: '1px solid black' }}>

                                                        <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => {
                                                            if (tableData.length > 1) {
                                                                deleteRow(index)
                                                            } else {
                                                                alert("There should be atleast one row")
                                                            }
                                                        }}>
                                                            <DeleteIcon />
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
                                                                value={
                                                                    itemOption.find((opt) => (opt.value) === parseInt(row?.itemID)) || null
                                                                }
                                                                fullWidth
                                                                size="small"
                                                                sx={{ width: "175px" }}
                                                                // onChange={(e: any, newValue: any) =>
                                                                //     handleInputChange(
                                                                //         index,
                                                                //         "itemID",
                                                                //         newValue?.value
                                                                //     )
                                                                // }

                                                                onChange={(e: any, newValue: any) => {
                                                                    if (!newValue) {
                                                                        return;
                                                                    } else {
                                                                        handleInputChange(
                                                                            index,
                                                                            "itemId",
                                                                            newValue?.value
                                                                        )
                                                                    }
                                                                }
                                                                }

                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}

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
                                                                sx={{ width: "135px" }}
                                                                value={unitOptions.find((opt: any) => opt.value === row.unitId) || null}
                                                                onChange={(e: any, newValue: any) => {
                                                                    if (!newValue) {
                                                                        return
                                                                    } else {
                                                                        handleInputChange(
                                                                            index,
                                                                            "unitId",
                                                                            newValue?.value
                                                                        )
                                                                    }
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                    // label={
                                                                    //     <CustomLabel
                                                                    //         text={t("text.selectItem")}
                                                                    //         required={false}
                                                                    //     />
                                                                    // }
                                                                    />
                                                                )}
                                                            />
                                                            {/* <select
                                                                                                                                                                                                                       </select> */}
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                            <TextField
                                                               // type="number"
                                                                size="small"
                                                                // type="text"
                                                                value={row.batchNo}
                                                                onChange={(e) => handleInputChange(index, 'batchNo', e.target.value)}
                                                                onFocus={(e) => {e.target.select()}}
                                                          />
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                            <TextField
                                                               // type="number"
                                                                size="small"
                                                                value={row.stockQty || 0}
                                                                onChange={(e) => handleInputChange(index, 'stockQty', parseInt(e.target.value))}
                                                                onFocus={(e) => {e.target.select()}}
                                                           />
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                            <TextField
                                                                //type="number"
                                                                size="small"
                                                                // type="text"
                                                                value={row.reqQty}
                                                                onChange={(e) => handleInputChange(index, 'reqQty', e.target.value)}
                                                                onFocus={(e) => {e.target.select()}}
                                                            />
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                            <TextField
                                                               // type="number"
                                                                size="small"
                                                                // type="text"
                                                                value={row.issueQty}
                                                                onChange={(e) => handleInputChange(index, 'issueQty', e.target.value)}
                                                                onFocus={(e) => {e.target.select()}}
                                                            />
                                                        </td>
                                                        {/* <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => deleteRow(index)}>
                                                            <DeleteIcon />
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </Table>
                                    </div> </Grid>
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

export default CreateJobcardItemIssue;







// import {
//     Autocomplete,
//     Button,
//     Card,
//     CardContent,
//     Grid,
//     Divider, Table,
//     MenuItem,
//     TextField,
//     Typography,
//     TextareaAutosize,
//     FormControlLabel,
//     Checkbox,
//     RadioGroup,
//     Radio,
//     TableCell,
//     TableRow,
//     TableBody,
//     TableContainer,
//     TableHead,
//     Paper,
//     AutocompleteRenderInputParams,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import axios from "axios";
// import { Navigate, useNavigate, useLocation } from "react-router-dom";
// import HOST_URL from "../../../utils/Url";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import CustomLabel from "../../../CustomLable";
// import api from "../../../utils/Url";
// import { Language } from "react-transliterate";
// import Languages from "../../../Languages";
// import DeleteIcon from '@mui/icons-material/Delete';
// import { getISTDate } from "../../../utils/Constant";
// import dayjs from "dayjs";

// type Props = {};


// const CreateJobcardItemIssue = (props: Props) => {
//     let navigate = useNavigate();
//     const { t } = useTranslation();
//     const [lang, setLang] = useState<Language>("en");
//     const { defaultValues } = getISTDate();
//     const [toaster, setToaster] = useState(false);
//     const [isIndentSelected, setIsIndentSelected] = useState(false);
//     const [selectedAction, setSelectedAction] = useState(null);
//     const [items, setItems] = useState<any>([]);
//     //const [tableData, setTableData] = useState<any>([]);
//     const [tableData, setTableData] = useState<any>([{


//         "id": 0,
//         "issueId": 0,
//         "itemID": 0,
//         "batchNo": "",
//         "indentId": 0,
//         "unitId": 0,
//         "reqQty": 0,
//         "issueQty": 0,
//         "stockQty": 0,
//         "itemName": "",
//         "indentNo": "",
//         "srn": 0,
//         "unitName": "",
//         "returnItem": true
//     }]);
//     console.log("🚀 ~ CreateJobcardItemIssue ~ tableData:", tableData)
//     const [indentOptions, setIndentOptions] = useState([
//         { value: "-1", label: t("text.SelectindentNo") },
//     ]);
//     const [itemOption, setitemOption] = useState([
//         { value: -1, label: t("text.itemMasterId") },
//     ]);
//     const [unitOptions, setUnitOptions] = useState([
//         { value: "-1", label: t("text.SelectUnitId") },
//     ]);

//     const [empOption, setempOption] = useState([
//         { value: "-1", label: t("text.empid") },
//     ]);
//     useEffect(() => {
//         GetIndentID();
//         GetitemData();
//         GetUnitData();
//        // GetempData();
//     }, []);

//     const GetIndentID = async () => {
//         const collectData = {
//             indentId: -1,
//             indentNo: "",
//             empId: -1,
//         };


//         const response = await api.post(`Master/GetIndent`, collectData);
//         const data = response.data.data;
//         console.log("indent option", data)
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["indentNo"],
//                 value: data[index]["indentId"],

//             });
//         };
//         setIndentOptions(arr);
//     };
//     // const GetIndentID = async () => {
//     //     const collectData = {
//     //         indentId: -1,
//     //         indentNo: "",
//     //         empId: -1,
//     //         "show": true,
//     //         "exportOption": "",
//     //         "fromDate": "1999-01-08T13:58:15.615Z",
//     //         "toDate": new Date().toISOString()
//     //     };


//     //     const response = await api.post(`IndentMaster/GetStaffIndent`, collectData);
//     //     const data = response.data.data;
//     //     console.log("indent option", data)
//     //     const arr = [];
//     //     for (let index = 0; index < data.length; index++) {
//     //         arr.push({
//     //             label: data[index]["indentNo"],
//     //             value: data[index]["indentId"],
//     //             empId: data[index]["empId"],
//     //             empName: data[index]["empName"],


//     //         });
//     //     };
//     //     setIndentOptions(arr);
//     // };


//     const GetIndentIDById = async (itemID: any) => {
//         const collectData = {
//             indentId: itemID,

//             //indentId: -1,
//             indentNo: "",
//             empId: -1,
//         };
//         const response = await api.post(`Master/GetIndent`, collectData);
//         const data = response.data.data[0]['indentDetail'];

//         console.log("indent option", data)
//         // let arr: any = [];

//         const indent = data.map((item: any, index: any) => ({

//             id:index + 1,
//             issueId: -1,


//             batchNo: item?.batchNo,
//             itemID: item?.itemId,
//             unitId: item?.unitId,
//             issueQty: item?.issueQty || 0,

//             reqQty: item?.approveQuantity,

//             unitName: "",
//             itemName: "",
//             indentNo: "",
//             srn: item?.approveQuantity,
//             stockQty:0,
//             //"unitName": "",
//             "returnItem": true


//         }))

//         setTableData(indent);
//         setIsIndentSelected(true);

//     };

//     console.log("check table", tableData)

 
//     const GetitemData = async () => {
//         const collectData = {
//             itemMasterId: -1,
//         };
//         const response = await api.get(`ItemMaster/GetItemMaster`, {});
//         const data = response.data.data;
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["itemName"],
//                 value: data[index]["itemMasterId"],
//             });
//         };
//         setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
//     };
//     const GetUnitData = async () => {
//         const collectData = {
//             unitId: -1,
//         };
//         const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
//         const data = response.data.data;
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["unitName"],
//                 value: data[index]["unitId"],
//             });
//         }
//         setUnitOptions(arr);
//     };

//     // const GetempData = async () => {
//     //     const collectData = {
//     //         empid: -1,
//     //         userId: "",
//     //         empName: "",
//     //         empMobileNo: "",
//     //         empDesignationId: -1,
//     //         empDeptId: -1,
//     //         empStateId: -1,
//     //         empCountryID: -1,
//     //         empCityId: -1,
//     //         empPincode: 0,
//     //         roleId: ""
//     //     };
//     //     const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
//     //     const data = response.data.data;
//     //     console.log('data', data)
//     //     const arr = data.map((item: any) => ({
//     //         label: item?.empName,
//     //         value: item?.empid

//     //     }))
//     //     // for (let index = 0; index < data.length; index++) {
//     //     //   arr.push({
//     //     //     label: data[index]["empName"],
//     //     //     value: data[index]["empId"],
//     //     //   });
//     //     // }
//     //     setempOption(arr);
//     // };



//     const handleActionChange = (event: any) => {
//         setSelectedAction(event.target.value);
//     };

//     const validateRow = (row: any) => {
//         // return row.itemName && row.unitId && row.reqQty >= 1;
//     };

//     const formik = useFormik({
//         initialValues: {


//             "issueId":0,
//             "issueDate": defaultValues,
//             "indentId": 0,
//             "issueLocation": "",
//             "issueType": "",
//             "vehicleitem": 0,
//             "empId": null,
//             "createdBy": "",
//             "updatedBy": "",
//             "createdOn": defaultValues,
//             "updatedOn": defaultValues,
//             "indentNo": "",
//             "empName": "",
//             "srn": 0,
//             "jobId": 0,
//             "jobCardNo": "",
//             itemIssueDetail: []


//         },

//         validationSchema: Yup.object({
//             indentNo: Yup.string()
//                 .required(t("text.reqIndentNum")),
//             empId: Yup.string()
//                 .required(t("text.reqEmpName")),
//         }),

//         onSubmit: async (values) => {

//             const validTableData = tableData;
//             values.itemIssueDetail = tableData

//             // if (validTableData.length === 0) {
//             //     toast.error("Please add some data in table for further process");
//             //     return;
//             // }


//             const response = await api.post(
//                 `StaffItemIssue/UpsertItemIssue`,
//                 values
//             );

//             if (response.data.status === 1) {
//                 setToaster(false);
//                 toast.success(response.data.message);
//                 navigate("/staffindent/StaffItemIssue");
//             } else {
//                 setToaster(true);
//                 toast.error(response.data.message);
//             }

//         },
//     });



//     const handleInputChange = (index: any, field: any, value: any) => {
//         const updatedData = [...tableData];
//         updatedData[index][field] = value;

//         if (field === 'reqQty' || field === 'issueQty') {
//             updatedData[index].stockQty = updatedData[index].reqQty - updatedData[index].issueQty;

//             // console.log("stockQty",updatedData[index].stockQty, updatedData[index].reqQty,updatedData[index].issueQty)

//         } else if (field === 'reqQty') {
//             updatedData[index].reqQty = parseInt(value)

//         } else if (field === 'issueQty') {
//             updatedData[index].issueQty = parseInt(value)
//         }




//         setTableData(updatedData);
//     };


//     const deleteRow = (index: number) => {
//         const updatedData = tableData.filter((_: any, i: number) => i !== index);
//         setTableData(updatedData);
//     };




//     const back = useNavigate();



//     const addRow = () => {
//         setTableData([...tableData, {
//             "id": 0,
//             "issueId": -1,
//             "itemID": 0,
//             "batchNo": "",
//             "indentId": 0,
//             "unitId": 0,
//             "reqQty": 0,
//             "issueQty": 0,
//             "stockQty": 0,
//             "itemName": "",
//             "indentNo": "",
//             "srn": 0,
//             "unitName": "",
//             "returnItem": true
//         }]);
//     };


//     return (
//         <div>
//             <div
//                 style={{
//                     padding: "-5px 5px",
//                     backgroundColor: "#ffffff",
//                     borderRadius: "5px",
//                     border: ".5px solid #FF7722",
//                     marginTop: "3vh",
//                 }}
//             >
//                 <CardContent>

//                     <Grid item xs={12} container spacing={2} >
//                         <Grid item lg={2} md={2} xs={2} marginTop={2}>
//                             <Button
//                                 type="submit"
//                                 onClick={() => back(-1)}
//                                 variant="contained"
//                                 style={{
//                                     backgroundColor: "blue",
//                                     width: 20,
//                                 }}
//                             >
//                                 <ArrowBackSharpIcon />
//                             </Button>
//                         </Grid>
//                         <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
//                             <Typography
//                                 gutterBottom
//                                 variant="h5"
//                                 component="div"
//                                 sx={{ padding: "20px" }}
//                                 align="center"
//                             >
//                                 {t("text.CreateJobcardItemIssue")}
//                             </Typography>
//                         </Grid>

//                         <Grid item lg={3} md={3} xs={3} marginTop={3}>
//                             <select
//                                 className="language-dropdown"
//                                 value={lang}
//                                 onChange={(e) => setLang(e.target.value as Language)}
//                             >
//                                 {Languages.map((l: any) => (
//                                     <option key={l.value} value={l.value}>
//                                         {l.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </Grid>
//                     </Grid>
//                     <Divider />
//                     <br />
//                     <form onSubmit={formik.handleSubmit}>
//                         {toaster === false ? "" : <ToastApp />}
//                         <Grid item xs={12} container spacing={2}>



//                             <Grid item xs={12} sm={4} lg={4}>
//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={indentOptions}
//                                     fullWidth
//                                     size="small"
//                                     onChange={(event: any, newValue: any) => {
//                                         console.log("check value", newValue);
//                                         if (newValue) {
//                                             GetIndentIDById(newValue?.value);
//                                             formik.setFieldValue("indentId", newValue?.value);
//                                             formik.setFieldValue("indentNo", newValue?.label?.toString() || "");
//                                             formik.setFieldValue("empId", newValue?.empId);
//                                             formik.setFieldValue("empName", newValue?.empName?.toString() || "");
//                                         }
//                                     }}

//                                     // value={
//                                     //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
//                                     // }
//                                     renderInput={(params: any) => (
//                                         <TextField
//                                             {...params}
//                                             label={
//                                                 <CustomLabel text={t("text.enterIndentNo")} required={true} />
//                                             }
//                                         />
//                                     )}
//                                 />
//                                 {formik.touched.indentNo && formik.errors.indentNo && (
//                                     <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentNo}</div>
//                                 )}
//                             </Grid>


//                             <Grid item xs={12} sm={4} lg={4}>
//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={empOption}
//                                     value={empOption.find((opt: any) => opt.value === formik.values.empId) || null}
//                                     fullWidth
//                                     size="small"
//                                     onChange={(event, newValue) => {
//                                         console.log(newValue?.value);
//                                         formik.setFieldValue("empId", newValue?.value);
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label={<CustomLabel text={t("text.selectemp_name")} required={true} />}
//                                         />
//                                     )}
//                                 />
//                                 {formik.touched.empId && formik.errors.empId && (
//                                     <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
//                                 )}
//                             </Grid>


//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="issueDate"
//                                     name="issueDate"
//                                     label={<CustomLabel text={t("text.issueDate")} required={false} />}
//                                     value={formik.values.issueDate}
//                                     placeholder={t("text.issueDate")} size="small"
//                                     fullWidth
//                                     type="date"
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>



//                             {isIndentSelected && (
//                                 <Grid item xs={12}>
//                                     <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
//                                         <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
//                                             <tr>
//                                                 {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}></th> */}
//                                                 <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Item Name</th>
//                                                 <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Unit</th>
//                                                 {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Batchno</th> */}
//                                                 <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>stockQty</th>
//                                                 <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>reqQty</th>
//                                                 <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>issueQty</th>

//                                                 {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Total Amount</th> */}
//                                                 <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {tableData.map((row: any, index: any) => (
//                                                 <tr key={row.id} style={{ border: '1px solid black' }}>


//                                                     <td
//                                                         style={{
//                                                             border: "1px solid black",
//                                                             // textAlign: "center",
//                                                             width:"30%"
//                                                         }}
//                                                     >
//                                                         <Autocomplete
//                                                             disablePortal
//                                                             id="combo-box-demo"
//                                                             options={itemOption}
//                                                             value={
//                                                                 itemOption.find((opt) => (opt.value) === parseInt(row?.itemID)) || null
//                                                             }
//                                                             fullWidth
//                                                             size="small"
//                                                             onChange={(e: any, newValue: any) =>
//                                                                 handleInputChange(
//                                                                     index,
//                                                                     "itemID",
//                                                                     newValue?.value
//                                                                 )
//                                                             }

//                                                             renderInput={(params) => (
//                                                                 <TextField
//                                                                     {...params}
//                                                                     label={
//                                                                         <CustomLabel
//                                                                             text={t("text.selectItem")}
//                                                                             required={false}
//                                                                         />
//                                                                     }
//                                                                 />
//                                                             )}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: "1px solid black", textAlign: "center" , width:"30%" }}>
//                                                         <Autocomplete
//                                                             disablePortal
//                                                             id="combo-box-demo"
//                                                             options={unitOptions}
//                                                             value={
//                                                                 unitOptions.find((opt) => (opt.value) === row?.unitId) || null
//                                                             }
//                                                             fullWidth
//                                                             size="small"
//                                                             onChange={(e, newValue: any) =>
//                                                                 handleInputChange(index, "unitId", newValue?.value)
//                                                             }
//                                                             renderInput={(params: any) => (
//                                                                 <TextField
//                                                                     {...params}
//                                                                     label={<CustomLabel text={t("text.selectUnit")} />}
//                                                                 />
//                                                             )}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                             type="number"
//                                                             size="small"
//                                                             // type="text"
//                                                             value={row.batchNo}
//                                                             onChange={(e) => handleInputChange(index, 'batchNo', e.target.value)}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                            // type="number"
//                                                             size="small"
//                                                             value={row.reqQty - row.issueQty || 0}
//                                                            // onChange={(e) => handleInputChange(index, 'stockQty', Number(row.srn - row.issueQty))}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                            // type="number"
//                                                             size="small"
//                                                             // type="text"
//                                                             value={row.reqQty}
//                                                             onChange={(e) => handleInputChange(index, 'reqQty', parseInt(e.target.value) || 0)}
//                                                             onFocus={(e) => e.target.select()}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                           //  type="number"
//                                                             size="small"
//                                                             // type="text"
//                                                             value={row.issueQty}
//                                                             onChange={(e) =>
//                                                                 handleInputChange(index, 'issueQty', parseInt(e.target.value) || 0 )
//                                                             }
//                                                             onFocus={(e) => e.target.select()}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => deleteRow(index)}>
//                                                         <DeleteIcon />
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>

//                                     </Table>
//                                 </Grid>
//                             )}

//                             <Grid item lg={6} sm={6} xs={12}>
//                                 <Grid>
//                                     <Button
//                                         type="submit"
//                                         fullWidth
//                                         style={{
//                                             backgroundColor: `var(--header-background)`,
//                                             color: "white",
//                                             marginTop: "10px",
//                                         }}
//                                     >
//                                         {t("text.save")}
//                                     </Button>
//                                 </Grid>
//                             </Grid>

//                             <Grid item lg={6} sm={6} xs={12}>
//                                 <Button
//                                     type="reset"
//                                     fullWidth
//                                     style={{
//                                         backgroundColor: "#F43F5E",
//                                         color: "white",
//                                         marginTop: "10px",
//                                     }}
//                                     onClick={(e: any) => formik.resetForm()}
//                                 >
//                                     {t("text.reset")}
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </CardContent>
//             </div>
//         </div>
//     );
// };

// export default CreateJobcardItemIssue;
