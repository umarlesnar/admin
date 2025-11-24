import { Document, Model, Schema, model, models, Types } from "mongoose";
import workspaceModelSchema from "./workspace-model-schema";
import addonModalSchema from "./addon-modal-schema";

interface IWorkspaceAddon extends Document {
  workspace_id: Types.ObjectId;
  addon_id: Types.ObjectId;
  enabled: Boolean;
  activated_at: Date;
  usage: Schema.Types.Mixed;
  custom_pricing: Schema.Types.Mixed;
}

type WorkspaceAddonModel = Model<IWorkspaceAddon>;

const WorkspaceAddonModelSchema = new Schema<
  IWorkspaceAddon,
  WorkspaceAddonModel
>({
  workspace_id: { type: Schema.Types.ObjectId, ref: workspaceModelSchema },
  addon_id: { type: Schema.Types.ObjectId, ref: addonModalSchema },
  enabled: { type: Boolean, default: true },
  activated_at: { type: Date, default: Date.now },
  usage: {
    units_used: { type: Number, default: 0 },
    limit_override: Number,
  },
  custom_pricing: {
    price_per_month: Number,
    price_per_unit: Number,
  },
});

// WorkspaceAddonModelSchema.index({ workspace: 1, addon: 1 }, { unique: true });

export default models.workspace_addon ||
  model<IWorkspaceAddon>("workspace_addon", WorkspaceAddonModelSchema);
