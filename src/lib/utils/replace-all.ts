export default function replaceAll(
  string: string,
  search: string,
  replace: string
) {
  const arr = string.split(search);

  if (arr.length < 3) {
    return string.split(search).join(replace);
  } else {
    const first = arr.slice(0, 2);
    const second = arr.slice(2);

    const final = first.join(replace) + search + second.join(search);

    return final;
  }
}
