import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import settingsModelSchema from "@/models/settings-model-schema";
import { yupSettingsSchema } from "@/validation-schema/api/yup-settings-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest) => {
    const query = await getServerSearchParams(req);

    const perPage = query.per_page || 15;
    const page = query.page > 0 ? query.page : 1;
    const skip = (page - 1) * perPage;

    const totalCount = await settingsModelSchema.countDocuments();
    const settings = await settingsModelSchema.find().skip(skip).limit(perPage);

    return NextResponse.json({
      data: {
        per_page: perPage,
        total_page: Math.ceil(totalCount / perPage),
        total_result: totalCount,
        items: settings,
        current_page: page,
      },
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let settingsValidateBody: any = {};

    try {
      settingsValidateBody = yupSettingsSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Body Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    try {
      const alreadyExist = await settingsModelSchema.findOne({
        setting_key: settingsValidateBody?.setting_key,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              setting_key: "Settings Key Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }

      const newsettings = new settingsModelSchema({
        ...settingsValidateBody,
      });

      await newsettings.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newsettings,
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: error,
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
