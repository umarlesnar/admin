import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IApiKeysManagement extends Document {
  user_id: Schema.Types.ObjectId;
  business_id: Schema.Types.ObjectId;
  workspace_id: Schema.Types.ObjectId;
  user_type: Schema.Types.String;
  expired_date: Schema.Types.Date;
  api_key_type: Schema.Types.String;
  hashed_token: Schema.Types.String;
  name: Schema.Types.String;
  prefix: Schema.Types.String;
  rate_limit: Schema.Types.Mixed;
  scope: Schema.Types.Mixed;
  signature_token: Schema.Types.String;
  status: Schema.Types.String;
  usage_count: Schema.Types.Number;
  created_at: Date;
  is_visible: Schema.Types.Boolean;
  created_by: Schema.Types.ObjectId;
}

interface IApiKeyManagementMethods {}

type IApiKeyManagementModel = Model<IApiKeysManagement, IApiKeyManagementMethods>;

const ApiKeyManagementSchema = new Schema<
IApiKeysManagement,
IApiKeyManagementMethods,
IApiKeyManagementModel
>({
  user_id: { type: Schema.Types.ObjectId },
  business_id: { type: Schema.Types.ObjectId },
  workspace_id: { type: Schema.Types.ObjectId },
  user_type: { type: Schema.Types.String },
  expired_date: { type: Schema.Types.Date },
  hashed_token: { type: Schema.Types.String },
  api_key_type: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  prefix: { type: Schema.Types.String },
  rate_limit: { type: Schema.Types.Mixed },
  scope: { type: Schema.Types.Mixed },
  signature_token: { type: Schema.Types.String },
  status: { type: Schema.Types.String },
  usage_count: { type: Schema.Types.Number },
  created_at: { type: Schema.Types.Date, default: new Date() },
  is_visible: { type: Schema.Types.Boolean, default: true },
  created_by: { type: Schema.Types.ObjectId },

});

export default models.api_key_managements ||
  model<IApiKeyManagementModel>("api_key_managements", ApiKeyManagementSchema);
