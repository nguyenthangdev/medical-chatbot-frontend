/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSettingsAPI, updateSettingAPI } from "../../../apis/Admin/setting.api";

export default function SettingIndex() {
    const modelOptions = ['qwen', 'gemini', 'claude'];
    const [selectedModel, setSelectedModel] = useState('qwen');
    const [loading, setLoading] = useState(false);

    // Lưu state cấu hình cho từng model
    const [configs, setConfigs] = useState({
        qwen: { temperature: 0.7, maxTokens: 2000, maintenanceMode: false },
        gemini: { temperature: 0.7, maxTokens: 2000, maintenanceMode: false },
        claude: { temperature: 0.7, maxTokens: 2000, maintenanceMode: false }
    });

    useEffect(() => {
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
                toast.error("Không thể tải cài đặt!");
            }
        };
        fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        setLoading(true);
        try {
            const dataToSave = configs[selectedModel];
            await updateSettingAPI(selectedModel, dataToSave);
            toast.success(`Đã lưu cấu hình cho mô hình ${selectedModel.toUpperCase()}!`);
        } catch (error) {
            toast.error("Lỗi khi lưu cấu hình!");
        } finally {
            setLoading(false);
        }
    };

    const currentConfig = configs[selectedModel];

    return (
        <div className="max-w-3xl bg-white shadow-md rounded-xl p-8 text-gray-800">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">
                Cài đặt Hệ thống Chatbot
            </h2>

            <div className="space-y-8">
                {/* Chọn Model để Cấu hình */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <label className="block text-sm font-semibold mb-2">Đang cấu hình cho Mô hình AI:</label>
                    <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full md:w-1/2 border border-blue-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 uppercase font-bold text-blue-700"
                    >
                        {modelOptions.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                <section>
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">Thông số AI (AI Configuration)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-2 text-gray-600">Nhiệt độ (Temperature - Sáng tạo)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0" max="1"
                                value={currentConfig.temperature}
                                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-gray-600">Giới hạn Token / 1 Phiên (Max Tokens)</label>
                            <input
                                type="number"
                                min="100"
                                value={currentConfig.maxTokens}
                                onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">Tổng token cả User + AI nếu vượt mức này sẽ bị chặn.</p>
                        </div>
                    </div>
                </section>

                <section className="bg-red-50 p-5 rounded-lg border border-red-100">
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Chế độ Bảo trì (Maintenance)</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={currentConfig.maintenanceMode}
                            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                            className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Khóa tạm thời mô hình này (Tạm dừng phản hồi từ Bot)
                        </span>
                    </label>
                </section>

                <div className="pt-4 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu Cài đặt'}
                    </button>
                </div>
            </div>
        </div>
    );
}