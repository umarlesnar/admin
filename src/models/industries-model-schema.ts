import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IIndustries extends Document {
  name: Schema.Types.String;
  status: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
  // created_by: Schema.Types.ObjectId;
}

interface IIndustriesMethods {}

type IIndustriesModel = Model<IIndustries, IIndustriesMethods>;

const IndustriesSchema = new Schema<
IIndustries,
IIndustriesMethods,
IIndustriesModel
>({
  
  name: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  // created_by: { type: Types.ObjectId },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.industries ||
  model<IIndustries>("industries", IndustriesSchema);
