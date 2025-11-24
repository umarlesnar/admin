import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

interface IAPIRequestClientLog extends Document {
  business_id: ObjectId;
  request_body: String;
  request_query: String;
  response_body: String;
  status: String;
  created_at: Date;
  expired_at: Date;
}

type ApiRequestClientLogModel = Model<IAPIRequestClientLog>;

const ApiClientRequestModelSchema = new Schema<
  IAPIRequestClientLog,
  ApiRequestClientLogModel
>({
  business_id: { type: Schema.Types.ObjectId },
  request_body: { type: Schema.Types.Mixed },
  request_query: { type: Schema.Types.Mixed },
  response_body: { type: Schema.Types.Mixed },
  status: { type: String },
  created_at: { type: Schema.Types.Date, default: new Date() },
  expired_at: { type: Date },
});

export default models.api_client_request ||
  model<IAPIRequestClientLog>(
    "api_client_request",
    ApiClientRequestModelSchema
  );
