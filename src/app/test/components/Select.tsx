"use client";
import { List } from "react-virtualized";
import Select from "react-select";
import { Props } from "react-select";

const MenuList = (props: any) => {
  let rows = props.children;
  if (!Array.isArray(rows)) {
    rows = [rows];
  }
  const rowRenderer = ({ key, index, isScrolling, isVisible, style }: any) => (
    <div key={key} style={style}>
      {rows[index]}
    </div>
  );

  return (
    <List
      style={{
        width: "100%",
        background: "white",
        color: "black",
      }}
      width={500}
      height={300}
      rowHeight={50}
      rowCount={rows.length}
      rowRenderer={rowRenderer}
    />
  );
};

export default function VirtualizedSelect(props: Props) {
  return <Select {...props} components={{ MenuList }} />;
}
