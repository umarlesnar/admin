import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import alertMessageSchema from "@/models/alert-message-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { yupAlertMessageSchema } from "@/validation-schema/api/yup-alert-message-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let alertmessageQueryValidation: any = {};
    try {
      alertmessageQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    try {
      let searchQuery: any = {};

      if (alertmessageQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              title: {
                $regex: `.*${alertmessageQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              type: {
                $regex: `.*${alertmessageQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (alertmessageQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          alertmessageQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }

      let sortQuery: any = { r_end_at: -1 };

      let finalFilterQuery = {
        partner_id: params.partner_id,
        workspace_id: params.workspace_id,
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: alertmessageQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: alertmessageQueryValidation.page,
      };

      const totalCount = await alertMessageSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        alertmessageQueryValidation.page > 0
          ? (alertmessageQueryValidation.page - 1) *
            alertmessageQueryValidation.per_page
          : 0;
      let alertmessage = await alertMessageSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);

      finalResponse.items = alertmessage;

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: finalResponse,
        message: "Success",
      });
    } catch (error) {
      console.log("SERVER_ERROR", error);

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server Error",
      });
    }
  })

  .post(async (req: AppNextApiRequest, { params }: any) => {
     const body = await req.json();
     const workspace_id = params?.workspace_id;
 
     let AlertMessageValidateBody: any = {};
 
     //step 1
     try {
       AlertMessageValidateBody = yupAlertMessageSchema.validateSync(body);
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
 
     //step 2
 
     try {
       const alreadyExist = await alertMessageSchema.findOne({
         title: AlertMessageValidateBody?.title,
       });
 
       if (alreadyExist) {
         return NextResponse.json(
           {
             status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
             message: "Validation Error",
             data: {
               name: "Alert Message Already Exist",
             },
           },
           {
             status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
           }
         );
       }
 
       const newAlertMessage = new alertMessageSchema({
         ...AlertMessageValidateBody,
         workspace_id: workspace_id,
       });
 
       await newAlertMessage.save();
 
       return NextResponse.json(
         {
           status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
           message: "Success",
           data: newAlertMessage,
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
