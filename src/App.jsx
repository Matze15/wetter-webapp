import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import CurrentHero from './components/CurrentHero.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import FourDayForecast from './components/FourDayForecast.jsx';
import RadarCard from './components/RadarCard.jsx';
import FourteenDayTrend from './components/FourteenDayTrend.jsx';
import BentoMetrics from './components/BentoMetrics.jsx';
import CitySearchModal from './components/CitySearchModal.jsx';
import FavoritesModal from './components/FavoritesModal.jsx';
import { getWeatherTheme } from './utils/appleTheme.js';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [citySlug, setCitySlug] = useState(() => {
    return localStorage.getItem('wo_selected_city') || 'freiburg-im-breisgau';
  });
  const [weather, setWeather] = useState(null);
  const [popularCities, setPopularCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('wo_dark_mode') === 'true');

  // Synchronize dark mode class on HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('wo_dark_mode', isDarkMode);
  }, [isDarkMode]);

  // Favorites system (fully independent, customizable and persistent)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('wo_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['berlin', 'muenchen'];
  });

  // Recent cities history (only records actual user navigation)
  const [recentCities, setRecentCities] = useState(() => {
    try {
      const saved = localStorage.getItem('wo_recent_cities');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Fetch popular cities on mount
  useEffect(() => {
    fetch('/api/popular-cities')
      .then(res => res.json())
      .then(data => setPopularCities(data))
      .catch(err => console.warn('Could not load popular cities:', err));
  }, []);

  // Fetch weather data when citySlug changes
  const fetchWeather = async (slug = citySlug) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(slug)}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Fehler beim Laden (${res.status})`);
      }
      const data = await res.json();
      setWeather(data);
      localStorage.setItem('wo_selected_city', slug);

      // Add to recent cities
      if (data.city) {
        setRecentCities(prev => {
          const filtered = prev.filter(c => c.slug !== data.city.slug);
          const updated = [{ name: data.city.name, slug: data.city.slug }, ...filtered].slice(0, 8);
          localStorage.setItem('wo_recent_cities', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Wetterdaten konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(citySlug);
  }, [citySlug]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCity = (newSlug) => {
    setCitySlug(newSlug);
  };

  const handleToggleFavorite = (slug) => {
    if (!slug) return;
    setFavorites(prev => {
      const next = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug];
      localStorage.setItem('wo_favorites', JSON.stringify(next));
      return next;
    });

    // Ensure removed favorite doesn't linger in recent cities
    setRecentCities(prev => {
      const next = prev.filter(c => c.slug !== slug);
      localStorage.setItem('wo_recent_cities', JSON.stringify(next));
      return next;
    });
  };

  // Determine neutral background theme
  const theme = getWeatherTheme(
    weather?.current?.condition || '',
    weather?.current?.symbol || '',
    isDarkMode
  );

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'dark text-white' : 'text-neutral-900'} font-sans transition-colors duration-500 ease-out relative`}
      style={{
        background: theme.atmosphere
      }}
    >
      {/* Subtle ambient light gradient hint */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-all duration-700 opacity-40"
        style={{ background: theme.accentGlow }}
      />

      {/* Floating Apple-Design Header with Starred Favorites & Dark Mode Switch */}
      <Header
        currentCity={weather?.city || { name: citySlug, slug: citySlug }}
        onSelectCity={handleSelectCity}
        onOpenSearch={() => setIsSearchOpen(true)}
        onRefresh={() => fetchWeather(citySlug)}
        isLoading={isLoading}
        popularCities={popularCities}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onOpenEditFavorites={() => setIsFavoritesModalOpen(true)}
        recentCities={recentCities}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 relative z-10">
        
        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 backdrop-blur-xl flex items-center justify-between gap-3 text-sm text-rose-900 dark:text-rose-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchWeather(citySlug)}
              className="px-3 py-1.5 rounded-xl bg-rose-200/60 dark:bg-white/20 hover:bg-rose-200 dark:hover:bg-white/30 text-xs font-semibold active:scale-[0.98] transition-all"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weather && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 rounded-3xl bg-neutral-200/60 dark:bg-white/10" />
            <div className="h-32 rounded-3xl bg-neutral-200/60 dark:bg-white/10" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 rounded-3xl bg-neutral-200/60 dark:bg-white/10" />
              <div className="h-96 rounded-3xl bg-neutral-200/60 dark:bg-white/10" />
            </div>
          </div>
        )}

        {/* Weather Dashboard */}
        {weather && (
          <div className="space-y-6">
            
            {/* 1. Hero Weather Overview */}
            <CurrentHero
              weather={weather}
              isFavorite={favorites.includes(weather.city?.slug)}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 2. Stündliche Vorhersage (nächste 48 Stunden mit Tag-Trennern & Windgeschwindigkeit) */}
            {weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
              <HourlyForecast hourlyForecast={weather.hourlyForecast} />
            )}

            {/* 3. Full-Width Wetter- & Regenradar Card (above 4-day & 14-day forecasts) */}
            <RadarCard
              radar={weather.radar}
              cityName={weather.city?.name}
            />

            {/* 4. Grid: 4-Day Forecast & 14-Day Trend side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (6 cols): 4-Day Times of Day Forecast (WetterOnline 4-column layout) */}
              <div className="lg:col-span-6 space-y-6">
                <FourDayForecast fourDayForecast={weather.fourDayForecast} />
              </div>

              {/* Right Column (6 cols): 14-16 Day Forecast Trend with SVG Graph & Accordion */}
              <div className="lg:col-span-6 space-y-6">
                <FourteenDayTrend
                  fourteenDayTrend={weather.fourteenDayTrend}
                  currentTemp={weather.current?.temp}
                  isDarkMode={isDarkMode}
                />
              </div>

            </div>

            {/* 5. Bento Metrics Grid: UV-Index, Wind, Humidity, Pressure, Visibility, Sunrise */}
            <BentoMetrics
              current={weather.current}
              todayForecast={weather.fourDayForecast && weather.fourDayForecast[0]}
            />

          </div>
        )}

      </main>

      {/* Footer (Single dignified source credit) */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] mt-10 sm:mt-12 border-t border-black/10 dark:border-white/10 text-center text-xs text-neutral-500 dark:text-white/50 space-y-1">
        <p>Wetter-App • Handgefertigt nach Apple Human Interface Guidelines & Fluid Motion Principles</p>
        <p className="text-[11px] text-neutral-400 dark:text-white/40">
          Wetterdaten, 14-Tage-Trend, 4-Tage-Tageszeiten & Radar live gewebscraped von <a href="https://www.wetteronline.de" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-black dark:text-white/70 dark:hover:text-white underline underline-offset-2">WetterOnline.de</a>
        </p>
      </footer>

      {/* Spotlight City Search Modal (⌘K) */}
      <CitySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={handleSelectCity}
        popularCities={popularCities}
      />

      {/* Favorites Manager Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onSelectCity={handleSelectCity}
        popularCities={popularCities}
      />
    </div>
  );
}
