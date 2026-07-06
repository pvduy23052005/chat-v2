import { UserEntity } from "../../../domain/user/entity";
import { IOutputUserDTO } from "../../use-cases/user/get-users.use-case";

export interface IUserReadRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserById(userID: string): Promise<UserEntity | null>;
  findUsersNotInList(listId: string[]): Promise<IOutputUserDTO[]>;
  findUsersInList(listId: string[]): Promise<IOutputUserDTO[]>;
  findFriendNotInRoom(friendIDs: string[], memberIDs: string[]): Promise<any[]>;
  findUserFullName(userID: string): Promise<string | undefined>;
}

export interface IUserWriteRepository {
  updateUserStatus(userID: string, status: string): Promise<any>;
  createUser(user: UserEntity): Promise<UserEntity | null>;
  updateProfile(user: UserEntity): Promise<UserEntity | null>;
}
