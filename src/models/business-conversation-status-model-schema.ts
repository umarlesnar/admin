import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IConversationStatus extends Document {
  business_id: Schema.Types.ObjectId;
  id: String;
  status: String;
  timestamp: any;
  recipient_id: Schema.Types.Mixed;
  conversation: Schema.Types.Mixed;
  pricing: Schema.Types.Mixed;
}

type BusinessConversationStatusModel = Model<IConversationStatus>;

const BusinessConversationStatusSchema = new Schema<
  IConversationStatus,
  BusinessConversationStatusModel
>(
  {
    business_id: { type: Schema.Types.ObjectId },
    id: { type: String },
    status: { type: String },
    timestamp: { type: Schema.Types.Number },
    recipient_id: { type: Schema.Types.String },
    conversation: { type: Schema.Types.Mixed },
    pricing: { type: Schema.Types.Mixed },
  },
  { collection: "business_conversation_status" }
);

export default models.business_conversation_status ||
  model<IConversationStatus>(
    "business_conversation_status",
    BusinessConversationStatusSchema
  );
