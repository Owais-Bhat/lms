/// <reference types="nativewind/types" />

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "@legendapp/list" {
  import { ComponentType } from "react";
  import { FlatListProps } from "react-native";
  export interface LegendListProps<T> extends FlatListProps<T> {
    estimatedItemSize?: number;
    recycleItems?: boolean;
  }
  export const LegendList: ComponentType<LegendListProps<any>>;
}
