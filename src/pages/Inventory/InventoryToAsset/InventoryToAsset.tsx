import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
   Autocomplete,
   Box,
   Button,
   Divider,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from '../../../utils/Url';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import {
   GridColDef,
} from "@mui/x-data-grid";
import DataGrids from "../../../utils/Datagrids";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import * as Yup from "yup";
interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}
export default function InventoryToAsset() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");

   const { defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);

   const [itemValue, setItemValue] = useState("");
   const [storeValue, setStoreValue] = useState("");

   const [itemOption, setItemOption] = useState([
      { value: -1, label: t("text.ItemName") },
   ]);

   const [storeOption, setStoreOption] = useState([
      { value: -1, label: t("text.StoreName") },
   ]);


   useEffect(() => {
      getItemData();
      getStoreData();
      //fetchInventoryAssetData();
      const timeoutId = setTimeout(() => {
         fetchInventoryAssetData();
      }, 100);
      return () => clearTimeout(timeoutId);
   }, [isLoading]);

   const getItemData = async () => {
      const collectData = {
         "itemMasterId": -1
      };
      const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["itemName"],
            value: data[index]["itemMasterId"],
         });
      }
      setItemOption(arr);
   };

   const getStoreData = async () => {
      const collectData = {
         "id": -1,
         "unit": -1
      };
      const response = await api.post(`StoreMaster/GetStoreMaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["storeName"],
            value: data[index]["id"],
         });
      }
      setStoreOption(arr);
   };


   const formik = useFormik({
      initialValues:
      {
         "id": -1,
         "itemId": null,
         "qty": "",
         "storeId": null,
         "createdby": 0,
         "modifyby": 0,
         "createdon": "2024-11-28T07:30:05.608Z",
         "modifyon": "2024-11-28T07:30:05.608Z"
      },

      validationSchema: Yup.object({
         itemId: Yup.string()
            .required("Item Name is required"),
         qty: Yup.string()
            .required("Quantity is required"),
         storeId: Yup.string()
            .required("Store Name is required"),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`invetoryToAsset/AddUpdateinvetoryToAsset`, values);
            if (response.data.isSuccess) {
               formik.setFieldValue("id", -1);
               formik.setFieldValue("qty", "");
               formik.resetForm();
               setItemValue("");
               setStoreValue("");
               setToaster(false);
               toast.success(response.data.mesg);
            } else {
               setToaster(true);
               toast.error(response.data.mesg);
            }
            fetchInventoryAssetData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("itemId", row.itemId);
      formik.setFieldValue("qty", parseInt(row.qty));
      formik.setFieldValue("storeId", row.storeId);
      itemOption.map((i) => {
         if (i.value === row.itemId) {
            setItemValue(i.label);
         }
      })
      storeOption.map((i) => {
         if (i.value === row.storeId) {
            setStoreValue(i.label);
         }
      })
   }


   let delete_id = "";
   const accept = () => {
      const collectData = {
         "id": delete_id
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`invetoryToAsset/DeleteinvetoryToAsset`, collectData)
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.mesg);
            } else {
               toast.success(response.data.mesg);
            }
            fetchInventoryAssetData();
         });
   };
   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (del_id: any) => {
      console.log(del_id + " del_id ");
      delete_id = del_id;
      confirmDialog({
         message: "Do you want to delete this record ?",
         header: "Delete Confirmation",
         icon: "pi pi-info-circle",
         acceptClassName: "p=-button-danger",
         accept,
         reject,
      });
   };


   const fetchInventoryAssetData = async () => {
      try {
         const collectData = {
            "id": -1,
            "itemId": -1,
            "storeId": -1
         };
         const response = await api.post(`invetoryToAsset/GetinvetoryToAsset`, collectData);
         const data = response.data.data;
         console.log("🚀 ~ fetchInventoryAssetData ~ response.data.data:", response.data.data)
         const arr = data.map((item: any, index: any) => ({
            id: item.id,
            itemId: item.itemId,
            qty: item.qty,
            storeId: item.storeId,
            itemName: itemOption[itemOption.findIndex(i => i.value === item.itemId)]?.label,
            storeName: storeOption[storeOption.findIndex(i => i.value === item.storeId)]?.label
         }));
         setItem(arr);
         setIsLoading(false);
         if (data.length > 0) {
            const columns: GridColDef[] = [
               {
                  field: "actions",
                  headerClassName: "MuiDataGrid-colCell",
                  headerName: t("text.Action"),
                  width: 150,
                  renderCell: (params) => {
                     return [
                        <Stack
                           spacing={1}
                           direction="row"
                           sx={{ alignItems: "center", marginTop: "5px" }}
                        >
                           <EditIcon
                              style={{
                                 fontSize: "20px",
                                 color: "blue",
                                 cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => handleEdit(params.row)}
                           />
                           <DeleteIcon
                              style={{
                                 fontSize: "20px",
                                 color: "red",
                                 cursor: "pointer",
                              }}
                              onClick={() => {
                                 handledeleteClick(params.row.id);
                              }}
                           />
                        </Stack>,
                     ];
                  },
               },
               {
                  field: "itemName",
                  headerName: t("text.ItemName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "storeName",
                  headerName: t("text.StoreName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "qty",
                  headerName: t("text.Quantity"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
            ];
            setColumns(columns as any);
         }
      } catch (error) {
         console.error("Error fetching data:", error);
         //setLoading(false);
      }
   };


   const adjustedColumns = columns.map((column: any) => ({
      ...column,
   }));
   return (
      <>
         <Card
            style={{
               width: "100%",
               // height: "100%",
               backgroundColor: "#E9FDEE",
               border: ".5px solid #FF7722 ",
               marginTop: "3vh"
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
                     fontWeight: 900
                  },
               }}
               style={{ padding: "10px", }}
            >
               <ConfirmDialog />
               <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
               >
                  {t("text.InventoryToAsset")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={itemOption}
                           fullWidth
                           size="small"
                           value={itemValue}
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("itemId", parseInt(newValue?.value));
                              setItemValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.ItemName")} required={true} />}
                                 name="itemId"
                                 id="itemId"
                                 placeholder={t("text.ItemName")}
                              />
                           )}
                        />
                        {formik.touched.itemId && formik.errors.itemId && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemId}</div>
                        )}
                     </Grid>

                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={<CustomLabel text={t("text.Quantity")} required={true} />}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="qty"
                           id="qty"
                           value={formik.values.qty}
                           placeholder={t("text.Quantity")}
                           onChange={(e) => {
                              formik.setFieldValue("qty", parseInt(e.target.value)?parseInt(e.target.value):"");
                           }}
                        />
                        {formik.touched.qty && formik.errors.qty && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.qty}</div>
                        )}
                     </Grid>


                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={storeOption}
                           value={storeValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("storeId", parseInt(newValue?.value));
                              setStoreValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.StoreName")} required={true}/>}
                                 name="storeId"
                                 id="storeId"
                                 placeholder={t("text.StoreName")}
                              />
                           )}
                        />
                        {formik.touched.storeId && formik.errors.storeId && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.storeId}</div>
                        )}
                     </Grid>


                     {/* Submit Button */}
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
                           {t("text.save")}
                        </Button>
                     </Grid>

                     {/* Reset Button */}
                     <Grid item lg={6} sm={6} xs={12}>
                        <Button
                           type="reset"
                           fullWidth
                           style={{
                              backgroundColor: "#F43F5E",
                              color: "white",
                              marginTop: "10px",
                           }}
                           onClick={() => {
                              formik.resetForm();
                              setItemValue("");
                              setStoreValue("");
                           }}
                        >
                           {t("text.reset")}
                        </Button>
                     </Grid>
                  </Grid>
               </form>

               <DataGrids
                  isLoading={isLoading}
                  rows={item}
                  columns={adjustedColumns}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  initialPageSize={5}
               />
            </Paper>
         </Card>
         <ToastApp />
      </>
   );
}
