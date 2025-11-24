export const getFormattedString = (value: string) => {
  if (value) {
    return value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\w/g, function (match: any) {
        return match.toUpperCase();
      });
  } else {
    return null;
  }
};
