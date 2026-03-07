import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data chi tiết tin nhắn
    const mockMessageDetail = {
        id: id,
        conversationId: 'C001',
        sender: 'Bot (AI Model: GPT-4/Gemini)',
        timestamp: '08:01 AM 15/10/2023',
        content: 'Chào bạn, bạn có kèm theo buồn nôn hay sốt không? Triệu chứng đau đầu có thể do nhiều nguyên nhân gây ra.',
        metadata: {
            promptTokens: 120,
            completionTokens: 45,
            totalTokens: 165,
            latency: '1.2s'
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black font-semibold">
                    ← Quay lại
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết Tin nhắn #{id}</h2>
            </div>

            <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold w-32 inline-block">Hội thoại gốc:</span> <a href={`/admin/conversations/${mockMessageDetail.conversationId}`} className="text-blue-600 hover:underline">{mockMessageDetail.conversationId}</a></p>
                <p><span className="font-semibold w-32 inline-block">Người gửi:</span> {mockMessageDetail.sender}</p>
                <p><span className="font-semibold w-32 inline-block">Thời gian:</span> {mockMessageDetail.timestamp}</p>

                <div className="mt-6">
                    <span className="font-semibold block mb-2">Nội dung đầy đủ:</span>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {mockMessageDetail.content}
                    </div>
                </div>

                {/* Thông số kỹ thuật cho Admin */}
                <div className="mt-6">
                    <span className="font-semibold block mb-2">Metadata (AI Info):</span>
                    <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                        {JSON.stringify(mockMessageDetail.metadata, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}