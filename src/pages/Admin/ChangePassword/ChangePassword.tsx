// import React, { useState } from "react";
// import { TextField, Button, Card, Grid, Typography } from "@mui/material";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ChangePassword = () => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     password: "",
//     password2: ""
//   });

//   const handleChange = (e:any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e:any) => {
//     e.preventDefault();
//     if (formData.password !== formData.password2) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     try {
//       const response = await axios.post("http://103.12.1.132:8185/api/Auth/ChangePassword", formData, {
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });
//       toast.success("Password changed successfully");
//     } catch (error) {
//       toast.error("Failed to change password");
//     }
//   };

//   return (
//     <Card style={{ padding: "20px", maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
//       <Typography variant="h5" align="center" gutterBottom>
//         Change Password
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Username"
//               name="userName"
//               fullWidth
//               value={formData.userName}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="New Password"
//               name="password"
//               type="password"
//               fullWidth
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Confirm Password"
//               name="password2"
//               type="password"
//               fullWidth
//               value={formData.password2}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Button type="submit" variant="contained" color="primary" fullWidth>
//               Submit
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       <ToastContainer />
//     </Card>
//   );
// };

// export default ChangePassword;


import React, { useState } from "react";
import { TextField, Button, Card, Grid, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
const ChangePassword = () => {
      const { t } = useTranslation();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    password2: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://103.12.1.132:8185/api/Auth/ChangePassword", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error("Failed to change password");
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
            <TextField
              label={t("text.Username")}
              name="userName"
              fullWidth
              value={formData.userName}
              onChange={handleChange}
              required
            />
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
                )
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
                )
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
