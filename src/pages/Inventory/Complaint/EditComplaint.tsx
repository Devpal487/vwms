
import { Button, Modal, Box, CardContent, Autocomplete, Divider, Grid, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomLabel from '../../../CustomLable'
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
//import { Props } from 'react-apexcharts';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import ToastApp from '../../../ToastApp';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../../utils/Url';
import { getISTDate } from "../../../utils/Constant";
import nopdf from '../../../assets/images/imagepreview.jpg'
import dayjs from 'dayjs';
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

const EditComplaint = (props: Props) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [itemData, setItemData] = useState([{ value: "-1", label: t("text.SelectItemId") }]);
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();
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
      compId: location.state.compId,
      itemID: location.state.itemID,
      complaintNo: location.state.complaintNo,
      complaintDate: location.state.complaintDate ? dayjs(location.state.complaintDate).format("YYYY-MM-DD") : "",
      complaintType: location.state.complaintType,
      complaintDoc: location.state.complaintDoc,
      empId: location.state.empId,
      approveEmp4: location.state.approveEmp4,
      approveEmp3: location.state.approveEmp3,
      approveEmp2: location.state.approveEmp2,
      approveEmp1: location.state.approveEmp1,
      complaint: location.state.complaint,
      createdBy: defaultValues,
      updatedBy: defaultValues,
      status: location.state.status,
      currentReading: location.state.currentReading,
      createdOn: defaultValues,
      updatedOn: defaultValues,
      compAppdt: location.state.compAppdt ? dayjs(location.state.compAppdt).format("YYYY-MM-DD") : "",
      item: location.state.item,
      employee: location.state.employee,
      departmentmaster: location.state.departmentmaster,
      departmentName: location.state.departmentName,
      designation: location.state.designation,
      designationName: location.state.designationName,
      empStateName: location.state.empStateName,
      state: location.state.state,
      empCountryName: location.state.empCountryName,
      country: location.state.country,
      empCityName: location.state.empCityName,
      city: location.state.city,
      approveEmployee1: location.state.approveEmployee1,
      approveEmployee2: location.state.approveEmployee2,
      jobCardNo: location.state.jobCardNo,
      srno: location.state.srno,
      file: location.state.file,
      fileOldName: location.state.fileOldName,
      totaldays: location.state.totaldays,
      outDate: defaultValues,
      outId: location.state.outId,
      vehicleNo: location.state.vehicleNo,
      update: location.state.update || false,
      wardid: location.state.wardid,
      zoneid: location.state.zoneid,
      poleNo: location.state.poleNo,
      poleId: location.state.poleId,
      compTypeName: location.state.compTypeName,
      compTypeId: location.state.compTypeId,
      "zoneName": location.state.zoneName,
      "wardName": location.state.wardName,
      "empName": location.state.empName,


    },
    //defaultValues
    onSubmit: async (values) => {
      const response = await api.post(
        `ComplaintItem/AddUpdateComplaintItem`,
        values
      );

      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/DepartmentMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });


  // const [itemOption, setitemOption] = useState([
  //   { value: "-1", label: t("text.itemMasterId"), details: "" },
  // ]);
  // const [empOption, setempOption] = useState<any>([]);

  // const [docOpen, setDocOpen] = useState(false);

  useEffect(() => {
    // getstoreData();
    // GetUnitData();
    getZoneData();

    getWardData();
    GetitemData();
    GetempData();
    GetComplaintData();
    // GetMaxComplainNo();
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
  //   const GetMaxComplainNo = async () => {

  //     const response = await api.get(`ComplaintItem/GetMaxComplainNo`);
  //     const data = response.data.data;

  //     for (let index = 0; index < data.length; index++) {
  //         formik.setFieldValue("complaintNo", data[index]['complaintNo'])
  //     }
  //     //setmaxindentOption(arr);
  // };
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
            {t("text.EditComplaint")}
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

              <Grid item lg={4} xs={12}>
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
                      label={<CustomLabel text={t("text.SelectpoleNo")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemID", newValue?.value);
                  }}
                  value={
                    itemOption.find(
                      (opt: any) => opt.value === formik.values.itemID
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.itemIDs")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                  <TextField
                    id="complaintType"
                    name="complaintType"
                    label={<CustomLabel text={t("text.complaintTypes")} required={false} />}
                    value={formik.values.complaintType}
                    placeholder={t("text.complaintTypes")}
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
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                  }}
                  value={
                    empOption.find(
                      (opt: any) => opt.value === formik.values.empId
                    ) || null
                  }
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
                  value={
                    empOption.find(
                      (opt: any) => opt.value === formik.values.approveEmp1
                    ) || null
                  }
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
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect2}
                  value={
                    empOption.find(
                      (opt: any) => opt.value === formik.values.approveEmp2
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.approveEmployee2")} />}
                    />
                  )}
                />
              </Grid>

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

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect3}
                  value={
                    empOption.find(
                      (opt: any) => opt.value === formik.values.approveEmp3
                    ) || null
                  }
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


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={handleEmployeeSelect4}
                  value={
                    empOption.find(
                      (opt: any) => opt.value === formik.values.approveEmp4
                    ) || null
                  }
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
                  value={
                    complaintOptions.find((opt: any) => opt.value == formik.values.compTypeId) || null
                  }
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
                    onChange={(e) => otherDocChangeHandler(e, "complaintDoc")}
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
                        src={`data:image/jpg;base64,${formik.values.complaintDoc}`}
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
                      onClick={() => modalOpenHandle1("complaintDoc")}
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
                    {t("text.update")}
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
export default EditComplaint;