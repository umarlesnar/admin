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
  email: string;
  gender: string;
  photo_url?: string;
  language?: string;
}

interface IUserAccount extends Document {
  domain: string;
  provider_id: string;
  business_id?: Types.ObjectId;
  is_bot: boolean;
  is_default_bot: boolean;
  auth_type: number;
  user_type: String;
  parent_id?: Types.ObjectId;
  username: string;
  display_name: String;
  auth_credentials: AuthCredentials;
  timezone_id: String;
  profile: UserProfile;
  phone: [UserRecoveryPhone];
  email: [UserEmail];
  role: String;
  status: String;
  visibility: String;
  is_online: Boolean;
  created_at: Date;
  updated_at: Date;
  last_ping_at: any;
  updated_by: any;
  account_deleted: any;
  account_deleted_date: any;
  account_deleted_by: any;
  is_onboard: Boolean;
  check_in: Boolean;
}

interface IUserAccountMethods {
  checkUsername(): any;
}

type UserModel = Model<IUserAccount, {}, IUserAccountMethods>;

const UserAccountSchema = new Schema<
  IUserAccount,
  UserModel,
  IUserAccountMethods
>({
  domain: { type: String },
  provider_id: { type: String },
  business_id: { type: Types.ObjectId },
  auth_type: { type: Number, default: 2 },
  user_type: { type: String, default: "BUSINESS_USER" },
  username: { type: String, unique: true, index: true },
  parent_id: {
    type: Types.ObjectId,
    required: false,
    default: null,
    ref: "user",
  },
  profile: {
    first_name: { type: String, required: true },
    last_name: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  auth_credentials: {
    password: { type: String },
    last_updated_at: { type: Date, default: new Date() },
  },
  email: [
    {
      email_id: { type: String },
      is_primary: { type: Schema.Types.Boolean, default: false },
      is_verified: { type: Schema.Types.Boolean, default: false },
      created_time: { type: Schema.Types.Date, default: new Date() },
    },
  ],
  phone: [
    {
      dial_code: { type: String },
      mobile_number: { type: String },
      display_number: { type: String },
      is_primary: { type: Schema.Types.Boolean, default: false },
      is_verified: { type: Schema.Types.Boolean, default: false },
      created_time: { type: Schema.Types.Date, default: new Date() },
    },
  ],
  display_name: { type: String },
  timezone_id: { type: String },
  visibility: { type: String, default: "SHOW" },
  role: { type: String, default: "OWNER" },
  status: { type: String, default: "ACTIVE" },
  is_online: { type: Schema.Types.Boolean, default: false },
  is_bot: { type: Schema.Types.Boolean, default: false },
  is_default_bot: { type: Schema.Types.Boolean, default: false },
  account_deleted: { type: Schema.Types.Boolean, default: false },
  account_deleted_date: { type: Schema.Types.Date },
  last_ping_at: { type: Schema.Types.Date },
  is_onboard: { type: Schema.Types.Boolean, default: false },
  check_in: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  updated_by: { type: Types.ObjectId },
});

UserAccountSchema.pre("save", function (next) {
  let _this = this;

  // if (_this?.auth_credentials) {
  //   const hash = generatePasswordHash(_this.auth_credentials.password);
  //   _this.auth_credentials.password = hash;
  // }
  next();
});

export default models.user_account ||
  model<IUserAccount>("user_account", UserAccountSchema);
