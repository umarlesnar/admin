import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import workflowLibraryModelSchema from "@/models/workflow-library-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import { yupAutomateWorkFlowSchema } from "@/validation-schema/api/yup-automation-work-flow-schema";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    query.work_flow_id = params.work_flow_id;
    const workFlow = await workflowLibraryModelSchema.findOne({
      _id: query.work_flow_id,
    });

    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: workFlow,
        message: "Success",
      },
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
      }
    );
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const { user } = req;
    const body = await req.json();

    const query = await getServerSearchParams(req);
    query.work_flow_id = params.work_flow_id;

    //body validation
    let automateWorkFlowUpdateBodyValidation: any = {};
    try {
      automateWorkFlowUpdateBodyValidation =
        yupAutomateWorkFlowSchema.validateSync(body);
    } catch (error) {
      let ErrorFormObject = yupToFormErrorsServer(error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: "Body Validation Error",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
    const flow_idcount = await workflowLibraryModelSchema.countDocuments({
      _id: query.work_flow_id,
    });

    if (flow_idcount == 0) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: {
            template_id: "Invalid Flow Id!",
          },
          message: "Flow Id not found!",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    automateWorkFlowUpdateBodyValidation.updated_at = new Date();

    const finalUpdateData = {
      ...automateWorkFlowUpdateBodyValidation,
    };
    try {
      let OperatorObject = await workflowLibraryModelSchema.updateOne(
        {
          _id: query.work_flow_id,
        },
        finalUpdateData
      );

      if (OperatorObject) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
            data: automateWorkFlowUpdateBodyValidation,
            message: "Automate Work Flow Updated successfuly!",
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: automateWorkFlowUpdateBodyValidation,
          message: "Automate Flow unsuccessfuly!",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
  })
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);
      query.work_flow_id = params.work_flow_id;

      const flow_idcount = await workflowLibraryModelSchema.countDocuments({
        _id: query.work_flow_id,
      });

      if (flow_idcount == 0) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: {
              template_id: "Invalid Flow Id!",
            },
            message: "Flow Id not found!",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      await workflowLibraryModelSchema.deleteOne({
        _id: query.work_flow_id,
      });
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Automate Flow Deleted Successful",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("error", error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
          data: error,
          message: "Server Error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });
export default router;
