import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IJobQueue extends Document {
  channel: String;
  job: Schema.Types.Mixed;
  delay: Schema.Types.Number;
  done_at: Schema.Types.Number;
  priority: Schema.Types.Number;
  pushed_at: Schema.Types.Number;
  reserved_at: Schema.Types.Number;
  attempt: Schema.Types.Number;
  expired_at: Date;
  created_at: Date;
}

type JobQueueModel = Model<IJobQueue>;

const JobQueueModelSchema = new Schema<IJobQueue, JobQueueModel>(
  {
    channel: { type: Schema.Types.String },
    job: { type: Schema.Types.Mixed },
    delay: { type: Schema.Types.Number },
    done_at: { type: Schema.Types.Number },
    priority: { type: Schema.Types.Number },
    pushed_at: { type: Schema.Types.Number },
    reserved_at: { type: Schema.Types.Number },
    attempt: { type: Schema.Types.Number },
    expired_at: { type: Date },
    created_at: { type: Schema.Types.Date, default: new Date() },
  },
  { collection: "job_queue" }
);

JobQueueModelSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 });
export default models.job_queue ||
  model<IJobQueue>("job_queue", JobQueueModelSchema);
