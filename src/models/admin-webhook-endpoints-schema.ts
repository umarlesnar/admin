import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IAdminWebhookEndpoints extends Document {
  workspace_id: Types.ObjectId;
  name: Schema.Types.String;
  url: string;
  events: any[];
  topic: String;
  status: Schema.Types.String;
  created_at: Date;
}

interface IAdminWebhookEndpointsMethods {}

type IAdminWebhookEndpointsModel = Model<IAdminWebhookEndpoints, IAdminWebhookEndpointsMethods>;

const AdminWebhookEndpointsSchema = new Schema<
IAdminWebhookEndpoints,
IAdminWebhookEndpointsMethods,
IAdminWebhookEndpointsModel
>({
  workspace_id: { type: Schema.Types.ObjectId },
  name: { type: Schema.Types.String },
  url: { type: String },
  topic: { type: String },
  events: { type: Schema.Types.Mixed, default: [] },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.admin_webhook_endpoints ||
  model<IAdminWebhookEndpoints>("admin_webhook_endpoints", AdminWebhookEndpointsSchema);
