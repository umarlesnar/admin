import { Document, Model, Schema, model, models, Types } from "mongoose";

interface ICommerceProduct extends Document {
  business_id?: Types.ObjectId;
  name: String;
  catalog_id?: String;
  product_id?: String;
  retailer_id?: String;
  image_url?: String;
  product_price: String;
  description: String;
  availability: String;
  condition: String;
  link: String;
  brand: String;
  created_at: Date;
  updated_at: Date;
}

type CommerceProductModel = Model<ICommerceProduct>;

const CommerceProductSchema = new Schema<
  ICommerceProduct,
  CommerceProductModel
>({
  business_id: { type: Types.ObjectId },
  name: { type: String },
  catalog_id: { type: String },
  product_id: { type: String },
  retailer_id: { type: String },
  image_url: { type: String },
  product_price: { type: String },
  description: { type: String },
  availability: { type: String },
  condition: { type: String },
  link: { type: String },
  brand: { type: String },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.commerce_product ||
  model<ICommerceProduct>("commerce_product", CommerceProductSchema);
