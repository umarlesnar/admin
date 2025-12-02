import { TemplateIcon } from "@/components/ui/icons/TemplateIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Text from "@/components/ui/text";
import useWorkflowStore from "./WorkflowStore";
import { CodeIcon } from "@/components/ui/icons/CodeIcon";
import { ConditionIcon } from "@/components/ui/icons/ConditionIcon";
import { SwitchIcon } from "@/components/ui/icons/SwitchIcon";
import { ClockIcon } from "@/components/ui/icons/ClockIcon";
import { useState } from "react";
import { WebhookIcon } from "@/components/ui/icons/WebhookIcon";
import { OrderStatusIcon } from "@/components/ui/icons/OrderStatusIcon";
import { TransformIcon } from "@/components/ui/icons/TransformIcon";
import { NotesIcon } from "@/components/ui/icons/NotesIcon";
import { AttributeIcon } from "@/components/ui/icons/AttributeIcon";
import { BotIcon } from "@/components/ui/icons/BotIcon";
import { UserIcon } from "@/components/ui/icons/userIcon";

export function WorkflowNodeList({ children }: any) {
  const [open, setOpen] = useState(false);
  const { setNewNode } = useWorkflowStore();
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 max-h-[500px] overflow-y-auto space-y-2"
        align="end"
      >
        <div className="w-full">
          <Text size="base" weight="semibold">
            Nodes
          </Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("wb_template", "template", {
                wa_id: "",
                template_id: "",
                template_name: "",
                wba_variables: [],
                node_result_id: "",
              });
            setOpen(false);
          }}
        >
          <TemplateIcon className="w-5 h-5 text-icon-primary" />
          <Text>Send Template</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("shopify", "shopify", {
                store_admin_url: "",
                credential_id: "",
                type: "shopify",
                event_type: "",
              });
            setOpen(false);
          }}
        >
          <TemplateIcon className="w-5 h-5 text-icon-primary" />
          <Text>Shopify</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("order_details", "order_details", {
                body: {
                  text: "",
                },
                footer: {
                  text: "",
                },
                product_type: "",
                store_type: "",
                payment_configuration: {},
                expired_in_minutes: 0,
                shopify_credential_id: "",
                shipping_country_code: "IN",
                node_result_id: "",
              });
            setOpen(false);
          }}
        >
          <OrderStatusIcon className="w-5 h-5 text-icon-primary" />
          <Text>Order Details</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("whatsapp_order_status", "whatsapp_order_status", {
                body: "",
                reference_id: "",
                status: "",
                node_result_id: "",
                wa_id: "",
              });
            setOpen(false);
          }}
        >
          <OrderStatusIcon className="w-5 h-5 text-icon-primary" />
          <Text>Send Order Status</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("javascript", "javascript", {
                code: `function main(state, wh_response) { 
  // write your logic 
  
  return {} 
}`,
                args: ["@state", "@wh_response"],
                result_variable: "@result",
                is_start_node: false,
              });
            setOpen(false);
          }}
        >
          <CodeIcon className="w-5 h-5 text-icon-primary" />
          <Text>Code</Text>
        </div>
        <div
              className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
              onClick={() =>
                setNewNode &&
                setNewNode("dataTransform", "dataTransform", {
                  node_input: "@USER_MESSAGE_INPUT",
                  code: `// Transform the input data using Javascript
// Available variables: input, state

// Example: Extract and transform data

const result = {
    processed: true,
    timestamp: input.timestamp || "",
    data: input
};

return result;
`,
                  args: ["@state", "@input"],
                  result_variable: "@result",
                  is_start_node: true,
                })
              }
            >
              <TransformIcon className="w-6 h-6" />
              <Text size="xs" className="text-center text-[11px]">
                Transform
              </Text>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
              onClick={() =>
                setNewNode &&
                setNewNode("note", "note", {
                  text:`Add your notes here...`,
                })
              }
            >
              <NotesIcon className="w-5 h-5 " />
              <Text size="xs" className="text-center text-[11px]">
                Note
              </Text>
            </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("condition", "condition", {
                condition_result: {
                  y_result_node_id: "",
                  n_result_node_id: "",
                },
                condition_operator: 0,
                flow_node_conditions: [
                  {
                    id: Math.random().toString(20).slice(2),
                    flow_condition_type: 1,
                    variable: "",
                    value: "",
                  },
                ],
              });

            setOpen(false);
          }}
        >
          <ConditionIcon className="w-5 h-5 text-icon-primary" />
          <Text>Condition</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("switch", "switch_condition", {
                input_variable: "",

                switch_conditions: [
                  // {
                  //   id: "as",
                  //   rule: 1,
                  //   type: 1,
                  //   text: "",
                  //   node_result_id: "",
                  // },
                ],
                default_condition: {
                  id: "default",
                  rule: 0,
                  type: 0,
                  text: "Default",
                },
              });

            setOpen(false);
          }}
        >
          <SwitchIcon className="w-5 h-5 text-icon-primary" />
          <Text>Switch</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("delay", "delay", {
                delay: 0,
              });
            setOpen(false);
          }}
        >
          <ClockIcon className="w-5 h-5 text-icon-primary" />
          <Text>Set Delay</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("webhook", "web_hook", {
                body: "",
                method_type: "GET",
                url: "",
                headers: [],
                test_variable: [],
                response_variable: [],
                expected_status_code: [],
              });
          }}
        >
          <WebhookIcon className="w-5 h-5 text-icon-primary" />
          <Text>Webhook</Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("custom_attribute", "custom_attribute", {
                custom_params: {},
                wa_id: "",
              });
          }}
        >
          <AttributeIcon className="w-5 h-5 text-icon-primary" />
          <Text size="xs" className="text-center text-[11px]">
            Update Attribute
          </Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("trigger_chatbot", "trigger_chatbot", {
                flow_id: "",
                wa_id: "",
              });
          }}
        >
          <BotIcon className="w-5 h-5 text-icon-primary" />
          <Text size="xs" className="text-center text-[11px]">
            Trigger Chatbot
          </Text>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-md border border-border-teritary cursor-pointer"
          onClick={() => {
            setNewNode &&
              setNewNode("customer", "customer", {
                wa_id: "",
                mode:"upsert",
                custom_params: {},
              });
          }}
        >
          <UserIcon className="w-5 h-5 text-icon-primary" />
          <Text size="xs" className="text-center text-[11px]">
            Customer
          </Text>
        </div>
      </PopoverContent>
    </Popover>
  );
}
