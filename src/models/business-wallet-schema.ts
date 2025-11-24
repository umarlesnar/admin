import { Document, Model, Schema, model, models, ObjectId } from "mongoose";

interface IWallet extends Document {
  workspace_id: Schema.Types.ObjectId;
  business_id: Schema.Types.ObjectId;
  name: Schema.Types.String;
  wallet_type: Schema.Types.String;
  credit_balance: Schema.Types.Number;
  opening_balance: Schema.Types.Number;
  opening_date: Schema.Types.Number;
  current_balance: Schema.Types.Number;
  is_active: Schema.Types.Number;
  created_at: Schema.Types.Number;
  updated_at: Schema.Types.Number;
}
type WalletModel = Model<IWallet>;
const WalletModelSchema = new Schema<IWallet, WalletModel>({
  workspace_id: { type: Schema.Types.ObjectId },
  business_id: { type: Schema.Types.ObjectId },
  name: { type: Schema.Types.String },
  wallet_type: { type: Schema.Types.String, default: "cash" },
  credit_balance: { type: Schema.Types.Number, default: 0 },
  opening_balance: { type: Schema.Types.Number, default: 0 },
  current_balance: { type: Schema.Types.Number, default: 0 },
  is_active: { type: Schema.Types.Boolean, default: true },
  created_at: { type: Schema.Types.Number },
  updated_at: { type: Schema.Types.Number },
});
export default models.wallet || model<IWallet>("wallet", WalletModelSchema);
