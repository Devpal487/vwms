import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  Grid,
  Card,  Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import {getISTDate, getId} from '../../../utils/Constant' 
import TranslateTextField from "../../../TranslateTextField";
import dayjs from "dayjs";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ComplaintMaster() {
  const UserId = getId();
  const navigate = useNavigate();
  const { defaultValuestime } = getISTDate();
  const { t } = useTranslation();
  const [rows, setRows] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ZoneOption, setZoneOption] = useState([{ value: "-1", label: t("text.SelectZone") }]);
  const [editId, setEditId] = useState(-1);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");
  const location = useLocation();

  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    // if (dataString) {
    //   const data = JSON.parse(dataString);
    //   if (data && data.length > 0) {
    //     const userPermissionData = data[0]?.userPermission;
    //     if (userPermissionData && userPermissionData.length > 0) {
    //       const menudata = userPermissionData[0]?.parentMenu;
    //       for (let index = 0; index < menudata.length; index++) {
    //         const childMenudata = menudata[index]?.childMenu;
    //         const pathrow = childMenudata.find(
    //           (x: any) => x.path === location.pathname
    //         );
    //         if (pathrow) {
    //           setPermissionData(pathrow);
    //         }
    //       }
    //     }
    //   }
    // }
    getList();
  }, []);
  // }, [isLoading]);


  const routeChangeEdit = (row: any) => {
    console.log("row " + row);

    let path = `/Inventory/EditComplaint`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/Inventory/CreateComplaint`;
    navigate(path);
  };


  let delete_id = "";

  const accept = () => {

    api
      .post(`ComplaintItem/DeleteComplaintItem`,{}, {headers:{CompId:delete_id}})
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        getList();
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


  const getList = async () => {
    try {
      const collectData = {

     "compId": -1,
          "empId": -1,
            "zoneid": -1,
            "wardid": -1,
           "compTypeId": -1 ,
      };
      const response = await api.post(
         `ComplaintItem/GetComplaintItem`,
        collectData
      );
      const data = response.data.data;
      const arr = data.map((Item: any, index:any) => ({
        ...Item,
        serialNo: index+1,
        id: Item.compId,
      }));
      setRows(arr);
      setIsLoading(false);

  // const getList = () => {
 
  //   try {
  //     api
  //       .post(`ComplaintItem/GetComplaintItem`,{}, { headers: {
  //            "compId": -1,
  //           "empId": -1,
  //           "zoneid": -1,
  //           "wardid": -1,
  //           "compTypeId": -1 ,
  //           'Accept': '*/*' 
  //         }})
  //       .then((res) => {
  //         const data = res.data.data;
  //         const arr = data.map((item: any, index: any) => ({
  //           ...item,
  //           serialNo: index + 1,
  //           id: item.compId,
  //         }));
  //         setRows(arr);
  //         setIsLoading(false);


          if (data.length > 0) {
            const columns: GridColDef[] = [
              {
                field: "actions",
                headerName: t("text.Action"),
                headerClassName: "MuiDataGrid-colCell",
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

                      {/* <Switch
                        checked={Boolean(params.row.isActive)}
                        style={{
                          color: params.row.isActive ? "green" : "#FE0000",
                        }}
                        onChange={(value: any) =>

                          handleSwitchChange(value, params.row)
                        }
                        inputProps={{
                          "aria-label": "Toggle Switch",
                        }}
                      /> */}
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
                field: "zoneName",
                headerName: t("text.zoneName"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "complaintNo",
                headerName: t("text.complaintNo"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "compAppdt",
                headerName: t("text.complaintDate"),
                flex: 1,
                renderCell(params) {
                    return dayjs(params.row.compAppdt).format("DD-MM-YYYY");
                },
                headerClassName: "MuiDataGrid-colCell",
              },
            ];
            setColumns(columns as any);
          }
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  return (
    <>

      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
          marginTop: "3vh"
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          style={{ padding: "10px", }}
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
            Complaint
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
          

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true && ( */}
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
                style={{backgroundColor:`var(--header-background)`}}
              >
                {t("text.add")}
              </Button>
            {/* ) } */}

            {/* {permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
          </Stack>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <CustomDataGrid
            isLoading={isLoading}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />

        </Paper>
      </Card>


      <ToastApp />
    </>
  );
}

