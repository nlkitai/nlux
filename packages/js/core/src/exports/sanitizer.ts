export type SanitizerFunction = (html: string) => string;
let customSanitizer: SanitizerFunction | null = null;

export function setSanitizer(sanitizer: SanitizerFunction): void {
  if (typeof sanitizer === 'function') {
    customSanitizer = sanitizer;
  } else {
    console.error('Sanitizer must be a function');
  }
}

export function sanitizeHTML(html: string): string {
  if (customSanitizer) {
    return customSanitizer(html);
  } else {
    return html;
  }
}
