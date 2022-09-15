export function isObjectEmptyOrNull(obj: object | null): boolean {
    if (obj == null) return true;
    return Object.keys(obj).length === 0;
}