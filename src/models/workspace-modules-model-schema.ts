import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IWorkspaceModules extends Document {
    workspace_id: Schema.Types.ObjectId;
  module_id: Schema.Types.String;
  enabled: Schema.Types.Boolean;
  is_visibility: Schema.Types.Boolean;
  source: Schema.Types.String;
  config: Schema.Types.Mixed;
  expired_at: Schema.Types.Date;
  created_at: Schema.Types.Date;
  updated_at: Schema.Types.Date;
}

interface IWorkspaceModulesMethods {}

type IWorkspaceModulesModel = Model<IWorkspaceModules, IWorkspaceModulesMethods>;

const WorkspaceModuleSchema = new Schema<
IWorkspaceModules,
IWorkspaceModulesMethods,
IWorkspaceModulesModel
>({
  workspace_id: { type: Schema.Types.ObjectId },
  module_id: { type: Schema.Types.String },
  enabled: { type: Schema.Types.Boolean , default: true },
  is_visibility: { type: Schema.Types.Boolean , default: false },
  source: { type: Schema.Types.String },
  config: { type: Schema.Types.Mixed },
  expired_at: { type: Schema.Types.Date },
  created_at: { type: Schema.Types.Date, default: Date.now },
  updated_at: { type: Schema.Types.Date, default: Date.now },
});

export default models.workspace_modules ||
  model<IWorkspaceModulesModel>("workspace_modules", WorkspaceModuleSchema);
