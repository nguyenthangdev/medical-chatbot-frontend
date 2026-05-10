import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as messageApi from "../../../apis/Admin/message.api";

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                setLoading(true);
                // Vì API không có getMessageDetail, ta có thể fetch từ list
                // Hoặc thêm API endpoint mới
                // Tạm thời mock data hoặc fetch từ getMessagesByConversation
                setMessage({
                    _id: id,
                    conversationId: "CONV123",
                    role: "assistant",
                    content: "Hello, do you also feel nausea or fever? Headaches can be caused by many factors including stress, dehydration, or illness.",
                    createdAt: new Date().toISOString(),
                    tokens: {
                        promptTokens: 120,
                        completionTokens: 45,
                        totalTokens: 165,
                        latency: "1.2s",
                    }
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (!message) return <div className="p-6 text-center">Không tìm thấy tin nhắn</div>;

    const isBot = message.role === "assistant";

    return (
        <div className="max-w-4xl bg-white shadow-lg rounded-xl p-6">

            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-4 mb-6">

                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-black font-medium"
                >
                    ← Quay lại
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    Chi tiết Tin nhắn #{id}
                </h2>

            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6 text-sm mb-6">

                <div>
                    <span className="text-gray-500">Conversation</span>
                    <div>
                        <Link
                            to={`/admin/conversations/${message.conversationId}`}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            {message.conversationId}
                        </Link>
                    </div>
                </div>

                <div>
                    <span className="text-gray-500">Role</span>
                    <div className="mt-1">
                        <span
                            className={`px-2 py-1 text-xs rounded ${isBot
                                ? "bg-purple-100 text-purple-600"
                                : "bg-blue-100 text-blue-600"
                                }`}
                        >
                            {isBot ? "Assistant" : "User"}
                        </span>
                    </div>
                </div>

                <div>
                    <span className="text-gray-500">Timestamp</span>
                    <div className="text-gray-600">{new Date(message.createdAt).toLocaleString('vi-VN')}</div>
                </div>

            </div>

            {/* Message Content */}
            <div className="mb-8">

                <h3 className="font-semibold text-gray-800 mb-3">
                    Nội dung Tin nhắn
                </h3>

                <div className="bg-gray-50 border rounded-lg p-4 text-sm leading-relaxed text-gray-700">
                    {message.content}
                </div>

            </div>

            {/* Metadata */}
            {message.tokens && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                        AI Metadata
                    </h3>

                    <div className="grid grid-cols-4 gap-4 text-center">

                        <div className="bg-gray-50 border rounded-lg p-3">
                            <div className="text-xs text-gray-500">Prompt Tokens</div>
                            <div className="font-semibold text-black">
                                {message.tokens.promptTokens}
                            </div>
                        </div>

                        <div className="bg-gray-50 border rounded-lg p-3">
                            <div className="text-xs text-gray-500">Completion Tokens</div>
                            <div className="font-semibold text-black">
                                {message.tokens.completionTokens}
                            </div>
                        </div>

                        <div className="bg-gray-50 border rounded-lg p-3">
                            <div className="text-xs text-gray-500">Total Tokens</div>
                            <div className="font-semibold text-black">
                                {message.tokens.totalTokens}
                            </div>
                        </div>

                        <div className="bg-gray-50 border rounded-lg p-3">
                            <div className="text-xs text-gray-500">Latency</div>
                            <div className="font-semibold text-black">
                                {message.tokens.latency}
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}