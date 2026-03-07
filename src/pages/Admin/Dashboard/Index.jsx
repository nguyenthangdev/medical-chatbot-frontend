import React from 'react';

export default function Dashboard() {
    const stats = [
        { title: 'Tổng User', value: '1,245', color: 'bg-blue-500' },
        { title: 'Bác sĩ trực tuyến', value: '42', color: 'bg-green-500' },
        { title: 'Đoạn chat hôm nay', value: '8,401', color: 'bg-purple-500' },
        { title: 'Cảnh báo y tế', value: '3', color: 'bg-red-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center ${stat.color}`}>
                            {/* Có thể thay bằng Icon (Heroicons/Lucide) */}
                            <span className="text-xl font-bold">#</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md p-6 h-64 flex items-center justify-center">
                <p className="text-gray-400">Khu vực biểu đồ (Chart.js / Recharts) sẽ đặt ở đây</p>
            </div>
        </div>
    );
}