import {
  Button,
  CardContent,
  Grid,
  Divider,
  TextField,
  Typography,
  Table,
  Select,
  MenuItem,
  Paper,
  Autocomplete,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import CustomLabel from "../../CustomLable";
import api from "../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../Languages";
import { getISTDate } from "../../utils/Constant";
import { CheckBox } from "@mui/icons-material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const PoleInstallationAdd = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const [itemNameData, setItemNameData] = useState("");
  const [rateData, setRateData] = useState();

  const [accordionExpanded, setAccordionExpanded] = useState<any>({});
  const handleAccordionToggle = (index: any, isExpanded: any) => {
    setAccordionExpanded((prev: any) => ({
      ...prev,
      [index]: !prev[index],
    }));

    if (isExpanded) {
      if (index === 0) {
        MapData();
      }
    } else {
      console.log("function is not working");
    }
  };

  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Function to handle modal opening
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle modal closing
  const handleClose = () => {
    setOpen(false);
  };
  const [items, setItems] = useState<any>([
    {
      poleInstChildId: -1,
      poleInstId: -1,
      itemid: 0,
      poleno: "",
      installOfLight: 0,
      latitute: "",
      longitute: "",
      empId: 0,
      depth: "",
      apprby: 0,
      poleimg: "",
      apprdate: new Date().toISOString().slice(0, 10),
      islightinst: false,
      itemName: "",
      empName: "",
    },
  ]);
  const [taxOption, setTaxOption] = useState([
    { value: "-1", label: t("text.SelectWard") },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [contentOptions, setContentOptions] = useState([
    { value: "-1", label: t("text.SelectItem") },
  ]);

  const [Option, setOption] = useState([
    { value: "-1", label: t("text.SelectZone") },
  ]);

  const [SupId, setSuplierId] = useState();

  console.log("items", items);

  const [vehicles, setVehicles] = useState<any>([]);
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [center, setCenter] = useState({ lat: 26.447965, lng: 80.3432 });
  const mapRef: any = useRef(null);
  const [currentMap, setCurrentMap] = useState(false);

  // Fetch the vehicle data from API
  const MapData = () => {
    setCurrentMap(true);

    const validItems = items.filter((item: any) => validateItem(item));
    const arr = validItems.map((item: any, index: any) => ({
      lat: parseFloat(item?.latitute),
      lng: parseFloat(item?.longitute),
      id: index + 1,
      depth: item.depth,
      itemName: item?.itemName,
      empName: item?.empName,

      tracktime: item.apprdate,
      poleno: item.poleno,

      icon: "https://cdn-icons-png.flaticon.com/512/9830/9830827.png",
    }));
    setVehicles(arr);
    setCenter(calculateCenter(arr));

    if (arr.length > 0) {
      adjustZoomLevel(arr);
    }
  };

  const calculateCenter = (vehicles: any) => {
    if (vehicles.length === 0) {
      return { lat: 26.447965, lng: 80.3432 }; // Default center if no vehicles
    }

    const latitudes = vehicles.map((vehicle: any) => vehicle.lat);
    const longitudes = vehicles.map((vehicle: any) => vehicle.lng);

    const avgLat =
      latitudes.reduce((sum: any, lat: any) => sum + lat, 0) / latitudes.length;
    const avgLng =
      longitudes.reduce((sum: any, lng: any) => sum + lng, 0) /
      longitudes.length;

    return { lat: avgLat, lng: avgLng }; // Return the center point
  };

  // Adjust the zoom level based on the spread of the vehicles
  const adjustZoomLevel = (vehicles: any) => {
    const bounds = new window.google.maps.LatLngBounds();

    vehicles.forEach((vehicle: any) => {
      bounds.extend(new window.google.maps.LatLng(vehicle.lat, vehicle.lng));
    });

    if (mapRef.current) {
      mapRef.current.fitBounds(bounds); // Fit the map to the bounds of all vehicles
    }
  };

  const handleMarkerMouseOver = (vehicle: any) => {
    setActiveVehicle(vehicle);
  };

  const handleMarkerMouseOut = () => {
    setActiveVehicle(null);
  };

  const back = useNavigate();

  useEffect(() => {
    GetDigitalContentData();
    getTaxData();
    GetUnitData();
    getSupliar();
  }, []);

  const getSupliar = async () => {
    const collectData = {
      zoneID: -1,
      user_ID: "",
    };
    const res = await api.post(`Zone/GetZonemaster`, collectData);
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: item.zoneName,
        value: item.zoneID,
      })) || [];

    setOption(arr);
  };
  const getTaxData = async () => {
    const collectData = {
      areaID: -1,
    };
    const res = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: item.areaName,
        value: item.areaID,
      })) || [];

    setTaxOption(arr);
  };
  const GetUnitData = async () => {
    const collectData = {
      empid: -1,
      userId: "",
      empName: "",
      empMobileNo: "",
      empDesignationId: 0,
      empDeptId: 0,
      empStateId: 0,
      empCountryID: 0,
      empCityId: 0,
      empPincode: 0,
      roleId: "",
    };
    const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
      });
    }
    setUnitOptions(arr);
  };

  const GetDigitalContentData = async () => {
    const collectData = {
      itemMasterId: -1,
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
    setContentOptions(arr);
  };

  const formik = useFormik({
    initialValues: {
      poleInstId: -1,
      poleInstdate: new Date().toISOString().slice(0, 10),
      isuueidentid: -1,
      zoneId: 0,
      wardId: 0,
      zoneName: "",
      wardName: "",
      poleInstalChild: [],
    },

    onSubmit: async (values) => {
      console.log("Form Submitted with values:", values);

      const validItems = items.filter((item: any) => validateItem(item));

      values.poleInstalChild = validItems;

      try {
        const response = await api.post(
          `PoleInstallation/AddUpdatePoleInstallation`,
          values
        );
        if (response.data.isSuccess) {
          setToaster(false);
          toast.success(response.data.mesg);
          setTimeout(() => {
            navigate("/installation/PoleInstallation");
          }, 700);
        } else {
          setToaster(true);
          toast.error(response.data.mesg);
        }
      } catch (error) {
        setToaster(true);
        toast.error(t("error.network"));
      }
    },
  });

  const validateItem = (item: any) => {
    return (
      item.empId &&
      item.itemid &&
      item.latitute &&
      item.longitute &&
      item.depth &&
      item.poleimg &&
      item.apprdate
    );
  };

  const handleRemoveItem = (index: any) => {
    const updatedItems = items.filter((_: any, i: any) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index: any, field: any, value: any) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    if (
      validateItem(updatedItems[index]) &&
      index === updatedItems.length - 1
    ) {
      handleAddItem();
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        poleInstChildId: -1,
        poleInstId: -1,
        itemid: 0,
        poleno: "",
        installOfLight: 0,
        latitute: "",
        longitute: "",
        empId: 0,
        depth: "",
        apprby: 0,
        poleimg: "",
        apprdate: new Date().toISOString().slice(0, 10),
        islightinst: false,
        itemName: "",
        empName: "",
      },
    ]);
  };

  const ConvertBase64 = (file: Blob) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, index: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];

      if (!fileExtension.toLowerCase().match(/(jpg|jpeg|png)$/)) {
        alert("Only image files (jpg, jpeg, png) are allowed.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      handleItemChange(index, "poleimg", base64); // Set base64 value for image
    }
  };

  return (
    <div>
      <div
        style={{
          padding: "5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
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
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreatePoleInstallation")}
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
            {toaster && <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Option}
                  //   value={
                  //     Option.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("zoneId", newValue?.value);
                    formik.setFieldValue("zoneName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectZone")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOption}
                  //   value={
                  //     Option.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("wardId", newValue?.value);
                    formik.setFieldValue("wardName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectWard")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.PoleInstallationDate")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="poleInstdate"
                  id="poleInstdate"
                  type="date"
                  value={formik.values.poleInstdate}
                  placeholder={t("text.PoleInstallationDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item lg={12} md={12} xs={12} textAlign={"center"}>
                {/* <Typography variant="h6" textAlign="center">
                    {t("text.Purchaseorder")}
                  </Typography> */}
              </Grid>

              <Grid item lg={12} md={12} xs={12}>
                {/* <TableContainer> */}
                <div style={{ overflowX: "auto" }}>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <thead
                      style={{ backgroundColor: "#2B4593", color: "#f5f5f5" }}
                    >
                      <tr>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.ItemName")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Employee")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.InstallOfLight")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.latitute")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.longitute")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.PoleNo")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.depth")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.apprdate")}
                        </th>
                        {/* <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.islightinst")}
                        </th> */}
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.PoleImg")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any, index: any) => (
                        <tr key={item.id} style={{ border: "1px solid black" }}>
                          <td style={{ width: "180px" }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={contentOptions}
                              size="small"
                              onChange={(event, newValue: any) => {
                                handleItemChange(
                                  index,
                                  "itemid",
                                  newValue?.value
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("text.ItemName")}
                                />
                              )}
                            />
                          </td>
                          <td style={{ width: "180px" }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={unitOptions}
                              size="small"
                              onChange={(event, newValue) =>
                                handleItemChange(
                                  index,
                                  "empId",
                                  newValue?.value
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("text.Employee")}
                                />
                              )}
                            />
                          </td>
                          <td style={{ width: "100px" }}>
                            <TextField
                              type="number"
                              value={item?.installOfLight}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "installOfLight",
                                  parseInt(e.target.value)
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                            />
                          </td>
                          <td>
                            <TextField
                              type="text"
                              value={item.latitute}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "latitute",
                                  String(e.target.value)
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                            />
                          </td>
                          <td>
                            <TextField
                              type="text"
                              value={item.longitute}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "longitute",
                                  String(e.target.value)
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                            />
                          </td>
                          <td>
                            <TextField
                              type="text"
                              value={item.poleno}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "poleno",
                                  String(e.target.value)
                                )
                              }
                              size="small"
                            />
                          </td>
                          <td>
                            <TextField
                              type="text"
                              value={item.depth}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "depth",
                                  String(e.target.value)
                                )
                              }
                              size="small"
                            />
                          </td>
                          <td>
                            <TextField
                              type="date"
                              value={item.apprdate}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "apprdate",
                                  String(e.target.value)
                                )
                              }
                              size="small"
                            />
                          </td>
                          {/* <td>
                            <Checkbox
                              checked={item.islightinst}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "islightinst",
                                  e.target.checked
                                )
                              }
                              size="small"
                            />
                          </td> */}
                          <td style={{ width: "300px" }}>
                            {item?.poleimg == "" ? (
                              <TextField
                                type="file"
                                inputProps={{ accept: "image/*" }}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                fullWidth
                                style={{
                                  backgroundColor: "white",
                                  width: "100%",
                                }}
                                onChange={(e) =>
                                  otherDocChangeHandler(e, index)
                                }
                              />
                            ) : (
                              <Typography
                                style={{
                                  color: "#4285f4",
                                  textAlign: "center",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handleOpen();
                                  setImagePreview(item?.poleimg);
                                }}
                              >
                                View
                              </Typography>
                            )}
                          </td>
                          <td>
                            <Button
                              onClick={() => handleRemoveItem(index)}
                              variant="text"
                              color="secondary"
                            >
                              <DeleteIcon />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {/* </TableContainer> */}
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  maxWidth="sm"
                  fullWidth
                >
                  {/* Dialog Title */}
                  <DialogTitle
                    style={{
                      backgroundColor: `var(--header-background1)`,
                      padding: "10px",
                      color: "#ffff",
                    }}
                  >
                    Image Preview
                  </DialogTitle>

                  <DialogContent style={{ marginTop: "2%" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "100%",
                        marginBottom: "16px",
                      }}
                    />
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>

              <Grid
                xs={12}
                lg={12}
                sm={12}
                item
                style={{ marginBottom: "10px" }}
              >
                <Accordion
                  expanded={accordionExpanded[0]}
                  onChange={(e, expended) => {
                    handleAccordionToggle(0, expended);
                    // FuelconsData();
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{ backgroundColor: "#3492eb", color: "#fff" }}
                  >
                    <Typography style={{ fontWeight: 600, fontSize: "16px" }}>
                      View Map
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ background: "#f2f8fa" }}>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2}
                      sx={{ marginTop: "5px" }}
                    >
                      {currentMap && (
                        <Grid item xs={12} sm={12} lg={12}>
                          {/* {isLoading1 ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CircularProgress />
                        </div>
                      ) : ( */}
                          <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={70} // Default zoom, will be adjusted by `fitBounds`
                            onLoad={(map: any) => (mapRef.current = map)}
                          >
                            {vehicles.map((vehicle: any) => (
                              <Marker
                                key={vehicle.id}
                                position={{
                                  lat: vehicle.lat,
                                  lng: vehicle.lng,
                                }}
                                icon={{
                                  url: vehicle.icon,
                                  scaledSize: new window.google.maps.Size(
                                    50,
                                    50
                                  ),
                                  origin: new window.google.maps.Point(0, 0),
                                  anchor: new window.google.maps.Point(25, 25),
                                }}
                                onMouseOver={() =>
                                  handleMarkerMouseOver(vehicle)
                                } // Show vehicle number on hover
                                onMouseOut={handleMarkerMouseOut} // Hide info window on hover out
                              >
                                {activeVehicle &&
                                  activeVehicle.id === vehicle.id && (
                                    <InfoWindow>
                                      <div>
                                        <div>
                                          <strong>Zone Name: </strong>
                                          {formik.values.zoneName}
                                        </div>

                                        <div>
                                          <strong>Ward Name: </strong>
                                          {formik.values.wardName}
                                        </div>
                                        
                                        <div>
                                          <strong>Depth: </strong>
                                          {vehicle.depth}
                                        </div>

                                        <div>
                                          <strong>Pole No: </strong>
                                          {vehicle.poleno}
                                        </div>

                                        <div>
                                          <strong>Date : </strong>
                                          {vehicle.tracktime}
                                        </div>
                                      </div>
                                    </InfoWindow>
                                  )}
                              </Marker>
                            ))}
                          </GoogleMap>
                          {/* )} */}
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <br />
              </Grid>

              <Grid item xs={12}>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: `var(--header-background)`,
                      margin: "1%",
                    }}
                  >
                    {t("text.save")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default PoleInstallationAdd;
