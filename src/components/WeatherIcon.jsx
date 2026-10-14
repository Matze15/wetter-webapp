import React, { useState } from 'react';
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Moon } from 'lucide-react';

export default function WeatherIcon({ symbol = '', condition = '', className = 'w-10 h-10', alt = '' }) {
  const [hasError, setHasError] = useState(false);

  // Normalize symbol name
  const cleanSymbol = symbol ? symbol.replace(/^.*\/([^\/?#]+).*$/, '$1') : 'wb____.svg';
  const iconSrc = `/api/weather-symbol/${cleanSymbol}`;

  // Fallback to crisp Lucide icon if network SVG fails or while loading
  const renderFallback = () => {
    const c = condition.toLowerCase();
    const s = cleanSymbol.toLowerCase();

    const isNight = s.includes('mo') || s.includes('mb') || c.includes('nacht') || c.includes('mond');

    if (c.includes('gewitter') || s.includes('g1') || s.includes('g2')) {
      return <CloudLightning className={`${className} text-amber-400 drop-shadow-md`} />;
    }
    if (c.includes('schnee') || s.includes('sn')) {
      return <Snowflake className={`${className} text-slate-400 drop-shadow-md`} />;
    }
    if (c.includes('regen') || s.includes('r1') || s.includes('r2') || s.includes('r3')) {
      return <CloudRain className={`${className} text-slate-500 dark:text-slate-300 drop-shadow-md`} />;
    }
    if (c.includes('nebel') || s.includes('nb')) {
      return <CloudFog className={`${className} text-slate-400 drop-shadow-md`} />;
    }
    if (isNight) {
      return <Moon className={`${className} text-slate-400 drop-shadow-md`} />;
    }
    if (c.includes('sonnig') || c.includes('heiter') || c.includes('klar') || s.includes('so')) {
      return <Sun className={`${className} text-amber-400 drop-shadow-lg`} />;
    }
    if (c.includes('leicht bewölkt') || c.includes('wechselnd bewölkt') || s.includes('wb')) {
      return <CloudSun className={`${className} text-amber-400/90 drop-shadow-md`} />;
    }
    return <Cloud className={`${className} text-slate-400 drop-shadow-md`} />;
  };

  if (hasError) {
    return renderFallback();
  }

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <img
        src={iconSrc}
        alt={alt || condition || 'WetterOnline Symbol'}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-transform duration-200"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
