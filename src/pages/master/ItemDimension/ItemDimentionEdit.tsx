import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";

type Props = {};

const ItemDimensionEdit = (props: Props) => {
  const location = useLocation();
  console.log("location", location.state);

  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      ASIN: location.state.ASIN,

      genricName: location.state.genricName,
      manufacture: location.state.manufacture,
      countryOfOrigin: location.state.countryOfOrigin,
      supplier: location.state.supplier,
      warentyOrGarenty: location.state.warentyOrGarenty,
      CurrentStatusId: location.state.CurrentStatusId,
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Department/AddUpdateDepartmentmaster`,
        values
      );
      // console.log("API Response:", response.data);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/DepartmentMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["dept_name"];

  const back = useNavigate();
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.EditItemDimention")}
          </Typography>

          <Grid item sm={4} xs={12}>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  marginBottom: 15,
                  marginTop: "45px",
                  backgroundColor: `var(--header-background)`,
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Typography>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="ASIN"
                  name="ASIN"
                  label={<CustomLabel text={t("text.ASIN")} required={false} />}
                  value={formik.values.ASIN}
                  placeholder={t("text.ASIN")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="genricName"
                  name="genricName"
                  label={
                    <CustomLabel text={t("text.GenricName")} required={false} />
                  }
                  value={formik.values.genricName}
                  placeholder={t("text.GenricName")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="manufacture"
                  name="manufacture"
                  label={
                    <CustomLabel
                      text={t("text.Manufacture")}
                      required={false}
                    />
                  }
                  value={formik.values.manufacture}
                  placeholder={t("text.Manufacture")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="countryOfOrigin"
                  name="countryOfOrigin"
                  label={
                    <CustomLabel
                      text={t("text.CountryOfOrigin")}
                      required={false}
                    />
                  }
                  value={formik.values.countryOfOrigin}
                  placeholder={t("text.CountryOfOrigin")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="supplier"
                  name="supplier"
                  label={
                    <CustomLabel text={t("text.Supplier")} required={false} />
                  }
                  value={formik.values.supplier}
                  placeholder={t("text.Supplier")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="warentyOrGarenty"
                  name="warentyOrGarenty"
                  label={
                    <CustomLabel
                      text={t("text.WarentyOrGarenty")}
                      required={false}
                    />
                  }
                  value={formik.values.warentyOrGarenty}
                  placeholder={t("text.WarentyOrGarenty")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.update")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default ItemDimensionEdit;
