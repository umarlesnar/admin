import {
  Document,
  Mixed,
  Model,
  ObjectId,
  Schema,
  model,
  models,
} from "mongoose";

interface IWorkspaceUser extends Document {
  user_account_id: ObjectId;
  workspace_id: ObjectId;
  first_name: string;
  last_name: string;
  is_bot: boolean;
  role: string;
  status: string;
  permissions: Mixed;
  created_at: Date;
  updated_at: Date;
}

type WorkspaceModel = Model<IWorkspaceUser>;

const WorkspaceUserModelSchema = new Schema<IWorkspaceUser, WorkspaceModel>({
  user_account_id: { type: Schema.Types.ObjectId, default: null },
  workspace_id: { type: Schema.Types.ObjectId },
  first_name: { type: Schema.Types.String },
  last_name: { type: Schema.Types.String },
  is_bot: { type: Schema.Types.Boolean, default: false },
  role: { type: Schema.Types.String },
  permissions: { type: Schema.Types.Mixed },
  status: {
    type: Schema.Types.String,
    enum: ["ACTIVE", "INVITE", "DELETED", "TRANSFERED", "BLOCKED", "SUSPENDED"],
    default: "INVITE",
  },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.workspace_user ||
  model("workspace_user", WorkspaceUserModelSchema);
