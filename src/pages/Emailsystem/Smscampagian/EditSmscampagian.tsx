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
    FormGroup,
    FormControlLabel,
    Box,
    Radio,
    Select,
    RadioGroup,
    Checkbox
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import selecteddata from "../dpdata";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import moment from "moment";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
type Props = {};


const unitOptions = [
    { value: 'Immediately', label: 'Immediately' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Repeated', label: 'Repeated' },
    { value: 'Complete', label: 'Complete' },
];



const EditSmscampagian = (props: Props) => {
    const location = useLocation();
    console.log('location', location.state)
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [lang, setLang] = useState<Language>("en");
    const [selectedValue, setSelectedValue] = useState('');
    const { defaultValues } = getISTDate();
    const [ZoneOption, setZoneOption] = useState([{ value: "-1", label: t("text.SelectZone") }]);
    const [toaster, setToaster] = useState(false);
    const [toTime, setToTime] = useState<string>("");
    console.log('toTime', toTime)
    const [editorContent, setEditorContent] = useState<string>("");
    const handleEditorChange = (content: any) => {
        setEditorContent(content);
    };

    const [empOption, setempOption] = useState([
        { value: -1, label: t("text.empid") },
    ]);

    const [groupOption, setgroupOption] = useState<any>([
        { value: -1, label: t("text.groupId") },
    ]);

    const [templateOption, setTemplateOpation] = useState([
        { value: -1, label: t("text.templateId") },
    ]);
    const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    //const formattedDate = moment(location.state.campaignDate).format("YYYY-MM-DD"); 

    useEffect(() => {
        const currentTime = new Date();
        setToTime(formatTime(currentTime))
        getEmpData();
        getgroupData();
        getTemplateDta();

    }, []);

    const getEmpData = async () => {
        const collectData = {
            "empid": -1,
            "userId": "",
      
        };

        const response = await api.post(`Employee/GetEmployee`, collectData);
        const data = response.data.data;

        const arr = data.map((item: any) => ({
            label: item.empName,
            value: item.empid,
        }));

        setempOption([{ label: "Select All", value: "selectAll" }, ...arr]);
    };

    const handleChange = (event: any, newValue: any) => {
        let updatedList;

        if (newValue.some((option: any) => option.value === "selectAll")) {
            if (newValue.length === empOption.length) {

                updatedList = [];
            } else {

                updatedList = empOption.slice(1);
            }
        } else {
            updatedList = newValue;
        }

        const memberId = updatedList.map((item: any) => ({
            id: 0,
            campaignId: 0,
            groupId: 0,
            memberId: item.value,
            message: "",
            emailId: "",
            mobileNo: "",
            receiverType: "",
            name: "",
            isSelected: true,
        }));

        formik.setFieldValue("listMembers", memberId);
    };
    const getgroupData = async () => {
        const collectData = {
            "groupId": -1
        };
        const response = await api.post(`Comm/GetCommGroup`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["name"],
                value: data[index]["groupId"],
            });
        }
        setgroupOption(arr);
    };

    const getTemplateDta = async () => {
        const collectData = {
            "templateId": -1,
            "template": "",
            "templateType": ""
        };
        const response = await api.post(`Comm/GetCampaignTemplate`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["template"],
                value: data[index]["templateId"],
            });
        }
        setTemplateOpation(arr);
    };


    const formik = useFormik({
        initialValues: {

            "campaignId": location.state.campaignId,
            "campaignName": location.state.campaignName,
            "campaignDate": moment(location.state.campaignDate).format("YYYY-MM-DD"),
            "campaignType": location.state.campaignType,
            "tamplateId": location.state.tamplateId,
            "message": location.state.message,
            "status": location.state.status,
            "fromDate": moment(location.state.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(location.state.toDate).format("YYYY-MM-DD"),
            "toTime": location.state.toTime,


            "createdBy": "adminvm",
            "updatedBy": "adminvm",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            listGroups: location.state?.listGroups || [],
            listMembers: location.state?.listMembers || [],
            "srno": 0,
            "isExecute": true


        },
        onSubmit: async (values) => {

            values.toTime = toTime.toString();


            const response = await api.post(
                `Comm/UpsertCampaign`, values
                // { ...values, indentinv: validTableData }
            );
            console.log("to time", values)
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/emailsystem/Smscampagian");
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
                                {t("text.EditSmscampagian")}
                            </Typography>
                        </Grid>

                        <Grid item lg={3} md={3} xs={3} marginTop={3}>
                            <select
                                className="language-dropdown"
                                value={lang}
                                onChange={(e) => setLang(e.target.value as Language)}
                            >
                                {Languages.map((l) => (
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
                                    id="campaignName"
                                    name="campaignName"
                                    label={
                                        <CustomLabel text={t("text.Emailcampaigname")} required={false} />
                                    }
                                    value={formik.values.campaignName}
                                    placeholder={t("text.Emailcampaigname")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={<CustomLabel text={t("text.Emailcampgiandate")} required={false} />}
                                    value={formik.values.campaignDate}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="campaignDate"
                                    id="campaignDate"
                                    type="date"
                                    placeholder={t("text.Emailcampgiandate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={unitOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("status", newValue?.value.toString());
                                    }}
                                    value={formik.values.status}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectStatus")} required={false} />}
                                        />
                                    )}
                                />
                            </Grid>



                            <Grid item lg={4} xs={12}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.Emailfromdate")}
                                            required={false}
                                        />
                                    }
                                    value={formik.values.fromDate}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="fromDate"
                                    id="fromDate"
                                    type="date"
                                    disabled={formik.values.status !== "Scheduled"}
                                    placeholder={t("text.Emailfromdate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.EmailtoDate")}
                                            required={false}
                                        />
                                    }
                                    value={formik.values.toDate}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="toDate"
                                    id="toDate"
                                    type="date"
                                    disabled={formik.values.status !== "Scheduled"} // Enable only in "Scheduled" status
                                    placeholder={t("text.EmailtoDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>


                            {formik.values.status !== "Scheduled" && ( // Hide in "Scheduled" status

                                <Grid item lg={4} xs={12}>
                                    <TextField
                                        label={
                                            <CustomLabel
                                                text={t("text.toTime")}
                                                required={false}
                                            />
                                        }
                                        value={formik.values.toTime}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        name="toTime"
                                        id="toTime"
                                        type="time"
                                        // value={toTime}
                                        onChange={(e) => {


                                            setToTime(e.target.value);
                                            // formik.setFieldValue("toTime", e.target.value); 
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>


                            )}
                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={templateOption}
                                    value={
                                        templateOption.find(
                                            (option) =>
                                                option.value ===
                                                formik.values.tamplateId
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("tamplateId", newValue?.value.toString());
                                        formik.setFieldValue("template", newValue?.label);
                                    }}
                                    // value={formik.values.tamplateId}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.Template")} required={false} />}
                                        />
                                    )}
                                />
                            </Grid>



                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disableCloseOnSelect
                                    multiple
                                    id="combo-box-demo"
                                    options={groupOption}
                                    getOptionLabel={(option: any) => option.label}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        const groupID = newValue.map((item: any) => ({
                                            id: 0,
                                            campaignId: 0,
                                            groupId: item.value,
                                            memberId: 0,
                                            message: "",
                                            emailId: "",
                                            mobileNo: "",
                                            receiverType: "",
                                            name: "",
                                            isSelected: true,
                                        }));
                                        console.log("🚀 ~ groupID:", groupID);

                                        formik.setFieldValue("listGroups", groupID);
                                    }}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                checked={selected}
                                                style={{ marginRight: 8 }}
                                            />
                                            {option.label}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.listGroups")} />}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disableCloseOnSelect
                                    multiple
                                    options={empOption}
                                    getOptionLabel={(option) => option.label} // Display the label
                                    fullWidth
                                    size="small"
                                    //  value={formik.values.listMembers || []}
                                    onChange={handleChange}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props} style={{ display: "flex", alignItems: "center" }}>
                                            <Checkbox
                                                checked={selected}
                                                style={{ marginRight: 8 }}
                                            />
                                            <span>{option.label}</span> {/* Ensure the label is displayed */}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.listMembers")} />}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} xs={12} marginTop={2}>
                                <ReactQuill
                                    id="message"
                                    theme="snow"
                                    value={formik.values.message}
                                    onChange={(content) => formik.setFieldValue("message", content)}
                                    onBlur={() => formik.setFieldTouched("message", true)}
                                    modules={modules}
                                    formats={formats}
                                    //  style={{ backgroundColor: "white", minHeight: "200px" }} 
                                    placeholder="Enter your message here"
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
const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video", "formula"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "formula",
    "code-block",
];

export default EditSmscampagian;