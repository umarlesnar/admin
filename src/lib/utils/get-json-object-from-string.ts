export const getJSONObjectFromString = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};
