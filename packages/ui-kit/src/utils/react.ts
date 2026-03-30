import type { Dispatch, ReactElement, SetStateAction } from "react";

export type Component<Props extends object = object> = (props: Props) => ReactElement;
export type ComponentAsync<Props extends object = object> = (props: Props) => Promise<ReactElement>;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type { PropsWithChildren, ComponentType } from "react";
