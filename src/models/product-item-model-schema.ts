import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

interface IProductItem extends Document {
  business_id: Schema.Types.Number;
  name: Schema.Types.String;
  domain: Schema.Types.String;
  type: String;
  r_plan_id: String;
  plan_type: Schema.Types.Mixed;
  description: string;
  discount_type: String;
  discount_value: Schema.Types.Number;
  price: Schema.Types.Number;
  total_price: Schema.Types.Number;
  tax_percentage: Schema.Types.Number;
  tax: Schema.Types.Number;
  is_recommeded: Schema.Types.Boolean;
  feature: Schema.Types.Mixed;
  status: String;
  created_at: Date;
  currency_code: string;
  policy_id: ObjectId;
  trial_duration: number;
  visibility: Schema.Types.Boolean;
  included_modules: {
    module_id: string;
    enabled: boolean;
    is_visibility: boolean;
    config: Record<string, any>;
  }[];
  nodes_access: Schema.Types.Mixed;
}
type ProductItemModel = Model<IProductItem>;
const ProductItemModelSchema = new Schema<IProductItem, ProductItemModel>({
  business_id: { type: Schema.Types.Number },
  domain: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  r_plan_id: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  plan_type: { type: Schema.Types.Mixed },
  discount_type: { type: Schema.Types.String },
  discount_value: { type: Schema.Types.Number, default: 0 },
  price: { type: Schema.Types.Number },
  total_price: { type: Schema.Types.Number },
  tax_percentage: { type: Schema.Types.Number, default: 0 },
  tax: { type: Schema.Types.Number, default: 0 },
  is_recommeded: { type: Schema.Types.Boolean, default: false },
  feature: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.String },
  created_at: { type: Schema.Types.Date, default: new Date() },
  currency_code: { type: Schema.Types.String },
  policy_id: { type: Schema.Types.ObjectId },
  trial_duration: { type: Schema.Types.Number, default: 0 },
  visibility: { type: Schema.Types.Boolean, default: false },
  included_modules: [
    {
      module_id: { type: Schema.Types.String },
      enabled: { type: Schema.Types.Boolean, default: true },
      is_visibility: { type: Schema.Types.Boolean, default: true },
      config: { type: Schema.Types.Mixed, default: {} },
    },
  ],
  nodes_access: { type: Schema.Types.Mixed },
});
//ProductItemModelSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 });
export default models.product_item ||
  model<IProductItem>("product_item", ProductItemModelSchema);