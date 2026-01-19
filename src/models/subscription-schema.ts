import { Document, Model, Schema, model, models, ObjectId } from "mongoose";

interface ISubscription extends Document {
  plan_name: Schema.Types.String;
  policy_id: Schema.Types.ObjectId;
  workspace_id: Schema.Types.ObjectId;
  payment_gateway: Schema.Types.String;
  plan_type: Schema.Types.String;
  plan_id: Schema.Types.ObjectId;
  auto_renew: Schema.Types.Boolean;
  r_subscription_id: Schema.Types.String;
  r_plan_id: Schema.Types.String;
  r_total_count: Schema.Types.Number;
  r_quantity: Schema.Types.Number;
  r_customer_notify: Schema.Types.Number;
  r_current_start_at: Schema.Types.Number;
  r_current_end_at: Schema.Types.Number;
  r_start_at: Schema.Types.Number;
  r_end_at: Schema.Types.Number;
  r_expire_by: Schema.Types.Number;
  r_offer_id: Schema.Types.Number;
  r_notes: Schema.Types.Mixed;
  r_charge_at: Schema.Types.Number;
  r_auth_attempts: Schema.Types.Number;
  r_change_scheduled_at: Schema.Types.Number;
  r_remaining_count: Schema.Types.Number;
  status: Schema.Types.Mixed;
  user_id: Schema.Types.ObjectId;
  total_amount: Schema.Types.Number;
  upcoming_plan?: {
    plan_id: Schema.Types.ObjectId;
    plan_name: string;
    plan_type: string;
    price: number;
    start_at: number;
    end_at: number;
    payment_status: string;
    nodes_available?: Schema.Types.Mixed;
  };
}
type SubscriptionModel = Model<ISubscription>;
const SubscriptionModelSchema = new Schema<ISubscription, SubscriptionModel>({
  workspace_id: { type: Schema.Types.ObjectId },
  policy_id: { type: Schema.Types.ObjectId },
  plan_id: { type: Schema.Types.ObjectId },
  plan_name: { type: Schema.Types.String },
  r_subscription_id: { type: Schema.Types.String },
  payment_gateway: { type: Schema.Types.String, default: "razorpay" },
  plan_type: { type: Schema.Types.String },
  auto_renew: { type: Schema.Types.Boolean },
  r_plan_id: { type: Schema.Types.String },
  r_total_count: { type: Schema.Types.Number, default: 0 },
  r_quantity: { type: Schema.Types.Number, default: 0 },
  r_customer_notify: { type: Schema.Types.Number, default: 0 },
  r_current_start_at: { type: Schema.Types.Number, default: null },
  r_current_end_at: { type: Schema.Types.Number, default: null },
  r_start_at: { type: Schema.Types.Number, default: null },
  r_end_at: { type: Schema.Types.Number, default: null },
  r_expire_by: { type: Schema.Types.Number, default: null },
  r_offer_id: { type: Schema.Types.Number, default: null },
  r_notes: { type: Schema.Types.Mixed },
  r_charge_at: { type: Schema.Types.Number },
  r_auth_attempts: { type: Schema.Types.Number },
  r_change_scheduled_at: { type: Schema.Types.Number },
  r_remaining_count: { type: Schema.Types.Number },
  user_id: { type: Schema.Types.ObjectId },
  status: { type: Schema.Types.Mixed },
  total_amount: { type: Schema.Types.Number },
  upcoming_plan: {
    plan_id: { type: Schema.Types.ObjectId },
    plan_name: { type: Schema.Types.String },
    plan_type: { type: Schema.Types.String },
    price: { type: Schema.Types.Number },
    start_at: { type: Schema.Types.Number },
    end_at: { type: Schema.Types.Number },
    payment_status: { type: Schema.Types.String },
    nodes_available: { type: Schema.Types.Mixed },
  },
});
export default models.subscription ||
  model<ISubscription>("subscription", SubscriptionModelSchema);
