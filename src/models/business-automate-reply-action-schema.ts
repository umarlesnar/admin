import { Document, Model, Schema, model, models, Types } from "mongoose";

//db interface
interface IAutomateReplyAction extends Document {
  business_id: String;
  type?: Schema.Types.Number;
  content: Schema.Types.String;
  flow_id: Schema.Types.ObjectId;
  media: Schema.Types.String;
  sequence_id: String;
  template_id: String;
  image_url: String;
  title: Schema.Types.String;
  webhook: String;
  created_at: Date;
}

interface IAutomateReplyActionMethods {}

type AutomateReplyActionModel = Model<
  IAutomateReplyAction,
  IAutomateReplyActionMethods
>;

//main schema
const AutomateReplyActionSchema = new Schema<
  IAutomateReplyAction,
  AutomateReplyActionModel,
  IAutomateReplyActionMethods
>({
  business_id: { type: Types.ObjectId, required: true },
  type: { type: Schema.Types.Number, required: true },
  content: { type: String },
  title: { type: String, required: true },
  flow_id: { type: Types.ObjectId },
  media: { type: String, default: null },
  sequence_id: { type: Types.ObjectId },
  template_id: { type: Types.ObjectId },
  image_url: { type: String, default: null },
  webhook: { type: Schema.Types.String },
  created_at: { type: Schema.Types.Date, default: new Date() },
});

AutomateReplyActionSchema.set("toObject", { virtuals: true });
AutomateReplyActionSchema.set("toJSON", { virtuals: true });

export default models.automate_reply_action ||
  model<IAutomateReplyAction>(
    "automate_reply_action",
    AutomateReplyActionSchema
  );
