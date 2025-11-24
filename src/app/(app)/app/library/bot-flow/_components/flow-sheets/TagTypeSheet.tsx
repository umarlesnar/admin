import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Formik } from "formik";
import React, { ReactElement, useEffect, useState } from "react";
import useStore from "../store";
import DropdownTagFilter from "@/components/ui/filter-drop-down";
// import { useTagsQuery } from "@/framework/tag/get-tags";
import { TagIcon } from "@/components/ui/icons/TagIcon";
import Text from "@/components/ui/text";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const TagTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  const [tags, setTags] = useState<any>([]);
  // const tag = useTagsQuery();

  // useEffect(() => {
  //   if (tag?.data?.length > 0 && !tag?.isLoading) {
  //     tag?.data[0]?.tags?.map((tag: string) => {
  //       setTags((prev: any) => {
  //         return [
  //           ...prev,
  //           {
  //             name: tag,
  //             value: tag,
  //           },
  //         ];
  //       });
  //     });
  //   }
  // }, [tags?.data, tag?.isLoading]);

  return (
    <Formik
      initialValues={{
        tags: [],
        ...data,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...values,
          });
        }
      }}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit, resetForm, handleChange }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm(data?.flow_replies);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[400px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Set Tags
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-2">
                <DropdownTagFilter
                  label={"Tags"}
                  options={tags}
                  onSelectData={(array: any) => {
                    setFieldValue("tags", array);
                  }}
                  selectedOptions={values?.tags || []}
                  dropdownClassname={"w-[350px]"}
                >
                  <Button
                    variant="outline"
                    disabled={tags?.isLoading}
                    leftIcon={
                      <TagIcon className="w-4 h-4 text-icon-primary mt-[2px]" />
                    }
                    className="w-full flex items-center justify-start gap-2"
                  >
                    Selecte Tags
                  </Button>
                </DropdownTagFilter>
                <div className="w-full flex items-start gap-2">
                  {values?.tags?.length > 0 &&
                    values?.tags?.map((tag: string, idx: number) => {
                      return (
                        <div
                          className="flex items-center gap-2 rounded-full bg-neutral-20 px-2 py-1"
                          key={idx}
                        >
                          <Text weight="medium">{tag}</Text>
                          <CloseIcon
                            className="w-2 h-2 cursor-pointer text-icon-secondary"
                            onClick={() => {
                              const newTags = values.tags.filter(
                                (item: string) => {
                                  return item !== tag;
                                }
                              );

                              setFieldValue("tags", newTags);
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="w-full flex items-center gap-2 ">
                <SheetClose asChild>
                  <Button type="submit" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => {
                    handleSubmit();
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default TagTypeSheet;
