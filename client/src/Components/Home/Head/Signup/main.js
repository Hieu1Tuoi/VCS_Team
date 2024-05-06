import React, { useState } from "react";
import "./signup.css";
import validator from "validator"; // Import thư viện validator
import { Link } from "react-router-dom";
import Back from "../../../Back/back";
import Slogan from "../../../Slogan/slogan";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import axios from "axios";

const RegistrationForm = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Kiểm tra các điều kiện ràng buộc
    if (!validator.isLength(formData.username, { min: 3 })) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
    }
    if (!validator.isEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!validator.isMobilePhone(formData.phone, "vi-VN")) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!validator.isLength(formData.password, { min: 6 })) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    // Nếu có lỗi, hiển thị thông báo lỗi
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      try {
        const response = await axios.post(
          "http://localhost:3000/api/signup",
          formData
        );
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        alert("Đã tạo tài khoản thành công !");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // Kiểm tra nếu email đã tồn tại
          alert("Email đã tồn tại!"); // Thiết lập thông báo lỗi
        } else {
          alert("Lỗi khi đăng ký !");
        }
      }
    }
  };

  return (
    <div className="Main">
      <Back />
      <Slogan />
      <div className="registration-form-container">
        <h1
          style={{
            textAlign: "center",
            alignItems: "center",
            color: "#03a84e",
            borderBottom: "none",
            marginLeft: "-70px",
          }}
        >
          Tạo tài khoản người dùng
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên người dùng:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="button-group">
            <button
              type="submit"
              style={{ margin: "0 auto", textAlign: "center" }}
            >
              Đăng ký
            </button>
            <div className="login-links">
              <Link to="/login">Đăng nhập</Link>
              <span> | </span>
              <Link to="/forgot">Quên tài khoản</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
