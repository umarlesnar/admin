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

interface ICommerceOrder extends Document {
  business_id: ObjectId;
  cs_id: ObjectId;
  conversation_id: ObjectId;
  catalog_id: String;
  order_items: Mixed;
  total_price: number;
  status: String;
  order_id: string;
  order_number: string;
  tracking_id: string;
  delivery_address: string;
  shipping_address: Mixed;
  order_status_url: string;
  customer: Mixed;
  attributes: Mixed;
}

type CommerceOrderModel = Model<ICommerceOrder>;

const CommerceProductSchema = new Schema<ICommerceOrder, CommerceOrderModel>({
  business_id: { type: Types.ObjectId },
  cs_id: { type: Types.ObjectId },
  conversation_id: { type: Types.ObjectId },
  catalog_id: { type: String },
  order_items: { type: Schema.Types.Mixed },
  total_price: { type: Schema.Types.Number },
  status: { type: String, default: "pending" },
  order_id: { type: String, default: null },
  order_number: { type: String, default: null },
  order_status_url: { type: String, default: null },
  tracking_id: { type: String, default: null },
  delivery_address: { type: String, default: null },
  shipping_address: { type: Schema.Types.Mixed },
  customer: { type: Schema.Types.Mixed },
  attributes: { type: Schema.Types.Mixed },
});

export default models.commerce_order ||
  model<ICommerceOrder>("commerce_order", CommerceProductSchema);
