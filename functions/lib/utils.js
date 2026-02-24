// functions/lib/utils.js
// 共用工具函数

/**
 * HTML 特殊字符转义
 */
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, c => ESCAPE_MAP[c]);
}

/**
 * URL 安全化：只允许 http/https 协议
 */
export function sanitizeUrl(url) {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return '';
        }
        return parsed.href;
    } catch {
        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        return '';
    }
}

/**
 * 排序值归一化
 */
export function normalizeSortOrder(val) {
    const num = Number(val);
    return Number.isFinite(num) ? num : 9999;
}

/**
 * 构建 style 属性字符串
 * @returns {string} 如 'style="font-size: 16px; color: red;"' 或空字符串
 */
export function getStyleStr(size, color, font) {
    let s = '';
    if (size) s += `font-size: ${size}px;`;
    if (color) s += `color: ${color} !important;`;
    if (font) s += `font-family: ${font} !important;`;
    return s ? `style="${s}"` : '';
}
