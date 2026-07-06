"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { AppContext } from "@core/context/AppContext";
import { authServiceAPI } from "@core/api/authServiceAPI";
import { CiCirclePlus } from "react-icons/ci";
import { IoLogOutOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { HiOutlineUserAdd } from "react-icons/hi";
import "@core/styles/header.css";
import UserInfo from "@core/components/UserInfo";

function Header() {
  const { logout, user } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname() || "";
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const userId = user?.id || user?._id || "";
      const res = await authServiceAPI.logout(userId);
      if (res.success) {
        logout();
        router.push("/auth/login");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  const isChatActive = pathname.startsWith("/chat");
  const isUserActive = pathname === "/user";
  const isAcceptActive = pathname === "/user/accept-friends";

  return (
    <header>
      <div className="header-inner">
        {/* Logo / Brand */}
        <div className="header-brand">
          <span className="brand-text">ChatApp</span>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <Link
            href="/chat"
            className={`nav-item ${isChatActive ? "active" : ""}`}
          >
            <IoChatbubbleEllipsesOutline size={18} />
            <span>Tin nhắn</span>
          </Link>
          <Link
            href="/user"
            className={`nav-item ${isUserActive ? "active" : ""}`}
          >
            <FiUsers size={18} />
            <span>Người dùng</span>
          </Link>
          <Link
            href="/user/accept-friends"
            className={`nav-item ${isAcceptActive ? "active" : ""}`}
          >
            <HiOutlineUserAdd size={18} />
            <span>Lời mời</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <Link href="/room/create" className="btn-create-room">
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
