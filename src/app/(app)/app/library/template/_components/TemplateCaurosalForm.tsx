import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Input } from "@/components/ui/input";
import { Listbox } from "@/components/ui/listbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useApplication } from "@/contexts/application/application.context";
import { useMediaUploadMutation } from "@/framework/media/media-upload-mutation";
import axios from "axios";
import { ErrorMessage, FieldArray, useFormikContext } from "formik";
import React, { useRef, useState, useEffect } from "react";

// ---- constants
const initialComponent = {
  components: [
    { type: "header", format: "image" },
    { type: "body", text: "" },
    {
      type: "buttons",
      buttons: [
        { type: "quick_reply", text: "" },
        { type: "url", text: "", url: "", url_type: "STATIC" },
        // { type: "phone_number", text: "", phone_number: "" },
      ],
    },
  ],
};

const buttonsType = [
  { name: "Quick Reply", value: { type: "quick_reply", text: "" } },
  {
    name: "Visit Website",
    value: { type: "url", text: "", url: "", url_type: "STATIC" },
  },
  {
    name: "Phone Number",
    value: { type: "phone_number", text: "", phone_number: "" },
  },
];

const urlType = [
  { name: "Static", value: "STATIC" },
  { name: "Dynamic", value: "DYNAMIC" },
];

// ---- Subcomponents
const CarouselCardPreview = React.memo(function CarouselCardPreview({
  card,
  onClick,
}: any) {
  const header = card?.components?.find((c: any) => c.type === "header");
  const mediaUrl = header?.example1?.header_handle?.[0] || "";

  return (
    <div
      className="w-36 h-36 bg-neutral-100 rounded-md cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {mediaUrl ? (
        header?.format == "image" ? (
          <img
            className="w-full h-full object-cover"
            src={mediaUrl}
            alt="template carousel image"
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={mediaUrl}
            autoPlay
          />
        )
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          No Media
        </div>
      )}
    </div>
  );
});

// ---- Buttons Editor
const ButtonsEditor = ({
  comp,
  compIdx,
  index,
  selectedItemIndex,
  setFieldValue,
  handleChange,
  errors,
}: any) => {
  return (
    <div className="space-y-4">
      <FieldArray
        name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons`}
      >
        {({ push, remove }) => (
          <>
            <div className="flex justify-between items-center">
              <div>
                <Text size="lg" weight="semibold">
                  Buttons
                </Text>
                <Text size="sm" color="secondary">
                  Must be the same type across all carousel cards
                </Text>
              </div>
              {comp?.buttons?.length < 2 && (
                <Dropdown
                  options={buttonsType}
                  onSelectData={(data) => push(data?.value)}
                >
                  <Button variant="outline">Add Button</Button>
                </Dropdown>
              )}
            </div>

            {comp?.buttons?.map((button: any, btnIdx: number) => (
              <div key={btnIdx} className="space-y-3">
                {/* URL button */}
                {button.type === "url" && (
                  <>
                    <div className="flex gap-2 items-start">
                      <Listbox
                        options={buttonsType}
                        selectedOption={buttonsType.find(
                          (o) => o.value.type === button.type
                        )}
                        onSelectData={(data: any) =>
                          setFieldValue(
                            `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}`,
                            data?.value
                          )
                        }
                      />
                      <Input
                        name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}.text`}
                        placeholder="Enter button text"
                        limit={25}
                        onChange={handleChange}
                        value={button?.text}
                        errorKey={
                          errors?.components?.length > 0 &&
                          errors?.components[index]?.cards[selectedItemIndex]
                            ?.components?.length > 0 &&
                          errors?.components[index]?.cards[selectedItemIndex]
                            ?.components[compIdx]?.buttons[btnIdx]?.text
                        }
                      />
                    </div>
                    <div className="flex gap-2 items-start">
                      <Listbox
                        options={urlType}
                        selectedOption={urlType.find(
                          (o) => o.value === button?.url_type
                        )}
                        onSelectData={(data: any) =>
                          setFieldValue(
                            `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}.url_type`,
                            data?.value
                          )
                        }
                      />
                      <Input
                        name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}.url`}
                        placeholder="https://example.com"
                        limit={200}
                        onChange={handleChange}
                        value={button?.url}
                        errorKey={
                          errors?.components?.length > 0 &&
                          errors?.components[index]?.cards[selectedItemIndex]
                            ?.components?.length > 0 &&
                          errors?.components[index]?.cards[selectedItemIndex]
                            ?.components[compIdx]?.buttons[btnIdx]?.url
                        }
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => remove(btnIdx)}
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Quick reply */}
                {button.type === "quick_reply" && (
                  <div className="flex gap-2 items-start">
                    <Listbox
                      options={buttonsType}
                      selectedOption={buttonsType.find(
                        (o) => o.value.type === button.type
                      )}
                      onSelectData={(data: any) =>
                        setFieldValue(
                          `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}`,
                          data?.value
                        )
                      }
                    />
                    <Input
                      name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}.text`}
                      placeholder="Enter button text"
                      limit={25}
                      onChange={handleChange}
                      value={button?.text}
                      errorKey={
                        errors?.components?.length > 0 &&
                        errors?.components[index]?.cards[selectedItemIndex]
                          ?.components?.length > 0 &&
                        errors?.components[index]?.cards[selectedItemIndex]
                          ?.components[compIdx]?.buttons[btnIdx]?.text
                      }
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => remove(btnIdx)}
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Phone number */}
                {button.type === "phone_number" && (
                  <div className="flex gap-2 items-start">
                    <Listbox
                      options={buttonsType}
                      selectedOption={buttonsType.find(
                        (o) => o.value.type === button.type
                      )}
                      onSelectData={(data: any) =>
                        setFieldValue(
                          `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}`,
                          data?.value
                        )
                      }
                    />
                    <Input
                      name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}.text`}
                      placeholder="Enter button text"
                      limit={25}
                      onChange={handleChange}
                      value={button?.text}
                      errorKey={
                        errors?.components?.length > 0 &&
                        errors?.components[index]?.cards[selectedItemIndex]
                          ?.components?.length > 0 &&
                        errors?.components[index]?.cards[selectedItemIndex]
                          ?.components[compIdx]?.buttons[btnIdx]?.text
                      }
                    />
                    <Input
                      name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.buttons.${btnIdx}.phone_number`}
                      placeholder="999XXXXXXX"
                      limit={20}
                      onChange={handleChange}
                      value={button?.phone_number}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => remove(btnIdx)}
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </FieldArray>
    </div>
  );
};

// ---- Main Component
const TemplateCaurosalForm = ({ index }: { index: number }) => {
  const { values, setFieldValue, handleChange, errors }: any =
    useFormikContext();
  const { business } = useApplication();
  const media = useMediaUploadMutation();
  const [selectedItemIndex, setSelectedItemIndex] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const carousel = values.components.find((o: any) => o.type === "carousel");

  // Auto select first card
  useEffect(() => {
    if (carousel?.cards?.length > 0 && selectedItemIndex === null) {
      setSelectedItemIndex(0);
    }
  }, [carousel, selectedItemIndex]);

  const selectedCard =
    selectedItemIndex !== null ? carousel?.cards?.[selectedItemIndex] : null;

  const handleAddCard = () => {
    const newCard = { ...initialComponent };
    setFieldValue(`components.${index}.cards`, [
      ...(carousel?.cards || []),
      newCard,
    ]);
    setSelectedItemIndex(carousel?.cards?.length);
  };

  return (
    <div className="p-2 space-y-4 w-full">
      {/* Title */}
      <div className="space-y-2">
        <Text size="lg" weight="semibold">
          Carousel Cards
        </Text>
        <Text size="sm">Create up to 10 cards with media & buttons</Text>
      </div>

      {/* Card Thumbnails */}
      <div className="flex items-start gap-3 overflow-x-auto">
        {carousel?.cards?.map((card: any, i: number) => (
          <CarouselCardPreview
            key={i}
            card={card}
            onClick={() => setSelectedItemIndex(i)}
          />
        ))}

        {carousel?.cards?.length < 10 && (
          <div
            className="w-36 h-36 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-primary"
            onClick={handleAddCard}
          >
            <PlusIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {errors?.components?.length > 0 &&
        errors?.components[index]?.cards &&
        typeof errors?.components[index]?.cards == "string" && (
          <Text size="sm" textColor="text-red-500">
            {errors?.components[index]?.cards}
          </Text>
        )}

      {/* Editor */}
      {selectedCard && (
        <div className="border rounded-md">
          <div className="flex justify-between items-center p-4 bg-neutral-50">
            <Text size="base" weight="semibold">
              Edit Card
            </Text>
            <DeleteIcon
              className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500"
              onClick={() => {
                const updated = carousel.cards.filter(
                  (_: any, i: number) => i !== selectedItemIndex
                );
                setFieldValue(`components.${index}.cards`, updated);
                setSelectedItemIndex(null);
              }}
            />
          </div>

          {/* Formik FieldArray for Card Components */}
          <FieldArray
            name={`components.${index}.cards.${selectedItemIndex}.components`}
          >
            {() => (
              <div className="p-4 space-y-6">
                {selectedCard.components.map((comp: any, compIdx: number) => {
                  if (comp.type === "header") {
                    return (
                      <div key={compIdx} className="space-y-3">
                        <Text size="lg" weight="semibold">
                          Media
                        </Text>
                        <Text size="sm" color="secondary">
                          Upload image or video
                        </Text>
                        <RadioGroup
                          className="flex gap-6"
                          value={comp.format}
                          onValueChange={(value) =>
                            setFieldValue(
                              `components.${index}.cards.${selectedItemIndex}.components.${compIdx}`,
                              { type: "header", format: value }
                            )
                          }
                        >
                          <div className="flex gap-2 items-center">
                            <RadioGroupItem value="image" id="image" />
                            <label htmlFor="image">Image</label>
                          </div>
                          <div className="flex gap-2 items-center">
                            <RadioGroupItem value="video" id="video" />
                            <label htmlFor="video">Video</label>
                          </div>
                        </RadioGroup>
                        <Button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          disabled={loading}
                          loading={loading}
                        >
                          Upload Media
                        </Button>
                        {errors?.components?.length > 0 &&
                          errors?.components[index]?.cards[selectedItemIndex]
                            ?.components?.length > 0 &&
                          errors?.components[index]?.cards[selectedItemIndex]
                            ?.components[compIdx]?.example?.header_handle && (
                            <Text size="sm" textColor="text-red-500">
                              Media is requild field
                            </Text>
                          )}

                        <input
                          type="file"
                          ref={inputRef}
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setLoading(true);
                            const formData = new FormData();
                            formData.append("file", file);
                            const response = await axios.post(
                              `/api/media/upload`,
                              formData,
                              {
                                headers: {
                                  "content-type": "multipart/form-data",
                                },
                              }
                            );
                            setFieldValue(
                              `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.example`,
                              { header_handle: [response.data.data] }
                            );
                            const res = await media.mutateAsync({
                              payload: file,
                            });
                            setFieldValue(
                              `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.example1`,
                              { header_handle: [res.public_url] }
                            );
                            setLoading(false);
                          }}
                        />
                      </div>
                    );
                  }

                  if (comp.type === "body") {
                    return (
                      <div key={compIdx} className="space-y-2">
                        <Text size="lg" weight="semibold">
                          Card Content
                        </Text>
                        <Textarea
                          name={`components.${index}.cards.${selectedItemIndex}.components.${compIdx}.text`}
                          placeholder="Template message..."
                          value={comp.text}
                          onChange={(e) =>
                            setFieldValue(
                              `components.${index}.cards.${selectedItemIndex}.components.${compIdx}.text`,
                              e.target.value
                            )
                          }
                          errorKey={
                            errors?.components?.length > 0 &&
                            errors?.components[index]?.cards[selectedItemIndex]
                              ?.components?.length > 0 &&
                            errors?.components[index]?.cards[selectedItemIndex]
                              ?.components[compIdx]?.text
                          }
                          limit={160}
                        />
                      </div>
                    );
                  }

                  if (comp.type === "buttons") {
                    return (
                      <ButtonsEditor
                        key={compIdx}
                        comp={comp}
                        compIdx={compIdx}
                        index={index}
                        selectedItemIndex={selectedItemIndex}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        errors={errors}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </FieldArray>
        </div>
      )}
    </div>
  );
};

export default TemplateCaurosalForm;
