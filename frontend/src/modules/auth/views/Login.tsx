"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "../styles/auth.css";
import "../styles/login.css";
import { AppContext } from "@core/context/AppContext";
import { authServiceAPI } from "@core/api/authServiceAPI";

function Login() {
  const router = useRouter();
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await authServiceAPI.login({ email, password });
      if (res.success) {
        login(res.user);
        toast.success("Đăng nhập thành công!");
        router.push("/chat");
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        toast.error(error.response.data.message || "Đăng nhập thất bại");
      } else {
        toast.error("Đã có lỗi xảy ra");
      }
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          {/* --- Logo & Title --- */}
          <div className="logo-container">
            <p className="login-subtitle">Đăng nhập vào hệ thống</p>
          </div>

          {/* --- Form --- */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <div className="input-wrapper">
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mật khẩu
              </label>
              <div className="input-wrapper">
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"} // Logic ẩn hiện password
                  id="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--color-hover-primary)",
                  }}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            {/* Button Login */}
            <button className="btn-login" type="submit">
              Đăng nhập
            </button>
          </form>

          {/* --- Footer Link --- */}
          <div className="signup-link">
            Chưa có tài khoản? <Link href="/auth/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
