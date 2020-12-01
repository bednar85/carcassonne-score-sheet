import React from 'react';
import './NumberInput.scss';

// create interface for props instead of any
const NumberInput = ({
    register,
    setValue,
    label,
    name,
    value,
    min = 0,
    max = Infinity
  }: any) => {
  const isInRange = (value: number) => (min <= value && value <= max);

  return (
    <div className="number-input">
      <label className="number-input__label" htmlFor={name}>{label}</label>
      <div className="number-input__input-elements">
        <button
          className="number-input__btn number-input__btn--decrement"
          type="button"
          onClick={() => {
            const newValue = parseInt(value) - 1;
            if (isInRange(newValue)) setValue(name, newValue);
          }}
        >
          –
        </button>
        <input
          className="number-input__input"
          type="number"
          name={name}
          ref={
            register({
              valueAsNumber: true
            })
          }
        />
        <button
          className="number-input__btn number-input__btn--increment"
          type="button"
          onClick={() => {
            const newValue = parseInt(value) + 1;
            if (isInRange(newValue)) setValue(name, newValue);
          }}
        >
          +
        </button>
      </div>
    </div>
  )
};

export default NumberInput;