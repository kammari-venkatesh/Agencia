/**
 * Same Google Fonts CSS the site already loads (families, weights, display=swap).
 * Loaded from +Head as a stylesheet instead of a CSS @import so font CSS can
 * start in parallel with the hashed stylesheets instead of after them.
 * Do not subset, drop families, or change weights — that would change glyphs.
 */
export const GOOGLE_FONTS_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Unbounded:wght@200..900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800;12..96,900&family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,600;0,700;1,100;1,300;1,400&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Space+Grotesk:wght@700&family=Syne:wght@800&display=swap'
