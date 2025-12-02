import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IIntegration extends Document {
  image_url: Schema.Types.String;
  name: Schema.Types.String;
  description: Schema.Types.String;
  type: Schema.Types.String;
  tutorial_link: Schema.Types.String;
  documentation_link: Schema.Types.String;
  price: Schema.Types.String;
  language: Schema.Types.String;
  category: Schema.Types.String;
  status: Schema.Types.String;
  link: Schema.Types.String;
  is_micro_app: Schema.Types.Boolean;
  configuration: Schema.Types.Mixed;
  coming_soon: Schema.Types.Boolean;
  sort_order: Schema.Types.Number;
  created_at: Date;
  updated_at: Date;
}

interface IIntegrationMethods {}

type IIntegrationModel = Model<IIntegration, IIntegrationMethods>;

const IntegrationSchema = new Schema<
  IIntegration,
  IIntegrationMethods,
  IIntegrationModel
>({
  image_url: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  tutorial_link: { type: Schema.Types.String },
  documentation_link: { type: Schema.Types.String },
  price: { type: Schema.Types.String, default: "Free" },
  language: { type: Schema.Types.String },
  category: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLED" },
  link: { type: Schema.Types.String },
  is_micro_app: { type: Schema.Types.Boolean, default: false },
  configuration: { type: Schema.Types.Mixed },
  coming_soon: { type: Schema.Types.Boolean, default: false },
  sort_order: { type: Schema.Types.Number, default: 0 },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.Integration_library ||
  model<IIntegration>("Integration_library", IntegrationSchema);
