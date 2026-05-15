import React from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function DataTable({
    columns,
    data,
    basePath = "",
    onDelete,
    onToggle,
    actions = ["view", "edit", "delete"],
    hideActionsIf,
    hideDeleteIf
}) {
    return (
        <div className="w-full overflow-hidden rounded-3xl border border-slate-300 bg-white text-slate-800 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50/80 text-sm whitespace-nowrap">
                            {columns.map((col, index) => (
                                <th key={index} className="px-5 py-4 font-semibold text-slate-500">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-5 py-4 text-right font-semibold text-slate-500">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {data.length > 0 ? data.map((row) => (
                            <tr key={row._id || row.id} className="transition hover:bg-sky-50/40">
                                {columns.map((col, index) => (
                                    <td key={index} className="px-5 py-4 align-middle">
                                        {col.render ? (
                                        col.render(row)
                                    ) : col.accessor === 'status' ? (
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                            row[col.accessor] === 'active' 
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' 
                                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                                        }`}>
                                            {row[col.accessor] === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    ) : typeof row[col.accessor] === 'object' ? (
                                        JSON.stringify(row[col.accessor])
                                    ) : (
                                        <span className="text-slate-700">{row[col.accessor] || "Chưa cập nhật"}</span>
                                    )}
                                    </td>
                                ))}
                                <td className="px-5 py-4 text-right align-middle">
                                    {hideActionsIf && hideActionsIf(row) ? (
                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Mặc định hệ thống</span>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2">
                                            {/* NÚT XEM: Luôn hiển thị nếu có quyền view */}
                                            {actions?.includes("view") && (
                                                <Link to={`${basePath}/${row._id || row.id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700" title="Xem chi tiết">
                                                    <Eye size={16} />
                                                </Link>
                                            )}
                                            {actions?.includes("edit") && (
                                                <Link to={`${basePath}/${row._id || row.id}/edit`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700" title="Chỉnh sửa">
                                                    <Pencil size={16} />
                                                </Link>
                                            )}
                                            
                                            {/* Nếu là tài khoản hệ thống thì chỉ hiện nhãn bảo vệ, ngược lại hiện thao tác tương ứng */}
                                            {hideDeleteIf && hideDeleteIf(row) ? (
                                                <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">Bảo vệ</span>
                                            ) : (
                                                <>
                                                    {actions?.includes("toggle") && (
                                                        <button onClick={() => onToggle?.(row._id || row.id)} className="rounded-xl border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50">
                                                            {row.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                                                        </button>
                                                    )}
                                                    {actions?.includes("delete") && (
                                                        <button onClick={() => onDelete?.(row._id || row.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" title="Xóa">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-5 py-14 text-center">
                                    <div className="mx-auto max-w-sm">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                            <Eye size={20} />
                                        </div>
                                        <p className="mt-3 text-sm font-semibold text-slate-700">Không tìm thấy dữ liệu</p>
                                        <p className="mt-1 text-sm text-slate-400">Thử thay đổi từ khóa tìm kiếm hoặc tải lại trang.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
