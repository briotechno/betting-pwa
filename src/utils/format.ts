export const toTitleCase = (str: string) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatDate = (dateString: string | number | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return String(dateString);
  }
};
export const formatTime12h = (dateString: string | undefined) => {
  if (!dateString || dateString === 'Live') return dateString || '';
  try {
    let date = new Date(dateString.includes('T') ? dateString : dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-/ :]/);
      if (parts.length >= 3) {
        date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), parseInt(parts[3] || '0'), parseInt(parts[4] || '0'));
      }
    }
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  } catch (e) {
    return dateString;
  }
};
