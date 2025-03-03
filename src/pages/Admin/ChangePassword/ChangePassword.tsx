// import React, { useState, useEffect } from "react";
// import { TextField, Button, Card, Grid, Typography, IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom"; 
// const ChangePassword = () => {
//   const { t } = useTranslation();

//   // Retrieve username & token from localStorage
//   const storedUsername = localStorage.getItem("username") || "";
//   const token = localStorage.getItem("token"); // ✅ Fetch token directly
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     userName: storedUsername, // Autofill username from localStorage
//     password: "",
//     password2: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     setFormData((prevData) => ({ ...prevData, userName: storedUsername }));
//   }, [storedUsername]);

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleTogglePassword = () => setShowPassword(!showPassword);
//   const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!formData.userName) {
//         toast.error("Username is required");
//         return;
//     }
//     if (formData.password !== formData.password2) {
//         toast.error("Passwords do not match");
//         return;
//     }
//     if (!token) {
//         toast.error("Authentication failed! Please log in again.");
//         return;
//     }

//     try {
//         const response = await axios.post(
//             "http://103.12.1.132:8185/api/Auth/ChangePassword",
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         if (response.status === 200) {
//             toast.success("Password updated successfully! Redirecting to login...");

//             // ✅ Clear user session before redirecting
//             localStorage.clear();  // ✅ Clears all stored user data safely
//             sessionStorage.clear();

//             setTimeout(() => {
//                 window.location.href = window.location.origin; // ✅ Redirect to login page
//             }, 2000); 
//         } else {
//             toast.error("Failed to update password");
//         }
//     } catch (error) {
//         toast.error("Failed to update password");
//     }
// };


//   return (
//     <Card style={{ padding: "20px", maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
//       <Typography variant="h5" align="center" gutterBottom>
//         {t("text.ChangePassword")}
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField label={t("text.Username")} name="userName" fullWidth value={formData.userName} disabled />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label={t("text.NewPassword")}
//               name="password"
//               type={showPassword ? "text" : "password"}
//               fullWidth
//               value={formData.password}
//               onChange={handleChange}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleTogglePassword} edge="end">
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label={t("text.ConfirmPassword")}
//               name="password2"
//               type={showConfirmPassword ? "text" : "password"}
//               fullWidth
//               value={formData.password2}
//               onChange={handleChange}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleToggleConfirmPassword} edge="end">
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Button type="submit" variant="contained" color="primary" fullWidth>
//               {t("text.save")}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       <ToastContainer />
//     </Card>
//   );
// };

// export default ChangePassword;


import React, { useState, useEffect } from "react";
import { TextField, Button, Card, Grid, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ✅ Get username from localStorage & convert back from JSON string
  const storedUsername = localStorage.getItem("username");
  const username = storedUsername ? JSON.parse(storedUsername) : ""; 

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    userName: username, // ✅ Fix applied here
    password: "",
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  //const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, userName: username }));
  }, [username]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.userName) {
        toast.error("Username is required");
        return;
    }
    if (formData.password !== formData.password2) {
        toast.error("Passwords do not match");
        return;
    }
    if (!token) {
        toast.error("Authentication failed! Please log in again.");
        return;
    }

    try {
        const response = await axios.post(
            "http://103.12.1.132:8185/api/Auth/ChangePassword",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            toast.success("Password updated successfully! Redirecting to login...");

            localStorage.clear();
            sessionStorage.clear();

            setTimeout(() => {
                window.location.href = window.location.origin;
            }, 2000);
        } else {
            toast.error("Failed to update password");
        }
    } catch (error) {
        toast.error("Failed to update password");
    }
  };

  return (
    <Card style={{ padding: "20px", maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        {t("text.ChangePassword")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label={t("text.Username")} name="userName" fullWidth value={formData.userName} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("text.NewPassword")}
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("text.ConfirmPassword")}
              name="password2"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              value={formData.password2}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {t("text.save")}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Card>
  );
};

export default ChangePassword;
