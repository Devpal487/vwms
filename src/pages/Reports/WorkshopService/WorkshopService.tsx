

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
import * as Yup from "yup";
import Logo from "../../../assets/images/KanpurLogo.png";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function VehicleItemConsumed() {
  const location = useLocation();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [option, setOption] = useState([
    { value: "-1", label: "Vehicle Type" },
  ]);

  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>("pdf");

  const [VendorOption, setVendorOption] = useState([
    { value: -1, label: "Select Vendor " },
  ]);


  const [ItemOption, setItemOps] = useState([
    { value: -1, label: "Select Item" },
  ]);
  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const { vehicleNo } = location.state || {};
  const [vNO, setVno] = useState("");
  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vend, setVendor] = useState("");

  const [isItem, setItem] = useState("");

  const [vType, setVType] = useState([]);

  const [selDay, setDay] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat((event.target as HTMLInputElement).value);
  };

  const downloadTabularExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Tabular HTML.");
      return;
    }
    const headers = ["vehicle No.", "Vehicle", "JobCard No.", "Items Consumed", "JobCard Date"];

    const rows = isPrint.map((item: any) => [

      item?.vehicleNo || "",
      item?.vehicle || "",
      item?.jobCardNo || "",
      item?.itemsConsumed || "",
      moment(item?.jobCardDate).format("DD-MM-YYYY")

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
  // const downloadPDF = () => {
  //   if (!isPrint || isPrint.length === 0) {
  //     console.error("No data to export to PDF.");
  //     return;
  //   }

  //   // Initialize jsPDF with 'landscape' orientation
  //   const doc = new jsPDF("landscape"); // This sets the page orientation to landscape
  //   let yPosition = 10;
  //   const headerFontSize = 14;
  //   const bodyFontSize = 12;

  //   doc.setFontSize(headerFontSize);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Vehicle Data", 14, yPosition);
  //   yPosition += 10;

  //   const headers = ["Vehicle No.", "Vehicle", "JobCard No.", "Items Consumed", "JobCard Date"];

  //   const columnWidths = [50, 50, 50, 50, 50];

  //   const headerHeight = 8;
  //   const headerY = yPosition;
  //   doc.setFillColor(200, 220, 255);
  //   doc.rect(
  //     14,
  //     headerY,
  //     columnWidths.reduce((a, b) => a + b, 0),
  //     headerHeight,
  //     "F"
  //   );

  //   doc.setFont("helvetica", "bold");
  //   headers.forEach((header, index) => {
  //     doc.text(
  //       header,
  //       14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
  //       yPosition + headerHeight - 2
  //     );
  //   });

  //   const headerBottomMargin = 6;
  //   yPosition += headerHeight + headerBottomMargin;

  //   // Add table rows
  //   doc.setFontSize(bodyFontSize);
  //   doc.setFont("helvetica", "normal");

  //   isPrint.forEach((item: any, rowIndex) => {
  //     const row = [
  //       item?.vehicleNo || "",
  //       item?.vehicle || "",
  //       item?.jobCardNo || "",
  //       item?.itemsConsumed || "",
  //       moment(item?.jobCardDate).format("DD-MM-YYYY")
  //     ];

  //     row.forEach((cell, colIndex) => {
  //       const xOffset =
  //         14 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
  //       if (cell) {
  //         doc.text(cell.toString(), xOffset, yPosition);
  //       }
  //     });
  //     yPosition += 10;

  //     if (yPosition > 180) {
  //       doc.addPage();
  //       yPosition = 10;
  //     }
  //   });
  //   doc.save("VehicleTrack_data.pdf");
  // };

  const downloadPDF = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to PDF.");
      return;
    }

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;


    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = 15;
    const logoY = yPosition;
    doc.addImage(Logo, "PNG", logoX, logoY, logoWidth, logoHeight);


    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("KANPUR NAGAR NIGAM", pageWidth / 2, yPosition + 10, { align: "center" });


    doc.setFontSize(14);
    doc.text("Vehicle Item Consumed Reports", pageWidth / 2, yPosition + 20, { align: "center" });

    yPosition += 40;

    const headers = ["Vehicle No.", "Vehicle", "JobCard No.", "Items Consumed", "JobCard Date"];
    const columnWidths = [50, 50, 50, 60, 50];
    const startX = 10;
    const headerHeight = 10;
    const rowHeight = 8;


    doc.setFillColor(200, 220, 255);
    doc.rect(
      startX,
      yPosition,
      columnWidths.reduce((a, b) => a + b, 0),
      headerHeight,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black text
    headers.forEach((header, index) => {
      const xOffset = startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(header, xOffset + 5, yPosition + headerHeight - 3);
    });

    yPosition += headerHeight + 4; // Move down for table rows


    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    isPrint.forEach((item: any, rowIndex) => {
      const row = [
        item?.vehicleNo || "",
        item?.vehicle || "",
        item?.jobCardNo || "",
        item?.itemsConsumed || "",
        moment(item?.jobCardDate).format("DD-MM-YYYY")
      ];

      row.forEach((cell, colIndex) => {
        const xOffset = startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        doc.text(cell.toString(), xOffset + 5, yPosition);
      });

      yPosition += rowHeight;


      if (yPosition > 180) {
        doc.addPage();
        yPosition = 20;
      }
    });


    doc.save("VehicleTrack_data.pdf");
  };

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

    getItem();

    getVendor();
  }, []);

  const getItem = () => {
    api.get(`ItemMaster/GetItemMaster?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data?.map((item: any) => ({
        label: item?.itemName,
        value: item?.itemMasterId,

      }));
      setItemOps(arr);
    });
  };

  const getVendor = () => {
    api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.vehicleNo,
        value: item.itemMasterId,
      }));
      setVendorOption(arr);
    });
  };
  const fetchZonesData = async () => {
    try {
      const collectData = {
        vehicleNo: vend,
        jobCardDate: formik.values.dateFrom,
        dateFrom: formik.values.dateFrom,
        dateTo: formik.values.dateTo,
      };
      const response = await api.post(`Master/GetvVehicleItemConsumed`, collectData);
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
          //   headerName: t("text.SrNo"),z
          //   flex: 0.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "vehicle",
            headerName: t("text.Vehicle"),
            flex: 1.3,
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
            field: "modelNo",
            headerName: t("text.modelNo"),
            flex: 1,

            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "jobCardNo",
            headerName: t("text.jobCardNo"),
            flex: 1,
            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemsConsumed",
            headerName: t("text.itemsConsumed"),
            flex: 1,
            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          // {
          //   field: "vendor",
          //   headerName: t("text.Vendor"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",

          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "jobCardDate",
            headerName: t("text.jobCardDate"),
            flex: 1,
            renderCell: (params) => {
              return moment(params.row.jobCardDate).format("DD-MM-YYYY");
            },
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

  const formik = useFormik({
    initialValues: {
      genderID: -1,
      genderName: "",
      genderCode: "",
      dateFrom: "",
      dateTo: "",
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,
    },
    validationSchema: Yup.object({
      dateTo: Yup.string()
        .required("To date required"),
      dateFrom: Yup.string()
        .required("From date required"),

    }),
    onSubmit: async (values) => {

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
            sx={{ padding: "15px" }}
            align="left"
          >
            {t("text.VehicleItemConsumed")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >



            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={VendorOption}
                value={vend}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if (!newValue) {
                    return;
                  }

                  setVendor(newValue.label);
                }}


                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel text={t("text.VehicleNos1")} required={false} />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>

            <Grid item xs={12} sm={4} lg={4}>
              <TextField
                type="date"
                id="dateFrom"
                name="dateFrom"
                label={
                  <CustomLabel text={t("text.FromDate")} required={true} />
                }
                value={formik.values.dateFrom}
                placeholder={t("text.FromDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dateFrom && Boolean(formik.errors.dateFrom)}
                helperText={formik.touched.dateFrom && formik.errors.dateFrom}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid item xs={12} sm={4} lg={4}>
              <TextField
                type="date"
                id="dateTo"
                name="dateTo"
                label={<CustomLabel text={t("text.ToDate")} required={true} />}
                value={formik.values.dateTo}
                placeholder={t("text.ToDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dateTo && Boolean(formik.errors.dateTo)}
                helperText={formik.touched.dateTo && formik.errors.dateTo}
                InputLabelProps={{ shrink: true }}
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
                    label={t("text.pdf")}
                  />
                  <FormControlLabel
                    value="excel"
                    control={<Radio />}
                    label={t("text.excel")}
                  />
                  <FormControlLabel
                    value="tabular"
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
                  // Trigger validation
                  formik.validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      // No validation errors, call API
                      fetchZonesData();
                      setVisible(true);
                    } else {
                      // Show errors in the form
                      formik.setTouched({
                        dateFrom: true,
                        dateTo: true,

                      });
                      toast.error("Please fill in all required fields.");
                    }
                  });
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
                  setVendor("");
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
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
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



