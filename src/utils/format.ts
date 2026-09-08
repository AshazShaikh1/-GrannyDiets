export function formatOrderId(id: string | number): string {
  if (!id) return '';
  const idStr = id.toString();
  
  // If it's a UUID, format it
  if (idStr.includes('-')) {
    try {
      const hex = idStr.replace(/-/g, '');
      const numStr = BigInt('0x' + hex.substring(0, 16)).toString().padStart(17, '0');
      return `${numStr.substring(0, 3)}-${numStr.substring(3, 10)}-${numStr.substring(10, 17)}`;
    } catch (e) {
      return idStr;
    }
  }
  
  // Otherwise, it's our new BIGINT format
  return idStr;
}
