
export const getColorFromId = (id: string) => {
  const colors = ['#FABBD0','#ACDCF3', '#B2E0DC', '#ebba75', '#c7c9e8'];
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
