export const JsonFileDownloader = (data: any, fileName: any) => {
  const flowData =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", flowData);
  downloadAnchorNode.setAttribute("download", fileName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
