import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
  Mixed,
} from "mongoose";
//db interface
interface IBusinessConversationSession extends Document {
  business_id?: Types.ObjectId;
  wba_id: Schema.Types.String;
  phone_number_id: Schema.Types.ObjectId;
  wa_id: Schema.Types.String;
  profile: Schema.Types.Mixed;
  timestamp: Schema.Types.Number;
  user_last_msg_at: Schema.Types.Number;
  status: Schema.Types.String;
  operator_id: Schema.Types.ObjectId;
  operator: any;
  is_fav: Schema.Types.Boolean;
  last_message: Schema.Types.Mixed;
  session_start_at: Schema.Types.Number;
  custom_params?: any;
  tags?: any;
  enable_broadcast: Schema.Types.Boolean;
  enable_sms: Schema.Types.Boolean;
  is_blocked: Schema.Types.Boolean;
  notes?: any[];
  template_id?: any;
  template_category?: any;
  sms_content?: any;
  flow_id?: any;
  action_id?: any;
  unread: Schema.Types.Number;
  is_profile_update: any;
  is_operator_bot: any;
  flow_session_id: ObjectId;
  cron_options: any;
  flow_variables: Mixed;
}

interface IBusinessConversationSessionMethods {}

type BusinessConversationSessionModel = Model<
  IBusinessConversationSession,
  IBusinessConversationSessionMethods
>;
//main schema
const BusinessConversationSessionSchema = new Schema<
  IBusinessConversationSession,
  BusinessConversationSessionModel,
  IBusinessConversationSessionMethods
>({
  business_id: { type: Types.ObjectId },
  wba_id: { type: String },
  phone_number_id: { type: String },
  wa_id: { type: String, required: true },
  is_profile_update: { type: Schema.Types.Boolean, default: true },
  profile: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Schema.Types.Number },
  user_last_msg_at: { type: Schema.Types.Number },
  status: { type: Schema.Types.String },
  operator_id: { type: Schema.Types.ObjectId },
  operator: { type: Schema.Types.Mixed },
  is_operator_bot: { type: Schema.Types.Boolean, default: false },
  last_message: { type: Schema.Types.Mixed },
  session_start_at: { type: Schema.Types.Number },
  custom_params: { type: Schema.Types.Mixed, default: [] },
  tags: { type: Schema.Types.Mixed, default: [] },
  is_fav: { type: Schema.Types.Boolean, default: false },
  enable_sms: { type: Schema.Types.Boolean, default: true },
  enable_broadcast: { type: Schema.Types.Boolean, default: true },
  is_blocked: { type: Schema.Types.Boolean, default: false },
  notes: { type: Schema.Types.Array, default: [] },
  template_id: { type: Schema.Types.Mixed },
  template_category: { type: Schema.Types.Mixed },
  sms_content: { type: Schema.Types.Mixed },
  flow_id: { type: Schema.Types.Mixed },
  unread: { type: Schema.Types.Number, default: 0 },
  action_id: { type: Schema.Types.Mixed },
  cron_options: { type: Schema.Types.Mixed },
  flow_session_id: { type: Schema.Types.ObjectId },
  flow_variables: { type: Schema.Types.Mixed },
});

BusinessConversationSessionSchema.index({
  business_id: 1,
  wa_id: 1,
  status: 1,
});

export default models.chat_session ||
  model<IBusinessConversationSession>(
    "chat_session",
    BusinessConversationSessionSchema
  );
