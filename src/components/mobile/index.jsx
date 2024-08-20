// components/MobileOnlyMessage.js
import React from "react";

const MobileOnlyMessage = () => {
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-center py-2">
      Page Hanya bisa diakses di desktop
    </div>
  );
};

export default MobileOnlyMessage;
