import { IRoomMember, IRoom } from "./type";

export class RoomEntity {
  private id: string;
  private title: string;
  private typeRoom: "single" | "group";
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;
  private members: IRoomMember[];
  private lastMessageId: string;

  private constructor(data: IRoom) {
    this.id = data.id || "";
    this.title = data.title;
    this.typeRoom = data.typeRoom;
    this.avatar = data.avatar || "/images/default-avatar.webp";
    this.status = data.status || "active";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.members = data.members || [];
    this.lastMessageId = data.lastMessageId || "";
  }

  public static createRoom(creatorId: string, memberIds: string[], typeRoom: "single" | "group", title?: string, avatar?: string) {

    let members: IRoomMember[] = [];

    if (typeRoom === "group") {
      members = [
        { user_id: creatorId, role: "superAdmin", status: "accepted" },
        ...memberIds.map((id): IRoomMember => ({ user_id: id, role: "member", status: "accepted" }))
      ];
    } else {
      members = [
        { user_id: creatorId, role: "member", status: "accepted" },
        { user_id: memberIds[0] || "", role: "member", status: "waiting" }
      ];
    }

    return new RoomEntity({
      title: title || "",
      typeRoom: typeRoom,
      members,
      avatar: avatar || "/images/default-avatar.webp"
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

  public addMember(userId: string, requesterId: string): void {
    if (this.typeRoom === "single") {
      throw new Error("Không thể thêm thành viên vào phòng chat cá nhân");
    }

    this.isAdmin(requesterId);
    this.isSuperAdmin(requesterId);

    const isExist = this.members.some(m => this.getMemberId(m.user_id) === userId);
    if (isExist) {
      throw new Error("Người dùng đã là thành viên của phòng");
    }

    this.members.push({
      user_id: userId,
      role: "member",
      status: "accepted"
    });
    this.updatedAt = new Date();
  }

  public removeMember(removeMemberID: string, requesterID: string): void {

    this.isAdmin(requesterID);
    this.isSuperAdmin(requesterID);

    if (removeMemberID === requesterID) {
      throw new Error("Không thể xóa chính mình khỏi nhóm");
    }

    const targetMember = this.members.find(m => this.getMemberId(m.user_id) === removeMemberID);
    if (!targetMember) {
      throw new Error("Người dùng không phải là thành viên của phòng");
    }

    const requester = this.members.find(m => this.getMemberId(m.user_id) === requesterID);
    if (requester?.role === "admin" && targetMember.role !== "member") {
      throw new Error("Quản trị viên chỉ có quyền xóa thành viên bình thường");
    }

    this.members = this.members.filter(m => this.getMemberId(m.user_id) !== removeMemberID);
    this.updatedAt = new Date();
  }

  public leaveRoom(userId: string): void {
    const memberIndex = this.members.findIndex(m => this.getMemberId(m.user_id) === userId);

    if (memberIndex === -1) {
      throw new Error("Bạn không phải là thành viên của phòng này");
    }

    const member = this.members.find(m => this.getMemberId(m.user_id) === userId);
    if (member?.role === "superAdmin") {
      throw new Error("Không thể rời khỏi phòng khi là trưởng nhóm");
    }

    this.members.splice(memberIndex, 1);
    this.updatedAt = new Date();
  }

  public assignAdmin(targetUserId: string, requesterId: string): void {
    if (!targetUserId) {
      throw new Error("Vui lòng chọn thành viên để chỉ định làm quản trị viên");
    }

    if (targetUserId === requesterId) {
      throw new Error("Bạn không thể tự thao tác lên chính mình");
    }

    this.isSuperAdmin(requesterId);

    const targetMember = this.members.find(m => this.getMemberId(m.user_id) === targetUserId);
    if (!targetMember) {
      throw new Error("Người dùng này không có mặt trong phòng");
    }

    if (targetMember.role === "admin" || targetMember.role === "superAdmin") {
      throw new Error("Người dùng này đã là quản trị viên rồi");
    }

    targetMember.role = "admin";
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

    this.isAdmin(requesterId);
    this.isSuperAdmin(requesterId);

    this.title = trimmedTitle;
    this.updatedAt = new Date();
  }

  public isAdmin(user_id: string): void {
    const member = this.members.find(m => m.user_id.toString() === user_id);
    if (member?.role !== "admin") {
      throw new Error("Bạn không có quyền admin");
    }
  }

  public isSuperAdmin(user_id: string): void {
    const member = this.members.find(m => m.user_id.toString() === user_id);
    if (member?.role !== "superAdmin") {
      throw new Error("Bạn không có quyền super admin");
    }
  }

  public checkIsMember(userId: string): void {
    const isMember = this.members.some(m => m.user_id.toString() === userId);

    if (!isMember) {
      throw new Error("Bạn không có quyền truy cập phòng này!");
    }
  }

  public isOwner(userId: string): boolean {
    const owner = this.members.find(m => m.user_id.toString() === userId);
    console.log(owner);
    return owner?.role === "superAdmin";
  }

  public static restore(data: IRoom): RoomEntity {
    return new RoomEntity(data);
  }

  private getMemberId(user_id: any): string {
    if (typeof user_id === "object" && user_id !== null) {
      return (user_id._id || user_id.id || "").toString();
    }
    return (user_id || "").toString();
  }

  public toObject() {
    return {
      id: this.id,
      title: this.title,
      typeRoom: this.typeRoom,
      avatar: this.avatar,
      status: this.status,
      members: this.members,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastMessageId: this.lastMessageId
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
