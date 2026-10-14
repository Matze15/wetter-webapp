# Apple Design Guidelines & Craft Rules

Always adhere to Apple Design principles (Human Interface Guidelines & Emil Kowalski's Apple Design skill):

1. **Response — Kill Latency**: Instant feedback on pointer-down (`:active` scales, highlights). Continuous feedback during gestures.
2. **Materials & Depth**:
   - Proper use of translucent materials (`backdrop-filter: blur(20px) saturate(180%)`, semi-transparent backgrounds with subtle 1px light borders `rgba(255,255,255,0.15)` or `rgba(255,255,255,0.3)` to catch the light).
   - Real glassmorphism: layered hierarchy, dark/light contrast, beautiful shadows.
   - Dynamic weather atmospheric backdrops (like Apple Weather: deep blues, rain overlays, stormy grays, sunny golden hour gradients).
3. **Typography**:
   - System font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif`.
   - Optical sizing & tight tracking on large text (`letter-spacing: -0.02em` to `-0.03em` for large temperatures and headings), comfortable tracking on body.
   - Hierarchy driven by weight, size, and vibrant secondary/tertiary label colors (`rgba(255,255,255,0.7)`).
4. **Motion & Interaction**:
   - Critically damped spring physics (`damping: 1.0`, smooth, no robotic linear transitions).
   - Direct manipulation: scrubber/radar slider responds 1:1 with pointer, interactive day cards, smooth transitions.
   - Reversible animations, mirrored easings.
5. **No "AI Slop"**:
   - Avoid generic bootstrap/tailwind template clichés, neon purple glow buttons, generic cartoon cards, or disconnected cards.
   - Deliver high craft: precise alignment, meticulous spacing (8pt grid), beautiful iconography (Lucide or Apple SF-style crisp SVG icons), accurate weather glyphs, crisp radar map overlays, legible data tables/charts.
6. **Desktop & Responsive Focus**:
   - Desktop layout: multi-column dashboard with main weather hero, hourly timeline, 14-day forecast list, 4-day time-of-day breakdown (Morgen, Mittag, Abend, Nacht), interactive animated radar player, and metric bento grid (UV-Index, Wind, Niederschlag, Luftfeuchtigkeit, Luftdruck, Sicht, Sonnenaufgang/untergang).
   - Narrow browser window / tablet / mobile: gracefully collapses into clean vertical stream with scrollable hourly/daily segments, keeping all interactive controls thumb/mouse friendly.
