import { MdDashboard } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";


const sidebarItems = [
  {
    title: "Dashboard",
    icon: <MdDashboard />
  },
  {
    title: "Create Users",
    icon: <FaUserAlt />,
    path:"/admin/create"

  },
  {
    title: "List of Users",
    icon: <FaList />,
    path: "/admin/list"
  },
]

export default sidebarItems;