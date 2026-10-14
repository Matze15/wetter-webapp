import React, { useState, useEffect } from 'react';
import { Star, Trash2, Plus, X, MapPin, Search, Loader2 } from 'lucide-react';

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites = [],
  onToggleFavorite,
  onSelectCity,
  popularCities = []
}) {
  const [newCityQuery, setNewCityQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset input when opening
  useEffect(() => {
    if (isOpen) {
      setNewCityQuery('');
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  // Live debounced search for ANY city
  useEffect(() => {
    if (!newCityQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const cleanQ = newCityQuery.trim().toLowerCase();
    const localMatches = popularCities.filter(c =>
      c.name.toLowerCase().includes(cleanQ) || c.slug.includes(cleanQ)
    );
    setSearchResults(localMatches);

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(newCityQuery.trim())}`);
        if (res.ok) {
          const apiResults = await res.json();
          const merged = [...localMatches];
          for (const item of apiResults) {
            if (!merged.some(m => m.slug === item.slug)) {
              merged.push(item);
            }
          }
          setSearchResults(merged);
        }
      } catch (err) {
        console.warn('City search in favorites modal failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [newCityQuery, popularCities]);

  if (!isOpen) return null;

  // Resolve favorite items with name and state
  const favoriteItems = favorites.map(slug => {
    const found = popularCities.find(c => c.slug === slug);
    return {
      slug,
      name: found ? found.name : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      state: found ? found.state : 'Gespeichert'
    };
  });

  // Candidate items to display in the add section
  const displayCandidates = newCityQuery.trim()
    ? searchResults
    : popularCities.filter(c => !favorites.includes(c.slug));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md apple-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 text-neutral-900 dark:text-white apple-bottom-sheet max-h-[88dvh] sm:max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-white/20 mx-auto mb-2 sm:hidden flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/10 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight">Favoriten verwalten</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Favorites List */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/50 block">
              Deine Favoriten ({favoriteItems.length})
            </span>
          </div>

          {favoriteItems.length === 0 ? (
            <div className="text-xs text-neutral-400 dark:text-white/40 py-6 text-center bg-neutral-100/70 dark:bg-white/5 rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 px-4">
              Keine Favoriten vorhanden. Suche unten nach beliebigen Städten, um sie hinzuzufügen.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto apple-scrollbar pr-1">
              {favoriteItems.map(item => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-100/70 dark:bg-white/10 border border-neutral-200/60 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/15 transition-all group"
                >
                  <button
                    onClick={() => {
                      onSelectCity(item.slug);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 text-left flex-1 truncate"
                    title={`Zu ${item.name} wechseln`}
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{item.name}</span>
                    <span className="text-xs text-neutral-400 dark:text-white/40 truncate">({item.state})</span>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(item.slug)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                    title={`${item.name} aus Favoriten entfernen`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Add New Favorites */}
        <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/50 block mb-2">
            Beliebige Stadt suchen & merken
          </span>

          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={newCityQuery}
              onChange={e => setNewCityQuery(e.target.value)}
              placeholder="Stadt suchen (z.B. Freiburg, Mönchengladbach, Hamburg)..."
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/40 focus:outline-none focus:border-neutral-900 dark:focus:border-white/40"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-300 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="max-h-40 overflow-y-auto apple-scrollbar space-y-1 pr-1">
            {displayCandidates.slice(0, 8).map(city => {
              const isFav = favorites.includes(city.slug);
              return (
                <div
                  key={`candidate-${city.slug}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-neutral-100/60 dark:bg-white/5 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-white/80 truncate pr-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-400 flex-shrink-0" />
                    <span className="font-medium text-neutral-900 dark:text-white truncate">{city.name}</span>
                    {city.state && <span className="text-neutral-400 dark:text-white/40 text-[11px] truncate">({city.state})</span>}
                  </div>

                  <button
                    onClick={() => onToggleFavorite(city.slug)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex-shrink-0 ${
                      isFav
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30 dark:border-rose-500/30'
                        : 'bg-neutral-900 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white dark:hover:text-black dark:text-white/80'
                    }`}
                  >
                    {isFav ? (
                      <>
                        <Trash2 className="w-3 h-3" />
                        <span>Entfernen</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Merken</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-black/10 dark:border-white/10 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 sm:py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-xs font-semibold text-white dark:bg-white/20 dark:hover:bg-white/30 dark:text-white active:scale-[0.98] transition-all text-center"
          >
            Fertig
          </button>
        </div>

      </div>
    </div>
  );
}
