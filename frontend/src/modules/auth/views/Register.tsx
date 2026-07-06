"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "../styles/auth.css";
import "../styles/register.css";
import { authServiceAPI } from "@core/api/authServiceAPI";

function Register() {
  const router = useRouter();

  // State Management
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const res = await authServiceAPI.register(formData);
      if (res.success) {
        toast.success("Đăng ký thành công!");
        router.push("/auth/login");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
      toast.error(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!",
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Tạo tài khoản mới</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Tên đăng nhập *
            </label>
            <div className="input-wrapper">
              <input
                className="form-input"
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Nguyễn Văn A"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email *
            </label>
            <div className="input-wrapper">
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu *
            </label>
            <div className="input-wrapper">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="passwordConfirm">
              Xác nhận mật khẩu *
            </label>
            <div className="input-wrapper">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                id="passwordConfirm"
                name="passwordConfirm"
                placeholder="••••••••"
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
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

          {/* Register Button */}
          <button className="btn-register" type="submit">
            Đăng ký
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link">
          Đã có tài khoản? <Link href="/auth/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
