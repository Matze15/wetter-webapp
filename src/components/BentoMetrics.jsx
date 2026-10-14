import React from 'react';
import {
  Sun,
  Sunset,
  Sunrise,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Umbrella,
  Compass,
  ShieldCheck
} from 'lucide-react';

export default function BentoMetrics({ current, todayForecast }) {
  if (!current) return null;

  // UV Index guidance
  const getUvInfo = (val) => {
    if (val <= 2) return { text: 'Niedrig', advice: 'Kein besonderer Schutz nötig.' };
    if (val <= 5) return { text: 'Mäßig', advice: 'Sonnencreme & Kopfbedeckung empfohlen.' };
    if (val <= 7) return { text: 'Hoch', advice: 'Schatten suchen & Sonnenbrille tragen.' };
    return { text: 'Sehr hoch', advice: 'Mittagssonne meiden!' };
  };

  const uvVal = current.uvIndex ?? 2;
  const uvInfo = getUvInfo(uvVal);
  const uvPercent = Math.min(100, (uvVal / 11) * 100);

  // Humidity description
  const humidityNum = parseInt(current.humidity, 10) || 75;
  const getHumidityDesc = (h) => {
    if (h < 40) return 'Trockene Luft';
    if (h <= 70) return 'Angenehmes Wohlfühlklima';
    return 'Erhöhte Luftfeuchte';
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        <h3 className="apple-caption">Wichtige Wettermetriken & Details</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: UV-Index */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              UV-Index
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 hidden xs:inline">Tagesmax</span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">{uvVal}</span>
              <span className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-300 truncate">{uvInfo.text}</span>
            </div>

            {/* UV Gauge Bar */}
            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 mt-2.5 sm:mt-3 relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.max(10, uvPercent)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5 line-clamp-2">
            {uvInfo.advice}
          </p>
        </div>

        {/* Card 2: Sonnenaufgang & Sonnenuntergang */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Sunset className="w-3.5 h-3.5 text-orange-500" />
              Sonne
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 truncate">{todayForecast?.sunshine || current.sunshineToday || '5 h'}</span>
          </div>

          <div className="space-y-1.5 sm:space-y-2 py-0.5 sm:py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70">Auf</span>
              </div>
              <span className="text-sm sm:text-lg font-semibold text-neutral-900 dark:text-white tracking-tight tabular-nums">{current.sunrise || '07:29'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sunset className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70">Unter</span>
              </div>
              <span className="text-sm sm:text-lg font-semibold text-neutral-900 dark:text-white tracking-tight tabular-nums">{current.sunset || '18:13'}</span>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2 pt-2 border-t border-neutral-200/80 dark:border-white/5 truncate">
            {current.sunshineToday || 'ca. 5 Std. Sonne'}
          </p>
        </div>

        {/* Card 3: Wind & Böen */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Wind
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 hidden xs:inline">Station</span>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white truncate">
              {current.wind || '15 km/h'}
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-1 flex items-center gap-1 truncate">
              <Compass className="w-3.5 h-3.5 text-neutral-500 dark:text-white/70 flex-shrink-0" />
              <span className="truncate">Gleichmäßig</span>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5 truncate">
            Böen zeitweise möglich
          </p>
        </div>

        {/* Card 4: Luftfeuchtigkeit */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Droplets className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Feuchte
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 hidden xs:inline">Relativ</span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {current.humidity || '78%'}
            </span>
            <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70 mt-1 truncate">
              {getHumidityDesc(humidityNum)}
            </p>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5 truncate">
            Taupunkt im kühlen Bereich
          </p>
        </div>

        {/* Card 5: Luftdruck */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Luftdruck
            </span>
            {current.pressureTendency && (
              <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-300 truncate">
                {current.pressureTendency}
              </span>
            )}
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {current.pressure || '1020 hPa'}
            </span>
            <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70 mt-1 truncate">
              Stabiles Hochdruckgebiet
            </p>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5 truncate">
            Gleichbleibend stabil
          </p>
        </div>

        {/* Card 6: Sichtweite */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Eye className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
              Sichtweite
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 hidden xs:inline">Boden</span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {current.visibility || '20 km'}
            </span>
            <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70 mt-1 truncate">
              Klare Fernsicht
            </p>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5 truncate">
            Keine Sichtbehinderungen
          </p>
        </div>

        {/* Card 7: Niederschlag heute */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Umbrella className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Regen
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 hidden xs:inline">24 Std.</span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                {todayForecast?.rainProb || '20%'}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-neutral-500 dark:text-white/60 truncate">Wahrsch.</span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70 mt-1 truncate">
              Menge: {current.rainInfo || '0.0 l/m²'}
            </p>
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-white/60 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5 truncate">
            Weitgehend trocken
          </p>
        </div>

        {/* Card 8: Gefühlte Temperatur & Komfort */}
        <div className="apple-glass-card p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5 text-[11px] sm:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Gefühlt
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-white/40 hidden xs:inline">Bioklima</span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {Math.round(current.temp)}°
            </span>
            <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/70 mt-1 truncate">
              {current.temp > 20 ? 'Angenehm mild' : current.temp > 10 ? 'Mäßig kühl' : 'Kühl'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 dark:text-white/50 mt-2.5 sm:mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="truncate">Ausgeglichen</span>
          </div>
        </div>

      </div>
    </section>
  );
}
