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

  const [selectedFormat, setSelectedFormat] = useState<any>("pdf");

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

  const downloadTabularExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Tabular HTML.");
      return;
    }

    // Prepare headers and rows for HTML table
    // const headers = [
    //   "Date",
    //   "Vehicle No",
    //   "Driver",
    //   "Mobile No",
    //   "Department",
    //   "Distance(KM)",
    //   "Running",
    //   "Idle",
    //   "Start Time",
    //   "End Time",
    //   "Fuel Consumption",
    // ];

    
    const headers = ["Item Code", "Vehicle No.", "Purchase Year", "Employee Name", "Age"];
    const rows = isPrint.map((item: any) => [
      // moment(item?.trackDate).format("DD-MM-YYYY") || "", // Vehicle No (formatted date)
      // item?.vehicleNo || "", // Vehicle Type
      // item?.driverName || "", // Driver
      // item?.mobileNo, // Driver Mobile No
      // item?.department,
      // item?.distanceKM,
      // item?.running,
      // item?.idle,
      // item?.startTime,
      // item?.endTime,
      // item?.fuelConsumption,

      item?.itemCode || "",
      item?.vehicleNo || "", // Vehicle No
      item?.purchaseYear || "", // Driver
      item?.empName || "", // Mobile No
      item?.age || "",
    ]);

    // Create HTML table
    let html = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
        )
        .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a Blob from the HTML string and trigger the download
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Vehicle_data_tabular.html";
    link.click();
  };

  const downloadExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Excel.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(isPrint);

    const headers = Object.keys(isPrint[0]);

    headers.forEach((header, index) => {
      const cellAddress = `${String.fromCharCode(65 + index)}1`;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vehicles");

    XLSX.writeFile(wb, "Vehicle_data.xlsx");
  };

  // Function to download PDF
  const downloadPDF = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to PDF.");
      return;
    }

    // Initialize jsPDF with 'landscape' orientation
    const doc = new jsPDF("landscape"); // This sets the page orientation to landscape
    let yPosition = 10;
    const headerFontSize = 14;
    const bodyFontSize = 12;

    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Data", 14, yPosition);
    yPosition += 10;

    const headers = ["Item Code", "Vehicle No.", "Purchase Year", "Employee Name", "Age"];

    const columnWidths = [50, 50, 50, 100, 50];

    const headerHeight = 8;
    const headerY = yPosition;
    doc.setFillColor(200, 220, 255);
    doc.rect(
      14,
      headerY,
      columnWidths.reduce((a, b) => a + b, 0),
      headerHeight,
      "F"
    );

    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      doc.text(
        header,
        14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        yPosition + headerHeight - 2
      );
    });

    const headerBottomMargin = 6;
    yPosition += headerHeight + headerBottomMargin;

    // Add table rows
    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");

    isPrint.forEach((item: any, rowIndex) => {
      const row = [
        item?.itemCode || "",
        item?.vehicleNo || "", // Vehicle No
        item?.purchaseYear || "", // Driver
        item?.empName || "", // Mobile No
        item?.age || "",
      ];

      row.forEach((cell, colIndex) => {
        const xOffset =
          14 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        if (cell) {
          doc.text(cell.toString(), xOffset, yPosition);
        }
      });
      yPosition += 10;

      if (yPosition > 180) {
        // Adjust this to your content size for landscape
        doc.addPage();
        yPosition = 10; // Reset position on new page
      }
    });

    // Save the generated PDF with a filename
    doc.save("VehicleTrack_data.pdf");
  };
  // Handle Download Button Click
  const handleDownload = () => {
    if (selectedFormat === "excel") {
      downloadExcel();
    } else if (selectedFormat === "pdf") {
      downloadPDF();
    } else if (selectedFormat === "tabular") {
      downloadTabularExcel();
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
        "itemCategory":itemCat,
        "purchaseYearfrom": parseInt(formik.values.PurchaseYearFrom),
        "purchaseYearTo": parseInt(formik.values.PurchaseYearTo)
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
            // renderCell: (params) => {
            //   return moment(params.row.trackDate).format("DD-MM-YYYY");
            // },
          },
          {
            field: "itemName",
            headerName: t("text.itemName"),
            flex: 1.2,
           // headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "vehicleNo",
            headerName: t("text.vehicleNo"),
            flex: 1,
           // headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "purchaseYear",
            headerName: t("text.purchaseYear"),
            flex: 1.3,
          //  headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemType",
            headerName: t("text.itemType"),
            flex: 1,
          //  headerClassName: "MuiDataGrid-colCell",
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
           // headerClassName: "MuiDataGrid-colCell",
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
           // headerClassName: "MuiDataGrid-colCell",
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
              fontSize: 17,
              fontWeight: 900,
            },
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.VehicleAgeReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} sx={{ marginTop: "3vh" }}>
            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={VnoOption}
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
                        text={t("text.Category")}
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
                    value="pdf"
                    control={<Radio />}
                    label="PDF"
                  />
                  <FormControlLabel
                    value="excel"
                    control={<Radio />}
                    label="Excel"
                  />
                  <FormControlLabel
                    value="tabular"
                    control={<Radio />}
                    label="Tabular Excel"
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
                Show
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
                }}
              >
                Reset
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
                Download
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
