import React from 'react';
import DataTable from '../../../components/Admin/DataTable';

export default function MessageIndex() {
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'ID Hội thoại', accessor: 'conversationId' },
        { header: 'Người gửi', accessor: 'sender' },
        { header: 'Nội dung (Trích đoạn)', accessor: 'contentSnippet' },
        { header: 'Thời gian', accessor: 'timestamp' },
    ];

    const mockMessages = [
        { id: 'M101', conversationId: 'C001', sender: 'User', contentSnippet: 'Tôi bị đau đầu...', timestamp: '08:00 AM 15/10' },
        { id: 'M102', conversationId: 'C001', sender: 'Bot', contentSnippet: 'Chào bạn, bạn có kèm...', timestamp: '08:01 AM 15/10' },
        { id: 'M103', conversationId: 'C002', sender: 'User', contentSnippet: 'Thuốc này uống sao?', timestamp: '09:15 AM 15/10' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Log Toàn bộ Tin nhắn</h1>
            <DataTable title="Lịch sử hệ thống tin nhắn" columns={columns} data={mockMessages} />
        </div>
    );
}