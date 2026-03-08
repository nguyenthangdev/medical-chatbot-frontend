import React from "react";
import { Link } from "react-router-dom";

export default function DataTable({
    title,
    columns,
    data,
    basePath = "",
    onDelete
}) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-gray-800">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">

                <h2 className="text-lg font-semibold">
                    {title}
                </h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-lg px-3 py-2"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Search
                    </button>
                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full text-left">

                    <thead>
                        <tr className="border-b bg-gray-50 text-sm">

                            {columns.map((col, index) => (
                                <th key={index} className="py-3 px-4">
                                    {col.header}
                                </th>
                            ))}

                            <th className="py-3 px-4 text-center">
                                Actions
                            </th>

                        </tr>
                    </thead>

                    <tbody className="text-sm">

                        {data.map((row) => (

                            <tr
                                key={row.id}
                                className="border-b hover:bg-gray-50"
                            >

                                {columns.map((col, index) => (
                                    <td key={index} className="py-3 px-4">
                                        {row[col.accessor]}
                                    </td>
                                ))}

                                <td className="py-3 px-4 text-center">

                                    <div className="flex justify-center gap-3">

                                        <Link
                                            to={`${basePath}/${row.id}`}
                                            className="text-gray-600 hover:text-black"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            to={`${basePath}/${row.id}/edit`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => onDelete?.(row.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">

                <span>
                    Showing 1 - 10 of 50
                </span>

                <div className="flex gap-1">

                    <button className="border px-3 py-1 rounded hover:bg-gray-100 text-white">
                        Prev
                    </button>

                    <button className="border px-3 py-1 rounded bg-blue-600 text-white">
                        1
                    </button>

                    <button className="border px-3 py-1 rounded hover:bg-gray-100 text-white">
                        2
                    </button>

                    <button className="border px-3 py-1 rounded hover:bg-gray-100 text-white">
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}