import React from 'react';
import { Search, MapPin, RefreshCw, Star, CloudSun, SlidersHorizontal, Plus, Sun, Moon } from 'lucide-react';

export default function Header({
  currentCity,
  onSelectCity,
  onOpenSearch,
  onRefresh,
  isLoading,
  popularCities = [],
  favorites = [],
  onToggleFavorite,
  onOpenEditFavorites,
  isDarkMode,
  onToggleDarkMode
}) {
  // Combine favorites
  const favoriteCitiesList = favorites.map(slug => {
    const found = popularCities.find(c => c.slug === slug);
    if (found) return found;
    return {
      name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug
    };
  });

  const isCurrentFavorite = favorites.includes(currentCity?.slug);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="apple-glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-md">
          
          {/* Left: Brand Icon & App Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white/10 text-white p-[1px] shadow-sm flex items-center justify-center">
                <CloudSun className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white leading-none">
                  Wetter
                </h1>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-neutral-200 dark:bg-white/15 hidden sm:block" />

            {/* Current City indicator with Star button */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 text-xs font-medium text-neutral-800 dark:text-white/90">
              <MapPin className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
              <span className="font-semibold">{currentCity?.name || 'Berlin'}</span>
              <button
                onClick={() => onToggleFavorite(currentCity?.slug)}
                className="ml-1 p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-white/15 transition-colors"
                title={isCurrentFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
              >
                <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'text-amber-500 fill-amber-500' : 'text-neutral-400 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/80'}`} />
              </button>
            </div>
          </div>

          {/* Center: Starred Favorites Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-neutral-100/90 dark:bg-black/30 p-1 rounded-xl border border-neutral-200 dark:border-white/5 max-w-xl overflow-x-auto no-scrollbar">
            {favoriteCitiesList.length === 0 ? (
              <button
                onClick={onOpenEditFavorites}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-200/70 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                <Plus className="w-3 h-3 text-amber-500" />
                <span>Favoriten verwalten</span>
              </button>
            ) : (
              <>
                {favoriteCitiesList.map(city => {
                  const isActive = city.slug === currentCity?.slug;
                  return (
                    <button
                      key={`fav-${city.slug}`}
                      onClick={() => onSelectCity(city.slug)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.98] ${
                        isActive
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm font-semibold'
                          : 'text-neutral-700 dark:text-white/80 hover:bg-neutral-200/70 dark:hover:bg-white/10'
                      }`}
                      title={`${city.name} (Favorit)`}
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                      <span>{city.name}</span>
                    </button>
                  );
                })}

                {/* Edit / Manage Favorites Button */}
                {onOpenEditFavorites && (
                  <button
                    onClick={onOpenEditFavorites}
                    className="p-1.5 rounded-lg text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-white/10 transition-colors ml-0.5 active:scale-[0.98]"
                    title="Favoriten bearbeiten & verwalten"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right: Search bar, Theme Switcher & Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 active:scale-[0.98] border border-neutral-200 dark:border-white/10 text-xs text-neutral-700 dark:text-white/75 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm"
              title="Ort suchen (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500 dark:text-white/60" />
              <span className="hidden sm:inline">Ort suchen...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-white/50">
                ⌘K
              </kbd>
            </button>

            {/* Dark/Light Appearance Switcher */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 active:scale-[0.98] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white/80 transition-all shadow-sm"
                title={isDarkMode ? 'Heller Modus (Weiß/Grau)' : 'Dunkler Modus (Graphit)'}
              >
                {isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-neutral-600" />
                )}
              </button>
            )}

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 active:scale-[0.98] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-50 shadow-sm"
              title="Wetterdaten aktualisieren"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-neutral-900 dark:text-white' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
