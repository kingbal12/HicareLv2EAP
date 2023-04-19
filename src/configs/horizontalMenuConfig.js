import React from "react";
import * as icon from "react-feather";
import { logoutWithJWT } from "../redux/actions/auth/loginActions";

const horizontalMenuConfig = [
  {
    id: "analyticsDash",
    title: "Home",
    type: "item",
    // icon: <// icon.Home size={16} />,
    navLink: "/analyticsDashboard",
    permissions: ["admin", "editor"],
  },

  {
    id: "scheduledrop",
    title: "Schedule",
    type: "dropdown",
    // icon: <// icon.Home size={16} />,
    children: [
      {
        id: "calendar",
        title: "Calendar",
        type: "item",
        // icon: <// icon.Circle size={10} />,
        navLink: "/calendar",
        permissions: ["admin"],
      },
      {
        id: "Schedule Setting",
        title: "Schedule Setting",
        type: "item",
        // icon: <// icon.Calendar size={16} />,

        navLink: "/pages/modifyschedule",
        permissions: ["admin", "editor"],
      },
    ],
  },
  // {
  //   id: "calendar",
  //   title: "Schecule",
  //   type: "item",
  //   // icon: <// icon.Calendar size={16} />,
  //   navLink: "/calendar",
  //   permissions: ["admin", "editor"],
  // },
  // {
  //   id: "dashboard",
  //   title: "Home",
  //   type: "dropdown",
  //   // icon: <// icon.Home size={16} />,
  //   children: [

  //     {
  //       id: "eCommerceDash",
  //       title: "eCommerce",
  //       type: "item",
  //       // icon: <// icon.Circle size={10} />,
  //       navLink: "/ecommerce-dashboard",
  //       permissions: ["admin"]
  //     }
  //   ]
  // },
  // {
  //   id: "apps",
  //   title: "Apps",
  //   type: "dropdown",
  //   // icon: <// icon.Grid size={16} />,
  //   children: [
  //     {
  //       id: "email",
  //       title: "Email",
  //       type: "item",
  //       // icon: <// icon.Mail size={16} />,
  //       navLink: "/email/:filter",
  //       filterBase: "/email/inbox",
  //       permissions: ["admin", "editor"],
  //     },
  //     {
  //       id: "chat",
  //       title: "Chat",
  //       type: "item",
  //       // icon: <// icon.MessageSquare size={16} />,
  //       navLink: "/chat",
  //       permissions: ["admin", "editor"],
  //     },
  //     {
  //       id: "todo",
  //       title: "Todo",
  //       type: "item",
  //       // icon: <// icon.CheckSquare size={16} />,
  //       navLink: "/todo/:filter",
  //       filterBase: "/todo/all",
  //       permissions: ["admin", "editor"],
  //     },

  //     {
  //       id: "eCommerce",
  //       title: "Ecommerce",
  //       type: "dropdown",
  //       // icon: <// icon.ShoppingCart size={16} />,
  //       children: [
  //         {
  //           id: "shop",
  //           title: "Shop",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ecommerce/shop",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "detail",
  //           title: "Product Detail",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ecommerce/product-detail",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "wishList",
  //           title: "Wish List",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ecommerce/wishlist",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "checkout",
  //           title: "Checkout",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ecommerce/checkout",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //     {
  //       id: "usersApp",
  //       title: "User",
  //       type: "dropdown",
  //       // icon: <// icon.User size={16} />,
  //       children: [
  //         {
  //           id: "userList",
  //           title: "List",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/app/user/list",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "userView",
  //           title: "View",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/app/user/view",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "userEdit",
  //           title: "Edit",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/app/user/edit",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    id: "PatientList",
    title: "Patient List",
    // // icon: <// icon.List size={16} />,
    type: "item",
    permissions: ["admin", "editor"],
    navLink: "/patients-list",
  },
  // {
  //   id: "Call Setting",
  //   title: "Call Setting",
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/callsetting"
  // },
  // {
  //   id: "uiElements",
  //   title: "UI Elements",
  //   type: "dropdown",
  //   // icon: <// icon.Layers size={16} />,
  //   children: [
  //     {
  //       id: "dataView",
  //       title: "Data List",
  //       type: "dropdown",
  //       // icon: <// icon.List size={16} />,
  //       children: [
  //         {
  //           id: "listView",
  //           title: "List View",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           permissions: ["admin", "editor"],
  //           navLink: "/data-list/list-view",
  //         },
  //         {
  //           id: "thumbView",
  //           title: "Thumb View",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           permissions: ["admin", "editor"],
  //           navLink: "/data-list/thumb-view",
  //         },
  //       ],
  //     },
  //     {
  //       id: "content",
  //       title: "Content",
  //       type: "dropdown",
  //       // icon: <// icon.Layout size={16} />,
  //       children: [
  //         {
  //           id: "gird",
  //           title: "Grid",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ui-element/grid",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "typography",
  //           title: "Typography",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ui-element/typography",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "textUitlities",
  //           title: "Text Utilities",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ui-element/textutilities",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "syntaxHighlighter",
  //           title: "Syntax Highlighter",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/ui-element/syntaxhighlighter",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //     {
  //       id: "colors",
  //       title: "Colors",
  //       type: "item",
  //       // icon: <// icon.Droplet size={16} />,
  //       navLink: "/colors/colors",
  //       permissions: ["admin", "editor"],
  //     },
  //     {
  //       id: "// icons",
  //       title: "// icons",
  //       type: "item",
  //       // icon: <// icon.Eye size={16} />,
  //       navLink: "/// icons/reactfeather",
  //       permissions: ["admin", "editor"],
  //     },
  //     {
  //       id: "cards",
  //       title: "Cards",
  //       type: "dropdown",
  //       // icon: <// icon.CreditCard size={16} />,
  //       children: [
  //         {
  //           id: "basic",
  //           title: "Basic",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/cards/basic",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "statistics",
  //           title: "Statistics",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/cards/statistics",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "analytics",
  //           title: "Analytics",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/cards/analytics",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "cardActions",
  //           title: "Card Actions",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/cards/action",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //     {
  //       id: "components",
  //       title: "Components",
  //       type: "dropdown",
  //       // icon: <// icon.Briefcase size={16} />,
  //       children: [
  //         {
  //           id: "alerts",
  //           title: "Alerts",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/alerts",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "buttons",
  //           title: "Buttons",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/buttons",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "breadCrumbs",
  //           title: "Breadcrumbs",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/breadcrumbs",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "carousel",
  //           title: "Carousel",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/carousel",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "dropDowns",
  //           title: "Dropdowns",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/dropdowns",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "listGroup",
  //           title: "List Group",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/list-group",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "modals",
  //           title: "Modals",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/modals",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "pagination",
  //           title: "Pagination",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/pagination",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "navsComponent",
  //           title: "Navs Component",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/nav-component",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "navbar",
  //           title: "Navbar",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/navbar",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "tabsComponent",
  //           title: "Tabs Component",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/tabs-component",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "pillsComponent",
  //           title: "Pills Component",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/pills-component",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "tooltips",
  //           title: "Tooltips",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/tooltips",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "popovers",
  //           title: "Popovers",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/popovers",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "badges",
  //           title: "Badges",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/badges",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "pillBadges",
  //           title: "Pill Badges",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/pill-badges",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "progress",
  //           title: "Progress",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/progress",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "mediaObjects",
  //           title: "Media Objects",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/media-objects",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "spinners",
  //           title: "Spinners",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/spinners",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "toasts",
  //           title: "Toasts",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/components/toasts",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //     {
  //       id: "extraComponents",
  //       title: "Extra Components",
  //       type: "dropdown",
  //       // icon: <// icon.Box size={16} />,
  //       children: [
  //         {
  //           id: "autoComplete",
  //           title: "Auto Complete",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/extra-components/auto-complete",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "avatar",
  //           title: "Avatar",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/extra-components/avatar",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "chips",
  //           title: "Chips",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/extra-components/chips",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "divider",
  //           title: "Divider",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/extra-components/divider",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //     {
  //       id: "extensions",
  //       title: "Extensions",
  //       type: "dropdown",
  //       // icon: <// icon.PlusCircle size={16} />,
  //       children: [
  //         {
  //           id: "sweetAlertExt",
  //           title: "Sweet Alerts",
  //           // icon: <// icon.AlertCircle size={16} />,
  //           type: "item",
  //           navLink: "/extensions/sweet-alert",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "toastrExt",
  //           title: "Toastr",
  //           // icon: <// icon.Zap size={16} />,
  //           type: "item",
  //           navLink: "/extensions/toastr",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "rcSlider",
  //           title: "Rc Slider",
  //           // icon: <// icon.Sliders size={16} />,
  //           type: "item",
  //           navLink: "/extensions/slider",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "fileUploader",
  //           title: "File Uploader",
  //           // icon: <// icon.UploadCloud size={16} />,
  //           type: "item",
  //           navLink: "/extensions/file-uploader",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "wysiwygEditor",
  //           title: "Wysiwyg Editor",
  //           // icon: <// icon.Edit size={16} />,
  //           type: "item",
  //           navLink: "/extensions/wysiwyg-editor",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "drag_&_drop",
  //           title: "Drag & Drop",
  //           // icon: <// icon.Droplet size={16} />,
  //           type: "item",
  //           navLink: "/extensions/drag-and-drop",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "tour",
  //           title: "Tour",
  //           // icon: <// icon.Info size={16} />,
  //           type: "item",
  //           navLink: "/extensions/tour",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "clipBoard",
  //           title: "Clipboard",
  //           // icon: <// icon.Copy size={16} />,
  //           type: "item",
  //           navLink: "/extensions/clipboard",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "contextMenu",
  //           title: "Context Menu",
  //           // icon: <// icon.Menu size={16} />,
  //           type: "item",
  //           navLink: "/extensions/context-menu",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "swiper",
  //           title: "Swiper",
  //           // icon: <// icon.Smartphone size={16} />,
  //           type: "item",
  //           navLink: "/extensions/swiper",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "access-control",
  //           title: "Access Control",
  //           // icon: <// icon.Lock size={20} />,
  //           type: "item",
  //           navLink: "/extensions/access-control",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "i18n",
  //           title: "I18n",
  //           // icon: <// icon.Globe size={16} />,
  //           type: "item",
  //           navLink: "/extensions/i18n",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "treeView",
  //           title: "Tree",
  //           // icon: <// icon.GitPullRequest size={16} />,
  //           type: "item",
  //           navLink: "/extensions/tree",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "extPagination",
  //           title: "Pagination",
  //           // icon: <// icon.MoreHorizontal size={16} />,
  //           type: "item",
  //           navLink: "/extensions/pagination",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "extImport",
  //           title: "Import",
  //           // icon: <// icon.DownloadCloud size={16} />,
  //           type: "item",
  //           navLink: "/extensions/import",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "extExport",
  //           title: "Export",
  //           // icon: <// icon.UploadCloud size={16} />,
  //           type: "item",
  //           navLink: "/extensions/export",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "extExportSelected",
  //           title: "Export Selected",
  //           // icon: <// icon.CheckSquare size={16} />,
  //           type: "item",
  //           navLink: "/extensions/export-selected",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "forms-tables",
  //   title: "Forms & Tables",
  //   type: "dropdown",
  //   // icon: <// icon.Edit3 size={16} />,
  //   children: [
  //     {
  //       id: "formElements",
  //       title: "Form Elements",
  //       type: "dropdown",
  //       // icon: <// icon.Copy size={16} />,
  //       children: [
  //         {
  //           id: "select",
  //           title: "Select",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/select",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "switch",
  //           title: "Switch",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/switch",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "checkbox",
  //           title: "Checkbox",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/checkbox",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "radio",
  //           title: "Radio",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/radio",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "input",
  //           title: "Input",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/input",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "inputGroup",
  //           title: "Input Group",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/input-group",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "numberInput",
  //           title: "Number Input",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/number-input",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "textarea",
  //           title: "Textarea",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/textarea",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "date_&_timePicker",
  //           title: "Date & Time Picker",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/pickers",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "inputMask",
  //           title: "Input Mask",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/forms/elements/input-mask",
  //           permissions: ["admin", "editor"]
  //         }
  //       ]
  //     },
  //     {
  //       id: "formLayouts",
  //       title: "Form Layouts",
  //       type: "item",
  //       // icon: <// icon.Box size={16} />,
  //       navLink: "/forms/layout/form-layout",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "wizard",
  //       title: "Form Wizard",
  //       type: "item",
  //       // icon: <// icon.MoreHorizontal size={16} />,
  //       navLink: "/forms/wizard",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "formik",
  //       title: "Formik",
  //       type: "item",
  //       // icon: <// icon.CheckCircle size={16} />,
  //       navLink: "/forms/formik",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "tables",
  //       title: "Tables",
  //       type: "dropdown",
  //       // icon: <// icon.Server size={16} />,
  //       children: [
  //         {
  //           id: "tablesReactstrap",
  //           title: "Reactstrap Tables",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/tables/reactstrap",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "reactTables",
  //           title: "React Tables",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/tables/react-tables",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "aggrid",
  //           title: "agGrid Table",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/tables/agGrid",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "dataTable",
  //           title: "DataTables",
  //           type: "item",
  //           // icon: <// icon.Circle size={12} />,
  //           permissions: ["admin", "editor"],
  //           navLink: "/tables/data-tables"
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: "pages",
  //   title: "Pages",
  //   type: "dropdown",
  //   // icon: <// icon.File size={16} />,
  //   children: [
  //     {
  //       id: "profile",
  //       title: "Profile",
  //       type: "item",
  //       // icon: <// icon.User size={16} />,
  //       navLink: "/pages/profile",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "accountSettings",
  //       title: "Account Settings",
  //       type: "item",
  //       // icon: <// icon.Settings size={16} />,
  //       navLink: "/pages/account-settings",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "faq",
  //       title: "FAQ",
  //       type: "item",
  //       // icon: <// icon.HelpCircle size={16} />,
  //       navLink: "/pages/faq",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "knowledgeBase",
  //       title: "Knowledge Base",
  //       type: "item",
  //       // icon: <// icon.Info size={16} />,
  //       navLink: "/pages/knowledge-base",
  //       permissions: ["admin", "editor"],
  //       parentOf: [
  //         "/pages/knowledge-base/category/questions",
  //         "/pages/knowledge-base/category"
  //       ]
  //     },
  //     {
  //       id: "search",
  //       title: "Search",
  //       type: "item",
  //       // icon: <// icon.Search size={16} />,
  //       navLink: "/pages/search",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "invoice",
  //       title: "Invoice",
  //       type: "item",
  //       // icon: <// icon.File size={16} />,
  //       navLink: "/pages/invoice",
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "authentication",
  //       title: "Authentication",
  //       type: "dropdown",
  //       // icon: <// icon.Unlock size={16} />,
  //       children: [
  //         {
  //           id: "login",
  //           title: "Login",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/pages/login",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "register",
  //           title: "Register",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/pages/register",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "forgotPassword",
  //           title: "Forgot Password",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/pages/forgot-password",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "resetPassword",
  //           title: "Reset Password",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/pages/reset-password",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "lockScreen",
  //           title: "Lock Screen",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/pages/lock-screen",
  //           permissions: ["admin", "editor"]
  //         }
  //       ]
  //     },
  //     {
  //       id: "miscellaneous",
  //       title: "Miscellaneous",
  //       type: "dropdown",
  //       // icon: <// icon.FileText size={16} />,
  //       children: [
  //         {
  //           id: "comingSoon",
  //           title: "Coming Soon",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/misc/coming-soon",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "error",
  //           title: "Error",
  //           type: "dropdown",
  //           // icon: <// icon.Circle size={10} />,
  //           children: [
  //             {
  //               id: "404",
  //               title: "404",
  //               type: "item",
  //               // icon: <// icon.Circle size={10} />,
  //               navLink: "/misc/error/404",
  //               permissions: ["admin", "editor"]
  //             },
  //             {
  //               id: "500",
  //               title: "500",
  //               type: "item",
  //               // icon: <// icon.Circle size={10} />,
  //               navLink: "/misc/error/500",
  //               permissions: ["admin", "editor"]
  //             }
  //           ]
  //         },
  //         {
  //           id: "notAuthorized",
  //           title: "Not Authorized",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/misc/not-authorized",
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "maintenance",
  //           title: "Maintenance",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/misc/maintenance",
  //           permissions: ["admin", "editor"]
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    id: "mypage",
    title: "Setting",
    type: "dropdown",
    // icon: <// icon.Settings size={16} />,
    children: [
      {
        id: "userdata",
        title: "개인정보",
        type: "item",
        // icon: <// icon.User size={16} />,
        navLink: "/pages/myinfo",
        permissions: ["admin", "editor"],
      },
      {
        id: "hospitaldata",
        title: "병원정보",
        type: "item",
        // icon: <// icon.Trello size={16} />,
        navLink: "/pages/hospitalinfo",
        permissions: ["admin", "editor"],
      },
      // {
      //   id: "shcedulesetting",
      //   title: "스케쥴 설정",
      //   type: "item",
      //   // icon: <// icon.Calendar size={16} />,

      //   navLink: "/pages/modifyschedule",
      //   permissions: ["admin", "editor"],
      // },
      {
        id: "paymentsetting",
        title: "결제관리",
        type: "item",
        // icon: <// icon.DollarSign size={16} />,
        navLink: "/pages/paymentmanagement",
        permissions: ["admin", "editor"],
      },
      {
        id: "termsofservice",
        title: "이용약관",
        type: "item",
        // icon: <// icon.Info size={16} />,
        navLink: "/pages/terms",
        permissions: ["admin", "editor"],
      },
      {
        id: "changepassword",
        title: "비밀번호 변경",
        type: "item",
        // icon: <icon.Hash size={10} />,
        navLink: "/pages/changepassword",
        permissions: ["admin", "editor"],
      },
      {
        id: "servicecenter",
        title: "고객센터",
        type: "item",
        // icon: <// icon.Users size={16} />,
        // navLink: "/schedule",
        permissions: ["admin", "editor"],
        children: [
          {
            id: "notice",
            title: "공지사항",
            type: "item",
            // icon: <// icon.Circle size={10} />,
            navLink: "/pages/notice",
            permissions: ["admin", "editor"],
          },
          {
            id: "faq",
            title: "FAQ",
            type: "item",
            // icon: <// icon.Circle size={10} />,
            navLink: "/pages/newfaq",
            permissions: ["admin", "editor"],
          },
          // {
          //   id: "1:1",
          //   title: "1:1 문의",
          //   type: "item",
          //   // icon: <// icon.Circle size={10} />,
          //   navLink: "/pages/question",
          //   permissions: ["admin", "editor"],
          // },
        ],
      },
      // {
      //   id: "loginsetting",
      //   title: "로그인 설정",
      //   type: "item",
      //   // icon: <// icon.Tool size={16} />,
      //   permissions: ["admin", "editor"],
      //   children: [
      //     {
      //       id: "logout",
      //       title: "로그아웃",
      //       type: "item",
      //       // icon: <// icon.Circle size={10} />,
      //       navLink: "/pages/loginsetting",
      //       permissions: ["admin", "editor"]
      //     },
      //     {
      //       id: "changepassword",
      //       title: "비밀번호 변경",
      //       type: "item",
      //       // icon: <// icon.Circle size={10} />,
      //       navLink: "/pages/changepassword",
      //       permissions: ["admin", "editor"]
      //     },
      //     {
      //       id: "withdrawal",
      //       title: "회원탈퇴",
      //       type: "item",
      //       // icon: <// icon.Circle size={10} />,
      //       navLink: "/pages/withdrawal",
      //       permissions: ["admin", "editor"]
      //     }
      //   ]
      // }
    ],
  },
  // {
  //   id: "charts-maps",
  //   title: "Charts & Maps",
  //   type: "dropdown",
  //   // icon: <// icon.BarChart2 size={16} />,
  //   children: [
  //     {
  //       id: "charts",
  //       title: "Charts",
  //       type: "dropdown",
  //       badge: "success",
  //       badgeText: "3",
  //       // icon: <// icon.PieChart size={16} />,
  //       children: [
  //         {
  //           id: "apex",
  //           title: "Apex",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/charts/apex",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "chartJs",
  //           title: "ChartJS",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/charts/chartjs",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "recharts",
  //           title: "Recharts",
  //           type: "item",
  //           // icon: <// icon.Circle size={10} />,
  //           navLink: "/charts/recharts",
  //           permissions: ["admin", "editor"],
  //         },
  //       ],
  //     },
  //     {
  //       id: "leafletMaps",
  //       title: "Leaflet Maps",
  //       // icon: <// icon.Map size={16} />,
  //       type: "item",
  //       navLink: "/maps/leaflet",
  //       permissions: ["admin", "editor"],
  //     },
  //   ],
  // },
  // {
  //   id: "others",
  //   title: "Others",
  //   type: "dropdown",
  //   // icon: <// icon.MoreHorizontal size={16} />,
  //   children: [
  //     {
  //       id: "menuLevels",
  //       title: "Menu Levels",
  //       // icon: <// icon.Menu size={16} />,
  //       type: "dropdown",
  //       children: [
  //         {
  //           id: "secondLevel",
  //           title: "Second Level",
  //           // icon: <// icon.Circle size={10} />,
  //           type: "item",
  //           navlink: "",
  //           permissions: ["admin", "editor"],
  //         },
  //         {
  //           id: "secondLevel1",
  //           title: "Second Level",
  //           // icon: <// icon.Circle size={10} />,
  //           type: "dropdown",
  //           children: [
  //             {
  //               id: "ThirdLevel",
  //               title: "Third Level",
  //               // icon: <// icon.Circle size={10} />,
  //               type: "item",
  //               navLink: "",
  //               permissions: ["admin", "editor"],
  //             },
  //             {
  //               id: "ThirdLevel1",
  //               title: "Third Level",
  //               // icon: <// icon.Circle size={10} />,
  //               type: "item",
  //               navLink: "",
  //               permissions: ["admin", "editor"],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       id: "disabledMenu",
  //       title: "Disabled Menu",
  //       // icon: <// icon.EyeOff size={16} />,
  //       type: "item",
  //       navLink: "#",
  //       permissions: ["admin", "editor"],
  //       disabled: true,
  //     },
  //     {
  //       id: "documentation",
  //       title: "Documentation",
  //       // icon: <// icon.Folder size={16} />,
  //       type: "external-link",
  //       navLink: "google.com",
  //       permissions: ["admin", "editor"],
  //     },
  //     {
  //       id: "raiseSupport",
  //       title: "Raise Support",
  //       // icon: <// icon.LifeBuoy size={16} />,
  //       type: "external-link",
  //       newTab: true,
  //       navLink: "https://pixinvent.ticksy.com/",
  //       permissions: ["admin", "editor"],
  //     },
  //   ],
  // },
];

export default horizontalMenuConfig;
