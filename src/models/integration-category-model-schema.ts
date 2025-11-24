import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IIntegrationCategory extends Document {
  name: Schema.Types.String;
  status: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
}

interface IIntegrationCategoryMethods {}

type IIntegrationCategoryModel = Model<
  IIntegrationCategory,
  IIntegrationCategoryMethods
>;

const IntegrationCategorySchema = new Schema<
  IIntegrationCategory,
  IIntegrationCategoryMethods,
  IIntegrationCategoryModel
>({
  name: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.integration_category ||
  model<IIntegrationCategory>(
    "integration_category",
    IntegrationCategorySchema
  );
