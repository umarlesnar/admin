import {
  Document,
  Model,
  Schema,
  model,
  models,
  ObjectId,
  Mixed,
} from "mongoose";

interface IProduct extends Document {
  name: String;
  description: String;
  amount: number;
  currency: string;
  yearly_discount: number;
  r_plan_id: string;
  limits: {
    user: number;
    user_session_web: number;
    user_session_mobile: number;
    broadcast: number;
    flow: number;
    whatsapp_chat_message: number;
    whatsapp_message_template: number;
    web_chat_message: number;
    whatsapp_bot_flow_trigger: number;
    web_chat_bot_flow_trigger: number;
    api_limit: number;
    whatapp_session_limit_per_day: number;
    media_storage: number;
    message_retention: string;
    broadcast_log_retention: string;
  };
  features: Mixed;
  status: String;
  created_at: Date;
  created_by: ObjectId;
}

interface IProductMethods {}

type ProductModel = Model<IProduct, {}, IProductMethods>;

const ProductModelSchema = new Schema<IProduct, ProductModel, IProductMethods>({
  name: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  amount: { type: Schema.Types.Number },
  currency: { type: Schema.Types.String, default: "inr" },
  yearly_discount: { type: Schema.Types.Number },
  r_plan_id: { type: Schema.Types.String },
  limits: {
    user: { type: Schema.Types.Number },
    user_session_web: { type: Schema.Types.Number },
    user_session_mobile: { type: Schema.Types.Number },
    broadcast: { type: Schema.Types.Number },
    flow: { type: Schema.Types.Number },
    whatsapp_chat_message: { type: Schema.Types.Number },
    whatsapp_message_template: { type: Schema.Types.Number },
    web_chat_message: { type: Schema.Types.Number },
    whatsapp_bot_flow_trigger: { type: Schema.Types.Number },
    web_chat_bot_flow_trigger: { type: Schema.Types.Number },
    api_limit: { type: Schema.Types.Number },
    whatapp_session_limit_per_day: { type: Schema.Types.Number },
    media_storage: { type: Schema.Types.Number },
    message_retention: { type: Schema.Types.String },
    broadcast_log_retention: { type: Schema.Types.String },
  },
  features: { type: Schema.Types.Mixed },
  status: { type: String, default: "ACTIVE" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Schema.Types.ObjectId },
});

export default models.product || model<IProduct>("product", ProductModelSchema);
