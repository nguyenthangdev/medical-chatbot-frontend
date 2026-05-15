/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    Camera,
    Loader2,
    LockKeyhole,
    Mail,
    Save,
    ShieldCheck,
    UserRound
} from "lucide-react";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext.jsx";
import { updateMyProfileAPI } from "../../../apis/Admin/myProfile.api";
import { uploadImageAPI } from "../../../apis/General/upload.api.js";

export default function ProfileEdit() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { refreshUser, user, isLoading } = useAuth();
    
    const [isSaving, setIsSaving] = useState(false); 
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();
    
    useEffect(() => {
        if (user) {
            reset({
                name: user.fullName || user.name,
                email: user.email,
            });
            setAvatarPreview(user.avatar);
        }
    }, [user, reset]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file)); 
        }
    };

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            let payload = {
                fullName: data.name
            };

            if (selectedFile) {
                toast.info("Đang tải ảnh lên hệ thống...");
                const uploadRes = await uploadImageAPI(selectedFile);
                payload.avatar = uploadRes.url; 
            }

            await updateMyProfileAPI(payload);
            await refreshUser();
            
            toast.success("Cập nhật thông tin thành công!");
            navigate("/admin/my-profile");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi khi cập nhật thông tin!";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="max-w-5xl rounded-3xl border border-slate-300 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="space-y-4">
                    <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

    const avatarLetter = (user.fullName || user.name || "A").charAt(0).toUpperCase();

    return (
        <div className="max-w-5xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                        aria-label="Quay lại"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <p className="text-sm font-semibold text-sky-700">Cập nhật hồ sơ</p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Chỉnh sửa thông tin cá nhân</h1>
                    </div>
                </div>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-3xl border border-slate-300 bg-slate-50/70 p-5">
                        <p className="text-sm font-semibold text-slate-700">Ảnh đại diện</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Ảnh sẽ hiển thị trong header và các khu vực quản trị liên quan.
                        </p>

                        <div className="mt-6 flex flex-col items-center gap-4">
                            <div className="group relative">
                                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-sky-100 text-5xl font-semibold text-sky-700 shadow-md ring-1 ring-slate-300">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Ảnh đại diện" className="h-full w-full object-cover" />
                                    ) : (
                                        avatarLetter
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute inset-0 flex items-center justify-center rounded-3xl bg-slate-950/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <Camera size={18} className="mr-2" />
                                    Đổi ảnh
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                            >
                                <Camera size={16} />
                                Chọn ảnh mới
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Họ và tên <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    {...register("name", { required: "Vui lòng nhập họ tên" })}
                                    className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 ${
                                        errors.name ? "border-rose-300" : "border-slate-300 focus:border-sky-400"
                                    }`}
                                    placeholder="Nhập họ và tên..."
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm font-medium text-rose-600">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <ReadOnlyField
                                icon={Mail}
                                label="Email"
                                value={user.email}
                                {...register("email")}
                                note="Email là thông tin định danh, không thể thay đổi."
                            />

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Vai trò</label>
                                <div className="relative">
                                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={user.role_id?.title || "Chưa phân quyền"}
                                        readOnly
                                        className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none"
                                    />
                                </div>
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                                    <LockKeyhole size={13} />
                                    Quyền do quản trị viên cấp cao cấu hình.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition ${
                                    isSaving ? 'cursor-not-allowed bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
                                }`}
                            >
                                {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={isSaving}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

function ReadOnlyField({ icon, label, note, ...inputProps }) {
    const IconComponent = icon;

    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
            <div className="relative">
                <IconComponent className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="email"
                    readOnly
                    className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none"
                    {...inputProps}
                />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                <LockKeyhole size={13} />
                {note}
            </p>
        </div>
    );
}
