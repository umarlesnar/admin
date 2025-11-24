import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

interface ITemplateLibrary extends Document {
  user_id?: Types.ObjectId;
  name: String;
  language: String;
  category: String;
  components: Schema.Types.Mixed;
  wba_components: Schema.Types.Mixed;
  industry_id: ObjectId;
  use_case_id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

type TemplateLibrary = Model<ITemplateLibrary>;

const TemplateLibrarySchema = new Schema<ITemplateLibrary, TemplateLibrary>({
  user_id: { type: Types.ObjectId },
  name: { type: String },
  language: { type: String },
  category: { type: String },
  industry_id: { type: Types.ObjectId },
  use_case_id: { type: Types.ObjectId },
  components: { type: Schema.Types.Mixed },
  wba_components: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.template_library ||
  model<ITemplateLibrary>("template_library", TemplateLibrarySchema);
