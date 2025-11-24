import { Document, Model, Schema, model, models } from "mongoose";

interface IApplicationStore extends Document {
  name: Schema.Types.String;
  topic: Schema.Types.String;
  type: Schema.Types.String;
  data: Schema.Types.Mixed;
  is_active: Schema.Types.Boolean;
  updated_at: Schema.Types.Mixed;
}
type InstalledAppsModel = Model<IApplicationStore>;
const InstalledAppsSchema = new Schema<IApplicationStore, InstalledAppsModel>({
  name: { type: Schema.Types.String },
  topic: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  data: { type: Schema.Types.Mixed },
  is_active: { type: Schema.Types.Boolean },
  updated_at: { type: Schema.Types.Number },
});
export default models.application_store ||
  model<IApplicationStore>("application_store", InstalledAppsSchema);
