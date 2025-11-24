import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IVmqSession extends Document {
  mountpoint: String;
  client_id: String;
  username: String;
  passhash: String;
  publish_acl: Schema.Types.Mixed;
  subscribe_acl: Schema.Types.Mixed;
  created_at: Date;
  status: { type: String };
  is_online: boolean;
}

type BusinessConversationModel = Model<IVmqSession>;

const VmqSessionSchema = new Schema<IVmqSession, BusinessConversationModel>(
  {
    mountpoint: { type: String, default: "" },
    client_id: { type: String },
    username: { type: String, required: true, index: true },
    passhash: { type: String },
    publish_acl: { type: Schema.Types.Mixed },
    subscribe_acl: { type: Schema.Types.Mixed },
    created_at: { type: Schema.Types.Date, default: new Date() },
    status: { type: String, default: "ACTIVE" },
    is_online: { type: Schema.Types.Boolean, default: false },
  },
  { collection: "vmq_acl_auth" }
);

export default models.vmq_acl_auth ||
  model<IVmqSession>("vmq_acl_auth", VmqSessionSchema);
