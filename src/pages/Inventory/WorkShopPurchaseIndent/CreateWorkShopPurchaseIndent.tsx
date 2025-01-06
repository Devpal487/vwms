import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider, Table,
  MenuItem,
  TextField,
  Typography,

} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from '@mui/icons-material/Delete';
import { getISTDate } from "../../../utils/Constant";

type Props = {};


const CreateWorkShopPurchaseIndent = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [tableData, setTableData] = useState<any>([{


    "id": -1,
    "indentId": 0,
    "itemId": 0,
    "unitId": 0,
    "quantity": 0,
    "rate": 0,
    "amount": 0,
    "approveQuantity": 0,
    "fyId": 0,
    "srn": 0,
    "isDelete": true,
    "unitName": "",
    "itemName": ""
  }]);


  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [itemOption, setitemOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);




  useEffect(() => {

    GetUnitData();
    GetitemData();


    GetmaxindentData();

  }, []);


  console.log("🚀 ~ CreateWorkShopPurchaseIndent ~ tableData:", tableData)


  const GetitemData = async () => {

    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.get(`ItemMaster/GetItemMaster`, {});
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setitemOption(arr);
  };

  const GetmaxindentData = async () => {

    const response = await api.get(`Master/GetMaxindentNo`);
    const data = response.data.data;

    for (let index = 0; index < data.length; index++) {
      formik.setFieldValue("indentNo", data[index]['indentNo'])
    }
    //setmaxindentOption(arr);
  };

  const GetUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOptions(arr);
  };




  const formik = useFormik({
    initialValues: {

      "sno": 0,
      "indentId": 0,
      "indentNo": "",
      "indentDate": defaultValues,
      "remark": "",
      "createdBy": "",
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "jobID": 0,
      "vehicleitem": 0,
      "empId": 0,
      "status": "",
      "releasedBy": "",
      "indenttype": "",
      "postedBy": "",
      "releasedOn": defaultValues,
      "postedOn": defaultValues,
      "indentDetail": [
        {
          "sno": 0,
          "id": 0,
          "indentId": 0,
          "itemId": 0,
          "quantity": 0,
          "rate": 0,
          "amount": 0,
          "approveQuantity": 0,
          "fyId": 0,
          "srn": 0,
          "isDelete": true,
          "item": {
            "itemMasterId": 0,
            "itemName": "",
            "itemCode": "",
            "itemTypeId": 0,
            "itemFlag": "d",
            "itemCategoryId": 0,
            "unitId": 0,
            "empId": 0,
            "vZoneID": 0,
            "taxId": 0,
            "purchaseYear": 0,
            "modelNo": "",
            "vehicleNo": "",
            "tankCapacity": 0,
            "actPrice": 0,
            "hsnCode": "",
            "filename": "",
            "chesisNo": "",
            "qcApplicable": true,
            "depreciationRate": 0,
            "createdBy": "",
            "updatedBy": "",
            "mileage": 0,
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "file": "",
            "file1": "",
            "zoneName": "",
            "vehiclePhotoFile": "",
            "vehicleTypeId": 0,
            "brandTypeId": 0,
            "fuelTypeId": 0,
            "devid": "",
            "vehicleWeight": 0,
            "empName": "",
            "departmentName": "",
            "designationName": "",
            "itemCategoryName": "",
            "taxName": "",
            "unitName": "",
            "itemTypeName": "",
            "mobileNo": ""
          }
        }
      ],
      "srn": 0


      // "indentId": 0,
      // "indentNo": "",
      // "indentDate": defaultValues,
      // "remark": "",
      // "createdBy": "",
      // "updatedBy": "",
      // "createdOn": defaultValues,
      // "updatedOn": defaultValues,
      // "companyId": 0,
      // "fyId": 0,
      // "jobID": 0,
      // "vehicleitem": 0,
      // "empId": null,
      // "status": "",
      // "releasedBy": "",
      // "indenttype": "",
      // "postedBy": "",
      // "releasedOn": defaultValues,
      // "postedOn": defaultValues,
      // "empName": "",

      // indentDetail: [],
      // srn: 0
    },
    validationSchema: Yup.object({
      empId: Yup.string()
        .required(t("text.reqEmpName")),
    }),

    onSubmit: async (values) => {
      values.indentDetail = tableData

      console.log('values', values)



      const response = await api.post(
        `Master/UpsertIndent
`, values
        // { ...values, indentDetail: tableData }
      );
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/Inventory/WorkShopPurchaseIndent");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const back = useNavigate();

  const handleInputChange = (index: number, field: string, value: number) => {
    const newData: any = [...tableData];


    const numericValue = parseFloat(value.toString());

    newData[index][field] = numericValue;


    if (field === 'quantity' && numericValue < 1) {
      newData[index].quantity = 1;
    }


    if (field === 'quantity' || field === 'rate' || field === 'approveQuantity' || field === 'unitId') {
      const quantity = newData[index].quantity;
      const rate = newData[index].rate;
      const approveQuantity = newData[index].approveQuantity;


      newData[index].amount = rate * approveQuantity;
    }


    setTableData(newData);


    if (newData[index].quantity >= 1 && newData[index].rate > 0 && newData[index].approveQuantity >= 1) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
  };


  const addRow = () => {
    setTableData([
      ...tableData,
      {

        id: tableData.length + 1,
        "indentId": 0,
        "itemId": 0,
        "unitId": 0,
        "quantity": 0,
        "rate": 0,
        "amount": 0,
        "approveQuantity": 0,
        "fyId": 0,
        "srn": 0,
        "isDelete": true,
        "unitName": "",
        "itemName": ""
      },
    ]);
  };


  const deleteRow = (index: any) => {
    const newData = tableData.filter((_: any, i: any) => i !== index);
    setTableData(newData);
  };

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

          <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreateWorkShopPurchaseIndent")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l: any) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="indentNo"
                  name="indentNo"
                  label={<CustomLabel text={t("text.IndentNO")} required={false} />}
                  value={formik.values.indentNo}

                  size="small"
                  fullWidth


                />
              </Grid>


              <Grid item lg={4} xs={12}>
                <TextField
                  id="indentDate"
                  name="indentDate"
                  label={<CustomLabel text={t("text.indentDate")} required={false} />}
                  value={formik.values.indentDate}
                  placeholder={t("text.indentDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>




              {/*   
                <Grid item xs={12} sm={4} lg={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={empOption}
                    fullWidth
                    size="small"
                    onChange={(event, newValue) => {
                      console.log(newValue?.value);
                      formik.setFieldValue("empId", newValue?.value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.selectemp_name")} />}
                      />
                    )}
                  />
  
                  {formik.touched.empId && formik.errors.empId && (
                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
                  )}
                </Grid> */}

              <Grid item xs={12}>

              <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>

                <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                  <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                    <tr>

                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.itemName")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.quantity")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.approveQuantity")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Rate")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.totalAmount")}</th>
                      <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>

                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row: any, index: any) => (
                      <tr key={row.id} style={{ border: '1px solid black' }}>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</td>


                        <td
                          style={{
                            border: "1px solid black",
                            // textAlign: "center",
                          }}
                        >
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={itemOption}
                            fullWidth
                            size="small"
                            onChange={(e: any, newValue: any) => {
                              if (!newValue) {
                                return;
                              } else {
                                handleInputChange(
                                  index,
                                  "itemId",
                                  newValue?.value
                                )
                              }
                            }
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <CustomLabel
                                    text={t("text.selectItem")}
                                    required={false}
                                  />
                                }
                              />
                            )}
                          />
                        </td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                          <select
                            value={row.unitId}
                            onChange={(e: any) => handleInputChange(index, 'unitId', e.target.value)}
                            style={{ width: '95%', height: '35px' }}
                          >
                            <option value="">{t("text.SelectUnit")}</option>
                            {unitOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>


                        <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
                          <TextField

                            size="small"
                            // type="text"
                            value={row.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
                          <TextField

                            size="small"
                            // type="text"
                            value={row.approveQuantity}
                            onChange={(e) => handleInputChange(index, 'approveQuantity', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
                          <TextField

                            size="small"
                            // type="text"
                            value={row.rate}
                            onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </td>

                        <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
                          <TextField
                            // type="number"
                            value={row.amount.toFixed(2)}
                            size="small"
                            inputProps={{ "aria-readonly": true }}
                          />
                        </td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => {
                          if (tableData.length > 1) {
                            deleteRow(index)
                          } else {
                            alert("There should be atleast one row")
                          }
                        }}>
                          <DeleteIcon />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
             </div> </Grid>


              <Grid item xs={12} md={12} lg={12}>

                <TextField
                  placeholder={t("text.Remark")}
                  onChange={(e) => formik.setFieldValue('remark', e.target.value)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    border: '1px solid #ccc',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    resize: 'none',
                  }} />
              </Grid>


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

              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e: any) => formik.resetForm()}
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

export default CreateWorkShopPurchaseIndent;

