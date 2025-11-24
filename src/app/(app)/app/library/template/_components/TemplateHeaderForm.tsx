"use client";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { DocumentFormatIcon } from "@/components/ui/icons/DocumentFormatIcon";
import { ImageFormatIcon } from "@/components/ui/icons/ImageFormatIcon";
import { TextFormatIcon } from "@/components/ui/icons/TextFormatIcon";
import { VideoFormatIcon } from "@/components/ui/icons/VideoFormatIcon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import { useMediaUploadMutation } from "@/framework/media/media-upload-mutation";
// import { useMediaUploadMutation } from "@/framework/media/media-upload-mutation";
import axios from "axios";
import { useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";

type Props = { index?: number | any; header: any };

const headerFormats = [
  // { name: "None", value: "NONE" },
  { name: "Text", value: "TEXT" },
  { name: "Image", value: "IMAGE" },
  { name: "Video", value: "VIDEO" },
  { name: "Document", value: "DOCUMENT" },
];

const TemplateHeaderForm = ({ index, header }: Props) => {
  const inputRef = useRef(null);
  const [accept, setAccept] = useState<string>();
  const { values, errors, setFieldValue, handleChange }: any =
    useFormikContext();
  const _format = header.format;
  // const media = useMediaUploadMutation();
  const { business } = useApplication();

  useEffect(() => {
    if (_format == "IMAGE") {
      setAccept("image/png,image/jpeg");
    } else if (_format == "VIDEO") {
      setAccept("video/MP4,video/3GPP");
    } else if (_format == "DOCUMENT") {
      setAccept(".pdf");
    } else {
      setAccept("");
    }
  }, [_format]);

  const media = useMediaUploadMutation();

  const changeHandler = async (event: any) => {
    event.preventDefault();

    const fileUploaded = event.target.files[0];

    if (fileUploaded) {
      const formData = new FormData();
      formData.append("file", fileUploaded);

      // const response = await axios.post(
      //   "/api/business/" + business._id + "/template/temp-media",
      //   formData,
      //   {
      //     headers: {
      //       "content-type": "multipart/form-data",
      //     },
      //   }
      // );
      // setFieldValue(`components.${0}.example`, {
      //   header_handle: [response.public_url || ""],
      // });

      const res = await media.mutateAsync({
        payload: fileUploaded,
      });

      const full_url = res.public_url;

      setFieldValue(`components.${0}.example1`, {
        header_handle: [full_url],
      });
    }

    event.target.value = null;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-1">
        <Text size="lg" weight="semibold" className="leading-6">
          Header
        </Text>
        <Text
          size="sm"
          weight="semibold"
          color="secondary"
          className="leading-6 mt-1"
        >{`(Optional)`}</Text>
      </div>
      <Text size="sm" className="block">
        {`Add a title, or, select the media type you want to get approved for this
        template's header`}
      </Text>

      <div className="w-full min-h-10 flex items-center gap-3 flex-wrap">
        <div
          className="cursor-pointer h-full flex items-center justify-center gap-3 px-2"
          onClick={() => {
            setFieldValue(`components.${index}`, {
              type: "HEADER",
              format: "NONE",
            });
          }}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              _format == "NONE"
                ? "bg-primary  ring-1 ring-offset-[3px] ring-primary "
                : " ring-1 ring-offset-[3px] ring-neutral-50"
            }`}
          ></div>
          <Text
            size="sm"
            weight="semibold"
            className={_format == "NONE" ? "text-primary" : "text-text-primary"}
          >
            None
          </Text>
        </div>
        {headerFormats.map((format: any, idx: number) => {
          return (
            <div
              className="cursor-pointer h-full flex items-center justify-center gap-2 px-2"
              onClick={() => {
                setFieldValue(`components.${index}`, {
                  type: "HEADER",
                  format: format.value,
                });
              }}
              key={idx}
            >
              {format.value == "NONE" ? (
                <RadioGroup>
                  <RadioGroupItem
                    value="NONE"
                    checked={_format == format?.value}
                  />
                </RadioGroup>
              ) : null}
              {format.value == "TEXT" ? (
                <TextFormatIcon
                  className={`w-4 h-4 ${
                    _format == format?.value
                      ? "text-primary"
                      : "text-icon-primary"
                  }`}
                />
              ) : null}
              {format.value == "IMAGE" ? (
                <ImageFormatIcon
                  className={`w-4 h-4 ${
                    _format == format?.value
                      ? "text-primary"
                      : "text-icon-primary"
                  }`}
                />
              ) : null}
              {format.value == "VIDEO" ? (
                <VideoFormatIcon
                  className={`w-4 h-4 ${
                    _format == format?.value
                      ? "text-primary"
                      : "text-icon-primary"
                  }`}
                />
              ) : null}
              {format.value == "DOCUMENT" ? (
                <DocumentFormatIcon
                  className={`w-4 h-4 ${
                    _format == format?.value
                      ? "text-primary"
                      : "text-icon-primary"
                  }`}
                />
              ) : null}
              <Text
                size="sm"
                weight="semibold"
                textColor={
                  _format == format?.value
                    ? "text-primary"
                    : "text-text-primary"
                }
              >
                {format.name}
              </Text>
            </div>
          );
        })}
      </div>
      {_format == "TEXT" && (
        <Input
          name={`components.${0}.text`}
          placeholder="Enter your header message here..."
          onChange={handleChange}
          value={values?.components[index]?.text}
          limit={60}
          errorKey={
            errors?.components?.length > 0 && errors?.components[0]?.text
          }
        />
      )}

      <div className="my-2">
        {" "}
        <input
          type="file"
          name="file"
          ref={inputRef}
          onChange={changeHandler}
          style={{ display: "none" }}
          accept={accept}
        />
        {!header?.example1 &&
        (_format == "IMAGE" || _format == "VIDEO" || _format == "DOCUMENT") ? (
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => {
                if (inputRef) {
                  //@ts-ignore
                  inputRef?.current.click();
                }
              }}
              // disabled={media.isPending}
              // loading={media.isPending}
            >
              Select File
            </Button>

            <Text size="xs" color="secondary">
              {`Please note : The maximum Image size for uploads is ${
                _format == "IMAGE"
                  ? "5MB"
                  : _format == "VIDEO"
                  ? "16MB"
                  : "30MB"
              }. If your file exceeds this limit, please consider reducing its size before uploading.`}
            </Text>
          </div>
        ) : null}
        {header?.example1 ? (
          <>
            {_format == "IMAGE" && (
              <div className="w-[30%] h-44 bg-neutral-20 rounded-md relative">
                <img
                  src={header?.example1?.header_handle[0]}
                  alt="Template Image"
                  className="absolute rounded-md object-contain w-[100%]"
                />
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setFieldValue(`components.${0}`, {
                      type: "HEADER",
                      format: _format,
                    });
                  }}
                >
                  <CloseIcon className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
            {_format == "DOCUMENT" && (
              <div className="w-[30%] h-44 bg-neutral-20 rounded-md relative">
                <iframe
                  className="w-full h-full bg-neutral-20 rounded-md relative"
                  src={header?.example1?.header_handle[0]}
                />
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setFieldValue(`components.${0}`, {
                      type: "HEADER",
                      format: _format,
                    });
                  }}
                >
                  <CloseIcon className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
            {_format == "VIDEO" && (
              <div
                className="w-[30%] h-44 bg-neutral-20 rounded-md relative"
                onClick={() => {
                  setFieldValue(`components.${0}`, {
                    type: "HEADER",
                    format: _format,
                  });
                }}
              >
                <video
                  src={header?.example1?.header_handle[0]}
                  controls
                  className="w-full max-h-44 rounded-md"
                />
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                  <CloseIcon className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TemplateHeaderForm;
