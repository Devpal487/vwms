// import * as React from "react";
// import Paper from "@mui/material/Paper";
// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Divider,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import api from "../../../utils/Url";
// import { useLocation } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { getISTDate } from "../../../utils/Constant";
// import CustomDataGrid from "../../../utils/CustomDatagrid";
// import CustomLabel from "../../../CustomLable";
// import ButtonWithLoader from "../../../utils/ButtonWithLoader";
// import Languages from "../../../Languages";
// import { Language } from "react-transliterate";
// import "react-transliterate/dist/index.css";
// import TranslateTextField from "../../../TranslateTextField";
// import DataGrids from "../../../utils/Datagrids";

// interface MenuPermission {
//   isAdd: boolean;
//   isEdit: boolean;
//   isPrint: boolean;
//   isDel: boolean;
// }

// export default function Flowmaster() {
//   const { i18n, t } = useTranslation();
//   const { defaultValues, defaultValuestime } = getISTDate();

//   const [columns, setColumns] = useState<any>([]);
//   const [rows, setRows] = useState<any>([]);
//   const [editId, setEditId] = useState<any>(0);
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(true);
//   const [permissionData, setPermissionData] = useState<MenuPermission>({
//     isAdd: false,
//     isEdit: false,
//     isPrint: false,
//     isDel: false,
//   });
//   const [lang, setLang] = useState<Language>("en");

//   useEffect(() => {

//     //  getList();
//   }, [isLoading]);


//   return (
//     <>
//       <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
//         <Card
//           style={{
//             width: "100%",
//             height: "50%",
//             backgroundColor: "#E9FDEE",
//             border: ".5px solid #2B4593 ",
//             marginTop: "5px",
//           }}
//         >
//           <Paper
//             sx={{
//               width: "100%",
//               overflow: "hidden",

//             }}
//             style={{ padding: "10px" }}
//           >
//             <ConfirmDialog />

//             <Grid item xs={12} container spacing={2}>
//               <Grid item lg={10} md={10} xs={12}>
//                 <Typography
//                   gutterBottom
//                   variant="h5"
//                   component="div"
//                   sx={{ padding: "20px" }}
//                   align="left"
//                 >
//                   {t("text.Flowmaster")}
//                 </Typography>
//               </Grid>

//               <Grid item lg={2} md={2} xs={12} marginTop={2}>
//                 <select
//                   className="language-dropdown"
//                   value={lang}
//                   onChange={(e) => setLang(e.target.value as Language)}
//                 >
//                   {Languages.map((l) => (
//                     <option key={l.value} value={l.value}>
//                       {l.label}
//                     </option>
//                   ))}
//                 </select>
//               </Grid>

//             <Divider />

//             <Box height={10} />
//             {/* <form onSubmit={formik.handleSubmit}> */}

//             <Grid item xs={5}>
//               <RadioGroup
//                 row
//                 aria-label="type"
//                 name="type"
//                 sx={{ borderColor: "#fff" }}
//               >
//                 <FormControlLabel
//                   value="Outsource"
//                   control={
//                     <Radio
//                       sx={{
//                         color: "#fff",
//                         "&.Mui-checked": {
//                           color: "#fff",
//                         },
//                       }}
//                     />
//                   }
//                   label={t("text.Outsource")}
//                   sx={{
//                     marginTop: "-1%",
//                     color: "#fff",
//                   }}
//                 />
//                 <FormControlLabel
//                   value="Inhouse and Outsource"
//                   control={
//                     <Radio
//                       sx={{
//                         color: "#fff",
//                         "&.Mui-checked": {
//                           color: "#fff",
//                         },
//                       }}
//                     />
//                   }
//                   label={t("text.InhouseandOutsource")}
//                   sx={{ color: "#fff" }}
//                 />
//               </RadioGroup>
//               </Grid>
//               </Grid>
//           </Paper>
//         </Card>
//       </Grid>
//       <ToastApp />
//     </>
//   );
// }


import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Flowmaster() {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem("ApplicationFlow"));

  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("ApplicationFlow", event.target.value);


  };

  const handleSubmit = () => {
    console.log("Selected Option:", selectedOption);
    window.location.reload()
    // Add your form submission logic here
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
      <Grid item lg={6} sm={8} xs={12}>
        <Card
          style={{
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593",
            padding: "20px",
          }}
        >
          <Paper sx={{ padding: "20px" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
            >
              {t("text.Flowmaster")}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel
                  value="outsource"
                  control={<Radio sx={{
                    color: "#2B4593",
                    "&.Mui-checked": { color: "#2B4593" },
                  }} />}
                  label={t("Outsource")}
                />

                <FormControlLabel
                  value="inhouseAndOutsource"
                  control={<Radio sx={{
                    color: "#2B4593",
                    "&.Mui-checked": { color: "#2B4593" },
                  }} />}
                  label={t("Inhouse and Outsource")}
                />
              </RadioGroup>
            </Box>

            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ backgroundColor: "#2B4593", color: "#fff" }}
              >
                {t("Submit")}
              </Button>
            </Box>
          </Paper>
        </Card>
      </Grid>
    </Grid>
  );
}
