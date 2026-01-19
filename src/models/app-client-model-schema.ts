import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IAppClient extends Document {
  app_id: Schema.Types.ObjectId;
  app_slug: Schema.Types.String;
  client_id: Schema.Types.String;
  client_secret: Schema.Types.String;
  webhook_url: Schema.Types.String;
  redirect_url: Schema.Types.String;
  available_scopes: Schema.Types.Array;
  app_install_event_url: Schema.Types.String;
  app_uninstall_event_url: Schema.Types.String;
  webhook_secret: Schema.Types.String;
  webhook_events: Schema.Types.Array;
  status: Schema.Types.String;
}

interface IAppClientMethods {}

type IAppClientModel = Model<IAppClient, IAppClientMethods>;

const AppClientSchema = new Schema<
  IAppClient,
  IAppClientMethods,
  IAppClientModel
>({
  app_id: { type: Schema.Types.ObjectId, required: true },
  app_slug: { type: Schema.Types.String, required: true },
  client_id: { type: Schema.Types.String, required: true },
  client_secret: { type: Schema.Types.String, required: true },
  webhook_url: { type: Schema.Types.String },
  redirect_url: { type: Schema.Types.String },
  available_scopes: { type: Schema.Types.Array, default: [] },
  app_install_event_url: { type: Schema.Types.String },
  app_uninstall_event_url: { type: Schema.Types.String },
  webhook_secret: { type: Schema.Types.String },
  webhook_events: { type: Schema.Types.Array, default: [] },
  status: { type: Schema.Types.String, default: "ENABLED" },
});

export default models.app_client ||
  model<IAppClient>("app_client", AppClientSchema);
