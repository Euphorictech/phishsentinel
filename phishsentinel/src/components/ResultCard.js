import React, { useEffect, useState } from 'react';

export default function ResultCard({ result }) {
  const [animatedConf, setAnimatedConf] = useState(0);
  const [showAllFlags, setShowAllFlags] = useState(false);
  const { phishingProb, detectedFlags, url } = result;

  useEffect(() => {
    setAnimatedConf(0);
    const timer = setTimeout(() => setAnimatedConf(phishingProb), 100);
    return () => clearTimeout(timer);
  }, [phishingProb, url]);

  let color = '#00ff88';
  let bgColor = 'rgba(0, 255, 136, 0.05)';
  let glowClass = 'result-safe';
  let badgeText = '✓ LEGITIMATE';
  let badgeStyle = 'text-accent border-accent/40 bg-accent/10';
  let verdictColor = 'rgba(0, 255, 136, 0.8)';

  if (phishingProb >= 70) {
    color = '#ff3366';
    bgColor = 'rgba(255, 51, 102, 0.05)';
    glowClass = 'result-danger';
    badgeText = '⚠ HIGH RISK / MALICIOUS';
    badgeStyle = 'text-danger border-danger/40 bg-danger/10';
    verdictColor = 'rgba(255, 51, 102, 0.8)';
  } else if (phishingProb >= 30) {
    color = '#ffaa00';
    bgColor = 'rgba(255, 170, 0, 0.05)';
    glowClass = 'result-warning';
    badgeText = '⚠ SUSPICIOUS';
    badgeStyle = 'text-warn border-warn/40 bg-warn/10';
    verdictColor = 'rgba(255, 170, 0, 0.8)';
  }

  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - animatedConf / 100);

  return (
    <div
      className={`rounded-xl border p-6 transition-all duration-500 ${glowClass}`}
      style={{ background: bgColor, borderColor: `${color}40` }}
    >
      <div className="flex flex-col sm:flex-row gap-6">

        {/* Confidence Ring */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="relative w-28 h-28">
            <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
              <circle cx="56" cy="56" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="56" cy="56" r="40" fill="none"
                stroke={color} strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="confidence-ring"
                style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-2xl" style={{ color }}>{animatedConf}%</span>
              <span className="font-mono text-xs text-muted mt-0.5">THREAT</span>
            </div>
          </div>
          <div className={`font-mono text-xs font-bold tracking-widest px-3 py-1 rounded border ${badgeStyle}`}>
            {badgeText}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <p className="font-mono text-xs text-muted mb-1">ANALYZED URL</p>
            <p className="font-mono text-sm text-text truncate">{url}</p>
          </div>

          <div className="mb-4 space-y-2">
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span style={{ color }}>THREAT LEVEL</span>
                <span style={{ color }}>{phishingProb}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full feature-bar"
                  style={{
                    width: `${phishingProb}%`,
                    background: phishingProb >= 70
                      ? 'linear-gradient(90deg, #ff3366, #ff6688)'
                      : phishingProb >= 30
                        ? 'linear-gradient(90deg, #ffaa00, #ffc04d)'
                        : 'linear-gradient(90deg, #00ff88, #33ffaa)'
                  }}
                />
              </div>
            </div>
          </div>

          {detectedFlags.length > 0 ? (
            <div className="rounded-lg border border-warn/20 bg-warn/5 p-3">
              <p className="font-mono text-xs text-warn font-medium mb-2 tracking-wide">⚠ AREAS OF CONCERN</p>
              <div className="flex flex-wrap gap-2">
                {detectedFlags.slice(0, showAllFlags ? detectedFlags.length : 3).map((flag, i) => (
                  <span key={i} className="font-mono text-xs px-2 py-1 rounded border border-warn/30 text-warn bg-warn/10">
                    ⚠ {flag}
                  </span>
                ))}
                {detectedFlags.length > 3 && (
                  <button 
                    onClick={() => setShowAllFlags(!showAllFlags)}
                    className="font-mono text-xs px-2 py-1 rounded border border-muted/30 text-muted hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {showAllFlags ? 'Show less' : `+${detectedFlags.length - 3} more flags`}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
              <p className="font-mono text-xs text-accent leading-relaxed">✓ No concerns detected — all indicators passed</p>
            </div>
          )}
        </div>
      </div>

      {/* Verdict message */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: `${color}20` }}>
        <p className="text-sm leading-relaxed" style={{ color: verdictColor }}>
          {phishingProb >= 70
            ? `This URL has a high threat level (${phishingProb}%). ${detectedFlags.length > 0 ? `We detected ${detectedFlags.length} suspicious indicator(s). ` : ''}Avoid entering credentials or personal details.`
            : phishingProb >= 30
              ? `This URL is suspicious with a moderate threat level (${phishingProb}%). ${detectedFlags.length > 0 ? `We detected ${detectedFlags.length} suspicious indicator(s). ` : ''}Verify the site identity before sharing any sensitive information.`
              : `This URL has a low threat level (${phishingProb}%) and appears legitimate. ${detectedFlags.length > 0 ? `Note: ${detectedFlags.length} minor indicator(s) were flagged.` : 'No suspicious indicators were found.'}`
          }
        </p>
      </div>
    </div>
  );
}
