import { Document, Model, Schema, model, models } from "mongoose";

interface ITemplateLibrary extends Document {
  name: Schema.Types.String;
  category: Schema.Types.String;
  platform: Schema.Types.String;
  node: Schema.Types.Mixed;
  tags: Schema.Types.Mixed;
  is_active: Schema.Types.Boolean;
}
type TemplateLibraryModel = Model<ITemplateLibrary>;
const TemplateLibrarySchema = new Schema<
  ITemplateLibrary,
  TemplateLibraryModel
>({
  name: { type: Schema.Types.String },
  platform: { type: Schema.Types.String },
  category: { type: Schema.Types.String },
  node: { type: Schema.Types.Mixed },
  tags: { type: Schema.Types.ObjectId },
  is_active: { type: Schema.Types.Boolean },
});
export default models.template_library ||
  model<ITemplateLibrary>("template_library", TemplateLibrarySchema);

/*
  {
    "language":"",
    "name":"",
    "topic":"",
    "header":"",
    "header_media_src":"",
    "header_text_params":"",
    "header_type":"",
    "template_body":"",
    "footer":null,
    "buttons":[]
    }
*/
