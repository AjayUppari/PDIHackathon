import { useState, useEffect } from "react";

function RulesSection({ rules }) {
  console.log('rules are ', rules);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 prose">
      <h2 className="text-xl font-semibold mb-4">Rules</h2>
      <div
        className="text-gray-700 prose-sm max-w-none mt-4"
        dangerouslySetInnerHTML={{ __html: rules }}
      />
    </div>
  );
}

export default RulesSection;
