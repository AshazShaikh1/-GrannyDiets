export function formatOrderId(uuid: string): string {
  if (!uuid) return '';
  try {
    const hex = uuid.replace(/-/g, '');
    const numStr = BigInt('0x' + hex.substring(0, 16)).toString().padStart(17, '0');
    return `${numStr.substring(0, 3)}-${numStr.substring(3, 10)}-${numStr.substring(10, 17)}`;
  } catch (e) {
    return uuid;
  }
}
