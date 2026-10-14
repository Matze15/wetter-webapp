import React, { useState } from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import { Calendar, Droplets, Sun, ChevronDown } from 'lucide-react';

export default function FourteenDayTrend({ fourteenDayTrend = [], currentTemp = 15, isDarkMode = false }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [showAllDays, setShowAllDays] = useState(false);

  if (!fourteenDayTrend || fourteenDayTrend.length === 0) return null;

  // Calculate the absolute min and max across all days for scale
  const allMins = fourteenDayTrend.map(d => d.minTemp).filter(t => !isNaN(t));
  const allMaxs = fourteenDayTrend.map(d => d.maxTemp).filter(t => !isNaN(t));
  const overallMin = Math.min(...allMins, 0);
  const overallMax = Math.max(...allMaxs, 25);
  const totalRange = overallMax - overallMin || 1;

  // SVG Chart Geometry
  const chartHeight = 160;
  const paddingX = 24;
  const paddingTop = 28;
  const paddingBottom = 32;
  const chartWidth = Math.max(680, fourteenDayTrend.length * 48);

  const getX = (idx) => {
    const usableWidth = chartWidth - paddingX * 2;
    return paddingX + (idx / (fourteenDayTrend.length - 1)) * usableWidth;
  };

  const getY = (temp) => {
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    const ratio = (temp - overallMin) / totalRange;
    return chartHeight - paddingBottom - ratio * usableHeight;
  };

  // Build SVG smooth path points
  const maxPoints = fourteenDayTrend.map((d, i) => ({ x: getX(i), y: getY(d.maxTemp), temp: d.maxTemp }));
  const minPoints = fourteenDayTrend.map((d, i) => ({ x: getX(i), y: getY(d.minTemp), temp: d.minTemp }));

  const buildPath = (points) => {
    if (points.length === 0) return '';
    return points.reduce((acc, curr, i, arr) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const maxPathD = buildPath(maxPoints);
  const minPathD = buildPath(minPoints);

  const toggleExpand = (idx) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  const visibleDays = showAllDays ? fourteenDayTrend : fourteenDayTrend.slice(0, 7);

  return (
    <section className="apple-glass-card p-4 sm:p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="apple-caption">14-Tage-Wettertrend (16 Tage)</h3>
        </div>
      </div>

      {/* 1. Interactive Temperature Trend SVG Graph for all days */}
      <div className="pt-2 pb-1">
        <div className="overflow-x-auto apple-scrollbar pb-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-40 overflow-visible select-none"
            style={{ minWidth: `${chartWidth}px` }}
          >
            <defs>
              <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={isDarkMode ? 0.25 : 0.15} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={isDarkMode ? 0.18 : 0.10} />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Guide Lines */}
            <line x1={paddingX} y1={getY(20)} x2={chartWidth - paddingX} y2={getY(20)} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeDasharray="3 3" />
            <line x1={paddingX} y1={getY(15)} x2={chartWidth - paddingX} y2={getY(15)} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeDasharray="3 3" />
            <line x1={paddingX} y1={getY(10)} x2={chartWidth - paddingX} y2={getY(10)} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeDasharray="3 3" />
            <line x1={paddingX} y1={getY(5)} x2={chartWidth - paddingX} y2={getY(5)} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeDasharray="3 3" />

            {/* Max Temperature Curve & Area */}
            <path
              d={`${maxPathD} L ${maxPoints[maxPoints.length - 1].x} ${chartHeight - paddingBottom} L ${maxPoints[0].x} ${chartHeight - paddingBottom} Z`}
              fill="url(#maxGrad)"
            />
            <path
              d={maxPathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Min Temperature Curve */}
            <path
              d={minPathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Points & Labels for each day */}
            {fourteenDayTrend.map((d, i) => {
              const mx = maxPoints[i];
              const mn = minPoints[i];
              const isHovered = hoveredPointIndex === i;
              const isSelected = expandedIndex === i;

              return (
                <g
                  key={`pt-${i}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                  onClick={() => toggleExpand(i)}
                >
                  {/* Vertical hover line */}
                  {(isHovered || isSelected) && (
                    <line
                      x1={mx.x}
                      y1={paddingTop - 10}
                      x2={mx.x}
                      y2={chartHeight - paddingBottom + 5}
                      stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Max point circle & label */}
                  <circle
                    cx={mx.x}
                    cy={mx.y}
                    r={isHovered || isSelected ? 5 : 3.5}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={mx.x}
                    y={mx.y - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={isDarkMode ? "#ffffff" : "#111827"}
                  >
                    {d.maxTemp}°
                  </text>

                  {/* Min point circle & label */}
                  <circle
                    cx={mn.x}
                    cy={mn.y}
                    r={isHovered || isSelected ? 5 : 3.5}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={mn.x}
                    y={mn.y + 14}
                    textAnchor="middle"
                    fill={isDarkMode ? "rgba(255,255,255,0.7)" : "#4b5563"}
                    fontSize="10"
                    fontWeight="500"
                    fontFamily="system-ui"
                  >
                    {mn.temp}°
                  </text>

                  {/* Date label at bottom */}
                  <text
                    x={mx.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill={isSelected ? (isDarkMode ? '#ffffff' : '#111827') : (isDarkMode ? 'rgba(255,255,255,0.5)' : '#6b7280')}
                    fontSize="10"
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="system-ui"
                  >
                    {d.date.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Daily List (initially 7 days, expandable to all 14-16 days) - continuous list without per-row boxes */}
      <div className="divide-y divide-neutral-200/70 dark:divide-white/5 mt-3 pt-1 border-t border-neutral-200/80 dark:border-white/10">
        {visibleDays.map((day, idx) => {
          const isToday = idx === 0;
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={day.date || idx}
              className="transition-colors hover:bg-neutral-500/[0.03] dark:hover:bg-white/[0.02]"
            >
              {/* Row Header Button (no squish/shrink animation on tap) */}
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full py-3 px-1 sm:px-2 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                {/* Day Name & Date */}
                <div className="w-16 sm:w-24 flex-shrink-0">
                  <span className={`text-sm font-semibold block tracking-tight ${isToday ? 'font-bold text-neutral-950 dark:text-white' : 'text-neutral-900 dark:text-white/90'}`}>
                    {isToday ? 'Heute' : day.date.split(' ')[0]}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-white/50 block truncate">
                    {day.date.split(' ')[1] || day.date}
                  </span>
                </div>

                {/* Weather Icon & Rain % / Amount */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 w-24 sm:w-36 flex-shrink-0 min-w-0">
                  <WeatherIcon
                    symbol={day.symbol}
                    condition={day.condition}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
                  />
                  <div className="flex flex-col text-left truncate">
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-0.5 truncate">
                      <Droplets className="w-3 h-3 text-sky-500 flex-shrink-0" />
                      <span>{day.rainProb || '0%'}</span>
                    </span>
                    {day.rainAmount && (
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-sky-300 tracking-tight truncate">
                        {day.rainAmount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sunshine Hours */}
                <div className="hidden sm:flex items-center gap-1 w-16 text-xs text-amber-600 dark:text-amber-300/85 font-medium flex-shrink-0">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{day.sunshine}</span>
                </div>

                {/* Temperature Numbers in Orange & Green (No bar) */}
                <div className="flex items-center gap-2 tabular-nums font-semibold text-sm sm:text-base ml-auto pr-1">
                  <span className="text-orange-500 dark:text-orange-400 font-bold" title="Höchstwert">
                    {day.maxTemp}°
                  </span>
                  <span className="text-neutral-300 dark:text-white/20 font-light">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400" title="Tiefstwert">
                    {day.minTemp}°
                  </span>
                </div>

                {/* Accordion Toggle Icon with smooth rotation */}
                <div className="pl-1 text-neutral-400 dark:text-white/40 flex-shrink-0">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ease-out ${
                      isExpanded ? 'rotate-180 text-neutral-700 dark:text-white' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Ausfahr-Animation using CSS Grid template rows */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-3.5 pt-1 px-1 sm:px-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pt-2 border-t border-neutral-200/50 dark:border-white/5">
                      
                      {/* Left: Weather condition & Rain summary (No boxes, pure continuous typography) */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white capitalize">
                            {day.condition}
                          </span>
                          {day.rainAmount && (
                            <span className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400">
                              • {day.rainAmount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap">
                          <span>Regenwahrscheinlichkeit: <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{day.rainProb || '0%'}</strong></span>
                          {day.rainAmount ? (
                            <span>• Erwartet: <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{day.rainAmount}</strong></span>
                          ) : (
                            <span>• {parseInt(day.rainProb, 10) >= 40 ? 'Schauer zeitweise möglich' : 'Überwiegend trocken'}</span>
                          )}
                        </div>
                      </div>

                      {/* Right: The 4 blue rain timing bars (Generous spacing, NO enclosing grey boxes) */}
                      <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                        <div className="text-right hidden sm:block pr-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                            Niederschlag
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            Wann es regnet
                          </span>
                        </div>

                        <div className="flex items-end gap-3 sm:gap-4">
                          {day.rainBars && day.rainBars.length === 4 ? (
                            day.rainBars.map((bar, bIdx) => {
                              const barPct = bar.height >= 48 ? 100 : bar.height >= 32 ? 65 : bar.height >= 16 ? 35 : 0;
                              const shortName = bar.name === 'Vormittag' ? 'Vorm.' : bar.name === 'Nachmittag' ? 'Nachm.' : bar.name;
                              return (
                                <div key={bar.name || bIdx} className="flex flex-col items-center w-8 sm:w-9">
                                  <div className="w-2.5 sm:w-3 h-10 flex items-end justify-center mb-1.5">
                                    {barPct > 0 ? (
                                      <div
                                        className="w-full rounded-full bg-sky-500 dark:bg-sky-400 transition-all duration-300"
                                        style={{ height: `${Math.max(barPct, 20)}%` }}
                                        title={`${bar.name}: Regenaktivität (${barPct}%)`}
                                      />
                                    ) : (
                                      <div className="w-full h-1 rounded-full bg-neutral-300 dark:bg-white/20" title={`${bar.name}: Trocken`} />
                                    )}
                                  </div>
                                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                                    {shortName}
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            ['Vorm.', 'Nachm.', 'Abend', 'Nacht'].map(p => (
                              <div key={p} className="flex flex-col items-center w-8 sm:w-9">
                                <div className="w-2.5 sm:w-3 h-10 flex items-end justify-center mb-1.5">
                                  <div className="w-full h-1 rounded-full bg-neutral-300 dark:bg-white/20" />
                                </div>
                                <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">{p}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Button to toggle between 7 and 14-16 days (no squishy active:scale) */}
      {fourteenDayTrend.length > 7 && (
        <div className="pt-3 flex justify-center border-t border-neutral-200/80 dark:border-white/5 mt-2">
          <button
            onClick={() => setShowAllDays(prev => !prev)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-semibold text-neutral-800 dark:text-white/90 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-200 dark:border-white/10"
          >
            <span>{showAllDays ? 'Weniger Tage anzeigen (7 Tage)' : 'Alle 14–16 Tage anzeigen'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllDays ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </section>
  );
}
