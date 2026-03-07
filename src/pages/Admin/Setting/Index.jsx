import React from 'react';

export default function SettingIndex() {
    return (
        <div className="max-w-3xl bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt Hệ thống Chatbot</h2>

            <div className="space-y-6">
                {/* Cài đặt chung */}
                <section className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Thông số AI</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Temperature (Độ sáng tạo)</label>
                            <input type="number" step="0.1" defaultValue={0.7} className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Max Tokens</label>
                            <input type="number" defaultValue={2000} className="w-full border rounded p-2" />
                        </div>
                    </div>
                </section>

                {/* Trạng thái hệ thống */}
                <section>
                    <h3 className="text-lg font-semibold mb-3">Bảo trì</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span>Bật chế độ bảo trì (Tạm ngưng nhận tin nhắn)</span>
                    </label>
                </section>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Lưu Cài đặt</button>
            </div>
        </div>
    );
}