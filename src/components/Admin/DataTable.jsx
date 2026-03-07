import React from 'react';

export default function DataTable({ title, columns, data }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            {/* Header: Tiêu đề & Tìm kiếm */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Tìm
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            {columns.map((col, index) => (
                                <th key={index} className="py-3 px-6 cursor-pointer hover:bg-gray-200">
                                    {col.header} ↕
                                </th>
                            ))}
                            <th className="py-3 px-6 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="py-3 px-6 whitespace-nowrap">
                                        {row[col.accessor]}
                                    </td>
                                ))}
                                <td className="py-3 px-6 text-center flex justify-center gap-2">
                                    <button className="text-blue-500 hover:text-blue-700">Sửa</button>
                                    <button className="text-red-500 hover:text-red-700">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang (Pagination UI) */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">Hiển thị 1 - 10 trên 50 kết quả</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 border rounded hover:bg-gray-100">Trước</button>
                    <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-100">Sau</button>
                </div>
            </div>
        </div>
    );
}