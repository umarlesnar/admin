import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Text from "@/components/ui/text";
import classNames from "classnames";
import { useOnboardingUserQuery } from "@/framework/dashboard/recent/get-onboarding-user";
import moment from "moment";

const tableHeaders = [
  "Name",
  "Auth Provider",
  "Phone Number",
  "Email Address",
  "Created At",
  "Status",
];

const OnboardingUserLists = () => {
  const { data, isLoading } = useOnboardingUserQuery({});

  return (
    <div
      className={classNames(
        "shadow-lg rounded-xl p-4 transition-colors duration-300",
        isLoading ? "bg-gray-100" : "bg-white"
      )}
    >
      <Text size="xl" weight="semibold" color="primary">
        Onboarding Users
      </Text>

      <div className="overflow-x-auto mt-4 h-[320px]">
        {isLoading ? (
          <div className="flex h-[320px] items-center justify-center py-6">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableHead key={header}>
                    <Text size="sm" weight="semibold" color="secondary">
                      {header}
                    </Text>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, index: number) => {
                const fullName = `${item.profile?.first_name || ""} ${
                  item.profile?.last_name || ""
                }`.trim();
                const authType = item.auth_type ? (
                  <>
                    {item.auth_type == 1 ? <Text>Kwic</Text> : null}
                    {item.auth_type == 2 ? <Text>Facebook</Text> : null}
                    {item.auth_type == 3 ? <Text>Google</Text> : null}
                  </>
                ) : (
                  <Text>-</Text>
                );
                const phoneNumber = item.phone?.[0]?.mobile_number || "---";
                const emailAddress = item.email?.[0]?.email_id || "---";
                const createdAt = moment(item.created_at).format(
                  "DD-MM-YYYY - hh-mm A"
                );

                return (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-100 transition"
                  >
                    <TableCell>
                      <Text>{fullName || "N/A"}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{authType}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{phoneNumber}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{emailAddress}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{createdAt}</Text>
                    </TableCell>
                    <TableCell>
                      <span
                        className={classNames(
                          "rounded-md text-sm font-medium",
                          item.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 px-3 py-1"
                            : "bg-red-100 text-red-700 px-2 py-1"
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 h-full flex items-center justify-center">
            No recent onboarding users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingUserLists;
