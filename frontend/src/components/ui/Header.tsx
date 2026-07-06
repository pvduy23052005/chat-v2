import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { authServiceAPI } from "../../services/authServiceAPI";
import { CiCirclePlus } from "react-icons/ci";
import { IoLogOutOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { HiOutlineUserAdd } from "react-icons/hi";
import "../../styles/ui/header.css";
import UserInfo from "../common/UserInfo";

function Header() {
  const { logout, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const userId = user?.id || user?._id || "";
      const res = await authServiceAPI.logout(userId);
      if (res.success) {
        logout();
        navigate("/auth/login");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <header>
      <div className="header-inner">
        {/* Logo / Brand */}
        <div className="header-brand">
          <span className="brand-text">ChatApp</span>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <NavLink
            to="/chat"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <IoChatbubbleEllipsesOutline size={18} />
            <span>Tin nhắn</span>
          </NavLink>
          <NavLink
            to="/user"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            end
          >
            <FiUsers size={18} />
            <span>Người dùng</span>
          </NavLink>
          <NavLink
            to="/user/accept-friends"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <HiOutlineUserAdd size={18} />
            <span>Lời mời</span>
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <Link to="/room/create" className="btn-create-room">
            <CiCirclePlus size={18} />
            <span className="btn-create-text">Tạo phòng</span>
          </Link>

          <div className="header-user" onClick={() => setShowUserInfo(true)}>
            <img
              src={user?.avatar || "/images/default-avatar.webp"}
              alt="Avatar"
              className="header-user-avatar"
            />
          </div>

          <button
            className="btn-logout"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <IoLogOutOutline size={18} />
          </button>
        </div>
      </div>

      <UserInfo
        user={user}
        isOpen={showUserInfo}
        onClose={() => setShowUserInfo(false)}
      />
    </header>
  );
}

export default Header;
