import { Document, Model, Schema, model, models, Types, Mixed } from "mongoose";

interface ICommerceSet extends Document {
  business_id?: Types.ObjectId;
  set_id: String;
  name: String;
  catalog_id?: String;
  product_count: number;
  products: Mixed;
  created_at: Date;
  updated_at: Date;
}

type CommerceSetModel = Model<ICommerceSet>;

const CommerceSetSchema = new Schema<ICommerceSet, CommerceSetModel>({
  business_id: { type: Types.ObjectId },
  set_id: { type: String },
  name: { type: String },
  catalog_id: { type: String },
  product_count: { type: Number },
  products: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.commerce_set ||
  model<ICommerceSet>("commerce_set", CommerceSetSchema);
