import {
  Document,
  Model,
  Schema,
  model,
  models,
  Mixed,
  ObjectId,
} from "mongoose";
interface IIgAutomation extends Document {
  type: string;
  workspace_id: ObjectId;
  business_id: ObjectId;
  post_id: string;
  trigger_type: string;
  include_keywords: Mixed;
  exclude_enabled: boolean;
  exclude_keywords: Mixed;
  dm_enabled: boolean;
  dm: Mixed;
  comment_reply_enabled: boolean;
  comment_replies: Mixed;
  delay_enabled: Boolean;
  delay: Mixed;
  status: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
  expired_at: number;
}

interface IIgAutomationMethods {}

type IIgAutomationModel = Model<IIgAutomation, IIgAutomationMethods>;

const IgAutomationSchema = new Schema<
  IIgAutomation,
  IIgAutomationMethods,
  IIgAutomationModel
>({
  type: { type: Schema.Types.String },
  workspace_id: { type: Schema.Types.ObjectId },
  business_id: { type: Schema.Types.ObjectId },
  post_id: { type: Schema.Types.String },
  trigger_type: { type: Schema.Types.String, default: "all" },
  include_keywords: { type: Schema.Types.Mixed, default: [] },
  exclude_enabled: { type: Schema.Types.Boolean, default: false },
  exclude_keywords: { type: Schema.Types.Mixed, default: [] },
  dm_enabled: { type: Schema.Types.Boolean, default: false },
  dm: { type: Schema.Types.Mixed, default: null },
  comment_reply_enabled: { type: Schema.Types.Boolean, default: false },
  comment_replies: { type: Schema.Types.Mixed, default: null },
  delay_enabled: { type: Schema.Types.Boolean, default: false },
  delay: { type: Schema.Types.Mixed, default: null },
  status: { type: Schema.Types.String, default: "ACTIVE" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  expired_at: { type: Schema.Types.Number },
});

export default models.ig_automation ||
  model<IIgAutomation>("ig_automation", IgAutomationSchema);
