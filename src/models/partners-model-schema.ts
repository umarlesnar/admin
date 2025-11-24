import { Document, Model, Schema, model, models } from "mongoose";

interface IPartners extends Document {
  name: Schema.Types.String;
  domain: Schema.Types.String;
  status: Schema.Types.String;
  owner_account_id: Schema.Types.ObjectId;
  created_at: Schema.Types.Number;
  updated_at: Schema.Types.Number;
}

type PartnersModel = Model<IPartners>;

const PartnersModelSchema = new Schema<IPartners, PartnersModel>({
  name: { type: Schema.Types.String },
  domain: { type: Schema.Types.String },
  owner_account_id: { type: Schema.Types.ObjectId },
  status: { type: Schema.Types.String, default: "ENABLE" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.partner ||
  model<IPartners>("partner", PartnersModelSchema);
