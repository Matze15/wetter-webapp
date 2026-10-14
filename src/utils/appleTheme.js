/**
 * Apple Weather neutral atmospheric palettes
 * Designed for a calm, dignified, high-contrast and serious look.
 * Replaces saturated blues with serene off-white/silver-grey and neutral graphite.
 */

export function getWeatherTheme(condition = '', symbol = '', isDarkMode = false) {
  const c = condition.toLowerCase();
  const s = symbol.toLowerCase();

  // Dark Mode: Monochromatic neutral graphite/charcoal
  if (isDarkMode) {
    if (c.includes('sonnig') || c.includes('heiter') || s.includes('so')) {
      return {
        name: 'sunny-dark',
        accentColor: '#f59e0b',
        accentGlow: 'rgba(245, 158, 11, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.08)',
        ambientLight: 'rgba(245, 158, 11, 0.03)',
        atmosphere: 'linear-gradient(180deg, #141519 0%, #1c1d22 50%, #131417 100%)',
      };
    }
    return {
      name: 'neutral-dark',
      accentColor: '#e2e8f0',
      accentGlow: 'rgba(255, 255, 255, 0.03)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      ambientLight: 'rgba(255, 255, 255, 0.02)',
      atmosphere: 'linear-gradient(180deg, #121316 0%, #1a1b20 50%, #121316 100%)',
    };
  }

  // Light Mode (Default): Clean, neutral off-white / silver-grey / pearl
  if (c.includes('sonnig') || c.includes('heiter') || s.includes('so')) {
    return {
      name: 'sunny-light',
      accentColor: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.06)',
      cardBorder: 'rgba(0, 0, 0, 0.07)',
      ambientLight: 'rgba(245, 158, 11, 0.03)',
      atmosphere: 'linear-gradient(180deg, #fafbfa 0%, #f1f3f6 50%, #e6e9ee 100%)',
    };
  }

  if (c.includes('regen') || c.includes('schauer') || s.includes('r1') || s.includes('r2')) {
    return {
      name: 'rain-light',
      accentColor: '#64748b',
      accentGlow: 'rgba(100, 116, 139, 0.04)',
      cardBorder: 'rgba(0, 0, 0, 0.07)',
      ambientLight: 'rgba(100, 116, 139, 0.03)',
      atmosphere: 'linear-gradient(180deg, #f5f6f8 0%, #eaedf2 50%, #dfe2e8 100%)',
    };
  }

  // Default neutral light grey
  return {
    name: 'neutral-light',
    accentColor: '#64748b',
    accentGlow: 'rgba(0, 0, 0, 0.02)',
    cardBorder: 'rgba(0, 0, 0, 0.07)',
    ambientLight: 'rgba(0, 0, 0, 0.015)',
    atmosphere: 'linear-gradient(180deg, #f7f8fa 0%, #eceff4 50%, #e3e6ec 100%)',
  };
}
