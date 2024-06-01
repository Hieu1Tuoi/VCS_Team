import React, { useEffect, useState } from "react";
import "./create.css"; // Import file CSS
import Back from "../../../Back/back";
import Slogan from "../../../Slogan/slogan";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

function PostForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    postDuration: "",
    describe: "",
    price: "",
    acreage: "",
    address: "",
    images: [],
    district: "",
    agreeTerms: false,
  });

  // State để lưu danh sách các quận từ cơ sở dữ liệu
  const [districts, setDistricts] = useState([]);

  // State để lưu danh sách thời hạn đăng bài và giá
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    // Kiểm tra xem có đối tượng user trong localStorage hay không
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    // Lấy danh sách các quận từ cơ sở dữ liệu
    async function fetchDistricts() {
      try {
        const response = await axios.get("http://localhost:3000/api/hcmdistrict"); // API endpoint
        setDistricts(response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }

    // Lấy danh sách thời hạn đăng bài từ API
    async function fetchPriceList() {
      try {
        const response = await axios.get("http://localhost:3000/api/get-pricelist"); // API endpoint
        setPriceList(response.data);
      } catch (error) {
        console.error("Error fetching price list:", error);
      }
    }

    fetchDistricts();
    fetchPriceList();
  }, [navigate]); // Thực hiện fetch một lần duy nhất khi component được render

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.agreeTerms) {
      alert("Vui lòng đồng ý với điều khoản và dịch vụ");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("postDuration", formData.postDuration);
      formDataToSend.append("describe", formData.describe);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("acreage", formData.acreage);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("district", formData.district);

      // Append từng hình ảnh vào formData
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post(
        "http://localhost:3000/api/create-post",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const postId = response.data.postId;
      console.log("Post created with ID:", postId);

      // Xóa tất cả các trường biểu mẫu sau khi đăng thành công
      setFormData({
        title: "",
        postDuration: "",
        describe: "",
        price: "",
        acreage: "",
        address: "",
        images: [],
        district: "",
        agreeTerms: false,
      });
      document.getElementById("image-input").value = "";

      alert("Đã đăng tin thành công");
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi đăng tin");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleImageChange = (e) => {
    const imageFiles = Array.from(e.target.files); // Get the selected file
    if (imageFiles.length > 5) {
      alert("Bạn chỉ được chọn tối đa 5 ảnh");
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: imageFiles, // Set the image file in the form data
    }));
  };

  const formatMoney = (amount) => {
    return amount
      .toLocaleString("en-US", { style: "currency", currency: "USD" })
      .replace(/\$/, "")
      .replace(/\.00$/, "");
  };

  return (
    <div>
      <Back />
      <Slogan />
      <div className="post-form-container">
        <h2>Tạo bài đăng mới</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <label>Tiêu đề bài đăng:</label>
              <input
                type="text2"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="select-label">Thời hạn đăng bài:</label>
              <select
                id="post-duration"
                name="postDuration"
                value={formData.postDuration}
                onChange={handleChange}
                required
              >
                <option value="">Chọn khoảng thời gian</option>
                {/* Hiển thị danh sách thời hạn đăng bài và giá */}
                {priceList.map((item) => (
                  <option key={item.postduration} value={item.postduration}>
                    {`${item.POSTDURATION} ngày - ${formatMoney(item.PRICE)} VND`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <label>Mô tả:</label>
              <textarea
                name="describe"
                value={formData.describe}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <label>Giá:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="VND"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Diện tích:</label>
              <input
                type="number"
                name="acreage"
                value={formData.acreage}
                onChange={handleChange}
                placeholder="mét"
                required
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <label>Địa điểm:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Phường, xã"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Quận/Huyện:</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Quận/Huyện</option>
                {/* Dùng dữ liệu từ database để tạo các option */}
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.DISTRICT}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>Hình ảnh:</label>
            <input
              id="image-input"
              type="file"
              name="images"
              multiple // cho phép chọn nhiều ảnh
              onChange={handleImageChange}
              required
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeTerms" style={{ marginLeft: "10px" }}>
              Tôi đồng ý với điều khoản và dịch vụ
            </label>
          </div>
          <button type="submit">Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
