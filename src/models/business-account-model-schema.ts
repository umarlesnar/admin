// src/models/business-account-model-schema.ts

import { Document, Model, Schema, model, models, Types, Mixed } from "mongoose";

interface IBusinessAccount extends Document {
  domain: String;
  display_name: String;
  display_name_status: String;
  img_repo_id: String;
  name: String;
  business_logo_url: String;
  user_id?: Types.ObjectId;
  fb_app_id: String;
  onboarding_type: String;
  wba_id: String;
  phone_number_id: String;
  type: string;
  channel_type: string;
  business_profile: Schema.Types.Mixed;
  fb_namespace: String;
  parent_id?: Types.ObjectId;
  sms: Schema.Types.Mixed;
  access_token: String;
  default_bot: any;
  status: String;
  per_day_limit: number | null;
  subscription: Schema.Types.Mixed;
  wb_status: any;
  created_at: Date;
  catalog_settings: Schema.Types.Mixed;
  cloud_provider: String;
  commands: [
    {
      command_name: string;
      command_description: string;
    }
  ];
  prompts: Mixed;
  policy_id?: Types.ObjectId;
  override_callback_uri?: string;
  verify_token?: string;
  access_token_expired_in: number;
  workspace_id?: Types.ObjectId;
  is_on_biz_app?: boolean; 
}

interface IBusinessAccountMethods {}

type BusinessModel = Model<IBusinessAccount, {}, IBusinessAccountMethods>;

const BusinessAccountSchema = new Schema<
  IBusinessAccount,
  BusinessModel,
  IBusinessAccountMethods
>({
  domain: { type: String },
  display_name: { type: String },
  display_name_status: { type: String },
  img_repo_id: { type: String },
  name: { type: String },
  business_logo_url: { type: String },
  user_id: { type: Types.ObjectId },
  fb_app_id: { type: String },
  wba_id: { type: String, index: true },
  phone_number_id: { type: String, unique: true },
  type: { type: String, default: "META_CLOUD_API" },
  channel_type: { type: String, default: "WHATSAPP" },
  onboarding_type: { type: String, default: "EMBEDDED_SIGNUP" },
  business_profile: { type: Schema.Types.Mixed },
  fb_namespace: { type: Schema.Types.String },
  sms: { type: Schema.Types.Mixed },
  access_token: { type: String },
  status: { type: String, default: "ACTIVE" },
  per_day_limit: { type: Number, default: 250, sparse: true },
  default_bot: { type: Schema.Types.Mixed },
  wb_status: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  subscription: { type: Schema.Types.Mixed },
  catalog_settings: { type: Schema.Types.Mixed },
  cloud_provider: { type: Schema.Types.String, default: "SELF_HOSTING" },
  commands: [
    {
      command_name: { type: Schema.Types.String },
      command_description: { type: Schema.Types.String },
    },
  ],
  prompts: { type: Schema.Types.Mixed },
  policy_id: { type: Types.ObjectId },
  override_callback_uri: { type: Schema.Types.String },
  verify_token: { type: Schema.Types.String },
  access_token_expired_in: { type: Schema.Types.Number },
  workspace_id: { type: Schema.Types.ObjectId },
  is_on_biz_app: { type: Boolean, default: false }, 
});

export default models.business_account ||
  model<IBusinessAccount>("business_account", BusinessAccountSchema);