import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DataTable({
    title,
    columns,
    data,
    basePath = "",
    onDelete,
    actions = ["view", "edit", "delete"],
    keyword = "",
    onSearch,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems = 0
}) {
    const [searchTerm, setSearchTerm] = useState(keyword);

    useEffect(() => {
        setSearchTerm(keyword);
    }, [keyword]);

    const handleSearch = () => {
        if (onSearch) onSearch(searchTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 text-gray-800">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button 
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50 text-sm whitespace-nowrap">
                            {columns.map((col, index) => (
                                <th key={index} className="py-3 px-4 font-semibold text-gray-600">
                                    {col.header}
                                </th>
                            ))}
                            <th className="py-3 px-4 text-center font-semibold text-gray-600">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.length > 0 ? data.map((row) => (
                            <tr key={row._id || row.id} className="border-b hover:bg-gray-50 transition">
                                {columns.map((col, index) => (
                                    <td key={index} className="py-3 px-4">
                                        {/* Hiển thị badge đẹp nếu là status */}
                                        {col.accessor === 'status' ? (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row[col.accessor] === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {row[col.accessor] === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        ) : typeof row[col.accessor] === 'object' ? JSON.stringify(row[col.accessor]) : row[col.accessor]}
                                    </td>
                                ))}
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        {/* Nút Xem */}
                                        {actions?.includes("view") && (
                                            <Link to={`${basePath}/${row._id || row.id}`} className="text-blue-500 hover:text-blue-700 hover:underline font-medium">
                                                Xem
                                            </Link>
                                        )}
                                        
                                        {actions?.includes("edit") && (
                                            <Link to={`${basePath}/${row._id || row.id}/edit`} className="text-green-500 hover:text-green-700 hover:underline font-medium">
                                                Sửa
                                            </Link>
                                        )}

                                        {/* Nút Xóa */}
                                        {actions?.includes("delete") && (
                                            <button onClick={() => onDelete?.(row._id || row.id)} className="text-red-500 hover:text-red-700 hover:underline font-medium">
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-6 text-gray-500">
                                    Không tìm thấy dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-4">
                    <span className="text-gray-500">
                        Tổng cộng: <span className="font-semibold text-gray-800">{totalItems}</span> bản ghi
                    </span>
                    <div className="flex gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="border px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700 transition"
                        >
                            Trước
                        </button>
                        
                        {/* Render mảng số trang */}
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i + 1}
                                onClick={() => onPageChange(i + 1)}
                                className={`border px-3 py-1.5 rounded transition ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="border px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700 transition"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}