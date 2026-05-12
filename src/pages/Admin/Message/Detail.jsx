/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMessageDetailAPI } from "../../../apis/Admin/message.api";
import { toast } from "react-toastify";

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                setLoading(true);
                const res = await getMessageDetailAPI(id);
                setMessage(res.data);
            } catch (err) {
                toast.error("Không thể lấy chi tiết tin nhắn!");
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, [id]);

    if (loading) return <div className="p-6 text-center text-blue-600 font-medium">Đang tải dữ liệu...</div>;
    if (!message) return <div className="p-6 text-center text-gray-500">Không tìm thấy tin nhắn</div>;

    const isBot = message.role === "assistant";

    return (
        <div className="max-w-5xl bg-white shadow-lg rounded-xl p-8">

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        ← Quay lại
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi tiết Tin nhắn <span className="text-gray-400 text-base">#{id}</span>
                    </h2>
                </div>
                <div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isBot ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {isBot ? "🤖 Bác sĩ Ảo (Assistant)" : "👤 Bệnh nhân (User)"}
                    </span>
                </div>
            </div>

            {/* Cột thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8 bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div>
                    <span className="text-gray-500 block mb-1">ID Cuộc trò chuyện (Session ID)</span>
                    <Link
                        to={`/admin/conversations/${message.conversationId}`}
                        className="text-blue-600 hover:underline font-bold"
                    >
                        {message.conversationId}
                    </Link>
                </div>
                <div>
                    <span className="text-gray-500 block mb-1">Thời gian gửi</span>
                    <div className="text-gray-800 font-semibold">{new Date(message.createdAt).toLocaleString('vi-VN')}</div>
                </div>
                {message.model && (
                    <div>
                        <span className="text-gray-500 block mb-1">Mô hình sử dụng</span>
                        <div className="text-gray-800 font-semibold uppercase">{message.model}</div>
                    </div>
                )}
            </div>

            {/* Nội dung chính */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3 text-lg border-l-4 border-blue-500 pl-2">
                    {isBot ? "Nội dung bot trả lời" : "Câu hỏi của người dùng"}
                </h3>
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {message.content}
                </div>
            </div>

            {/* Dữ liệu Phân tích của AI (Chỉ hiện nếu là bot) */}
            {isBot && (
                <div className="space-y-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg border-l-4 border-purple-500 pl-2">
                        Thông số Phân tích (AI Metadata)
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Intent */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">Ý định User (Intent)</div>
                            <div className="font-semibold text-gray-800">{message.intent || 'Không xác định'}</div>
                        </div>

                        {/* Risk Level */}
                        <div className={`border rounded-lg p-4 shadow-sm ${message.risk_level === 'high' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                            <div className={`text-xs mb-1 ${message.risk_level === 'high' ? 'text-red-500' : 'text-gray-500'}`}>Mức độ nguy hiểm</div>
                            <div className={`font-semibold capitalize ${message.risk_level === 'high' ? 'text-red-700' : 'text-gray-800'}`}>
                                {message.risk_level || 'Low'}
                            </div>
                        </div>

                        {/* Confidence */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">Độ tự tin (Confidence)</div>
                            <div className="font-semibold text-gray-800">
                                {message.confidence ? `${(message.confidence * 100).toFixed(1)}%` : 'N/A'}
                            </div>
                        </div>

                        {/* Blocked */}
                        <div className={`border rounded-lg p-4 shadow-sm ${message.blocked ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
                            <div className={`text-xs mb-1 ${message.blocked ? 'text-orange-500' : 'text-gray-500'}`}>Bị chặn (Blocked)</div>
                            <div className={`font-semibold ${message.blocked ? 'text-orange-700' : 'text-green-600'}`}>
                                {message.blocked ? 'Có 🚫' : 'Không ✔️'}
                            </div>
                        </div>
                    </div>

                    {/* Warnings */}
                    {message.warnings && message.warnings.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-red-700 mb-2">Cảnh báo hệ thống:</h4>
                            <ul className="list-disc list-inside text-sm text-red-600">
                                {message.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Nguồn tham khảo (Sources):</h4>
                            <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                                {message.sources.map((src, i) => (
                                    <li key={i}>{typeof src === 'object' ? src.title || src.name : src}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Audio URL */}
                    {message.audio_url && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-blue-700 mb-2">Link Audio TTS:</h4>
                            <a href={message.audio_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                                {message.audio_url}
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Tokens (nếu có lưu ở document) */}
            {message.tokens && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-600 mb-3 text-sm">Phân tích Token & Latency</h3>
                    <div className="flex gap-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Prompt: {message.tokens.promptTokens || 0}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Completion: {message.tokens.completionTokens || 0}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Tổng: {message.tokens.totalTokens || 0}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Độ trễ: {message.latency || message.tokens.latency || 'N/A'}</span>
                    </div>
                </div>
            )}
        </div>
    );
}