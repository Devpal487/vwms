

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


// const CreateStaffItemReturn = (props: Props) => {
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
//         "returnItem": true,


//     }]);
//     console.log("🚀 ~ CreateStaffItemreturn ~ tableData:", tableData)
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
//         GetempData();
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

//             id: index + 1,
//             "issueId": 0,


//             batchNo: item?.batchNo,
//             itemID: item?.itemId,
//             unitId: item?.unitId,
//             issueQty: item?.approveQuantity,
//             reqQty: item?.quantity,

//             unitName: "",
//             itemName: "",
//             indentNo: "",
//             "srn": 0,
//             //"unitName": "",
//             "returnItem": true


//         }))

//         setTableData(indent);
//         setIsIndentSelected(true);

//     };

//     console.log("check table", tableData)

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
    // const GetempData = async () => {
    //     const collectData = {
    //       empid: -1,
    //       userId: "",
         
    //     };
    //     const response = await api.post(`Employee/GetEmployee`, collectData);
    //     const data = response.data.data;
    //     console.log('data', data)
    //     const arr = data.map((item: any) => ({
    //       label: item?.empName,
    //       value: item?.empid
    
    //     }))
    //     // for (let index = 0; index < data.length; index++) {
    //     //   arr.push({
    //     //     label: data[index]["empName"],
    //     //     value: data[index]["empId"],
    //     //   });
    //     // }
    //     setempOption(arr);
    //   };



//     const handleActionChange = (event: any) => {
//         setSelectedAction(event.target.value);
//     };

//     const validateRow = (row: any) => {
//         // return row.itemName && row.unitId && row.reqQty >= 1;
//     };

//     const formik = useFormik({
//         initialValues: {


//             "issueId": 0,
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
//                 `Master/UpsertItemReturn`,
//                 values
//             );

//             if (response.data.status === 1) {
//                 setToaster(false);
//                 toast.success(response.data.message);
//                 navigate("/Inventory/StaffItemIssue");
//             } else {
//                 setToaster(true);
//                 toast.error(response.data.message);
//             }

//         },
//     });



//     const handleInputChange = (index: any, field: any, value: any) => {
//         const updatedData = [...tableData];
//         updatedData[index][field] = value;



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
//                                 {t("text.createStaffItemReturn")}
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
//                                         }
//                                     }}

//                                     // value={
//                                     //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
//                                     // }
//                                     renderInput={(params: any) => (
//                                         <TextField
//                                             {...params}
//                                             label={
//                                                 <CustomLabel text={t("text.enterIndentNo")} required={true}/>
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
//                                                 <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Batchno</th>
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
//                                                     <td style={{ border: "1px solid black", textAlign: "center" }}>
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
//                                                             type="number"
//                                                             size="small"
//                                                             value={row.stockQty || 0}
//                                                             onChange={(e) => handleInputChange(index, 'stockQty', parseInt(e.target.value))}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                             type="number"
//                                                             size="small"
//                                                             // type="text"
//                                                             value={row.reqQty}
//                                                             onChange={(e) => handleInputChange(index, 'reqQty', e.target.value)}
//                                                         />
//                                                     </td>
//                                                     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                             type="number"
//                                                             size="small"
//                                                             // type="text"
//                                                             value={row.issueQty}
//                                                             onChange={(e) => handleInputChange(index, 'issueQty', e.target.value)}
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

// export default CreateStaffItemReturn;







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


const CreateStaffItemReturn = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
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

    const [empOption, setempOption] = useState([
        { value: "-1", label: t("text.empid") },
    ]);
    useEffect(() => {
        GetIndentID();
        GetitemData();
        GetUnitData();
        GetempData();
    }, []);


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
            itemName: "",
            indentNo: "",
            "srn": 0,
            //"unitName": "",
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
    const GetempData = async () => {
        const collectData = {
          empid: -1,
          userId: "",
         
        };
        const response = await api.post(`Employee/GetEmployee`, collectData);
        const data = response.data.data;
        console.log('data', data)
        const arr = data.map((item: any) => ({
          label: item?.empName,
          value: item?.empid
    
        }))
        // for (let index = 0; index < data.length; index++) {
        //   arr.push({
        //     label: data[index]["empName"],
        //     value: data[index]["empId"],
        //   });
        // }
        setempOption(arr);
      };



    const handleActionChange = (event: any) => {
        setSelectedAction(event.target.value);
    };

    const validateRow = (row: any) => {
        // return row.itemName && row.unitId && row.reqQty >= 1;
    };

    const formik = useFormik({
        initialValues: {

            
                "returnId": 0,
                "returnDate": defaultValues,
                "returnType": "rt",
                "returnIndentNo": "rt45",
                "createdBy": "as",
                "updatedBy": "as",
                "createdOn": defaultValues,
                "updatedOn": defaultValues,
                "itemReturnDetail": [ ],
                //   {
                //     "id": 13,
                //     "returnId": 0,
                //     "itemID": 1,
                //     "batchNo": "bt5",
                //     "indentId": 2,
                //     "returnQty": 10,
                //     "issueQty": 10
                //   }
               
                "itemIssueDetail": []
              
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
            // itemIssueDetail: []


        },

        validationSchema: Yup.object({
            indentNo: Yup.string()
                .required(t("text.reqIndentNum")),
            empId: Yup.string()
                .required(t("text.reqEmpName")),
        }),

        onSubmit: async (values) => {

            const validTableData = tableData;
            values.itemIssueDetail = tableData

            // if (validTableData.length === 0) {
            //     toast.error("Please add some data in table for further process");
            //     return;
            // }


            const response = await api.post(
                `Master/UpsertItemReturn`,
                values
            );

            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/Inventory/StaffItemReturn");
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
            "returnItem": true
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
                                {t("text.createStaffItemReturn")}
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
                                                <CustomLabel text={t("text.enterIndentNo")} required={true}/>
                                            }
                                        />
                                    )}
                                />
                                {/* {formik.touched.indentNo && formik.errors.indentNo && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentNo}</div>
                                )} */}
                            </Grid>


                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={empOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("empId", newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.selectemp_name")} required={true} />}
                                        />
                                    )}
                                />
                                {formik.touched.empId && formik.errors.empId && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
                                )}
                            </Grid> */}


                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="returnDate"
                                    name="returnDate"
                                    label={<CustomLabel text={t("text.returnDate")} required={false} />}
                                    value={formik.values.returnDate}
                                    placeholder={t("text.returnDate")} size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>



                            {isIndentSelected && (
                                <Grid item xs={12}>
                                    <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                                        <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                                            <tr>
                                                {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}></th> */}
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Item Name</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Unit</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Batchno</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>stockQty</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>reqQty</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>issueQty</th>

                                                {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Total Amount</th> */}
                                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row: any, index: any) => (
                                                <tr key={row.id} style={{ border: '1px solid black' }}>


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
                                                            onChange={(e: any, newValue: any) =>
                                                                handleInputChange(
                                                                    index,
                                                                    "itemID",
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
                                                                    label={<CustomLabel text={t("text.selectUnit")} />}
                                                                />
                                                            )}
                                                        />
                                                    </td>
                                                    <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            // type="text"
                                                            value={row.batchNo}
                                                            onChange={(e) => handleInputChange(index, 'batchNo', e.target.value)}
                                                        />
                                                    </td>
                                                    <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={row.stockQty || 0}
                                                            onChange={(e) => handleInputChange(index, 'stockQty', parseInt(e.target.value))}
                                                        />
                                                    </td>
                                                    <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            // type="text"
                                                            value={row.reqQty}
                                                            onChange={(e) => handleInputChange(index, 'reqQty', e.target.value)}
                                                        />
                                                    </td>
                                                    <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            // type="text"
                                                            value={row.issueQty}
                                                            onChange={(e) => handleInputChange(index, 'issueQty', e.target.value)}
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

export default CreateStaffItemReturn;





