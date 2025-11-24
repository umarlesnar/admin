import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

export interface Granular_scopes {
  scope: string;
  target_ids: Schema.Types.Mixed;
}

interface IEmbeddedSingup extends Document {
  business_id: ObjectId;
  user_account_id: ObjectId;
  app_id: string;
  fb_user_id: string;
  fb_business_id: string;
  waba_id: string;
  application: string;
  scopes: Schema.Types.Mixed;
  fb_user_token: string;
  status: string;
  access_token: string;
  created_at: Date;
  phone_numbers: Schema.Types.Mixed;
}

type EmbeddedSingupModel = Model<IEmbeddedSingup>;

const EmbeddedSingupSchema = new Schema<IEmbeddedSingup, EmbeddedSingupModel>({
  business_id: { type: Schema.Types.ObjectId },
  user_account_id: { type: Schema.Types.ObjectId },
  app_id: { type: Schema.Types.String },
  fb_user_id: { type: Schema.Types.String },
  fb_business_id: { type: Schema.Types.String },
  waba_id: { type: Schema.Types.String },
  application: { type: Schema.Types.String },
  scopes: { type: Schema.Types.Mixed },
  access_token: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "PENDIG" },
  phone_numbers: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.embedded_singup ||
  model<IEmbeddedSingup>("embedded_singup", EmbeddedSingupSchema);
