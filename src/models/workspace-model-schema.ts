import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

export interface WorkspaceBillingInfo {
  email_id: string;
  phone_number: string;
  billing_country: string;
  company_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
}

// Updated interface for Node Permissions with array hint
interface INodePermission {
  name: string;
  id: string;
  hint?: string[]; // Changed to array of strings
}

interface IWorkspaceAccount extends Document {
  domain: string;
  name: string;
  type: string;
  country_code: string;
  country_state: string;
  country: string;
  default_home_url: string;
  img_repo_id: string;
  owner_account_id: ObjectId;
  bot_user_id: ObjectId;
  policy_id: ObjectId;
  user_id: ObjectId;
  subscription_id: ObjectId;
  status: string;
  plan_name: string;
  billing_address: WorkspaceBillingInfo;
  notification: {
    email_id: string;
    phone_number: string;
  };
  status_changed_at?: Date;
  status_changed_by?: ObjectId | string;
  status_change_reason?: string;
  status_changed_ip?: string;
  industry?: string;
  phone_code?: string;
  currency?: string;
  timezone?: string;
  acquisition_source?: string;
  utm_campaign?: string;
  referral_code?: string;
  customer_tier?: string;
  support_level?: string;
  relationship_manager_id?: ObjectId;
  support_channels?: {
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
    chat: boolean;
  };
  response_sla_hours?: number;
  priority_level?: string;
  created_at: Date;
  updated_at: Date;
  // Field for node permissions
  nodes_available?: {
    bot_flow: INodePermission[];
    work_flow: INodePermission[];
  };
}

interface IWorkspaceMethods {}

type WorkspaceModel = Model<IWorkspaceAccount, {}, IWorkspaceMethods>;

// Updated Schema for Node Permission
const NodePermissionSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  hint: { type: [String], default: [] }, // Changed type to array of Strings
});

const WorkspaceModelSchema = new Schema<
  IWorkspaceAccount,
  WorkspaceModel,
  IWorkspaceMethods
>({
  domain: { type: String },
  name: { type: String },
  type: { type: String },
  country_code: { type: String, default: "91" },
  country: { type: String, default: "IN" },
  country_state: { type: String },
  default_home_url: { type: String },
  img_repo_id: { type: String },
  owner_account_id: { type: Types.ObjectId },
  bot_user_id: { type: Types.ObjectId },
  policy_id: { type: Types.ObjectId },
  plan_name: { type: String },
  user_id: { type: Types.ObjectId },
  subscription_id: { type: Types.ObjectId },
  status: { type: String, default: "ACTIVE" },
  billing_address: {
    email_id: { type: String },
    phone_number: { type: String },
    billing_country: { type: String },
    company_name: { type: String },
    address_1: { type: String },
    address_2: { type: String },
    city: { type: String },
    state: { type: String },
    zip_code: { type: String },
  },
  notification: {
    email_id: { type: String },
    phone_number: { type: String },
  },
  status_changed_at: { type: Schema.Types.Date },
  status_changed_by: { type: Schema.Types.Mixed },
  status_change_reason: { type: String },
  status_changed_ip: { type: String },
  industry: { type: String },
  phone_code: { type: String },
  currency: { type: String },
  timezone: { type: String },
  acquisition_source: { type: String },
  utm_campaign: { type: String },
  referral_code: { type: String },
  customer_tier: { type: String, default: "STANDARD" },
  support_level: { type: String, default: "STANDARD_SUPPORT" },
  relationship_manager_id: { type: Types.ObjectId },
  support_channels: {
    email: { type: Boolean, default: true },
    phone: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    chat: { type: Boolean, default: true },
  },
  response_sla_hours: { type: Number, default: 24 },
  priority_level: { type: String, default: "NORMAL" },
  
  // New Schema Structure
  nodes_available: {
    bot_flow: { type: [NodePermissionSchema], default: [] },
    work_flow: { type: [NodePermissionSchema], default: [] },
  },
  
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.workspace ||
  model<IWorkspaceAccount>("workspace", WorkspaceModelSchema);