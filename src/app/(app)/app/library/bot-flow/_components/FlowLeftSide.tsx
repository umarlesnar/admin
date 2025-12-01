import React from "react";
import useStore from "./store";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Text from "@/components/ui/text";
import { MessageIcon } from "@/components/ui/icons/MessageIcon";
import { ConditionIcon } from "@/components/ui/icons/ConditionIcon";
import { SwitchIcon } from "@/components/ui/icons/SwitchIcon";
import { WebhookIcon } from "@/components/ui/icons/WebhookIcon";
import { MessegeIcon } from "@/components/ui/icons/MessegeIcon";
import { TemplateIcon } from "@/components/ui/icons/TemplateIcon";
import { QuestionIcon } from "@/components/ui/icons/QuestionIcon";
import { AssignMemberIcon } from "@/components/ui/icons/AssignMemberIcon";
import { SetTagsIcon } from "@/components/ui/icons/SetTagsIcon";
import { CampaignIcon } from "@/components/ui/icons/CampaignIcon";
import { CatalogueIcon } from "@/components/ui/icons/CatalogueIcon";
import { ProductIcon } from "@/components/ui/icons/ProductIcon";
import { OrderStatusIcon } from "@/components/ui/icons/OrderStatusIcon";
import { LocationIcon } from "@/components/ui/icons/LocationIcon";
import { CollectionIcon } from "@/components/ui/icons/CollectionIcon";
import { ButtonFlowIcon } from "@/components/ui/icons/ButtonFlowIcon";
import { ListFlowIcon } from "@/components/ui/icons/ListFlowIcon";
import { GoogleSheetsBrandIcon } from "@/components/ui/integration-icons/GoogleSheetsBrandIcon";
import { MediaIcon } from "@/components/ui/icons/MediaIcon";
import { OpenAiIcon } from "@/components/ui/icons/OpenAiIcon";
import { RazorPayBrandIcon } from "@/components/ui/integration-icons/RazorPayBrandIcon";
import { SequenceIcon } from "@/components/ui/icons/SequenceIcon";
import { TransformIcon } from "@/components/ui/icons/TransformIcon";
import { NotesIcon } from "@/components/ui/icons/NotesIcon";
import { WebViewIcon } from "@/components/ui/icons/WebViewIcon";

type Props = {};

const FlowLeftSide = (props: Props) => {
  const { setNewNode } = useStore();
  return (
    <div className="p-3 space-y-2 overflow-y-auto bg-scroll">
      {/* <SearchBox placeholder="Search Actions/Operations/Catalogs" /> */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-2 hover:no-underline">
            Actions
          </AccordionTrigger>
          <AccordionContent className="gap-3 grid grid-cols-2">
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("message", "main_message", {
                  flow_replies: {
                    type: "text",
                    data: "",
                  },
                  node_result_id: "",
                })
              }
            >
              <MessageIcon className="w-5 h-5 text-red-400" />
              <Text>Send a message</Text>
            </div>

            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("question", "question", {
                  flow_replies: {
                    type: "1",
                    data: "",
                    caption: "",
                    mime_type: "",
                  },
                  answer_validation: {
                    type: 2,
                    min: "",
                    max: "",
                    regex: "",
                    fallback: "",
                    failsCount: "",
                  },
                  user_input_variable: "@action",
                  node_result_id: "",
                })
              }
            >
              <QuestionIcon className="w-5 h-5 text-orange-400" />
              <Text>Ask a Question</Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("askAddress", "askAddress", {
                  flow_replies: {
                    type: "1",
                    data: "",
                    caption: "",
                    mime_type: "",
                  },
                  answer_validation: {
                    type: 2,
                    min: "",
                    max: "",
                    regex: "",
                    fallback: "",
                    failsCount: "",
                  },
                  user_input_variable: "@action",
                  node_result_id: "",
                })
              }
            >
              <LocationIcon className="w-5 h-5 text-orange-400" />
              <Text>Ask Address</Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("askMedia", "askMedia", {
                  flow_replies: {
                    type: "1",
                    data: "",
                    caption: "",
                    mime_type: "",
                  },
                  answer_validation: {
                    type: 2,
                    min: "",
                    max: "",
                    regex: "",
                    accept_file_type: [],
                    fallback: "",
                    failsCount: 1,
                  },
                  user_input_variable: "",
                  node_result_id: "",
                })
              }
            >
              <MediaIcon className="w-5 h-5 text-orange-400" />
              <Text size="xs" className="text-center text-[11px]">
                Ask Media
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("choices", "choice_message", {
                  flow_replies: {
                    type: "1",
                    data: "",
                    caption: "",
                    mime_type: "",
                  },
                  answer_validation: {
                    type: 2,
                    min: "",
                    max: "",
                    regex: "",
                    fallback: "",
                    failsCount: "",
                  },
                  user_input_variable: "@action",
                  expected_answers: [
                    {
                      id: "54035d4ffcii7",
                      expected_input: "",
                      isDefault: false,
                      node_result_id: "",
                    },
                  ],
                })
              }
            >
              <ButtonFlowIcon className="w-5 h-5 text-orange-400" />
              <Text>Buttons</Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("choicesList", "choice_list", {
                  interactiveListHeader: "",
                  interactiveListBody: "",
                  interactiveListFooter: "",
                  interactiveListButton: "Menu Here",
                  interactiveListSections: [
                    {
                      id: Math.random().toString(10).slice(2),
                      title: "",
                      rows: [
                        {
                          id: Math.random().toString(20).slice(2),
                          title: "",
                          description: "",
                          descriptionEnable: false,
                          node_result_id: "",
                        },
                      ],
                    },
                  ],
                  user_input_variable: "@action",
                })
              }
            >
              <ListFlowIcon className="w-5 h-5 text-orange-400" />
              <Text>Lists</Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("webview", "webview", {
                  flow_replies: {
                    header_text: "",
                    body_text: "",
                    footer_text: "",
                    url: "",
                    button_text: "Visit",
                  },
                  node_result_id: "",
                })
              }
            >
              <WebViewIcon className="w-5 h-5 text-orange-400" />
              <Text size="xs" className="text-center text-[11px]">
                Webview
              </Text>
            </div>
            <div
              className="w-full h-10 border border-border-teritary rounded-md flex items-center gap-3 p-3 cursor-pointer"
              onClick={() =>
                setNewNode &&
                setNewNode("condition", "condition", {
                  condition_result: {
                    y_result_node_id: "",
                    n_result_node_id: "",
                  },
                  condition_operator: 0,
                  flow_node_conditions: [
                    {
                      id: "as",
                      flow_condition_type: 1,
                      variable: "",
                      value: "",
                    },
                  ],
                })
              }
            >
              <ConditionIcon className="w-5 h-5 text-violet-400" />
              <Text>Set a condition</Text>
            </div>
            <div
              className="w-full h-10 border border-border-teritary rounded-md flex items-center gap-3 p-3 cursor-pointer"
              onClick={() =>
                setNewNode &&
                setNewNode("switch", "switch_condition", {
                  input_variable: "",

                  switch_conditions: [
                    {
                      id: "as",
                      rule: 1,
                      type: 1,
                      text: "",
                      node_result_id: "",
                    },
                  ],
                  default_condition: {
                    id: "default",
                    rule: 0,
                    type: 0,
                    text: "Default",
                  },
                })
              }
            >
              <SwitchIcon className="w-6 h-6 text-violet-400" />
              <Text>Switch</Text>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="py-2 hover:no-underline">
            Operations
          </AccordionTrigger>
          <AccordionContent className="gap-3 grid grid-cols-2">
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("updateChatStatus", "update_chat_status", {
                    status: "open",
                  });
              }}
            >
              <MessegeIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Chat Status
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("template", "template", {
                    type: "wb_template",
                    template_id: "",
                    template_name: "",
                    wba_variables: [],
                    node_result_id: "",
                  });
              }}
            >
              <TemplateIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Template
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("assignAgent", "assign_agent", {
                    operator: null,
                  });
              }}
            >
              <AssignMemberIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Assign Operator
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("setTags", "set_tags", {
                    tags: null,
                  });
              }}
            >
              <SetTagsIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Set Tags
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode(
                    "updateBroadcastStatus",
                    "update_broadcast_status",
                    {
                      enable_broadcast: true,
                      node_result_id: "",
                    }
                  );
              }}
            >
              <CampaignIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Campaign Status
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("assignSequence", "assign_sequence", {
                    sequence_id: "",
                  });
              }}
            >
              <SequenceIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Assign Sequence
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="py-2 hover:no-underline">
            Catalogs
          </AccordionTrigger>
          <AccordionContent className="gap-3 grid grid-cols-2">
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("catalogType", "catalog", {
                    body: "Checkout our all products here",
                    footer: "",
                    node_result_id: "",
                  });
              }}
            >
              <CatalogueIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Catalog{" "}
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("catalogSet", "catalog_set", {
                    body: "Checkout our all products here",
                    catalog_id: "",
                    set_id: "",
                    products: [],
                    name: "",
                    product_count: 0,
                    node_result_id: "",
                  });
              }}
            >
              <CollectionIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Sets
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("catalogProduct", "catalog_product", {
                    body: "View the Product",
                    catalog_id: "",
                    product_id: "",
                    name: "",
                    product_price: "",
                    image_url: "",
                    retailer_id: "",
                    node_result_id: "",
                  });
              }}
            >
              <ProductIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Products
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("whatsapp_order_status", "whatsapp_order_status", {
                    body: "",
                    reference_id: "",
                    status: "",
                    wa_id: "",
                    node_result_id: "",
                  });
              }}
            >
              <OrderStatusIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Send Order Status
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
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
              }}
            >
              <OrderStatusIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Order Details
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("clearCart", "clearCart", { node_result_id: "" });
              }}
            >
              <OrderStatusIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Clear Cart
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="py-2 hover:no-underline">
            Integration
          </AccordionTrigger>
          <AccordionContent className="gap-3 grid grid-cols-2">
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() => {
                setNewNode &&
                  setNewNode("googleSheet", "googleSheet", {
                    access_token: "",
                    configuration: {
                      credential_id: "",
                      spreadsheet_id: "",
                      action: "ADD_ROW",
                      columns: [
                        {
                          name: "",
                          value: "",
                          id: 0,
                        },
                      ],
                    },
                    is_start_node: true,
                    node_result_id: "",
                  });
              }}
            >
              <GoogleSheetsBrandIcon className="w-5 h-5 text-icon-primary" />
              <Text size="xs" className="text-center text-[11px]">
                Google Sheet
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("webhook", "web_hook", {
                  body: "",
                  method_type: "GET",
                  url: "",
                  headers: [],
                  test_variable: [],
                  response_variable: [],
                  expected_status_code: [],
                })
              }
            >
              <WebhookIcon className="w-6 h-6 text-yellow-500" />
              <Text size="xs" className="text-center text-[11px]">
                Webhook
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("openAI", "openAI_message", {
                  node_result_id: "",
                  configuration: {
                    api_key: "",
                    model: "",
                    max_tokens: 2048,
                    temperature: 0.7,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                  },
                  message: [],
                })
              }
            >
              <OpenAiIcon className="w-6 h-6" />
              <Text size="xs" className="text-center text-[11px]">
                OpenAi
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("aiPrompt", "ai-prompt", {
                  node_result_id: "",
                })
              }
            >
              <OpenAiIcon className="w-6 h-6" />
              <Text size="xs" className="text-center text-[11px]">
                User Prompt
              </Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("rz_payment_link", "razorpay", {
                  type: "standard",
                  credential_id: "",
                  amount: "@payment",
                  currency: "INR",
                  payment_notes: "",
                  node_result_id: "",
                  user_input_variable: "@payent_link",
                })
              }
            >
              <RazorPayBrandIcon className="w-6 h-6" />
              <Text size="xs" className="text-center text-[11px]">
                Razorpay
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="py-2 hover:no-underline">
            Logical
          </AccordionTrigger>
          <AccordionContent className="gap-3 grid grid-cols-2">
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("condition", "condition", {
                  condition_result: {
                    y_result_node_id: "",
                    n_result_node_id: "",
                  },
                  condition_operator: 0,
                  flow_node_conditions: [
                    {
                      id: "as",
                      flow_condition_type: 1,
                      variable: "",
                      value: "",
                    },
                  ],
                })
              }
            >
              <ConditionIcon className="w-5 h-5 text-violet-400" />
              <Text>Set a condition</Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("switch", "switch_condition", {
                  input_variable: "",

                  switch_conditions: [
                    {
                      id: "as",
                      rule: 1,
                      type: 1,
                      text: "",
                      node_result_id: "",
                    },
                  ],
                  default_condition: {
                    id: "default",
                    rule: 0,
                    type: 0,
                    text: "Default",
                  },
                })
              }
            >
              <SwitchIcon className="w-6 h-6 text-violet-400" />
              <Text>Switch</Text>
            </div>
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
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
              <TransformIcon className="w-6 h-6 text-violet-500" />
              <Text size="xs" className="text-center text-[11px]">
                Transform
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="py-2 hover:no-underline">
            Others
          </AccordionTrigger>
          <AccordionContent className="gap-3 grid grid-cols-2">
            <div
              className="w-full border border-border-teritary rounded-md gap-2 p-2 cursor-pointer flex flex-col items-center justify-center"
              onClick={() =>
                setNewNode &&
                setNewNode("note", "note", {
                  text: `Add your notes here...`,
                })
              }
            >
              <NotesIcon className="w-5 h-5 text-orange-400" />
              <Text size="xs" className="text-center text-[11px]">
                Note
              </Text>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FlowLeftSide;
