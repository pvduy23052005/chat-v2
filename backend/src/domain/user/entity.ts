import { DomainValidationError } from "../shared/errors/domain.errors";
import { IUserProps, IUserProfile, IUserRestore, IUpdateProfile } from "./type";

export class UserEntity {
  private id: string;
  private fullName: string;
  private email: string;
  private password: string;
  private avatar: string;
  private statusOnline: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(data: IUserProps) {
    this.id = data.id?.toString() || "";
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.avatar = data.avatar || "";
    this.statusOnline = data.statusOnline || "offline";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  public isActive(): boolean {
    return this.statusOnline === "active";
  }

  public getProfile(): IUserProfile {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      avatar: this.avatar,
      statusOnline: this.statusOnline
    };
  }

  public getID(): string {
    return this.id;
  }

  public getPassword(): string {
    return this.password;
  }

  public updateProfile(data: IUpdateProfile): void {
    if (data.fullName) {
      this.fullName = data.fullName;
    }
    if (data.avatar) {
      this.avatar = data.avatar;
    }
    this.updatedAt = new Date();
  }

  public getStatusOnline(): string {
    return this.statusOnline;
  }

  public setStatusOnline(status: string): void {
    this.statusOnline = status;
    this.updatedAt = new Date();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }


  public static create(data: IUserProps): UserEntity {
    const errors: Record<string, string> = {};

    if (!data.email || !data.email.includes('@')) {
      errors.email = "Email không hợp lệ hoặc bị để trống";
    }

    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.fullName = "Họ tên không được để trống";
    }

    if (!data.password || data.password.trim().length === 0) {
      errors.password = 'Mật khẩu không được để trống';
    }

    if (Object.keys(errors).length > 0) {
      throw new DomainValidationError(errors);
    }

    return new UserEntity({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      id: undefined,
      statusOnline: data.statusOnline || "offline",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(data: IUserRestore): UserEntity {
    return new UserEntity({
      id: data.id?.toString(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      statusOnline: data.statusOnline || "offline",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
