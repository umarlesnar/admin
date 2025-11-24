import moment from "moment";

export const mongodbFilterParser = function (query: any, filter: any) {
  for (var propName in filter) {
    if (query[propName] === null || query[propName] === undefined) {
      delete query[propName];
    } else {
      if (propName == "timestamp") {
        
        filter.timestamp = {
          $gte: query.timestamp["start"],
          $lte: query.timestamp["end"],
        };
      } else if (propName == "createdAt") {
        filter[propName] = {
          $gte: new Date(moment(query.createdAt["start"]).toDate()),
          $lte: new Date(moment(query.createdAt["end"]).toDate()),
        };
      } else {
        filter[propName] = query[propName];
      }
    }
  }
  return clean(filter);
};

function clean(obj: any) {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] == ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
}
