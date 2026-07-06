import { IPasswordService } from "../../ports/services/password.port";
import { IUserWriteRepository, IUserReadRepository } from "../../ports/repositories/user.port";
import { UserEntity } from "../../../domain/user/entity";
import { EmailAlreadyExistsError, PasswordMismatchError, PasswordTooShortError } from "../../../domain/user/user.errors";

export class RegisterUserUseCase {
  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly userWriteRepo: IUserWriteRepository,
    private readonly passwordService: IPasswordService
  ) { }

  public async execute(dataUser: any) {
    const { fullName, email, password, passwordConfirm } = dataUser;

    if (password !== passwordConfirm) {
      throw new PasswordMismatchError();
    }

    if (!password || password.length <= 6) {
      throw new PasswordTooShortError();
    }

    const user = await this.userReadRepo.findUserByEmail(email);
    if (user) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const userEntity = UserEntity.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const newUser = await this.userWriteRepo.createUser(userEntity);

    if (!newUser) {
      throw new Error("Đăng ký thất bại");
    }

    const profile = newUser.getProfile();

    return {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
    };
  }
}
