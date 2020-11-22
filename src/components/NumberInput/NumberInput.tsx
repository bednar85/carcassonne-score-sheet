import React from 'react';
import { Controller } from "react-hook-form";
import './NumberInput.scss';

// refactor so I'm not using any here
const NumberInput = ({
  label,
  min = 0,
  max = Infinity,
  ...controllerProps
}: any) => (
    <Controller
      {...controllerProps}
      render={(props) => {
        const { control, name } = controllerProps;
        const { setValue } = control;
        const isInRange = (value: number) => (min <= value && value <= max);
        const inputProps = {
          name,
          min,
          max,
          id: name
        }

        return (
          <div className="number-input">
            <label className="number-input__label" htmlFor={name}>{label}</label>
            <div className="number-input__input-elements">
              <button
                className="number-input__btn number-input__btn--decrement"
                type="button"
                onClick={() => {
                  const newValue = props.value - 1;
                  if (isInRange(newValue)) setValue(name, newValue);
                }}
              >
                –
              </button>
              <input
                {...props}
                {...inputProps}
                className="number-input__input"
                type="number"
                onChange={(e) =>
                  props.onChange(
                    Number.isNaN(parseFloat(e.target.value))
                    ? 0
                    : parseFloat(e.target.value)
                    )
                  }
              />
              <button
                className="number-input__btn number-input__btn--increment"
                type="button"
                onClick={() => {
                  const newValue = props.value + 1;
                  if (isInRange(newValue)) setValue(name, newValue);
                }}
              >
                +
              </button>
            </div>
          </div>
        )
      }}
    />
  );

export default NumberInput;