import * as Yup from "yup";

export const uiYupListButtonSchema = Yup.object().shape({
  interactiveListHeader: Yup.string().max(60, "Maximum 60 chars"),
  interactiveListBody: Yup.string()
    .required("Body text can not be empty.")
    .max(1024, "Maximum 1024 chars"),
  interactiveListFooter: Yup.string().max(60, "Maximum 60 chars"),
  interactiveListButton: Yup.string()
    .required("Button text can not be empty.")
    .max(20, "Maximum 20 chars"),
  interactiveListSections: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().max(24, "Maximum 24 chars"),
        rows: Yup.array().of(
          Yup.object().shape({
            title: Yup.string()
              .max(24, "Maximum 24 chars")
              .required("Row title can not be empty."),
            description: Yup.string().max(72, "Maximum 72 chars"),
            descriptionEnable: Yup.boolean().oneOf([true, false]),
          })
        ),
      })
    )
    .test("rows-length", "You can create up to 10 rows.", (value: any) => {
      const rowsLength = value.reduce((total: any, section: any) => {
        return total + section.rows?.length;
      }, 0);

      return rowsLength < 11;
    }),
});
