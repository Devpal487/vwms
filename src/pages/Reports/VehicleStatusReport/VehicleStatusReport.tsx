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
import Logo from "../../../assets/images/KanpurLogo.png";
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
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function VehicleStatusReport() {
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

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vNO, setVno] = useState([]);

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

    // Prepare headers and rows for HTML table
    const headers = ["Date", "Vehicle No", "Complain Status", "JobCard No", "Jobcard Status"];

    const rows = isPrint.map((item: any) => [
      moment(item?.complaintDate).format("DD-MM-YYYY") || "",
      item?.vehicleNo || "", // Vehicle No
      item?.complainStatus || "", // Driver
      item?.jobCardNo || "", // Mobile No
      item?.jobcardStatus || "",
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
    const headerFontSize = 14;
    const bodyFontSize = 12;


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
    doc.text("Vehicle Status Report", pageWidth / 2, yPosition + 20, { align: "center" });

    yPosition += 40; 

    const headers = ["Date", "Vehicle No", "Complain Status", "JobCard No", "Jobcard Status"];

    const columnWidths = [50, 50, 70, 50, 50];

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
        moment(item?.complaintDate).format("DD-MM-YYYY") || "",
        item?.vehicleNo || "", // Vehicle No
        item?.complainStatus || "", // Driver
        item?.jobCardNo || "", // Mobile No
        item?.jobcardStatus || "",
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

  }, []);


  const fetchZonesData = async () => {
    try {
      const collectData = {
        "complaintDateFrom": formik.values.complaintDateFrom,
        "complaintDateTo": formik.values.complaintDateTo
      };
      const response = await api.post(
        `Report/GetVehicleStatusApi`,
        collectData
      );
      const data = response?.data.data;

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
            field: "vehicleNo",
            headerName: t("text.vehicleNo"),
            flex: 1.3,
            cellClassName: "wrap-text", // Added here
            headerClassName: "MuiDataGrid-colCell",
            // renderCell: (params) => {
            //   return moment(params.row.trackDate).format("DD-MM-YYYY");
            // },
          },
          {
            field: "complaintDate",
            headerName: t("text.complaintDate"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
          },
          {
            field: "complainStatus",
            headerName: t("text.complainStatus"),
            flex: 1.3,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "jobCardNo",
            headerName: t("text.jobCardNo"),
            flex: 1.3,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          // {
          //   field: "jobCardDate",
          //   headerName: t("text.jobCardDate"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   renderCell: (params) => {
          //     return moment(params.row.jobCardDate).format("DD-MM-YYYY");
          //   },
          //   cellClassName: "wrap-text", // Added here
          // },
          // {
          //   field: "challanDate",
          //   headerName: t("text.challanDate"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   // align: 'right',
          //   // headerAlign: 'right',
          //   renderCell: (params) => {
          //     return moment(params.row.challanDate).format("DD-MM-YYYY");
          //   },
          //   cellClassName: "wrap-text", // Added here
          // },
          // {
          //   field: "challanRcvDate",
          //   headerName: t("text.challanRcvDate"),
          //   flex: 1.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   renderCell: (params) => {
          //     return moment(params.row.challanRcvDate).format("DD-MM-YYYY");
          //   },
          //   cellClassName: "wrap-text", // Added here
          // },
          // {
          //   field: "complainStatus",
          //   headerName: t("text.complainStatus"),
          //   flex: 1.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "jobcardStatus",
            headerName: t("text.jobcardStatus"),
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

  const formik = useFormik({
    initialValues: {
      genderID: -1,
      complaintDateFrom: "",
      complaintDateTo: "",

    },
    validationSchema: Yup.object({
      complaintDateTo
        : Yup.string()
          .required("Complaint To date required"),
      complaintDateFrom: Yup.string()
        .required("Complaint from date required"),

    }),
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
            sx={{ padding: "15px" }}
            align="left"
          >
            {t("text.VehicleStatusReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >


            <Grid xs={12} sm={6} md={6} item>
              <TextField
                type="date"
                id="complaintDateFrom"
                name="complaintDateFrom"
                label={
                  <CustomLabel text={t("text.FromDate")} required={true} />
                }
                value={formik.values.complaintDateFrom}
                placeholder={t("text.FromDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.complaintDateFrom && Boolean(formik.errors.complaintDateFrom)}
                helperText={formik.touched.complaintDateFrom && formik.errors.complaintDateFrom}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={6} md={6} item>
              <TextField
                type="date"
                id="complaintDateTo"
                name="complaintDateTo"
                label={<CustomLabel text={t("text.ToDate")} required={true} />}
                value={formik.values.complaintDateTo}
                placeholder={t("text.ToDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.complaintDateTo && Boolean(formik.errors.complaintDateTo)}
                helperText={formik.touched.complaintDateTo && formik.errors.complaintDateTo}
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
                        complaintDateFrom: true,
                        complaintDateTo: true,

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
