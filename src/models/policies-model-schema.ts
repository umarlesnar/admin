import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IPolicies extends Document {
  domain: Schema.Types.String;
  name: Schema.Types.String;
  description: Schema.Types.String;
  type: Schema.Types.String;
  status: Schema.Types.String;
  limits: Schema.Types.Mixed;
  created_at: Date;
  updated_at: Date;
}

interface IPoliciesMethods {}

type IPoliciesModel = Model<IPolicies, IPoliciesMethods>;

const PoliciesModelSchema = new Schema<
IPolicies,
IPoliciesMethods,
IPoliciesModel
>({
  domain: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ACTIVE" },
  limits: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.Policies||
  model<IPolicies>("Policies", PoliciesModelSchema);
