import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
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

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../utils/Url";
import DataGrids from "../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function LightInstallation() {
  const [dept, setDept] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchZonesData();
  }, [isLoading]);

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    // console.log(value)
    const collectData = {
      dept_id: value.id,
      dept_name: value.dept_name,
      dept_shortname: value.dept_shortname,
      isActive: event.target.checked,
      user_ID: -1,
      sortOrder: 0,
    };
    api
      .post(`Department/AddUpdateDepartmentmaster`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          fetchZonesData();
        } else {
          toast.error(response.data.mesg);
        }
      });
  };
  const routeChangeEdit = (row: any) => {
    console.log("row " + row);

    let path = `/installation/LightInstallationEdit`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/installation/LightInstallationAdd`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      lightInstId: delete_id,
      // user_ID: 0,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`LightInstallation/DeleteLightInstallation`, collectData)
      .then((response: any) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        fetchZonesData();
      });
  };

  const reject = () => {
    // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    // console.log(del_id + " del_id ");
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
        lightInstId: -1,
        zoneId: -1,
        wordId: -1,
      };
      const response = await api.post(
        `LightInstallation/GetLightInstallation`,
        collectData
      );
      const data = response.data.data;
      const deptWithIds = data.map((dept: any, index: any) => ({
        ...dept,
        serialNo: index + 1,
        id: dept.lightInstId,
      }));
      setDept(deptWithIds);
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
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "instDate",
            headerName: t("text.LightInstallationDate"),
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
            field: "wardName",
            headerName: t("text.wardName"),
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

  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
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
            {t("text.LightInstallation")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true && ( */}
            <Button
              onClick={routeChangeAdd}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
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

          <DataGrids
            isLoading={isLoading}
            rows={dept}
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
