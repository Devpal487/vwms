
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from "@mui/material";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";


import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DescriptionIcon from "@mui/icons-material/Description";

import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";



import { PieChart } from "@mui/x-charts/PieChart";
import api from "../../utils/Url";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";


import ProgressBar from "@ramonak/react-progress-bar";
import BuildIcon from "@mui/icons-material/Build";

import { motion, useSpring } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { table } from "console";

import * as XLSX from "xlsx";
import { toast } from "react-toastify";


const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "85%",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const containerStyle = {
  width: "100%",
  height: "500px",
};

interface Department {
  dept_id: number;
  dept_name: string;
  session_year: string;

}


export default function HomePage() {


 
  const [ispending, setpending] = useState(0);
  const [isprogress, setprogress] = useState(0);
  const [isoutsource, setoutsource] = useState(0);
  const [isinhouse, setinhouse] = useState(0);
  const [isclosed, setclosed] = useState(0);

  // Fetch complaint status dynamically
  const fetchComplaintStatus = async (status: string, setter: React.Dispatch<any>) => {
    try {
      const response = await api.get(`Dashboard/GetComplaintsStatus?Status=${status}`);
      const data = response.data.data || [];
      const count = data.reduce((acc: any, item: any) => acc + (item.Status || 0), 0);
      setter(count);
    } catch (error) {
      console.error(`Error fetching ${status} data:`, error);
    }
  };

  // Handlers for each status type
  const handlePending = () => fetchComplaintStatus("pending", setpending);
  const handleInProgress = () => fetchComplaintStatus("inprogress", setprogress);
  const handleOutsource = () => fetchComplaintStatus("JobWork", setoutsource);
  const handleInHouse = () => fetchComplaintStatus("pending", setinhouse); // Adjust the status as needed
  const handleClosed = () => fetchComplaintStatus("Complete", setclosed);
 
  const [activeTab, setActiveTab] = useState(0); // 0 for Repair, 1 for Complaints

  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(true);


  const [isShow2, setIsShow2] = useState<any>(false);
  const [isShow3, setIsShow3] = useState<any>(false);
  const [isShow4, setIsShow4] = useState<any>(false);
  const [isShow5, setIsShow5] = useState<any>(false);
  const [isShow6, setIsShow6] = useState<any>(false);
  const { t } = useTranslation();
  const [RepairOption, setRepairOption] = useState<any[]>([]);
  const [ComplaintsOption, setComplaintsOption] = useState<any[]>([]);
  const [ReorderOption, setReorderOption] = useState<any>("");
  const [OverDueOption, setOverDueOption] = useState<any>("");
  const [IssuedStatusOption, setIssuedStatusOption] = useState<any>("");
  const [DocumentTypeOption, setDocumentTypeOption] = useState<any>("");

  useEffect(() => {
    GetTopVehicleActprice();
    GetTopVehicleMaxNoOfComplaints();
    GetTopItemIssued();
    GetReOrderLevel();
    GetTopVehiclewaiting();
    // runningDatacomplaint1();
    // runningDatacomplaint2();
    // runningDatacomplaint3();
    // runningDatacomplaint4();
    // runningDatacomplaint5();
  }, []);

  const GetTopVehicleActprice = async () => {
    try {
      const response = await api.get(`Dashboard/GetTopVehicleActprice`);
      const data = response.data.data;

      console.log("Fetched Data:", data);


      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));

      setRepairOption(processedData);
      setIsLoading(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(true)

      if (data.length > 0) {

        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "5px" }}
              >


              </Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "vehicleNo", headerName: "Vehicle", flex: 1 },
          { field: "vehicleTypename", headerName: "Vehicle Type", flex: 1 },
          { field: "actprice", headerName: "Actual Price", flex: 1 },
          { field: "amount", headerName: "Expense", flex: 1 },
          { field: "age", headerName: "Age", flex: 1 },
        ];

        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetTopVehicleMaxNoOfComplaints = async () => {
    try {
      const response = await api.get(`Dashboard/GetTopVehicleMaxNoOfComplaints`);
      const data = response.data.data;

      console.log("Fetched Data:", data);


      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));

      setComplaintsOption(processedData);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(true);

      if (data.length > 0) {

        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "5px" }}
              >


              </Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "vehicleNo", headerName: "Vehicle", flex: 1 },
          { field: "noOfComplaints", headerName: "Complaints", flex: 1 },
          { field: "totaldays", headerName: "total days", flex: 1 },
          { field: "amount", headerName: "Expense", flex: 1 },

        ];

        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetReOrderLevel = async () => {
    try {
      const response = await api.get(`Dashboard/GetReOrderLevel`);
      const data = response.data.data;

      console.log("Fetched Data:", data);


      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.itemName || index,
        serialNo: index + 1,
      }));

      setReorderOption(processedData);
      setIsLoading(false);
      setIsShow3(true);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(false);

      if (data.length > 0) {

        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "5px" }}
              >


              </Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "itemName", headerName: "item", flex: 1 },
          { field: "unitName", headerName: "unit", flex: 1 },
          { field: "reorderLevel", headerName: "reorder", flex: 1 },
          { field: "bal", headerName: "balance", flex: 1 },
          { field: "critical", headerName: "critical", flex: 1 },
        ];

        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const reportRef = useRef<HTMLDivElement>(null);


  const GetTopVehiclewaiting = async () => {
    try {
      const response = await api.get(`Dashboard/GetTopVehiclewaiting`);
      const data = response.data.data;

      console.log("Fetched Data:", data);


      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));

      setOverDueOption(processedData);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(true);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(false);
      if (data.length > 0) {

        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "5px" }}
              >


              </Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "vehicleNo", headerName: "vehicleNo", flex: 1 },
          { field: "status", headerName: "status", flex: 1 },
          { field: "complaintDate", headerName: "complaintDate", flex: 1 },
          { field: "totaldays", headerName: "Days", flex: 1 },

        ];

        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetTopItemIssued = async () => {
    try {
      const response = await api.get(`Dashboard/GetTopItemIssued`);
      const data = response.data.data;

      console.log("Fetched Data:", data);

      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.itemName || index,
        serialNo: index + 1,
      }));

      setIssuedStatusOption(processedData);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(true);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(false);

      if (data.length > 0) {

        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "5px" }}
              >


              </Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "itemName", headerName: "item Name", flex: 1 },
          { field: "Issued", headerName: "Issued", flex: 1 },
        ];

        setColumns(dynamicColumns); // Set columns dynamically
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const handleClick = (id: any) => {
    if (id === 0) {
      setIsShow(true);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false)
    } else if (id === 1) {
      setIsShow(false);
      setIsShow2(true);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false)
    }
    else if (id === 2) {
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(true);
      setIsShow4(false);
      setIsShow5(false)
    }
    else if (id === 3) {
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(true);
      setIsShow5(false)
    }
    else if (id === 4) {
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(true)

    }

  };

  const [recentlyIssueTransactionOption] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [zones1, setZones1] = useState([]);
  const [columns1, setColumns1] = useState<any>([]);
  const [isLoading1, setIsLoading1] = useState(true);




  const [zones2, setZones2] = useState([]);
  const [columns2, setColumns2] = useState<any>([]);
  const [isLoading2, setIsLoading2] = useState(true);

  const [zones3, setZones3] = useState([]);
  const [columns3, setColumns3] = useState<any>([]);
  const [isLoading3, setIsLoading3] = useState(true);

  const [zones4, setZones4] = useState([]);
  const [columns4, setColumns4] = useState<any>([]);
  const [isLoading4, setIsLoading4] = useState(true);

  const [isLoading6, setIsLoading6] = useState(true);

  const [zones5, setZones5] = useState([]);
  const [columns5, setColumns5] = useState<any>([]);
  const [isLoading5, setIsLoading5] = useState(true);

  const [getTop, setGetTop] = useState(false);

  const [getTop1, setGetTop1] = useState(false);

  const [isRunn, setRunn] = useState<any>(0);

  const [isIdle, setIdle] = useState<any>(0);
  const [isStop, setStop] = useState<any>(0);
  const[is30days ,set30days]=useState<any>(0);
  const [totalVeh, setTotalVeh] = useState<any>(0);

  // const[ispending,setpending] =useState<any>(0);
  // const[isprogress,setprogress] =useState<any>(0);
  // const[isoutsource,setoutsource] =useState<any>(0);
  // const[isinhouse,setinhouse] =useState<any>(0);
  // const[isclosed,setclosed] =useState<any>(0);
  



  const [totalDistance, setTotalDistance] = useState<any>(0);
  const [isModal, setModal] = useState<any>(false);

  const [isModal1, setModal1] = useState<any>(false);
  const [isModal2, setModal2] = useState<any>(false);
  const [isModal3, setModal3] = useState<any>(false);
  const [isModal4, setModal4] = useState<any>(false);
  const [isModal5, setModal5] = useState<any>(false);
  const [isModal6, setModal6] = useState<any>(false);
  const [isModal7, setModal7] = useState<any>(false);


  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const [isMap, setMap] = useState<any>([]);

  const [accordionExpanded, setAccordionExpanded] = useState<any>({});
  const handleAccordionToggle = (index: any, isExpanded: any) => {
    setAccordionExpanded((prev: any) => ({
      ...prev,
      [index]: !prev[index],
    }));

    if (isExpanded) {
      if (index === 0) {
        //  FuelconsData();
      } else if (index === 1) {
        //  IdleData();
      } else if (index === 2) {
        //TodayVData();
      } else if (index === 3) {
        //fetchZonesData();
      }
    } else {
      console.log("function is not working");
    }
  };

  const [value, setValue] = useState<any>(
    parseInt(localStorage.getItem("dash") || "0", 10)
  );

  useEffect(() => {

    setTimeout(() => {
      setZones1([

      ]);
      setIsLoading1(false);
    }, 2000);
  }, []);



  const [isPrint, setPrint] = useState([]);
  const [isPrint1, setPrint1] = useState([]);

  const [isLabel, setlabel] = useState("");
  const [isStatus, setStatus] = useState("");
  const [isStatus1, setStatus1] = useState("");
  const [isStatus2, setStatus2] = useState("");
  const [isStatus3, setStatus3] = useState("");
  const [isStatus4, setStatus4] = useState("");
  const [isStatus5, setStatus5] = useState("");
  const [isStatus6, setStatus6] = useState("");
  const [isStatus7, setStatus7] = useState("");

  const downloadExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Excel.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(isPrint);

    const headers = Object.keys(isPrint[0]);

    headers.forEach((header, index) => {
      const cellAddress = `${String.fromCharCode(65 + index)}1`;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vehicles");

    XLSX.writeFile(wb, "FuelConsumed.xlsx");
  };

  const downloadExcel1 = () => {
    if (!isPrint1 || isPrint1.length === 0) {
      console.error("No data to export to Excel.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(isPrint1);

    const headers = Object.keys(isPrint1[0]);

    headers.forEach((header, index) => {
      const cellAddress = `${String.fromCharCode(65 + index)}1`;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vehicles");

    XLSX.writeFile(wb, "Long_Idle.xlsx");
  };


  const handleTab = (event: any, newValue: any) => {
    console.log(newValue);
    setValue(newValue);
  };

  const items = [
    {
      id: 0,
      text: t("text.Tophigherrepairexpense"),
      icon: <BuildIcon sx={{ color: "blue" }} />,
      onClick: () => handleClick(0),
    },
    {
      id: 1,
      text: t("text.Complaints"),
      icon: <ReportProblemIcon sx={{ color: "red" }} />,
      onClick: () => handleClick(1),
    },
    {
      id: 2,
      text: t("text.Itemtobeordered"),
      icon: <ShoppingCartIcon sx={{ color: "green" }} />,
      onClick: () => handleClick(2),
    },

    {
      id: 3,
      text: t("text.vehicleoverduestatus"),
      icon: <TimeToLeaveIcon sx={{ color: "orange" }} />,
      onClick: () => handleClick(3),
    },
    {
      id: 4,
      text: t("text.itemIssuedtoday"),
      icon: <AssignmentTurnedInIcon sx={{ color: "purple" }} />,
      onClick: () => handleClick(4),
    },
    {
      id: 5,
      text: t("text.DocumentType"),
      icon: <DescriptionIcon sx={{ color: "teal" }} />,
      onClick: () => handleClick(5),
    },
  ];


  const handleClose = () => {
    setModal(false);
  };

  const handleClose1 = () => {
    setModal1(false);
  };

  const handleClose2 = () => {
    setVisible(false);
  };



  const adjustedColumns5 = columns5.map((column: any) => ({
    ...column,
  }));
  const runningData = async (value:any) => {
    setStatus1(value);
    setModal(true);
    try {
      const response = await api.get(`Dashboard/GetComplaintsVehicleStatus`);
      const data = response.data.data;
  
      // Extract relevant fields from API data
      const vehicleInWorkshop = data.reduce((acc:any, item:any) => acc + (item.complaintOnVehicle || 0), 0);
      const inhouse = data.reduce((acc:any, item:any) => acc + (item.inSideVehicle || 0), 0);
      const outsource = data.reduce((acc:any, item:any) => acc + (item.outSideVehicle || 0), 0);
      const completed = data.reduce((acc:any, item:any) => acc + (item.completeVehicle || 0), 0);
      const totalVehicles = data.reduce((acc:any, item:any) => acc + (item.totWVehicle || 0), 0);
  
      // Update state variables
      setRunn(vehicleInWorkshop);
      setIdle(inhouse);
      setStop(outsource);
      set30days(completed);
      setTotalVeh(totalVehicles);
  
      // Set columns for further processing if needed
      if (data.length > 0) {
        const columns2 = [
          { field: "serialNo", headerName: "Sr. No", flex: 0.5 },
          { field: "complaintOnVehicle", headerName: "Vehicle In Workshop", flex: 1 },
          { field: "inSideVehicle", headerName: "Inhouse", flex: 1 },
          { field: "outSideVehicle", headerName: "Outsource", flex: 1 },
          { field: "completeVehicle", headerName: "Completed", flex: 1 },
          { field: "totWVehicle", headerName: "Total Vehicles", flex: 1 },
        ];
        setColumns4(columns2);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [complaints, setComplaints] = useState({
    pending: 0,
    inprogress: 0,
    outsource: 0,
    inhouse: 0,
    closed: 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAllStatuses = async () => {
      try {
        const responses = await Promise.all([
          api.get("Dashboard/GetComplaintsStatus?Status=pending"),
          api.get("Dashboard/GetComplaintsStatus?Status=inprogress"),
          api.get("Dashboard/GetComplaintsStatus?Status=JobWork"),
          api.get("Dashboard/GetComplaintsStatus?Status=pending"), // Assuming this for inhouse
          api.get("Dashboard/GetComplaintsStatus?Status=Complete"),
        ]);

        // Process data and count items
        const data = {
          pending: responses[0].data.data.length,
          inprogress: responses[1].data.data.length,
          outsource: responses[2].data.data.length,
          inhouse: responses[3].data.data.length,
          closed: responses[4].data.data.length,
        };

        // Update state
        setComplaints(data);
        setTotal(Object.values(data).reduce((sum, count) => sum + count, 0)); // Calculate total
      } catch (error) {
        console.error("Error fetching complaint statuses:", error);
      }
    };

    fetchAllStatuses();
  }, []);

  const calculatePercentage = (count: number) => (total ? Math.round((count / total) * 100) : 0);

//   const runningDatacomplaint1 = async (value:any) => {
//     setStatus2(value);
//     setModal2(true);
//     try {
//       const response = await api.get(`Dashboard/GetComplaintsStatus?Status=pending`);
//       const data = response.data.data;
//       const PENDING = data.reduce((acc: any, item: any) => acc + (item.Status || 0), 0);
// console.log("Pending Data:", PENDING); // Debugging log
// setpending(PENDING); // Updates state dynamically

//       // const PENDING = data.reduce((acc:any, item:any) => acc + (item.Status || 0), 0);
//       // setpending(PENDING);
//       if (data.length > 0) {
//         const columns2 = [
//           { field: "status", headerName: "Pending", flex: 1 },
//         ];
//         setColumns4(columns2);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const runningDatacomplaint2 = async (value:any) => {
//     setStatus3(value);
//     setModal3(true);
//     try {
//       const response = await api.get(`Dashboard/GetComplaintsStatus?Status=inprogress`);
//       const data = response.data.data;
//       const inprogress = data.reduce((acc:any, item:any) => acc + (item.Status || 0), 0);
//       setprogress(inprogress);
//       if (data.length > 0) {
//         const columns2 = [
//           { field: "status", headerName: "inprogress", flex: 1 },
//         ];
//         setColumns4(columns2);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const runningDatacomplaint3 = async (value:any) => {
//     setStatus4(value);
//     setModal4(true);
//     try {
//       const response = await api.get(`Dashboard/GetComplaintsStatus?Status=JobWork`);
//       const data = response.data.data;
//       const JobWork = data.reduce((acc:any, item:any) => acc + (item.Status || 0), 0);
//       setoutsource(JobWork);
//       if (data.length > 0) {
//         const columns2 = [
//           { field: "status", headerName: "JobWork", flex: 1 },
//         ];
//         setColumns4(columns2);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };


//   const runningDatacomplaint4 = async (value:any) => {
//     setStatus5(value);
//     setModal5(true);
//     try {
//       const response = await api.get(`Dashboard/GetComplaintsStatus?Status=pending`);
//       const data = response.data.data;
//       const PENDING = data.reduce((acc:any, item:any) => acc + (item.Status || 0), 0);
//       setpending(PENDING);
//       if (data.length > 0) {
//         const columns2 = [
//           { field: "status", headerName: "PENDING", flex: 1 },
//         ];
//         setColumns4(columns2);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };


//   const runningDatacomplaint5 = async (value:any) => {
//     setStatus6(value);
//     setModal6(true);
//     try {
//       const response = await api.get(`Dashboard/GetComplaintsStatus?Status=Complete`);
//       const data = response.data.data;
//       const Complete = data.reduce((acc:any, item:any) => acc + (item.Status || 0), 0);
//       setclosed(Complete);
//       if (data.length > 0) {
//         const columns2 = [
//           { field: "status", headerName: "Complete", flex: 1 },
//         ];
//         setColumns4(columns2);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };







  
  
  // const runningData = async (value: any) => {

  //   setStatus1(value)
  //   setModal(true);
  //   try {
  //     const response = await api.get(`Dashboard/GetComplaintsVehicleStatus`);
  //     const data = response.data.data;

  //     const zonesWithIds = data.map((zone: any, index: any) => ({
  //       ...zone,
  //       serialNo: index + 1,
  //       id: index + 1,
  //     }));
  //     setZones4(zonesWithIds);

  //     // setSelectedRows(zonesWithIds.map((zone: any) => zone.id));
  //     setIsLoading4(false);

  //     if (data.length > 0) {
  //       const columns2: GridColDef[] = [
  //         {
  //           field: "serialNo",
  //           headerName: t("text.SrNo"),
  //           flex: 0.5,
  //           // headerClassName: "MuiDataGrid-colCell",
  //         },
  //         {
  //           field: "complaintOnVehicle",
  //           headerName: t("text.vehicleInWorkShop"),
  //           flex: 1,
  //           // headerClassName: "MuiDataGrid-colCell",
  //         },

          

  //         {
  //           field: "inSideVehicle",
  //           headerName: t("text.inhouse"),
  //           flex: 1,
  //           // headerClassName: "MuiDataGrid-colCell",
  //         },
  //         {
  //           field: "outSideVehicle",
  //           headerName: t("text.outsource"),
  //           flex: 1,
  //           // headerClassName: "MuiDataGrid-colCell",
  //         },

  //         {
  //           field: "completeVehicle",
  //           headerName: t("text.completeVehicle"),
  //           flex: 1,
  //           // headerClassName: "MuiDataGrid-colCell",
  //         },

  //         {
  //           field: "totWVehicle",
  //           headerName: t("text.totalVehicle"),
  //           flex: 1,
  //           // headerClassName: "MuiDataGrid-colCell",
  //         },
  //       ];
  //       setColumns4(columns2 as any);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };



  const adjustedColumns4 = columns4.map((column: any) => ({
    ...column,
  }));



  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const formatDate = (date: any) => {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };


  const formattedDate = formatDate(new Date());


  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));


  useEffect(() => {



  }, [getTop]);

  useEffect(() => {


  }, [getTop1]);




  const adjustedColumns1 = columns1.map((column: any) => ({
    ...column,
  }));



  const adjustedColumns2 = columns2.map((column: any) => ({
    ...column,
  }));

  const styles = `
  .wrap-text {
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
`;

  document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

  const handlePrint = () => {
    const rowsToPrint = getTop
      ? RepairOption.slice(0, 10)
      : RepairOption;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }


    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Vehicle Type</th>
            <th>Actual Price</th>
            <th>Expense</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.vehicleTypename}</td>
              <td>${row.actprice}</td>
              <td>${row.amount}</td>
              <td>${row.age}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;


    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>TOP HIGHER REPAIR EXPENSE REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };
  const handlePrint1 = () => {
    const rowsToPrint = getTop
      ? ComplaintsOption.slice(0, 10)
      : ComplaintsOption;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }


    const printContent = `
      <table>
        <thead>
          <tr>
            <th>vehicle No.</th>
            <th>No. Of Complaints Type</th>
            <th>total days </th>
            <th>Expense</th>
           
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.noOfComplaints}</td>
              <td>${row.totaldays}</td>
              <td>${row.amount}</td>
             
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;


    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>COMPLAINTS REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };

  const handlePrint2 = () => {
    const rowsToPrint = getTop
      ? ReorderOption.slice(0, 10)
      : ReorderOption;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }


    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Unit Type</th>
            <th>Reorder Level</th>
            <th>Balance</th>
            <th>Critical</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.itemName}</td>
              <td>${row.unitName}</td>
              <td>${row.reorderLevel}</td>
              <td>${row.bal}</td>
              <td>${row.critical}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;


    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ITEM TO BE ORDERED REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };

  const handlePrint3 = () => {
    const rowsToPrint = getTop
      ? OverDueOption.slice(0, 10)
      : OverDueOption;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }


    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Status</th>
            <th>Complaint Date</th>
            <th>Total Days</th>
            
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.status}</td>
              <td>${row.complaintDate}</td>
              <td>${row.totaldays}</td>
              
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;


    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>VEHICLE OVERDUE STATUS REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };

  const handlePrint4 = () => {
    const rowsToPrint = getTop
      ? IssuedStatusOption.slice(0, 10)
      : IssuedStatusOption;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }


    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Issued</th>
           
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.itemName}</td>
              <td>${row.Issued}</td>
           
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;


    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ITEM ISSUED TODAY REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };

  const handlePrint5 = () => {
    const rowsToPrint = getTop
      ? RepairOption.slice(0, 10)
      : RepairOption;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }


    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Vehicle Type</th>
            <th>Actual Price</th>
            <th>Expense</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.vehicleTypename}</td>
              <td>${row.actprice}</td>
              <td>${row.amount}</td>
              <td>${row.age}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;


    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };


  const adjustedColumns3 = columns3.map((column: any) => ({
    ...column,
  }));



  return (


    <div>

      <Box sx={{ marginTop: 3 }}>

        <Grid container spacing={2}>

          {items.map((item) => (
            <Grid item xs={6} sm={4} md={2} key={item.id}>
              <Card
                onClick={() => handleClick(item.id)}
                sx={{
                  width: "150px",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                  backgroundColor: "#fff",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  borderLeft: `4px solid ${item.id === 0
                    ? "blue"
                    : item.id === 1
                      ? "red"
                      : item.id === 2
                        ? "green"
                        : item.id === 3
                          ? "orange"
                          : item.id === 4
                            ? "purple"
                            : "teal"
                    }`,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    borderColor: "#3498db",
                  },
                }}
              >
                <Box sx={{ fontSize: "30px" }}>{item.icon}</Box>
                <CardContent sx={{ padding: 0, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      color: "black",
                    }}
                  >
                    {item.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div>
        <div
        >
          <CardContent>
          </CardContent>
        </div>
      </div>
      <div
      >
        <CardContent>
        </CardContent>
      </div>

      {value === 0 && (
        <div>
          <Grid container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6} sm={6}>
                <Accordion expanded={true}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{ backgroundColor: "#3492eb", color: "#fff" }}
                  >

                    {isShow && (
                      <Typography style={{ fontWeight: 600, fontSize: "16px" }}>

                        Top Higher Repair Expense
                      </Typography>
                    )}

                    {isShow2 && (
                      <Typography style={{ fontWeight: 600, fontSize: "16px" }}>

                        Complaints
                      </Typography>
                    )}
                    {isShow3 && (
                      <Typography style={{ fontWeight: 600, fontSize: "16px" }}>

                        Item To Be Ordered
                      </Typography>
                    )}
                    {isShow4 && (
                      <Typography style={{ fontWeight: 600, fontSize: "16px" }}>

                        Vehicle Overdue Status
                      </Typography>
                    )}
                    {isShow5 && (
                      <Typography style={{ fontWeight: 600, fontSize: "16px" }}>

                        Item Issued Today
                      </Typography>
                    )}






                  </AccordionSummary>
                  <AccordionDetails style={{ background: "#f2f8fa", height: "50vh", overflow: "auto" }}>
                    {isShow && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} lg={2}>
                          <PrintIcon
                            fontSize="large"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={handlePrint}
                          />
                        </Grid>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                            />
                          }
                          label="Get Top 10 Records"
                        />
                        <Grid item xs={12} sm={12} lg={12}>
                          {isLoading1 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <div ref={reportRef}>
                              <DataGrid
                                rows={RepairOption.length > 0 ? RepairOption : []}
                                columns={[
                                  { field: "vehicleNo", headerName: "Vehicle No.", flex: 1 },
                                  {
                                    field: "vehicleTypename",
                                    headerName: "Vehicle Type",
                                    flex: 1,
                                  },
                                  { field: "actprice", headerName: "Actual Price", flex: 1 },
                                  { field: "amount", headerName: "Expense", flex: 1 },
                                  { field: "age", headerName: "Age", flex: 1 },
                                  // {
                                  //   field: "actions",
                                  //   headerName: "Actions",
                                  //   flex: 1,
                                  //   renderCell: (params) => (
                                  //     <Stack
                                  //       spacing={1}
                                  //       direction="row"
                                  //       sx={{ alignItems: "center" }}
                                  //     >

                                  //     </Stack>
                                  //   ),
                                  // },
                                ]}
                                autoHeight
                               
                                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                  value: size,
                                  label: `${size}`,
                                }))}
                                initialState={{
                                  pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                slotProps={{
                                  toolbar: { showQuickFilter: false },
                                }}
                                sx={{
                                  border: 0,
                                  "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white",
                                  },
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {isShow2 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} lg={2}>
                          <PrintIcon
                            fontSize="large"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={handlePrint1}
                          />
                        </Grid>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                            />
                          }
                          label="Get Top 10 Records"
                        />
                        <Grid item xs={12} sm={12} lg={12}>
                          {isLoading1 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <div ref={reportRef}>
                              <DataGrid
                                rows={ComplaintsOption.length > 0 ? ComplaintsOption : []}
                                columns={[
                                  // { field: "serialNo", headerName: "Sr No.", flex: 1 },
                                  { field: "vehicleNo", headerName: "Vehicle No.", flex: 1 },
                                  { field: "noOfComplaints", headerName: "Complaints", flex: 1 },
                                  { field: "totaldays", headerName: "Total Days", flex: 1 },
                                  { field: "amount", headerName: "Expense", flex: 1 },
                                  // {
                                  //   field: "actions",
                                  //   headerName: "Actions",
                                  //   flex: 1,
                                  //   renderCell: (params) => (
                                  //     <Stack
                                  //       spacing={1}
                                  //       direction="row"
                                  //       sx={{ alignItems: "center" }}
                                  //     >

                                  //     </Stack>
                                  //   ),
                                  // },
                                ]}
                                autoHeight
                                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                  value: size,
                                  label: `${size}`,
                                }))}
                                initialState={{
                                  pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                slotProps={{
                                  toolbar: { showQuickFilter: false },
                                }}
                                sx={{
                                  border: 0,
                                  "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white",
                                  },
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {isShow3 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} lg={2}>
                          <PrintIcon
                            fontSize="large"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={handlePrint2}
                          />
                        </Grid>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                            />
                          }
                          label="Get Top 10 Records"
                        />
                        <Grid item xs={12} sm={12} lg={12}>
                          {isLoading1 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <div ref={reportRef}>
                              <DataGrid
                                rows={ReorderOption.length > 0 ? ReorderOption : []}
                                columns={[
                                  //  { field: "serialNo", headerName: "Sr No.", flex: 1 },
                                  { field: "itemName", headerName: "Item", flex: 1 },
                                  { field: "unitName", headerName: "Unit", flex: 1 },
                                  { field: "reorderLevel", headerName: "Reorder", flex: 1 },
                                  { field: "bal", headerName: "Balance", flex: 1 },
                                  { field: "critical", headerName: "Critical", flex: 1 },
                                  // {
                                  //   field: "actions",
                                  //   headerName: "Actions",
                                  //   flex: 1,
                                  //   renderCell: (params) => (
                                  //     <Stack
                                  //       spacing={1}
                                  //       direction="row"
                                  //       sx={{ alignItems: "center" }}
                                  //     >

                                  //     </Stack>
                                  //   ),
                                  // },
                                ]}
                                autoHeight
                                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                  value: size,
                                  label: `${size}`,
                                }))}
                                initialState={{
                                  pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                slotProps={{
                                  toolbar: { showQuickFilter: false },
                                }}
                                sx={{
                                  border: 0,
                                  "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white",
                                  },
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {isShow4 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} lg={2}>
                          <PrintIcon
                            fontSize="large"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={handlePrint3}
                          />
                        </Grid>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                            />
                          }
                          label="Get Top 10 Records"
                        />
                        <Grid item xs={12} sm={12} lg={12}>
                          {isLoading1 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <div ref={reportRef}>
                              <DataGrid
                                rows={OverDueOption.length > 0 ? OverDueOption : []}
                                columns={[
                                  // { field: "serialNo", headerName: "Sr No.", flex: 1 },
                                  { field: "vehicleNo", headerName: "Vehicle No.", flex: 1 },
                                  { field: "status", headerName: "Status", flex: 1 },
                                  { field: "complaintDate", headerName: "Complaint Date", flex: 1 },
                                  { field: "totaldays", headerName: "Days", flex: 1 },
                                  // {
                                  //   field: "actions",
                                  //   headerName: "Actions",
                                  //   flex: 1,
                                  //   renderCell: (params) => (
                                  //     <Stack
                                  //       spacing={1}
                                  //       direction="row"
                                  //       sx={{ alignItems: "center" }}
                                  //     >

                                  //     </Stack>
                                  //   ),
                                  // },
                                ]}
                                autoHeight
                                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                  value: size,
                                  label: `${size}`,
                                }))}
                                initialState={{
                                  pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                slotProps={{
                                  toolbar: { showQuickFilter: false },
                                }}
                                sx={{
                                  border: 0,
                                  "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white",
                                  },
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {isShow5 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} lg={2}>
                          <PrintIcon
                            fontSize="large"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={handlePrint4}
                          />
                        </Grid>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                            />
                          }
                          label="Get Top 10 Records"
                        />
                        <Grid item xs={12} sm={12} lg={12}>
                          {isLoading1 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <div ref={reportRef}>
                              <DataGrid
                                rows={IssuedStatusOption.length > 0 ? IssuedStatusOption : []}
                                columns={[
                                  // { field: "serialNo", headerName: "Sr No.", flex: 1 },
                                  { field: "itemName", headerName: "Item Name", flex: 1 },
                                  { field: "Issued", headerName: "Issued", flex: 1 },
                                  // {
                                  //   field: "actions",
                                  //   headerName: "Actions",
                                  //   flex: 1,
                                  //   renderCell: (params) => (
                                  //     <Stack
                                  //       spacing={1}
                                  //       direction="row"
                                  //       sx={{ alignItems: "center" }}
                                  //     >

                                  //     </Stack>
                                  //   ),
                                  // },
                                ]}
                                autoHeight
                                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                  value: size,
                                  label: `${size}`,
                                }))}
                                initialState={{
                                  pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                slotProps={{
                                  toolbar: { showQuickFilter: false },
                                }}
                                sx={{
                                  border: 0,
                                  "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white",
                                  },
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {isShow6 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} lg={2}>
                          <PrintIcon
                            fontSize="large"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={handlePrint5}
                          />
                        </Grid>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                            />
                          }
                          label="Get Top 10 Records"
                        />
                        <Grid item xs={12} sm={12} lg={12}>
                          {isLoading1 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <div ref={reportRef}>
                              <DataGrid
                                rows={ComplaintsOption.length > 0 ? ComplaintsOption : []}
                                columns={[
                                  //  { field: "serialNo", headerName: "Sr No.", flex: 1 },
                                  { field: "vehicleNo", headerName: "Vehicle", flex: 1 },
                                  { field: "noOfComplaints", headerName: "Complaints", flex: 1 },
                                  { field: "totaldays", headerName: "Total Days", flex: 1 },
                                  { field: "amount", headerName: "Expense", flex: 1 },
                                  // {
                                  //   field: "actions",
                                  //   headerName: "Actions",
                                  //   flex: 1,
                                  //   renderCell: (params) => (
                                  //     <Stack
                                  //       spacing={1}
                                  //       direction="row"
                                  //       sx={{ alignItems: "center" }}
                                  //     >

                                  //     </Stack>
                                  //   ),
                                  // },
                                ]}
                                autoHeight
                                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                  value: size,
                                  label: `${size}`,
                                }))}
                                initialState={{
                                  pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                slotProps={{
                                  toolbar: { showQuickFilter: false },
                                }}
                                sx={{
                                  border: 0,
                                  "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white",
                                  },
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12} lg={3} sm={3}>
      <motion.div initial="hidden" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Card
          elevation={4}
          style={{
            marginLeft: "1%",
            border: ".5px solid transparent",
            borderRadius: "10px",
            height: "60vh",
            overflow: "auto",
          }}
        >
          <Grid
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#e9f4f7",
              overflow: "auto",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                padding: "17px",
                background: "#7fd1eb",
                fontWeight: "bold",
              }}
            >
              Complaint Status <br />
            </Typography>
            <div style={{ padding: "5px" }}>
              {/* Render Progress Bars */}
              {Object.keys(complaints).map((key) => (
                <div key={key}>
                  <Typography
                    variant="h6"
                    style={{ color: getColor(key), cursor: "pointer", fontSize: "12px" }}
                    onClick={() => alert(`${key.toUpperCase()}: ${complaints[key as keyof typeof complaints]}`)}
                  >
                    {key.toUpperCase()}: {complaints[key as keyof typeof complaints]}
                  </Typography>
                  <ProgressBar
                    completed={calculatePercentage(complaints[key as keyof typeof complaints])}
                    bgColor={getColor(key)}
                  />
                </div>
              ))}
            </div>
          </Grid>
        </Card>
      </motion.div>
    </Grid>



              {/* <Grid item xs={12} lg={3} sm={3}>
                <motion.div initial="hidden" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    elevation={4}
                    style={{
                      marginLeft: "1%",
                      border: ".5px solid transparent",
                      borderRadius: "10px",
                      height: "60vh",
                      overflow: "auto",
                    }}
                  >
                    <Grid
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#e9f4f7",
                        overflow: "auto",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          padding: "17px",
                          background: "#7fd1eb",
                          fontWeight: "bold",
                        }}
                      >
                        Complaint Status <br />

                      </Typography>
                      <div style={{ padding: "5px" }}>

                        <Typography
                          variant="h6"
                          style={{ color: "red", cursor: "pointer", fontSize: "12px" }}
                        >
                          <span
                            onClick={() => {
                              runningDatacomplaint1("PENDING");
                            }}
                          >
                            PENDING: {ispending}
                          </span>
                        </Typography>

                        {/* <ProgressBar completed={Math.round((ispending ) * 100)} bgColor="red" /> */}

                        {/* <ProgressBar completed={Math.round((ispending / totalComplaints) * 100)} bgColor="red" /> */}


{/* 
                        <Typography
                          variant="h6"
                          style={{ color: "#e3be29", cursor: "pointer", fontSize: "12px" }}
                        >
                          <span
                            onClick={() => {
                              runningDatacomplaint2("PROGRESS");
                             
                            }}
                          >
                            IN PROGRESS: {isprogress}
                          </span>
                        </Typography>
                        <ProgressBar completed={Math.round((isprogress) * 100)} bgColor="#e3be29" />


                        <Typography
                          variant="h6"
                          style={{ color: "blue", cursor: "pointer", fontSize: "12px" }}
                        >
                          <span
                            onClick={() => {
                              runningDatacomplaint3("OUTSOURCE");

                            }}
                          >
                            OUTSOURCE: {isoutsource}
                          </span>
                        </Typography>
                        <ProgressBar completed={Math.round((isoutsource ) * 100)} bgColor="blue" />

                        <Typography
                          variant="h6"
                          style={{ color: "purple", cursor: "pointer", fontSize: "12px" }}
                        >
                          <span
                            onClick={() => {
                              runningDatacomplaint4("INHOUSE");

                            }}
                          >
                            INHOUSE: {isinhouse}
                          </span>
                        </Typography>
                        <ProgressBar completed={Math.round((isinhouse) * 100)} bgColor="purple" />

                        <Typography
                          variant="h6"
                          style={{ color: "green", cursor: "pointer", fontSize: "12px" }}
                        >
                          <span
                            onClick={() => {
                              runningDatacomplaint5("CLOSED");

                            }}
                          >

                            CLOSED: {isclosed}
                          </span>
                        </Typography>
                        <ProgressBar completed={Math.round((isclosed ) * 100)} bgColor="green" /> */}



                      {/* </div>
                    </Grid>
                  </Card>
                </motion.div>
              </Grid> */}
              <Grid item xs={12} lg={3} sm={3}>
      <motion.div initial="hidden" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Card
          elevation={4}
          style={{
            marginLeft: "1%",
            border: ".5px solid transparent",
            borderRadius: "10px",
            height: "60vh",
            overflow: "auto",
          }}
        >
          <Grid
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#e9f4f7",
              overflow: "auto",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                padding: "17px",
                background: "#7fd1eb",
                fontWeight: "bold",
              }}
            >
              Vehicles Standing in Workshop
            </Typography>
            <div style={{ padding: "5px" }}>
       {/* Vehicle in Workshop */}
<Typography
  variant="h6"
  style={{ color: "red", fontSize: "12px", cursor: "pointer" }}
  onClick={() => runningData("vehicleInWorkshop")}
>
  VEHICLE IN WORKSHOP: {isRunn}
</Typography>
<ProgressBar
  completed={Math.round((isRunn / totalVeh) * 100)}
  bgColor="red"
  baseBgColor="#f5f5f5"
  height="20px"
  labelColor="#fff"
  borderRadius="10px"
  isLabelVisible={true}
  customLabelStyles={{
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
  }}
  animateOnRender
/>

{/* Inhouse */}
<Typography
  variant="h6"
  style={{ color: "#e3be29", fontSize: "12px", cursor: "pointer" }}
  onClick={() => runningData("inhouse")}
>
  INHOUSE: {isIdle}
</Typography>
<ProgressBar completed={Math.round((isIdle / totalVeh) * 100)} bgColor="#e3be29"  baseBgColor="#f5f5f5"
  height="20px"
  labelColor="#fff"
  borderRadius="10px"
  isLabelVisible={true}
  customLabelStyles={{
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
  }}
  animateOnRender />

{/* Outsource */}
<Typography
  variant="h6"
  style={{ color: "blue", fontSize: "12px", cursor: "pointer" }}
  onClick={() => runningData("outsource")}
>
  OUTSOURCE: {isStop}
</Typography>
<ProgressBar completed={Math.round((isStop / totalVeh) * 100)} bgColor="blue"  baseBgColor="#f5f5f5"
  height="20px"
  labelColor="#fff"
  borderRadius="10px"
  isLabelVisible={true}
  customLabelStyles={{
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
  }}
  animateOnRender />

{/* Last 30 Days */}
<Typography
  variant="h6"
  style={{ color: "green", fontSize: "12px", cursor: "pointer" }}
  onClick={() => runningData("30days")}
>
  LAST 30 DAYS COMPLETED: {is30days}
</Typography>
<ProgressBar completed={Math.round((is30days / totalVeh) * 100)} bgColor="green" baseBgColor="#f5f5f5"
  height="20px"
  labelColor="#fff"
  borderRadius="10px"
  isLabelVisible={true}
  customLabelStyles={{
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
  }}
  animateOnRender />

{/* Total Vehicle */}
<Typography
  variant="h6"
  style={{ color: "black", fontSize: "15px", cursor: "pointer" , fontWeight:"bold" }}
>
  Total Vehicle: <span>{totalVeh}</span>
</Typography>


            </div>
          </Grid>
        </Card>
      </motion.div>
    </Grid>

              
            </Grid>

            <Grid
              xs={12}
              lg={12}
              sm={12}
              item
              sx={{ justifyContent: "center" }}
            >
              <Dialog

                open={isVisible}
                onClose={handleClose2}
                fullWidth
                maxWidth="lg"
                sx={{
                  "& .MuiDialogContent-root": {
                    padding: "20px",
                    height: "400px",
                  },
                }}


              />

            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
const getColor = (status: string) => {
  switch (status) {
    case "pending":
      return "red";
    case "inprogress":
      return "#e3be29";
    case "outsource":
      return "blue";
    case "inhouse":
      return "purple";
    case "closed":
      return "green";
    default:
      return "gray";
  }
};




