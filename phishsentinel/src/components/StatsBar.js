import React from 'react';

export default function StatsBar({ history, modelAcc }) {
  const total = history.length;
  const maliciousCount = history.filter(h => h.phishingProb >= 70).length;
  const suspiciousCount = history.filter(h => h.phishingProb >= 30 && h.phishingProb < 70).length;
  const legitimateCount = total - maliciousCount - suspiciousCount;

  const stats = [
    { label: 'SCANS THIS SESSION', value: total, color: '#e8e8f0' },
    { label: 'LEGITIMATE DETECTED', value: legitimateCount, color: legitimateCount > 0 ? '#00ff88' : '#4a4a6a' },
    { label: 'SUSPICIOUS DETECTED', value: suspiciousCount, color: suspiciousCount > 0 ? '#ffaa00' : '#4a4a6a' },
    { label: 'MALICIOUS DETECTED', value: maliciousCount, color: maliciousCount > 0 ? '#ff3366' : '#4a4a6a' },
  ];

  return (
    <div className="rounded-xl border border-border p-5" style={{ background: 'rgba(17,17,24,0.8)' }}>
      <p className="font-mono text-xs text-muted tracking-widest mb-4">MODEL STATS</p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="space-y-0.5">
            <p className="font-mono text-xs text-muted">{s.label}</p>
            <p className="font-display font-bold text-lg" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between font-mono text-xs mb-2">
            <span className="text-accent">{legitimateCount} legitimate</span>
            <span className="text-warn">{suspiciousCount} suspicious</span>
            <span className="text-danger">{maliciousCount} malicious</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/5 flex">
            {legitimateCount > 0 && (
              <div
                className="h-full bg-accent/60 transition-all duration-700"
                style={{ width: `${(legitimateCount / total) * 100}%` }}
              />
            )}
            {suspiciousCount > 0 && (
              <div
                className="h-full bg-warn/60 transition-all duration-700"
                style={{ width: `${(suspiciousCount / total) * 100}%` }}
              />
            )}
            {maliciousCount > 0 && (
              <div
                className="h-full bg-danger/60 transition-all duration-700"
                style={{ width: `${(maliciousCount / total) * 100}%` }}
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg border border-border/50 bg-white/2">
        <p className="font-mono text-xs text-muted/70 leading-relaxed">
          All analysis runs locally in your browser. No URL data is sent to any server.
        </p>
      </div>
    </div>
  );
}
