import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IQuickReply extends Document {
  business_id: Types.ObjectId;
  name: String;
  text: String;
  created_at: Date;
  updated_at: Date;
  type: Schema.Types.Mixed;
}

type QuickReplyModel = Model<IQuickReply>;

const QuickReplyModelSchema = new Schema<IQuickReply, QuickReplyModel>({
  business_id: { type: Schema.Types.ObjectId },
  name: { type: Schema.Types.String },
  text: { type: Schema.Types.String },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  type: { type: Schema.Types.Mixed },
});

export default models.replies ||
  model<IQuickReply>("replies", QuickReplyModelSchema);
