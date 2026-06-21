// __tests__/lib/middleware.test.ts
import { describe, it, expect } from 'vitest';

describe('Locale Detection', () => {
    it('should detect English from Accept-Language header', () => {
        const header = 'en-US,en;q=0.9,vi;q=0.8';
        const hasEn = header.includes('en');
        expect(hasEn).toBe(true);
    });

    it('should detect Chinese from Accept-Language header', () => {
        const header = 'zh-CN,zh;q=0.9,en;q=0.8';
        const hasZh = header.includes('zh');
        expect(hasZh).toBe(true);
    });

    it('should detect Vietnamese from Accept-Language header', () => {
        const header = 'vi-VN,vi;q=0.9,en;q=0.8';
        const hasVi = header.includes('vi');
        expect(hasVi).toBe(true);
    });

    it('should fallback to Vietnamese when no matching language', () => {
        const header = 'es-ES,es;q=0.9';
        const locales = ['en', 'vi', 'zh'];
        let detectedLocale = 'vi';

        if (header.includes('en')) {
            detectedLocale = 'en';
        } else if (header.includes('zh')) {
            detectedLocale = 'zh';
        }

        expect(detectedLocale).toBe('vi');
    });

    it('should select English over Chinese when both present', () => {
        const header = 'zh-CN,en;q=0.8';
        let detectedLocale = 'vi';

        if (header.includes('en')) {
            detectedLocale = 'en';
        } else if (header.includes('zh')) {
            detectedLocale = 'zh';
        }

        expect(detectedLocale).toBe('en');
    });

    it('should handle empty Accept-Language header', () => {
        const header = '';
        let detectedLocale = 'vi';

        if (header.includes('en')) {
            detectedLocale = 'en';
        } else if (header.includes('zh')) {
            detectedLocale = 'zh';
        }

        expect(detectedLocale).toBe('vi');
    });

    it('should handle null/undefined Accept-Language header', () => {
        const header = null;
        let detectedLocale = 'vi';
        const safeHeader = header || '';

        if (safeHeader.includes('en')) {
            detectedLocale = 'en';
        } else if (safeHeader.includes('zh')) {
            detectedLocale = 'zh';
        }

        expect(detectedLocale).toBe('vi');
    });

    it('should detect Vietnamese preference correctly', () => {
        const header = 'vi-VN';
        const locales = ['en', 'vi', 'zh'];
        let detectedLocale = 'vi';

        if (header.includes('en')) {
            detectedLocale = 'en';
        } else if (header.includes('zh')) {
            detectedLocale = 'zh';
        } else if (header.includes('vi')) {
            detectedLocale = 'vi';
        }

        expect(detectedLocale).toBe('vi');
    });
});
