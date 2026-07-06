import { IRoomMember } from "../type";

type MemberRole = "superAdmin" | "admin" | "member";
type MemberStatus = "waiting" | "accepted" | "refused";

export class RoomMemberVO {
  public readonly user_id: string;
  public readonly role: MemberRole;
  public readonly status: MemberStatus;

  private constructor(data: IRoomMember) {
    this.user_id = data.user_id;
    this.role = data.role;
    this.status = data.status;
  }

  public static createSuperAdmin(userId: string): RoomMemberVO {
    return new RoomMemberVO({
      user_id: userId,
      role: "superAdmin",
      status: "accepted"
    });
  }

  public static createAdmin(userId: string): RoomMemberVO {
    return new RoomMemberVO({
      user_id: userId,
      role: "admin",
      status: "accepted"
    });
  }

  public static createMember(userId: string): RoomMemberVO {
    return new RoomMemberVO({
      user_id: userId,
      role: "member",
      status: "accepted"
    });
  }

  public static createWaitingMember(userId: string): RoomMemberVO {
    return new RoomMemberVO({
      user_id: userId,
      role: "member",
      status: "waiting"
    });
  }

  public static promoteAdmin(member: RoomMemberVO): RoomMemberVO {
    return new RoomMemberVO({
      user_id: member.user_id,
      role: "admin",
      status: member.status
    });
  }

  public static accept(member: RoomMemberVO): RoomMemberVO {
    return new RoomMemberVO({
      user_id: member.user_id,
      role: member.role,
      status: "accepted"
    });
  }
}