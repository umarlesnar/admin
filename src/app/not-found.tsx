import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen bg-neutral-30 flex items-center justify-center">
      <div className="h-auto w-[50%] bg-white rounded-md p-9">
        <div className="w-full flex flex-col items-center space-y-4">
          <Text
            size="2xl"
            weight="bold"
            color="secondary"
            className="text-center"
          >
            OOPS! Page was not found !
          </Text>
          <Text size="base" color="teritary" className="text-center">
            The page you are looking for does not exist.
          </Text>
          <Link href={"/"}>
            <Button className="bg-primary-50 hover:bg-primary-100 text-primary-800">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
