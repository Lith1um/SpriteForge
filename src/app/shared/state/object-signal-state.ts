import { state } from "@angular/animations";
import { Signal, computed, signal } from "@angular/core";

export type ObjectSignalMethods<T> = { 
  set: (state: T) => void;
  update: (callback: (state: T) => T) => void;
};

export type ObjectSignalProps<T> = {
  [K in keyof T]: Signal<T[K]> & ObjectSignalMethods<T[K]>;
}

export type ObjectSignalState<T extends object> =
  (() => T)
  & ObjectSignalProps<T>
  & ObjectSignalMethods<T>

// Caveat here in that the initialState must contain all state fields
export const objectSignal = <Type extends object>(initialState: Type): ObjectSignalState<Type> => {
  const state = signal<Type>(initialState);

  const func = () => state();

  type ComputedProps = ObjectSignalProps<Type>;

  const props = Object.keys(initialState).reduce<ObjectSignalProps<Type>>((acc: ObjectSignalProps<Type>, key: string) => ({
    ...acc,
    [key]: Object.assign(
      computed(() => state()[key as keyof Type]),
      {
        set: (val: unknown) => state.set({ ...state(), [key]: val}),
        update: (callback: (state: unknown) => unknown) => state.update(currState => ({...state(), [key]: callback(currState[key as keyof Type])})) 
      })
  }), {} as ComputedProps);

  const methods = {
    set: (newState: Type): void => state.set(newState),
    update: (callback: (state: Type) => Type) => state.update(currState => callback(currState)) 
  }

  return Object.assign(func, props, methods);
}