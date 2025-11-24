import { Document, Model, Schema, model, models, ObjectId } from "mongoose";

interface IMediaFile extends Document {
  img_repo_id: String;
  file_path: String;
  name: String;
  type: String;
  module: string;
  content_type: String;
  size: Schema.Types.Number;
  info: Schema.Types.Mixed;
  status: String;
  // created_by: Schema.Types.ObjectId;
  created_at: Date;
}

type MediaFileModel = Model<IMediaFile>;

const MediaFileModelSchema = new Schema<IMediaFile, MediaFileModel>({
  file_path: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  content_type: { type: Schema.Types.String },
  module: { type: Schema.Types.String },
  size: { type: Schema.Types.Number },
  info: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.String },
  // created_by: { type: Schema.Types.ObjectId },
  created_at: { type: Schema.Types.Date, default: Date.now() },
});

export default models.media_file ||
  model<IMediaFile>("media_file", MediaFileModelSchema);
