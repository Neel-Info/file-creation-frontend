export const transformText = (text: string): string => {
  return text.split("_").join(" ").toUpperCase();
};
