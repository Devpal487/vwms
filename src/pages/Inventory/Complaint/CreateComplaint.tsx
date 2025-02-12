
import { Button, Modal, Box, CardContent, Autocomplete, Divider, Grid, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomLabel from '../../../CustomLable'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
//import { Props } from 'react-apexcharts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import ToastApp from '../../../ToastApp';
import api from '../../../utils/Url';
import { getISTDate } from "../../../utils/Constant";
import nopdf from '../../../assets/images/imagepreview.jpg'
import * as Yup from "yup";
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

const CreateComplaint = (props: Props) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [itemData, setItemData] = useState([{ value: "-1", label: t("text.SelectItemId") }]);
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [Img, setImg] = useState("");
  const [approveEmp1, setApproveEmp1] = useState<any>('');
  const [approveEmp2, setApproveEmp2] = useState<any>('');
  const [approveEmp3, setApproveEmp3] = useState<any>('');
  const [approveEmp4, setApproveEmp4] = useState<any>('');
  console.log("check value", approveEmp1);
  console.log("check value", approveEmp2);
  console.log("check value", approveEmp3);
  console.log("check value", approveEmp4);
  const [editorContent, setEditorContent] = useState<string>("");
  const handleEditorChange = (content: any) => {
    setEditorContent(content);
  };

  const [zoneOption, setzoneOption] = useState([
    { value: -1, label: t("text.id") },
  ]);

  const [wardOption, setwardOption] = useState([
    { value: -1, label: t("text.id") },
  ]);

  // const [itemOption, setitemOption] = useState([
  //   { value: "-1", label: t("text.itemMasterId"), details: "" },
  // ]);
  const [itemOption, setitemOption] = useState([
    { value: "-1", label: t("text.itemID") },
  ]);


  const [poleOption, setpoleOption] = useState([
    { value: "-1", label: t("text.poleInstChildId") },
  ]);

  const [empOption, setempOption] = useState<any>([]);
  const [complaintOptions, setComplaintOptions] = useState<any>([]);

  const [docOpen, setDocOpen] = useState(false);
  const [MaxComplainNoOption, setMaxComplainNoOption] = useState([
    { value: "-1", label: t("text.compId") },
  ]);
  const formik: any = useFormik({
    initialValues: {

      //   "compId": -1,
      //   "itemID": '',
      //   "complaintType": "",
      //   "complaintDoc": "",
      //   "empId": '',
      //   "zoneid": 0,
      //   "wardid": 0,
      //   "compainStatus": true,
      //   "approveEmp4": 0,
      //   "approveEmp3": 0,
      //   "approveEmp2": 0,
      //   "approveEmp1": 0,
      //   "complaint": "",
      //   "complaintNo": "",
      //   "createdBy": "",
      //   "updatedBy": "",
      //   "status": "",
      //   "currentReading": 0,
      //   "createdOn": defaultValues,
      //   "complaintDate":defaultValues ,
      //   "updatedOn": defaultValues,
      //   "compAppdt": defaultValues,
      //   "compTypeId": 0,
      //   "compTypeName": "",
      //   "jobCardNo": "",
      //   "zoneName": "",
      //   "wardName": "",
      //  "empName": "",
      //   "item": {},

      //   "employee": {},

      //   "approveEmployee1": {},

      //   "approveEmployee2": {},

      //   "srno": 0,
      //   "file": "",
      //   "fileOldName": "",
      //   "totaldays": 0,
      //   "outDate":defaultValues ,
      //   "outId": 0,
      //   "vehicleNo": "",
      //   "update": true


      "compId": 0,
      "itemID": null,
      "complaintType": "",
      "complaintDoc": "",
      "empId": '',
      "zoneid": 0,
      "wardid": 0,
      poleId: null,
      poleNo: "",
      "compainStatus": true,
      "approveEmp4": 0,
      "approveEmp3": 0,
      "approveEmp2": 0,
      "approveEmp1": 0,
      "complaint": "",
      "complaintNo": "",
      "createdBy": "",
      "updatedBy": "",
      "status": "",
      "currentReading": 0,
      "createdOn": defaultValues,
      "complaintDate": defaultValues,
      "updatedOn": defaultValues,
      "compAppdt": defaultValues,
      "compTypeId": 0,
      "compTypeName": "",
      "employee": {},

      "approveEmployee1": {},

      "approveEmployee2": {},

      "jobCardNo": "",
      "zoneName": "",
      "wardName": "",
      "empName": "",
      "srno": 0,
      "file": "",
      "fileOldName": "",
      "totaldays": 0,
      "outDate": defaultValues,
      "outId": 0,
      "vehicleNo": "",
      "update": true

    },

    validationSchema: Yup.object({
      poleId: Yup.string()
        .required(t("text.reqPollNum")),
      itemID: Yup.string().required(t("text.reqItemName")),

    }),

    //defaultValues
    onSubmit: async (values) => {
      const response = await api.post(
        `ComplaintItem/AddUpdateComplaintItem`,
        values
      );

      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/Inventory/ComplaintMaster");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });



  useEffect(() => {
    // getstoreData();
    // GetUnitData();
    getZoneData();
    getWardData();
    GetitemData();
    GetempData();
    GetComplaintData();
    GetMaxComplainNo();
    getPoleData();



  }, []);


  const getZoneData = async () => {
    const collectData = { zoneID: -1, user_ID: "" };
    const response = await api.post(`Zone/GetZonemaster`, collectData);
    const data = response.data.data;
    const arr = data.map((zone: any) => ({
      label: zone.zoneName,
      value: zone.zoneID,
    }));
    setzoneOption(arr);
  };

  const getPoleData = async (wardId = -1) => {
    const collectData = {
      poleInstId: -1,
      zoneId: -1,
      wardId: wardId,
    };
    const response = await api.post(`PoleInstallation/GetPoleNoZoneWardWise`, collectData);
    const data = response.data.data;
    const arr = data.map((pole: any) => ({
      label: pole.poleno,
      value: pole.poleInstChildId,
    }));
    setpoleOption(arr);
  };

  const getWardData = async (zoneId = -1) => {
    const collectData = { areaID: zoneId };
    const response = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
    const data = response.data.data;
    const arr = data.map((ward: any) => ({
      label: ward.areaName,
      value: ward.areaID,
    }));
    setwardOption(arr);
  };


  //   const getzoneData = async () => {
  //     const collectData = {
  //         "zoneID": -1,
  //         "user_ID": ""
  //     };
  //     const response = await api.post(`Zone/GetZonemaster`, collectData);
  //     const data = response.data.data;
  //     const arr = [];
  //     for (let index = 0; index < data.length; index++) {
  //         arr.push({
  //             label: data[index]["zoneName"],
  //             value: data[index]["zoneID"],
  //         });
  //     }
  //     setzoneOption(arr);
  // };

  // const getpoleData = async () => {
  //   const collectData = {
  //    "poleInstId": -1,
  //   "zoneId": -1,
  //   "wardId": -1
  //   };
  //   const response = await api.post(`PoleInstallation/GetPoleNoZoneWardWise`, collectData);
  //   const data = response.data.data;
  //   const arr = [];
  //   for (let index = 0; index < data.length; index++) {
  //       arr.push({
  //           label: data[index]["poleno"],
  //           value: data[index]["poleInstId"],
  //       });
  //   }
  //   setpoleOption(arr);
  // };
  // const getWardData = async () => {
  //     const collectData = {
  //         "areaID": -1
  //     };
  //     const response = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
  //     const data = response.data.data;
  //     const arr = [];
  //     for (let index = 0; index < data.length; index++) {
  //         arr.push({
  //             label: data[index]["areaName"],
  //             value: data[index]["areaID"],
  //         });
  //     }
  //     setwardOption(arr);
  // };
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
        value: data[index]["itemMasterId"]
      });
    }
    setitemOption(arr);
  };

  const GetComplaintData = async () => {
    const collectData = {
      compTypeId: -1,
    };
    const response = await api.post(`ComplainType/GetComplainType`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["compTypeName"],
        value: data[index]["compTypeId"],
        details: data,
      });
    }
    setComplaintOptions(arr);
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
    setempOption([{ value: "-1", label: t("text.empid"), details: "" }, ...arr]);
  };

  const GetMaxComplainNo = async () => {

    const response = await api.get(`ComplaintItem/GetMaxComplainNo`);
    const data = response.data.data;

    for (let index = 0; index < data.length; index++) {
      formik.setFieldValue("complaintNo", data[index]['complaintNo'])
    }
    //setmaxindentOption(arr);
  };


  const handlePanClose1 = () => {
    setDocOpen(false);
  };

  const modalOpenHandle1 = (event: string) => {
    setDocOpen(true);
    const base64Prefix = "data:image/jpg;base64,";

    let imageData = '';
    switch (event) {
      case "complaintDoc":
        imageData = formik.values.complaintDoc;
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
      const base64Data = base64String.split(',')[1];
      formik.setFieldValue(params, base64Data);

      formik.setFieldValue('complaintDoc', fileExtension);



      console.log(`File '${file.name}' loaded as base64 string`);
      console.log("base64Data", base64Data);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };


  const back = useNavigate();

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


  const handleEmployeeSelect2 = (event: any, newValue: any) => {
    console.log(newValue);
    if (newValue && newValue.value !== "-1") {
      formik.setFieldValue("approveEmp2", newValue.value);

      const selectedDetail = newValue.details.find((detail: any) => {
        return detail.empid === newValue.value;
      });

      if (selectedDetail) {
        formik.setFieldValue("approveEmployee2", selectedDetail);
        setApproveEmp2(selectedDetail);
      } else {
        console.log("No matching detail found for approveEmp2");
      }
    } else {
      formik.setFieldValue("approveEmployee2", '');
      setApproveEmp2('');
    }
  };

  const handleEmployeeSelect3 = (event: any, newValue: any) => {
    console.log(newValue);
    if (newValue && newValue.value !== "-1") {
      formik.setFieldValue("approveEmp3", newValue.value);

      const selectedDetail = newValue.details.find((detail: any) => {
        return detail.empid === newValue.value;
      });

      if (selectedDetail) {
        formik.setFieldValue("approveEmployee3", selectedDetail);
        setApproveEmp3(selectedDetail);
      } else {
        console.log("No matching detail found for approveEmp3");
      }
    } else {
      formik.setFieldValue("approveEmployee3", '');
      setApproveEmp3('');
    }
  };

  const handleEmployeeSelect4 = (event: any, newValue: any) => {
    console.log(newValue);
    if (newValue && newValue.value !== "-1") {
      formik.setFieldValue("approveEmp4", newValue.value);

      const selectedDetail = newValue.details.find((detail: any) => {
        return detail.empid === newValue.value;
      });

      if (selectedDetail) {
        formik.setFieldValue("approveEmployee4", selectedDetail);
        setApproveEmp4(selectedDetail);
      } else {
        console.log("No matching detail found for approveEmp4");
      }
    } else {
      formik.setFieldValue("approveEmployee4", '');
      setApproveEmp4('');
    }
  };

  // const handleEmployeeSelect = (event: any, newValue: any) => {
  //   console.log(newValue);
  //   if (newValue && newValue.value !== "-1") {

  //     formik.setFieldValue("approveEmployee2", newValue.value);

  //     const selectedDetail = newValue.details.find((detail:any) => {
  //       console.log("Checking detail:", detail); 
  //       return detail.empid === newValue.value; 
  //     });

  //     if (selectedDetail) {
  //       console.log("Matching Detail:", selectedDetail);
  //       formik.setFieldValue("approveEmployee2", selectedDetail);
  //       setApproveEmp2(selectedDetail);  
  //     } else {
  //       console.log("No matching detail found");
  //     }
  //   } else {
  //     formik.setFieldValue("approveEmployee2", '');
  //     setApproveEmp2('');
  //   }
  // };

  // const handleEmployeeSelect3 = (event: any, newValue: any) => {
  //   console.log(newValue);
  //   if (newValue && newValue.value !== "-1") {

  //     formik.setFieldValue("approveEmployee3", newValue.value);

  //     const selectedDetail = newValue.details.find((detail:any) => {
  //       console.log("Checking detail:", detail); 
  //       return detail.empid === newValue.value; 
  //     });

  //     if (selectedDetail) {
  //       console.log("Matching Detail:", selectedDetail);
  //       formik.setFieldValue("approveEmployee3", selectedDetail);
  //       setApproveEmp3(selectedDetail);  
  //     } else {
  //       console.log("No matching detail found");
  //     }
  //   } else {
  //     formik.setFieldValue("approveEmployee3", '');
  //     setApproveEmp3('');
  //   }
  // };
  // const handleEmployeeSelect4 = (event: any, newValue: any) => {
  //   console.log(newValue);
  //   if (newValue && newValue.value !== "-1") {

  //     formik.setFieldValue("approveEmployee4", newValue.value);

  //     const selectedDetail = newValue.details.find((detail:any) => {
  //       console.log("Checking detail:", detail); 
  //       return detail.empid === newValue.value; 
  //     });

  //     if (selectedDetail) {
  //       console.log("Matching Detail:", selectedDetail);
  //       formik.setFieldValue("approveEmployee4", selectedDetail);
  //       setApproveEmp4(selectedDetail);  
  //     } else {
  //       console.log("No matching detail found");
  //     }
  //   } else {
  //     formik.setFieldValue("approveEmployee3", '');
  //     setApproveEmp4('');
  //   }
  // };





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
            {t("text.CreateComplaint")}
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

              {/* <Grid item lg={4} xs={12}>
                <TextField
                  id="complaintNo"
                  name="complaintNo"
                  label={<CustomLabel text={t("text.complaintNos")} required={false} />}
                  value={formik.values.complaintNo}
                  placeholder={t("text.complaintNos")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="complaintNo"
                  name="complaintNo"
                  label={<CustomLabel text={t("text.complaintNos")} required={false} />}
                  value={formik.values.complaintNo}
                  //placeholder={t("text.AutoIndentForm")}
                  size="small"
                  fullWidth
                  InputLabelProps={{ "aria-readonly": true }}
                //onChange={formik.handleChange}
                //onBlur={formik.handleBlur}

                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="zone-dropdown"
                  options={zoneOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    const zoneId = newValue?.value || null;
                    formik.setFieldValue("zoneid", zoneId);
                    setwardOption([]); // Reset dependent dropdowns
                    setpoleOption([]);
                    if (zoneId) getWardData(zoneId);
                  }}
                  value={
                    zoneOption.find((opt) => opt.value === formik.values.zoneid) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.zoneId")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="ward-dropdown"
                  options={wardOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    const wardId = newValue?.value || null;
                    formik.setFieldValue("wardid", wardId);
                    setpoleOption([]); // Reset dependent dropdowns
                    if (wardId) getPoleData(wardId);
                  }}
                  value={
                    wardOption.find((opt) => opt.value === formik.values.wardid) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.wardId")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="pole-dropdown"
                  options={poleOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("poleNo", newValue?.label || null);
                    formik.setFieldValue("poleId", newValue?.value || null);
                  }}
                  value={
                    poleOption.find((opt) => opt.value === formik.values.poleId) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectpoleNo")} required={true} />}
                    />
                  )}
                />
                {formik.touched.poleId && formik.errors.poleId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.poleId}</div>
                )}

              </Grid>

              {/* 
              <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={zoneOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("zoneid", newValue?.value);
                                    }}
                                    value={
                                        zoneOption.find(
                                            (opt) => opt.value === formik.values.zoneid
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.zoneId")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={wardOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("wardid", newValue?.value);
                                    }}
                                    value={
                                        wardOption.find(
                                            (opt) => opt.value === formik.values.wardid
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.wardId")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={poleOption}
                                    // value={
                                    //   poleOption.find(
                                    //         (opt) => opt.value == formik.values.poleId
                                    //     ) || null
                                    // }
                                    fullWidth
                                    size="small" 
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                       formik.setFieldValue("poleNo", newValue?.label);
                                        formik.setFieldValue("poleNo", newValue?.value);
                                    }}
                                   
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectpoleNo")} />}
                                        />
                                    )}
                                />
                            </Grid> */}





              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemOption}
                  // value={
                  //   itemOption.find(
                  //         (opt) => opt.value === formik.values.itemID
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    //formik.setFieldValue("item", newValue?.label);
                    formik.setFieldValue("itemID", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.itemIDs")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.itemID && formik.errors.itemID && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemID}</div>
                )}

              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
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

              {/* <Grid item lg={4} xs={12}>
                <TextField
                  id="currentReading"
                  name="currentReading"
                  label={<CustomLabel text={t("text.currentReading")} required={false} />}
                  value={formik.values.currentReading}
                  placeholder={t("text.currentReading")}
                  size="small"

                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}

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
                      label={<CustomLabel text={t("text.approveEmp1")} />}
                    />
                  )}
                />
              </Grid>


              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.departmentName")} required={false} />}
                  value={approveEmp1?.departmentName || " "}
                  placeholder={t("text.departmentName")}
                  size="small"
                  fullWidth
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.designationName")} required={false} />}
                  value={approveEmp1?.designationName || '--'}
                  placeholder={t("text.designationName")}
                  size="small"
                  fullWidth
                  //onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="approveEmp2-select"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect2}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmployee2")} />}
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
                  onChange={handleEmployeeSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmployee2")} />}
                    />
                  )}
                />
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.departmentName")} required={false} />}
                  value={approveEmp2?.departmentName || " "}
                  placeholder={t("text.departmentName")}
                  size="small"
                  fullWidth
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.designationName")} required={false} />}
                  value={approveEmp2?.designationName || '--'}
                  placeholder={t("text.designationName")}
                  size="small"
                  fullWidth
                  //onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect3}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmployee3")} />}
                    />
                  )}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="approveEmp3-select"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect3}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmployee3")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.departmentName")} required={false} />}
                  value={approveEmp3?.departmentName || " "}
                  placeholder={t("text.departmentName")}
                  size="small"
                  fullWidth
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.designationName")} required={false} />}
                  value={approveEmp3?.designationName || '--'}
                  placeholder={t("text.designationName")}
                  size="small"
                  fullWidth
                  //onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect4}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmp4")} />}
                    />
                  )}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="approveEmp4-select"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect4}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmp4")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.departmentName")} required={false} />}
                  value={approveEmp4?.departmentName || " "}
                  placeholder={t("text.departmentName")}
                  size="small"
                  fullWidth
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.designationName")} required={false} />}
                  value={approveEmp4?.designationName || '--'}
                  placeholder={t("text.designationName")}
                  size="small"
                  fullWidth
                  //onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={complaintOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("compTypeName", newValue?.label);
                    formik.setFieldValue("compTypeId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.compType")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="complaintDate"
                  name="complaintDate"
                  label={
                    <CustomLabel
                      text={t("text.complaintDates")}
                      required={true}
                    />
                  }
                  type="date"
                  value={formik.values.complaintDate}
                  placeholder={t("text.complaintDates")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>



              {/* <Grid item lg={12} md={12} xs={12} marginTop={2}>

<ReactQuill
    id="complaint"
    theme="snow"
    value={editorContent}
    onChange={handleEditorChange}
    modules={modules}
    formats={formats}
/>
</Grid> */}

              <Grid item lg={12} md={12} xs={12} marginTop={2}>
                <ReactQuill
                  id="complaint"
                  theme="snow"
                  value={formik.values.complaint}
                  onChange={(content) => formik.setFieldValue("complaint", content)}
                  onBlur={() => formik.setFieldTouched("complaint", true)}
                  modules={modules}
                  formats={formats}
                  //  style={{ backgroundColor: "white", minHeight: "200px" }} 
                  placeholder="Enter your complaint here"
                />
              </Grid>

              <Grid item lg={3} md={6} xs={12}>
                <FormControlLabel
                  id="compainStatus"
                  name="compainStatus"
                  value={formik.values.compainStatus}
                  control={<Checkbox />} label={t("text.compainStatus")} />
              </Grid>




              {/* <Grid item lg={12} xs={12}>
                <TextField
                  id="complaint"
                  name="complaint"
                  label={<CustomLabel text={t("text.complaints")} required={false} />}
                  value={formik.values.complaint}
                  placeholder={t("text.complaints")}
                  size="small"

                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}
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
                    label={<CustomLabel text={t("text.complaintDoc")} />}
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
                    {formik.values.complaintDoc == "" ? (
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
                        src={`data:image/jpg;base64,${formik.values.file}`}
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

                <Modal open={docOpen} onClose={handlePanClose1}>
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
  )
}

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

export default CreateComplaint;