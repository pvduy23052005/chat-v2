import { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { Room } from "../../types";

interface RoomHeaderProps {
  room: Room | null;
  isSuperAdmin: boolean;
  deleteRoomFunc: (roomID: string, roomTitle: string) => Promise<void>;
  editRoomFunc: (
    roomID: string,
    title: string,
    setRoom?: React.Dispatch<React.SetStateAction<Room | null>>,
  ) => Promise<boolean>;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}

function RoomHeader({
  room,
  isSuperAdmin,
  deleteRoomFunc,
  editRoomFunc,
  setRoom,
}: RoomHeaderProps) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSet = () => {
      if (room?.title) {
        setTitle(room.title);
      }
    };
    handleSet();
  }, [room]);

  if (!room) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Tên phòng không được để trống!");
      return;
    }

    setIsSaving(true);
    await editRoomFunc(room.id, title, setRoom);
    setIsSaving(false);
  };

  const isChanged = title !== room.title;

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3">
          {/* Avatar */}
          <div className="position-relative">
            <img
              src={room.avatar || "/images/default-avatar.webp"}
              alt="Avatar"
              className="rounded-circle border"
              style={{ width: "65px", height: "65px", objectFit: "cover" }}
            />
          </div>

          {/* Form Input */}
          <div className="flex-grow-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                className="form-control fw-bold border-0 px-0 fs-5 "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isSuperAdmin}
                placeholder="Tên cuộc trò chuyện"
                style={{ backgroundColor: "transparent" }}
              />
              <small className="text-muted d-flex align-items-center">
                <i className="fa-solid fa-users me-2"></i>
                {room.members?.length || 0} thành viên
              </small>
            </form>
          </div>

          {/* Các nút thao tác (Chỉ Admin) */}
          {isSuperAdmin && (
            <div className="d-flex gap-2">
              {isChanged && (
                <button
                  className="btn btn-outline-primary"
                  title="Lưu thay đổi"
                  onClick={handleSubmit}
                >
                  {isSaving ? (
                    <span> Đang lưu ... </span>
                  ) : (
                    <>
                      <FaRegSave />
                    </>
                  )}
                </button>
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/room/add-member/${room.id}`)}
              >
                <FaUserPlus />
              </button>

              <button
                className="btn btn-outline-danger "
                onClick={() => deleteRoomFunc(room.id, room.title)}
                title="Giải tán nhóm"
              >
                <RiDeleteBin2Line />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomHeader;
