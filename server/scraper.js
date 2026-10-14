import * as cheerio from 'cheerio';

// In-memory cache with TTL (5 minutes)
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export const POPULAR_CITIES = [
  { name: 'Freiburg im Breisgau', slug: 'freiburg-im-breisgau', state: 'Baden-Württemberg', lat: 47.9990, lon: 7.8421, isDefaultFavorite: true },
  { name: 'Mönchberg', slug: 'moenchberg', state: 'Bayern', lat: 49.6997, lon: 9.2664, isDefaultFavorite: true },
  { name: 'Berlin', slug: 'berlin', state: 'Berlin', lat: 52.5164, lon: 13.3997 },
  { name: 'Hamburg', slug: 'hamburg', state: 'Hamburg', lat: 53.5511, lon: 9.9937 },
  { name: 'München', slug: 'muenchen', state: 'Bayern', lat: 48.1331, lon: 11.5664 },
  { name: 'Köln', slug: 'koeln', state: 'Nordrhein-Westfalen', lat: 50.9375, lon: 6.9603 },
  { name: 'Frankfurt am Main', slug: 'frankfurt-am-main', state: 'Hessen', lat: 50.1109, lon: 8.6821 },

  { name: 'Stuttgart', slug: 'stuttgart', state: 'Baden-Württemberg', lat: 48.7758, lon: 9.1829 },
  { name: 'Düsseldorf', slug: 'duesseldorf', state: 'Nordrhein-Westfalen', lat: 51.2277, lon: 6.7735 },
  { name: 'Leipzig', slug: 'leipzig', state: 'Sachsen', lat: 51.3397, lon: 12.3731 },
  { name: 'Dortmund', slug: 'dortmund', state: 'Nordrhein-Westfalen', lat: 51.5136, lon: 7.4653 },
  { name: 'Essen', slug: 'essen', state: 'Nordrhein-Westfalen', lat: 51.4556, lon: 7.0116 },
  { name: 'Bremen', slug: 'bremen', state: 'Bremen', lat: 53.0793, lon: 8.8017 },
  { name: 'Dresden', slug: 'dresden', state: 'Sachsen', lat: 51.0504, lon: 13.7373 },
  { name: 'Hannover', slug: 'hannover', state: 'Niedersachsen', lat: 52.3759, lon: 9.7320 },
  { name: 'Nürnberg', slug: 'nuernberg', state: 'Bayern', lat: 49.4521, lon: 11.0767 },
  { name: 'Duisburg', slug: 'duisburg', state: 'Nordrhein-Westfalen', lat: 51.4344, lon: 6.7623 },
  { name: 'Bochum', slug: 'bochum', state: 'Nordrhein-Westfalen', lat: 51.4818, lon: 7.2162 },
  { name: 'Wuppertal', slug: 'wuppertal', state: 'Nordrhein-Westfalen', lat: 51.2562, lon: 7.1508 },
  { name: 'Bielefeld', slug: 'bielefeld', state: 'Nordrhein-Westfalen', lat: 52.0302, lon: 8.5325 },
  { name: 'Bonn', slug: 'bonn', state: 'Nordrhein-Westfalen', lat: 50.7374, lon: 7.0982 },
  { name: 'Münster', slug: 'muenster', state: 'Nordrhein-Westfalen', lat: 51.9607, lon: 7.6261 },
  { name: 'Karlsruhe', slug: 'karlsruhe', state: 'Baden-Württemberg', lat: 49.0069, lon: 8.4037 },
  { name: 'Mannheim', slug: 'mannheim', state: 'Baden-Württemberg', lat: 49.4875, lon: 8.4660 },
  { name: 'Augsburg', slug: 'augsburg', state: 'Bayern', lat: 48.3705, lon: 10.8978 },
  { name: 'Wiesbaden', slug: 'wiesbaden', state: 'Hessen', lat: 50.0782, lon: 8.2398 },
  { name: 'Mönchengladbach', slug: 'moenchengladbach', state: 'Nordrhein-Westfalen', lat: 51.1805, lon: 6.4428 },
  { name: 'Gelsenkirchen', slug: 'gelsenkirchen', state: 'Nordrhein-Westfalen', lat: 51.5177, lon: 7.0857 },
  { name: 'Aachen', slug: 'aachen', state: 'Nordrhein-Westfalen', lat: 50.7753, lon: 6.0839 },
  { name: 'Braunschweig', slug: 'braunschweig', state: 'Niedersachsen', lat: 52.2689, lon: 10.5268 },
  { name: 'Kiel', slug: 'kiel', state: 'Schleswig-Holstein', lat: 54.3233, lon: 10.1228 },
  { name: 'Chemnitz', slug: 'chemnitz', state: 'Sachsen', lat: 50.8278, lon: 12.9214 },
  { name: 'Halle (Saale)', slug: 'halle-saale', state: 'Sachsen-Anhalt', lat: 51.4828, lon: 11.9698 },
  { name: 'Magdeburg', slug: 'magdeburg', state: 'Sachsen-Anhalt', lat: 52.1205, lon: 11.6276 },
  { name: 'Freiburg im Breisgau', slug: 'freiburg-im-breisgau', state: 'Baden-Württemberg', lat: 47.9990, lon: 7.8421 },
  { name: 'Krefeld', slug: 'krefeld', state: 'Nordrhein-Westfalen', lat: 51.3388, lon: 6.5853 },
  { name: 'Mainz', slug: 'mainz', state: 'Rheinland-Pfalz', lat: 49.9929, lon: 8.2473 },
  { name: 'Lübeck', slug: 'luebeck', state: 'Schleswig-Holstein', lat: 53.8655, lon: 10.6866 },
  { name: 'Erfurt', slug: 'erfurt', state: 'Thüringen', lat: 50.9848, lon: 11.0299 },
  { name: 'Rostock', slug: 'rostock', state: 'Mecklenburg-Vorpommern', lat: 54.0924, lon: 12.0991 },
  { name: 'Kassel', slug: 'kassel', state: 'Hessen', lat: 51.3127, lon: 9.4797 },
  { name: 'Wien', slug: 'wien', state: 'Österreich', lat: 48.2082, lon: 16.3738 },
  { name: 'Zürich', slug: 'zuerich', state: 'Schweiz', lat: 47.3769, lon: 8.5417 },
  { name: 'Salzburg', slug: 'salzburg', state: 'Österreich', lat: 47.8095, lon: 13.0550 },
  { name: 'Innsbruck', slug: 'innsbruck', state: 'Österreich', lat: 47.2692, lon: 11.4041 },
  { name: 'Bern', slug: 'bern', state: 'Schweiz', lat: 46.9480, lon: 7.4474 },
];

// Helper to parse wind direction and convert to compass degrees (pointing where wind blows to)
function parseWindDirection(windStr) {
  if (!windStr) return { dir: 'West', deg: 90 };
  const str = windStr.toUpperCase().trim();
  if (str.startsWith('NNO') || str.startsWith('NNE')) return { dir: 'Nord-Nordost', deg: 195 };
  if (str.startsWith('ONO') || str.startsWith('ENE')) return { dir: 'Ost-Nordost', deg: 245 };
  if (str.startsWith('OSO') || str.startsWith('ESE')) return { dir: 'Ost-Südost', deg: 295 };
  if (str.startsWith('SSO') || str.startsWith('SSE')) return { dir: 'Süd-Südost', deg: 345 };
  if (str.startsWith('SSW')) return { dir: 'Süd-Südwest', deg: 15 };
  if (str.startsWith('WSW')) return { dir: 'West-Südwest', deg: 65 };
  if (str.startsWith('WNW')) return { dir: 'West-Nordwest', deg: 115 };
  if (str.startsWith('NNW')) return { dir: 'Nord-Nordwest', deg: 165 };
  if (str.startsWith('NO') || str.startsWith('NE')) return { dir: 'Nordost', deg: 225 };
  if (str.startsWith('SO') || str.startsWith('SE')) return { dir: 'Südost', deg: 315 };
  if (str.startsWith('SW')) return { dir: 'Südwest', deg: 45 };
  if (str.startsWith('NW')) return { dir: 'Nordwest', deg: 135 };
  if (str.startsWith('N')) return { dir: 'Nord', deg: 180 };
  if (str.startsWith('O') || str.startsWith('E')) return { dir: 'Ost', deg: 270 };
  if (str.startsWith('S')) return { dir: 'Süd', deg: 0 };
  if (str.startsWith('W')) return { dir: 'West', deg: 90 };
  return { dir: 'West', deg: 90 };
}

async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
          ...(options.headers || {})
        }
      });
      if (res.ok) {
        return res;
      }
      if (res.status === 404) {
        return res;
      }
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}

/**
 * Searches for a city on WetterOnline or matches from dictionary
 */
export async function searchCities(query) {
  if (!query || typeof query !== 'string') return [];
  const qClean = query.trim().toLowerCase();

  // Check local list first for instant suggestions
  const localMatches = POPULAR_CITIES.filter(c =>
    c.name.toLowerCase().includes(qClean) || c.slug.includes(qClean)
  );

  // If we have strong local matches, return them immediately
  if (localMatches.length > 0) {
    return localMatches.slice(0, 8);
  }

  // Otherwise, query WetterOnline search endpoint
  try {
    const searchUrl = `https://www.wetteronline.de/search?searchstring=${encodeURIComponent(query.trim())}`;
    const res = await fetchWithRetry(searchUrl, { redirect: 'manual' });
    if (!res) return [];

    const html = await res.text();
    // Look for <meta http-equiv="refresh" content="0; URL=/wetter/slug">
    const metaMatch = html.match(/URL=\/wetter\/([a-zA-Z0-9_\-]+)/i);
    if (metaMatch && metaMatch[1]) {
      const slug = metaMatch[1];
      const name = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return [{ name, slug, state: 'Deutschland', lat: 51.1657, lon: 10.4515 }];
    }
  } catch (err) {
    console.warn('Search query error:', err.message);
  }

  return [];
}

/**
 * Main weather scraper for a given city slug
 */
export async function scrapeWeatherData(citySlug = 'berlin') {
  const normalizedSlug = citySlug.toLowerCase().replace(/[^a-z0-9\-]/g, '');
  const cacheKey = `weather_${normalizedSlug}`;

  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const baseUrl = 'https://www.wetteronline.de';
  const cityUrl = `${baseUrl}/wetter/${normalizedSlug}`;
  const trendUrl = `${baseUrl}/wettertrend/${normalizedSlug}`;
  const aktuellUrl = `${baseUrl}/wetter-aktuell/${normalizedSlug}`;
  const sunUrl = `${baseUrl}/wetter/${normalizedSlug}?mc=mc_travel&prefpar=sun`;

  // Fetch all endpoints concurrently
  const [cityRes, trendRes, aktuellRes, sunRes] = await Promise.all([
    fetchWithRetry(cityUrl).catch(() => null),
    fetchWithRetry(trendUrl).catch(() => null),
    fetchWithRetry(aktuellRes_Url => fetchWithRetry(aktuellUrl)).catch(() => null),
    fetchWithRetry(sunUrl).catch(() => null),
  ]);

  if (!cityRes || cityRes.status === 404) {
    throw new Error(`Stadt "${citySlug}" wurde auf WetterOnline nicht gefunden.`);
  }

  const [cityHtml, trendHtml, aktuellHtml, sunHtml] = await Promise.all([
    cityRes ? cityRes.text() : '',
    trendRes ? trendRes.text() : '',
    aktuellRes ? aktuellRes.text() : '',
    sunRes ? sunRes.text() : '',
  ]);

  const $city = cheerio.load(cityHtml);
  const $trend = trendHtml ? cheerio.load(trendHtml) : $city;
  const $aktuell = aktuellHtml ? cheerio.load(aktuellHtml) : $city;
  const $sun = sunHtml ? cheerio.load(sunHtml) : $city;

  // --- 1. Coordinates and Meta ---
  let lat = 52.5164;
  let lon = 13.3997;
  const geoMatch = cityHtml.match(/WO\.geo\.iid\s*=\s*\{([^}]+)\}/);
  if (geoMatch) {
    const latMatch = geoMatch[1].match(/lat:\s*["']([^"']+)["']/);
    const lonMatch = geoMatch[1].match(/lon:\s*["']([^"']+)["']/);
    if (latMatch) lat = parseFloat(latMatch[1]);
    if (lonMatch) lon = parseFloat(lonMatch[1]);
  }

  // Display Name
  let cityName = normalizedSlug.charAt(0).toUpperCase() + normalizedSlug.slice(1);
  const titleText = $city('title').text();
  const titleMatch = titleText.match(/Wetter\s+([^-\–]+)\s*[-–]/i);
  if (titleMatch) {
    cityName = titleMatch[1].trim();
  }

  // --- 2. Current Conditions ---
  const stationRow = $city('table tr').filter((i, el) => $city(el).find('a.stationname').length > 0).first();
  let stationName = stationRow.find('a.stationname').text().trim() || `${cityName}`;
  let stationTime = stationRow.find('span.date_time').text().trim() || '';

  let currentTemp = 15;
  let currentCondition = 'wolkig';
  let currentRainInfo = '';
  let currentWind = '';

  if (stationRow.length) {
    const tempText = stationRow.find('td.temp').text().trim().replace(/[^\d\.,\-]/g, '');
    if (tempText) currentTemp = parseFloat(tempText.replace(',', '.'));
    currentCondition = stationRow.find('td').eq(1).text().trim() || 'wolkig';
    currentRainInfo = stationRow.find('td').eq(2).text().trim() || '0.0 l/m²';
    currentWind = stationRow.find('td').eq(3).text().trim() || '';
  }
  const parsedCurrentWind = parseWindDirection(currentWind);

  // --- 3. Humidity, Visibility, Pressure from wetter-aktuell ---
  let humidity = '78%';
  let visibility = '20 km';
  let pressure = '1020 hPa';
  let pressureTrend = '+1.0 hPa';

  $aktuell('table').each((i, tbl) => {
    const text = $aktuell(tbl).text();
    if (text.includes('Relative Feuchte') && text.includes('Sichtweite')) {
      const firstDataRow = $aktuell(tbl).find('tr').eq(1);
      const cells = firstDataRow.find('td');
      if (cells.length >= 2) {
        humidity = cells.eq(0).text().trim();
        visibility = cells.eq(1).text().trim();
      }
    }
    if (text.includes('Luftdruck NN')) {
      const firstDataRow = $aktuell(tbl).find('tr').eq(1);
      const cells = firstDataRow.find('td');
      if (cells.length >= 2) {
        pressure = `${cells.eq(0).text().trim()} hPa`;
        pressureTrend = cells.eq(1).text().trim();
      }
    }
  });

  // --- 4. Sun & UV from Sun Page ---
  let sunrise = '07:30';
  let sunset = '18:15';
  let uvIndex = 2;
  let uvDescription = 'Niedrig';
  let sunshineHoursToday = '5 h';

  const sunText = $sun.text();
  const sunMatch = sunText.match(/Sonnenaufgang\s*(\d{2}:\d{2}),?\s*Sonnenuntergang\s*(\d{2}:\d{2})/);
  if (sunMatch) {
    sunrise = sunMatch[1];
    sunset = sunMatch[2];
  }

  const uvMatch = sunText.match(/(\d+)\s*\(([^)]+)\)\s*UV-Index/i);
  if (uvMatch) {
    uvIndex = parseInt(uvMatch[1], 10);
    uvDescription = uvMatch[2].trim();
  }

  const sunHoursMatch = sunText.match(/(\d+)\s*h\s*Sonnenstunden/i);
  if (sunHoursMatch) {
    sunshineHoursToday = `${sunHoursMatch[1]} h`;
  }

  // --- 5. Hourly Forecast (48 hours) from $city('wo-forecast-hour') ---
  const hourlyForecast = [];
  $city('wo-forecast-hour').each((i, el) => {
    const time = $city(el).find('wo-date-hour').text().trim();
    const tempText = $city(el).find('wo-temperature .temperature').text().trim();
    const temp = tempText ? parseInt(tempText, 10) : null;
    const symbolImg = $city(el).find('wo-weather-symbol img.symbol');
    const src = symbolImg.attr('src') || '';
    const symMatch = src.match(/assets\/weather-symbol\/([a-zA-Z0-9_\-]+\.svg)/);
    const cleanSymbol = symMatch ? symMatch[1] : (src.includes('.svg') ? src.split('?')[0].split('/').pop() : 'wb____.svg');
    const condition = symbolImg.attr('alt') || 'wolkig';

    const arrow = $city(el).find('wo-weather-wind-arrow img');
    const arrowSrc = arrow.attr('src') || '';
    const windDir = arrow.attr('alt') || 'aus West';
    const windStyle = arrow.attr('style') || '';
    const rotMatch = windStyle.match(/rotate\((\d+)deg\)/);
    // Rotate by 180deg to point in direction wind is blowing towards
    const windDeg = rotMatch ? (parseInt(rotMatch[1], 10) + 180) % 360 : 90;

    let windSpeed = 18;
    if (arrowSrc.includes('strong')) windSpeed = 28;
    else if (arrowSrc.includes('medium')) windSpeed = 19;
    else if (arrowSrc.includes('weak')) windSpeed = 11;

    const rain = $city(el).find('wo-weather-characteristics-precipitation .description').text().trim();

    if (time && temp !== null) {
      hourlyForecast.push({
        index: i,
        time,
        temp,
        symbol: cleanSymbol,
        condition,
        windDir,
        windDeg,
        windSpeed,
        rainProb: rain || '0%'
      });
    }
  });

  // --- 6. 4-Day Forecast with Times of Day (Vormittag, Nachmittag, Abend, Nacht) ---
  const fourDayForecast = [];
  $trend('wo-medium-term-weather').each((i, el) => {
    const max = $trend(el).find('.max .temperature').text().trim().replace(/[^\d\-]/g, '');
    const min = $trend(el).find('.min .temperature').text().trim().replace(/[^\d\-]/g, '');
    const sun = $trend(el).find('wo-weather-characteristics-sun .description').text().trim();
    const rain = $trend(el).find('wo-weather-characteristics-precipitation .description').text().trim();

    // Date headers
    const dayHeader = $trend('table.table thead th').eq(i);
    const dayLabel = dayHeader.find('wo-date-day-of-week').text().trim() || (i === 0 ? 'Heute' : i === 1 ? 'Morgen' : `Tag ${i + 1}`);
    const dateFormatted = dayHeader.find('wo-date-day-and-month span[aria-hidden="true"]').text().trim();

    const parts = [];
    $trend(el).find('.day-part').each((j, pel) => {
      const partName = $trend(pel).find('wo-date-day-interval').text().trim();
      const symbolImg = $trend(pel).find('wo-weather-symbol img.symbol');
      let symbol = symbolImg.attr('src') || '';
      const symMatch = symbol.match(/assets\/weather-symbol\/([a-zA-Z0-9_\-]+\.svg)/);
      const cleanSymbol = symMatch ? symMatch[1] : (symbol.includes('.svg') ? symbol.split('?')[0].split('/').pop() : 'wb____.svg');
      const condition = symbolImg.attr('alt') || 'bewölkt';

      const arrow = $trend(pel).find('wo-weather-wind-arrow img');
      const windDir = arrow.attr('alt') || 'aus West';
      const windStyle = arrow.attr('style') || '';
      const rotMatch = windStyle.match(/rotate\((\d+)deg\)/);
      // Wind direction rotated 180° to point where wind is blowing to
      const windDeg = rotMatch ? (parseInt(rotMatch[1], 10) + 180) % 360 : 90;

      parts.push({
        name: partName || ['Vormittag', 'Nachmittag', 'Abend', 'Nacht'][j],
        symbol: cleanSymbol,
        condition,
        windDir,
        windDeg
      });
    });

    fourDayForecast.push({
      dayIndex: i,
      dayLabel: dayLabel || (i === 0 ? 'Heute' : i === 1 ? 'Morgen' : `Tag ${i + 1}`),
      dateStr: dateFormatted || '',
      maxTemp: max ? parseInt(max, 10) : 16,
      minTemp: min ? parseInt(min, 10) : 10,
      sunshine: sun || '4 h',
      rainProb: rain || '20 %',
      parts
    });
  });


  // Current symbol taken from first day part or trend
  let currentSymbol = 'wb____.svg';
  if (fourDayForecast[0]?.parts[0]?.symbol) {
    currentSymbol = fourDayForecast[0].parts[0].symbol;
  }

  // --- 6. 14-16 Day Forecast Trend ---
  const fourteenDayTrend = [];
  const longTable = $trend('table.long-term-table');
  if (longTable.length) {
    const dates = [];
    longTable.find('tr').eq(1).find('th').each((i, th) => {
      const txt = $trend(th).text().trim();
      if (txt) dates.push(txt);
    });

    // Symbols & conditions
    const weatherRow = longTable.find('tr').eq(3);
    const symbols = [];
    weatherRow.find('td').each((i, td) => {
      const img = $trend(td).find('img.symbol');
      const src = img.attr('src') || '';
      const symMatch = src.match(/assets\/weather-symbol\/([a-zA-Z0-9_\-]+\.svg)/);
      const cleanSym = symMatch ? symMatch[1] : (src.includes('.svg') ? src.split('?')[0].split('/').pop() : 'wb____.svg');
      symbols.push({
        symbol: cleanSym,
        condition: img.attr('alt') || $trend(td).text().trim() || 'wolkig'
      });
    });

    // Sun hours
    const sunRow = longTable.find('tr').eq(5);
    const suns = [];
    sunRow.find('td').each((i, td) => {
      suns.push($trend(td).text().trim());
    });

    // Temperatures from SVG text nodes
    const tempTexts = [];
    longTable.find('wo-long-term-temperature-svg text').each((i, t) => {
      tempTexts.push($trend(t).text().trim().replace(/[^\d\-]/g, ''));
    });

    // Precipitation parsing from SVG (accurately associating prob %, rain amount L/qm, and 4 day-part bars)
    const precipSvg = longTable.find('wo-long-term-precipitation-svg svg');
    const colWidth = 74;
    const rainData = [];

    for (let i = 0; i < dates.length; i++) {
      const colStart = i * colWidth;
      const colEnd = (i + 1) * colWidth;

      let prob = '';
      let amount = null;

      if (precipSvg.length) {
        precipSvg.find('text').each((_, el) => {
          const x = parseFloat($trend(el).attr('x'));
          if (x >= colStart && x < colEnd) {
            const txt = $trend(el).text().trim();
            if (txt.includes('%')) prob = txt;
            else if (txt.includes('L/qm') || txt.includes('l/m')) amount = txt;
          }
        });

        // 4 bars per day representing Vormittag, Nachmittag, Abend, Nacht
        const barSlots = [0, 0, 0, 0];
        precipSvg.find('rect').each((_, el) => {
          const rx = parseFloat($trend(el).attr('x'));
          const rh = parseFloat($trend(el).attr('height')) || 0;
          if (rx >= colStart && rx < colEnd) {
            const offsetInCol = rx - colStart;
            const slotIdx = Math.min(3, Math.floor(offsetInCol / 18.5));
            barSlots[slotIdx] = rh;
          }
        });

        const barLabels = ['Vormittag', 'Nachmittag', 'Abend', 'Nacht'];
        const bars = barLabels.map((name, bIdx) => ({
          name,
          height: barSlots[bIdx],
          hasRain: barSlots[bIdx] > 0
        }));

        rainData.push({
          prob: prob || (amount ? '80%' : '10%'),
          amount,
          bars
        });
      } else {
        rainData.push({
          prob: '20%',
          amount: null,
          bars: []
        });
      }
    }

    // Wind
    const windRow = longTable.find('tr').eq(9);
    const winds = [];
    windRow.find('td').each((i, td) => {
      const txt = $trend(td).text().replace(/\s+/g, ' ').trim();
      winds.push(txt);
    });

    for (let i = 0; i < dates.length; i++) {
      // SVG text elements have 4 items per day [max, max, min, min]
      const maxVal = tempTexts[i * 4] ? parseInt(tempTexts[i * 4], 10) : (fourDayForecast[i]?.maxTemp ?? 15);
      const minVal = tempTexts[i * 4 + 2] ? parseInt(tempTexts[i * 4 + 2], 10) : (fourDayForecast[i]?.minTemp ?? 8);

      fourteenDayTrend.push({
        index: i,
        date: dates[i],
        symbol: symbols[i]?.symbol || 'wb____.svg',
        condition: symbols[i]?.condition || 'wolkig',
        sunshine: suns[i] || '3 h',
        maxTemp: maxVal,
        minTemp: minVal,
        rainProb: rainData[i]?.prob || '20%',
        rainAmount: rainData[i]?.amount || null,
        rainBars: rainData[i]?.bars || [],
        wind: winds[i] || 'W 3'
      });
    }
  }

  // --- 7. Radar Configuration & URLs ---
  const radarData = {
    lat: lat.toFixed(3),
    lon: lon.toFixed(3),
    zoom: 8,
    wetterRadarUrl: `https://radar.wo-cloud.com/desktop/wr/interactive?wrx=${lat.toFixed(3)},${lon.toFixed(3)}&wrm=8`,
    regenRadarUrl: `https://radar.wo-cloud.com/desktop/rr/interactive?wrx=${lat.toFixed(3)},${lon.toFixed(3)}&wrm=8`,
    windRadarUrl: `https://radar.wo-cloud.com/desktop/wr/interactive?wrx=${lat.toFixed(3)},${lon.toFixed(3)}&wrm=8&layer=wind`,
    blitzRadarUrl: `https://radar.wo-cloud.com/desktop/wr/interactive?wrx=${lat.toFixed(3)},${lon.toFixed(3)}&wrm=8&layer=lightning`,
    tempRadarUrl: `https://radar.wo-cloud.com/desktop/wr/interactive?wrx=${lat.toFixed(3)},${lon.toFixed(3)}&wrm=8&layer=temperature`,
    compactUrl: `https://radar.wo-cloud.com/desktop/embedded?wrx=${lat.toFixed(3)},${lon.toFixed(3)}&wrm=8&wry=${lat.toFixed(3)},${lon.toFixed(3)}`
  };

  const payload = {
    city: {
      name: cityName,
      slug: normalizedSlug,
      lat,
      lon
    },
    current: {
      temp: currentTemp,
      condition: currentCondition,
      symbol: currentSymbol,
      stationName,
      stationTime,
      rainInfo: currentRainInfo,
      wind: currentWind,
      windDir: parsedCurrentWind.dir,
      windDeg: parsedCurrentWind.deg,
      humidity,
      visibility,
      pressure,
      pressureTendency: pressureTrend,
      uvIndex,
      uvDescription,
      sunrise,
      sunset,
      sunshineToday: sunshineHoursToday,
      maxTemp: fourDayForecast[0]?.maxTemp ?? currentTemp + 2,
      minTemp: fourDayForecast[0]?.minTemp ?? currentTemp - 4
    },
    hourlyForecast,
    fourDayForecast,
    fourteenDayTrend,
    radar: radarData,
    scrapedAt: new Date().toISOString()
  };

  // Cache response
  cache.set(cacheKey, { timestamp: Date.now(), data: payload });

  return payload;
}
