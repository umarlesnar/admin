import { Document, Model, Schema, model, models } from "mongoose";

interface ICredentialManager extends Document {
  business_id: Schema.Types.ObjectId;
  name: Schema.Types.String;
  type: Schema.Types.String;
  iv: Schema.Types.String;
  data: Schema.Types.Mixed;
  user_id: Schema.Types.ObjectId;
  created_at: Schema.Types.Number;
  updated_at: Schema.Types.Number;
}
type CredentialManagerModel = Model<ICredentialManager>;
const CredentialManagerModelSchema = new Schema<
  ICredentialManager,
  CredentialManagerModel
>({
  business_id: { type: Schema.Types.ObjectId },
  name: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  iv: { type: Schema.Types.String },
  data: { type: Schema.Types.Mixed },
  user_id: { type: Schema.Types.ObjectId },
  created_at: { type: Schema.Types.Number },
  updated_at: { type: Schema.Types.Number },
});
export default models.credential_manager ||
  model<ICredentialManager>("credential_manager", CredentialManagerModelSchema);
