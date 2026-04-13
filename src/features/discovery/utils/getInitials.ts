export const getInitials = (name: string): string => {
  if (!name || name.trim().length === 0) return '';
  
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '';
  
  return parts
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};
