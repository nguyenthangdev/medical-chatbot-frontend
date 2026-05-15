/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    AlertTriangle,
    Bot,
    BrainCircuit,
    Gauge,
    Loader2,
    Save,
    ServerCog,
    ShieldAlert,
    SlidersHorizontal,
    Wrench
} from "lucide-react";
import { getSettingsAPI, updateSettingAPI } from "../../../apis/Admin/setting.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; 
import { useNavigate } from "react-router-dom";

export default function SettingIndex() {
    const modelOptions = ['qwen', 'gemini', 'claude'];
    const [selectedModel, setSelectedModel] = useState('qwen');
    const [isLoadingSetting, setIsLoadingSetting] = useState(false);
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    const [configs, setConfigs] = useState({
        qwen: { temperature: 0.7, maxTokens: 2000, maintenanceMode: false },
        gemini: { temperature: 0.7, maxTokens: 2000, maintenanceMode: false },
        claude: { temperature: 0.7, maxTokens: 2000, maintenanceMode: false }
    });

    const hasPermission = user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('settings_edit');

    useEffect(() => {
        if (!isLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, hasPermission, navigate]);
    
    useEffect(() => {
        if (isLoading || !hasPermission) return;

        const fetchSettings = async () => {
            try {
                const res = await getSettingsAPI();
                if (res.data && res.data.length > 0) {
                    const newConfigs = { ...configs };
                    res.data.forEach(setting => {
                        if (newConfigs[setting.modelName]) {
                            newConfigs[setting.modelName] = setting;
                        }
                    });
                    setConfigs(newConfigs);
                }
            } catch (error) {
                console.log("Không thể tải cài đặt!");
            }
        };
        fetchSettings();
    }, [isLoading, hasPermission]);

    const handleChange = (field, value) => {
        setConfigs(prev => ({
            ...prev,
            [selectedModel]: {
                ...prev[selectedModel],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsLoadingSetting(true);
        try {
            const dataToSave = configs[selectedModel];
            await updateSettingAPI(selectedModel, dataToSave);
            toast.success(`Đã lưu cấu hình cho mô hình ${selectedModel.toUpperCase()}!`);
        } catch (error) {
            toast.error("Lỗi khi lưu cấu hình!");
        } finally {
            setIsLoadingSetting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl rounded-3xl border border-slate-300 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="space-y-4">
                    <div className="h-8 w-64 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
                        <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (!hasPermission) {
        return (
            <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <ShieldAlert size={26} />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền truy cập trang này</p>
                <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về trang tổng quan.</p>
            </div>
        );
    }

    const currentConfig = configs[selectedModel];

    return (
        <div className="max-w-6xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                            <ServerCog size={16} />
                            Cấu hình hệ thống
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                            Cài đặt Chatbot AI
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Quản lý mô hình AI, giới hạn token và trạng thái bảo trì để kiểm soát chất lượng phản hồi trong hệ thống.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isLoadingSetting}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition ${
                            isLoadingSetting ? 'cursor-not-allowed bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
                        }`}
                    >
                        {isLoadingSetting ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                        {isLoadingSetting ? 'Đang lưu...' : 'Lưu cài đặt'}
                    </button>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="mb-4 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-sky-700" />
                    <h2 className="text-base font-semibold text-slate-950">Chọn mô hình cần cấu hình</h2>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {modelOptions.map(model => {
                        const active = selectedModel === model;
                        const config = configs[model];

                        return (
                            <button
                                key={model}
                                type="button"
                                onClick={() => setSelectedModel(model)}
                                className={`rounded-3xl border p-4 text-left transition ${
                                    active
                                        ? 'border-sky-500 bg-sky-50 shadow-[0_12px_28px_rgba(2,132,199,0.14)]'
                                        : 'border-slate-300 bg-white hover:border-sky-300 hover:bg-sky-50/60'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className={`text-lg font-semibold uppercase ${active ? 'text-sky-800' : 'text-slate-900'}`}>
                                            {model}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {config.maintenanceMode ? 'Đang bảo trì' : 'Đang hoạt động'}
                                        </p>
                                    </div>
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                                        active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        <Bot size={19} />
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                    <div className="mb-6 flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-sky-700" />
                        <h2 className="text-lg font-semibold text-slate-950">Thông số AI</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label className="text-sm font-semibold text-slate-700">
                                    Chỉ số sáng tạo
                                </label>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    Temperature: {currentConfig.temperature}
                                </span>
                            </div>
                            <input
                                type="range"
                                step="0.1"
                                min="0"
                                max="1"
                                value={currentConfig.temperature}
                                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                                className="w-full accent-sky-600"
                            />
                            <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                                <span>Ổn định</span>
                                <span>Sáng tạo</span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Giới hạn token / 1 phiên
                            </label>
                            <div className="relative">
                                <Gauge className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="number"
                                    min="100"
                                    value={currentConfig.maxTokens}
                                    onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                />
                            </div>
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Tổng token của người dùng và AI nếu vượt mức này sẽ bị chặn để bảo vệ hiệu năng hệ thống.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`rounded-[28px] border p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)] ${
                    currentConfig.maintenanceMode ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'
                }`}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Wrench size={18} className={currentConfig.maintenanceMode ? 'text-rose-700' : 'text-emerald-700'} />
                                <h2 className="text-lg font-semibold text-slate-950">Chế độ bảo trì</h2>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Khi bật, mô hình <span className="font-semibold uppercase">{selectedModel}</span> sẽ tạm dừng phản hồi từ bot.
                            </p>
                        </div>

                        <label className={`relative block h-8 w-14 shrink-0 rounded-full ring-1 transition ${
                            currentConfig.maintenanceMode ? 'bg-rose-600 ring-rose-600' : 'bg-slate-300 ring-slate-300'
                        } cursor-pointer`}>
                            <input
                                type="checkbox"
                                checked={currentConfig.maintenanceMode}
                                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                className="sr-only"
                            />
                            <span className={`absolute left-1 top-1 h-6 w-6 rounded-full border bg-white shadow-md transition-transform duration-200 ${
                                currentConfig.maintenanceMode ? 'translate-x-6 border-white' : 'translate-x-0 border-slate-400'
                            }`} />
                        </label>
                    </div>

                    {currentConfig.maintenanceMode && (
                        <div className="mt-5 rounded-2xl border border-rose-200 bg-white/70 p-4">
                            <div className="flex gap-3">
                                <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rose-700" />
                                <p className="text-sm leading-6 text-rose-700">
                                    Mô hình này đang bị khóa tạm thời. Người dùng có thể không nhận được phản hồi từ bot nếu hệ thống đang dùng mô hình này.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
