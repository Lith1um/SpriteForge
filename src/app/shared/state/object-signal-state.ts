import { Signal, computed, signal } from "@angular/core";

export type ObjectSignalProps<T> = {
  [K in keyof T]: Signal<T[K]>;
}

export type ObjectSignalState<T extends object> =
  (() => T)
  & ObjectSignalProps<T>
  & { update: (state: T) => void };

// Caveat here in that the initialState must contain all state fields
export const objectSignal = <Type extends object>(initialState: Type): ObjectSignalState<Type> => {
  const state = signal<Type>(initialState);

  const func = () => state();

  type ComputedProps = ObjectSignalProps<Type>;

  const props = Object.keys(initialState).reduce<ObjectSignalProps<Type>>((acc: ObjectSignalProps<Type>, key: string) => ({
    ...acc,
    [key]: computed(() => state()[key as keyof Type])
  }), {} as ComputedProps);

  const methods = {
    update: (newState: Type): void => state.set(newState)
  }

  return Object.assign(func, props, methods);
}