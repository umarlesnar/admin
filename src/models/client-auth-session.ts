import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IClientAuthSession extends Document {
  user_id: any;
  platform: String;
  ip_address: any;
  fcm_token: String;
  notification: any;
  meta: any;
  created_at: Date;
  updated_at: Date;
}

type ClientAuthSessionModel = Model<IClientAuthSession>;

const ClientAuthSessionSchema = new Schema<
  IClientAuthSession,
  ClientAuthSessionModel
>({
  user_id: { type: Schema.Types.ObjectId },
  platform: { type: String },
  ip_address: { type: String },
  fcm_token: { type: String },
  meta: { type: Schema.Types.Mixed },
  notification: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.client_auth_session ||
  model<IClientAuthSession>("client_auth_session", ClientAuthSessionSchema);
