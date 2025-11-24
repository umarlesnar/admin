import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IBusinessLimit extends Document {
  business_id: Schema.Types.ObjectId;
  type: string;
  is_infinite: Boolean;
  total: number;
  used: number;
  last_update: Date;
  visibility: Boolean;
  created_at: Date;
}
type BusinessLimitModel = Model<IBusinessLimit>;
const BusinessQuotasSchema = new Schema<IBusinessLimit, BusinessLimitModel>(
  {
    business_id: { type: Schema.Types.ObjectId },
    type: { type: String },
    is_infinite: { type: Schema.Types.Boolean, default: false },
    visibility: { type: Schema.Types.Boolean, default: false },
    total: { type: Schema.Types.Number, default: 0 },
    used: { type: Schema.Types.Number, default: 0 },
    last_update: { type: Schema.Types.Date, default: new Date() },
    created_at: { type: Schema.Types.Date, default: new Date() },
  },
  { collection: "business_quotas" }
);

export default models.business_quotas ||
  model<IBusinessLimit>("business_quotas", BusinessQuotasSchema);
