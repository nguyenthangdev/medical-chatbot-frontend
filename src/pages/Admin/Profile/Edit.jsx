import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext.jsx";
import { updateMyProfileAPI } from "../../../apis/Admin/myProfile.api";
import { uploadImageAPI } from "../../../apis/General/upload.api.js";

export default function ProfileEdit() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { refreshUser, user, isLoading } = useAuth();
    
    const [isSaving, setIsSaving] = useState(false); 
    
    // Quản lý ảnh
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();
    
    useEffect(() => {
        if (user) {
            reset({
                name: user.fullName || user.name,
                email: user.email,
            });
            setAvatarPreview(user.avatar); // Set ảnh cũ
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
            // 1. Chuẩn bị payload JSON thuần túy
            let payload = {
                fullName: data.name
            };

            // 2. Nếu user có chọn ảnh mới -> GỌI API UPLOAD TRƯỚC
            if (selectedFile) {
                toast.info("Đang tải ảnh lên hệ thống...");
                const uploadRes = await uploadImageAPI(selectedFile);
                payload.avatar = uploadRes.url; // Gắn cái link lấy được từ Cloudinary vào payload
            }

            // 3. Gọi API cập nhật profile với payload dạng JSON thuần ({ fullName, avatar })
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

    if (isLoading || !user) return <div className="p-8 text-center">Đang tải...</div>;

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-xl p-6 text-gray-800 transition-all duration-300 animate-fade-in-up">

            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1 font-medium"
                >
                    &larr; Quay lại
                </button>
                <h2 className="text-2xl font-semibold">
                    Chỉnh sửa thông tin
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative group">
                        <img 
                            src={avatarPreview || "/default-avatar.png"} 
                            alt="Avatar" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-50"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium"
                        >
                            Đổi ảnh
                        </button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Vui lòng nhập họ tên" })}
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition outline-none"
                        placeholder="Nhập họ và tên..."
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        readOnly
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed select-none outline-none"
                    />
                    <p className="text-xs text-orange-500 mt-1.5 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Email không thể thay đổi vì lý do bảo mật.
                    </p>
                </div>

                <div className="flex gap-4 pt-6 mt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
                            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-sm'
                        }`}
                    >
                        {isSaving && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                    >
                        Hủy
                    </button>
                </div>

            </form>

        </div>
    );
}