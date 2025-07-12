"use client";
import { useState, useEffect, useRef } from "react";

export default function JsonPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("create");
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isDialogOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, postsRes, photosRes] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users"),
        fetch("https://jsonplaceholder.typicode.com/posts"),
        fetch("https://jsonplaceholder.typicode.com/photos"),
      ]);

      const usersData = await usersRes.json();
      const postsData = await postsRes.json();
      const photosData = await photosRes.json();

      setUsers(usersData);
      setPosts(postsData);
      setPhotos(photosData.slice(0, 500));

      setLoading(false);
    } catch (err) {
      setError("فشل جلب البيانات");
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setDialogType("create");
    setCurrentItem(null);

    // إعداد بيانات افتراضية حسب النوع
    if (activeTab === "users") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        company: { name: "" },
      });
    } else if (activeTab === "posts") {
      setFormData({
        title: "",
        body: "",
        userId: 1,
      });
    } else {
      setFormData({
        title: "",
        url: "",
        thumbnailUrl: "",
      });
    }

    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setDialogType("edit");
    setCurrentItem(item);
    setFormData({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/${activeTab}/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        // تحديث الحالة المحلية بعد الحذف
        if (activeTab === "users") {
          setUsers(users.filter((user) => user.id !== id));
        } else if (activeTab === "posts") {
          setPosts(posts.filter((post) => post.id !== id));
        } else {
          setPhotos(photos.filter((photo) => photo.id !== id));
        }
      } else {
        throw new Error("فشل حذف العنصر");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // معالجة الحقول المتداخلة مثل company.name
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "https://jsonplaceholder.typicode.com";
      let method = "POST";

      if (dialogType === "edit") {
        url += `/${activeTab}/${currentItem.id}`;
        method = "PUT";
      } else {
        url += `/${activeTab}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // تحديث الحالة المحلية
      if (dialogType === "create") {
        if (activeTab === "users") {
          setUsers([...users, { ...result, id: users.length + 1 }]);
        } else if (activeTab === "posts") {
          setPosts([...posts, { ...result, id: posts.length + 1 }]);
        } else {
          setPhotos([...photos, { ...result, id: photos.length + 1 }]);
        }
      } else {
        if (activeTab === "users") {
          setUsers(users.map((u) => (u.id === currentItem.id ? result : u)));
        } else if (activeTab === "posts") {
          setPosts(posts.map((p) => (p.id === currentItem.id ? result : p)));
        } else {
          setPhotos(photos.map((p) => (p.id === currentItem.id ? result : p)));
        }
      }

      setIsDialogOpen(false);
    } catch (err) {
      setError("فشل في العملية");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (activeTab === "users") {
      return (
        <div className="form-grid">
          <div className="form-group">
            <label>الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>الهاتف</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>الموقع الإلكتروني</label>
            <input
              type="text"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>اسم الشركة</label>
            <input
              type="text"
              name="company.name"
              value={formData.company?.name || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      );
    } else if (activeTab === "posts") {
      return (
        <div className="form-stack">
          <div className="form-group">
            <label>العنوان</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>المحتوى</label>
            <textarea
              name="body"
              value={formData.body || ""}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-grid">
          <div className="form-group">
            <label>عنوان الصورة</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>رابط الصورة</label>
            <input
              type="url"
              name="url"
              value={formData.url || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>رابط الصورة المصغرة</label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl || ""}
              onChange={handleChange}
            />
          </div>
          {formData.thumbnailUrl && (
            <div className="form-group full-width center">
              <img
                src={formData.thumbnailUrl}
                alt="معاينة"
                className="thumbnail-preview"
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderTable = () => {
    if (loading) return <div className="loading">جاري تحميل البيانات...</div>;
    if (error) return <div className="error">{error}</div>;

    switch (activeTab) {
      case "users":
        return (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الهاتف</th>
                  <th>الموقع</th>
                  <th>الشركة</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.website}</td>
                    <td>{user.company.name}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="delete-btn"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "posts":
        return (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>العنوان</th>
                  <th>المحتوى</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.body.substring(0, 100)}...</td>
                    <td>
                      <button
                        onClick={() => handleEdit(post)}
                        className="edit-btn"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="delete-btn"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "photos":
        return (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>العنوان</th>
                  <th>الصورة المصغرة</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => (
                  <tr key={photo.id}>
                    <td>{photo.id}</td>
                    <td>{photo.title}</td>
                    <td>
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="thumbnail"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(photo)}
                        className="edit-btn"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="delete-btn"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="json-page">
      <div className="page-header">
        <h1>بيانات JSONPlaceholder</h1>
        <p>استكشف بيانات تجريبية من JSONPlaceholder API</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          المستخدمون
        </button>
        <button
          className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          المنشورات
        </button>
        <button
          className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          الصور
        </button>
      </div>

      <button onClick={handleCreate} className="create-btn">
        <span>+</span> إنشاء جديد
      </button>

      {renderTable()}

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h2>
                {dialogType === "create" ? "إنشاء" : "تعديل"}
                {activeTab === "users" && " مستخدم جديد"}
                {activeTab === "posts" && " منشور جديد"}
                {activeTab === "photos" && " صورة جديدة"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setIsDialogOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="dialog-form">
              {renderForm()}

              <div className="dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="submit-btn">
                  {dialogType === "create" ? "إنشاء" : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
