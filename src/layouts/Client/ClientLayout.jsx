import { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Client/Sidebar';
import { useChat } from '../../hooks/Client/useChat';
import { useAuth } from '../../contexts/Client/ClientAuthContext';

const ClientLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('chatFontSize') || 'medium');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('clientTheme') === 'dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('clientSidebarCollapsed') === 'true');
  const { user } = useAuth();
  
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isUpgradePage = location.pathname === '/upgrade';
  const isStartingNewChatRef = useRef(false);

  const { 
    messages, 
    loading, 
    loadingConversation,
    conversationId, 
    sendMessage, 
    appendAssistantMessage,
    isLimitReached,
    loadConversation, 
    clearChat 
  } = useChat(
    user?._id, 
    () => setRefreshSidebar(prev => prev + 1)
  );

  useEffect(() => {
    if (!id) {
      isStartingNewChatRef.current = false;
      return;
    }

    if (isStartingNewChatRef.current) return;

    const isCurrentConversation = String(id) === String(conversationId);
    if (!isCurrentConversation || messages.length === 0) {
      loadConversation(id);
    }
  }, [id, loadConversation, conversationId, messages.length]);

  useEffect(() => {
    if (!id && loading && conversationId && messages.length > 0) {
      navigate(`/chat/${conversationId}`, { replace: true });
    }
  }, [id, loading, conversationId, navigate, messages.length]);

  const handleNewChat = useCallback(() => {
    isStartingNewChatRef.current = true;
    clearChat();
    navigate('/');
  }, [clearChat, navigate]);

  const handleChatHistoryCleared = useCallback(() => {
    isStartingNewChatRef.current = true;
    clearChat();
    setRefreshSidebar(prev => prev + 1);
    navigate('/');
  }, [clearChat, navigate]);

  const handleThemeChange = useCallback((value) => {
    setIsDarkMode(value);
    localStorage.setItem('clientTheme', value ? 'dark' : 'light');
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('clientSidebarCollapsed', String(next));
      return next;
    });
  }, []);

  return (
    <div className={`flex h-screen w-full overflow-hidden relative ${
      isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f5f9fc] text-slate-800'
    }`}>
      {!isUpgradePage && (
      <div className="hidden md:block z-10 shadow-lg">
        <Sidebar 
          currentConversationId={id || conversationId}
          refreshTrigger={refreshSidebar}
          onRefreshSidebar={() => setRefreshSidebar(prev => prev + 1)}
          onNewChat={handleNewChat}
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={handleToggleSidebar}
          isDarkMode={isDarkMode}
        />
      </div>
      )}

      {!isUpgradePage && (
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      )}

      {!isUpgradePage && (
      <div className={`md:hidden fixed top-0 left-0 h-full w-[82%] max-w-[320px] z-50 shadow-2xl transform transition-transform duration-300 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          currentConversationId={id || conversationId}
          refreshTrigger={refreshSidebar}
          onRefreshSidebar={() => setRefreshSidebar(prev => prev + 1)}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onNewChat={() => { handleNewChat(); setIsMobileMenuOpen(false); }}
          isDarkMode={isDarkMode}
        />
        <button onClick={() => setIsMobileMenuOpen(false)} className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-bold transition ${isDarkMode ? 'bg-white/10 text-slate-300 hover:bg-white/15' : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600'}`}>X</button>
      </div>
      )}
      
      <main className="flex-1 flex flex-col h-full relative">
        <Outlet context={{
          isMobileMenuOpen,
          setIsMobileMenuOpen,
          fontSize,
          setFontSize,
          messages,
          loading,
          loadingConversation,
          conversationId,
          sendMessage,
          appendAssistantMessage,
          isLimitReached,
          onChatHistoryCleared: handleChatHistoryCleared,
          isDarkMode,
          setIsDarkMode: handleThemeChange
        }} />
      </main>
    </div>
  );
};

export default ClientLayout;
