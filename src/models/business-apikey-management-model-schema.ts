import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IApikeyManamgent extends Document {
  business_id: Schema.Types.ObjectId;
  name: Schema.Types.String;
  status: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
  created_by: Schema.Types.ObjectId;
}

interface IApikeyManagementMethods {}

type IApikeyManagementModel = Model<IApikeyManamgent, IApikeyManagementMethods>;

//main schema
const ApikeyManamgentSchema = new Schema<
  IApikeyManamgent,
  IApikeyManagementMethods,
  IApikeyManagementModel
>({
  business_id: { type: Types.ObjectId, required: true },
  name: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Types.ObjectId, required: true },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.api_key_management ||
  model<IApikeyManamgent>("api_key_management", ApikeyManamgentSchema);
