import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, ArrowRight } from 'lucide-react';

export default function CitySearchModal({
  isOpen,
  onClose,
  onSelectCity,
  popularCities = []
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const cleanQ = query.trim().toLowerCase();

    // 1. Instant local results
    const localFiltered = popularCities.filter(c =>
      c.name.toLowerCase().includes(cleanQ) || c.slug.includes(cleanQ)
    );
    setResults(localFiltered);

    // 2. Query backend for WetterOnline search if needed
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const apiResults = await res.json();
          // Merge deduplicated
          const merged = [...localFiltered];
          for (const item of apiResults) {
            if (!merged.some(m => m.slug === item.slug)) {
              merged.push(item);
            }
          }
          setResults(merged);
        }
      } catch (err) {
        console.warn('Search request failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, popularCities]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        onSelectCity(results[selectedIndex].slug);
        onClose();
      } else if (query.trim()) {
        // Fallback: try searching slug directly
        const fallbackSlug = query.trim().toLowerCase().replace(/\s+/g, '-');
        onSelectCity(fallbackSlug);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start justify-center pt-0 sm:pt-24 p-0 sm:px-4 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl apple-glass rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl text-neutral-900 dark:text-white apple-bottom-sheet max-h-[88dvh] sm:max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-white/20 mx-auto mt-2.5 mb-1 sm:hidden flex-shrink-0" />

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0">
          <Search className="w-5 h-5 text-neutral-400 dark:text-white/50 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Stadt oder Ort suchen (z.B. Hamburg, München, Sylt)..."
            className="flex-1 bg-transparent text-base text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/40 focus:outline-none"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-neutral-500 dark:text-neutral-300 animate-spin flex-shrink-0" />
          )}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto apple-scrollbar p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((city, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={city.slug || idx}
                    onClick={() => {
                      onSelectCity(city.slug);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-neutral-200/80 dark:bg-white/15 border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white font-medium'
                        : 'text-neutral-700 dark:text-white/80 hover:bg-neutral-100/80 dark:hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-white/60'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white block">{city.name}</span>
                        <span className="text-xs text-neutral-400 dark:text-white/50">{city.state || 'Deutschland'}</span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-neutral-900 dark:text-white opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-neutral-400 dark:text-white/50 text-sm">
              <p>Keine passenden Vorschläge gefunden.</p>
              <button
                onClick={() => {
                  onSelectCity(query.trim().toLowerCase().replace(/\s+/g, '-'));
                  onClose();
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white dark:bg-white/15 dark:hover:bg-white/20 dark:text-white text-xs font-semibold active:scale-[0.98] transition-all"
              >
                Trotzdem suchen nach "{query.trim()}"
              </button>
            </div>
          ) : (
            <div className="p-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-white/40 block mb-2 px-2">
                Häufig gesuchte Städte
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {popularCities.slice(0, 9).map(c => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      onSelectCity(c.slug);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100/70 hover:bg-neutral-200/80 dark:bg-white/5 dark:hover:bg-white/15 text-xs text-neutral-700 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white transition-all text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-neutral-100/70 dark:bg-black/20 border-t border-black/5 dark:border-white/5 text-[11px] text-neutral-500 dark:text-white/40 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-3">
            <span>↑↓ Navigieren</span>
            <span>↵ Auswählen</span>
            <span>Esc Schließen</span>
          </div>
          <span className="text-[11px]">WetterOnline Ortsdaten</span>
          <button
            onClick={onClose}
            className="sm:hidden px-3 py-1 rounded-xl bg-neutral-200/80 dark:bg-white/10 text-neutral-800 dark:text-white text-xs font-semibold"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
}
