import React, { useState, useEffect } from 'react';
import { BroadcastProvider } from './context/BroadcastContext';
import { AdminControlCenter } from './pages/AdminControlCenter';
import { LiveBroadcastScreen } from './pages/LiveBroadcastScreen';
import { TacticalPitchScreen } from './pages/TacticalPitchScreen';
import { MatchPreviewScreen } from './pages/MatchPreviewScreen';
import { DataApiSettingsScreen } from './pages/DataApiSettingsScreen';
import { Scoreboard } from './components/broadcast/Scoreboard';
import { MatchStatsOverlay } from './components/broadcast/MatchStatsOverlay';
import { MomentumChart } from './components/broadcast/MomentumChart';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
      const pathname = window.location.pathname;
      if (pathname && pathname !== '/') return pathname;
    }
    return '/admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  // Render appropriate view based on route
  const renderScreen = () => {
    switch (currentRoute) {
      case '/broadcast':
        return <LiveBroadcastScreen />;

      case '/tactical':
        return <TacticalPitchScreen />;

      case '/preview':
        return <MatchPreviewScreen />;

      case '/settings':
        return (
          <div className="relative">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => navigate('/admin')}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-sport-mono font-bold text-white shadow"
              >
                &larr; Back to Admin Control Center
              </button>
            </div>
            <DataApiSettingsScreen />
          </div>
        );

      case '/scoreboard':
        return (
          <div className="w-screen h-screen bg-transparent p-6 flex items-start justify-start">
            <Scoreboard layout="broadcast-top" />
          </div>
        );

      case '/statistics':
        return <MatchStatsOverlay standalone={true} />;

      case '/momentum':
        return <MomentumChart standalone={true} />;

      case '/admin':
      default:
        return <AdminControlCenter onNavigate={navigate} />;
    }
  };

  return (
    <BroadcastProvider>
      <div className="min-h-screen bg-[#07090e] font-main text-slate-100">
        {renderScreen()}

        {/* Global floating switcher if in OBS / Broadcast preview to easily return to Admin */}
        {(currentRoute === '/broadcast' ||
          currentRoute === '/tactical' ||
          currentRoute === '/scoreboard' ||
          currentRoute === '/statistics' ||
          currentRoute === '/momentum') && (
          <div className="fixed bottom-3 right-3 opacity-20 hover:opacity-100 transition-opacity z-50 pointer-events-auto">
            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-[10px] font-sport-mono text-zinc-300 hover:text-white shadow-xl"
            >
              Open Admin Control Center
            </button>
          </div>
        )}
      </div>
    </BroadcastProvider>
  );
}
