import { IRoomMember, IRoom } from "./type";
import { RoomMemberVO } from "./value-object/roomMember";

export class RoomEntity {
  private id: string;
  private title: string;
  private typeRoom: "single" | "group";
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;
  private members: RoomMemberVO[];
  private lastMessageId: string;

  private constructor(data: IRoom) {
    this.id = data.id || "";
    this.title = data.title;
    this.typeRoom = data.typeRoom;
    this.avatar = data.avatar || "/images/default-avatar.webp";
    this.status = data.status || "active";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.members = data.members;
    this.lastMessageId = data.lastMessageId || "";
  }

  public static createGroupRoom(creatorId: string, memberIds: string[], title?: string, avatar?: string) {
    if (!title || title.trim() === "") throw new Error("Phòng nhóm bắt buộc phải có tên");

    const members: RoomMemberVO[] = [
      RoomMemberVO.createSuperAdmin(creatorId),
      ...memberIds.map(id => RoomMemberVO.createMember(id))
    ]

    return new RoomEntity({
      title: title || "",
      typeRoom: "group",
      members,
      avatar: avatar || "/images/default-avatar.webp"
    });
  }

  public static createSingleRoom(creatorId: string, memberId: string) {
    if (!memberId || memberId.trim() === "") {
      throw new Error("Phòng chat 1-1 bắt buộc phải có người được mời");
    }

    const members: RoomMemberVO[] = [
      RoomMemberVO.createMember(creatorId),
      RoomMemberVO.createWaitingMember(memberId)
    ]

    return new RoomEntity({
      title: "",
      typeRoom: "single",
      members,
      avatar: "/images/default-avatar.webp"
    });
  }

  public static createFriendRoom(userAId: string, userBId: string) {
    const members: IRoomMember[] = [
      { user_id: userAId, role: "member", status: "accepted" },
      { user_id: userBId, role: "member", status: "accepted" }
    ];

    return new RoomEntity({
      title: "",
      typeRoom: "single",
      members,
      avatar: "/images/default-avatar.webp"
    });
  }

  public acceptAllMembers(): void {
    this.members = this.members.map(member => ({
      ...member,
      status: "accepted"
    }));
  }

  public addMember(newMemberId: string, requesterId: string): void {
    if (this.typeRoom === "single") {
      throw new Error("Không thể thêm thành viên vào phòng chat cá nhân");
    }

    this.ensureAdmin(requesterId);

    const isExist = this.getMember(newMemberId);
    if (isExist) {
      throw new Error("Người dùng đã là thành viên của phòng");
    }

    const newMember = RoomMemberVO.createMember(newMemberId);
    this.members.push(newMember);
    this.updatedAt = new Date();
  }

  public removeMember(removeMemberID: string, requesterID: string): void {

    this.ensureAdmin(requesterID);

    if (removeMemberID === requesterID) {
      throw new Error("Không thể xóa chính mình khỏi nhóm");
    }

    const isExist = this.getMember(removeMemberID);
    if (!isExist) {
      throw new Error("Người dùng không phải là thành viên của phòng");
    }

    const requester = this.getMember(requesterID);
    if (requester?.role === "admin" && isExist.role !== "member") {
      throw new Error("Quản trị viên chỉ có quyền xóa thành viên bình thường");
    }

    this.members = this.members.filter(m => m.user_id.toString() !== removeMemberID);
    this.updatedAt = new Date();
  }

  public leaveRoom(userId: string): void {
    const memberIndex = this.getMember(userId);

    if (!memberIndex) {
      throw new Error("Bạn không phải là thành viên của phòng này");
    }

    if (memberIndex.role === "superAdmin") {
      throw new Error("Không thể rời khỏi phòng khi là trưởng nhóm");
    }

    this.members = this.members.filter(m => m.user_id.toString() !== userId);
    this.updatedAt = new Date();
  }

  public assignAdmin(targetUserId: string, requesterId: string): void {
    if (!targetUserId) {
      throw new Error("Vui lòng chọn thành viên để chỉ định làm quản trị viên");
    }

    if (targetUserId === requesterId) {
      throw new Error("Bạn không thể tự thao tác lên chính mình");
    }

    this.ensureSuperAdmin(requesterId);

    const targetIndex = this.members.findIndex(m => m.user_id === targetUserId);
    if (targetIndex === -1) {
      throw new Error("Người dùng này không có mặt trong phòng");
    }

    const currentMember = this.members[targetIndex];
    if (!currentMember) {
      throw new Error("Không tìm thấy thành viên")
    }

    if (currentMember.role === "admin" || currentMember.role === "superAdmin") {
      throw new Error("Người dùng này đã là quản trị viên rồi");
    }

    this.members[targetIndex] = RoomMemberVO.promoteAdmin(currentMember);
    this.updatedAt = new Date();
  }

  public changeTitle(newTitle: string, requesterId: string): void {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      throw new Error("Tên phòng không được để trống!");
    }

    if (trimmedTitle.length > 50) {
      throw new Error("Tên phòng không được vượt quá 50 ký tự");
    }

    if (this.typeRoom === "single") {
      throw new Error("Không thể đổi tên phòng chat cá nhân");
    }

    this.ensureSuperAdmin(requesterId);

    this.title = trimmedTitle;
    this.updatedAt = new Date();
  }

  public checkIsMember(userId: string): void {
    const isMember = this.members.some(m => m.user_id.toString() === userId);

    if (!isMember) {
      throw new Error("Bạn không có quyền truy cập phòng này!");
    }
  }

  public isOwner(userId: string): boolean {
    const owner = this.members.find(m => m.user_id.toString() === userId);
    return owner?.role === "superAdmin";
  }

  public static restore(data: IRoom): RoomEntity {
    return new RoomEntity(data);
  }

  private getMember(userId: string): RoomMemberVO | undefined {
    return this.members.find(m => m.user_id.toString() === userId.toString());
  }

  private ensureAdmin(requesterId: string): void {
    const requester = this.getMember(requesterId);
    if (!requester) {
      throw new Error("Người thao tác không nằm trong phòng chat này");
    }

    if (requester.role !== "admin" && requester.role !== "superAdmin") {
      throw new Error("Chỉ Admin hoặc Super Admin mới có quyền thực hiện thao tác này");
    }
  }

  private ensureSuperAdmin(requesterId: string): void {
    const requester = this.getMember(requesterId);
    if (!requester || requester.role !== "superAdmin") {
      throw new Error("Chỉ duy nhất Super Admin (Chủ phòng) mới có quyền này");
    }
  }

  public toObject() {
    return {
      id: this.id,
      title: this.title,
      typeRoom: this.typeRoom,
      avatar: this.avatar,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      members: this.members.map(member => ({
        user_id: member.user_id,
        role: member.role,
        status: member.status
      }))
    };
  }

  public getId(): string { return this.id; }
  public getTitle(): string { return this.title; }
  public getTypeRoom(): string { return this.typeRoom; }
  public getStatus(): string { return this.status; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getMembers(): any[] { return this.members; }
  public getLastMessageId(): string { return this.lastMessageId; }
}
