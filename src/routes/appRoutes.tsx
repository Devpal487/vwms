import { RouteType } from "./config";
import RoleMaster from "../pages/UserManagementMaster/RoleMaster/RoleMaster";
import UserPermissionMaster from "../pages/UserManagementMaster/UserPermissionMaster/UserPermissionMaster";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../loginPage/LoginPage";
import HomeIcon from "@mui/icons-material/Home";
import DashboardPageLayout from "../pages/master/MasterPageLayout";
import DashboardIndex from "../pages/master/MasterPageIndex";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ZoneMaster from "../pages/master/ZoneMaster/ZoneMaster";
import StateMaster from "../pages/master/StateMaster/StateMaster";
import CountryMaster from "../pages/master/CountryMaster/CountryMaster";
import CityMaster from "../pages/master/CityMaster/CityMaster";
import Taxmaster from '../pages/master/Taxmaster/Taxmaster';
import Unitmaster from "../pages/master/Unitmaster/Unitmaster";
import MaterialRecieptNoteMaster from "../pages/Inventory/MaterialRecieptNote/MaterialRecieptNoteMaster";
import CreateMaterialRecieptNote from "../pages/Inventory/MaterialRecieptNote/CreateMaterialRecieptNote";
import EditMaterialRecieptNote from "../pages/Inventory/MaterialRecieptNote/EditMaterialRecieptNote";
import QualityCheckMaster from "../pages/Inventory/QualityCheck/QualityCheckMaster";
import CreateQualityCheck from "../pages/Inventory/QualityCheck/CreateQualityCheck";
import EditQualityCheck from "../pages/Inventory/QualityCheck/EditQualityCheck";
import ItemCategory from "../pages/master/ItemCategory/ItemCategory";
import EmployeeMaster from "../pages/Employee/EmployeeMaster";
import EmployeeAdd from "../pages/Employee/EmployeeAdd";
import EmployeeEdit from "../pages/Employee/EmployeeEdit";
import ItemType from "../pages/master/ItemType/ItemType";
import StaffIndent from "../pages/Inventory/StaffIndent/StaffIndent";
import CreateStaffIndent from "../pages/Inventory/StaffIndent/CreateStaffIndent";
import EditStaffIndent from "../pages/Inventory/StaffIndent/EditStaffIndent";
import StaffItemIssue from "../pages/Inventory/staffItemIssue/StaffItemIssue";
import CreateStaffItemIssue from "../pages/Inventory/staffItemIssue/CreateStaffItemIssue";
import EditStaffItemIssue from "../pages/Inventory/staffItemIssue/EditStaffItemIssue";
import StaffItemReturn from "../pages/Inventory/StaffItemReturn/StaffItemReturn";
import CreateStaffItemReturn from "../pages/Inventory/StaffItemReturn/CreateStaffItemReturn";
import EditStaffItemReturn from "../pages/Inventory/StaffItemReturn/EditStaffItemReturn";
import StoreMaster from "../pages/Inventory/StoreMaster/StoreMaster";
import Emailsettingmaster from "../pages/Emailsystem/Emailsetting/Emailsettingmaster";
import EmailcampgianMaster from "../pages/Emailsystem/Emailcampagian/Emailcampagianmaster";
import CreatemailcampgiontForm from "../pages/Emailsystem/Emailcampagian/Createcampgainform";
import Editcampgianmailmaster from "../pages/Emailsystem/Emailcampagian/Editcampagianmaster";
import EmaileventMaster from "../pages/Emailsystem/EmailEventSettings/EmaileventMaster";
import CreatemaileventForm from "../pages/Emailsystem/EmailEventSettings/CreatemaileventForm";
import Editeventemail from "../pages/Emailsystem/EmailEventSettings/Editeventemail";
import CampaignTemplate from "../pages/Emailsystem/CampaignTemplate/CampaignTemplate";
import AddCampaignTemplate from "../pages/Emailsystem/CampaignTemplate/AddCampaignTemplate";
import EditCampaignTemplate from "../pages/Emailsystem/CampaignTemplate/EditCampaignTemplate";
import Editgroupmaster from "../pages/Emailsystem/Group/Editgroupmaster";
import Creategroupmaster from "../pages/Emailsystem/Group/Creategroupmaster";
import Groupmaster from "../pages/Emailsystem/Group/Groupmaster";
import Login_Page from "../loginPage/Login_Page";
import LicensingInsuranceMaster from "../pages/VehicleMaster/LicensingInsuranceMaster/LicensingInsuranceMaster";
import EditLicensingInsuranceMaster from "../pages/VehicleMaster/LicensingInsuranceMaster/EditLicensingInsuranceMaster";
import AddLicensingInsuranceMaster from "../pages/VehicleMaster/LicensingInsuranceMaster/AddLicensingInsuranceMaster";
import MaintainanceWarrantyMaster from "../pages/VehicleMaster/MaintainanceWarrantyMaster/MaintainanceWarrantyMaster";
import AddMaintainanceWarrantyMaster from "../pages/VehicleMaster/MaintainanceWarrantyMaster/AddMaintainanceWarrantyMaster";
import EditMaintainanceWarrantyMaster from "../pages/VehicleMaster/MaintainanceWarrantyMaster/EditMaintainanceWarrantyMaster";
import UtilizationLog from "../pages/VehicleMaster/UtilizationLog/UtilizationLog";
import AddUtilizationLog from "../pages/VehicleMaster/UtilizationLog/AddUtilizationLog";
import EditUtilizationLog from "../pages/VehicleMaster/UtilizationLog/EditUtilizationLog";
import VehicleTypeMaster from "../pages/VehicleMaster/VehicleTypeMater/VehicleTypeMaster";
import Complaint from "../pages/VehicleComplaints/Complaint/Complaint";
import AddComplaint from "../pages/VehicleComplaints/Complaint/AddComplaint";
import EditComplaint from "../pages/VehicleComplaints/Complaint/EditComplaint";
import JobCard from "../pages/VehicleComplaints/JobCard/JobCard";
import AddJobCard from "../pages/VehicleComplaints/JobCard/AddJobCard";
import EditJobCard from "../pages/VehicleComplaints/JobCard/EditJobCard"
import JobWorkChallan from "../pages/VehicleComplaints/JobWorkChallan/JobWorkChallan";
import AddJobWorkChallan from "../pages/VehicleComplaints/JobWorkChallan/AddJobWorkChallan";
import EditJobWorkChallan from "../pages/VehicleComplaints/JobWorkChallan/EditJobWorkChallan";
import JobWorkChallanRecieve from "../pages/VehicleComplaints/JobWorkChallanRecieve/JobWorkChallanRecieve";
import AddJobWorkChallanRecieve from "../pages/VehicleComplaints/JobWorkChallanRecieve/AddJobWorkChallanRecieve";
import EditJobWorkChallanRecieve from "../pages/VehicleComplaints/JobWorkChallanRecieve/EditJobWorkChallanRecieve";
import ComplainStatus from "../pages/Reports/ComplainStatus/ComplainStatus";
import WorkshopService from "../pages/Reports/WorkshopService/WorkshopService";
import VendorItemDetail from "../pages/Reports/VendorItemDetail/VendorItemDetail";
import VendorEvaluationReport from "../pages/Reports/VendorEvaluationReport/VendorEvaluationReport";
import VehicleStatusReport from "../pages/Reports/VehicleStatusReport/VehicleStatusReport";
import VehicleItemService from "../pages/Reports/VehicleItemService/VehicleItemService";
import VehicleEfileReport from "../pages/Reports/VehicleEfileReport/VehicleEfileReport";
import VehicleAgeReport from "../pages/Reports/VehicleAgeReport/VehicleAgeReport";
import StockSummaryReport from "../pages/Reports/StockSummaryReport/StockSummaryReport";
import StockLedgerReport from "../pages/Reports/StockLedgerReport/StockLedgerReport";
import OutSourceService from "../pages/Reports/OutSourceService/OutSourceService";
import JobCardStatus from "../pages/Reports/JobCardStatus/JobCardStatus";
import FolderLocation from "../pages/master/FolderLocation/FolderLocation";
import FinancialYear from "../pages/master/FinancialYear/FinancialYear";
import StockBin from "../pages/master/StockBin/StockBin";
import EditItemContract from "../pages/VendorInfo/ItemContract/EditItemContract";
import AddItemContract from "../pages/VendorInfo/ItemContract/AddItemContract";
import ItemContract from "../pages/VendorInfo/ItemContract/ItemContract";
import EditServiceContract from "../pages/VendorInfo/ServiceContract/EditServiceContract";
import AddServiceContract from "../pages/VendorInfo/ServiceContract/AddServiceContract";
import ServiceContract from "../pages/VendorInfo/ServiceContract/ServiceContract";
import Services from "../pages/VendorInfo/Services/Services";
import AddVendor from "../pages/VendorInfo/Vendor/AddVendor";
import EditVendor from "../pages/VendorInfo/Vendor/EditVendor";
import Vendor from "../pages/VendorInfo/Vendor/Vendor";
import VehicleTypeInfo from "../pages/VehicleMaster/VehicleTypeInfo/VehicleTypeInfo";
import Location from "../pages/VehicleMaster/Location/Location";
import FuelTypeMaster from "../pages/VehicleMaster/FuelTypeMaster/FuelTypeMaster";
import BrandMaster from "../pages/VehicleMaster/BrandMaster/BrandMaster";
import EditVehicleDetail from "../pages/VehicleMaster/VehicleDetail/EditVehicleDetail";
import AddVehicleDetail from "../pages/VehicleMaster/VehicleDetail/AddVehicleDetail";
import VehicleDetail from "../pages/VehicleMaster/VehicleDetail/VehicleDetail";
import EditUploadDocuments from "../pages/EmployeeInfo/UploadDocuments/EditUploadDocuments";
import AddUploadDocuments from "../pages/EmployeeInfo/UploadDocuments/AddUploadDocuments";
import UploadDocuments from "../pages/EmployeeInfo/UploadDocuments/UploadDocuments";
import EditOrganization from "../pages/EmployeeInfo/Organization/EditOrganization";
import AddOrganization from "../pages/EmployeeInfo/Organization/AddOrganization";
import Organization from "../pages/EmployeeInfo/Organization/Organization";
import Designation from "../pages/EmployeeInfo/Designation/Designation";
import Department from "../pages/EmployeeInfo/Department/Department";
import EditEmployee from "../pages/EmployeeInfo/Employee/EditEmployee";
import AddEmployee from "../pages/EmployeeInfo/Employee/AddEmployee";
import Employee from "../pages/EmployeeInfo/Employee/Employee";
import EditOfficePurchaseOrder from "../pages/Inventory/OfficePurchaseOrder/EditOfficePurchaseOrder";
import CreateOfficePurchaseOrder from "../pages/Inventory/OfficePurchaseOrder/CreateOfficePurchaseOrder";
import EditJobCardItemReturn from "../pages/Inventory/JobCardItemReturn/EditJobCardItemReturn";
import CreateJobCardItemReturn from "../pages/Inventory/JobCardItemReturn/CreateJobCardItemReturn";
import JobCardItemReturn from "../pages/Inventory/JobCardItemReturn/JobCardItemReturn";
import EditStockGeneral from "../pages/Inventory/StockGeneral/EditStockGeneral";
import CreateStockGeneral from "../pages/Inventory/StockGeneral/CreateStockGeneral";
import StockGeneral from "../pages/Inventory/StockGeneral/StockGeneral";
import EditJobcardItemIssue from "../pages/Inventory/JobcardItemIssue/EditJobcardItemIssue";
import CreateJobcardItemIssue from "../pages/Inventory/JobcardItemIssue/CreateJobcardItemIssue";
import JobcardItemIssue from "../pages/Inventory/JobcardItemIssue/JobcardItemIssue";
import EditPurchaseInvoice from "../pages/Inventory/PurchaseInvoice/EditPurchaseInvoice";
import CreatePurchaseInvoice from "../pages/Inventory/PurchaseInvoice/CreatePurchaseInvoice";
import PurchaseInvoice from "../pages/Inventory/PurchaseInvoice/PurchaseInvoice";
import EditWorkShopPurchaseOrder from "../pages/Inventory/WorkShopPurchaseOrder/EditWorkShopPurchaseOrder";
import CreateWorkShopPurchaseOrder from "../pages/Inventory/WorkShopPurchaseOrder/CreateWorkShopPurchaseOrder";
import WorkShopPurchaseOrder from "../pages/Inventory/WorkShopPurchaseOrder/WorkShopPurchaseOrder";
import OfficePurchaseOrder from "../pages/Inventory/OfficePurchaseOrder/OfficePurchaseOrder";
import EditOfficePurchaseIndent from "../pages/Inventory/OfficePurchaseIndent/EditOfficePurchaseIndent";
import CreateOfficePurchaseIndent from "../pages/Inventory/OfficePurchaseIndent/CreateOfficePurchaseIndent";
import EditItemDetail from "../pages/Inventory/ItemDetail/EditItemDetail";
import CreateItemDetail from "../pages/Inventory/ItemDetail/CreateItemDetail";
import ItemDetail from "../pages/Inventory/ItemDetail/ItemDetail";
import EditWorkShopPurchaseIndent from "../pages/Inventory/WorkShopPurchaseIndent/EditWorkShopPurchaseIndent";
import CreateWorkShopPurchaseIndent from "../pages/Inventory/WorkShopPurchaseIndent/CreateWorkShopPurchaseIndent";
import EditJobCardIndent from "../pages/Inventory/JobCardIndent/EditJobCardIndent";
import CreateJobCardIndent from "../pages/Inventory/JobCardIndent/CreateJobCardIndent";
import JobCardIndent from "../pages/Inventory/JobCardIndent/JobCardIndent";
import WorkShopPurchaseIndent from "../pages/Inventory/WorkShopPurchaseIndent/WorkShopPurchaseIndent";
import SmsEventSettings from "../pages/Emailsystem/SmsEventSettings/SmsEventSettings";
import CreateSmsEventSettings from "../pages/Emailsystem/SmsEventSettings/CreateSmsEventSettings";
import EditSmsEventSettings from "../pages/Emailsystem/SmsEventSettings/EditSmsEventSettings";
import Smscampagian from "../pages/Emailsystem/Smscampagian/Smscampagian";
import CreateSmscampagian from "../pages/Emailsystem/Smscampagian/CreateSmscampagian";
import EditSmscampagian from "../pages/Emailsystem/Smscampagian/EditSmscampagian";
import Smssetting from "../pages/Emailsystem/Smssetting/Smssetting";
import OfficePurchaseIndent from "../pages/Inventory/OfficePurchaseIndent/OfficePurchaseIndent";
import LoginPage1 from "../loginPage/LoginPage1";
import AddComplaintApproval from "../pages/Admin/ComplaintApproval/AddComplaintApproval";
import AddJobCard1 from "../pages/VehicleComplaints/JobCard1/AddJobCard1";
import EditJobCard1 from "../pages/VehicleComplaints/JobCard1/EditJobCard1";
import JobCard1 from "../pages/VehicleComplaints/JobCard1/JobCard1";
import Flowmaster from "../pages/Admin/Flowmaster/flowmaster";
import ComplaintApproval from "../pages/Admin/ComplaintApproval/ComplaintApproval";
import EditComplaintApproval from "../pages/Admin/ComplaintApproval/EditComplaintApproval";
import Juridiction from "../pages/UserManagementMaster/Juridiction/Juridiction";
import MenuMaster from "../pages/Admin/MenuMaster/MenuMaster";
import HelpCreation from "../pages/Admin/HelpCreation/HelpCreation";
import ItemConsumedReport from "../pages/Reports/ItemConsumedReport/ItemConsumedReport";





const appRoutes: RouteType[] = [
  {
    index: true,
    element: <LoginPage1 />,
    state: "home",
  },
  {
    element: <HomePage />,
    state: "home",
    path: "/home",
    sidebarProps: {
      displayText: "Home",
      icon: <HomeIcon />,
    },
  },

  {
    path: "/master",
    element: <DashboardPageLayout />,
    state: "master",
    sidebarProps: {
      displayText: "Master",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "master.index",
      },
     
      {
        path: "/master/ZoneMaster",
        element: <ZoneMaster />,
        state: "master.ZoneMaster",
        sidebarProps: {
          displayText: "Zone Master",
        },
      },
     
      {
        path: "/master/CityMaster",
        element: <CityMaster />,
        state: "master.CityMaster",
        sidebarProps: {
          displayText: "District",
        },
      },
      {
        path: "/master/StateMaster",
        element: <StateMaster />,
        state: "master.StateMaster",
        sidebarProps: {
          displayText: "State",
        },
      },
     
      {
        path: "/master/CountryMaster",
        element: <CountryMaster />,
        state: "master.CountryMaster",
        sidebarProps: {
          displayText: "Country",
        },
      },
     
      
      {
        path: "/master/ItemType",
        element: <ItemType />,
        state: "master.ItemType",
      },
     
      {
        path: "/master/ItemCategory",
        element: <ItemCategory />,
        state: "master.ItemCategory",
        sidebarProps: {
          displayText: "ItemCategory",
        },
      },

      
      {
        path: "/master/Taxmaster",
        element: <Taxmaster />,
        state: "master.Taxmaster",
        sidebarProps: {
          displayText: "Tax master",
        },
      },
      {
        path: "/master/Unitmaster",
        element: <Unitmaster />,
        state: "master.Unitmaster",
        sidebarProps: {
          displayText: "Unit master",
        },
      },
      
      {
        path: "/master/FolderLocation",
        element: <FolderLocation />,
        state: "master.FolderLocation",
        sidebarProps: {
          displayText: "Folder Location",
        },
      },


      {
        path: "/master/FinancialYear",
        element: <FinancialYear />,
        state: "master.FinancialYear",
        sidebarProps: {
          displayText: "Financial Year",
        },
      },


      {
        path: "/master/StockBin",
        element: <StockBin />,
        state: "master.StockBin",
        sidebarProps: {
          displayText: "Stock Bin",
        },
      },

    ],

  },





  //======================Master Form End========================



  /////-------------------start ------Inventory-----------------------

  {
    path: "/Inventory",
    element: <DashboardPageLayout />,
    state: "Inventory",

    sidebarProps: {
      displayText: "Inventory",
      icon: <DashboardOutlinedIcon />
    },

    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Inventory.index",
      },


      // {
      //   path: "/Inventory/IndentForm",
      //   element: <IndentFormMaster/>,
      //   state: "Inventory.IndentForm",
      //   sidebarProps: {
      //     displayText: "Indent Form",
      //   }
      // },
      // {
      //   path: "/Inventory/CreateIndentForm",
      //   element: <CreateIndentForm />,
      //   state: "Inventory.CreateIndentForm",
      // },
      // {
      //   path: "/Inventory/EditIndentForm",
      //   element: <EditIndentForm />,
      //   state: "Inventory.EditIndentForm",
      // },
      {
        path: "/Inventory/MRNForm",
        element: <MaterialRecieptNoteMaster />,
        state: "Inventory.MRNForm",
        sidebarProps: {
          displayText: "Material Recpt Notes",
        }
      },
      {
        path: "/Inventory/CreateMRN",
        element: <CreateMaterialRecieptNote />,
        state: "Inventory.CreateMRN",
      },
      {
        path: "/Inventory/EditMRN",
        element: <EditMaterialRecieptNote />,
        state: "Inventory.EditMRN",
      },
      {
        path: "/Inventory/QualityCheck",
        element: <QualityCheckMaster />,
        state: "Inventory.QualityCheck",
        sidebarProps: {
          displayText: "Quality Check",
        }
      },
      {
        path: "/Inventory/CreateQualityCheck",
        element: <CreateQualityCheck />,
        state: "Inventory.CreateQualityCheck",
      },
      {
        path: "/Inventory/EditQualityCheck",
        element: <EditQualityCheck />,
        state: "Inventory.EditQualityCheck",
      },


      

      {
        path: "/Inventory/StaffIndent",
        element: <StaffIndent />,
        state: "Inventory.StaffIndent",
        sidebarProps: {
          displayText: "Staff Indent",
        }
      },
      {
        path: "/Inventory/CreateStaffIndent",
        element: <CreateStaffIndent />,
        state: "Inventory.CreateStaffIndent",
      },
      {
        path: "/Inventory/EditStaffIndent",
        element: <EditStaffIndent />,
        state: "Inventory.EditStaffIndent",
      },

      {
        path: "/Inventory/StaffItemIssue",
        element: <StaffItemIssue />,
        state: "Inventory.StaffItemIssue",
        sidebarProps: {
          displayText: "Staff Item Issue",
        }
      },
      {
        path: "/Inventory/CreateStaffItemIssue",
        element: <CreateStaffItemIssue />,
        state: "Inventory.CreateStaffItemIssue",
      },
      {
        path: "/Inventory/EditStaffItemIssue",
        element: <EditStaffItemIssue />,
        state: "Inventory.EditStaffItemIssue",
      },

      {
        path: "/Inventory/StaffItemReturn",
        element: <StaffItemReturn />,
        state: "Inventory.StaffItemReturn",
        sidebarProps: {
          displayText: "Staff Item Return",
        }
      },
      {
        path: "/Inventory/CreateStaffItemReturn",
        element: <CreateStaffItemReturn />,
        state: "Inventory.CreateStaffItemReturn",
      },
      {
        path: "/Inventory/EditStaffItemReturn",
        element: <EditStaffItemReturn />,
        state: "Inventory.EditStaffItemReturn",
      },
     

      {
        path: "/Inventory/JobCardIndent",
        element: <JobCardIndent />,
        state: "Inventory.JobCardIndent",
        sidebarProps: {
          displayText: "JobCardIndent",
        }
      },
      {
        path: "/Inventory/CreateJobCardIndent",
        element: <CreateJobCardIndent />,
        state: "Inventory.CreateJobCardIndent",
      },
      {
        path: "/Inventory/EditJobCardIndent",
        element: <EditJobCardIndent />,
        state: "Inventory.EditJobCardIndent",
      },


      {
        path: "/Inventory/WorkShopPurchaseIndent",
        element: <WorkShopPurchaseIndent />,
        state: "Inventory.WorkShopPurchaseIndent",
        sidebarProps: {
          displayText: "WorkShopPurchaseIndent",
        }
      },
      {
        path: "/Inventory/CreateWorkShopPurchaseIndent",
        element: <CreateWorkShopPurchaseIndent />,
        state: "Inventory.CreateWorkShopPurchaseIndent",
      },
      {
        path: "/Inventory/EditWorkShopPurchaseIndent",
        element: <EditWorkShopPurchaseIndent />,
        state: "Inventory.EditWorkShopPurchaseIndent",
      },

      {
        path: "/Inventory/StoreMaster",
        element: <StoreMaster />,
        state: "Inventory.StoreMaster",
      },

      {
        path: "/Inventory/ItemDetail",
        element: <ItemDetail />,
        state: "Inventory.ItemDetail",
        sidebarProps: {
          displayText: "Item Detail",
        },
      },
      {

        path: "/Inventory/CreateItemDetail",
        element: <CreateItemDetail />,
        state: "Inventory.CreateItemDetail",
      },
      {
        path: "/Inventory/EditItemDetail",
        element: <EditItemDetail />,
        state: "Inventory.EditItemDetail",

      },

      {
        path: "/Inventory/OfficePurchaseIndent",
        element: <OfficePurchaseIndent />,
        state: "Inventory.OfficePurchaseIndent",
        sidebarProps: {
          displayText: "Office Purchase Indent",
        },
      },
      {

        path: "/Inventory/CreateOfficePurchaseIndent",
        element: <CreateOfficePurchaseIndent />,
        state: "Inventory.CreateOfficePurchaseIndent",
      },
      {
        path: "/Inventory/EditOfficePurchaseIndent",
        element: <EditOfficePurchaseIndent />,
        state: "Inventory.EditOfficePurchaseIndent",

      },

      {
        path: "/Inventory/OfficePurchaseOrder",
        element: <OfficePurchaseOrder />,
        state: "Inventory.OfficePurchaseOrder",
        sidebarProps: {
          displayText: "Office Purchase Order",
        },
      },
      {

        path: "/Inventory/CreateOfficePurchaseOrder",
        element: <CreateOfficePurchaseOrder />,
        state: "Inventory.CreateOfficePurchaseOrder",
      },
      {
        path: "/Inventory/EditOfficePurchaseOrder",
        element: <EditOfficePurchaseOrder />,
        state: "Inventory.EditOfficePurchaseOrder",

      },

      {
        path: "/Inventory/WorkShopPurchaseOrder",
        element: <WorkShopPurchaseOrder />,
        state: "Inventory.WorkShopPurchaseOrder",
        sidebarProps: {
          displayText: "WorkShop Purchase Order",
        },
      },
      {

        path: "/Inventory/CreateWorkShopPurchaseOrder",
        element: <CreateWorkShopPurchaseOrder />,
        state: "Inventory.CreateWorkShopPurchaseOrder",
      },
      {
        path: "/Inventory/EditWorkShopPurchaseOrder",
        element: <EditWorkShopPurchaseOrder />,
        state: "Inventory.EditWorkShopPurchaseOrder",

      },

      {
        path: "/Inventory/PurchaseInvoice",
        element: <PurchaseInvoice />,
        state: "Inventory.PurchaseInvoice",
        sidebarProps: {
          displayText: "Purchase Invoice",
        },
      },
      {

        path: "/Inventory/CreatePurchaseInvoice",
        element: <CreatePurchaseInvoice />,
        state: "Inventory.CreatePurchaseInvoice",
      },
      {
        path: "/Inventory/EditPurchaseInvoice",
        element: <EditPurchaseInvoice />,
        state: "Inventory.EditPurchaseInvoice",

      },

      {
        path: "/Inventory/JobcardItemIssue",
        element: <JobcardItemIssue />,
        state: "Inventory.JobcardItemIssue",
        sidebarProps: {
          displayText: "Jobcard Item Issue",
        },
      },
      {

        path: "/Inventory/CreateJobcardItemIssue",
        element: <CreateJobcardItemIssue />,
        state: "Inventory.CreateJobcardItemIssue",
      },
      {
        path: "/Inventory/EditJobcardItemIssue",
        element: <EditJobcardItemIssue />,
        state: "Inventory.EditJobcardItemIssue",

      },

      {
        path: "/Inventory/StockGeneral",
        element: <StockGeneral />,
        state: "Inventory.StockGeneral",
        sidebarProps: {
          displayText: "Stock General",
        },
      },
      {

        path: "/Inventory/CreateStockGeneral",
        element: <CreateStockGeneral />,
        state: "Inventory.CreateStockGeneral",
      },
      {
        path: "/Inventory/EditStockGeneral",
        element: <EditStockGeneral />,
        state: "Inventory.EditStockGeneral",

      },

      {
        path: "/Inventory/JobCardItemReturn",
        element: <JobCardItemReturn />,
        state: "Inventory.JobCardItemReturn",
        sidebarProps: {
          displayText: "JobCard Item Return",
        }
      },
      {
        path: "/Inventory/CreateJobCardItemReturn",
        element: <CreateJobCardItemReturn />,
        state: "Inventory.CreateJobCardItemReturn",
      },
      {
        path: "/Inventory/EditJobCardItemReturn",
        element: <EditJobCardItemReturn />,
        state: "Inventory.EditJobCardItemReturn",
      },



    ]

  },

  //=================Aniket sahu Emailroute start ===================
  {
    path: "/emailsystem",
    element: <DashboardPageLayout />,
    state: "emailsystem",
    sidebarProps: {
      displayText: "emailsystem",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        path: "/emailsystem/Groupmaster",
        element: <Groupmaster />,
        state: "emailsystem.Groupmaster",
        sidebarProps: {
          displayText: "Groupmaster",
        },
      },
      {

        path: "/emailsystem/Creategroupmaster",
        element: <Creategroupmaster />,
        state: "emailsystem.Creategroupmaster",
      },
      {
        path: "/emailsystem/Editgroupmaster",
        element: <Editgroupmaster />,
        state: "emailsystem.Editgroupmaster",

      },

      {
        path: "/emailsystem/emailsetting",
        element: <Emailsettingmaster />,
        state: "email.emailMaster",
      },
      {
        path: "/emailsystem/campagianmaster",
        element: <EmailcampgianMaster />,
        state: "email.emailMaster",
      },
      {
        path: "/emailsystem/addcampagianmaster",
        element: <CreatemailcampgiontForm />,
        state: "email.emailMaster",
      },
      {
        path: "/emailsystem/editcampagianmaster",
        element: <Editcampgianmailmaster />,
        state: "email.emailMaster",
      },
      {
        path: "/emailsystem/eventmaster",
        element: <EmaileventMaster />,
        state: "email.emailMaster",
      },
      {
        path: "/emailsystem/addeventmaster",
        element: <CreatemaileventForm />,
        state: "email.emailMaster",
      },
      {
        path: "/emailsystem/editeventnmaster",
        element: <Editeventemail />,
        state: "email.emailMaster",
      },

      {
        path: "/emailsystem/CampaignTemplate",
        element: <CampaignTemplate />,
        state: "emailsystem.CampaignTemplate",
        sidebarProps: {
          displayText: "CampaignTemplate",
        },
      },
      {

        path: "/emailsystem/AddCampaignTemplate",
        element: <AddCampaignTemplate />,
        state: "emailsystem.AddCampaignTemplate",
      },
      {
        path: "/emailsystem/EditCampaignTemplate",
        element: <EditCampaignTemplate />,
        state: "emailsystem.EditCampaignTemplate",

      },

      {
        path: "/emailsystem/SmsEventSettings",
        element: <SmsEventSettings />,
        state: "emailsystem.SmsEventSettings",
        sidebarProps: {
          displayText: "SmsEventSettings",
        },
      },
      {

        path: "/emailsystem/CreateSmsEventSettings",
        element: <CreateSmsEventSettings />,
        state: "emailsystem.CreateSmsEventSettings",
      },
      {
        path: "/emailsystem/EditSmsEventSettings",
        element: <EditSmsEventSettings />,
        state: "emailsystem.EditSmsEventSettings",

      },

      {
        path: "/emailsystem/Smscampagian",
        element: <Smscampagian />,
        state: "emailsystem.Smscampagian",
        sidebarProps: {
          displayText: "Smscampagian",
        },
      },
      {

        path: "/emailsystem/CreateSmscampagian",
        element: <CreateSmscampagian />,
        state: "emailsystem.CreateSmscampagian",
      },
      {
        path: "/emailsystem/EditSmscampagian",
        element: <EditSmscampagian />,
        state: "emailsystem.EditSmscampagian",

      },

      {
        path: "/emailsystem/Smssetting",
        element: <Smssetting />,
        state: "email.Smssetting",
      },
    ],
  },
  //==================end========UserManagement==========


  //==================Start DocManagement====================
 
  //===================End Library===================

  // {
  //   path: "/Inventory/IndentApproval",
  //   element: <IndentApproval />,
  //   state: "Inventory.IndentApproval",
  //   sidebarProps: {
  //     displayText: "Indent Approval",
  //   }
  // },
  // {
  //   path: "/Inventory/CreateIndentApproval",
  //   element: <CreateIndentApproval/>,
  //   state: "Inventory.CreateIndentApproval",
  // },
  // {
  //   path: "/Inventory/EditIndentApproval",
  //   element: <EditIndentApproval/>,
  //   state: "Inventory.EditIndentApproval",
  // },


  // {
  //   path: "/Inventory/ForwardLevel",
  //   element: <ForwardLevel />,
  //   state: "Inventory.ForwardLevel",
  //   sidebarProps: {
  //     displayText: "Forward Level",
  //   }
  // },
  // {
  //   path: "/Inventory/CreateForwardLevel",
  //   element: <CreateForwardLevel/>,
  //   state: "Inventory.CreateForwardLevel",
  // },
  // {
  //   path: "/Inventory/EditForwardLevel",
  //   element: <EditForwardLevel/>,
  //   state: "Inventory.EditForwardLevel",
  // },
  // {
  //   path: "/Inventory/IndentStore",
  //   element: <IndentStore />,
  //   state: "Inventory.IndentStore",
  //   sidebarProps: {
  //     displayText: "Indent Store",
  //   }
  // },
  // {
  //   path: "/Inventory/CreateIndentStore",
  //   element: <CreateIndentStore/>,
  //   state: "Inventory.CreateIndentStore",
  // },
  // {
  //   path: "/Inventory/EditIndentStore",
  //   element: <EditIndentStore/>,
  //   state: "Inventory.EditIndentStore",
  // },



  //==================end========UserManagement==========


  /////-------------------start ------UserManagement-----------------------



  //==================end========UserManagement==========

  //==================== Start Employee Information====================
  {
    path: "/Employee",
    element: <DashboardPageLayout />,
    state: "Employee",
    sidebarProps: {
      displayText: "Employee",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "employeeinfo.index",
      },
      {
        path: "/Employee/EmployeeMaster",
        element: <EmployeeMaster />,
        state: "Employee.EmployeeMaster",
        sidebarProps: {
          displayText: "Employee Master",
        }
      },
      {
        path: "/Employee/EmployeeAdd",
        element: <EmployeeAdd />,
        state: "Employee.EmployeeAdd",
      },
      {
        path: "/Employee/EmployeeEdit",
        element: <EmployeeEdit />,
        state: "Employee.EmployeeEdit",
      },


    ],
  },
  //==================User Management=========


  {
    path: "/UserManagement",
    element: <DashboardPageLayout />,
    state: "UserManagement",
    sidebarProps: {
      displayText: "User Management",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "UserManagement.index",
      },
      {
        path: "/UserManagement/UserPermissionMaster",
        element: <UserPermissionMaster />,
        state: "UserManagement.UserPermissionMaster",
        sidebarProps: {
          displayText: "User Permission",
        }
      },





    ],
  },


  {
    path: "/security",
    element: <DashboardPageLayout />,
    state: "security",
    sidebarProps: {
      displayText: "Security",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "security.index",
      },

      {
        path: "/security/RoleMaster",
        element: <RoleMaster />,
        state: "security.RoleMaster",
        sidebarProps: {
          displayText: "Role Master",
        }
      },
      {
        path: "/security/Jurisdiction",
        element: <Juridiction />,
        state: "security.Jurisdiction",
        sidebarProps: {
          displayText: "Jurisdiction",
        }
      },
    ],
  },

  //====================================vehicleMaster-start================================//

  {
    path: "/vehiclemaster",
    element: <DashboardPageLayout />,
    state: "vehiclemaster",
    sidebarProps: {
      displayText: "Vehicle Master",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "vehiclemaster.index",
      },
      {
        path: "/vehiclemaster/LicensingInsuranceMaster",
        element: <LicensingInsuranceMaster />,
        state: "vehiclemaster.LicensingInsuranceMaster",
        sidebarProps: {
          displayText: "Licensing/Insurance",
        },
      },
      {
        path: "/vehiclemaster/AddLicensingInsuranceMaster",
        element: <AddLicensingInsuranceMaster />,
        state: "vehiclemaster.AddLicensingInsuranceMaster",
      },
      {
        path: "/vehiclemaster/EditLicensingInsuranceMaster",
        element: <EditLicensingInsuranceMaster />,
        state: "vehiclemaster.EditLicensingInsuranceMaster",
      },
      {
        path: "/vehiclemaster/MaintainanceWarrantyMaster",
        element: <MaintainanceWarrantyMaster />,
        state: "vehiclemaster.MaintainanceWarrantyMaster",
        sidebarProps: {
          displayText: "Licensing/Insurance",
        },
      },
      {
        path: "/vehiclemaster/AddMaintainanceWarrantyMaster",
        element: <AddMaintainanceWarrantyMaster />,
        state: "vehiclemaster.AddMaintainanceWarrantyMaster",
      },
      {
        path: "/vehiclemaster/EditMaintainanceWarrantyMaster",
        element: <EditMaintainanceWarrantyMaster />,
        state: "vehiclemaster.EditMaintainanceWarrantyMaster",
      },
      {
        path: "/vehiclemaster/UtilizationLog",
        element: <UtilizationLog />,
        state: "vehiclemaster.UtilizationLog",
        sidebarProps: {
          displayText: "Licensing/Insurance",
        },
      },
      {
        path: "/vehiclemaster/AddUtilizationLog",
        element: <AddUtilizationLog />,
        state: "vehiclemaster.AddUtilizationLog",
      },
      {
        path: "/vehiclemaster/EditUtilizationLog",
        element: <EditUtilizationLog />,
        state: "vehiclemaster.EditUtilizationLog",
      },
      {
        path: "/vehiclemaster/VehicleTypeMaster",
        element: <VehicleTypeMaster />,
        state: "vehiclemaster.VehicleTypeMaster",
        sidebarProps: {
          displayText: "Gender",
        },
      },
    ],
  },

  //=====================================Vehicle Complaint=====================================//

  {
    path: "/vehiclecomplaint",
    element: <DashboardPageLayout />,
    state: "vehiclecomplaint",
    sidebarProps: {
      displayText: "Vehicle Complaint",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "vehiclemaster.index",
      },
      {
        path: "/vehiclecomplaint/Complaint",
        element: <Complaint />,
        state: "vehiclecomplaint.Complaint",
        sidebarProps: {
          displayText: "Complaint",
        },
      },
      {
        path: "/vehiclecomplaint/AddComplaint",
        element: <AddComplaint />,
        state: "vehiclecomplaint.AddComplaint",
      },
      {
        path: "/vehiclecomplaint/EditComplaint",
        element: <EditComplaint />,
        state: "vehiclecomplaint.EditComplaint",
      },
      {
        path: "/vehiclecomplaint/JobCard",
        element: <JobCard />,
        state: "vehiclecomplaint.JobCard",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobCard",
        element: <AddJobCard />,
        state: "vehiclecomplaint.AddJobCard",
      },
      {
        path: "/vehiclecomplaint/EditJobCard",
        element: <EditJobCard />,
        state: "vehiclecomplaint.EditJobCard",
      },
      {
        path: "/vehiclecomplaint/JobCard1",
        element: <JobCard1 />,
        state: "vehiclecomplaint.JobCard1",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobCard1",
        element: <AddJobCard1 />,
        state: "vehiclecomplaint.AddJobCard1",
      },
      {
        path: "/vehiclecomplaint/EditJobCard1",
        element: <EditJobCard1 />,
        state: "vehiclecomplaint.EditJobCard1",
      },
      {
        path: "/vehiclecomplaint/JobWorkChallan",
        element: <JobWorkChallan />,
        state: "vehiclecomplaint.JobWorkChallan",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobWorkChallan",
        element: <AddJobWorkChallan />,
        state: "vehiclecomplaint.AddJobWorkChallan",
      },
      {
        path: "/vehiclecomplaint/EditJobWorkChallan",
        element: <EditJobWorkChallan />,
        state: "vehiclecomplaint.EditJobWorkChallan",
      },
      {
        path: "/vehiclecomplaint/JobWorkChallanRecieve",
        element: <JobWorkChallanRecieve />,
        state: "vehiclecomplaint.JobWorkChallanRecieve",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobWorkChallanRecieve",
        element: <AddJobWorkChallanRecieve />,
        state: "vehiclecomplaint.AddJobWorkChallanRecieve",
      },
      {
        path: "/vehiclecomplaint/EditJobWorkChallanRecieve",
        element: <EditJobWorkChallanRecieve />,
        state: "vehiclecomplaint.EditJobWorkChallanRecieve",
      },

    ],
  },


  {
    path: "/Reports",
    element: <DashboardPageLayout />,
    state: "Reports",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Reports.index",
      },

      {
        path: "/Reports/ComplainStatus",
        element: <ComplainStatus />,
        state: "Reports.ComplainStatus",
        sidebarProps: {
          displayText: "Complain Status",
        }
      },


      {
        path: "/Reports/WorkshopService",
        element: <WorkshopService />,
        state: "Reports.WorkshopService",
        sidebarProps: {
          displayText: "Workshop Service",
        }
      },

      {
        path: "/Reports/VendorItemDetail",
        element: <VendorItemDetail />,
        state: "Reports.VendorItemDetail",
        sidebarProps: {
          displayText: "Vendor Item Detail",
        }
      },


      {
        path: "/Reports/VendorEvaluationReport",
        element: <VendorEvaluationReport />,
        state: "Reports.VendorEvaluationReport",
        sidebarProps: {
          displayText: "Vendor Evaluation Report",
        }
      },


      {
        path: "/Reports/VehicleStatusReport",
        element: <VehicleStatusReport />,
        state: "Reports.VehicleStatusReport",
        sidebarProps: {
          displayText: "Vehicle Status Report",
        }
      },


      {
        path: "/Reports/VehicleItemService",
        element: <VehicleItemService />,
        state: "Reports.VehicleItemService",
        sidebarProps: {
          displayText: "Vehicle Item Service",
        }
      },


      {
        path: "/Reports/VehicleEfileReport",
        element: <VehicleEfileReport />,
        state: "Reports.VehicleEfileReport",
        sidebarProps: {
          displayText: "Vehicle E-file Report",
        }
      },


      {
        path: "/Reports/VehicleAgeReport",
        element: <VehicleAgeReport />,
        state: "Reports.VehicleAgeReport",
        sidebarProps: {
          displayText: "Vehicle Age Report",
        }
      },


      {
        path: "/Reports/StockSummaryReport",
        element: <StockSummaryReport />,
        state: "Reports.StockSummaryReport",
        sidebarProps: {
          displayText: "Stock Summary Report",
        }
      },

      {
        path: "/Reports/StockLedgerReport",
        element: <StockLedgerReport />,
        state: "Reports.StockLedgerReport",
        sidebarProps: {
          displayText: "Stock Ledger Report",
        }
      },


      {
        path: "/Reports/OutSourceService",
        element: <OutSourceService />,
        state: "Reports.OutSourceService",
        sidebarProps: {
          displayText: "Out Source Service",
        }
      },

      {
        path: "/Reports/JobCardStatus",
        element: <JobCardStatus />,
        state: "Reports.JobCardStatus",
        sidebarProps: {
          displayText: "Job Card Status",
        }
      },
      {
        path: "/Reports/ItemConsumedReport",
        element: <ItemConsumedReport />,
        state: "Reports.ItemConsumedReport",
        sidebarProps: {
          displayText: "ItemConsumedReport",
        }
      },

    ],
  },



  {
    path: "/employeeInfo",
    element: <DashboardPageLayout />,
    state: "employeeInfo",
    sidebarProps: {
      displayText: "Employee Info",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "employeeInfo.index",
      },
      {
        path: "/employeeInfo/Employee",
        element: <Employee />,
        state: "employeeInfo.Employee",
        sidebarProps: {
          displayText: "Employee",
        }
      },
      {
        path: "/employeeInfo/AddEmployee",
        element: <AddEmployee />,
        state: "employeeInfo.AddEmployee",
      },
      {
        path: "/employeeInfo/EditEmployee",
        element: <EditEmployee />,
        state: "employeeInfo.EditEmployee",
      },
      {
        path: "/employeeInfo/Department",
        element: <Department />,
        state: "employeeInfo.Department",
        sidebarProps: {
          displayText: "Department",
        }
      },
      {
        path: "/employeeInfo/Designation",
        element: <Designation />,
        state: "employeeInfo.Designation",
        sidebarProps: {
          displayText: "Designation",
        }
      },
      {
        path: "/employeeInfo/Organization",
        element: <Organization />,
        state: "employeeInfo.Organization",
        sidebarProps: {
          displayText: "Organization",
        }
      },
      {
        path: "/employeeInfo/AddOrganization",
        element: <AddOrganization />,
        state: "employeeInfo.AddOrganization",
      },
      {
        path: "/employeeInfo/EditOrganization",
        element: <EditOrganization />,
        state: "employeeInfo.EditOrganization",
      },
      {
        path: "/employeeInfo/UploadDocuments",
        element: <UploadDocuments />,
        state: "employeeInfo.UploadDocuments",
        sidebarProps: {
          displayText: "Upload Documents",
        }
      },
      {
        path: "/employeeInfo/AddUploadDocuments",
        element: <AddUploadDocuments />,
        state: "employeeInfo.AddUploadDocuments",
      },
      {
        path: "/employeeInfo/EditUploadDocuments",
        element: <EditUploadDocuments />,
        state: "employeeInfo.EditUploadDocuments",
      },

    ],
  },


  //====================================vehicleMaster-start================================//

  {
    path: "/vehiclemaster",
    element: <DashboardPageLayout />,
    state: "vehiclemaster",
    sidebarProps: {
      displayText: "Vehicle Master",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "vehiclemaster.index",
      },
      {
        path: "/vehiclemaster/LicensingInsuranceMaster",
        element: <LicensingInsuranceMaster />,
        state: "vehiclemaster.LicensingInsuranceMaster",
        sidebarProps: {
          displayText: "Licensing/Insurance",
        },
      },
      {
        path: "/vehiclemaster/AddLicensingInsuranceMaster",
        element: <AddLicensingInsuranceMaster />,
        state: "vehiclemaster.AddLicensingInsuranceMaster",
      },
      {
        path: "/vehiclemaster/EditLicensingInsuranceMaster",
        element: <EditLicensingInsuranceMaster />,
        state: "vehiclemaster.EditLicensingInsuranceMaster",
      },
      {
        path: "/vehiclemaster/MaintainanceWarrantyMaster",
        element: <MaintainanceWarrantyMaster />,
        state: "vehiclemaster.MaintainanceWarrantyMaster",
        sidebarProps: {
          displayText: "Maintainance/Warranty",
        },
      },
      {
        path: "/vehiclemaster/AddMaintainanceWarrantyMaster",
        element: <AddMaintainanceWarrantyMaster />,
        state: "vehiclemaster.AddMaintainanceWarrantyMaster",
      },
      {
        path: "/vehiclemaster/EditMaintainanceWarrantyMaster",
        element: <EditMaintainanceWarrantyMaster />,
        state: "vehiclemaster.EditMaintainanceWarrantyMaster",
      },
      {
        path: "/vehiclemaster/UtilizationLog",
        element: <UtilizationLog />,
        state: "vehiclemaster.UtilizationLog",
        sidebarProps: {
          displayText: "UtilizationLog",
        },
      },
      {
        path: "/vehiclemaster/AddUtilizationLog",
        element: <AddUtilizationLog />,
        state: "vehiclemaster.AddUtilizationLog",
      },
      {
        path: "/vehiclemaster/EditUtilizationLog",
        element: <EditUtilizationLog />,
        state: "vehiclemaster.EditUtilizationLog",
      },
      {
        path: "/vehiclemaster/VehicleTypeMaster",
        element: <VehicleTypeMaster />,
        state: "vehiclemaster.VehicleTypeMaster",
        sidebarProps: {
          displayText: "Vehicle Type",
        },
      },
      {
        path: "/vehiclemaster/VehicleDetail",
        element: <VehicleDetail />,
        state: "vehiclemaster.VehicleDetail",
        sidebarProps: {
          displayText: "Vehicle Detail",
        },
      },
      {
        path: "/vehiclemaster/AddVehicleDetail",
        element: <AddVehicleDetail />,
        state: "vehiclemaster.AddVehicleDetail",
      },
      {
        path: "/vehiclemaster/EditVehicleDetail",
        element: <EditVehicleDetail />,
        state: "vehiclemaster.EditVehicleDetail",
      },
      {
        path: "/vehiclemaster/BrandMaster",
        element: <BrandMaster />,
        state: "vehiclemaster.BrandMaster",
        sidebarProps: {
          displayText: "Brand Master",
        },
      },
      {
        path: "/vehiclemaster/FuelTypeMaster",
        element: <FuelTypeMaster />,
        state: "vehiclemaster.FuelTypeMaster",
        sidebarProps: {
          displayText: "Fuel Type Master",
        },
      },
      {
        path: "/vehiclemaster/Location",
        element: <Location />,
        state: "vehiclemaster.Location",
        sidebarProps: {
          displayText: "Location",
        },
      },
      {
        path: "/vehiclemaster/VehicleTypeInfo",
        element: <VehicleTypeInfo />,
        state: "vehiclemaster.VehicleTypeInfo",
        sidebarProps: {
          displayText: "VehicleTypeInfo",
        },
      },
    ],
  },

  //=====================================Vehicle Complaint=====================================//

  {
    path: "/vehiclecomplaint",
    element: <DashboardPageLayout />,
    state: "vehiclecomplaint",
    sidebarProps: {
      displayText: "Vehicle Complaint",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "vehiclecomplaint.index",
      },
      {
        path: "/vehiclecomplaint/Complaint",
        element: <Complaint />,
        state: "vehiclecomplaint.Complaint",
        sidebarProps: {
          displayText: "Complaint",
        },
      },
      {
        path: "/vehiclecomplaint/AddComplaint",
        element: <AddComplaint />,
        state: "vehiclecomplaint.AddComplaint",
      },
      {
        path: "/vehiclecomplaint/EditComplaint",
        element: <EditComplaint />,
        state: "vehiclecomplaint.EditComplaint",
      },
      {
        path: "/vehiclecomplaint/JobCard",
        element: <JobCard />,
        state: "vehiclecomplaint.JobCard",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobCard",
        element: <AddJobCard />,
        state: "vehiclecomplaint.AddJobCard",
      },
      {
        path: "/vehiclecomplaint/EditJobCard",
        element: <EditJobCard />,
        state: "vehiclecomplaint.EditJobCard",
      },
      {
        path: "/vehiclecomplaint/JobWorkChallan",
        element: <JobWorkChallan />,
        state: "vehiclecomplaint.JobWorkChallan",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobWorkChallan",
        element: <AddJobWorkChallan />,
        state: "vehiclecomplaint.AddJobWorkChallan",
      },
      {
        path: "/vehiclecomplaint/EditJobWorkChallan",
        element: <EditJobWorkChallan />,
        state: "vehiclecomplaint.EditJobWorkChallan",
      },
      {
        path: "/vehiclecomplaint/JobWorkChallanRecieve",
        element: <JobWorkChallanRecieve />,
        state: "vehiclecomplaint.JobWorkChallanRecieve",
        sidebarProps: {
          displayText: "JobCard",
        },
      },
      {
        path: "/vehiclecomplaint/AddJobWorkChallanRecieve",
        element: <AddJobWorkChallanRecieve />,
        state: "vehiclecomplaint.AddJobWorkChallanRecieve",
      },
      {
        path: "/vehiclecomplaint/EditJobWorkChallanRecieve",
        element: <EditJobWorkChallanRecieve />,
        state: "vehiclecomplaint.EditJobWorkChallanRecieve",
      },

    ],
  },

  {
    path: "/vendorinfo",
    element: <DashboardPageLayout />,
    state: "vendorinfo",
    sidebarProps: {
      displayText: "Vendor Info",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "vendorinfo.index",
      },
      {
        path: "/vendorinfo/Vendor",
        element: <Vendor />,
        state: "vendorinfo.Vendor",
        sidebarProps: {
          displayText: "Vendor",
        },
      },
      {
        path: "/vendorinfo/AddVendor",
        element: <AddVendor />,
        state: "vendorinfo.AddVendor",
      },
      {
        path: "/vendorinfo/EditVendor",
        element: <EditVendor />,
        state: "vendorinfo.EditVendor",
      },
      {
        path: "/vendorinfo/Services",
        element: <Services />,
        state: "vendorinfo.Services",
        sidebarProps: {
          displayText: "Services",
        },
      },
      {
        path: "/vendorinfo/ServiceContract",
        element: <ServiceContract />,
        state: "vendorinfo.ServiceContract",
        sidebarProps: {
          displayText: "Service Contract",
        },
      },
      {
        path: "/vendorinfo/AddServiceContract",
        element: <AddServiceContract />,
        state: "vendorinfo.AddServiceContract",
      },
      {
        path: "/vendorinfo/EditServiceContract",
        element: <EditServiceContract />,
        state: "vendorinfo.EditServiceContract",
      },
      {
        path: "/vendorinfo/ItemContract",
        element: <ItemContract />,
        state: "vendorinfo.ItemContract",
        sidebarProps: {
          displayText: "Item Contract",
        },
      },
      {
        path: "/vendorinfo/AddItemContract",
        element: <AddItemContract />,
        state: "vendorinfo.AddItemContract",
      },
      {
        path: "/vendorinfo/EditItemContract",
        element: <EditItemContract />,
        state: "vendorinfo.EditItemContract",
      },

    ],
  },
  {
    path: "/Admin",
    element: <DashboardPageLayout />,
    state: "Admin",
    sidebarProps: {
      displayText: "Admin",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "index",
      },
      {
        path: "/Admin/ComplaintApproval",
        element: <ComplaintApproval />,
        state: "ComplaintApproval",
        sidebarProps: {
          displayText: "Complaint Approval",
        },
      },
      {
        path: "/Admin/AddComplaintApproval",
        element: <AddComplaintApproval />,
        state: "AddComplaintApproval",
      },
      {
        path: "/Admin/EditComplaintApproval",
        element: <EditComplaintApproval />,
        state: "EditComplaintApproval",
      },

      {
        path: "/Admin/Flowmaster",
        element: <Flowmaster/>,
        state: "Flowmaster",
        sidebarProps: {
          displayText: "Flow Master",
        },
      },
      {
        path: "/Admin/MenuCreate",
        element: <MenuMaster/>,
        state: "MenuCreate",
        sidebarProps: {
          displayText: "Menu Create",
        },
      },
      {
        path: "/Admin/HelpCreation",
        element: <HelpCreation/>,
        state: "HelpCreation",
        sidebarProps: {
          displayText: "Help Creation",
        },
      },

    ]
  }

];



export default appRoutes;

