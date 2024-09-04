import "./Sidebar.scss";
import sidebarItems from "../items/sidebar.items";
import { IoIosExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleItemClicked = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-box">
        <div className="profile-container">
          <img className="profile-image" src="bg-1.svg" />
        </div>
        <div className="profile-name">
          <h3>John Doe</h3>
          <p>Admin</p>
        </div>
        <div className="sidebar-items">
          {sidebarItems.map((item, index) => (
            <div key={index} className="sidebar-item" onClick={() => handleItemClicked(item.path)}>
              {item.icon}
              <span>{item.title}</span>
            </div>
          ))}
          <button className="logout-button">
            <IoIosExit className="logout-icon"/> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
