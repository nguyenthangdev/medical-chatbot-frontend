/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ArrowLeft, FileText, Hash, Loader2, Save, Shield, ShieldAlert } from "lucide-react";
import { createRoleAPI, getRoleDetailAPI, updateRoleAPI } from "../../apis/Admin/role.api";
import { useAuth } from "../../contexts/Admin/AdminAuthContext"; 

export default function RoleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            titleId: "",
            description: "",
            status: "active"
        }
    });

    const [isFetchingDetail, setIsFetchingDetail] = useState(isEdit); // Chỉ loading nếu là form Sửa
    const [isSaving, setIsSaving] = useState(false);

    const { user: adminUser, isLoading: authLoading } = useAuth();

    const requiredPermission = isEdit ? 'roles_edit' : 'roles_create';
    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes(requiredPermission);

    useEffect(() => {
        if (!authLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/roles'), 2000);
            return () => clearTimeout(timer);
        }
    }, [authLoading, hasPermission, navigate]);

    useEffect(() => {
        if (authLoading || !hasPermission || !isEdit) return;

        const fetchRoleDetail = async () => {
            try {
                const res = await getRoleDetailAPI(id);
                if (res.isSystemAdmin) {
                    toast.error("Không thể chỉnh sửa nhóm quyền hệ thống!");
                    navigate('/admin/roles');
                    return;
                }
                reset({
                    title: res.title || "",
                    titleId: res.titleId || "",
                    description: res.description || "",
                    status: res.status || "active"
                });
            } catch (error) {
                toast.error("Lỗi tải dữ liệu nhóm quyền!");
                navigate('/admin/roles');
            } finally {
                setIsFetchingDetail(false);
            }
        };

        fetchRoleDetail();
    }, [id, isEdit, reset, navigate, authLoading, hasPermission]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            if (isEdit) {
                await updateRoleAPI(id, data);
                toast.success("Cập nhật nhóm quyền thành công!");
            } else {
                await createRoleAPI(data);
                toast.success("Tạo nhóm quyền thành công!");
            }
            navigate("/admin/roles");
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi xử lý dữ liệu!");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="max-w-4xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

    if (!hasPermission) {
        return (
            <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <ShieldAlert size={26} />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền thực hiện hành động này</p>
                <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về danh sách nhóm quyền.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link to="/admin/roles" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700" aria-label="Quay lại">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <p className="text-sm font-semibold text-sky-700">{isEdit ? "Cập nhật nhóm quyền" : "Tạo nhóm quyền"}</p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            {isEdit ? "Chỉnh sửa nhóm quyền" : "Thêm mới nhóm quyền"}
                        </h1>
                    </div>
                </div>
            </section>
            
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Tên nhóm quyền <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <Shield className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            {...register("title", { required: "Vui lòng nhập tên nhóm quyền" })} 
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-200 ${errors.title ? 'border-rose-300' : 'border-slate-300 focus:border-sky-400'}`} 
                            placeholder="vd: Quản trị viên"
                        />
                        </div>
                        {errors.title && <p className="mt-2 text-sm font-medium text-rose-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Mã định danh <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <Hash className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            {...register("titleId", { required: "Vui lòng nhập mã định danh" })} 
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-200 ${errors.titleId ? 'border-rose-300' : 'border-slate-300 focus:border-sky-400'}`} 
                            placeholder="vd: admin, content, support" 
                        />
                        </div>
                        {errors.titleId && <p className="mt-2 text-sm font-medium text-rose-600">{errors.titleId.message}</p>}
                    </div>
                </div>

                <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Mô tả chi tiết</label>
                    <div className="relative">
                        <FileText className="pointer-events-none absolute left-4 top-4 text-slate-400" size={18} />
                    <textarea 
                        rows="4" 
                        {...register("description")} 
                            className="w-full resize-none rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
                        placeholder="Mô tả chức năng của nhóm quyền này..."
                    ></textarea>
                    </div>
                </div>

                {isEdit && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</label>
                        <select 
                            {...register("status")} 
                            className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Đã khóa</option>
                        </select>
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition ${isSaving ? 'cursor-not-allowed bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'}`}
                    >
                        {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                        {isSaving ? "Đang lưu..." : "Lưu dữ liệu"}
                    </button>
                    <Link 
                        to="/admin/roles" 
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}
