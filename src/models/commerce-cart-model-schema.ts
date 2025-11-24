import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
  Mixed,
} from "mongoose";

interface ICommerceCart extends Document {
  wa_id: string;
  business_id: ObjectId;
  cs_id: ObjectId;
  conversation_id: ObjectId;
  catalog_id: String;
  order_items: Mixed;
  status: String;
  created_at: Date;
  expiresAt: Date;
}

type CommerceCartModel = Model<ICommerceCart>;

const CommerceCartSchema = new Schema<ICommerceCart, CommerceCartModel>({
  wa_id: { type: String },
  business_id: { type: Types.ObjectId },
  cs_id: { type: Types.ObjectId },
  conversation_id: { type: Types.ObjectId },
  catalog_id: { type: String },
  order_items: { type: Schema.Types.Mixed },
  status: { type: String, default: "pending" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  expiresAt: { type: Schema.Types.Date, default: new Date() },
});

export default models.commerce_cart ||
  model<CommerceCartModel>("commerce_cart", CommerceCartSchema);
