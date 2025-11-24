import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useFormikContext } from "formik";
import React from "react";
import CustomTooltip from "@/components/ui/CustomTooltip";
import EmojiPickerNew from "./EmojiPickerNew";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import { UnorderListIcon } from "@/components/ui/icons/UnorderListIcon";
import { OrderrListIcon } from "@/components/ui/icons/OrderList";
import TemplateBodySampleContent from "./TemplateBodySampleContent";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";

type Props = { index?: number | any };

const TemplateBodyForm = ({ index }: Props) => {
  const { values, errors, setFieldValue }: any = useFormikContext();

  return (
    <div className="w-full space-y-3 px-4 pb-4 pt-2">
    <div className="space-y-2">
      <Text size="lg" weight="semibold" className="leading-6">
        Body Message
      </Text>
      <Text size="sm" className="block">
        The Whatsapp message in the language you have selected
      </Text>
    </div>
    <Textarea
      placeholder="Enter your body message here..."
      className="h-[200px]"
      onChange={(e: any) => {
        setFieldValue(`components.${index}.text`, e.target.value);
      }}
      value={values?.components[index]?.text}
      errorKey={errors?.components?.length > 0 && errors?.components[index]?.text}
    />
    <div className="flex justify-end ">
      <div className="flex gap-3 items-center">
        <CustomTooltip value={"Emoji"} sideOffset={10}>
          <div>
            <EmojiPickerNew
              onChange={(emoji: string) => {
                const currentText = values?.components[index]?.text || "";
                setFieldValue(
                  `components.${index}.text`,
                  currentText + emoji
                );
              }}
            />
          </div>
        </CustomTooltip>{" "}
        <CustomTooltip value={"Bold"} sideOffset={10}>
          <div>
            <BoldIcon
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const currentText = values?.components[index]?.text || "";
                const selectedText = currentText.substring(start, end);

                let newText = "";
                if (selectedText) {
                  newText =
                    currentText.substring(0, start) +
                    `**${selectedText}**` +
                    currentText.substring(end);
                } else {
                  newText = currentText + " **";
                }

                setFieldValue(`components.${index}.text`, newText);

                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + 2, end + 2); // Adjust cursor inside bold text
                }, 10);
              }}
              className="w-3.5 h-3.5 text-[#304742] cursor-pointer"
            />
          </div>
        </CustomTooltip>
        <CustomTooltip value={"Italic"} sideOffset={10}>
          <div>
            {" "}
            <ItalicIcon
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const currentText = values?.components[index]?.text || "";
                const selectedText = currentText.substring(start, end);

                let newText = "";
                if (selectedText) {
                  newText =
                    currentText.substring(0, start) +
                    `_${selectedText}_` +
                    currentText.substring(end);
                } else {
                  // If no text is selected, add __Italic__
                  newText = currentText + " __";
                }

                setFieldValue(`components.${index}.text`, newText);

                // Refocus textarea after update
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + 2, end + 2); // Adjust cursor inside italics
                }, 10);
              }}
              className="w-3.5 h-3.5 text-[#304742] cursor-pointer"
            />
          </div>
        </CustomTooltip>
        <CustomTooltip value={"Strikethrough"} sideOffset={10}>
          <div>
            <StrikeThrough
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const currentText = values?.components[index]?.text || "";
                const selectedText = currentText.substring(start, end);

                let newText = "";
                if (selectedText) {
                  // Wrap selected text with ~~
                  newText =
                    currentText.substring(0, start) +
                    `~${selectedText}~` +
                    currentText.substring(end);
                } else {
                  // If no text is selected, add ~~Strikethrough~~
                  newText = currentText + " ~~";
                }

                setFieldValue(`components.${index}.text`, newText);

                // Refocus textarea after update
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + 2, end + 2); // Adjust cursor inside strikethrough
                }, 10);
              }}
              className="w-3.5 h-3.5 text-[#304742] cursor-pointer"
            />
          </div>
        </CustomTooltip>
        <CustomTooltip value={"Unordered List"} sideOffset={10}>
          <div>
            <UnorderListIcon
              onClick={() => {
                const fieldKey = `components.${index}.text`; // Get the correct Formik field
                const currentText = values?.components?.[index]?.text || "";

                // Insert "- text" at the end or start a new line
                const newText = currentText
                  ? currentText + "\n- text"
                  : "- text";

                // Update Formik state correctly
                setFieldValue(fieldKey, newText);
              }}
              className="w-3.5 h-3.5 text-[#304742] cursor-pointer"
            />
          </div>
        </CustomTooltip>
        <CustomTooltip value={"Ordered List"} sideOffset={10}>
          <div>
            <OrderrListIcon
              onClick={() => {
                const fieldKey = `components.${index}.text`; // Get the correct Formik field
                const currentText = values?.components?.[index]?.text || "";

                // Split existing text into lines
                const existingLines = currentText.split("\n");

                // Find the last ordered list number without modifying the original array
                const lastNumberedLine = [...existingLines]
                  .reverse()
                  .find((line) => /^\d+\./.test(line)); // Find the last numbered line

                const lastNumber = lastNumberedLine
                  ? parseInt(
                      lastNumberedLine.match(/^(\d+)\./)?.[1] || "0",
                      10
                    )
                  : 0;

                const nextNumber = lastNumber + 1 || 1; // Start from 1 if no numbers found

                // Insert the next ordered list item
                const newText = currentText
                  ? currentText + `\n${nextNumber}.text`
                  : `1.text`;

                // Update Formik state correctly
                setFieldValue(fieldKey, newText);
              }}
              className="w-3.5 h-3.5 text-[#304742] cursor-pointer"
            />
          </div>
        </CustomTooltip>
      </div>
    </div>{" "}
    <TemplateBodySampleContent />
  </div>
  );
};

export default TemplateBodyForm;
