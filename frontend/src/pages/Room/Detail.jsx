import { useParams } from "react-router-dom";
import { useAuth } from "../../hook/auth/useAuth";
import { FaDeleteLeft, FaCrown } from "react-icons/fa6";
import { useRoomAction } from "../../hook/room/useRoomAction";
import { useRoomDetail } from "../../hook/room/useRoomDetail";
import RoomHeader from "../../components/room/RoomHeader";

function Detail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { deleteRoom, removeMember, leaveRoom, assignAdmin, editRoom } =
    useRoomAction();
  const { room, setRoom, loading, error } = useRoomDetail(id);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!room) return <div>Không tìm thấy phòng</div>;

  const onRemoveMember = (memberID, fullName) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa ${fullName}? `);
    if (!isConfirm) return;

    removeMember(id, memberID, fullName, setRoom);
  };

  const onAssignAdmin = async (memberID, fullName) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn chuyển quyền Trưởng nhóm cho ${fullName}? Bạn sẽ trở thành thành viên thường.`,
    );
    if (!isConfirmed) return;

    assignAdmin(id, memberID, fullName, setRoom);
  };

  const myID = user?.id || user?._id;
  const isSuperAdmin = room?.members?.some(
    (m) => m.id === myID && m.role === "superAdmin",
  );
  const isGroup = room.typeRoom === "group";

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <RoomHeader
            room={room}
            isSuperAdmin={isSuperAdmin}
            deleteRoomFunc={deleteRoom}
            editRoomFunc={editRoom}
            setRoom={setRoom}
          />

          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-bold text-primary">
                Danh sách thành viên
              </h6>
              {isGroup && !isSuperAdmin && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    leaveRoom(room.id, user.fullName);
                  }}
                >
                  Rời nhóm
                </button>
              )}
            </div>

            <div className="list-group list-group-flush">
              {room.members.map((member) => {
                const memberID = member.id;
                const isMe = memberID === myID;
                return (
                  <div
                    className="list-group-item d-flex align-items-center gap-3 py-3"
                    key={memberID}
                  >
                    <img
                      src={member.avatar || "/images/default-avatar.webp"}
                      alt={member.fullName}
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-medium">{member.fullName}</span>
                        {isMe && (
                          <span
                            className="badge bg-secondary"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Bạn
                          </span>
                        )}
                        {member.role === "superAdmin" && (
                          <span
                            className="badge bg-warning text-dark"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Trưởng nhóm
                          </span>
                        )}
                      </div>
                    </div>

                    {isSuperAdmin && !isMe && (
                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => {
                          onRemoveMember(memberID, member.fullName);
                        }}
                      >
                        <FaDeleteLeft />
                      </button>
                    )}
                    {isSuperAdmin && !isMe && (
                      <button
                        className="btn btn-sm btn-light text-warning ml-2"
                        title="Chuyển quyền trưởng nhóm"
                        onClick={() => {
                          onAssignAdmin(memberID, member.fullName);
                        }}
                      >
                        <FaCrown />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
