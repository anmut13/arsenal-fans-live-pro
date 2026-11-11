import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { formatMatchClock } from '../../utils/broadcastLogic';
import { Play, Pause, RotateCcw, Plus, Clock, Volume2, VolumeX } from 'lucide-react';

export const MatchClockControl: React.FC = () => {
  const {
    state,
    startClock,
    pauseClock,
    resetClock,
    addClockMinutes,
    setMatchPeriod,
    updateClock,
    isAudioMuted,
    toggleAudioMute,
  } = useBroadcast();

  const { clock } = state;
  const clockInfo = formatMatchClock(clock);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-5 shadow-xl text-white">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-500" />
          <h3 className="font-sport-heading text-xl uppercase tracking-wider font-bold">
            Match Clock &amp; Period Control
          </h3>
        </div>
        <button
          onClick={toggleAudioMute}
          className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isAudioMuted
              ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
              : 'bg-red-950/60 border-red-500/50 text-red-400 hover:bg-red-900/60'
          }`}
          title="Toggle broadcast sound effects"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isAudioMuted ? 'Muted' : 'Sound FX On'}</span>
        </button>
      </div>

      {/* Big Digital Broadcast Clock Display */}
      <div className="flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-4 shadow-inner">
        <div className="text-[11px] font-sport-mono text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              clock.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span>{clockInfo.periodLabel}</span>
          {clock.isRunning && <span className="text-emerald-400 font-bold">• ON AIR</span>}
        </div>
        <div className="font-sport-mono text-5xl lg:text-6xl font-black tracking-wider text-white">
          {clockInfo.display}
        </div>
        {clock.addedTime > 0 && (
          <div className="mt-1 text-xs font-sport-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            Stoppage: +{clock.addedTime} mins
          </div>
        )}
      </div>

      {/* Main Start / Pause / Reset Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {clock.isRunning ? (
          <button
            onClick={pauseClock}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-sport-heading text-lg font-bold uppercase transition shadow-lg"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            onClick={startClock}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sport-heading text-lg font-bold uppercase transition shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START</span>
          </button>
        )}

        <button
          onClick={resetClock}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-sport-heading text-base font-semibold uppercase transition border border-zinc-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET</span>
        </button>

        <div className="flex gap-1">
          <button
            onClick={() => addClockMinutes(1)}
            className="flex-1 flex items-center justify-center py-2 px-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sport-mono font-bold border border-zinc-700"
            title="Add 1 minute"
          >
            +1M
          </button>
          <button
            onClick={() => addClockMinutes(5)}
            className="flex-1 flex items-center justify-center py-2 px-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sport-mono font-bold border border-zinc-700"
            title="Add 5 minutes"
          >
            +5M
          </button>
        </div>
      </div>

      {/* Match Period Quick Switcher */}
      <div className="border-t border-zinc-800 pt-3">
        <label className="text-[11px] font-sport-mono uppercase text-zinc-400 font-bold block mb-2">
          Match Period Selector:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs font-sport-mono font-semibold">
          {[
            { id: 'UPCOMING', label: 'Pre-Match' },
            { id: '1ST_HALF', label: '1st Half' },
            { id: 'HALF_TIME', label: 'Half Time' },
            { id: '2ND_HALF', label: '2nd Half' },
            { id: 'EXTRA_TIME', label: 'Extra Time' },
            { id: 'FULL_TIME', label: 'Full Time' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMatchPeriod(item.id as any)}
              className={`py-1.5 px-2 rounded text-center transition ${
                clock.half === item.id
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Added Time Slider */}
      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-sport-mono">Stoppage Time (Added Mins):</span>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 8].map((mins) => (
            <button
              key={mins}
              onClick={() => updateClock({ addedTime: mins })}
              className={`w-6 h-6 rounded flex items-center justify-center font-sport-mono font-bold text-xs ${
                clock.addedTime === mins
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              +{mins}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
