"use client";
// import { useAlertQuery } from "@/framework/alerts/get-alerts";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Alerts = () => {
  // const { data } = useAlertQuery();
  const route = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // const handleNext = () => {
  //   if (data?.length) {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  //   }
  // };

  // const currentAlert = data?.[currentIndex];

  return (
    <div className="w-full h-auto flex flex-col items-center">
      {/* {currentAlert && (
        <div
          style={{ backgroundColor: currentAlert.background_color || "white" }}
          className="flex-1 w-full h-10 py-1 flex items-center justify-center gap-2"
        >
          <p
            style={{ color: currentAlert.text_color || "black" }}
            className="text-xs"
          >
            {currentAlert.body}
          </p>
          <div>
            {currentAlert?.buttons.map((button: any, index: number) => (
              <button
                key={index}
                className="text-xs p-1 rounded-md"
                style={{
                  color: button.text_color,
                  backgroundColor: button.background_color,
                }}
                onClick={() => {
                  if (button.web_link) {
                    route.push(button.web_link);
                  }
                }}
              >
                {button?.title}
              </button>
            ))}
          </div>
        </div>
      )} */}
      {/* {data?.length > 1 && (
        <button
          onClick={handleNext}
          className="mt-2 px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Next
        </button>
      )} */}
    </div>
  );
};

export default Alerts;
