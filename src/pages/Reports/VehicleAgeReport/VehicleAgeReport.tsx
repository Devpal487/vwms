import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Grid,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  Autocomplete,
  ListItemText,
} from "@mui/material";
import Logo from "../../../assets/images/KanpurLogo.png";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import CustomLabel from "../../../CustomLable";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function VehicleAgeReport() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [CatOption, setCatOption] = useState([
    { value: "-1", label: "Select Category" },
  ]);

  const [itemCat, setItemCat] = useState("");

  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const [EmpOption, setEmpOption] = useState([{ value: -1, label: "Select Employee" }]);
  const [vNO, setVno] = useState("");

  const [IsEmp, setEmployee] = useState("");

  const [selDay, setDay] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat((event.target as HTMLInputElement).value);
  };
  const formik = useFormik({
    initialValues: {

      fromDate: "",
      toDate: "",
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,

      Category: "",
      Employee: "",
      PurchaseYearTo: "",
      PurchaseYearFrom: "",
    },
    onSubmit: async (values) => {
      //   const response = await api.post(
      //     `Gender/AddUpdateGenderMaster`,
      //     values
      //   );
      //   try {
      //     setToaster(false);
      //     toast.success(response.data.mesg);
      //     navigate("/master/GenderMaster");
      //   } catch (error) {
      //     setToaster(true);
      //     toast.error(response.data.mesg);
      //   }
    },
  });

  const handleDownload = async () => {
    const collectData = {
     "vehicleNo": vNO,
        "empName": IsEmp,
        "itemCategory": itemCat,
        "purchaseYearfrom": parseInt(formik.values.PurchaseYearFrom),
        "purchaseYearTo": parseInt(formik.values.PurchaseYearTo),
      show: false,
      exportOption: selectedFormat, // .pdf, .xls, or TabularExc
    };
  
    try {
      const response = await api.post(`Report/GetVehicleAgeApi`, collectData);
  
      if (response.data.status === "Success" && response.data.base64) {
        const base64String = response.data.base64;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
  
        let fileType = "";
        let fileName = response.data.fileName || "Report";
  
        if (selectedFormat === ".pdf") {
          fileType = "application/pdf";
          fileName += ".pdf";
        } else if (selectedFormat === ".xls") {
          fileType = "application/vnd.ms-excel";
          fileName += ".xls";
        } else if (selectedFormat === "TabularExc") {
          fileType = "application/vnd.ms-excel";
          fileName += ".xls";
        }
  
        const blob = new Blob([byteArray], { type: fileType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } else {
        console.error("Error: No valid data received.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getCategory();

    getEmp();
    getVehicleNo();
  }, []);



  const getVehicleNo = () => {

    api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.vehicleNo,
        value: item.itemMasterId,
      }));
      setVnoOption(arr);
    });
  };

  const getEmp = () => {
    const collectData = {
      "empid": -1,
      "userId": ""
    }

    api.post(`Employee/GetEmployee`, collectData).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.empName,
        value: item.empid,
      }));
      setEmpOption(arr);
    });
  };

  const getCategory = () => {
    const collectData = {
      "itemCategoryId": -1,

    }

    api.post(`ItemCategory/GetItemCategory`, collectData).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.itemCategory,
        value: item.itemCategoryId,
      }));
      setCatOption(arr);
    });
  };



  const fetchZonesData = async () => {
    try {
      const collectData = {
        "vehicleNo": vNO,
        "empName": IsEmp,
        "itemCategory": itemCat,
        "purchaseYearfrom": parseInt(formik.values.PurchaseYearFrom),
        "purchaseYearTo": parseInt(formik.values.PurchaseYearTo),
        show: true, 
        exportOption: "selectedFormat", 
      };
      const response = await api.post(
        `Report/GetVehicleAgeApi`,
        collectData
      );
      const data = response?.data;

      const Print = data.map((item: any, index: any) => ({
        ...item,
      }));
      setPrint(Print);
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: index + 1,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          // {
          //   field: "serialNo",
          //   headerName: t("text.SrNo"),
          //   flex: 0.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "itemCode",
            headerName: t("text.itemCode"),
            flex: 1.3,
            cellClassName: "wrap-text", // Added here
            headerClassName: "MuiDataGrid-colCell",
            // renderCell: (params) => {
            //   return moment(params.row.trackDate).format("DD-MM-YYYY");
            // },
          },
          {
            field: "itemName",
            headerName: t("text.itemName"),
            flex: 1.2,
             headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "vehicleNo",
            headerName: t("text.vehicleNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "purchaseYear",
            headerName: t("text.purchaseYear"),
            flex: 1.3,
              headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemType",
            headerName: t("text.itemType"),
            flex: 1,
           headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          // {
          //   field: "itemCategory",
          //   headerName: t("text.itemCategory"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   align: 'right',
          //   headerAlign: 'right',
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "empName",
            headerName: t("text.empName"),
            flex: 1.5,
             headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          // {
          //   field: "empMobileNo",
          //   headerName: t("text.empMobileNo"),
          //   flex: 1.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "age",
            headerName: t("text.age"),
            flex: 1.5,
             headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },

        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // setLoading(false);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));


  const styles = `
  .wrap-text {
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
`;

  document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);



  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          // border: ".5px solid #FF7722 ",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            "& .MuiDataGrid-colCell": {
              backgroundColor: `var(--grid-headerBackground)`,
              color: `var(--grid-headerColor)`,
              fontSize: 12,
              fontWeight: 700,
            },
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "15px" }}
            align="left"
          >
            {t("text.VehicleAgeReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >
            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={VnoOption}
                value={vNO}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {

                  setVno(newValue?.label);
                }}

                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.VehicleNos1")}
                        required={false}
                      />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>


            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.PurchaseYearFrom")} />}
                value={formik.values.PurchaseYearFrom}
                name="PurchaseYearFrom"
                id="PurchaseYearFrom"
                placeholder={t("text.PurchaseYearFrom")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>


            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.PurchaseYearTo")} />}
                value={formik.values.PurchaseYearTo}
                name="PurchaseYearTo"
                id="PurchaseYearTo"
                placeholder={t("text.PurchaseYearTo")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={EmpOption}
                value={IsEmp}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {

                  setEmployee(newValue?.label);
                }}

                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.selectemployee")}
                        required={false}
                      />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>

            {/* To Date Input */}
            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={CatOption}
                value={itemCat}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {

                  setItemCat(newValue?.label);
                }}

                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.SelectCategory")}
                        required={false}
                      />
                    }
                  />
                )}
              //popupIcon={null}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={selectedFormat}
                            onChange={handleFormatChange}
                          >
                            <FormControlLabel
                              value=".pdf"
                              control={<Radio />}
                              label={t("text.pdf")}
                            />
                            <FormControlLabel
                              value=".xls"
                              control={<Radio />}
                              label={t("text.excel")}
                            />
                            <FormControlLabel
                              value="TabularExc"
                              control={<Radio />}
                              label={t("text.tabular")}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>



            <Grid xs={12} sm={4} md={4} item>
              <Button
                type="submit"
                fullWidth
                style={{
                  backgroundColor: `var(--header-background)`,
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={() => {
                  // const selectedPeriod = formik.values.fromDate
                  //   ? formik.values.fromDate
                  //   : formik.values.index;

                  // if (!selectedPeriod) {
                  //   alert("Please select a period. or custom date");
                  // } else {
                  fetchZonesData();
                  setVisible(true);
                  // }
                }}
                startIcon={<VisibilityIcon />}
              >
                {t("text.show")}
              </Button>
            </Grid>


            <Grid xs={12} sm={4} md={4} item>
              <Button
                type="button"
                fullWidth
                style={{
                  backgroundColor: `#f44336`,
                  color: "white",
                  marginTop: "10px",
                }}
                startIcon={<RefreshIcon />}
                onClick={() => {
                  formik.resetForm();
                  setVisible(false);
                  setVno("");
                  setEmployee("");
                  setItemCat("");
                }}
              >
                {t("text.reset")}
              </Button>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Button
                type="button"
                fullWidth
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  marginTop: "10px",
                }}
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                {t("text.download")}
              </Button>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            container
            spacing={2}
            sx={{ marginTop: "3%", justifyContent: "center" }}
          >
            {visible && (
              <Grid item xs={12} sm={12} lg={12}>
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <DataGrid
                    rows={zones}
                    columns={adjustedColumns}
                    rowSpacingType="border"
                    autoHeight
                    // slots={{
                    //   toolbar: GridToolbar,
                    // }}
                    pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                      value: size,
                      label: `${size}`,
                    }))}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    sx={{
                      border: 0,
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#42b6f5", // Header background color
                        color: "white", // Header text color
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "white", // Header title text color
                      },
                      "& .MuiDataGrid-cell": {
                        whiteSpace: "normal", // Ensure text wraps inside the cell
                        wordWrap: "break-word", // Break words to avoid overflow
                        overflowWrap: "break-word", // Ensure long words wrap correctly
                      },
                    }}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
