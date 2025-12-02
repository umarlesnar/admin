import { Document, Model, Schema, model, models } from "mongoose";

interface IInstalledApps extends Document {
  business_id: Schema.Types.ObjectId;
  type: Schema.Types.String;
  data: Schema.Types.Mixed;
  credential_id: Schema.Types.ObjectId;
  updated_at: Schema.Types.Mixed;
  is_micro_app: Schema.Types.Boolean;
  user_id: Schema.Types.ObjectId;
  configuration: Schema.Types.Mixed;
}
type InstalledAppsModel = Model<IInstalledApps>;
const InstalledAppsSchema = new Schema<IInstalledApps, InstalledAppsModel>({
  business_id: { type: Schema.Types.ObjectId },
  type: { type: Schema.Types.String },
  data: { type: Schema.Types.Mixed },
  credential_id: { type: Schema.Types.ObjectId },
  updated_at: { type: Schema.Types.Number },
  is_micro_app: { type: Schema.Types.Boolean, default: false },
  user_id: { type: Schema.Types.ObjectId },
  configuration: { type: Schema.Types.Mixed },
});
export default models.installed_apps ||
  model<IInstalledApps>("installed_apps", InstalledAppsSchema);
