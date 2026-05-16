import { useEffect, useMemo, useRef, useState } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { BarChart3, ExternalLink, RefreshCcw } from 'lucide-react';
import { getBIDashboardsAPI, getBIGuestTokenAPI } from '../../../apis/Admin/bi.api';

const defaultDashboards = [
  { key: 'system', title: 'Tổng quan hệ thống' },
  { key: 'chatbot', title: 'Hiệu năng chatbot' },
  { key: 'safety', title: 'An toàn y tế' },
  { key: 'models', title: 'Quản trị mô hình AI' },
];

export default function BIIndex() {
  const mountRef = useRef(null);
  const [dashboards, setDashboards] = useState(defaultDashboards);
  const [activeKey, setActiveKey] = useState(defaultDashboards[0].key);
  const [loading, setLoading] = useState(true);
  const [embedError, setEmbedError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const activeDashboard = useMemo(
    () => dashboards.find((dashboard) => dashboard.key === activeKey) || dashboards[0],
    [activeKey, dashboards]
  );

  useEffect(() => {
    let mounted = true;

    getBIDashboardsAPI()
      .then((data) => {
        if (!mounted) return;
        const nextDashboards = data?.dashboards?.length ? data.dashboards : defaultDashboards;
        setDashboards(nextDashboards);
        setActiveKey((current) => nextDashboards.some((dashboard) => dashboard.key === current) ? current : nextDashboards[0].key);
      })
      .catch(() => {
        if (mounted) setDashboards(defaultDashboards);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeDashboard?.key || !mountRef.current) return;

    let cancelled = false;
    const mountPoint = mountRef.current;
    setLoading(true);
    setEmbedError('');
    mountPoint.replaceChildren();

    const embed = async () => {
      try {
        const tokenData = await getBIGuestTokenAPI(activeDashboard.key);
        if (cancelled) return;

        await embedDashboard({
          id: tokenData.dashboardId,
          supersetDomain: tokenData.supersetDomain,
          mountPoint,
          fetchGuestToken: async () => tokenData.token,
          dashboardUiConfig: {
            hideTitle: true,
            hideChartControls: false,
            hideTab: true,
            filters: {
              expanded: false,
              visible: true,
            },
          },
        });

        const iframe = mountPoint.querySelector('iframe');
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.minHeight = '760px';
          iframe.style.border = '0';
          iframe.style.borderRadius = '20px';
          iframe.style.background = '#fff';
        }
      } catch (error) {
        if (!cancelled) {
          setEmbedError(error.response?.data?.message || error.message || 'Không thể nhúng dashboard Superset.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    embed();

    return () => {
      cancelled = true;
      mountPoint.replaceChildren();
    };
  }, [activeDashboard?.key, refreshKey]);

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
              <BarChart3 size={16} />
              Apache Superset Embedded
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-950">BI Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Dashboard được nhúng bằng guest token từ Superset, không cần đăng nhập Superset riêng trong trang quản trị.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCcw size={16} />
              Tải lại
            </button>
            {activeDashboard?.supersetUrl && (
              <a
                href={activeDashboard.supersetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <ExternalLink size={16} />
                Mở Superset
              </a>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {dashboards.map((dashboard) => {
            const isActive = dashboard.key === activeKey;

            return (
              <button
                key={dashboard.key}
                type="button"
                onClick={() => setActiveKey(dashboard.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-[0_10px_24px_rgba(2,132,199,0.22)]'
                    : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {dashboard.title}
              </button>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-slate-300 bg-white p-3 shadow-sm">
        {loading && (
          <div className="absolute inset-3 z-10 flex items-center justify-center rounded-[22px] bg-white/80 text-sm font-semibold text-slate-500 backdrop-blur">
            Đang tải dashboard...
          </div>
        )}

        <div ref={mountRef} className="min-h-[760px] w-full" />

        {embedError && (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
            {embedError}
          </div>
        )}
      </section>
    </div>
  );
}
