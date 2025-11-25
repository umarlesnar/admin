import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IPaymentInvoice extends Document {
  business_id: Schema.Types.ObjectId;
  plan: Schema.Types.String;
  type: Schema.Types.String;
  subscription_type: Schema.Types.String;
  payment_method: Schema.Types.String;
  currency: Schema.Types.String;
  order_id: Schema.Types.Mixed;
  reference_id: Schema.Types.Mixed;
  total_price: Schema.Types.Number;
  total_tax: Schema.Types.Number;
  user_id: Schema.Types.ObjectId;
  status: Schema.Types.Mixed;
  workspace_id: Schema.Types.ObjectId;
  created_at: Date;
  quantity: number;
  start_from: number;
  end_to: number;
  paid_at: number;
  discount: number;
  base_price: number;
  invoice_number: string;
}
type PaymentInvoiceModel = Model<IPaymentInvoice>;
const PaymentInvoiceModelSchema = new Schema<
  IPaymentInvoice,
  PaymentInvoiceModel
>(
  {
    business_id: { type: Schema.Types.ObjectId, default: null },
    plan: { type: Schema.Types.String },
    type: { type: Schema.Types.String, default: "subscription" },
    subscription_type: { type: Schema.Types.String },
    payment_method: { type: Schema.Types.String, default: "online" },
    currency: { type: Schema.Types.String },
    total_price: { type: Schema.Types.Number },
    total_tax: { type: Schema.Types.Number },
    user_id: { type: Schema.Types.ObjectId },
    order_id: { type: Schema.Types.Mixed },
    reference_id: { type: Schema.Types.Mixed },
    status: { type: Schema.Types.Mixed },
    workspace_id: { type: Schema.Types.ObjectId },
    created_at: { type: Schema.Types.Date, default: new Date() },
    quantity: { type: Schema.Types.Number, default: 1 },
    start_from: { type: Schema.Types.Number },
    end_to: { type: Schema.Types.Number },
    paid_at: { type: Schema.Types.Number },
    discount: { type: Schema.Types.Number, default: 0 },
    base_price: { type: Schema.Types.Number },
    invoice_number: { type: String, sparse: true },
  },
  { strict: false }
);
//ProductItemModelSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 });
export default models.payment_invoice ||
  model<IPaymentInvoice>("payment_invoice", PaymentInvoiceModelSchema);
