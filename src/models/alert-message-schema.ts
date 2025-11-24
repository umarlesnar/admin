import { Document, Model, Schema, model, models, ObjectId } from "mongoose";

interface IAlertMessage extends Document {
  domain: Schema.Types.String;
  title: Schema.Types.String;
  body: Schema.Types.String;
  type: Schema.Types.String;
  background_color: Schema.Types.String;
  ios_link: Schema.Types.String;
  android_link: Schema.Types.String;
  text_color: Schema.Types.String;
  workspace_id: Schema.Types.ObjectId;
  status: Schema.Types.String;
  buttons: [
    {
      title: Schema.Types.String;
      web_link: Schema.Types.String;
      ios_link: Schema.Types.String;
      android_link: Schema.Types.String;
      text_color: Schema.Types.String;
      background_color: Schema.Types.String;
    }
  ];
  created_at: Date;
  updated_at: Date;
}
type AlertMessageModel = Model<IAlertMessage>;
const AlertMessageModelSchema = new Schema<IAlertMessage, AlertMessageModel>({
  domain: { type: Schema.Types.String },
  title: { type: Schema.Types.String },
  body: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  background_color: { type: Schema.Types.String },
  ios_link: { type: Schema.Types.String },
  android_link: { type: Schema.Types.String },
  text_color: { type: Schema.Types.String },
  workspace_id: { type: Schema.Types.ObjectId },
  status: { type: Schema.Types.String },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  buttons: [
    {
      title: { type: Schema.Types.String },
      web_link: { type: Schema.Types.String },
      ios_link: { type: Schema.Types.String },
      android_link: { type: Schema.Types.String },
      text_color: { type: Schema.Types.String },
      background_color: { type: Schema.Types.String },
    },
  ],
});
export default models.alert_message ||
  model<IAlertMessage>("alert_message", AlertMessageModelSchema);
