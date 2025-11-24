import axios from "axios";
import FormData from "form-data";

function fileNameFromUrl(url: string) {
  var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
  if (matches) {
    if (matches.length > 1) {
      return matches[1];
    }
  }

  return "";
}

export const uploadMediaFromUrl = async (url: string) => {
  const media_response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  let filename = fileNameFromUrl(url);
  const content_type = media_response.headers["content-type"];
  const content_length = Number(media_response.headers["content-length"]);
  //const;
  //const bufferObject = Buffer.from(media_response.data, "utf-8");
  const formData = new FormData();
  formData.append("file", media_response.data, {
    contentType: content_type,
    knownLength: content_length,
    filename: filename,
  });

  const response = await axios({
    method: "post",
    url: process.env.KWIC_INTERNAL_API_ENDPOINT + "/media",
    data: formData,
    headers: formData.getHeaders(),
  });

  return response.data;
};
