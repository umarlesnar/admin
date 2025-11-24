import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IBQVmqSession extends Document {
  status: String;
  business_id: any;
  broadcast_id: any;
  wa_id: any;
  wb_status: String;
}

type BQBusinessConversationModel = Model<IBQVmqSession>;

const BQVmqSessionSchema = new Schema<
  IBQVmqSession,
  BQBusinessConversationModel
>(
  {
    business_id: { type: Types.ObjectId },
    broadcast_id: { type: Types.ObjectId },
    wa_id: { type: String },
    status: { type: String, default: "ACTIVE" },
    wb_status: { type: String },
  },
  { collection: "automate_broadcast_queue" }
);

export default models.automate_broadcast_queue ||
  model<IBQVmqSession>("automate_broadcast_queue", BQVmqSessionSchema);
