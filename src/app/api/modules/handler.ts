import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import masterModulesModuleSchema from "@/models/master-modules-module-schema";
import { yupMasterModuleSchema, yupMasterModuleSortQuery } from "@/validation-schema/api/yup-master-module-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);

      let MasterModulesQueryValidation: any = {};
      try {
          MasterModulesQueryValidation = yupFilterQuerySchema.validateSync(query);
      } catch (error) {
        let ErrorFormObject = yupToFormErrorsServer(error);

        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: ErrorFormObject,
            message: " ",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      let searchQuery: any = {};

      if (MasterModulesQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
                module_id: {
                  $regex: `.*${MasterModulesQueryValidation.q}.*`,
                  $options: "i",
                },
              },
            {
              name: {
                $regex: `.*${MasterModulesQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              category: {
                $regex: `.*${MasterModulesQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (MasterModulesQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          MasterModulesQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }

      let sortQuery: any = {};

      if (MasterModulesQueryValidation.sort != "") {
        const _lstry: any = MasterModulesQueryValidation?.sort;
        const sortObj = getJSONObjectFromString(_lstry);

        try {
          sortQuery = yupMasterModuleSortQuery.validateSync(sortObj);
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      } else {
        sortQuery = { created_at: -1 };
      }

      let finalFilterQuery = {
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: MasterModulesQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: MasterModulesQueryValidation.page,
      };

      const totalCount = await masterModulesModuleSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
      MasterModulesQueryValidation.page > 0
          ? (MasterModulesQueryValidation.page - 1) * MasterModulesQueryValidation.per_page
          : 0;
      let MasterModules = await masterModulesModuleSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);
      finalResponse.items = MasterModules;

      return NextResponse.json({
        data: finalResponse,
      });
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
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let MasterModulesValidateBody: any = {};

    // Step 1: Validate the request body
    try {
        MasterModulesValidateBody = yupMasterModuleSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Module Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    try {
      const alreadyModulesExist = await masterModulesModuleSchema.findOne({
        module_id : MasterModulesValidateBody.module_id,
      });

      if (alreadyModulesExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              module_id: "Module already exists.",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const newModules = new masterModulesModuleSchema({
        ...MasterModulesValidateBody,
      });

      await newModules.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newModules,
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
