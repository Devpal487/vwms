
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
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
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


const CreateJobCardItemReturn = (props: Props) => {

    const [openDialog, setOpenDialog] = useState(false);

    const handleShowDetails = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [lang, setLang] = useState<Language>("en");
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [isIndentSelected, setIsIndentSelected] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [items, setItems] = useState<any>([]);
    //const [tableData, setTableData] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([
        {
            "id": 0,
            "returnId": 0,
            "itemID": 0,
            "batchNo": "",
            "indentId": 0,
            "returnQty": 0,
            "issueQty": 0
        },
    


    ]);

    const [tableDatai, setTableDatai] = useState<any>([
        {
            "id": 0,
            "issueId": 0,
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
            "stockQty": 0
        },
        
    ]);

    console.log("🚀 ~ CreateJobCardItemReturn ~ tableData:", tableData)
    const [indentOptions, setIndentOptions] = useState([
        { value: "-1", label: t("text.SelectindentNo") },
    ]);
    const [itemOption, setitemOption] = useState([
        { value: -1, label: t("text.itemMasterId") },
    ]);
    // const [openDialog, setOpenDialog] = useState(false);
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
          //  "issueId":-1,"indentId":-1,"empId":-1
        };

        const response = await api.post(`Master/GetIndent`, collectData);
       // const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
        const data = response.data.data;
        console.log("indent option", data)
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["indentNo"] || 0,
              //  value: data[index]["issueId"]|| "",
                value: data[index]["indentId"],


            });
        };
        setIndentOptions(arr);
    };

    const GetIndentIDById = async (itemID: any) => {
        const collectData = {
            // indentId: issueId,
            // indentNo: "",
            // empId: -1,
            "issueId":itemID,"indentId":-1,"empId":-1
        };
    
        try {
            const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
            const data = response.data.data[0]?.itemIssueDetail || [];
           // formik.setFieldValue('itemIssueDetail', data);

            console.log("Fetched Data from API:", data);
    
            const indentDetails = data.map((item: any, index: any) => ({
                // id: index + 1,
                // issueId: 0,
                // itemID: item.itemId || 0,
                // unitId: item.unitId || 0,
                // batchNo: item.batchNo || "",
                // indentId: issueId,
                // reqQty: item.quantity || 0,
                // issueQty: item.approveQuantity || 0,
                // itemName: item.itemName || "",
                // unitName: item.unitName || "",
                // indentNo: item.indentNo || "",
                // stockQty: item.stockQty || 0,
                // returnItem: true,
                id: index + 1,
                "returnId": -1,
                indentId: item?.indentId || 0,
                batchNo: item?.batchNo || "",
                itemID: item?.itemID,
                issueQty: item?.issueQty,
    
                unitId: item?.unitId,
    
                unitName: item?.unitName,
                itemName: item?.itemName,
                returnQty: 0,
    
            }));
    
            console.log("Transformed Data for tableDatai:", indentDetails);
    
            setTableDatai(indentDetails); 
            setIsIndentSelected(indentDetails.length > 0); 
        } catch (error) {
            console.error("Error fetching indent details:", error);
            setTableDatai([]);
            setIsIndentSelected(false);
        }
    };
    
    console.log("check table", tableData)
    const [showIndentField, setShowIndentField] = useState(false);
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
            "returnType": "",
            "returnIndentNo": "",
            "createdBy": "",
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            itemIssueDetail: [],
            itemReturnDetail: []


        },

        // validationSchema: Yup.object({
        //     indentNo: Yup.string()
        //         .required(t("text.reqIndentNum")),
        //     // empId: Yup.string()
        //     //     .required(t("text.reqEmpName")),
        // }),

      

        onSubmit: async (values) => {
            // Filter and format itemReturnDetail
            const formattedItemReturnDetail = tableData.map((row: any) => ({
                id: row.id || 0,
                returnId: row.returnId || 0,
                itemID: row.itemID || 0,
                batchNo: row.batchNo || "",
                indentId: row.indentId || 0,
                returnQty: row.returnQty || 0,
                issueQty: row.issueQty || 0,
            }));
    
            // Prepare payload
            const payload = {
                ...values,
                itemReturnDetail: formattedItemReturnDetail, 
                itemIssueDetail: tableDatai,                
            };
    
            console.log("Payload to Submit:", payload);
    
            try {
                const response = await api.post(`Master/UpsertItemReturn`, payload);
    
                if (response.data.status === 1) {
                    toast.success(response.data.message);
                    navigate("/Inventory/JobCardItemReturn");
                } else {
                    toast.error(response.data.error?.errorMessage || "Submission failed!");
                }
            } catch (error) {
                console.error("Error during submission:", error);
                toast.error("Failed to submit data. Please check the console for details.");
            }
        },
        
        

    });
 

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleInputChange = (index: any, field: any, value: any) => {
        const newData: any = [...tableData];
        newData[index][field] = value;

        if (field === 'returnId') {
            newData[index].returnId = newData[index].returnId;
            //  newData[index].serviceName = serviceOption[serviceOption.findIndex(e => e.value == newData[index].serviceId)].label;
        }

        if (field === 'itemID') {
            newData[index].itemID = newData[index].itemID;
        }
        if (field === 'batchNo') {
            newData[index].batchNo = newData[index].batchNo;
            // newData[index].vendorName = vendorOption[vendorOption.findIndex(e => e.value == newData[index].vendorId)].label;
        }
        if (field === 'indentId') {
            newData[index].indentId = newData[index].indentId;
        }
        if (field === 'returnQty') {
            newData[index].returnQty = newData[index].returnQty;
        }
        if (field === 'issueQty') {
            newData[index].issueQty = newData[index].issueQty;
        }


        //  newData[index].jobCardId = formik.values.jobCardId;

        newData[index].id = index;
        setTableData(newData);

        if (newData[index].itemID && newData[index].batchNo && newData[index].indentId) {
            if (index === tableData.length - 1) {
                addRow();

            }
        }

     
    };


    const handleInputChange1 = (index: any, field: any, value: any) => {
        const newData: any = [...tableDatai];
        newData[index][field] = value;

        if (field === 'itemID') {
            newData[index].itemID = newData[index].itemID;
            // newData[index].serviceName = serviceOption[serviceOption.findIndex(e => e.value == newData[index].serviceId)].label;
        }

        if (field === 'unitId') {
            newData[index].unitId = newData[index].unitId;
        }

        if (field === 'batchNo') {
            newData[index].batchNo = newData[index].batchNo;
        }

        // newData[index].jobCardId = formik.values.jobCardId;

        newData[index].id = index;
        setTableDatai(newData);

        if (newData[index].itemID && newData[index].unitId && newData[index].batchNo) {
            if (index === tableDatai.length - 1) {
                handleAddItem();

            }
        }

     
    };


    const deleteRow = (index: number) => {
        const updatedData = tableData.filter((_: any, i: number) => i !== index);
        setTableData(updatedData);
    };
    const deleteRow1 = (index: number) => {
        const updatedData1 = tableDatai.filter((_: any, i: number) => i !== index);
        setTableDatai(updatedData1);
    };


  

    const [showTable, setShowTable] = useState(false); 
    const handleIndentChange = async (event: any, newValue: any) => {
        if (newValue) {
            console.log("Selected Indent:", newValue);
            formik.setFieldValue("returnIndentNo", newValue.label.toString());
           // formik.setFieldValue("indentId", newValue.value);
    
            await GetIndentIDById(newValue.value);
    
            console.log("Updated tableDatai:", tableDatai);
            console.log("Is Indent Selected:", isIndentSelected);
        }
    };

    const back = useNavigate();

    const addRow = () => {
        setTableData([
            ...tableData,
            {
                "id": 0,
                "returnId": 0,
                "itemID": 0,
                "batchNo": "",
                "indentId": 0,
                "returnQty": 0,
                "issueQty": 0
            },
        ]);
    };

    const handleAddItem = () => {
        setTableDatai([...tableDatai, {


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
            "stockQty": 0
        }]);
    };
    const handleAddIndent = () => {
        
        const mergedData = [
            
            ...tableDatai.map((item: any) => ({
                ...item,
                indentNo: formik.values.returnIndentNo, 
                ...tableData,
            })),
        ];
    
       
        const uniqueData = mergedData.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.itemID === item.itemID)
        );
    
        setTableData(uniqueData);
        setOpenDialog(false);     
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
                                {t("text.CreateJobCardItemReturn")}
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
                                    id="returnDate"
                                    name="returnDate"
                                    label={<CustomLabel text={t("text.returnDate")} required={false} />}
                                    value={formik.values.returnDate}
                                    placeholder={t("text.returnDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleShowDetails}
                                    style={{ height: "100%" }}
                                >
                                    Show Details
                                </Button>
                            </Grid>
                            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                                <DialogTitle>Add Item</DialogTitle>
                                <DialogContent>
                                    <p>Selected Indent No: {formik.values.returnIndentNo || "No Indent Selected"}</p>

                                    {/* Autocomplete to Select Indent */}
                                    <Grid item lg={4} xs={12}>
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
                                                 //   formik.setFieldValue("indentId", newValue?.value);
                                                    formik.setFieldValue("returnIndentNo", newValue?.label?.toString() || "");
                                                }
                                            }}
                                            // value={
                                            //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
                                            // }
                                            renderInput={(params: any) => (
                                                <TextField
                                                    {...params}
                                                    label="Search Indent"
                                                    placeholder="Search for an indent..."
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {isIndentSelected && tableDatai.length > 0 ? (
    <Grid item xs={12}>
        <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
            <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black', marginTop: "2%" }}>
                <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                    <tr>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>Item Name</th>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>Unit</th>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>Batch No</th>
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>Pending Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {tableDatai.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: '1px solid black' }}>
                            <td style={{ border: "1px solid black", textAlign: "center" }}>
                                <DeleteIcon
                                    onClick={() => deleteRow1(index)}
                                    style={{ cursor: "pointer" }}
                                />
                            </td>
                            <td style={{ border: "1px solid black" }}>{row.itemName}</td>
                            <td style={{ border: "1px solid black" }}>{row.unitName}</td>
                            <td style={{ border: "1px solid black" }}>{row.batchNo}</td>
                            <td style={{ border: "1px solid black" }}>{row.issueQty}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </Grid>
) : (
    <p>No indent data available or indent not selected</p>
)}


                                    {/* Add Indent Button */}
                                    {/* <Button
                                                      variant="contained"
                                                      color="secondary"
                                                      onClick={() => alert("Add Indent functionality not implemented yet!")}
                                                      style={{ marginTop: "10px" }}
                                                  >
                                                      Add Indent
                                                  </Button> */}

                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleAddIndent}
                                        style={{ marginTop: "10px" }}
                                    >
                                        Add Indent
                                    </Button>



                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>



                            <Grid item xs={12}>
                                <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                                    <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                                        <tr>
                                            <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                                            {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}></th> */}
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Item</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.indentNo")}</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Unit</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Batch No.</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Pending Qty</th>
                                            <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Return Qty</th>
                                            {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>issue Qty</th> */}

                                            {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Total Amount</th> */}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row: any, index: any) => (
                                            <tr key={row.id} style={{ border: '1px solid black' }}>
                                                <td
                                                    style={{
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
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
                                                        value={
                                                            itemOption.find((opt) => (opt.value) === parseInt(row?.itemID)) || null
                                                        }
                                                        fullWidth
                                                        size="small"
                                                        sx={{ width: "175px" }}
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
                                                           
                                                            />
                                                        )}
                                                    />
                                                </td>

                                                <td
                                                    style={{
                                                        border: "1px solid black",

                                                    }}
                                                >
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={indentOptions}
                                                        value={
                                                            indentOptions.find((opt: any) => (opt.value) === parseInt(row?.indentId)) || null
                                                        }
                                                        fullWidth
                                                        size="small"
                                                        sx={{ width: "175px" }}
                                                        onChange={(e: any, newValue: any) => {
                                                            console.log(newValue?.value);
                                                            handleInputChange(index, 'indentId', newValue?.value);
                                                            handleInputChange(index, 'indentNo', newValue?.label);
                                                        }}

                                                        renderInput={(params: any) => (
                                                            <TextField
                                                                {...params}
                                                            // label={
                                                            //   <CustomLabel text={t("text.enterIndentNo")} required={true} />
                                                            // }
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
                                                        sx={{ width: "175px" }}
                                                        onChange={(e, newValue: any) =>
                                                            handleInputChange(index, "unitId", newValue?.value)
                                                        }
                                                        renderInput={(params: any) => (
                                                            <TextField
                                                                {...params}
                                                            //   label={<CustomLabel text={t("text.selectUnit")} />}
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                    <TextField
                                                        //  type="number"
                                                        size="small"
                                                        // type="text"
                                                        value={row.batchNo}
                                                        onChange={(e) => handleInputChange(index, 'batchNo', (e.target.value)||"")}
                                                    onFocus={e => e.target.select()}
                                                    />
                                                </td>

                                                <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                    <TextField
                                                        //type="number"
                                                        size="small"
                                                        // type="text"
                                                        value={row.issueQty}
                                                        onChange={(e) => handleInputChange(index, 'issueQty', parseFloat(e.target.value)||0)}
                                                  onFocus={e => e.target.select()}
                                                  />
                                                </td>
                                                <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                                    <TextField
                                                        //   type="number"
                                                        size="small"
                                                        // type="text"
                                                        value={row.returnQty}
                                                        onChange={(e) => handleInputChange(index, 'returnQty', parseFloat(e.target.value)||0)}
                                                        onFocus={e => e.target.select()}
                                                   />
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                            </Grid>


                            <Grid container spacing={2} >
                                <Grid item lg={6} sm={6} xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        style={{

                                            backgroundColor: `var(--header-background)`,
                                            color: "white",
                                            marginTop: "10px",
                                            marginLeft: "10px",
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
                                        onClick={(e) => formik.resetForm()}
                                    >
                                        {t("text.reset")}
                                    </Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default CreateJobCardItemReturn;









