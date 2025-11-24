import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IMasterModules extends Document {
  module_id: Schema.Types.String;
  name: Schema.Types.String;
  description: Schema.Types.String;
  category: Schema.Types.String;
  sort_order: Schema.Types.Number;
  default_permission: Schema.Types.Mixed;
  config: Schema.Types.Mixed;
  is_active: Schema.Types.Boolean;
  created_at: Date;
  updated_at: Date;
}

interface IMasterModulesMethods {}

type IMasterModulesModel = Model<IMasterModules, IMasterModulesMethods>;

const MasterModuleSchema = new Schema<
  IMasterModules,
  IMasterModulesMethods,
  IMasterModulesModel
>({
  module_id: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  category: { type: Schema.Types.String },
  sort_order: { type: Schema.Types.Number, default: 0 },
  default_permission: { type: Schema.Types.Mixed },
  config: { type: Schema.Types.Mixed },
  is_active: { type: Schema.Types.Boolean, default: true },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },

});

export default models.master_modules ||
  model<IMasterModulesModel>("master_modules", MasterModuleSchema);
