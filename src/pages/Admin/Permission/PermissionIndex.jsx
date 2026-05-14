/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRolesAPI, updatePermissionsAPI } from '../../../apis/Admin/role.api';

// Định nghĩa cấu trúc quyền tĩnh của hệ thống
const permissionMatrix = [
  {
    groupName: "Quản lý Người dùng",
    permissions: [
      { key: "users_view", label: "Xem danh sách" },
      { key: "users_create", label: "Thêm mới" },
      { key: "users_edit", label: "Chỉnh sửa" },
      { key: "users_delete", label: "Xóa" },
    ]
  },
  {
    groupName: "Quản lý Nhóm Quyền",
    permissions: [
      { key: "roles_view", label: "Xem danh sách" },
      { key: "roles_create", label: "Thêm mới" },
      { key: "roles_edit", label: "Chỉnh sửa" },
      { key: "roles_permissions", label: "Phân quyền" },
    ]
  },
  {
    groupName: "Quản lý Chatbot",
    permissions: [
      { key: "chats_view", label: "Xem lịch sử Chat" },
      { key: "chats_delete", label: "Xóa lịch sử Chat" },
      { key: "settings_edit", label: "Cấu hình AI (Max tokens, Model)" },
    ]
  }
];

export default function PermissionIndex() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // API backend đã sắp xếp Admin lên đầu rồi
    getRolesAPI({ limit: 100 }).then(res => setRoles(res.data)).catch(() => toast.error("Lỗi tải nhóm quyền"));
  }, []);

  const handleCheckboxChange = (roleId, permissionKey, isChecked) => {
    setRoles(prevRoles => prevRoles.map(role => {
      // Chặn logic UI cho chắc ăn
      if (role.isSystemAdmin) return role; 

      if (role._id === roleId) {
        let newPerms = [...role.permissions];
        if (isChecked) {
          if (!newPerms.includes(permissionKey)) newPerms.push(permissionKey);
        } else {
          newPerms = newPerms.filter(p => p !== permissionKey);
        }
        return { ...role, permissions: newPerms };
      }
      return role;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Lọc bỏ Super Admin ra khỏi payload update để giảm tải
      const dataToSave = roles.filter(r => !r.isSystemAdmin).map(r => ({ _id: r._id, permissions: r.permissions }));
      await updatePermissionsAPI(dataToSave);
      toast.success("Cập nhật phân quyền thành công!");
    } catch (error) { toast.error("Cập nhật thất bại!"); } finally { setLoading(false); }
  };
  if (roles.length === 0) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ma trận Phân quyền</h1>
        <button onClick={handleSave} disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 shadow-sm font-semibold transition">
          {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left bg-white">
          <thead>
            <tr className="bg-gray-800 text-white text-sm">
              <th className="py-4 px-6 font-semibold w-1/4 border-r border-gray-700">Tính năng</th>
              {roles.map(role => (
                <th key={role._id} className={`py-4 px-4 font-semibold text-center border-r border-gray-700 ${role.isSystemAdmin ? 'text-blue-300' : ''}`}>
                  {role.title} {role.isSystemAdmin && '⭐'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.map((group, gIndex) => (
              <React.Fragment key={gIndex}>
                <tr className="bg-gray-100">
                  <td colSpan={roles.length + 1} className="py-3 px-6 font-bold text-blue-800 border-b">
                    {group.groupName}
                  </td>
                </tr>
                {group.permissions.map(perm => (
                  <tr key={perm.key} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6 text-gray-700 border-r">{perm.label}</td>
                    {roles.map(role => {
                      // Nếu là admin, ép trạng thái checked luôn true
                      const isChecked = role.isSystemAdmin ? true : role.permissions.includes(perm.key);
                      return (
                        <td key={role._id} className={`py-3 px-4 text-center border-r ${role.isSystemAdmin ? 'bg-blue-50/30' : ''}`}>
                          <input 
                            type="checkbox" 
                            className={`w-5 h-5 accent-blue-600 ${role.isSystemAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            checked={isChecked}
                            disabled={role.isSystemAdmin}
                            onChange={(e) => handleCheckboxChange(role._id, perm.key, e.target.checked)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}