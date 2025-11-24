import { Document, Model, ObjectId, Schema, model, models } from "mongoose";

interface ITransaction extends Document {
  business_id: ObjectId;
  workspace_id: ObjectId;
  name: string;
  action: string;
  type:"CREDIT" | "DEBIT";
  value: number;
  reference_id: ObjectId;
  reference_type: string;
  user_id: ObjectId;
  created_at: Date;
}
type TransactionModel = Model<ITransaction>;
const TransactionSchema = new Schema<ITransaction, TransactionModel>({
  business_id: { type: Schema.Types.ObjectId },
  workspace_id: { type: Schema.Types.ObjectId },
  name: { type: Schema.Types.String },
  action: { type: Schema.Types.String },
  type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
  value: { type: Schema.Types.Number },
  reference_id: { type: Schema.Types.ObjectId },
  reference_type: { type: Schema.Types.String },
  user_id: { type: Schema.Types.ObjectId },
  created_at: { type: Schema.Types.Date, default: new Date() },
});
export default models.transaction ||
  model<ITransaction>("transaction", TransactionSchema);
