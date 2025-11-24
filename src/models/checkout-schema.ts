import { Document, Model, Schema, model, models, ObjectId } from "mongoose";

interface ICheckoutSession extends Document {
  name: Schema.Types.String;
  cs_type: Schema.Types.String;
  payment_type: Schema.Types.String;
  currency: Schema.Types.String;
  order_id: Schema.Types.Mixed;
  subscription_id: Schema.Types.Mixed;
  payment_gateway: Schema.Types.Mixed;
  total_price: Schema.Types.Number;
  total_tax: Schema.Types.Number;
  total_line_items_price: Schema.Types.Number;
  user_id: Schema.Types.ObjectId;
  line_items: Schema.Types.Mixed;
  status: Schema.Types.Mixed;
  razorpay_payment_id: Schema.Types.Mixed;
  razorpay_order_id: Schema.Types.Mixed;
  razorpay_signature: Schema.Types.Mixed;
  br_type: Schema.Types.Number;
  created_at: Date;
  invoice_id: ObjectId;
  quantity: number;
  discount: number;
  base_price: number;
}
type CheckoutSessionModel = Model<ICheckoutSession>;
const CheckoutSessionModelSchema = new Schema<
  ICheckoutSession,
  CheckoutSessionModel
>({
  name: { type: Schema.Types.String },
  cs_type: { type: Schema.Types.String, default: "subscription" },
  payment_type: { type: Schema.Types.String, default: "month" },
  currency: { type: Schema.Types.String },
  order_id: { type: Schema.Types.Mixed },
  subscription_id: { type: Schema.Types.Mixed },
  payment_gateway: { type: Schema.Types.Mixed },
  total_price: { type: Schema.Types.Number },
  total_tax: { type: Schema.Types.Number },
  total_line_items_price: { type: Schema.Types.Number },
  line_items: { type: Schema.Types.Number },
  user_id: { type: Schema.Types.ObjectId },
  razorpay_payment_id: { type: Schema.Types.Mixed },
  razorpay_order_id: { type: Schema.Types.Mixed },
  razorpay_signature: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.Mixed },
  br_type: { type: Schema.Types.Number, default: 1 },
  created_at: { type: Schema.Types.Date, default: new Date() },
  invoice_id: { type: Schema.Types.ObjectId },
  quantity: { type: Schema.Types.Number, default: 1 },
  discount: { type: Schema.Types.Number, default: 0 },
  base_price: { type: Schema.Types.Number },
});
//ProductItemModelSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 });
export default models.checkout_session ||
  model<ICheckoutSession>("checkout_session", CheckoutSessionModelSchema);
