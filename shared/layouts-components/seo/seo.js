"use client";
import React, { useEffect } from "react";

const Seo = ({ siteName = "SupplyChainItalia", title }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${siteName}` : siteName;
  }, [title, siteName]);

  return <></>;
};

export default Seo;
