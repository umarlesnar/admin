export default function extractStringBetween([beg, end]: any) {
  const matcher = new RegExp(`${beg}(.*?)${end}`, "gm");
  const normalise = (str: string) => str.slice(beg.length, end.length * -1);
  return function (str: any) {
    return str.match(matcher).map(normalise);
  };
}
