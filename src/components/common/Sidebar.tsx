import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Stack,
  Tooltip,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import call from "../../assets/images/phone-call.png";
import roles from "../../assets/images/role-model.png";
import tick from "../../assets/images/check-mark.png";
import crs from "../../assets/images/cross.png";
import log from "../../assets/images/profile.png";
import emails from "../../assets/images/gmail.png";
import genders from "../../assets/images/symbol.png";
import dobs from "../../assets/images/timetable.png";
import id from "../../assets/images/profile1.png";
import settings from "../../assets/images/settings.png";
import trans from "../../assets/images/translation.png";
import logout from "../../assets/images/logout.png";
import logged from "../../assets/images/permission.png";
import logo from "../../assets/images/recyclebinLogo.png";
import loged from "../../assets/images/DrawerLogo.png";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { Home } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import Typewriter from "./TypeWriter";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FolderIcon from "@mui/icons-material/Folder";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import "./Shine.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import names from "../../assets/images/id-card (2).png";
import backgrd from "../../assets/images/backgroundimage.jpg";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  // Typography,
} from "@mui/material";
import "./ThemeStyle.css";
import ThemeIcon from "../../assets/images/themes.png";
import ThemeIcon1 from "../../assets/images/themes1.png";

import {
  Brightness5,
  Brightness4,
  Waves,
  WbSunny,
  Forest,
  Flag,
} from "@mui/icons-material";
import api from "../../utils/Url";
import { toast } from "react-toastify";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import TreeView from "@mui/x-tree-view/TreeView";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

import { FaRegFolderOpen } from "react-icons/fa6";
import DescriptionIcon from "@mui/icons-material/Description";

import { FaFileLines } from "react-icons/fa6";

const drawerWidth = 225;

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

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function getGreeting() {
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) {
    greeting = {
      text: "Good Morning",
      color: "#FFFFE0",
      icon: "🌅", // Sunrise emoji
    };
  } else if (hour < 17) {
    greeting = {
      text: "Good Afternoon",
      color: "#FFE4B5",
      icon: "🌞", // Sun emoji
    };
  } else {
    greeting = {
      text: "Good Evening",
      color: "#FFDAB9",
      icon: "🌜", // Crescent moon emoji
    };
  }

  return greeting;
}

export default function MiniDrawer({ items }: any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [collapseIndex, setCollapseIndex] = React.useState<any>(null);
  const [activeMenu, setActiveMenu] = React.useState<number | null>(null);
  const [openlogo, setOpenlogo] = React.useState(true);
  const [homeColor, setHomeColor] = React.useState("inherit");
  const { t } = useTranslation();
  const [menuData, setMenuData] = React.useState([]);
  const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);

  const [openMenus, setOpenMenus] = React.useState<Set<number>>(new Set());

  const [expandedItems, setExpandedItems] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [treedata, setTreedata] = React.useState<any>([]);
  // console.log("data", treedata)
  const [check, setCheck] = React.useState<any>([]);

  const [searchValue, setSearchValue] = React.useState("");
  // const [filteredItems, setFilteredItems] = React.useState([]);
  const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

  const themes = [
    { name: "light-theme", icon: <Brightness5 /> },
    { name: "dark-theme", icon: <Brightness4 /> },
    { name: "ocean-theme", icon: <Waves /> },
    { name: "sunset-theme", icon: <WbSunny /> },
    { name: "forest-theme", icon: <Forest /> },
    { name: "bhagwa-theme", icon: <Flag /> },
  ];

  const greeting = getGreeting();

  let navigate = useNavigate();

  // function searchMenuItems(items: any, query: string) {
  //   const results = [];

  //   for (const menuItem of items) {
  //     if (menuItem.menuName.toLowerCase().includes(query.toLowerCase())) {
  //       results.push(menuItem);
  //     } else if (menuItem.items && menuItem.items.length > 0) {
  //       const matchingSubItems = menuItem.items.filter(
  //         (subItem: { menuName: string }) =>
  //           subItem.menuName.toLowerCase().includes(query.toLowerCase())
  //       );
  //       if (matchingSubItems.length > 0) {
  //         results.push({ ...menuItem, items: matchingSubItems });
  //       }
  //     }
  //   }
  //   return results;
  // }
  //  const buildMenuHierarchy = (permissions:any) => {
  //     const menuMap = new Map();

  //     // Map permissions by menuId
  //     permissions.forEach((perm:any) => {
  //       const menu = {
  //         menuId: perm.menuId,
  //         parentId: perm.parentId,
  //         menuName: perm.menuName,
  //         path: `/path-to/${perm.menuName.replace(/\s+/g, "-").toLowerCase()}`,
  //         children: []
  //       };
  //       menuMap.set(menu.menuId, menu);
  //     });

  //     // Assign children to their parents
  //     const rootMenus:any = [];
  //     menuMap.forEach((menu) => {
  //       if (menu.parentId === null) {
  //         rootMenus.push(menu);
  //       } else {
  //         const parentMenu = menuMap.get(menu.parentId);
  //         if (parentMenu) {
  //           parentMenu.children.push(menu);
  //         }
  //       }
  //     });

  //     return rootMenus;
  //   };

  React.useEffect(() => {
    //const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    setMenuData(items);
    
  }, []);

  const handleMenuClick = (menu: any) => {
    setActiveMenu(menu.menuId); // Highlight active menu

    if (menu.children && menu.children.length > 0) {
      toggleMenu(menu.menuId, menu.parentId); // Toggle submenu
    } else if (menu.path) {
      navigate(menu.path); // Navigate only if no children exist
    }
  };

  // const toggleMenu = (menuId: number) => {
  //   setOpenMenus((prev) => {
  //     const newOpenMenus = new Set(prev);
  //     newOpenMenus.has(menuId)
  //       ? newOpenMenus.delete(menuId)
  //       : newOpenMenus.add(menuId);
  //     return newOpenMenus;
  //   });
  // };

  const toggleMenu = (menuId: number, parentId: number | null) => {
    setOpenMenus((prev: Set<number>) => {
      const newOpenMenus = new Set(prev);

      if (newOpenMenus.has(menuId)) {
        // If the clicked menu is already open, close it
        newOpenMenus.delete(menuId);
      } else {
        // Close other parent menus if this is a top-level menu (parentId === null)
        if (parentId === null) {
          newOpenMenus.clear(); // Collapse all parent menus
        }

        newOpenMenus.add(menuId); // Open the clicked menu
      }

      return newOpenMenus;
    });
  };

  const parentMenuOrder = [
    "Vehicle Management",
    "Store Management",
    "Communication",
    "Vendor Info",
    "Employee Info",
    "Reports",
    "Admin",
  ];

  // Predefined child order for "Store Management"
  const storeManagementChildOrder = [
    "Item Detail",
    "Indent For Staff",
    "WorkShop Indent",
    "Item Issue",
    "Item Return",
    "PurchaseOrder",
    "Material Receipt Note",
    "Quality Check",
    "Store Master",
    "Stock Opening",
    "Off.Purchase Indent",
    "PurchaseInvoice",
  ];

  // Function to sort parent menus based on predefined order
  const sortParentMenus = (menus: any[]) => {
    const orderMap = new Map(
      parentMenuOrder.map((name, index) => [name, index])
    );

    return menus.slice().sort((a, b) => {
      const indexA: any = orderMap.has(a.menuName)
        ? orderMap.get(a.menuName)
        : Infinity;
      const indexB: any = orderMap.has(b.menuName)
        ? orderMap.get(b.menuName)
        : Infinity;
      return indexA - indexB;
    });
  };

  // Function to sort child menus
  const sortChildMenus = (parentMenuName: string, menus: any[]) => {
    if (parentMenuName === "Store Management") {
      const orderMap = new Map(
        storeManagementChildOrder.map((name, index) => [name, index])
      );

      return menus.slice().sort((a, b) => {
        const indexA: any = orderMap.has(a.menuName)
          ? orderMap.get(a.menuName)
          : Infinity;
        const indexB: any = orderMap.has(b.menuName)
          ? orderMap.get(b.menuName)
          : Infinity;
        return indexA - indexB;
      });
    }
    return menus.slice().sort((a, b) => a.menuId - b.menuId); // Default sorting by menuId
  };

  const renderMenu = (menus: any[], level = 0, parentMenuName = "") => {
    // Sort parent menus at level 0, otherwise sort by menuId or predefined order
    const sortedMenus =
      level === 0
        ? sortParentMenus(menus)
        : sortChildMenus(parentMenuName, menus);

    return sortedMenus.map((menu: any) => (
      <List key={menu.menuId} sx={{ paddingY: 0.5, paddingX: 0 }}>
        <Divider />

        <ListItem
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: activeMenu === menu.menuId ? "#dfe6f5" : "inherit",
            paddingLeft: `${level * 14}px`,
            paddingY: 0.3,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#ccccff" },
            borderRadius: "6px",
            transition: "background 0.2s ease-in-out",
          }}
          onClick={() => handleMenuClick(menu)}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <ListItemIcon
              sx={{
                minWidth: "32px",
                justifyContent: "center",
                color: activeMenu === menu.menuId ? "#FF0000" : "#333",
                fontWeight: 600,
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(menu.menuId, menu.parentId);
              }}
            >
              {menu.children && menu.children.length > 0 ? (
                openMenus.has(menu.menuId) ? (
                  <FaRegFolderOpen
                    style={{ color: "#42AEEE", fontSize: "18px" }}
                  />
                ) : (
                  <FolderIcon style={{ color: "#42AEEE", fontSize: "18px" }} />
                )
              ) : (
                <DescriptionIcon
                  style={{ color: "#42AEEE", fontSize: "18px" }}
                />
              )}
            </ListItemIcon>

            {/* <ListItemText
              primary={menu.menuName}
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                color: activeMenu === menu.menuId ? "#0056b3" : "var(--grid-menuColor)",
                transition: "color 0.2s ease-in-out",
              }}
            /> */}
            <Tooltip title={menu.menuName} arrow>
              <ListItemText
                primary={
                  open ? menu.menuName : menu.menuName.charAt(0).toUpperCase()
                } // Show first letter if closed
                sx={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  color: activeMenu === menu.menuId ? "#0056b3" : "var(--grid-menuColor)",
                  transition: "color 0.2s ease-in-out",
                  // Styling for truncation when menu name is long
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              />
            </Tooltip>
          </Box>

          {menu.children && menu.children.length > 0 && (
            <ListItemIcon
              sx={{
                paddingRight: "16px",
                minWidth: "32px",
                justifyContent: "flex-end",
                cursor: "pointer",
                color: "#42AEEE",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(menu.menuId, menu.parentId);
              }}
            >
              {openMenus.has(menu.menuId) ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </ListItemIcon>
          )}
        </ListItem>

        {openMenus.has(menu.menuId) &&
          menu.children &&
          menu.children.length > 0 && (
            <List sx={{ paddingLeft: 2, backgroundColor: "inherit" }}>
              {renderMenu(menu.children, level + 1, menu.menuName)}
            </List>
          )}
      </List>
    ));
  };

  // const handleMenuClick = (menu: any) => {
  //   setActiveMenu(menu.menuId); // Highlight active menu

  //   if (menu.children && menu.children.length > 0) {
  //     toggleMenu(menu.menuId); // Toggle submenu
  //   } else if (menu.path) {
  //     navigate(menu.path); // Navigate only if no children exist
  //   }
  // };

  // const toggleMenu = (menuId: number) => {
  //   setOpenMenus((prev) => {
  //     const newOpenMenus = new Set(prev);
  //     newOpenMenus.has(menuId) ? newOpenMenus.delete(menuId) : newOpenMenus.add(menuId);
  //     return newOpenMenus;
  //   });
  // };

  // const renderMenu = (menus: any[], level = 0) => {
  //   return menus.map((menu: any) => (
  //     <List key={menu.menuId} sx={{ paddingY: 0.5, paddingX: 0 }}>
  //       <Divider />

  //       {/* Menu Item */}
  //       <ListItem
  //         sx={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           alignItems: "center",
  //           backgroundColor: activeMenu === menu.menuId ? "#dfe6f5" : "inherit",
  //           paddingLeft: `${level * 14}px`,
  //           paddingY: 0.3, // Reduced vertical padding
  //           cursor: "pointer",
  //           "&:hover": { backgroundColor: "#f8f9fa" },
  //           borderRadius: "6px",
  //           transition: "background 0.2s ease-in-out",
  //         }}
  //         onClick={() => handleMenuClick(menu)}
  //       >
  //         {/* Left Section: Icon + Menu Name */}
  //         <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
  //           <ListItemIcon
  //             sx={{
  //               minWidth: "32px",
  //               justifyContent: "center",
  //               color: activeMenu === menu.menuId ? "#FF0000" : "#333",
  //               fontWeight: 600,
  //             }}
  //             onClick={(e) => {
  //               e.stopPropagation(); // Prevents ListItem click event
  //               toggleMenu(menu.menuId);
  //             }}
  //           >
  //             {menu.children && menu.children.length > 0 ? (
  //               openMenus.has(menu.menuId) ? (
  //                 <FaRegFolderOpen style={{ color: "#42AEEE", fontSize: "18px" }} />
  //               ) : (
  //                 <FolderIcon style={{ color: "#42AEEE", fontSize: "18px" }} />
  //               )
  //             ) : (
  //               <DescriptionIcon style={{ color: "#42AEEE", fontSize: "18px" }} />
  //             )}
  //           </ListItemIcon>

  //           {/* Tooltip added here for full menu name */}
  //           <Tooltip title={menu.menuName} arrow>
  //             <ListItemText
  //               primary={open ? menu.menuName : menu.menuName.charAt(0).toUpperCase()} // Show first letter if closed
  //               sx={{
  //                 fontWeight: "bold",
  //                 fontSize: "13px",
  //                 color: activeMenu === menu.menuId ? "#0056b3" : "#333",
  //                 transition: "color 0.2s ease-in-out",
  //                 // Styling for truncation when menu name is long
  //                 overflow: "hidden",
  //                 whiteSpace: "nowrap",
  //                 textOverflow: "ellipsis",
  //               }}
  //             />
  //           </Tooltip>
  //         </Box>

  //         {/* ✅ Right Section: Caret for Expand/Collapse */}
  //         {menu.children && menu.children.length > 0 && (
  //           <ListItemIcon
  //             sx={{
  //               paddingRight: "16px",
  //               minWidth: "32px",
  //               justifyContent: "flex-end",
  //               cursor: "pointer",
  //               color: "#42AEEE",
  //             }}
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               toggleMenu(menu.menuId);
  //             }}
  //           >
  //             {openMenus.has(menu.menuId) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
  //           </ListItemIcon>
  //         )}
  //       </ListItem>

  //       {/* Recursive Rendering for Submenus */}
  //       {openMenus.has(menu.menuId) && menu.children && menu.children.length > 0 && (
  //         <List sx={{ paddingLeft: 2, backgroundColor: "inherit" }}>
  //           {renderMenu(menu.children, level + 1)}
  //         </List>
  //       )}
  //     </List>
  //   ));
  // };

  interface MenuItem {
    Icon: any;
    displayNo: number;
    menuId: number;
    items: MenuItem[];
    label: string;
    menuName: string;
    path: string;
  }

  const handleNavigation = (path: any) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleAutocompleteChange = (event: any, value: any) => {
    const selectedItem = items.find((item: any) =>
      item.items.some((subItem: any) => subItem.name === value)
    );
    if (selectedItem) {
      const selectedSubItem = selectedItem.items.find(
        (subItem: any) => subItem.name === value
      );
      if (selectedSubItem) {
        handleNavigation(selectedSubItem.path);
      }
    }
  };

  const allMenuNames = items.reduce((acc: any, item: { items: any[] }) => {
    if (item.items) {
      return [
        ...acc,
        ...item.items.map((subItem: { menuName: any }) => subItem.menuName),
      ];
    }
    return acc;
  }, []);

  const filteredItemed = allMenuNames.filter((item: string) =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  // const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("first 1", e.target.value);
  //   const value = e.target.value.toLowerCase();
  //   setSearchValue(value);

  //   // Filter menu items based on search value (before rendering)
  //   const filtered = items.filter(
  //     (menu: any) =>
  //       menu.menuName.toLowerCase().includes(value) ||
  //       (menu.children &&
  //         menu.children.some((child: any) =>
  //           child.menuName.toLowerCase().includes(value)
  //         ))
  //   );

  //   setFilteredItems(filtered); // Store filtered menu items, NOT rendered JSX
  // };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const expandedMenuIds: any = new Set();

    if (value === "") {
      // If search is cleared, collapse all menus
      setFilteredItems(items);
      setOpenMenus(new Set());
      return;
    }

    const filtered = items.reduce((acc: any, menu: any) => {
      if (menu.menuName.toLowerCase().includes(value)) {
        acc.push(menu);
        expandedMenuIds.add(menu.menuId);
      } else if (menu.children) {
        const filteredChildren = menu.children.filter((child: any) =>
          child.menuName.toLowerCase().includes(value)
        );

        if (filteredChildren.length > 0) {
          acc.push({ ...menu, children: filteredChildren });
          expandedMenuIds.add(menu.menuId);
        }
      }
      return acc;
    }, []);

    setFilteredItems(filtered);
    setOpenMenus(expandedMenuIds);
  };

  var [date, setDate] = React.useState(new Date());

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split(" ")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  const handleSubMenuClick = (index: any) => {
    console.log(index);
    setSelectedSubMenu(index);
  };
  const resetHomeColor = () => {
    // setHomeColor("inherit");
    setHomeColor("#FF0000");
    // setHomeColor("");
  };

  const backgroundStyle = {
    background: "linear-gradient(45deg, #fff, #f0f)",
    backgroundSize: "400% 400%",
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setHomeColor("inherit");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const routeChangeHome = () => {
    let path = `/home`;
    navigate(path);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    setOpenlogo(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenlogo(false);
  };

  const Logout = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("username");
    localStorage.removeItem("ApplicationFlow");
    localStorage.removeItem("permissions");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  function onClick(e: any, item: any) {
    // console.log("Main " + item);

    let path = item.path;
    if (path == "" || path == null || path == "undefind") {
      window.alert("Path Not Found ????");
    } else {
      navigate(path);
    }
  }

  // var data = JSON.parse(localStorage.getItem("userdata")!);
  // var menudata = data[0]["userdetail"];
  // var username =
  //   menudata[0]["firsT_NAME"] +
  //   " " +
  //   menudata[0]["middlE_NAME"] +
  //   " " +
  //   menudata[0]["suR_NAME"];
  const { i18n } = useTranslation();

  const changeLanguage = (language: any) => {
    // console.log("check", language);

    i18n.changeLanguage(language);
    localStorage.setItem("preferredLanguage", language);
  };
  var currentLanguage = localStorage.getItem("preferredLanguage");
  var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

  const userData = JSON.parse(localStorage.getItem("userdata")!) || {};
  const userDetail = userData[0]?.userdetail || [];
  // console.log(userDetail);

  const collapsehamndle = (index: any) => {
    // console.log(index);
    if (index == collapseIndex) {
      setCollapseIndex(-1);
    } else {
      setCollapseIndex(index);
    }
  };
  // console.log("items", items);

  const getImageForFirstName = (
    firsT_NAME: any,
    middlE_NAME: any,
    suR_NAME: any
  ) => {
    const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
    const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
    const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
    return `${firstLetter}${secondLetter}${thirdLetter}`;
  };

  const getGenderText = (gendeR_ID: any) => {
    switch (gendeR_ID) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return "Unknown";
    }
  };

  const handleMyProfileClick = () => {
    // console.log("My Profile clicked" + profileDrawerOpen);
    setProfileDrawerOpen(!profileDrawerOpen);
  };

  const currentPathname = window.location.pathname;
  const segments = currentPathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;

  function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    // console.info("You clicked a breadcrumb.");
  }

  const handleClickhome = () => {
    let path = `/home`;
    navigate(path);
  };

  function FirstLetters(props: any) {
    const { text } = props;

    const words = text.split(" ");

    // Extract the first letter from each word
    const firstLetters = words.map((word: any) => word.charAt(0));

    // Join the first letters back into a string
    const result = firstLetters.join("");

    return <div>{result}</div>;
  }

  const handleRightClick = (path: any) => (e: any) => {
    e.preventDefault();
    window.open(path, "_blank");
  };

  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  const [selectedTheme, setSelectedTheme] = React.useState(() => {
    const storedTheme = localStorage.getItem("theme");

    return storedTheme ? storedTheme : themes[0]["name"];
  });

  React.useEffect(() => {
    console.log(selectedTheme);
    document.body.className = selectedTheme;

    localStorage.setItem("theme", selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (theme: any) => {
    setSelectedTheme(theme);
    setShowThemeMenu(false);
  };

  const handleCloseSelect = () => {
    setShowThemeMenu(false);
  };

  const headerColor1 = `var(--header-background)`;
  const drawerStyles = `var(--drawer-background)`;

  let ID: any = localStorage.getItem("username");
  ID = ID.replace(/^"(.*)"$/, "$1");
  const handlePermissionClick = () => {
    if (ID) {
      console.log("id check 175", ID);
      getNode(ID);
    } else {
      toast.error("ID not found");
    }
    setIsModalOpen(true);
    console.log("first");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getNode = (id: any) => {
    const collectData = {
      id: -1,
      nodeID: -1,
      titleID: -1,
      user_Id: id,
    };
    api
      .post(`NewNodeMaster/GetNewNodeMasterHeirarical`, collectData)
      .then((res: any) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setTreedata(res.data.data);
          const allNodeIds = getAllNodeIds(res.data.data);
          setExpandedItems(allNodeIds);
        } else {
          toast.error("Data is null or empty");
        }
      });
  };

  const getAllNodeIds = (nodes: any[]): string[] => {
    let ids: string[] = [];

    const collectIds = (nodes: any[]) => {
      nodes.forEach((node) => {
        ids.push(node.id.toString());
        if (node.childnode) {
          collectIds(node.childnode);
        }
      });
    };

    collectIds(nodes);

    return ids;
  };

  const defaultSelectedNodeId = parseInt(localStorage.getItem("id") + "");

  React.useEffect(() => {
    // Set default selected node here
    if (defaultSelectedNodeId) {
      setCheck([defaultSelectedNodeId]);
    }

    const initialExpanded = getAllNodeIds(treedata);
    setExpandedItems(initialExpanded);
  }, [defaultSelectedNodeId, treedata]);

  const [nodeId, setnodeId] = React.useState<any>(0);
  const [nodeNames, setNodeNames] = React.useState<string>("");

  // Effect to apply the theme from local storage

  const handleToggle = (id: number, menuName: string) => () => {
    const currentIndex = check.indexOf(id);
    //const newChecked = [...check];
    const newChecked = currentIndex === -1 ? [id] : [];
    //const updatedChecked = currentIndex === -1 ? [id] : [];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheck(newChecked);

    // setExpandedItems((prevExpanded) =>
    //   prevExpanded.includes(id.toString())
    //     ? prevExpanded.filter((item) => item !== id.toString())
    //     : [...prevExpanded, id.toString()]
    // );

    console.log("Checked data:", menuName);
    console.log("Checked data:", id);

    setNodeNames(menuName);
    setnodeId(id);
    // handleSave(id, name);
  };

  const handleSave = () => {
    console.log("handleSave function called");

    if (nodeId != 0 || nodeNames != "") {
      localStorage.setItem("id", nodeId);
      localStorage.setItem("nodeName", nodeNames);
      console.log("Checked Save:", { nodeId, nodeNames });

      handleCloseModal();
    } else {
      toast.error("Please Retry... Network Issues");
    }
  };

  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      itemId={String(nodes.id)}
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={check.indexOf(nodes.id) !== -1}
            // onChange={handleToggle(nodes.id)}

            onChange={handleToggle(nodes.id, nodes.menuName)}
            onClick={(event: any) => event.stopPropagation()}
          />

          <div style={{ marginLeft: 8 }}>{nodes.menuName}</div>
        </div>
      }
      onClick={() => toggleExpansion(nodes.id.toString())}
    >
      {Array.isArray(nodes.childnode)
        ? nodes.childnode.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  );

  const toggleExpansion = (nodeId: string) => {
    if (expandedItems.includes(nodeId)) {
      setExpandedItems(expandedItems.filter((item) => item !== nodeId));
    } else {
      setExpandedItems([...expandedItems, nodeId]);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open} style={{}}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `var(--header-background1)`,
            color: `var(--header-color1)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // paddingTop: "10px",
              // paddingBottom: "10px",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                // marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {!openlogo && <img src={logo} width={60} height={60} />}
          </div>

          <div style={{ fontSize: "2.5vw" }}>
          <div style={{ fontFamily: "Georgia, serif" }}>
            <span style={{ fontSize: "3vw", color:"#FFAE35" }}>V</span>
            <span style={{ fontSize: "2.2vw" }}>ehicle </span>
            <span style={{ fontSize: "3vw", color:"#D50E00"}}>W</span>
            <span style={{ fontSize: "2.2vw" }}>orkshop </span>
            <span style={{ fontSize: "3vw", color:"#FFE100"}}>M</span>
            <span style={{ fontSize: "2.2vw" }}>anagement </span>
            <span style={{ fontSize: "3vw", color:"#e69f9f"}}>S</span>
            <span style={{ fontSize: "2.2vw" }}>ystem</span>
          </div>
          </div>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {/* {username[0].toUpperCase()} */}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            // onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: `var(--menu-background)`,
                color: `var(--menu-color)`,
                overflow: "auto",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                paddingRight: "10px",
                paddingLeft: "10px",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={logged} width={40} height={40} />
              </ListItemIcon>{" "}
              {/* {username} */}
              {localStorage.getItem("username")?.replaceAll('"', "")}
            </MenuItem>

            {/* <MenuItem > */}
            {/* <MenuItem onClick={handleMyProfileClick}>
              <ListItemIcon>
                <img src={id} width={30} height={30} />
              </ListItemIcon>
              My Profile
            </MenuItem> */}

            <Divider />

            <MenuItem
              onClick={() => {
                localStorage.getItem("preferredLanguage") == "hi"
                  ? changeLanguage("en")
                  : changeLanguage("hi");
              }}
            >
              <ListItemIcon>
                <img src={trans} width={30} height={30} />
              </ListItemIcon>
              Translate -- {newLanguage}
            </MenuItem>

            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={settings} width={30} height={30} />
              </ListItemIcon>
              Settings
            </MenuItem> */}

            {/* <MenuItem onClick={handlePermissionClick}>
              <ListItemIcon>
                <img src={logged} width={40} height={40} alt="Permission" />
              </ListItemIcon>
              Permission
            </MenuItem> */}

            <MenuItem onClick={() => setShowThemeMenu(!showThemeMenu)}>
              <ListItemIcon>
                <img src={ThemeIcon} width={30} height={30} />
              </ListItemIcon>
              Select Theme
            </MenuItem>

            <MenuItem onClick={() => navigate("/admin/flowmaster")}>
              <ListItemIcon>
                <img src={ThemeIcon1} width={30} height={30} />
              </ListItemIcon>
              Flow Master
            </MenuItem>

            <Divider />
            <MenuItem onClick={Logout}>
              <ListItemIcon>
                <img src={logout} width={30} height={30} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        <Dialog open={showThemeMenu} onClose={handleCloseSelect}>
          <DialogTitle>Select a Theme</DialogTitle>
          <DialogContent>
            <List>
              {themes.map((theme) => (
                <ListItem
                  button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  selected={selectedTheme === theme.name}
                >
                  {theme.icon}
                  <span style={{ marginLeft: "10px" }}>{theme.name}</span>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSelect}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: headerColor1,
            borderBottomRightRadius: "15px",
          }}
        >
          <div
            role="presentation"
            onClick={handleClicked}
            // style={{  borderBottomRightRadius: "15px" }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>
              {/* <Link
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link> */}
              <Typography
                sx={{
                  display: "flex",
                  color: "#fff",
                  alignItems: "center",
                }}
              >
                <Link
                  underline="hover"
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  color="inherit"
                  onClick={handleClickhome}
                >
                  <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
                  Home
                </Link>
              </Typography>

              {/* Render the rest of the breadcrumb path */}
              {segments.slice(1).map((segment, index) => (
                <Typography
                  key={index}
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                  }}
                >
                  {/* {" / "} */}
                  {index > 0 && " / "}
                  {index === segments.length - 2 ? (
                    <span>
                      {" "}
                      {/* <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </span>
                  ) : (
                    <Link
                      underline="hover"
                      sx={{
                        display: "flex",
                        color: "#fff",
                        alignItems: "center",
                      }}
                      color="inherit"
                      href={`/${segments.slice(0, index + 1).join("/")}`}
                    >
                      {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </Link>
                  )}
                </Typography>
              ))}
            </Breadcrumbs>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              paddingRight: "15px",
            }}
          >
            <p style={{ fontSize: "1.2vw", color: greeting.color }}>
              {greeting.icon} {greeting.text}
            </p>
            <p> Time : {date.toLocaleTimeString()}</p>
            <p> Date : {formattedDate}</p>
          </div>
        </div>
      </AppBar>

      {/* {open && ( */}
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: drawerStyles,
            color: `var(--drawer-color)`,
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          },
        }}
      >
        <DrawerHeader>
          <>
            <Stack
              sx={{ width: "100%", height: "16vh" }}
              direction="row"
              justifyContent="center"
            >
              {openlogo ? (
                <div
                  style={{
                    paddingTop: "25px",
                    paddingBottom: "25px",
                  }}
                >
                  <img src={loged} width={100} height={100} />
                </div>
              ) : (
                <div style={{ padding: 0 }}></div>
              )}
            </Stack>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
            <br />
            <br />
          </>
        </DrawerHeader>

        <br />
        <br />
        <Divider />
        {openlogo && (
          <Paper
            component="form"
            sx={{
              m: "5px 5px",
              p: "0px 2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Autocomplete
              freeSolo
              fullWidth
              size="small"
              options={items.reduce((acc: any, item: any) => {
                if (item.items) {
                  acc.push(
                    ...item.items.map((subItem: any) => subItem.menuName)
                  );
                }
                return acc;
              }, [])}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  //label="Search Menu"
                  placeholder="Search Menu"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchInputChange}
                />
              )}
            />
          </Paper>
        )}
        <Divider />

        <React.Fragment>
          {/* Home List */}
          <List sx={{ padding: 0 }}>
            {["Home"].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 0,
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "inherit",
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    justifyContent: open ? "initial" : "center",
                    px: 4.5,
                    backgroundColor: "inherit",
                  }}
                  onClick={() => {
                    routeChangeHome();
                    resetHomeColor();
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                      color: homeColor,
                    }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Dynamic Items List */}
          {renderMenu(filteredItems.length > 0 ? filteredItems : items)}
        </React.Fragment>
      </Drawer>
      {/* )} */}
      {/* <Box  sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box> */}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography fontWeight={500} fontSize={20} noWrap align="center">
            Node Permission
          </Typography>
          <div>
            <Grid xs={12} item>
              <Box>
                <div style={{ height: "400px", overflow: "auto" }}>
                  <SimpleTreeView expandedItems={expandedItems}>
                    {Array.isArray(treedata)
                      ? treedata.map((node: any) => renderTree(node))
                      : null}
                  </SimpleTreeView>
                </div>
              </Box>
            </Grid>
            <Grid xs={3} item alignItems="center" justifyContent="center">
              <Button
                type="submit"
                fullWidth
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={(e: any) => handleSave()}
              >
                {t("text.save")}
              </Button>
            </Grid>
          </div>
        </Box>
      </Modal>

      <SwipeableDrawer
        anchor="left"
        open={profileDrawerOpen}
        onClose={() => {
          setProfileDrawerOpen(false);
        }}
        onOpen={() => {}}
        style={{
          zIndex: 1300,
        }}
      >
        <Box sx={{ width: drawerWidth }} role="presentation">
          <IconButton
            edge="end"
            onClick={() => setProfileDrawerOpen(false)}
            aria-label="close"
            sx={{ color: "white", position: "absolute", right: 15, top: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <p
            style={{
              paddingTop: "5vh",
              paddingBottom: "5vh",
              textAlign: "center",
              backgroundImage:
                "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
              color: "whitesmoke",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              fontSize: "20px",
            }}
          >
            User Details
          </p>
          {userDetail.map((user: any, index: any) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    borderRadius: "50%",
                    height: "90px",
                    width: "90px",
                    borderColor:
                      "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
                    backgroundColor: "red",
                    padding: "13px",
                    paddingTop: "30px",
                    paddingLeft: "13px",
                    color: "whitesmoke",
                    fontSize: "20px",
                  }}
                >
                  {getImageForFirstName(
                    user.firsT_NAME,
                    user.middlE_NAME,
                    user.suR_NAME
                  )}
                </div>
              </div>
              <div style={{ marginLeft: "15px" }}>
                {user.logiN_NAME && user.logiN_NAME.trim() !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <img src={log} width={25} />
                    {user.logiN_NAME}
                  </div>
                )}
                <br />
                {user.rolename && user.rolename.trim() !== "" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <img src={roles} width={25} />
                    {user.rolename}
                  </div>
                ) : (
                  ""
                )}
                <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <img src={names} width={25} />
                  {user.firsT_NAME} {user.middlE_NAME} {user.suR_NAME}
                </div>
                <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {" "}
                  <img src={dobs} width={22} />{" "}
                  {dayjs(user.dob).format("YYYY-MM-DD")}
                </div>
                <br />
                {user.gendeR_ID !== 0 ? (
                  <>
                    {user.gendeR_ID && getGenderText(user.gendeR_ID) && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {" "}
                        <img src={genders} width={22} />{" "}
                        {getGenderText(user.gendeR_ID)}
                      </div>
                    )}
                  </>
                ) : (
                  " "
                )}

                <br />

                {user.cuR_MOBILE && user.cuR_MOBILE.trim() !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <img src={call} width={25} />
                    {user.cuR_MOBILE}
                  </div>
                )}
                <br />

                {user.email && user.email.trim() !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <img src={emails} width={25} />
                    {user.email}
                  </div>
                )}
                <br />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Account Status :{" "}
                  {user.iS_ACTIVE === true ? (
                    <img src={tick} width={25} />
                  ) : (
                    <img src={crs} width={25} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

// ============================================================
// digital library

// import * as React from "react";
// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import { useNavigate, Navigate, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   Avatar,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   Grid,
//   Modal,
//   Radio,
//   Stack,
// } from "@mui/material";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import id from "../../assets/images/profile1.png";
// import settings from "../../assets/images/settings.png";
// import trans from "../../assets/images/translation.png";
// import logout from "../../assets/images/logout.png";
// import logged from "../../assets/images/institute.png";
// import logo from "../../assets/images/recyclebinLogo.png";
// import loged from "../../assets/images/DrawerLogo.png";
// import CloseIcon from "@mui/icons-material/Close";
// import dayjs from "dayjs";
// import { Home } from "@mui/icons-material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import Collapse from "@mui/material/Collapse";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import "./Shine.css";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import HomeIcon from "@mui/icons-material/Home";
// import names from "../../assets/images/id-card (2).png";
// import SearchIcon from "@mui/icons-material/Search";
// import Paper from "@mui/material/Paper";
// import Autocomplete from "@mui/material/Autocomplete";
// import InputAdornment from "@mui/material/InputAdornment";
// import { TextField } from "@mui/material";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { Checkbox } from "@mui/material";
// import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
// import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
// import { toast, ToastContainer } from "react-toastify";
// import api from "../../utils/Url";
// import help from "../../assets/images/help.png";
// import dark from "../../assets/images/darkTheme.png";
// import Light from "../../assets/images/lightTheme.png";
// import institutionIcon from "../../assets/images/institute.png";
// import cityIcon from "../../assets/images/city.png";
// import libraryIcon from "../../assets/images/library.png";
// import addressIcon from "../../assets/images/address.png";
// import instituteIcon from "../../assets/images/institution.png";
// import ThemeIcon from "../../assets/images/themes.png";
// import ChatBotIcon from "../../assets/images/ChatBotIcon.png";
// import "./ThemeStyle.css";

// //import { Brightness5, Brightness4, Waves, WbSunny, Forest, Flag } from '@mui/icons-material';

// import "./Sidebar.css";
// import {
//   Brightness5,
//   Brightness4,
//   Waves,
//   WbSunny,
//   Forest,
//   Flag,
// } from "@mui/icons-material";

// const drawerWidth = 225;

// const openedMixin = (theme: Theme): CSSObject => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(12)} + 1px)`,
//   },
// });

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "95%",
//   height: "85%",
//   bgcolor: "#f5f5f5",
//   border: "1px solid #000",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 10,
// };

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

// interface MenuItem {
//   Icon: any;
//   displayNo: number;
//   id: number;
//   items: MenuItem[];
//   label: string;
//   name: string;
//   path: string;
// }

// function getGreeting() {
//   const hour = new Date().getHours();

//   let greeting;
//   if (hour < 12) {
//     greeting = {
//       text: "Good Morning",
//       color: "#FFFFE0",
//       icon: "🌅", // Sunrise emoji
//     };
//   } else if (hour < 17) {
//     greeting = {
//       text: "Good Afternoon",
//       color: "#FFE4B5",
//       icon: "🌞", // Sun emoji
//     };
//   } else {
//     greeting = {
//       text: "Good Evening",
//       color: "#FFDAB9",
//       icon: "🌜", // Crescent moon emoji
//     };
//   }

//   return greeting;
// }

// export default function MiniDrawer({ items }: any) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [open, setOpen] = React.useState(!isMobile);
//   const [menuOpen, setMenuOpen] = React.useState(false);
//   const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   // const [collapseIndex, setCollapseIndex] = React.useState<any>(-1);
//   // const [collapseIndex2, setCollapseIndex2] = React.useState<any>(-1);
//   const [openlogo, setOpenlogo] = React.useState(!isMobile);
//   const [homeColor, setHomeColor] = React.useState("inherit");
//   const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);
//   const [searchValue, setSearchValue] = React.useState("");
//   const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

//   const greeting = getGreeting();

//   let navigate = useNavigate();

//   const searchMenuItems = (items: any[], searchValue: string): any[] => {
//     const lowerCaseSearchValue = searchValue.toLowerCase();

//     // Recursive function focusing only on the `name` field
//     const searchRecursive = (menuItems: any[]): any[] => {
//       return menuItems.reduce((acc: any[], item: any) => {
//         // Check if the current item's name matches the search value
//         if (item.name && item.name.toLowerCase().includes(lowerCaseSearchValue)) {
//           acc.push(item); // Push matching item
//         }

//         // Search recursively in child items
//         if (item.items && item.items.length > 0) {
//           acc.push(...searchRecursive(item.items));
//         }

//         return acc;
//       }, []);
//     };

//     return searchRecursive(items);
//   };

//   const handleNavigation = (path: any) => {
//     navigate(path);
//   };

//   const handleAutocompleteChange = (event: any, value: any) => {
//     const findItemByName = (items: any[], name: string): any | null => {
//       for (const item of items) {
//         if (item.name === name) return item;
//         if (item.items && item.items.length > 0) {
//           const found = findItemByName(item.items, name);
//           if (found) return found;
//         }
//       }
//       return null;
//     };

//     const selectedSubItem = findItemByName(items, value);

//     if (selectedSubItem) {
//       // console.log("Selected Item:", selectedSubItem);

//       if (selectedSubItem.path && selectedSubItem.path.trim() !== "") {
//         handleNavigation(selectedSubItem.path);
//       } else {
//         // console.warn("Path not found for the selected item. No action taken.");
//         // Optionally, provide feedback or navigation to a default page.
//       }
//     } else {
//       // console.warn("Item not found for value:", value);
//     }
//   };

//   const themes = [
//     { name: "light-theme", icon: <Brightness5 /> },
//     { name: "dark-theme", icon: <Brightness4 /> },
//     { name: "ocean-theme", icon: <Waves /> },
//     { name: "sunset-theme", icon: <WbSunny /> },
//     { name: "forest-theme", icon: <Forest /> },
//     { name: "bhagwa-theme", icon: <Flag /> },
//   ];

//   // console.log("items", items);

//   const handleSearchInputChange = (e: any) => {
//     const value = e.target.value;
//     console.log("handleSearchInputChange", value);
//     setSearchValue(value);

//     const filtered = searchMenuItems(items, value);
//     setFilteredItems(filtered);
//   };

//   var [date, setDate] = React.useState(new Date());

//   const options: Intl.DateTimeFormatOptions = {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   };

//   const formattedDate = date
//     .toLocaleDateString("en-US", options)
//     .split(" ")
//     .map((part, index) =>
//       index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
//     )
//     .join(" ");

//   const location = useLocation();

//   const [menuData, setMenuData] = React.useState<any>("");

//   React.useEffect(() => {
//     const dataString = localStorage.getItem("userdata");
//     if (dataString) {
//       const data = JSON.parse(dataString);
//       if (data && data.length > 0) {
//         const userPermissionData = data[0]?.userPermission;
//         if (userPermissionData && userPermissionData.length > 0) {
//           const menudata = userPermissionData[0]?.parentMenu;
//           for (let index = 0; index < menudata.length; index++) {
//             const childMenudata = menudata[index]?.childMenu;
//             const pathrow = childMenudata.find(
//               (x: any) => x.path === location.pathname
//             );

//             if (pathrow) {
//               setMenuData(pathrow.menuId);
//               break;
//             }
//           }
//         }
//       }
//     }
//   }, [location.pathname]);

//   React.useEffect(() => {
//     var timer = setInterval(() => setDate(new Date()), 1000);
//     return function cleanup() {
//       clearInterval(timer);
//     };
//   });

//   const resetHomeColor = () => {
//     setHomeColor("#FF0000");
//   };

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//     setMenuOpen(true);
//     setHomeColor("inherit");
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuOpen(false);
//   };

//   const routeChangeHome = () => {
//     let path = `/home`;
//     navigate(path);
//   };

//   React.useEffect(() => {
//     setOpen(!isMobile);
//     setOpenlogo(!isMobile);
//   }, [isMobile]);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//     setOpenlogo(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//     setOpenlogo(false);
//   };

//   const Logout = () => {
//     localStorage.removeItem("userdata");
//     navigate("/");
//   };
//   // const Logout = () => {
//   //   const collectData = {
//   //     userId: userName,
//   //     ipAddress: "",
//   //     uniqueId: uniqueId,
//   //     logInOut: true,
//   //   };
//   //   api.post(`api/Login/UsrLogOut`, collectData).then((res) => {
//   //     if (res.data.isSuccess) {
//   //       toast.success(res.data.mesg);
//   //       setTimeout(() => {
//   //         navigate("/");
//   //       }, 1000);
//   //     } else {
//   //       toast.error(res.data.mesg);
//   //     }
//   //   });
//   // };
//   const handleLogout = () => {
//     localStorage.removeItem("userdata");
//     localStorage.removeItem("permissions");
//     localStorage.removeItem("token");
//     navigate("/"); // ✅ Redirect to login
// };

//   function onClick(item: any) {
//     console.log("🚀 ~ onClick ~ item:", item);

//     var menuId = item.menuId;
//     var menuName = item.path;
//     const path2 =
//       item.path + "?appId=" + menuId + "&Appname=" + menuName + ".aspx";
//     const path = item.path;
//     console.log(path)

//     if (path == "" || path == null || path == "undefind") {
//     } else {
//       sessionStorage.setItem("menuId", menuId);
//       sessionStorage.setItem("menuName", menuName);
//       sessionStorage.setItem("path", path2);
//       navigate(path);
//     }
//   }

//   let nodeName = sessionStorage.getItem("institutename");
//   let userName: any = sessionStorage.getItem("userid");

//   if (userName) {
//     userName = userName.replace(/"/g, "");
//   }

//   const defaultSelectedNodeId = parseInt(sessionStorage.getItem("instId") + "");

//   React.useEffect(() => {
//     // setuserName(userName);
//     if (defaultSelectedNodeId) {
//       setnodeId(defaultSelectedNodeId);
//     }
//   }, [defaultSelectedNodeId]);

//   const removeDynamicId = (id: any) => {
//     return id.replace(/ /g, "");
//   };

//   var key = removeDynamicId("uniqueId");
//   var uniqueId = sessionStorage.getItem(key);

//   if (uniqueId) {
//     uniqueId = uniqueId.replace(/"/g, "");
//   }

//   const [nodeData, setNodeData] = React.useState<any>([]);

//   const getNode = () => {
//     api.get(`api/Login/GetMemberLibs?uniqueid=${uniqueId}`).then((res) => {
//       const arr: any = [];
//       for (let index = 0; index < res.data.data.length; index++) {
//         arr.push({
//           id: res.data.data[index]["id"],
//           institutename: res.data.data[index]["institutename"],
//         });
//       }
//       setNodeData(arr);
//     });
//   };

//   const [isModalOpen, setIsModalOpen] = React.useState(false);

//   const handlePermissionClick = () => {
//     getNode();
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleCheckboxChange = (id: any, name: any) => {
//     setnodeId(id);
//     setnodeNames(name);
//   };

//   const [nodeNames, setnodeNames] = React.useState<any>("");

//   const [nodeId, setnodeId] = React.useState<any>();

//   const handleSave = () => {
//     if (nodeId && nodeNames) {
//       sessionStorage.setItem("instId", nodeId);

//       sessionStorage.setItem("institutename", nodeNames);
//     } else {
//     }
//     handleCloseModal();
//   };

//   const { i18n } = useTranslation();

//   const changeLanguage = (language: any) => {
//     // console.log("check", language);

//     i18n.changeLanguage(language);
//     localStorage.setItem("preferredLanguage", language);
//   };
//   var currentLanguage = localStorage.getItem("preferredLanguage");
//   var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

//   const handleMyProfileClick = () => {

//     //setShowThemeMenu((prevState) => !prevState);

//     setProfileDrawerOpen(!profileDrawerOpen);
//   };

//   const currentPathname = window.location.pathname;
//   const segments = currentPathname.split("/").filter(Boolean);
//   const isHomePage = segments.length === 0;

//   function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
//     event.preventDefault();
//   }

//   const handleClickhome = () => {
//     let path = `/home`;
//     navigate(path);
//   };

//   const [showThemeMenu, setShowThemeMenu] = React.useState(false);

//   const [selectedTheme, setSelectedTheme] = React.useState(() => {
//     const storedTheme = localStorage.getItem("theme");

//     return storedTheme ? storedTheme : themes[0]["name"];
//   });

//   React.useEffect(() => {
//     //console.log(selectedTheme);
//     document.body.className = selectedTheme;

//     localStorage.setItem("theme", selectedTheme);
//   }, [selectedTheme]);

//   const handleThemeChange = (theme: any) => {
//     setSelectedTheme(theme);
//     setShowThemeMenu(false);
//   };

//   const handleCloseSelect = () => {
//     setShowThemeMenu(false);
//   };

//   const headerColor1 = `var(--header-background)`;
//   const drawerStyles = `var(--drawer-background)`;

//   const renderItem = (icon: any, label: any, value: any) => (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         marginBottom: "10px",
//       }}
//     >
//       <img src={icon} alt={label} width={25} />
//       <strong>{label}:</strong> {value}
//     </div>
//   );

//   const data: any = JSON.parse(sessionStorage.getItem("0th") || "{}");

//   const { institutename, libraryname, address, city, institute } = data;

//     const [selectedMenu, setSelectedMenu] = React.useState<any | null>(null);
//     const [collapseIndexs, setCollapseIndexs] = React.useState<number | null>(null);
//     const [collapseIndexs2, setCollapseIndexs2] = React.useState<number | null>(null);

//     React.useEffect(() => {
//       const savedMenu = localStorage.getItem("selectedMenu");
//       if (savedMenu) {
//         const parsedMenu = JSON.parse(savedMenu);
//         setSelectedMenu(parsedMenu);

//         // Automatically expand the saved menu hierarchy
//         setCollapseIndexs(parsedMenu.parentIndex ?? null);
//         setCollapseIndexs2(parsedMenu.childIndex ?? null);
//       }
//     }, []);

//     const handleMenuClick = (menu: any) => {
//       if (!menu) return;

//       const { parentIndex, childIndex, subchildIndex, child, subchild } = menu;

//       // Check if we're opening a new page or staying within the same structure
//       const isNewPage =
//         selectedMenu?.parentIndex !== parentIndex ||
//         selectedMenu?.childIndex !== childIndex ||
//         selectedMenu?.subchildIndex !== subchildIndex;

//       // Update selected menu only for new page
//       const newSelectedMenu = {
//         parentIndex: parentIndex ?? null,
//         childIndex: childIndex ?? null,
//         subchildIndex: subchildIndex ?? null,
//         ...(subchild ? { subchild } : child ? { child } : {}),
//       };

//       // Navigate to new page if a path exists
//       if (subchild?.path) {
//         onClick(subchild);
//       } else if (child?.path && (!child.items || !child.items.length)) {
//         onClick(child);
//       }

//       // Reset state only if navigating to a new page
//       if (isNewPage) {
//         setSelectedMenu(newSelectedMenu);
//         localStorage.setItem("selectedMenu", JSON.stringify(newSelectedMenu));

//         // Reset menu expansion based on the new page
//         setCollapseIndexs(parentIndex);
//         // setCollapseIndexs2(childIndex ?? null);
//       }
//     };

//     const collapseHandle = (index: number) => {
//       setCollapseIndexs(collapseIndexs === index ? null : index);
//       // setCollapseIndexs2(null);
//     };

//   const collapseHandle2 = (index: number) => {
//     // console.log(index)
//     setCollapseIndexs2(collapseIndexs2 === index ? null : index);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <ToastContainer />
//       <AppBar position="fixed" open={open} style={{}}>
//         <Toolbar
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             background: `var(--header-background1)`,
//             color: "var(--header-color1)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-start",
//               alignItems: "center",
//             }}
//           >
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={handleDrawerOpen}
//               edge="start"
//               sx={{
//                 // marginRight: 5,
//                 ...(open && { display: "none" }),
//               }}
//             >
//               <MenuIcon fontSize="large" />
//             </IconButton>

//             {!openlogo && <img src={logo} width={80} height={60} />}
//           </div>

//           <div style={{ fontSize: "2.5vw" }}>Vehicle Workshop Management System </div>

//           <IconButton
//             onClick={handleClick}
//             size="small"
//             sx={{ ml: 2 }}
//             aria-controls={open ? "account-menu" : undefined}
//             aria-haspopup="true"
//             aria-expanded={open ? "true" : undefined}
//           >
//             <Avatar sx={{ width: 40, height: 40 }}>
//               {/* {displayInitial} */}
//             </Avatar>
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             id="account-menu"
//             open={menuOpen}
//             // onClose={handleClose}
//             onClick={handleClose}
//             PaperProps={{
//               elevation: 0,
//               sx: {
//                 backgroundColor: "var(--menu-background)",
//                 color: "var(--menu-color)",
//                 overflow: "auto",
//                 filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//                 paddingRight: "10px",
//                 paddingLeft: "10px",
//                 mt: 1.5,
//                 "& .MuiAvatar-root": {
//                   width: 32,
//                   height: 32,
//                   ml: -0.5,
//                   mr: 1,
//                 },
//                 "&::before": {
//                   content: '""',
//                   display: "block",
//                   position: "absolute",
//                   top: 0,
//                   right: 14,
//                   width: 10,
//                   height: 10,
//                   bgcolor: "background.paper",
//                   transform: "translateY(-50%) rotate(45deg)",
//                   zIndex: 0,
//                 },
//               },
//             }}
//             transformOrigin={{ horizontal: "right", vertical: "top" }}
//             anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//           >
//             <MenuItem onClick={handleClose}>
//               {/* <ListItemIcon>
//                 <img src={logged} width={40} height={40} />
//               </ListItemIcon>{" "} */}
//               {/* {displayInitial} */}
//             </MenuItem>
//             {/* <MenuItem > */}
//             <MenuItem onClick={handleMyProfileClick}>
//               <ListItemIcon>
//                 <img src={id} width={30} height={30} />
//               </ListItemIcon>
//               {userName}
//             </MenuItem>

//             <Divider />

//             <MenuItem
//               onClick={() => {
//                 localStorage.getItem("preferredLanguage") == "hi"
//                   ? changeLanguage("en")
//                   : changeLanguage("hi");
//               }}
//             >
//               <ListItemIcon>
//                 <img src={trans} width={30} height={30} />
//               </ListItemIcon>
//               Translate -- {newLanguage}
//             </MenuItem>

//             <MenuItem onClick={(e) => setShowThemeMenu(!showThemeMenu)}>
//               <ListItemIcon>
//                 <img src={ThemeIcon} width={30} height={30} />
//               </ListItemIcon>
//               Select Theme
//             </MenuItem>

//             {/* <MenuItem
//               onClick={() => {
//                 let path = "/HelpDesk";
//                // localStorage.setItem("menuData", menuData.toString());
//                 window.open(path, "_blank");
//               }}
//             >
//               <ListItemIcon>
//                 <img src={help} width={30} height={30} alt="Help Desk" />
//               </ListItemIcon>
//               Help Desk
//             </MenuItem> */}

//             {/* <MenuItem onClick={handleClose}>
//               <ListItemIcon>
//                 <img src={settings} width={30} height={30} />
//               </ListItemIcon>
//               Settings
//             </MenuItem> */}

//             {/* <MenuItem onClick={handlePermissionClick}>
//               <ListItemIcon>
//                 <img src={logged} width={40} height={40} alt="Permission" />
//               </ListItemIcon>
//               Institute
//             </MenuItem> */}

//             <Divider />
//             <MenuItem onClick={Logout}>
//               <ListItemIcon>
//                 <img src={logout} width={30} height={30} />
//               </ListItemIcon>
//               Logout
//             </MenuItem>
//           </Menu>
//         </Toolbar>

//         <Dialog open={showThemeMenu} onClose={handleCloseSelect}>
//           <DialogTitle>Select a Theme</DialogTitle>
//           <DialogContent>
//             <List>
//               {themes.map((theme) => (
//                 <ListItem
//                   button
//                   key={theme.name}
//                   onClick={() => handleThemeChange(theme.name)}
//                   selected={selectedTheme === theme.name}
//                 >
//                   {theme.icon}
//                   <span style={{ marginLeft: "10px" }}>{theme.name}</span>
//                 </ListItem>
//               ))}
//             </List>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseSelect}>Cancel</Button>
//           </DialogActions>
//         </Dialog>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: headerColor1 || "#42AEEE",
//             borderBottomRightRadius: "15px",
//           }}
//         >
//           <div
//             role="presentation"
//             onClick={handleClicked}
//             // style={{  borderBottomRightRadius: "15px" }}
//           >
//             <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>
//               {/* <Link
//                 underline="hover"
//                 sx={{ display: "flex", alignItems: "center" }}
//                 color="inherit"
//                 href="/"
//               >
//                 <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//                 Home
//               </Link> */}
//               <Typography
//                 sx={{
//                   display: "flex",
//                   color: "#fff",
//                   alignItems: "center",
//                 }}
//               >
//                 <Link
//                   underline="hover"
//                   sx={{
//                     display: "flex",
//                     color: "#fff",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                   color="inherit"
//                   onClick={handleClickhome}
//                 >
//                   <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
//                   Home
//                 </Link>
//               </Typography>

//               {/* Render the rest of the breadcrumb path */}
//               {segments.slice(1).map((segment, index) => (
//                 <Typography
//                   key={index}
//                   sx={{
//                     display: "flex",
//                     color: "#fff",
//                     alignItems: "center",
//                   }}
//                 >
//                   {/* {" / "} */}
//                   {index > 0 && " / "}
//                   {index === segments.length - 2 ? (
//                     <span>
//                       {" "}
//                       {/* <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
//                       {segment}
//                     </span>
//                   ) : (
//                     <Link
//                       underline="hover"
//                       sx={{
//                         display: "flex",
//                         color: "#fff",
//                         alignItems: "center",
//                       }}
//                       color="inherit"
//                       href={`/${segments.slice(0, index + 1).join("/")}`}
//                     >
//                       {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
//                       {segment}
//                     </Link>
//                   )}
//                 </Typography>
//               ))}
//             </Breadcrumbs>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: 15,
//               paddingRight: "15px",
//             }}
//           >
//             <p style={{ fontSize: "1.2vw", color: greeting.color }}>
//               {greeting.icon} {greeting.text}
//             </p>

//             {/* <p>Institute : {nodeName}</p> */}
//             <p> Time : {date.toLocaleTimeString()}</p>
//             <p> Date : {formattedDate}</p>
//           </div>
//         </div>
//       </AppBar>

//       <Drawer
//         variant="permanent"
//         open={open}
//         PaperProps={{
//           sx: {
//             backgroundColor: drawerStyles,
//             color: `var(--drawer-color)`,
//           },
//         }}
//       >
//         <DrawerHeader>
//           <>
//             <Stack
//               sx={{ width: "100%", height: "16vh" }}
//               direction="row"
//               justifyContent="center"
//             >
//               {openlogo ? (
//                 <div
//                   style={{
//                     paddingTop: "25px",
//                     paddingBottom: "25px",
//                   }}
//                 >
//                   <img src={loged} width={110} height={90} />
//                 </div>
//               ) : (
//                 <div style={{ padding: 0 }}></div>
//               )}
//             </Stack>

//             <IconButton onClick={handleDrawerClose}>
//               {theme.direction === "rtl" ? (
//                 <ChevronRightIcon />
//               ) : (
//                 <ChevronLeftIcon />
//               )}
//             </IconButton>
//             <br />
//             <br />
//           </>
//         </DrawerHeader>

//         <br />
//         <br />
//         <Divider />
//         {openlogo && (
//           <Paper
//             component="form"
//             sx={{
//               m: "5px 5px",
//               p: "0px 2px",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Autocomplete
//               freeSolo
//               fullWidth
//               size="small"
//              options={filteredItems.map((item) => item.name)}
//               onChange={handleAutocompleteChange}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   //label="Search Menu"
//                   placeholder="Search Menu"
//                   variant="outlined"
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                   onChange={handleSearchInputChange}
//                 />
//               )}
//             />
//           </Paper>
//         )}
//         <Divider />

//         <React.Fragment>
//           <List sx={{ padding: 0 }}>
//             {["Home"].map((text, index) => (
//               <ListItem
//                 key={text}
//                 disablePadding
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: 0,
//                   "&:hover": {
//                     cursor: "pointer",
//                     backgroundColor: "lightgray",
//                   },
//                 }}
//               >
//                 <ListItemButton
//                   sx={{
//                     // minHeight: 30,
//                     justifyContent: open ? "initial" : "center",
//                     px: 4.5,
//                   }}
//                   // onClick={routeChangeHome}
//                   onClick={() => {
//                     routeChangeHome();
//                     resetHomeColor();

//                     setCollapseIndexs(null); // Close all parent menus
//                     setCollapseIndexs2(null); // Close all child menus
//                     setSelectedMenu({ // Reset selected menu to no highlight
//                       parentIndex: null,
//                       childIndex: null,
//                       subchildIndex: null,
//                       subchild: null,
//                       child: null,
//                     });
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 1 : "auto",
//                       justifyContent: "center",
//                       color: homeColor,
//                     }}
//                   >
//                     <Home />
//                   </ListItemIcon>
//                   <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//           <List sx={{ padding: 0 }}>
//   {items.map((parent: any, parentIndex: number) => (
//     <React.Fragment key={parentIndex}>
//       <Divider />
//       {/* Parent Item */}
//       <ListItem
//         onClick={() => collapseHandle(parentIndex)}
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "10px 16px",
//           backgroundColor:
//             selectedMenu?.parentIndex === parentIndex &&
//             selectedMenu?.childIndex === null &&
//             selectedMenu?.subchildIndex === null
//               ? "#FF9933" // Saffron color for active parent menu
//               : "#f5f5f5",
//           fontWeight:
//             selectedMenu?.parentIndex === parentIndex ? 600 : "normal", // Bold active menu
//           color:
//             selectedMenu?.parentIndex === parentIndex ? "#2B4593" : "inherit", // Contrast text
//           borderRadius: "6px", // Optional rounded corners
//           margin: "5px", // Maintain consistent spacing
//           cursor: "pointer",
//           paddingRight: open ? "16px" : "32px", // Add more padding on the right when open is false
//         }}
//         title={parent.name}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           {/* Conditionally show folder icon */}
//           {open && (
//             <span
//               style={{
//                 fontSize: "1.2rem",
//                 backgroundColor: "#f0f0f0", // Background color when closed
//                 padding: "6px",
//                 borderRadius: "10px", // Round corners when closed
//               }}
//             >
//               📁
//             </span>
//           )}
//           <ListItemText
//             primary={
//               open
//                 ? parent.name // Show full name if open is true
//                 : parent.name
//                     .split(" ") // Split name by space
//                     .map((word:any) => word.charAt(0).toUpperCase()) // Take the first char of each word
//                     .join("") // Join them into a single string
//             }
//             primaryTypographyProps={{ fontWeight: "500", fontSize: "1rem" }}
//           />
//         </div>
//         <ListItemIcon>
//           {parent.items && parent.items.length > 0 ? (
//             collapseIndexs === parentIndex ? (
//               <ExpandLessIcon />
//             ) : (
//               <ExpandMoreIcon />
//             )
//           ) : null}
//         </ListItemIcon>
//       </ListItem>

//       <Divider />

//       {/* Child Items */}
//       <Collapse
//         in={collapseIndexs === parentIndex}
//         timeout="auto"
//         unmountOnExit
//         sx={{ paddingLeft: "16px" }}
//       >
//         <List>
//           {parent.items.map((child: any, childIndex: number) => (
//             <React.Fragment key={childIndex}>
//               <ListItem
//                 onClick={() => {
//                   // If child has subitems, toggle collapse; if not, prevent it
//                   if (child.items && child.items.length > 0) {
//                     collapseHandle2(childIndex);
//                   }
//                   handleMenuClick({
//                     child,
//                     parentIndex,
//                     childIndex,
//                   });
//                 }}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: "8px 16px",
//                   borderRadius: "6px",
//                   backgroundColor:
//                     selectedMenu?.parentIndex === parentIndex &&
//                     selectedMenu?.childIndex === childIndex &&
//                     selectedMenu?.subchildIndex === null
//                       ? ""
//                       : child.items && child.items.length > 0
//                       ? "#e9f7ff" // Light blue for menus with sub-items
//                       : "#fff3e0", // Light orange for regular items
//                   fontWeight:
//                     selectedMenu?.parentIndex === parentIndex &&
//                     selectedMenu?.childIndex === childIndex
//                       ? 600
//                       : "normal", // Bold active child menu
//                   color:
//                     selectedMenu?.parentIndex === parentIndex &&
//                     selectedMenu?.childIndex === childIndex
//                       ? "#2B4593"
//                       : "inherit",
//                   margin: "5px",
//                   cursor: "pointer",
//                   paddingRight: open ? "16px" : "32px", // Add more padding on the right when open is false
//                 }}
//                 title={child.name}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                   {/* Conditionally show folder icon for child */}
//                   {open && (
//                     <span
//                       style={{
//                         fontSize: "1.2rem",
//                         backgroundColor: "#f0f0f0", // Background color when closed
//                         padding: "6px",
//                         borderRadius: "10px", // Round corners when closed
//                       }}
//                     >
//                       {child.items && child.items.length > 0 ? "📂" : "📄"}
//                     </span>
//                   )}
//                   <ListItemText
//                     primary={
//                       open
//                         ? child.name // Show full name if open is true
//                         : child.name
//                             .split(" ") // Split name by space
//                             .map((word:any) => word.charAt(0).toUpperCase()) // Take the first char of each word
//                             .join("") // Join them into a single string
//                     }
//                     primaryTypographyProps={{ fontSize: "0.95rem" }}
//                   />
//                 </div>
//                 {child.items && child.items.length > 0 && (
//                   <ListItemIcon>
//                     {collapseIndexs2 === childIndex ? (
//                       <ExpandLessIcon />
//                     ) : (
//                       <ExpandMoreIcon />
//                     )}
//                   </ListItemIcon>
//                 )}
//               </ListItem>

//               <Collapse
//                 in={collapseIndexs2 === childIndex}
//                 timeout="auto"
//                 unmountOnExit
//                 sx={{ paddingLeft: "16px" }}
//               >
//                 <List>
//                   {child.items.map((subchild: any, subchildIndex: number) => (
//                     <ListItem
//                       key={subchildIndex}
//                       onClick={() =>
//                         handleMenuClick({
//                           subchild,
//                           parentIndex,
//                           childIndex,
//                           subchildIndex,
//                         })
//                       }
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         padding: "6px 16px",
//                         borderRadius: "6px",
//                         backgroundColor:
//                           selectedMenu?.parentIndex === parentIndex &&
//                           selectedMenu?.childIndex === childIndex &&
//                           selectedMenu?.subchildIndex === subchildIndex
//                             ? "#FF9933"
//                             : "#fff3e0",
//                         fontWeight:
//                           selectedMenu?.parentIndex === parentIndex &&
//                           selectedMenu?.childIndex === childIndex &&
//                           selectedMenu?.subchildIndex === subchildIndex
//                             ? 600
//                             : "normal",
//                         color:
//                           selectedMenu?.parentIndex === parentIndex &&
//                           selectedMenu?.childIndex === childIndex &&
//                           selectedMenu?.subchildIndex === subchildIndex
//                             ? "#2B4593"
//                             : "inherit",
//                         margin: "5px",
//                         cursor: "pointer",
//                       }}
//                       title={subchild.name}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                   {open && (
//                     <span
//                       style={{
//                         fontSize: "1.2rem",
//                         backgroundColor: "#f0f0f0",
//                         padding: "6px",
//                         borderRadius: "10px",
//                       }}
//                     >
//                       📄
//                     </span>
//                   )}
//                       <ListItemText
//                         primary={
//                           open
//                             ? subchild.name
//                             : subchild.name
//                                 .split(" ")
//                                 .map((word:any) => word.charAt(0).toUpperCase())
//                                 .join("")
//                         }
//                         primaryTypographyProps={{ fontSize: "0.9rem" }}
//                       />
//                       </div>
//                     </ListItem>

//                   ))}
//                 </List>
//               </Collapse>
//             </React.Fragment>
//           ))}
//         </List>
//       </Collapse>
//     </React.Fragment>
//   ))}
// </List>

//         </React.Fragment>
//       </Drawer>

//       <SwipeableDrawer
//         anchor="left"
//         open={profileDrawerOpen}
//         onClose={() => setProfileDrawerOpen(false)}
//         onOpen={() => {}}
//         style={{
//           zIndex: 1300,
//         }}
//       >
//         <Box sx={{ width: 250 }} role="presentation">
//           <IconButton
//             edge="end"
//             onClick={() => setProfileDrawerOpen(false)}
//             aria-label="close"
//             sx={{ color: "white", position: "absolute", right: 15, top: 2 }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <p
//             style={{
//               paddingTop: "5vh",
//               paddingBottom: "5vh",
//               textAlign: "center",
//               backgroundImage:
//                 "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
//               color: "whitesmoke",
//               borderBottomLeftRadius: "10px",
//               borderBottomRightRadius: "10px",
//               fontSize: "20px",
//             }}
//           >
//             User Details
//           </p>
//           <div style={{ margin: "15px" }}>
//             {renderItem(id, "User Name", userName)}
//             {/* {renderItem(instituteIcon, "Institute", institute)}
//             {renderItem(libraryIcon, "Library Name", libraryname)} */}
//             {renderItem(addressIcon, "Address", address)}
//             {renderItem(cityIcon, "City", city)}
//           </div>
//         </Box>
//       </SwipeableDrawer>

//       <Modal
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         style={{ overflow: "hidden" }}
//       >
//         <Box
//           sx={{
//             ...style,

//             overflow: "auto",
//           }}
//         >
//           <Typography fontWeight={500} fontSize={20} noWrap align="center">
//             Institutes
//           </Typography>

//           {nodeData?.map((item: any) => (
//             <div>
//               <Grid container spacing={1}>
//                 <Grid item xs={3} key={item.id}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={nodeId === item.id}
//                         onChange={() =>
//                           handleCheckboxChange(item.id, item.institutename)
//                         }
//                       />
//                     }
//                     label={item.institutename}
//                   />
//                 </Grid>
//               </Grid>
//             </div>
//           ))}

//           <Grid xs={3} item alignItems="center" justifyContent="center">
//             <Button
//               type="submit"
//               fullWidth
//               style={{
//                 backgroundColor: "#059669",
//                 color: "white",
//                 marginTop: "10px",
//               }}
//               onClick={handleSave}
//             >
//               save
//             </Button>
//           </Grid>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }

// ============================================================
// newsidebar

// import * as React from "react";
// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import CssBaseline from "@mui/material/CssBaseline";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import { useNavigate, Navigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   Avatar,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Modal,
//   Stack,
// } from "@mui/material";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import call from "../../assets/images/phone-call.png";
// import roles from "../../assets/images/role-model.png";
// import tick from "../../assets/images/check-mark.png";
// import crs from "../../assets/images/cross.png";
// import log from "../../assets/images/profile.png";
// import emails from "../../assets/images/gmail.png";
// import genders from "../../assets/images/symbol.png";
// import dobs from "../../assets/images/timetable.png";
// import id from "../../assets/images/profile1.png";
// import settings from "../../assets/images/settings.png";
// import trans from "../../assets/images/translation.png";
// import logout from "../../assets/images/logout.png";
// import logged from "../../assets/images/permission.png";
// import logo from "../../assets/images/recyclebinLogo.png";
// import loged from "../../assets/images/DrawerLogo.png";
// import CloseIcon from "@mui/icons-material/Close";
// import dayjs from "dayjs";
// import { Home } from "@mui/icons-material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import Collapse from "@mui/material/Collapse";
// import Typewriter from "./TypeWriter";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import "./Shine.css";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import HomeIcon from "@mui/icons-material/Home";
// import WhatshotIcon from "@mui/icons-material/Whatshot";
// import GrainIcon from "@mui/icons-material/Grain";
// import names from "../../assets/images/id-card (2).png";
// import backgrd from "../../assets/images/backgroundimage.jpg";
// import SearchIcon from "@mui/icons-material/Search";
// import Paper from "@mui/material/Paper";
// import InputBase from "@mui/material/InputBase";
// import Autocomplete from "@mui/material/Autocomplete";
// import InputAdornment from "@mui/material/InputAdornment";
// import {
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   // Typography,
// } from "@mui/material";
// import "./ThemeStyle.css";
// import ThemeIcon from "../../assets/images/themes.png";
// import {
//   Brightness5,
//   Brightness4,
//   Waves,
//   WbSunny,
//   Forest,
//   Flag,
// } from "@mui/icons-material";
// import api from "../../utils/Url";
// import { toast } from "react-toastify";
// import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
// import TreeView from "@mui/x-tree-view/TreeView";
// import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
// import { FaRegFolderOpen } from "react-icons/fa6";
// import DescriptionIcon from '@mui/icons-material/Description';
// import { FaFileLines } from "react-icons/fa6";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness5Icon from "@mui/icons-material/Brightness5";

// const drawerWidth = 225;

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "95%",
//   height: "85%",
//   bgcolor: "#f5f5f5",
//   border: "1px solid #000",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 10,
// };

// const openedMixin = (theme: Theme): CSSObject => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(12)} + 1px)`,
//   },
// });
// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));
// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));
// function getGreeting() {
//   const hour = new Date().getHours();

//   let greeting;
//   if (hour < 12) {
//     greeting = {
//       text: "Good Morning",
//       color: "#FFFFE0",
//       icon: "🌅", // Sunrise emoji
//     };
//   } else if (hour < 17) {
//     greeting = {
//       text: "Good Afternoon",
//       color: "#FFE4B5",
//       icon: "🌞", // Sun emoji
//     };
//   } else {
//     greeting = {
//       text: "Good Evening",
//       color: "#FFDAB9",
//       icon: "🌜", // Crescent moon emoji
//     };
//   }

//   return greeting;
// }

// interface MenuItemType {
//   menuId: number;
//   menuName: string;
//   path: string;
//   children: MenuItemType[];
// }

// export default function Sidebar({ menuItems }: { menuItems: MenuItemType[] }) {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(true);
//   const [menuOpen, setMenuOpen] = React.useState(false);
//   const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [collapseIndex, setCollapseIndex] = React.useState<any>(-1);
//   const [openlogo, setOpenlogo] = React.useState(true);
//   const [homeColor, setHomeColor] = React.useState("inherit");
//   const { t } = useTranslation();

//   const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);

//   const [expandedItems, setExpandedItems] = React.useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);

//   const [treedata, setTreedata] = React.useState<any>([]);

//   const [check, setCheck] = React.useState<any>([]);

//   const [searchValue, setSearchValue] = React.useState("");
//   // const [filteredItems, setFilteredItems] = React.useState([]);
//   //const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

//   const themes = [
//     { name: "light-theme", icon: <Brightness5 /> },
//     { name: "dark-theme", icon: <Brightness4 /> },
//     { name: "ocean-theme", icon: <Waves /> },
//     { name: "sunset-theme", icon: <WbSunny /> },
//     { name: "forest-theme", icon: <Forest /> },
//     { name: "bhagwa-theme", icon: <Flag /> },
//   ];

//   const greeting = getGreeting();
//   const navigate = useNavigate();
//  // const [open, setOpen] = React.useState(true);
//   const [expandedMenus, setExpandedMenus] = React.useState<number[]>([]);
// const [themeMode, setThemeMode] = React.useState("light");
//   // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//   // Get logged-in user from localStorage
//   const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
//   const userName = userData?.userDetails?.userName || "User";

//   const handleToggle = (menuId: number) => {
//     setExpandedMenus((prev) =>
//       prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
//     );
//   };

//   const renderMenu = (items: MenuItemType[]) => {
//     return items.map((item) => (
//       <React.Fragment key={item.menuId}>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => (item.children.length ? handleToggle(item.menuId) : navigate(item.path))}>
//             <ListItemIcon>
//               {item.children.length > 0 ? <FolderIcon /> : <FaFileLines />}
//             </ListItemIcon>
//             <ListItemText primary={item.menuName} />
//             {item.children.length > 0 ? (
//               expandedMenus.includes(item.menuId) ? <ExpandLessIcon /> : <ExpandMoreIcon />
//             ) : null}
//           </ListItemButton>
//         </ListItem>
//         {item.children.length > 0 && (
//           <Collapse in={expandedMenus.includes(item.menuId)} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding sx={{ pl: 4 }}>
//               {renderMenu(item.children)}
//             </List>
//           </Collapse>
//         )}
//       </React.Fragment>
//     ));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("userdata");
//     localStorage.removeItem("permissions");
//     localStorage.removeItem("token");
//     navigate("/"); // ✅ Redirect to login
// };

//   const handleThemeChange = () => {
//     setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
//     document.body.className = themeMode === "light" ? "dark-theme" : "light-theme";
//   };

// const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
//   setAnchorEl(event.currentTarget);
// };

// const handleProfileMenuClose = () => {
//   setAnchorEl(null);
// };

//   return (
//     <Drawer variant="permanent" open={open}>
//       <List>
//         {/* Home */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => navigate("/home")}>
//             <ListItemIcon>
//               <HomeIcon />
//             </ListItemIcon>
//             <ListItemText primary="Home" />
//           </ListItemButton>
//         </ListItem>

//         {/* Dynamic Menu */}
//         {renderMenu(menuItems)}

//         <Divider />

//         {/* Profile */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={handleProfileMenuClick}>
//             <ListItemIcon>
//               <Avatar>{userName.charAt(0).toUpperCase()}</Avatar>
//             </ListItemIcon>
//             <ListItemText primary={userName} />
//           </ListItemButton>
//         </ListItem>

//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
//           <MenuItem onClick={handleProfileMenuClose}>My Profile</MenuItem>
//           <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
//         </Menu>

//         <Divider />

//         {/* Theme Toggle */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={handleThemeChange}>
//             <ListItemIcon>
//               {themeMode === "light" ? <Brightness5Icon /> : <Brightness4Icon />}
//             </ListItemIcon>
//             <ListItemText primary="Toggle Theme" />
//           </ListItemButton>
//         </ListItem>

//         {/* Logout */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={handleLogout}>
//             <ListItemIcon>
//               <LogoutIcon />
//             </ListItemIcon>
//             <ListItemText primary="Logout" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }

// ===============================
// 11/02/25
// import * as React from "react";
// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import CssBaseline from "@mui/material/CssBaseline";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import { useNavigate, Navigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   Avatar,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Modal,
//   Stack,
// } from "@mui/material";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import call from "../../assets/images/phone-call.png";
// import roles from "../../assets/images/role-model.png";
// import tick from "../../assets/images/check-mark.png";
// import crs from "../../assets/images/cross.png";
// import log from "../../assets/images/profile.png";
// import emails from "../../assets/images/gmail.png";
// import genders from "../../assets/images/symbol.png";
// import dobs from "../../assets/images/timetable.png";
// import id from "../../assets/images/profile1.png";
// import settings from "../../assets/images/settings.png";
// import trans from "../../assets/images/translation.png";
// import logout from "../../assets/images/logout.png";
// import logged from "../../assets/images/permission.png";
// import logo from "../../assets/images/recyclebinLogo.png";
// import loged from "../../assets/images/DrawerLogo.png";
// import CloseIcon from "@mui/icons-material/Close";
// import dayjs from "dayjs";
// import { Home } from "@mui/icons-material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import Collapse from "@mui/material/Collapse";
// import Typewriter from "./TypeWriter";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import "./Shine.css";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import HomeIcon from "@mui/icons-material/Home";
// import WhatshotIcon from "@mui/icons-material/Whatshot";
// import GrainIcon from "@mui/icons-material/Grain";
// import names from "../../assets/images/id-card (2).png";
// import backgrd from "../../assets/images/backgroundimage.jpg";
// import SearchIcon from "@mui/icons-material/Search";
// import Paper from "@mui/material/Paper";
// import InputBase from "@mui/material/InputBase";
// import Autocomplete from "@mui/material/Autocomplete";
// import InputAdornment from "@mui/material/InputAdornment";
// import {
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   // Typography,
// } from "@mui/material";
// import "./ThemeStyle.css";
// import ThemeIcon from "../../assets/images/themes.png";
// import {
//   Brightness5,
//   Brightness4,
//   Waves,
//   WbSunny,
//   Forest,
//   Flag,
// } from "@mui/icons-material";
// import api from "../../utils/Url";
// import { toast } from "react-toastify";
// import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
// import TreeView from "@mui/x-tree-view/TreeView";
// import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

// import { FaRegFolderOpen } from "react-icons/fa6";
// import DescriptionIcon from '@mui/icons-material/Description';

// import { FaFileLines } from "react-icons/fa6";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import LogoutIcon from "@mui/icons-material/Logout";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness5Icon from "@mui/icons-material/Brightness5";
// const themes = [
//   { name: "light-theme", icon: <Brightness5 /> },
//   { name: "dark-theme", icon: <Brightness4 /> },
//   { name: "ocean-theme", icon: <Waves /> },
//   { name: "sunset-theme", icon: <WbSunny /> },
//   { name: "forest-theme", icon: <Forest /> },
//   { name: "bhagwa-theme", icon: <Flag /> },
// ];
// interface MenuItem {
//   menuId: number;
//   menuName: string;
//   path: string;
//   children: MenuItem[];
// }

// export default function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
//   const navigate = useNavigate();
//   const [expandedMenus, setExpandedMenus] = React.useState<number[]>([]);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const handleToggle = (menuId: number) => {
//     setExpandedMenus(prev =>
//       prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
//     );
//   };
//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const handleLogout = () => {
//     localStorage.removeItem("userdata");
//     localStorage.removeItem("permissions");
//     localStorage.removeItem("token");
//     navigate("/"); // ✅ Redirect to login
// };
//   const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleThemeChange = (theme: any) => {
//     setSelectedTheme(theme);
//     setShowThemeMenu(false);
//   };
//   const [showThemeMenu, setShowThemeMenu] = React.useState(false);

//   const [selectedTheme, setSelectedTheme] = React.useState(() => {
//     const storedTheme = localStorage.getItem("theme");

//     return storedTheme ? storedTheme : themes[0]["name"];
//   });
//   const [themeMode, setThemeMode] = React.useState("light");
//   const renderMenu = (items: MenuItem[]) => {
//     return items.map((item) => (
//       <React.Fragment key={item.menuId}>
//         <ListItem disablePadding>

//           <ListItemButton onClick={() => item.children.length ? handleToggle(item.menuId) : navigate(item.path)}>
//             <ListItemIcon>
//               <FolderIcon />
//             </ListItemIcon>
//             <ListItemText primary={item.menuName} />
//             {item.children.length > 0 ? (expandedMenus.includes(item.menuId) ? <ExpandLess /> : <ExpandMore />) : null}
//           </ListItemButton>
//         </ListItem>
//         {item.children.length > 0 && (
//           <Collapse in={expandedMenus.includes(item.menuId)} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding sx={{ pl: 4 }}>
//               {renderMenu(item.children)}
//             </List>
//           </Collapse>
//         )}
//       </React.Fragment>
//     ));
//   };

//   return (
//     <List>
//     {/* Home */}
//     <ListItem disablePadding>
//       <ListItemButton onClick={() => navigate("/home")}>
//         <ListItemIcon>
//           <HomeIcon />
//         </ListItemIcon>
//         <ListItemText primary="Home" />
//       </ListItemButton>
//     </ListItem>

//     {/* Dynamic Menu */}
//     {renderMenu(menuItems)}

//     <Divider />

//     {/* Profile */}
//     <ListItem disablePadding>
//       <ListItemButton onClick={handleProfileMenuClick}>
//         {/* <ListItemIcon>
//           <Avatar>{userName.charAt(0).toUpperCase()}</Avatar>
//         </ListItemIcon> */}
//         {/* <ListItemText primary={userName} /> */}
//       </ListItemButton>
//     </ListItem>

//     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
//       <MenuItem onClick={handleProfileMenuClose}>My Profile</MenuItem>
//       <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
//     </Menu>

//     <Divider />

//     {/* Theme Toggle */}
//     <ListItem disablePadding>
//       <ListItemButton onClick={handleThemeChange}>
//         <ListItemIcon>
//           {themeMode === "light" ? <Brightness5Icon /> : <Brightness4Icon />}
//         </ListItemIcon>
//         <ListItemText primary="Toggle Theme" />
//       </ListItemButton>
//     </ListItem>

//     {/* Logout */}
//     <ListItem disablePadding>
//       <ListItemButton onClick={handleLogout}>
//         <ListItemIcon>
//           <LogoutIcon />
//         </ListItemIcon>
//         <ListItemText primary="Logout" />
//       </ListItemButton>
//     </ListItem>
//   </List>

//   );
// }
