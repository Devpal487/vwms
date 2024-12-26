import React, { useState } from "react";
import {
   Grid,
   TextField,
   Button,
   Typography,
   Box,
   CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/Url"; // Make sure this is your API utility file
import logo from "../assets/images/qq.png";
import "./index.css";
//import LoginImg from "./loginImg.jpg";
import LoginBg from "./tools.jpg";
import LoginImg from "./vehicleService.png";

const LoginPage1 = () => {
   const [loading, setLoading] = useState(false);
   const [isSignUpMode, setIsSignUpMode] = useState(false);
   const navigate = useNavigate();

   // Handle switching between Sign In and Sign Up modes
   const handleSignUpClick = () => setIsSignUpMode(true);
   const handleSignInClick = () => setIsSignUpMode(false);

   // Validation Schema for Formik (Username and Password are required)
   const validationSchema = Yup.object({
      username: Yup.string().required("Username Required"),
      password: Yup.string().required("Password Required"),
   });

   // Formik hook for form management
   const formik = useFormik({
      initialValues: {
         email: "",
         password: "",
         rememberMe: true,
         username: "",
         id: "",
      },
      validationSchema,
      onSubmit: async (values) => {
         try {
            setLoading(true);
            const response = await api.post("Auth/login", values);

            console.log("values", values);
            // Check if login is successful
            if (response.data.status === 1) {
               localStorage.setItem(
                  "userdata",
                  JSON.stringify([response.data.data])
               );
               localStorage.setItem(
                  "username",
                  JSON.stringify(response.data.data.responseData.username)
               );
               sessionStorage.setItem(
                  "token",
                  JSON.stringify(response.data.data.token)
               );
               navigate("/home");
            } else {
               toast.error(response.data.message);
            }
         } catch (error) {
            toast.error("Login Failed");
         } finally {
            setLoading(false);
         }
      },
   });

   return (
      <Grid container sx={{ justifyContent: "center", alignContent: "center", backgroundImage: `url(${LoginBg})`, backgroundSize: "cover", height: "100vh", opacity: "80%", padding: "5%" }}>
         <Grid item xs={6} sm={6} md={6} sx={{ backgroundImage: `url${LoginImg}`, backgroundSize: "cover", justifyContent: "center", alignContent: "center", }}></Grid>
         <Grid item xs={6} sm={6} md={6} sx={{ justifyContent: "center", alignContent: "center", padding: "4%", textAlign: "center", border: "3px solid black", backgroundColor: "black", opacity: "80%", boxShadow: "5rem solid black" }}>
            <form onSubmit={formik.handleSubmit}>
               <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "25%", height: "auto" }}
               />

               <div>
                  <h3 className="loginh3" style={{ color: "#fff" }}>Vehicle Workshop Management System</h3>
               </div>
               <br />
               <i className="title" style={{ color: "#fff" }}>"Illuminating Pathways, Ensuring Safety!"</i>

               <TextField
                  fullWidth
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ marginBottom: 2, backgroundColor: "#fff", borderRadius: "3rem", color: "#000" }}
                  size="small"
               />
               <TextField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ marginBottom: 2, backgroundColor: "#fff", borderRadius: "3rem", color: "#000" }}
                  size="small"
               />

               <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ marginBottom: 2, }}
               >
                  {loading ? <CircularProgress size={24} /> : "Login"}
               </Button>
            </form>
         </Grid>
      </Grid>
      // <div>
      //    <Grid container sx={{ height: "100vh" }}>
      //       <Grid
      //          item
      //          xs={12}
      //          md={6}
      //          sx={{
      //             display: "flex",
      //             justifyContent: "center",
      //             alignItems: "center",
      //             flexDirection: "column",
      //             backgroundColor: "#f2f2fc",
      //             backgroundImage: `url(${LoginBg})`,
      //             backgroundSize: "cover",
      //          }}
      //       >
      //          <Box
      //             sx={{
      //                width: "100%",
      //                maxWidth: 400,
      //                padding: 3,
      //                backgroundColor: "#fff",
      //                borderRadius: "3rem",
      //             }}
      //          >
      //             {/* Logo Image */}
      //             <Box sx={{ textAlign: "center", marginBottom: 2 }}>
      //                <img
      //                   src={logo}
      //                   alt="Logo"
      //                   style={{ width: "170px", height: "auto" }}
      //                />

      //                <div>
      //                   <h3 className="loginh3">Vehicle Workshop Management System</h3>
      //                </div>
      //                <br />
      //                <i className="title">"Illuminating Pathways, Ensuring Safety!"</i>
      //             </Box>

      //             <Typography variant="h6" align="center" gutterBottom>
      //                {isSignUpMode ? "Sign Up" : "Login"}
      //             </Typography>

      //             {/* Login / SignUp Form */}
      //             <form onSubmit={formik.handleSubmit}>
      //                <TextField
      //                   fullWidth
      //                   id="username"
      //                   name="username"
      //                   label="username"
      //                   value={formik.values.username}
      //                   onChange={formik.handleChange}
      //                   onBlur={formik.handleBlur}
      //                   error={
      //                      formik.touched.username && Boolean(formik.errors.username)
      //                   }
      //                   helperText={formik.touched.username && formik.errors.username}
      //                   sx={{ marginBottom: 2 }}
      //                   size="small"
      //                />
      //                <TextField
      //                   fullWidth
      //                   id="password"
      //                   name="password"
      //                   label="Password"
      //                   type="password"
      //                   value={formik.values.password}
      //                   onChange={formik.handleChange}
      //                   onBlur={formik.handleBlur}
      //                   error={
      //                      formik.touched.password && Boolean(formik.errors.password)
      //                   }
      //                   helperText={formik.touched.password && formik.errors.password}
      //                   sx={{ marginBottom: 2 }}
      //                   size="small"
      //                />

      //                <Button
      //                   fullWidth
      //                   variant="contained"
      //                   color="primary"
      //                   type="submit"
      //                   disabled={loading}
      //                   sx={{ marginBottom: 2 }}
      //                >
      //                   {loading ? <CircularProgress size={24} /> : "Login"}
      //                </Button>
      //             </form>
      //          </Box>
      //       </Grid>
      //       <Grid
      //          item
      //          xs={12}
      //          md={6}
      //          sx={{ backgroundImage: `url(${LoginImg})`, backgroundSize: "cover" }}
      //       ></Grid>
      //    </Grid>
      // </div>
   );
};

export default LoginPage1;
