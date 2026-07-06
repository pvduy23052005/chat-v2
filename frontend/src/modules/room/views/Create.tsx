"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { roomServiceAPI } from "@core/api/roomServiceAPI";
import "../styles/create.css";
import { toast } from "react-toastify";
import { friendServiceAPI } from "@core/api/friendServiceAPI";
import { UserProfile } from "@core/types";

function Create() {
  const router = useRouter();
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [titleRoom, setTitleRoom] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleGetFriends = async () => {
      try {
        const res = await friendServiceAPI.getFriends();
        setFriends(res.friends || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách bạn bè:", error);
      }
    };
    handleGetFriends();
  }, []);

  const handleCheckboxChange = (userId: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titleRoom.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thành viên!");
      return;
    }

    try {
      setLoading(true);

      const dataPayload = {
        titleRoom: titleRoom,
        members: selectedMembers,
      };

      const res = await roomServiceAPI.create(dataPayload);
      if (res.success) {
        toast.success("Tạo phòng thành công!");
        router.push("/chat");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo phòng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-container">
      <div className="create-card">
        <h2 className="page-title">Tạo phòng chat nhóm</h2>

        <form onSubmit={handleSubmit}>
          {/* Ô nhập tên phòng */}
          <div className="form-group">
            <label className="label">Tên phòng nhóm</label>
            <input
              type="text"
              className="input-text"
              placeholder="Ví dụ: Team Dev, Gia đình..."
              value={titleRoom}
              onChange={(e) => setTitleRoom(e.target.value)}
            />
          </div>

          {/* Danh sách bạn bè */}
          <div className="form-group">
            <label className="label">
              Chọn thành viên ({selectedMembers.length})
            </label>

            <div className="friends-grid">
              {friends && friends.length > 0 ? (
                friends.map((friend) => {
                  const friendID = friend.id || friend._id;
                  if (!friendID) return null;
                  const isChecked = selectedMembers.includes(friendID);

                  return (
                    <label
                      key={friendID}
                      className={`friend-item ${isChecked ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden-checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(friendID)}
                      />

                      <div className="friend-avatar">
                        <img
                          src={friend.avatar || "/images/default-avatar.webp"}
                          alt={friend.fullName}
                        />
                      </div>

                      <div className="friend-info">
                        <div className="friend-name">{friend.fullName}</div>
                      </div>

                      {/* Icon check hiện lên khi chọn */}
                      <div className="check-icon">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                    </label>
                  );
                })
              ) : (
                <p className="no-friends">Bạn chưa có bạn bè nào để thêm.</p>
              )}
            </div>
          </div>

          {/* Nút Submit */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo nhóm ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create;
