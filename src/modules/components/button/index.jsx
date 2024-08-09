import React from "react";
import Button from "@/components/button";

const App = () => {
  return (
    <div className="flex gap-x-5 items-center">
      <Button variant="primary" label="Berikutnya" withIcon={true} />
      <Button variant="secondary" label="Sebelumnya" withIcon={true} />
      <Button variant="tertiary" label="Sebelumnya" withIcon={true} />
      <Button variant="primary" label="Submit" withIcon={false} />
    </div>
  );
};

export default App;
