import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../utils/Url";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";

export default function HelpDesk() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [PageName, setPageName] = useState<string>("");
  const [PageDesk, setPageDesk] = useState<string>("");

  useEffect(() => {
    fetchHelpDeskData();
  }, []);

  const fetchHelpDeskData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/Auth/GetHelpMenu`, { menuId: 39 }); // need to replace
      if (response.data && response.data.data.length > 0) {
        setPageName(response.data.data[0]["menuName"]);
        setPageDesk(response.data.data[0]["helpedit"]); 
      } else {
        toast.warn("No content found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Help Desk data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ marginTop: "3vh" }}>
      <ToastApp />
      <Grid item lg={8} sm={10} xs={12}>
        <Card
          sx={{
            backgroundColor: "#E9FDEE",
            border: "1px solid #2B4593",
            padding: "20px",
            borderRadius: 2,
          }}
        >
          <Paper sx={{ padding: "20px", borderRadius: 2 }}>
          
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              {t("text.HelpDesk")}
            </Typography>
            <Divider sx={{ margin: "20px 0" }} />

       
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress />
              </Box>
            ) : PageName && PageDesk ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography fontWeight="600" fontSize={20}>
                    Page Name: <i>{PageName}</i>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Content:
                    <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography fontWeight="530" fontSize={24} textAlign="center">
                No content available.
              </Typography>
            )}
          </Paper>
        </Card>
      </Grid>
    </Grid>
  );
}


// import Paper from "@mui/material/Paper";
// import { useEffect, useState } from "react";
// import { Card, Grid, Typography, Divider, Box, CircularProgress } from "@mui/material";
// import { toast } from "react-toastify";
// import api from "../../../utils/Url";
// import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom"; // To get menuId from URL
// import ToastApp from "../../../ToastApp";

// export default function HelpDesk() {
//   const { t } = useTranslation();
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(true);
//   const [PageName, setPageName] = useState<string>("");
//   const [PageDesk, setPageDesk] = useState<string>("");

//   useEffect(() => {
//     const menuId = getMenuId();
//     if (menuId) {
//       fetchHelpDeskData(menuId);
//     } else {
//       toast.error("No Menu ID found. Please try again.");
//       setIsLoading(false);
//     }
//   }, []);

//   // Function to get Menu ID from URL or Local Storage
//   const getMenuId = (): number | null => {
//     const params = new URLSearchParams(location.search);
//     const menuIdFromURL = params.get("menuId");
    
//     if (menuIdFromURL) return parseInt(menuIdFromURL, 10); // Get from URL if available
//     return localStorage.getItem("selectedMenuId") ? parseInt(localStorage.getItem("selectedMenuId")!, 10) : null; // Otherwise, get from Local Storage
//   };

//   const fetchHelpDeskData = async (menuId: number) => {
//     setIsLoading(true);
//     try {
//       const response = await api.post(`/Auth/GetHelpMenu`, { menuId });
//       if (response.data && response.data.data.length > 0) {
//         setPageName(response.data.data[0]["menuName"]);
//         setPageDesk(response.data.data[0]["helpedit"]); // Assuming "helpedit" contains the content
//       } else {
//         toast.warn("No content found.");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch Help Desk data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Grid container justifyContent="center" sx={{ marginTop: "3vh" }}>
//       <ToastApp />
//       <Grid item lg={8} sm={10} xs={12}>
//         <Card
//           sx={{
//             backgroundColor: "#E9FDEE",
//             border: "1px solid #2B4593",
//             padding: "20px",
//             borderRadius: 2,
//           }}
//         >
//           <Paper sx={{ padding: "20px", borderRadius: 2 }}>
//             {/* Help Desk Title (Always Visible) */}
//             <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
//               {t("text.HelpDesk")}
//             </Typography>
//             <Divider sx={{ margin: "20px 0" }} />

//             {/* Loading Indicator */}
//             {isLoading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
//                 <CircularProgress />
//               </Box>
//             ) : PageName && PageDesk ? (
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Typography fontWeight="600" fontSize={20}>
//                     Page Name: <i>{PageName}</i>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="h6">
//                     Content:
//                     <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
//                   </Typography>
//                 </Grid>
//               </Grid>
//             ) : (
//               <Typography fontWeight="530" fontSize={24} textAlign="center">
//                 No content available.
//               </Typography>
//             )}
//           </Paper>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }

