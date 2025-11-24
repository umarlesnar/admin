import { DocumentFormatIcon } from "@/components/ui/icons/DocumentFormatIcon";
import { ImageFormatIcon } from "@/components/ui/icons/ImageFormatIcon";
import { VideoFormatIcon } from "@/components/ui/icons/VideoFormatIcon";
import Text from "@/components/ui/text";
import { getWhatsappTextFormat } from "@/lib/utils/get-whatsapp-text-format";
import { useFormikContext } from "formik";
import React from "react";

function replacePlaceholders(template: any, values: any) {
  if (!values || values.length === 0) return template;

  let index = 0;
  return template.replace(/\{\{(\w+)\}\}/g, (match: any) => {
    if (
      index < values.length &&
      values[index] !== undefined &&
      values[index] !== null &&
      values[index] !== ""
    ) {
      return values[index++];
    }
    index++;
    return match;
  });
}

type Props = {};

const TemplatePreview = (props: Props) => {
  const { values }: any = useFormikContext();

  return (
    <div className="w-full h-full bg-white rounded-md p-4">
      <div className="w-full h-full rounded-md border border-border-teritary flex flex-col">
        <div className="w-full h-12 bg-neutral-10 flex items-center p-2">
          <Text size="lg" weight="semibold">
            Template Preview
          </Text>
        </div>
        <div className="w-full flex-1 bg-[#f3e9df] p-3 overflow-y-auto bg-scroll">
          <div className="w-full bg-white p-2 min-h-20 rounded space-y-2">
            {values?.components.map((component: any, index: number) => {
              return (
                <>
                  {component.type == "HEADER" ? (
                    component.format == "TEXT" ? (
                      <Text size="base" weight="medium" key={index}>
                        {replacePlaceholders(
                          component.text || "",
                          component?.example?.header_text || []
                        )}
                      </Text>
                    ) : component.format == "IMAGE" ? (
                      <div
                        className="w-full h-52 relative rounded-md"
                        key={index}
                      >
                        {component?.example1?.header_handle[0] ? (
                          <img
                            src={component?.example1?.header_handle[0]}
                            alt="Template Image"
                            className="absolute  rounded-md object-contain"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center rounded bg-neutral-30">
                            <ImageFormatIcon className="w-14 h-14 text-icon-primary" />
                          </div>
                        )}
                      </div>
                    ) : component.format == "VIDEO" ? (
                      <div className="w-full h-40 relative" key={index}>
                        {component?.example1?.header_handle[0] ? (
                          <video
                            src={component?.example1?.header_handle[0]}
                            controls
                            className="w-full max-h-40 rounded-md"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center rounded bg-neutral-30">
                            <VideoFormatIcon className="w-14 h-14 text-icon-primary" />
                          </div>
                        )}
                      </div>
                    ) : component.format == "DOCUMENT" ? (
                      <div className="w-full h-40 relative" key={index}>
                        {component?.example1?.header_handle[0] ? (
                          <iframe
                            className="w-full h-full bg-neutral-20 rounded-md relative"
                            src={component?.example1?.header_handle[0]}
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center rounded bg-neutral-30">
                            <DocumentFormatIcon className="w-14 h-14 text-icon-primary" />
                          </div>
                        )}
                      </div>
                    ) : null
                  ) : component.type == "BODY" ? (
                    <Text
                      className="whitespace-break-spaces px-1 break-words"
                      html={getWhatsappTextFormat(
                        replacePlaceholders(
                          component.text || "",
                          component?.example?.body_text || []
                        ) || ""
                      )}
                      key={index}
                    />
                  ) : component.type == "FOOTER" ? (
                    <Text
                      size="xs"
                      weight="light"
                      color="secondary"
                      className="whitespace-break-spaces px-1 break-words py-2"
                      html={getWhatsappTextFormat(component.text || "")}
                      key={index}
                    />
                  ) : component.type == "BUTTONS" ? (
                    <div key={index}>
                      {component.buttons.map((button: any, index: number) => {
                        return (
                          <div
                            className="w-full h-10 flex items-center justify-center text-center border-t border-border-teritary"
                            key={"button" + index}
                          >
                            <Text textColor="text-blue-600" weight="medium">
                              {button.text}
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  ) : component.type == "carousel" ? (
                    <div
                      key={index}
                      className="w-full overflow-x-auto flex gap-3 bg-scroll pb-2"
                    >
                      {component?.cards?.map((card: any, idx: number) => (
                        <div
                          key={idx}
                          className="min-w-[260px] max-w-[260px] h-auto flex-shrink-0 rounded-md border bg-white p-2 space-y-2"
                        >
                          {card?.components?.map((comp: any, _idx: number) => (
                            <div key={_idx} className="space-y-2">
                              {comp?.type == "header" &&
                                (comp?.format == "image" ? (
                                  <div
                                    className="w-full h-44 relative rounded-md"
                                    key={index}
                                  >
                                    {comp?.example1?.header_handle?.length >
                                    0 ? (
                                      <img
                                        src={comp?.example1?.header_handle[0]}
                                        alt="Template Image"
                                        className="absolute w-full h-full rounded-md object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-32 flex items-center justify-center rounded bg-neutral-30">
                                        <ImageFormatIcon className="w-14 h-14 text-icon-primary" />
                                      </div>
                                    )}
                                  </div>
                                ) : comp?.format == "video" ? (
                                  <div className="w-full relative" key={index}>
                                    {comp?.example1?.header_handle[0] ? (
                                      <video
                                        src={comp?.example1?.header_handle[0]}
                                        controls
                                        className="w-full rounded-md"
                                      />
                                    ) : (
                                      <div className="w-full h-32 flex items-center justify-center rounded bg-neutral-30">
                                        <VideoFormatIcon className="w-14 h-14 text-icon-primary" />
                                      </div>
                                    )}
                                  </div>
                                ) : null)}
                              {comp?.type == "body" && (
                                <div className="text-sm text-gray-700 px-1">
                                  <Text
                                    className="whitespace-break-spaces px-1 break-words"
                                    html={getWhatsappTextFormat(
                                      comp.text || ""
                                    )}
                                    key={index}
                                  />
                                </div>
                              )}
                              {comp?.type == "buttons" && (
                                <div className="pt-2">
                                  {comp.buttons.map(
                                    (button: any, index: number) => {
                                      return (
                                        <div
                                          className="w-full h-10 flex items-center justify-center text-center border-t border-border-teritary"
                                          key={"button" + index}
                                        >
                                          <Text
                                            textColor="text-blue-600"
                                            weight="medium"
                                          >
                                            {button.text}
                                          </Text>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
