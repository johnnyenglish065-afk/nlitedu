import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 33,
    title: "Team",
    path: "/team",
    newTab: false,
  },
  {
    id: 4,
    title: "Services",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "Certification",
        path: "/certification",
        newTab: false,
      },
      {
        id: 42,
        title: "Internship",
        path: "/internship",
        newTab: false,
      },
    ],
  },
  // {
  //   id: 5,
  //   title: "Contact Us",
  //   path: "/contact",
  //   newTab: false,
  // },
];
export default menuData;
