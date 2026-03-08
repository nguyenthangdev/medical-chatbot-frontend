import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const message = {
        id: id,
        conversationId: "C001",
        sender: "Bot",
        model: "GPT-4 / Gemini",
        timestamp: "08:01 AM • 15 Oct 2023",
        content:
            "Hello, do you also feel nausea or fever? Headaches can be caused by many factors including stress, dehydration, or illness.",
        metadata: {
            promptTokens: 120,
            completionTokens: 45,
            totalTokens: 165,
            latency: "1.2s",
        },
    };

    const isBot = message.sender === "Bot";

    return (
        <div className="max-w-4xl bg-white shadow-lg rounded-xl p-6">

            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-4 mb-6">

                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-black font-medium text-white"
                >
                    ← Back
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    Message Detail #{id}
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
                    <span className="text-gray-500">Sender</span>
                    <div className="mt-1">
                        <span
                            className={`px-2 py-1 text-xs rounded ${isBot
                                ? "bg-purple-100 text-purple-600"
                                : "bg-blue-100 text-blue-600"
                                }`}
                        >
                            {message.sender}
                        </span>

                        {isBot && (
                            <span className="ml-2 text-gray-500 text-xs">
                                Model: {message.model}
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <span className="text-gray-500">Timestamp</span>
                    <div className="text-gray-500">{message.timestamp}</div>
                </div>

            </div>

            {/* Message Content */}
            <div className="mb-8">

                <h3 className="font-semibold text-gray-800 mb-3">
                    Message Content
                </h3>

                <div className="bg-gray-50 border rounded-lg p-4 text-sm leading-relaxed text-gray-500">
                    {message.content}
                </div>

            </div>

            {/* Metadata */}
            <div>

                <h3 className="font-semibold text-gray-800 mb-3">
                    AI Metadata
                </h3>

                <div className="grid grid-cols-4 gap-4 text-center">

                    <div className="bg-gray-50 border rounded-lg p-3">
                        <div className="text-xs text-gray-500">Prompt Tokens</div>
                        <div className="font-semibold text-black">
                            {message.metadata.promptTokens}
                        </div>
                    </div>

                    <div className="bg-gray-50 border rounded-lg p-3">
                        <div className="text-xs text-gray-500">Completion Tokens</div>
                        <div className="font-semibold text-black">
                            {message.metadata.completionTokens}
                        </div>
                    </div>

                    <div className="bg-gray-50 border rounded-lg p-3">
                        <div className="text-xs text-gray-500">Total Tokens</div>
                        <div className="font-semibold text-black">
                            {message.metadata.totalTokens}
                        </div>
                    </div>

                    <div className="bg-gray-50 border rounded-lg p-3">
                        <div className="text-xs text-gray-500">Latency</div>
                        <div className="font-semibold text-black">
                            {message.metadata.latency}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}