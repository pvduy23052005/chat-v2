import { useEffect, useState } from "react";
import { userServiceAPI } from "../../services/userServiceAPI";
import "../../styles/pages/user/user.css";
import { useUserAction } from "../../hook/user/useUserAction";

function AcceptFriend() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleFriendRefuse, handleFriendAccept } = useUserAction();

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        setLoading(true);
        const res = await userServiceAPI.getFriendRequest();
        setUsers(res.friendRequests || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách lời mời:", error);
      } finally {
        setLoading(false);
      }
    };
    handleGetUser();
  }, []);

  const handleAccept = (userID) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userID ? { ...u, status: "accepted" } : u)),
    );
    handleFriendAccept(userID);
  };

  const handleRefuse = (userID) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userID ? { ...u, status: "refused" } : u)),
    );
    handleFriendRefuse(userID);
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <div className="container py-3">
      <div className="container-user">
        <div className="header mb-4">
          <h3>Lời mời kết bạn</h3>
        </div>

        <div className="row">
          {users.length > 0 ? (
            users.map((user) => (
              <div className="col-12 col-md-6 col-lg-4 mb-3" key={user.id}>
                <div
                  className={`box-user ${
                    user.status === "accepted"
                      ? "accepted"
                      : user.status === "refused"
                        ? "refuse"
                        : ""
                  }`}
                >
                  <div className="inner-avatar">
                    <img
                      src={user.avatar || "/images/default-avatar.webp"}
                      alt={user.fullName}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="inner-info">
                    <div className="inner-name fw-bold">{user.fullName}</div>
                    <div className="inner-actions d-flex gap-2 mt-2">
                      {/* Nhóm nút Chấp nhận */}
                      <button
                        className="btn-action btn-accept-friend "
                        onClick={() => handleAccept(user.id)}
                      >
                        <i className="fa-solid fa-user-plus me-1"></i> Chấp nhận
                      </button>

                      <button
                        className="btn-action btn-accepted-friend "
                        disabled
                      >
                        <i className="fa-solid fa-check me-1"></i> Đã chấp nhận
                      </button>

                      {/* Nhóm nút Hủy/Từ chối */}
                      <button
                        className="btn-action btn-refuse-friend "
                        onClick={() => handleRefuse(user.id)}
                      >
                        Từ chối
                      </button>

                      <button
                        className="btn-action btn-deleted-friend "
                        disabled
                      >
                        Đã xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              Không có lời mời kết bạn nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AcceptFriend;
