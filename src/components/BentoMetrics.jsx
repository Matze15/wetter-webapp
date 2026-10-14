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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        {/* Card 1: UV-Index */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              UV-Index
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">Tagesmaximum</span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">{uvVal}</span>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-300">{uvInfo.text}</span>
            </div>

            {/* UV Gauge Bar */}
            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 mt-3 relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.max(10, uvPercent)}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            {uvInfo.advice}
          </p>
        </div>

        {/* Card 2: Sonnenaufgang & Sonnenuntergang */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Sunset className="w-3.5 h-3.5 text-orange-500" />
              Sonne & Tageslicht
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">Dauer: {todayForecast?.sunshine || current.sunshineToday || '5 h'}</span>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-neutral-600 dark:text-white/70">Aufgang</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">{current.sunrise || '07:29'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-neutral-600 dark:text-white/70">Untergang</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">{current.sunset || '18:13'}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-2 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            Sonnenstunden heute: {current.sunshineToday || 'ca. 5 Stunden'}
          </p>
        </div>

        {/* Card 3: Wind & Böen */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Wind & Böen
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">Station</span>
          </div>

          <div>
            <div className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white truncate">
              {current.wind || '15 km/h'}
            </div>
            <div className="text-xs text-neutral-500 dark:text-white/60 mt-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-neutral-500 dark:text-white/70" />
              <span>Gleichmäßiger Luftstrom</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            Böen können zeitweise auffrischen.
          </p>
        </div>

        {/* Card 4: Luftfeuchtigkeit */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Luftfeuchtigkeit
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">Relativ</span>
          </div>

          <div>
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {current.humidity || '78%'}
            </span>
            <p className="text-xs text-neutral-600 dark:text-white/70 mt-1">
              {getHumidityDesc(humidityNum)}
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            Taupunkt liegt im kühlen Bereich.
          </p>
        </div>

        {/* Card 5: Luftdruck */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Luftdruck NN
            </span>
            {current.pressureTendency && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                {current.pressureTendency}
              </span>
            )}
          </div>

          <div>
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {current.pressure || '1020 hPa'}
            </span>
            <p className="text-xs text-neutral-600 dark:text-white/70 mt-1">
              Stabiles Hochdruckgebiet
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            Gleichbleibende Wetterlage erwartet.
          </p>
        </div>

        {/* Card 6: Sichtweite */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
              Sichtweite
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">Bodenstation</span>
          </div>

          <div>
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {current.visibility || '20 km'}
            </span>
            <p className="text-xs text-neutral-600 dark:text-white/70 mt-1">
              Klare Fernsicht
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            Keine Sichtbehinderungen durch Dunst.
          </p>
        </div>

        {/* Card 7: Niederschlag heute */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <Umbrella className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Niederschlag
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">24 Std.</span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                {todayForecast?.rainProb || '20%'}
              </span>
              <span className="text-xs font-medium text-neutral-500 dark:text-white/60">Wahrscheinlichkeit</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-white/70 mt-1">
              Menge: {current.rainInfo || '0.0 l/m²'}
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-white/60 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            Weitgehend trocken über den Tag verteilt.
          </p>
        </div>

        {/* Card 8: Gefühlte Temperatur & Komfort */}
        <div className="apple-glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-white/60 mb-2">
            <span className="apple-caption flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Gefühlte Temperatur
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-white/40">Bioklima</span>
          </div>

          <div>
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {Math.round(current.temp)}°
            </span>
            <p className="text-xs text-neutral-600 dark:text-white/70 mt-1">
              {current.temp > 20 ? 'Angenehm mild' : current.temp > 10 ? 'Mäßig kühl, leichte Jacke' : 'Kühl, wärmende Kleidung'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/50 mt-3 pt-2 border-t border-neutral-200/80 dark:border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ausgeglichene Bedingungen</span>
          </div>
        </div>

      </div>
    </section>
  );
}
