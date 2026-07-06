"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useRoomDetail } from "@modules/room/hooks/useRoomDetail";
import { useRoomAction } from "@modules/room/hooks/useRoomAction";
import { friendServiceAPI } from "@core/api/friendServiceAPI";
import { UserProfile } from "@core/types";

interface SelectedFriend {
  id: string;
  fullName: string;
}

function AddMember() {
  const [selectedFriends, setSelectedFriends] = useState<SelectedFriend[]>([]);
  const [userFriends, setUserFriends] = useState<UserProfile[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { room, loading: isLoadingRoom } = useRoomDetail(id || null);
  const { addMember } = useRoomAction();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoadingFriends(true);
        const res = await friendServiceAPI.getFriends();
        if (res.success) {
          setUserFriends(res.friends || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
        toast.error("Không thể tải danh sách bạn bè");
      } finally {
        setIsLoadingFriends(false);
      }
    };
    fetchFriends();
  }, []);

  const availableFriends = userFriends.filter((friend) => {
    if (!room || !room.members) return true;
    const friendID = friend.id || friend._id;
    return !room.members.some((member) => {
      const mId = typeof member.user_id === "string" ? member.user_id : member.user_id.id;
      return mId === friendID;
    });
  });

  if (isLoadingRoom || isLoadingFriends) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  const handleToggleFriend = (friend: UserProfile) => {
    const friendID = friend.id || friend._id;
    if (!friendID) return;

    setSelectedFriends((prev) => {
      const exists = prev.some((item) => item.id === friendID);

      if (exists) {
        return prev.filter((item) => item.id !== friendID);
      } else {
        return [...prev, { id: friendID, fullName: friend.fullName }];
      }
    });
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0 || !id) {
      toast.warning("Vui lòng chọn ít nhất 1 người bạn!");
      return;
    }
    try {
      setIsAdding(true);

      const listIDs = selectedFriends.map((f) => f.id);
      const listFullNames = selectedFriends.map((f) => f.fullName);

      await addMember(id, listIDs, listFullNames);

      // Success handled in useRoomAction (navigate back)
      setSelectedFriends([]);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi thêm thành viên";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const isSelected = (friendID: string) => {
    return selectedFriends.some((item) => item.id === friendID);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex align-items-center gap-2 py-3">
              <button
                className="btn btn-sm btn-light border-0 rounded-circle"
                onClick={() => router.back()}
              >
                <FaArrowLeft />
              </button>
              <h6 className="mb-0 fw-bold flex-grow-1">Thêm thành viên mới</h6>
              <span className="badge bg-light text-dark border px-2 py-1">
                Khả dụng: {availableFriends?.length || 0}
              </span>
            </div>

            <div className="card-body p-0">
              <div
                className="list-group list-group-flush"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {availableFriends.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fa-solid fa-user-group mb-2 d-block fa-2x opacity-25"></i>
                    <small>Không còn bạn bè nào để thêm.</small>
                  </div>
                ) : (
                  availableFriends.map((friend) => {
                    const friendID = friend.id || friend._id;
                    if (!friendID) return null;
                    const checked = isSelected(friendID);

                    return (
                      <label
                        key={friendID}
                        className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-start-0 border-end-0 ${
                          checked ? "bg-light border-primary" : "border-light"
                        }`}
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mt-0"
                          checked={checked}
                          onChange={() => handleToggleFriend(friend)}
                          style={{
                            width: "22px",
                            height: "22px",
                            cursor: "pointer",
                          }}
                        />

                        <img
                          src={friend.avatar || "/images/default-avatar.webp"}
                          alt={friend.fullName}
                          className="rounded-circle border"
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />

                        <div className="flex-grow-1">
                          <div className="fw-bold text-dark">
                            {friend.fullName}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {availableFriends.length > 0 && (
              <div className="card-footer bg-white p-3 d-flex gap-2 border-top">
                <button
                  className="btn btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddMembers}
                  disabled={selectedFriends.length === 0 || isAdding}
                >
                  {isAdding ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      <span>
                        {selectedFriends.length > 0
                          ? `Thêm ${selectedFriends.length} thành viên`
                          : "Thêm vào nhóm"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
