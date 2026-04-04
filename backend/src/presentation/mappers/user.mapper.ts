import { UserEntity } from "../../domain/user/entity";

export class UserMapper {
  public static toDomain(raw: any): UserEntity | null {
    if (!raw) return null;

    return UserEntity.restore({
      id: (raw._id || raw.id)?.toString(),
      fullName: raw.fullName,
      email: raw.email,
      password: raw.password,
      avatar: raw.avatar,
      statusOnline: raw.statusOnline,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(user: UserEntity): any {
    return {
      fullName: user.getProfile().fullName,
      email: user.getProfile().email,
      password: user.getPassword(),
      avatar: user.getProfile().avatar,
      statusOnline: user.getStatusOnline(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
