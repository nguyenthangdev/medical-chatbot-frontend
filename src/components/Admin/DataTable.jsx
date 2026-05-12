import React from "react";
import { Link } from "react-router-dom";

export default function DataTable({
    columns,
    data,
    basePath = "",
    onDelete,
    actions = ["view", "edit", "delete"]
}) {
    return (
        <div className="bg-white shadow rounded-lg text-gray-800 w-full">
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
                                        {col.render ? (
                                        col.render(row)
                                    ) : col.accessor === 'status' ? (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            row[col.accessor] === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {row[col.accessor] === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    ) : typeof row[col.accessor] === 'object' ? (
                                        JSON.stringify(row[col.accessor])
                                    ) : (
                                        row[col.accessor]
                                    )}
                                    </td>
                                ))}
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        {actions?.includes("view") && (
                                            <Link to={`${basePath}/${row._id || row.id}`} className="text-blue-500 hover:text-blue-700 hover:underline font-medium">Xem</Link>
                                        )}
                                        {actions?.includes("edit") && (
                                            <Link to={`${basePath}/${row._id || row.id}/edit`} className="text-green-500 hover:text-green-700 hover:underline font-medium">Sửa</Link>
                                        )}
                                        {actions?.includes("delete") && (
                                            <button onClick={() => onDelete?.(row._id || row.id)} className="text-red-500 hover:text-red-700 hover:underline font-medium">Xóa</button>
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
        </div>
    );
}