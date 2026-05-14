import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createRoleAPI, getRoleDetailAPI, updateRoleAPI } from "../../apis/Admin/role.api";

export default function RoleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({ title: "", description: "", status: "active" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (isEdit) {
        getRoleDetailAPI(id).then(res => {
          // Đề phòng cố tình nhập URL id của Admin
          if (res.isSystemAdmin) {
            toast.error("Không thể chỉnh sửa Super Admin!");
            navigate('/admin/roles');
          } else {
            setFormData(res);
          }
        }).catch(() => toast.error("Lỗi tải dữ liệu!"));
      }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateRoleAPI(id, formData);
                toast.success("Cập nhật thành công!");
            } else {
                await createRoleAPI(formData);
                toast.success("Tạo mới thành công!");
            }
            navigate("/admin/roles");
        } catch (error) {
            toast.error(error.response?.data?.error || "Lỗi xử lý!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{isEdit ? "Chỉnh sửa Nhóm Quyền" : "Thêm mới Nhóm Quyền"}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Tên nhóm quyền <span className="text-red-500">*</span></label>
                        <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mã định danh <span className="text-red-500">*</span></label>
                        <input type="text" required value={formData.titleId} onChange={(e) => setFormData({...formData, titleId: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="vd: admin, content, support" />
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-1">Mô tả chi tiết</label>
                    <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2"></textarea>
                </div>
                {isEdit && (
                    <div>
                        <label className="block font-medium mb-1">Trạng thái</label>
                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Đã khóa</option>
                        </select>
                    </div>
                )}
                <div className="flex gap-3 pt-4 border-t">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{loading ? "Đang lưu..." : "Lưu dữ liệu"}</button>
                    <Link to="/admin/roles" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Hủy</Link>
                </div>
            </form>
        </div>
    );
}