import { Request, Response } from "express"

import { LoginUseCase } from "../../../application/use-cases/auth/login.use-case";
import { LogoutUseCase } from "../../../application/use-cases/auth/logout.use-case";
import { RegisterUserUseCase } from "../../../application/use-cases/auth/register.use-case";

import { UserReadRepository } from "../../../infrastructure/database/repositories/user.repository";
import { UserWriteRepository } from "../../../infrastructure/database/repositories/user.repository";

import { BcryptHashService } from "../../../infrastructure/external-service/bcrypt-hash.service";
import { TokenService } from "../../../infrastructure/external-service/token.service";
import { catchAsync } from "../../utils/catchAsyn";

const userReadRepository = new UserReadRepository();
const userWriteRepository = new UserWriteRepository();
const bcryptService = new BcryptHashService();
const tokenService = new TokenService();

// [post] auth/login . 
export const login = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const loginUseCase = new LoginUseCase(userReadRepository, userWriteRepository, bcryptService, tokenService);
  const { user, token } = await loginUseCase.execute(email, password);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  // socket .
  _io.emit("SERVER_RETURN_ROOM_STATUS", {
    userID: user.id,
    status: "online"
  });

  res.status(200).json({
    success: true,
    user: user,
    token: token
  });
});

// [post] auth/logout . 
export const logout = catchAsync(async (req: Request, res: Response) => {
  const { myID } = req.body;

  res.clearCookie("token");

  const logoutUseCase = new LogoutUseCase(userReadRepository, userWriteRepository);

  await logoutUseCase.execute(myID);

  // socket .
  _io.emit("SERVER_RETURN_ROOM_STATUS", {
    userID: myID,
    status: "offline"
  });

  res.status(200).json({
    success: true,
    message: "Đăng xuất thành công!"
  });
});

// [post] auth/register . 
export const register = catchAsync(async (req: Request, res: Response) => {
  let { email, password, fullName, passwordConfirm } = req.body;

  const dataUser = {
    fullName: fullName.trim(),
    email: email.trim(),
    password: password.trim(),
    passwordConfirm: passwordConfirm.trim(),
  };

  const registerUserUseCase = new RegisterUserUseCase(userReadRepository, userWriteRepository, bcryptService);
  const newUser = await registerUserUseCase.execute(dataUser);

  res.status(201).json({
    success: true,
    dataUser: newUser
  });
});