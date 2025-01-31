
// import {
//   Autocomplete,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Divider, Table,
//   MenuItem,
//   TextField,
//   Typography,

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

// type Props = {};


// const CreateStaffIndent = (props: Props) => {
//   let navigate = useNavigate();
//   const { t } = useTranslation();
//   const [lang, setLang] = useState<Language>("en");
//   const { defaultValues } = getISTDate();
//   const [toaster, setToaster] = useState(false);
//   const [tableData, setTableData] = useState<any>([

//     // id: 0,
//     // indentId: 0,
//     // itemId: -1,
//     // quantity: 0,
//     // rate: 0,
//     // amount: 0,
//     // approveQuantity: 0,
//     // fyId: 0,
//     // srn: 0,
//     // isDelete: true,
//     {
//     "id": -1,
//     "indentId": 0,
//     "itemId": 0,
//     "unitId": 0,
//     "quantity": 0,
//     "rate": 0,
//     "amount": 0,
//     "approveQuantity": 0,
//     "fyId": 0,
//     "srn": 0,
//     "isDelete": true,
//     "unitName": "",
//     "itemName": ""
//   },
//   {
//     "id": -1,
//     "indentId": 0,
//     "itemId": 0,
//     "unitId": 0,
//     "quantity": 0,
//     "rate": 0,
//     "amount": 0,
//     "approveQuantity": 0,
//     "fyId": 0,
//     "srn": 0,
//     "isDelete": true,
//     "unitName": "",
//     "itemName": ""
//   }
// ]);


//   const [unitOptions, setUnitOptions] = useState([
//     { value: "-1", label: t("text.SelectUnitId") },
//   ]);
//   const [itemOption, setitemOption] = useState([
//     { value: -1, label: t("text.itemMasterId") },
//   ]);
//   const [empOption, setempOption] = useState([
//     { value: "-1", label: t("text.empid") },
//   ]);
//   const [maxindentOption, setmaxindentOption] = useState([
//     { value: "-1", label: t("text.indentID") },
//   ]);


//   useEffect(() => {

//     GetUnitData();
//     GetitemData();
//     GetempData();

//     GetmaxindentData();

//   }, []);


//   console.log("🚀 ~ CreateIndentForm ~ tableData:", tableData)


//   const GetitemData = async () => {
//     const collectData = {
//       itemMasterId: -1,
//     };
//     const response = await api.get(`ItemMaster/GetItemMaster`, {});
//     const data = response.data.data;
//     const arr = [];
//     for (let index = 0; index < data.length; index++) {
//       arr.push({
//         label: data[index]["itemName"],
//         value: data[index]["itemMasterId"],
//       });
//     }
//     setitemOption(arr);
//   };

//   const GetmaxindentData = async () => {

//     const response = await api.get(`Master/GetMaxindentNo`);
//     const data = response.data.data;

//     for (let index = 0; index < data.length; index++) {
//       formik.setFieldValue("indentNo", data[index]['indentNo'])
//     }
//     //setmaxindentOption(arr);
//   };





//   const GetempData = async () => {
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



//   const GetUnitData = async () => {
//     const collectData = {
//       unitId: -1,
//     };
//     const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
//     const data = response.data.data;
//     const arr = [];
//     for (let index = 0; index < data.length; index++) {
//       arr.push({
//         label: data[index]["unitName"],
//         value: data[index]["unitId"],
//       });
//     }
//     setUnitOptions(arr);
//   };
//   //   const validateRow = (row: any) => {
//   //     return row.itemID && row.indentId && row.quantity >= 1 && row.rate >= 1 && row.amount >= 1 && row.approveQuantity >= 1;
//   // };

//   const validateRow = (row: any) => {
//     return row.itemId && row.unitId && row.approveQuantity && row.rate > 0;
//   };

//   const formik = useFormik({
//     initialValues: {



//       "indentId": 0,
//       "indentNo": "",
//       "indentDate": defaultValues,
//       "remark": "",
//       "createdBy": "adminvm",
//       "updatedBy": "adminvm",
//       "createdOn": defaultValues,
//       "updatedOn": defaultValues,
//       "companyId": 0,
//       "fyId": 0,
//       "jobID": 0,
//       "vehicleitem": 0,
//       "empId": null,
//       "status": "",
//       "releasedBy": "",
//       "indenttype": "Staff",
//       "postedBy": "",
//       "releasedOn": defaultValues,
//       "postedOn": defaultValues,
//       "empName": "",
//       indentDetail: [],
//       srn: 0
//     },
//     validationSchema: Yup.object({
//       empId: Yup.string()
//         .required(t("text.reqEmpName")),
//     }),

//     onSubmit: async (values) => {
//       //values.indentDetail = tableData
//       const validTableData = tableData.filter(validateRow);

//       if (validTableData.length === 0) {
//         alert("Please add some data in table for further process");
//         return;
//       }
//       console.log('values', values)

//       // const validTableData = tableData.filter(validateRow);

//       // if (validTableData.length == 0) {
//       //     toast.error("Please add some data in table for further process");
//       //     return;
//       // }

//       const response = await api.post(
//         `Master/UpsertIndent`, values
//         // { ...values, indentDetail: tableData }
//       );
//       if (response.data.status === 1) {
//         setToaster(false);
//         toast.success(response.data.message);
//         navigate("/Inventory/StaffIndent");
//       } else {
//         setToaster(true);
//         toast.error(response.data.message);
//       }
//     },
//   });

//   const back = useNavigate();

//   const handleInputChange = (index: number, field: string, value: number) => {
//     const newData: any = [...tableData];


//     const numericValue = parseFloat(value.toString());

//     newData[index][field] = numericValue;


//     if (field === 'quantity' && numericValue < 1) {
//       newData[index].quantity = 1;
//     }


//     if (field === 'quantity' || field === 'rate' || field === 'approveQuantity' || field === 'unitId') {
//       const quantity = newData[index].quantity;
//       const rate = newData[index].rate;
//       const approveQuantity = newData[index].approveQuantity;


//       newData[index].amount = rate * approveQuantity;
//     }
//     if (field === 'approveQuantity') {
//       newData[index].approveQuantity = value;

//     }

//     setTableData(newData);


//     if (newData[index].quantity >= 1 && newData[index].rate > 0 && newData[index].approveQuantity >= 1) {
//       if (index === tableData.length - 1) {
//         addRow();
//       }
//     }
//   };


//   const addRow = () => {
//     setTableData([
//       ...tableData,
//       {


//         id: tableData.length + 1,
//         "indentId": 0,
//         "itemId": 0,
//         "unitId": 0,
//         "quantity": 0,
//         "rate": 0,
//         "amount": 0,
//         "approveQuantity": 0,
//         "fyId": 0,
//         "srn": 0,
//         "isDelete": true,
//         "unitName": "",
//         "itemName": ""
//       },
//     ]);
//   };

//   const deleteRow = (index: any) => {
//     const newData = tableData.filter((_: any, i: any) => i !== index);
//     setTableData(newData);
//   };

//   return (
//     <div>
//       <div
//         style={{
//           padding: "-5px 5px",
//           backgroundColor: "#ffffff",
//           borderRadius: "5px",
//           border: ".5px solid #FF7722",
//           marginTop: "3vh",
//         }}
//       >
//         <CardContent>

//           <Grid item xs={12} container spacing={2} >
//             <Grid item lg={2} md={2} xs={2} marginTop={2}>
//               <Button
//                 type="submit"
//                 onClick={() => back(-1)}
//                 variant="contained"
//                 style={{
//                   backgroundColor: "blue",
//                   width: 20,
//                 }}
//               >
//                 <ArrowBackSharpIcon />
//               </Button>
//             </Grid>
//             <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
//               <Typography
//                 gutterBottom
//                 variant="h5"
//                 component="div"
//                 sx={{ padding: "20px" }}
//                 align="center"
//               >
//                 {t("text.createStaffIndent")}
//               </Typography>
//             </Grid>

//             <Grid item lg={3} md={3} xs={3} marginTop={3}>
//               <select
//                 className="language-dropdown"
//                 value={lang}
//                 onChange={(e) => setLang(e.target.value as Language)}
//               >
//                 {Languages.map((l: any) => (
//                   <option key={l.value} value={l.value}>
//                     {l.label}
//                   </option>
//                 ))}
//               </select>
//             </Grid>
//           </Grid>
//           <Divider />
//           <br />
//           <form onSubmit={formik.handleSubmit}>
//             {toaster === false ? "" : <ToastApp />}
//             <Grid item xs={12} container spacing={2}>

//               <Grid item lg={4} xs={12}>
//                 <TextField
//                   id="indentNo"
//                   name="indentNo"
//                   label={<CustomLabel text={t("text.IndentNO")} required={false} />}
//                   value={formik.values.indentNo}
//                   //placeholder={t("text.AutoIndentForm")}
//                   size="small"
//                   fullWidth
//                 //onChange={formik.handleChange}
//                 //onBlur={formik.handleBlur}

//                 />
//               </Grid>


//               <Grid item lg={4} xs={12}>
//                 <TextField
//                   id="indentDate"
//                   name="indentDate"
//                   label={<CustomLabel text={t("text.indentDate")} required={false} />}
//                   value={formik.values.indentDate}
//                   placeholder={t("text.indentDate")}
//                   size="small"
//                   fullWidth
//                   type="date"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>


// <Grid item xs={12} sm={4} lg={4}>
//   <Autocomplete
//     disablePortal
//     id="combo-box-demo"
//     options={empOption}
//     fullWidth
//     size="small"
//     onChange={(event, newValue) => {
//       console.log(newValue?.value);
//       formik.setFieldValue("empId", newValue?.value);
//     }}
//     renderInput={(params) => (
//       <TextField
//         {...params}
//         label={<CustomLabel text={t("text.selectemp_name")} />}
//       />
//     )}
//   />

//   {formik.touched.empId && formik.errors.empId && (
//     <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
//   )}
// </Grid>


//               {/* <Grid item xs={12} sm={4} lg={4}>
//                 <Autocomplete
//                   disablePortal
//                   id="combo-box-demo"
//                   options={empOption}
//                   fullWidth
//                   size="small"
//                   onChange={(event, newValue) => {
//                     if (!newValue) {
//                       return;
//                     }
//                     console.log(newValue?.value);
//                     formik.setFieldValue("empId", newValue?.value);
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label={<CustomLabel text={t("text.selectemp_name")}  required={true}/>}
//                     />
//                   )}
//                 />

//                 {formik.touched.empId && formik.errors.empId && (
//                   <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
//                 )}
//               </Grid> */}

//               <Grid item xs={12}>


// <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
//   <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
//     <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
//       <tr>

//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.itemName")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.quantity")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.approveQuantity")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Rate")}</th>
//         <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.totalAmount")}</th>


//       </tr>
//     </thead>
//     <tbody>
//       {tableData.map((row: any, index: any) => (
//         <tr key={row.id} style={{ border: '1px solid black' }}>
//           <td style={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</td>
//           <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => {
//             if (tableData.length > 1) {
//               deleteRow(index)
//             } else {
//               alert("There should be atleast one row")
//             }
//           }}>
//             <DeleteIcon />
//           </td>

//           <td
//             style={{
//               border: "1px solid black",
//               // textAlign: "center",
//             }}
//           >
//             <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               options={itemOption}
//               fullWidth
//               size="small"
//               onChange={(e: any, newValue: any) => {
//                 if (!newValue) {
//                   return;
//                 } else {
//                   handleInputChange(
//                     index,
//                     "itemId",
//                     newValue?.value
//                   )
//                 }
//               }
//               }
//               renderInput={(params) => (
//                 <TextField
//                   {...params}

//                 />
//               )}
//             />
//           </td>
//           <td style={{ border: '1px solid black', textAlign: 'center' }}>

//             <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               options={unitOptions}
//               fullWidth
//               size="small"
//               onChange={(e: any, newValue: any) => {
//                 if (!newValue) {
//                   return;
//                 } else {
//                   handleInputChange(
//                     index,
//                     "unitId",
//                     newValue?.value
//                   )
//                 }
//               }
//               }
//               renderInput={(params) => (
//                 <TextField
//                   {...params}

//                 />
//               )}
//             />

//           </td>


//           <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
//             <TextField

//               size="small"
//               // type="text"
//               value={row.quantity}

//               onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value) || 0)}
//               onFocus={e => e.target.select()}
//            />
//           </td>
//           <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
//             <TextField

//               size="small"
//               // type="text"
//               value={row.approveQuantity}
//               onChange={(e) => handleInputChange(index, 'approveQuantity', parseFloat(e.target.value) || 0)}
//               onFocus={e => e.target.select()}
//             />
//           </td>
//           <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
//             <TextField

//               size="small"
//               // type="text"
//               value={row.rate}
//               onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
//               onFocus={e => e.target.select()}
//            />
//           </td>

//           <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
//             <TextField
//               // type="number"
//               value={row.amount.toFixed(2)}
//               size="small"
//               inputProps={{ "aria-readonly": true }}
//             />
//           </td>

//         </tr>
//       ))}
//     </tbody>
//     <tfoot>
//       <tr>
//         <td colSpan={7} style={{ textAlign: "right", fontWeight: "bold" }}>
//           {t("text.Totalnetamount")}

//         </td>
//         <td style={{ textAlign: "center", border: "1px solid black" }}>
//           {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
//         </td>
//       </tr>


//     </tfoot>
//   </Table>
// </div>   </Grid>


//               <Grid item xs={12} md={12} lg={12}>
//                 {/* <TextareaAutosize placeholder={t("text.remark")} minRows={1} */}
//                 <TextField
//                   placeholder={t("text.Remark")}
//                   onChange={(e) => formik.setFieldValue('remark', e.target.value)}
//                   style={{
//                     width: '100%',
//                     height: 'auto',
//                     border: '1px solid #ccc',
//                     padding: '8px',
//                     borderRadius: '4px',
//                     fontSize: '16px',

//                   }} />
//               </Grid>


//               <Grid item lg={6} sm={6} xs={12}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   style={{
//                     backgroundColor: `var(--header-background)`,
//                     color: "white",
//                     marginTop: "10px",
//                   }}
//                 >
//                   {t("text.save")}
//                 </Button>
//               </Grid>

//               <Grid item lg={6} sm={6} xs={12}>
//                 <Button
//                   type="reset"
//                   fullWidth
//                   style={{
//                     backgroundColor: "#F43F5E",
//                     color: "white",
//                     marginTop: "10px",
//                   }}
//                   onClick={(e: any) => formik.resetForm()}
//                 >
//                   {t("text.reset")}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </div>
//     </div>
//   );
// };

// export default CreateStaffIndent;

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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getISTDate } from "../../../utils/Constant";

type Props = {};


const CreateStaffIndent = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [tableData, setTableData] = useState<any>([
    {


      "id": -1,
      "indentId": 0,
      "itemId": 0,
      "unitId": 0,
      "quantity": 0,
      "rate": 0,
      "amount": 0,
      "approveQuantity": 0,
      "fyId": 0,
      "srn": 0,
      "isDelete": true,
      "unitName": "",
      "itemName": ""
    },
    // {


    //   "id": -1,
    //   "indentId": 0,
    //   "itemId": 0,
    //   "unitId": 0,
    //   "quantity": 0,
    //   "rate": 0,
    //   "amount": 0,
    //   "approveQuantity": 0,
    //   "fyId": 0,
    //   "srn": 0,
    //   "isDelete": true,
    //   "unitName": "",
    //   "itemName": ""
    // }

  ]);


  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [itemOption, setitemOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const [empOption, setempOption] = useState([
    { value: "-1", label: t("text.empid") },
  ]);



  useEffect(() => {

    GetUnitData();
    GetitemData();
    GetempData();

    GetmaxindentData();

  }, []);


  console.log("🚀 ~ CreateStaffIndent ~ tableData:", tableData)

  const GetempData = async () => {
    const collectData = {
      empid: -1,
      userId: "",

    };
    const response = await api.post(`Employee/GetEmployee`, collectData);
    const data = response.data.data;
    // console.log('CheckEmp',data)
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
      });
    }
    setempOption(arr);
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

  const GetmaxindentData = async () => {

    const response = await api.get(`Master/GetMaxindentNo`);
    const data = response.data.data;

    for (let index = 0; index < data.length; index++) {
      formik.setFieldValue("indentNo", data[index]['indentNo'])
    }
    //setmaxindentOption(arr);
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



  const validateRow = (row: any) => {
    return row.itemId && row.unitId && row.approveQuantity && row.rate > 0;
  };

  const formik = useFormik({
    initialValues: {
      //vehicleNo: 0,
      "sno": 0,
      "indentId": 0,
      "indentNo": "",
      "indentDate": defaultValues,
      "remark": "",
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "jobID": 0,
      "vehicleitem": null,
      "empId": 0,
      "status": "",
      "releasedBy": "",
      "indenttype": "Staff",
      "postedBy": "",
      "releasedOn": defaultValues,
      "postedOn": defaultValues,
      indentDetail: [],
      srn: 0
    },
    // validationSchema: Yup.object({
    //   empId: Yup.string()
    //     .required(t("text.reqEmpName")),
    // }),

    onSubmit: async (values) => {
      // values.indentDetail = tableData
      const validTableData = tableData.filter(validateRow);
      if (validTableData.length === 0) {
        alert("Please add some data in table for further process");
        return;
      }
      console.log('values', values)



      const response = await api.post(
        `Master/UpsertIndent
`,
        { ...values, indentDetail: validTableData }
      );
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/Inventory/StaffIndent");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const back = useNavigate();

  const handleInputChange = (index: number, field: string, value: number) => {
    const newData: any = [...tableData];


    const numericValue = parseFloat(value.toString());

    newData[index][field] = numericValue;


    if (field === 'quantity' && numericValue < 1) {
      newData[index].quantity = 1;
    }


    if (field === 'quantity' || field === 'rate' || field === 'approveQuantity' || field === 'unitId') {
      const quantity = newData[index].quantity;
      const rate = newData[index].rate;
      const approveQuantity = newData[index].approveQuantity;


      newData[index].amount = rate * approveQuantity;
    }


    setTableData(newData);


    // if (newData[index].quantity >= 1 && newData[index].rate > 0 && newData[index].approveQuantity >= 1) {
    //   if (index === tableData.length - 1) {
    //     addRow();
    //   }
    // }
  };


  const addRow = () => {
    setTableData([
      ...tableData,
      {

        id: tableData.length + 1,
        "indentId": 0,
        "itemId": 0,
        "unitId": 0,
        "quantity": 0,
        "rate": 0,
        "amount": 0,
        "approveQuantity": 0,
        "fyId": 0,
        "srn": 0,
        "isDelete": true,
        "unitName": "",
        "itemName": ""
      },
    ]);
  };


  const deleteRow = (index: any) => {
    const newData = tableData.filter((_: any, i: any) => i !== index);
    setTableData(newData);
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
                {t("text.createStaffIndent")}
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
                  id="indentNo"
                  name="indentNo"
                  label={<CustomLabel text={t("text.IndentNO")} required={false} />}
                  value={formik.values.indentNo}

                  size="small"
                  fullWidth


                />
              </Grid>


              <Grid item lg={4} xs={12}>
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
              </Grid>





              <Grid item xs={12} sm={4} lg={4}>
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
                      label={<CustomLabel text={t("text.selectemp_name")} />}
                    />
                  )}
                />

                {formik.touched.empId && formik.errors.empId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
                )}
              </Grid>

              <Grid item xs={12}>


                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
                  <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                    <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                      <tr>

                        {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th> */}
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.itemName")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.quantity")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.approveQuantity")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Rate")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.totalAmount")}</th>


                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: '1px solid black' }}>
                          {/* <td style={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</td> */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <AddCircleIcon
                              onClick={() => {
                                addRow();
                              }}

                              style={{ cursor: "pointer" }}
                            />
                            <DeleteIcon
                              onClick={() => {
                                if (tableData.length > 1) {
                                  deleteRow(index)
                                } else {
                                  alert("Atleast one row should be there");
                                }
                              }}
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
                              options={itemOption}
                              fullWidth
                              size="small"
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
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                } else {
                                  handleInputChange(
                                    index,
                                    "unitId",
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


                          <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
                            <TextField

                              size="small"
                              // type="text"
                              value={row.quantity}
                              onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>
                          <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
                            <TextField

                              size="small"
                              // type="text"
                              value={row.approveQuantity}
                              onChange={(e) => handleInputChange(index, 'approveQuantity', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>
                          <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
                            <TextField

                              size="small"
                              // type="text"
                              value={row.rate}
                              onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>

                          <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
                            <TextField
                              // type="number"
                              value={row.amount.toFixed(2)}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.Totalnetamount")}

                        </td>
                        <td style={{ textAlign: "center", border: "1px solid black" }}>
                          {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                        </td>
                      </tr>


                    </tfoot>
                  </Table>
                </div>   </Grid>


              <Grid item xs={12} md={12} lg={12}>

                <TextField
                  placeholder={t("text.Remark")}
                  onChange={(e) => formik.setFieldValue('remark', e.target.value)}
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

export default CreateStaffIndent;





