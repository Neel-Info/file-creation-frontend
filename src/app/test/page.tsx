"use client";

import VirtualizedSelect from "./components/Select";

const options = Array.from(new Array(10_000), (_, index) => ({
  label: `Item ${index}`,
  value: index,
}));

export default function TestPage() {
  return (
    <div style={{ width: "300px" }}>
      <VirtualizedSelect
        options={options}
        defaultValue={options[0]}
        onChange={(newValue) => {
          console.log(newValue);
        }}
        isMulti
      />
    </div>
  );
}
