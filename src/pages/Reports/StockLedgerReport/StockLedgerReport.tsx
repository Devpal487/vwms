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
import * as Yup from "yup";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function StockLedgerReport() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [option, setOption] = useState([
    { value: "-1", label: "Select Item" },
  ]);


  const [isItem, setItem] = useState("");
  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>("pdf");

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vNO, setVno] = useState("");

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

    
    const headers = ["Date", "Item Name", "Unit Name", "Particular", "Document No."];

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

      moment(item?.docDate).format("DD-MM-YYYY") || "",
      item?.itemName || "", // Vehicle No
      item?.unitName || "", // Driver
      item?.particular || "", // Mobile No
      item?.docNo || "",
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
    doc.text("Stock Ledger Report", pageWidth / 2, yPosition + 20, { align: "center" });

    yPosition += 40; 

    const headers = ["Date", "Item Name", "Unit Name", "Particular", "Document No."];

    const columnWidths = [35, 35, 35, 110, 35];

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
        moment(item?.docDate).format("DD-MM-YYYY") || "",
        item?.itemName || "", // Vehicle No
        item?.unitName || "", // Driver
        item?.particular || "", // Mobile No
        item?.docNo || "",
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
    getData();
   

    getVehicleNo();
  }, []);

  const getPeriod = () => {
    api.get(`Period/GetPeriods?type=Period&daysOnly=false`).then((res) => {
      const arr = res?.data?.map((item: any) => ({
        label: item?.displayLabel,
        value: item?.index,
        startDate: item?.startDate,
        endDate: item?.endDate,
        daysOnly: item?.daysOnly,
        displayLabel: item?.displayLabel,
        index: item?.index,
      }));
      setPeriod(arr);
    });
  };

  const getVehicleNo = () => {

    api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.vehicleNo,
        value: item.itemMasterId,
      }));
      setVnoOption(arr);
    });
  };
  const getData = () => {
    
    api.get(`ItemMaster/GetItemMaster?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.itemName,
        value: item.itemMasterId,
      }));
      setOption(arr);
    });
  };
 
  const fetchZonesData = async () => {
    try {
      const collectData = {
        "itemName":isItem,
        "vehicleNo":vNO,
        "docNo":formik.values.DocumentNo,
        "docdatefrom":formik.values.docdatefrom,
        "docdateto":formik.values.docdateto
      };
      const response = await api.post(
        `Report/GetvStockLedger2Api`,
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
            field: "docNo",
            headerName: t("text.docNo"),
            flex: 1.3,
            cellClassName: "wrap-text", // Added here
            // renderCell: (params) => {
            //   return moment(params.row.trackDate).format("DD-MM-YYYY");
            // },
          },
          {
            field: "particular",
            headerName: t("text.particular"),
            flex: 1.9,
           // headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemName",
            headerName: t("text.itemName"),
            flex: 1,
          //  headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "unitName",
            headerName: t("text.unitName"),
            flex: 1,
           // headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            
          },
          {
            field: "docDate",
            headerName: t("text.docDate"),
            flex: 1.3,
            //headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.docDate).format("DD-MM-YYYY");
            },
          },
          {
            field: "opening",
            headerName: t("text.opening"),
            flex: 1,
          //  headerClassName: "MuiDataGrid-colCell",
            //align: 'right',
           // headerAlign: 'right',
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "inQty",
            headerName: t("text.inQty"),
            flex: 1,
           // headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "outQty",
            headerName: t("text.outQty"),
            flex: 1,
           // headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "vendor",
            headerName: t("text.vendor"),
            flex: 1.5,
          //  headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "balance",
            headerName: t("text.balance"),
            flex: 1,
          //  headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          // {
          //   field: "fuelConsumption",
          //   headerName: t("text.FuelConsumption"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   align: 'right',
          //   headerAlign: 'right',
          //   cellClassName: "wrap-text", // Added here
          // },
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
      docdatefrom: "",
      docdateto: "",
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,
      DocumentNo: "",
    },
 validationSchema: Yup.object({
  docdateto: Yup.string()
        .required("document To date required"),
        docdatefrom: Yup.string()
        .required("document from date required"),
    
     
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
            {t("text.StockLedgerReport")}
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
                  if(!newValue){
                    return;
                  }
                  
                  setVno(newValue.label);
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


            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={option}
                value={isItem}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if(!newValue){
                    return;
                  }
                  
                  setItem(newValue.label);
                }}
               
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.ItemName")}
                        required={false}
                      />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>






            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="docdatefrom"
                name="docdatefrom"
                label={
                  <CustomLabel text={t("text.FromDate")} required={true} />
                }
                value={formik.values.docdatefrom}
                placeholder={t("text.FromDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.docdatefrom && Boolean(formik.errors.docdatefrom)}
                helperText={formik.touched.docdatefrom && formik.errors.docdatefrom}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="docdateto"
                name="docdateto"
                label={<CustomLabel text={t("text.ToDate")} required={true} />}
                value={formik.values.docdateto}
                placeholder={t("text.ToDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.docdateto && Boolean(formik.errors.docdateto)}
                helperText={formik.touched.docdateto && formik.errors.docdateto}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>


            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.DocumentNo")} />}
                value={formik.values.DocumentNo}
                name="DocumentNo"
                id="DocumentNo"
                placeholder={t("text.DocumentNo")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                        docdatefrom: true,
                        docdateto: true,
                       
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
                  setVno("");
                  setItem("");
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
