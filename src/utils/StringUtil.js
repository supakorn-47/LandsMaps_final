// export const StringToStar = (text) => {
//   let textStart = "";
//   textStart = text?.substring(0, 1);
//   for (let index = 1; index < text.length; index++) {
//     textStart += "*";
//   }
//   textStart += text?.substring(text?.length, text?.length);
//   return textStart;
// };
export const StringToStar = (text) => {
  if (!text) return "";
  const firstChar = text[0];
  const stars = "*".repeat(text.length - 1);
  return firstChar + stars;
};
