import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";
import userAccountModelSchema from "./user-account-model-schema";

interface IBusinessConversation extends Document {
  wba_id: String;
  io_type: String;
  cs_id: String;
  msg_id: String;
  operator_id: String;
  business_id: String;
  phone_number_id: String;
  type: String;
  from: Schema.Types.Mixed;
  is_read: boolean;
  to: Schema.Types.Mixed;
  template_id: Schema.Types.Mixed;
  sms_template_id: String;
  message: Schema.Types.Mixed;
  timestamp: Schema.Types.Number;
  statuses: Schema.Types.Mixed;
  status: String;
  sms_status: Schema.Types.Boolean;
  sms_log_id: any;
  send_sms_if_failed: Schema.Types.Boolean;
  broadcast_id: Schema.Types.Mixed;
  input_variables: Schema.Types.Mixed;
  template_category: Schema.Types.Mixed;
  sms_content: Schema.Types.Mixed;
  broadcast_queue_id: Schema.Types.ObjectId;
  api_log_id: ObjectId;
}

interface IBusinessConversationMethods {}

type BusinessConversationModel = Model<
  IBusinessConversation,
  {},
  IBusinessConversationMethods
>;

const BusinessConversationSchema = new Schema<
  IBusinessConversation,
  BusinessConversationModel,
  IBusinessConversationMethods
>({
  business_id: { type: Schema.Types.ObjectId },
  io_type: { type: Schema.Types.String },
  cs_id: { type: Schema.Types.ObjectId },
  operator_id: { type: Schema.Types.ObjectId },
  msg_id: { type: String, index: 1 },
  wba_id: { type: String },
  is_read: { type: Schema.Types.Boolean, default: false },
  phone_number_id: { type: String },
  type: { type: String },
  from: { type: Schema.Types.Mixed },
  to: { type: Schema.Types.Mixed },
  template_id: { type: Schema.Types.ObjectId },
  sms_template_id: { type: String },
  send_sms_if_failed: { type: Schema.Types.Boolean },
  sms_status: { type: Schema.Types.Boolean },
  message: { type: Schema.Types.Mixed },
  timestamp: { type: Schema.Types.Number },
  statuses: { type: Schema.Types.Mixed },
  status: { type: String, index: 1 },
  broadcast_id: { type: Schema.Types.ObjectId },
  broadcast_queue_id: { type: Schema.Types.ObjectId },
  sms_log_id: { type: Schema.Types.ObjectId },
  input_variables: { type: Schema.Types.Mixed },
  template_category: { type: Schema.Types.Mixed },
  sms_content: { type: Schema.Types.Mixed },
  api_log_id: { type: Schema.Types.ObjectId },
});

BusinessConversationSchema.index({
  wba_id: 1,
  from: 1,
  to: 1,
  status: 1,
  timestamp: -1,
});

BusinessConversationSchema.virtual("operator", {
  ref: userAccountModelSchema,
  localField: "operator_id",
  foreignField: "_id",
  justOne: true,
});

BusinessConversationSchema.set("toObject", { virtuals: true });
BusinessConversationSchema.set("toJSON", { virtuals: true });

export default models.conversation ||
  model<IBusinessConversation>("conversation", BusinessConversationSchema);
