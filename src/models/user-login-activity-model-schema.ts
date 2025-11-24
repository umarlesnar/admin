import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IUserLoginActivity extends Document {
  domain: String;
  user_id: String;
  login_time: Date;
  ip_address: String;
  user_agent: String;
  status: String;
  failure_reason: String;
}

type UserLoginActivityModel = Model<IUserLoginActivity>;

const UserLoginActivitySchema = new Schema<
  IUserLoginActivity,
  UserLoginActivityModel
>(
  {
    domain: { type: Schema.Types.String },
    user_id: { type: String },
    login_time: { type: Date, default: Date.now },
    ip_address: { type: String },
    user_agent: { type: String },
    status: { type: String },
    failure_reason: { type: String },
  },
  { collection: "user_login_activity" }
);

export default models.user_login_activity ||
  model<IUserLoginActivity>("user_login_activity", UserLoginActivitySchema);
