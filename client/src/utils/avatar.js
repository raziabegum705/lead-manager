// Gives every person a stable, soft colour based on their name.
export const avatarStyle = (name = '?') => {
  const hue = [...name].reduce((h, c) => h + c.charCodeAt(0), 0) * 37 % 360;
  return { background: `hsl(${hue} 70% 92%)`, color: `hsl(${hue} 55% 28%)` };
};
