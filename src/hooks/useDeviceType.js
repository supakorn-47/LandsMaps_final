import { useState, useEffect } from "react";

const useDeviceType = (breakpoints = { mobile: 768, tablet: 1024 }) => {
  const [deviceType, setDeviceType] = useState("desktop");
  const [screenWidth, setScreenWidth] = useState(0);

  const getDeviceType = () => {
    const width = window.innerWidth;
    setScreenWidth(width);
    // console.log("Getting device type, window width:", width);

    if (width < breakpoints.mobile) {
      // console.log("Detected: mobile");
      return "mobile";
    } else if (width >= breakpoints.mobile && width < breakpoints.tablet) {
      // console.log("Detected: tablet");
      return "tablet";
    } else {
      // console.log("Detected: desktop");
      return "desktop";
    }
  };

  const handleResize = () => {
    // console.log("Resize event triggered");
    const newDeviceType = getDeviceType();
    // console.log("Setting new device type:", newDeviceType);
    setDeviceType(newDeviceType);
  };

  useEffect(() => {
    // Set initial device type (in case of SSR)
    // console.log("useEffect running, setting initial device type");
    setDeviceType(getDeviceType());

    // Add event listener
    // window.addEventListener("resize", handleResize);
    // console.log("Resize listener added");

    // Cleanup
    // return () => {
    //   window.removeEventListener("resize", handleResize);
    //   console.log("Resize listener removed");
    // };

    // Add event listener with throttling for better performance
    let timeoutId;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", throttledResize);
    // console.log("Resize listener added");
    // Cleanup
    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const result = {
    screenWidth,
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
  };

  // console.log("Hook returning:", result);
  return result;
};

export default useDeviceType;
