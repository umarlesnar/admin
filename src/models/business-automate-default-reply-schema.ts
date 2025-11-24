import { Document, Model, Schema, model, models, Types } from "mongoose";

//db interface
interface IAutomateDefaultReply extends Document {
  business_id: any;
  check_reply_not_working: boolean;
  check_reply_customer_service_offline: boolean;
  check_reply_working: boolean;
  check_reply_not_reply: boolean;
  check_welcome_message: boolean;
  check_fallback_message: boolean;
  check_ecommerce_order: boolean;
  reply_ecommerce_order: any;
  reply_not_working: any;
  reply_customer_service_offline: any;
  reply_working: any;
  reply_not_reply: any;
  welcome_message: any;
  fallback_message: any;
  waitingTime: number;
  holiday_mode: boolean;
  workingTime: any;
  workingTimeData: any;
  keep_last_assignee: boolean;
  send_out_of_office_message_always: boolean;
  reply_out_of_office: any;
  timezone: string;
}

interface IAutomateDefaultReplyMethods {}

type AutomateDefaultReplyModel = Model<
  IAutomateDefaultReply,
  IAutomateDefaultReplyMethods
>;

//main schema
const AutomateDefaultReplySchema = new Schema<
  IAutomateDefaultReply,
  AutomateDefaultReplyModel,
  IAutomateDefaultReplyMethods
>({
  business_id: { type: Schema.Types.ObjectId },
  check_reply_not_working: { type: Schema.Types.Boolean, default: false },
  check_reply_customer_service_offline: {
    type: Schema.Types.Boolean,
    default: false,
  },
  check_reply_working: { type: Schema.Types.Boolean, default: false },
  check_reply_not_reply: { type: Schema.Types.Boolean, default: false },
  check_welcome_message: { type: Schema.Types.Boolean, default: false },
  check_fallback_message: { type: Schema.Types.Boolean, default: false },
  check_ecommerce_order: { type: Schema.Types.Boolean, default: false },
  reply_not_working: { type: Schema.Types.Mixed, default: null },
  reply_customer_service_offline: { type: Schema.Types.Mixed, default: null },
  reply_ecommerce_order: { type: Schema.Types.Mixed, default: null },
  reply_working: { type: Schema.Types.Mixed, default: null },
  reply_not_reply: { type: Schema.Types.Mixed, default: null },
  welcome_message: { type: Schema.Types.Mixed, default: null },
  fallback_message: { type: Schema.Types.Mixed, default: null },
  waitingTime: { type: Schema.Types.Number, default: 100 },
  workingTime: { type: Schema.Types.Mixed, default: [] },
  workingTimeData: { type: Schema.Types.Mixed, default: {} },
  holiday_mode: { type: Schema.Types.Boolean, default: false },
  keep_last_assignee: { type: Schema.Types.Boolean, default: false },
  send_out_of_office_message_always: {
    type: Schema.Types.Boolean,
    default: false,
  },
  reply_out_of_office: { type: Schema.Types.Mixed, default: null },
  timezone: { type: Schema.Types.String, default: "Asia/Kolkata" },
});

AutomateDefaultReplySchema.set("toObject", { virtuals: true });
AutomateDefaultReplySchema.set("toJSON", { virtuals: true });

export default models.automate_default_reply ||
  model<IAutomateDefaultReply>(
    "automate_default_reply",
    AutomateDefaultReplySchema
  );
