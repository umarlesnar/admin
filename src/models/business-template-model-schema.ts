import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IBusinessTemplate extends Document {
  workspace_id?: Types.ObjectId;
  business_id?: Types.ObjectId;
  user_id?: Types.ObjectId;
  name: String;
  language: String;
  category: String;
  status: String;
  sms: Schema.Types.Mixed;
  components: Schema.Types.Mixed;
  wba_template_id: String;
  wba_variables: Schema.Types.Mixed;
  wba_components: Schema.Types.Mixed;
  created_at: Date;
  updated_at: Date;
}

type BusinessModel = Model<IBusinessTemplate>;

const BusinessTemplateSchema = new Schema<IBusinessTemplate, BusinessModel>({
  workspace_id: { type: Types.ObjectId },
  business_id: { type: Types.ObjectId },
  user_id: { type: Types.ObjectId },
  name: { type: String },
  language: { type: String },
  category: { type: String },
  status: { type: String },
  sms: { type: Schema.Types.Mixed },
  components: { type: Schema.Types.Mixed },
  wba_template_id: { type: String },
  wba_variables: { type: Schema.Types.Mixed },
  wba_components: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.business_template ||
  model<IBusinessTemplate>("business_template", BusinessTemplateSchema);
