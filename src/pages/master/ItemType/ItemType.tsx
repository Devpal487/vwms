import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ItemType() {
  const UserId =getId();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(0);
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");
  let navigate = useNavigate();

  useEffect(() => {
  
    fetchZonesData();
    //getCountryName();
  }, [isLoading]);



  const validationSchema = Yup.object({
    itemType: Yup.string().test(
      "required",
      t("text.reqItemType"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      sno: 0,
      itemTypeMasterId:0,
      itemType: "",
      itemTypecode: "",
      createdBy: UserId,
      updatedBy:UserId ,

      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.itemTypeMasterId = editId;

      const response = await api.post(
        `ItemCategory/UpsertItemType`,
        values
      );
      if (response.data.status === 1) {
        toast.success(response.data.message);
        fetchZonesData();
        formik.resetForm();

        setEditId(0);
      } else {
        toast.error(response.data.message);
      }
    },
  });

  const requiredFields = ["itemType"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("itemType", row.itemType);
    formik.setFieldValue("itemTypecode", row.itemTypecode);
   

    setEditId(row.id);
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      itemTypeMasterId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`ItemCategory/DeleteItemType`,  collectData )
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
          fetchZonesData();
        } else {
          toast.error(response.data.message);
        }
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
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

  const fetchZonesData = async () => {
    try {
      const collectData = {
        itemTypeMasterId: -1,
      };
      const response = await api.post(
        `ItemCategory/GetItemType`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.itemTypeMasterId,
      }));
      setZones(zonesWithIds);
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
                  {/* {permissionData?.isEdit ? ( */}
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  {/* ) : (
                    ""
                  )} */}
                  {/* {permissionData?.isDel ? ( */}
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
                  {/* ) : (
                    ""
                  )} */}
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "itemType",
            headerName: t("text.ItemType1"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "itemTypecode",
            headerName: t("text.itemTypecode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
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

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Grid item xs={12} container spacing={2}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.ItemType")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
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

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2"></Stack>

          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={3}>
              <Grid item xs={12} lg={4}>
              <TranslateTextField
                   label={t("text.enteritemType1")}
                  value={formik.values.itemType}
                  onChangeText={(text: string) => handleConversionChange('itemType', text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.itemType && formik.errors.itemType ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.itemType}
                  </div>
                ) : null}
              </Grid>

              {/* <Grid xs={12} lg={4} item>
                <TextField
                  label={<CustomLabel text={t("text.enteritemType")} required={true}/>}
                  value={formik.values.itemType}
                  name="itemType"
                  id="itemType"
                  placeholder={t("text.enteritemType")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.itemType && formik.errors.itemType ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.itemType}
                  </div>
                ) : null}
              </Grid> */}

              <Grid xs={12} lg={4} item>
                <TextField
                  label={<CustomLabel text={t("text.enteritemTypecode")} />}
                  value={formik.values.itemTypecode}
                  name="itemTypecode"
                  id="itemTypecode"
                  placeholder={t("text.enteritemTypecode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={2} sx={{ m: -1 }}>
                {/*  {permissionData?.isAdd == true ? ( */}

                {/* <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} fullWidth={true} /> */}
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}

                {editId === 0 && (
                  // {editId === -1 && permissionData?.isAdd && (
                  <ButtonWithLoader
                    buttonText={t("text.save")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}

                {editId !== 0 && (
                  <ButtonWithLoader
                    buttonText={t("text.update")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}
              </Grid>
            </Grid>
          </form>

          <DataGrids
            isLoading={isLoading}
            rows={zones}
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
