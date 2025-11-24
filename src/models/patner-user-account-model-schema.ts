import { generatePasswordHash } from "@/lib/utils/generate-password-hash";
import { Document, Model, Schema, model, models, Types } from "mongoose";

export interface AuthCredentials {
  password: string;
  last_updated_at: Date;
}

export interface UserEmail {
  email_id: string;
  is_primary: boolean;
  is_verified: boolean;
  created_time: number;
}

export interface UserRecoveryPhone {
  dial_code: string;
  mobile_number: string;
  display_number: string;
  is_primary: boolean;
  is_verified: boolean;
  created_time: Date;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  photo_url?: string;
}

interface IPatnerUserAccount extends Document {
  domain: String;
  patner_id?: Types.ObjectId;
  auth_type: number;
  username: string;
  auth_credentials: AuthCredentials;
  timezone_id: String;
  profile: UserProfile;
  phone: UserRecoveryPhone;
  email: UserEmail;
  role: String;
  status: String;
  visibility: String;
  created_at: Date;
  updated_at: Date;
  updated_by: any;
}

interface IPatnerAccountMethods {
  checkUsername(): any;
}

type PatnerAccountModel = Model<IPatnerUserAccount, {}, IPatnerAccountMethods>;

const PatnerUserAccountSchema = new Schema<
  IPatnerUserAccount,
  PatnerAccountModel,
  IPatnerAccountMethods
>({
  domain: { type: String },
  patner_id: { type: Types.ObjectId },
  auth_type: { type: Number, default: 2 },
  username: { type: String, unique: true, index: true },
  profile: {
    first_name: { type: String, required: true },
    last_name: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  auth_credentials: {
    password: { type: String },
    last_updated_at: { type: Date, default: new Date() },
  },
  email: {
    email_id: { type: String },
    is_primary: { type: Schema.Types.Boolean, default: false },
    is_verified: { type: Schema.Types.Boolean, default: false },
    created_time: { type: Schema.Types.Date, default: new Date() },
  },
  phone: {
    dial_code: { type: String },
    mobile_number: { type: String },
    display_number: { type: String },
    is_primary: { type: Schema.Types.Boolean, default: false },
    is_verified: { type: Schema.Types.Boolean, default: false },
    created_time: { type: Schema.Types.Date, default: new Date() },
  },
  timezone_id: { type: String, default: "Asia/Kolkata" },
  visibility: { type: String, default: "SHOW" },
  role: { type: String, default: "OWNER" },
  status: { type: String, default: "ACTIVE" },
  created_at: { type: Schema.Types.Date, default: Date.now },
  updated_at: { type: Schema.Types.Date, default: Date.now },
  updated_by: { type: Types.ObjectId },
});

PatnerUserAccountSchema.pre("save", function (next) {
  let _this = this;

  if (_this.auth_credentials) {
    const hash = generatePasswordHash(_this.auth_credentials.password);
    _this.auth_credentials.password = hash;
  }
  next();
});

export default models.patner_user_account ||
  model<IPatnerUserAccount>("patner_user_account", PatnerUserAccountSchema);
