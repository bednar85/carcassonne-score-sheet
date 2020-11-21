import React from 'react';
import { Controller } from "react-hook-form";

const NumberInput = ({
  inputProps,
  ...controllerProps
}: any) => (
    <Controller
      {...controllerProps}
      render={(props) => {
        const { control, name } = controllerProps;
        const { setValue } = control;
        const min = inputProps?.min || 0;
        const max = inputProps?.max || Infinity;
        const isInRange = (value: number) => (min <= value && value <= max);

        return (
          <>
            <input
              {...props}
              type="number"
              min={min}
              max={max}
              onChange={(e) =>
                props.onChange(
                  Number.isNaN(parseFloat(e.target.value))
                  ? 0
                  : parseFloat(e.target.value)
                  )
                }
              {...inputProps}
            />
            <button
              type="button"
              onClick={() => {
                const newValue = props.value - 1;

                if (isInRange(newValue)) setValue(name, newValue);
              }}
            >
              decrement
            </button>
            <button
              type="button"
              onClick={() => {
                const newValue = props.value + 1;

                if (isInRange(newValue)) setValue(name, newValue);
              }}
            >
              increment
            </button>
          </>
        )
      }}
    />
  );

export default NumberInput;