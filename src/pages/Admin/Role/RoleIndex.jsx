/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../../components/Admin/DataTable";
import Pagination from "../../../components/Admin/Pagination";
import { getRolesAPI, deleteRoleAPI } from "../../../apis/Admin/role.api";

export default function RoleIndex() {
    const [roles, setRoles] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const keyword = searchParams.get("keyword") || "";

    // const columns = [
    //     { header: "Tên nhóm quyền", accessor: "title" },
    //     { header: "Mô tả", accessor: "description", render: (row) => <span className="text-gray-500 truncate block max-w-xs">{row.description || '---'}</span> },
    //     { header: "Trạng thái", accessor: "status" },
    //     { header: "Ngày tạo", accessor: "createdAt", render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN") },
    // ];
    const columns = [
        { header: "Tên nhóm quyền", accessor: "title", render: (row) => <strong className={row.isSystemAdmin ? "text-blue-600" : ""}>{row.title}</strong> },
        { header: "Mã định danh", accessor: "titleId" },
        { header: "Mô tả", accessor: "description", render: (row) => <span className="text-gray-500 truncate block max-w-xs">{row.description || '---'}</span> },
        { header: "Trạng thái", accessor: "status" },
        { header: "Ngày tạo", accessor: "createdAt", render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN") },
    ];

    const fetchRoles = useCallback(async () => {
        try {
            const res = await getRolesAPI({ page, limit, keyword });
            setRoles(res.data);
            setPagination(res.pagination);
            if (res.keyword) setSearchInput(res.keyword);
        } catch (error) {
            toast.error("Lỗi tải danh sách nhóm quyền!");
        }
    }, [page, limit, keyword]);

    useEffect(() => { fetchRoles(); }, [fetchRoles]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ keyword: searchInput, page: 1 });
    };

    const handleDelete = async (id) => {
        if(window.confirm("Bạn có chắc chắn muốn xóa nhóm quyền này?")) {
            try {
                await deleteRoleAPI(id);
                toast.success("Xóa thành công!");
                fetchRoles();
            } catch (err) {
                toast.error("Xóa thất bại!");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhóm Quyền</h1>
                <div className="flex gap-3">
                    <Link to="/admin/permissions" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-sm">
                        🛡️ Phân quyền
                    </Link>
                    <Link to="/admin/roles/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                        + Thêm mới
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input type="text" placeholder="Nhập tên nhóm quyền..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-[300px]" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Tìm kiếm</button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <DataTable 
                  columns={columns} 
                  data={roles} 
                  basePath="/admin/roles" 
                  onDelete={handleDelete} 
                  actions={["view", "edit", "delete"]} 
                  hideActionsIf={(row) => row.isSystemAdmin}
                />
                <Pagination pagination={pagination} handlePagination={(p) => setSearchParams({ ...Object.fromEntries([...searchParams]), page: p })} />
            </div>
        </div>
    );
}