export const RemoveCurlybrace = (values: any) => {
  //   const text_match_expression = /{{\w*}}/g;
  //   return values.match(text_match_expression);
  const matches = values.match(/\{\{(.+?)\}\}/);
  if (matches.length >= 1) {
    return matches[1];
  } else {
    return null;
  }
};
