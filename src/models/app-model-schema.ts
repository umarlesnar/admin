import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IApp extends Document {
  slug: Schema.Types.String;
  name: Schema.Types.String;
  icon_url: Schema.Types.String;
  description: Schema.Types.String;
  is_micro_app: Schema.Types.Boolean;
  status: Schema.Types.String;
  is_production_ready: Schema.Types.Boolean;
  created_at: Date;
  updated_at: Date;
}

interface IAppMethods {}

type IAppClientModel = Model<IApp, IAppMethods>;

const AppClientSchema = new Schema<IApp, IAppMethods, IAppClientModel>({
  slug: { type: Schema.Types.String, required: true, unique: true },
  name: { type: Schema.Types.String, required: true },
  icon_url: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  is_micro_app: { type: Schema.Types.Boolean, default: false },
  status: { type: Schema.Types.String, default: "draft" },
  is_production_ready: { type: Schema.Types.Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

export default models.app || model<IApp>("app", AppClientSchema);
