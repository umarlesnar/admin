import { Document, Model, Schema, model, models, Types } from "mongoose";
import userAccountModelSchema from "./user-account-model-schema";
//db interface
interface IBusinessContact extends Document {
  business_id?: Types.ObjectId;
  cs_id?: Types.ObjectId;
  wa_id: Schema.Types.String;
  profile: Schema.Types.Mixed;
  status: Schema.Types.String;
  source: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
  enable_broadcast: Schema.Types.Boolean;
  enable_sms: Schema.Types.Boolean;
  notes?: any[];
  custom_params?: any;
  tags?: any[];
  created_by: Types.ObjectId;
  updated_by: Types.ObjectId;
}

interface IBusinessContactMethods {}

type BusinessContactModel = Model<IBusinessContact, IBusinessContactMethods>;
//main schema
const BusinessContactSchema = new Schema<
  IBusinessContact,
  BusinessContactModel,
  IBusinessContactMethods
>({
  business_id: { type: Types.ObjectId },
  cs_id: { type: Types.ObjectId },
  wa_id: { type: String, required: true },
  profile: { type: Schema.Types.Mixed, required: true },
  status: { type: Schema.Types.String },
  custom_params: { type: Schema.Types.Mixed, default: [] },
  source: { type: String, default: "OTHER" },
  enable_broadcast: { type: Schema.Types.Boolean, default: false },
  enable_sms: { type: Schema.Types.Boolean, default: false },
  notes: { type: Schema.Types.Mixed, default: [] },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  tags: { type: Schema.Types.Mixed, default: [] },
  created_by: { type: Schema.Types.Mixed },
  updated_by: { type: Schema.Types.Mixed },
});

BusinessContactSchema.virtual("operator", {
  ref: userAccountModelSchema,
  localField: "operator_id",
  foreignField: "_id",
  justOne: true,
});

BusinessContactSchema.set("toObject", { virtuals: true });
BusinessContactSchema.set("toJSON", { virtuals: true });

export default models.business_contact ||
  model<IBusinessContact>("business_contact", BusinessContactSchema);
