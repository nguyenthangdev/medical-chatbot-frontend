/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    AlertTriangle,
    ArrowLeft,
    Bot,
    CalendarClock,
    Database,
    FileText,
    Gauge,
    Link2,
    MessageSquareText,
    ShieldAlert,
    UserRound,
    Volume2
} from "lucide-react";
import { getMessageDetailAPI } from "../../../apis/Admin/message.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext";

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [message, setMessage] = useState(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    const { user: adminUser, isLoading: authLoading } = useAuth();

    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('chats_view');

    useEffect(() => {
        if (!authLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [authLoading, hasPermission, navigate]);

    useEffect(() => {
        if (authLoading || !hasPermission) return;
        const fetchMessage = async () => {
            try {
                setIsFetchingDetail(true);
                const res = await getMessageDetailAPI(id);
                setMessage(res.data);
            } catch (err) {
                console.log("Không thể lấy chi tiết tin nhắn!");
            } finally {
                setIsFetchingDetail(false);
            }
        };
        fetchMessage();
    }, [id, authLoading, hasPermission]);

    if (authLoading || isFetchingDetail) {
        return (
            <div className="max-w-5xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-8 w-64 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

    if (!hasPermission) {
        return (
            <div className="max-w-5xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <ShieldAlert size={26} />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền truy cập trang này</p>
                <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về trang tổng quan.</p>
            </div>
        );
    }

    if (!message) {
        return (
            <div className="max-w-5xl rounded-3xl border border-slate-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <MessageSquareText size={24} />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Không tìm thấy tin nhắn</p>
                <p className="mt-2 text-sm text-slate-500">Bản ghi có thể đã bị xóa hoặc không còn khả dụng.</p>
            </div>
        );
    }

    const isBot = message.role === "assistant";
    const riskLevel = message.risk_level || "low";
    const latency = message.latency || message.tokens?.latency || "Chưa có dữ liệu";

    return (
        <div className="max-w-6xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                            aria-label="Quay lại"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-sky-700">Chi tiết tin nhắn</p>
                            <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-950">
                                Bản ghi #{id}
                            </h2>
                        </div>
                    </div>

                    <span className={`inline-flex w-max items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                        isBot ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200" : "bg-slate-100 text-slate-700"
                    }`}>
                        {isBot ? <Bot size={16} /> : <UserRound size={16} />}
                        {isBot ? "Trợ lý AI" : "Người dùng"}
                    </span>
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="space-y-5">
                    <div className="rounded-[28px] border border-slate-300 bg-white p-5 shadow-sm">
                        <h3 className="text-base font-semibold text-slate-950">Thông tin cơ bản</h3>
                        <div className="mt-4 space-y-3">
                            <InfoItem icon={Link2} label="Cuộc hội thoại">
                                <Link to={`/admin/conversations/${message.conversationId}`} className="break-all font-mono text-sm font-semibold text-sky-700 hover:underline">
                                    {message.conversationId}
                                </Link>
                            </InfoItem>
                            <InfoItem icon={CalendarClock} label="Thời gian gửi">
                                {new Date(message.createdAt).toLocaleString('vi-VN')}
                            </InfoItem>
                            {message.model && (
                                <InfoItem icon={Database} label="Mô hình sử dụng">
                                    <span className="uppercase">{message.model}</span>
                                </InfoItem>
                            )}
                        </div>
                    </div>

                    {isBot && (
                        <div className="rounded-[28px] border border-slate-300 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-slate-950">Thông số AI</h3>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                <MetricCard label="Ý định người dùng" value={message.intent || "Không xác định"} />
                                <MetricCard
                                    label="Mức độ rủi ro"
                                    value={riskLevel}
                                    tone={riskLevel === "high" ? "danger" : "safe"}
                                />
                                <MetricCard label="Độ tự tin" value={message.confidence || "Chưa có dữ liệu"} />
                                <MetricCard
                                    label="Trạng thái chặn"
                                    value={message.blocked ? "Đã chặn" : "Không bị chặn"}
                                    tone={message.blocked ? "warning" : "safe"}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    <div className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-sky-700" />
                            <h3 className="text-lg font-semibold text-slate-950">
                                {isBot ? "Nội dung trợ lý AI trả lời" : "Câu hỏi của người dùng"}
                            </h3>
                        </div>
                        <div className={`mt-4 rounded-3xl border p-5 text-[15px] leading-7 text-slate-800 ${
                            isBot ? "border-sky-200 bg-sky-50/70" : "border-slate-300 bg-slate-50"
                        }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>

                    {isBot && (
                        <div className="space-y-5">
                            {message.warnings && message.warnings.length > 0 && (
                                <Panel title="Cảnh báo hệ thống" icon={AlertTriangle} tone="danger">
                                    <ul className="space-y-2 text-sm text-rose-700">
                                        {message.warnings.map((warn, i) => <li key={i}>- {warn}</li>)}
                                    </ul>
                                </Panel>
                            )}

                            {message.sources && message.sources.length > 0 && (
                                <Panel title="Thông tin liên quan" icon={FileText}>
                                    <ol className="space-y-2 text-sm text-slate-600">
                                        {message.sources.map((src, i) => (
                                            <li key={i}>{i + 1}. {typeof src === 'object' ? src.title || src.name : src}</li>
                                        ))}
                                    </ol>
                                </Panel>
                            )}

                            {message.audio_url && (
                                <Panel title="Đường dẫn âm thanh TTS" icon={Volume2}>
                                    <a href={message.audio_url} target="_blank" rel="noreferrer" className="break-all text-sm font-semibold text-sky-700 hover:underline">
                                        {message.audio_url}
                                    </a>
                                </Panel>
                            )}
                        </div>
                    )}

                    {message.tokens && (
                        <div className="rounded-[28px] border border-slate-300 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Gauge size={18} className="text-sky-700" />
                                <h3 className="text-base font-semibold text-slate-950">Token và độ trễ</h3>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <TokenBadge label="Token gửi đi" value={message.tokens.prompt_tokens || 0} />
                                <TokenBadge label="Token trả về" value={message.tokens.completion_tokens || 0} />
                                <TokenBadge label="Tổng token" value={message.tokens.total_tokens || 0} />
                                <TokenBadge label="Còn lại phiên này" value={message.tokens.token_remaining || 0} />
                                <TokenBadge label="Độ trễ" value={`${latency} ms`} />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function InfoItem({ icon: Icon, label, children }) {
    return (
        <div className="rounded-2xl border border-slate-300 bg-slate-50/70 p-4">
            <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                    <Icon size={18} />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <div className="mt-1 break-words text-sm font-semibold text-slate-900">{children}</div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, tone = "default" }) {
    const styles = {
        default: "border-slate-300 bg-slate-50 text-slate-800",
        safe: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-100 bg-amber-50 text-amber-700",
        danger: "border-rose-200 bg-rose-50 text-rose-700"
    };

    return (
        <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
            <p className="mt-2 text-base font-semibold">{value}</p>
        </div>
    );
}

function Panel({ title, icon: Icon, children, tone = "default" }) {
    const toneClass = tone === "danger"
        ? "border-rose-200 bg-rose-50"
        : "border-slate-300 bg-white";

    return (
        <div className={`rounded-[24px] border p-5 shadow-sm ${toneClass}`}>
            <div className="mb-3 flex items-center gap-2">
                <Icon size={18} className={tone === "danger" ? "text-rose-700" : "text-sky-700"} />
                <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
            </div>
            {children}
        </div>
    );
}

function TokenBadge({ label, value }) {
    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {label}: {value}
        </span>
    );
}
