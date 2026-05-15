/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // THÊM useNavigate
import { toast } from 'react-toastify';
import { ArrowLeft, Check, KeyRound, Loader2, Save, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getRolesAPI, updatePermissionsAPI } from '../../../apis/Admin/role.api';
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; // THÊM IMPORT AUTH

// Định nghĩa cấu trúc quyền tĩnh của hệ thống
const permissionMatrix = [
  {
    groupName: "Quản lý Tài khoản người dùng",
    permissions: [
      { key: "users_view", label: "Xem tài khoản người dùng" },
      { key: "users_edit", label: "Chỉnh tài khoản người dùng" },
      { key: "users_delete", label: "Xóa tài khoản người dùng" },
    ]
  },
  {
    groupName: "Quản lý Tài khoản quản trị",
    permissions: [
      { key: "accounts_view", label: "Xem tài khoản quản trị" },
      { key: "accounts_create", label: "Thêm tài khoản quản trị" },
      { key: "accounts_edit", label: "Chỉnh tài khoản quản trị" },
      { key: "accounts_delete", label: "Xóa tài khoản quản trị" },
    ]
  },
  {
    groupName: "Quản lý Nhóm Quyền",
    permissions: [
      { key: "roles_view", label: "Xem danh sách nhóm quyền" },
      { key: "roles_create", label: "Thêm nhóm quyền" },
      { key: "roles_edit", label: "Chỉnh nhóm quyền" },
      { key: "roles_delete", label: "Xóa nhóm quyền" }, // ĐÃ BỔ SUNG QUYỀN XÓA
      { key: "roles_permissions", label: "Phân quyền" },
    ]
  },
  {
    groupName: "Quản lý Hội thoại",
    permissions: [
      { key: "conversations_view", label: "Xem lịch sử hội thoại" },
      { key: "conversations_delete", label: "Xóa lịch sử hội thoại" },
      { key: "conversations_edit", label: "Chỉnh lịch sử hội thoại" },
    ]
  },
  {
    groupName: "Quản lý Tin nhắn",
    permissions: [
      { key: "chats_view", label: "Xem lịch sử tin nhắn" },
      { key: "chats_delete", label: "Xóa lịch sử tin nhắn" },
      { key: "chats_edit", label: "Chỉnh lịch sử tin nhắn" },
    ]
  },
  {
    groupName: "Quản lý Cấu hình cài đặt",
    permissions: [
      { key: "settings_edit", label: "Chỉnh cấu hình cài đặt" },
    ]
  },
];

export default function PermissionIndex() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  
  // Tách riêng 2 trạng thái Loading
  const [isFetchingRoles, setIsFetchingRoles] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);

  const { user: adminUser, isLoading: authLoading } = useAuth(); // LẤY AUTH

  // 1. KIỂM TRA QUYỀN (roles_permissions)
  const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_permissions');

  useEffect(() => {
    if (!authLoading && !hasPermission) {
      const timer = setTimeout(() => navigate('/admin/roles'), 2000);
      return () => clearTimeout(timer);
    }
  }, [authLoading, hasPermission, navigate]);

  // 2. FETCH DATA (CHẶN NẾU KHÔNG CÓ QUYỀN)
  useEffect(() => {
    if (authLoading || !hasPermission) return;

    const fetchRoles = async () => {
      try {
        const res = await getRolesAPI({ limit: 100 });
        setRoles(res.data || []);
      } catch (error) {
        toast.error("Lỗi tải danh sách nhóm quyền");
      } finally {
        setIsFetchingRoles(false);
      }
    };
    fetchRoles();
  }, [authLoading, hasPermission]);

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

  // 3. LƯU DỮ LIỆU
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Lọc bỏ nhóm quyền hệ thống ra khỏi payload update để giảm tải
      const dataToSave = roles.filter(r => !r.isSystemAdmin).map(r => ({ _id: r._id, permissions: r.permissions }));
      await updatePermissionsAPI(dataToSave);
      toast.success("Cập nhật phân quyền thành công!");
    } catch (error) { 
      toast.error("Cập nhật phân quyền thất bại!"); 
    } finally { 
      setIsSaving(false); 
    }
  };

  // 4. HIỂN THỊ SPINNER KHI ĐANG CHECK AUTH HOẶC FETCH ROLES
  if (authLoading) {
    return (
      <div className="rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded-full bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-[55vh] animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  // 5. CHẶN GIAO DIỆN NẾU KHÔNG CÓ QUYỀN
  if (!hasPermission) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldAlert size={26} />
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền truy cập trang này</p>
        <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về danh sách nhóm quyền.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
          <button 
            onClick={() => navigate('/admin/roles')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              aria-label="Quay lại nhóm quyền"
          >
              <ArrowLeft size={18} />
          </button>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                <KeyRound size={16} />
                Ma trận phân quyền
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Cấu hình quyền truy cập
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Bật hoặc tắt từng quyền cho các nhóm quản trị. Nhóm quyền hệ thống luôn được bảo vệ.
              </p>
            </div>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition ${isSaving ? 'cursor-not-allowed bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'}`}
        >
            {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
      </section>

      <section className="rounded-[28px] border border-slate-300 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.07)] sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <Check size={14} />
            Quyền đang bật
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
            <ShieldCheck size={14} />
            Nhóm hệ thống được khóa
          </span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-300 ring-1 ring-slate-300/70">
          <table className="w-full min-w-[980px] text-left bg-white">
          <thead>
              <tr className="whitespace-nowrap bg-slate-900 text-sm text-white">
                <th className="sticky left-0 z-20 w-1/4 border-r border-slate-600 bg-slate-900 px-6 py-4 font-semibold">
                Tính năng
              </th>
              {roles.map(role => (
                  <th key={role._id} className={`min-w-[150px] border-r border-slate-600 px-4 py-4 text-center font-semibold ${role.isSystemAdmin ? 'text-sky-300' : ''}`}>
                    <div className="flex items-center justify-center gap-2">
                      {role.isSystemAdmin && <ShieldCheck size={15} />}
                      <span>{role.title}</span>
                    </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.map((group, gIndex) => (
              <React.Fragment key={gIndex}>
                  <tr className="bg-slate-100">
                    <td colSpan={roles.length + 1} className="sticky left-0 z-10 border-b border-slate-300 bg-slate-100 px-6 py-3 font-semibold text-slate-900">
                    {group.groupName}
                  </td>
                </tr>
                {group.permissions.map(perm => (
                    <tr key={perm.key} className="border-b border-slate-300 transition hover:bg-sky-50/60">
                      <td className="sticky left-0 z-10 border-r border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700">
                        <div>
                          <p>{perm.label}</p>
                          <p className="mt-1 font-mono text-xs text-slate-400">{perm.key}</p>
                        </div>
                    </td>
                    {roles.map(role => {
                      // Nếu là admin, ép trạng thái checked luôn true
                      const isChecked = role.isSystemAdmin ? true : role.permissions.includes(perm.key);
                      return (
                          <td key={role._id} className={`align-middle border-r border-slate-300 px-4 py-4 text-center ${role.isSystemAdmin ? 'bg-sky-50/70' : 'bg-white'}`}>
                            <label className={`relative mx-auto block h-8 w-14 rounded-full ring-1 transition ${isChecked ? 'bg-sky-600 ring-sky-600' : 'bg-slate-300 ring-slate-300'} ${role.isSystemAdmin ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:ring-slate-400'}`}>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                disabled={role.isSystemAdmin}
                                onChange={(e) => handleCheckboxChange(role._id, perm.key, e.target.checked)}
                              />
                              <span className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-md transition-transform duration-200 ${isChecked ? 'translate-x-6 border-white text-sky-600' : 'translate-x-0 border-slate-400 text-slate-400'}`}>
                                {isChecked && <Check size={14} />}
                              </span>
                            </label>
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
      </section>
    </div>
  );
}
