import { useState, useEffect, useRef, useContext } from "react";
import { FaTimes, FaCamera, FaSave } from "react-icons/fa";
import "../../styles/pages/user/userInfo.css";
import { uploadFile } from "../../utils/uploadFile.utils";
import { userServiceAPI } from "../../services/userServiceAPI";
import { toast } from "react-toastify";
import { authStore } from "../../stores/authStore";
import { AppContext } from "../../context/AppContext";
import { UserProfile } from "../../types";

interface UserInfoProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserInfo = ({ user, isOpen, onClose }: UserInfoProps) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useContext(AppContext);

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPreviewAvatar(null);
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  useEffect(() => {
    return () => {
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setPreviewAvatar(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSaveClick = async () => {
    if (!fullName.trim()) {
      alert("Tên không được để trống!");
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      let finalAvatarUrl = user.avatar || "";

      if (selectedFile) {
        const filesPayload = [{ original: selectedFile }];
        const uploadedUrls = await uploadFile(filesPayload);

        if (uploadedUrls && uploadedUrls.length > 0) {
          finalAvatarUrl = uploadedUrls[0] || "";
        }
      }

      const updateUserData = {
        fullName: fullName,
        avatar: finalAvatarUrl,
      };

      const data = await userServiceAPI.editProfile(updateUserData);

      if (data.success) {
        toast.success("Cập nhật thành công");
        setUser(data.user);
        authStore.set(data.user);
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="user-info-overlay" onClick={onClose}>
      <div className="user-info-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h3 className="form-title">Cập nhật hồ sơ</h3>

        <div className="user-info-avatar-wrapper">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <div
            className="user-info-avatar"
            onClick={handleTriggerFileSelect}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                previewAvatar || user?.avatar || "/images/default-avatar.webp"
              }
              alt="Avatar"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className="camera-icon"
            onClick={handleTriggerFileSelect}
            style={{ cursor: "pointer" }}
          >
            <FaCamera />
          </div>
        </div>

        <div className="form-body">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên..."
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" value={email} disabled />
          </div>

          <button
            className="btn-save"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? (
              "Đang lưu..."
            ) : (
              <>
                <FaSave className="me-2" /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
