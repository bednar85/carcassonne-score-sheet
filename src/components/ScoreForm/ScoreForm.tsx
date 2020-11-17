import React from 'react';
import { useForm, Controller, ControllerProps } from "react-hook-form";

interface Inputs {
  featureType: string;
  sections: number;
  pennants: number;
  hasInn: boolean;
  hasCathedral: boolean;
  surroundingTiles: number;
  completedCities: number;
};

const calculateScore = (formValues: Inputs): number => {
  if (!Object.keys(formValues).length) {
    return 0;
  }

  const { featureType, sections, hasInn, hasCathedral } = formValues;
  const pennants = formValues.pennants || 0;
  const surroundingTiles = formValues.surroundingTiles || 0;
  const completedCities = formValues.completedCities || 0;


  if (featureType === 'road') {
    return hasInn ? sections * 2 : sections;
  }

  if (featureType === 'city') {
    return hasCathedral ? (sections + pennants) * 3 : (sections + pennants) * 2;
  }

  if (featureType === 'monastery') {
    return (surroundingTiles || 0) + 1;
  }

  if (featureType === 'field') {
    return (completedCities || 0) * 3;
  }

  return 0;
};


// interface NumberInputProps extends Omit<ControllerProps<"input">, "render"> {
//   inputProps: {
//     min: number;
//     max?: number;
//   }
// }

const NumberInput = ({
  as,
  inputProps,
  ...rest
}: any) => (
    <Controller
      {...rest}
      render={(props) => (
        <input
          {...props}
          type="number"
          min={0}
          onChange={(e) =>
            props.onChange(
              Number.isNaN(parseFloat(e.target.value))
              ? 0
              : parseFloat(e.target.value)
              )
            }
          {...inputProps}
        />
      )}
    />
  );


export default function ScoreForm() {
  const defaultValues = {
    featureType: '',
    sections: 2,
    pennants: 0,
    hasInn: false,
    hasCathedral: false,
    surroundingTiles: 0,
    completedCities: 0
  };

  const { register, watch, control } = useForm<Inputs>({
    defaultValues
  });

  const watchAll = watch();

  // this is account for a quirk in which, when you click on a feature for the first time, initially it only sets the featureType in watchAll
  const values = Object.keys(watchAll).length === 1 ? {
    ...defaultValues,
    ...watchAll
  } : watchAll;
  const score = calculateScore(values);

  return (
    <div>
      <h1>Carcassonne Calculator</h1>
      <form>
        <div>
          <strong>Feature Type:</strong>
          <label>
            <input
              name="featureType"
              type="radio"
              value="road"
              ref={register}
            />
            Road
          </label>
          <label>
            <input
              name="featureType"
              type="radio"
              value="city"
              ref={register}
            />
            City
          </label>
          <label>
            <input
              name="featureType"
              type="radio"
              value="monastery"
              ref={register}
            />
            Monastery
          </label>
          <label>
            <input
              name="featureType"
              type="radio"
              value="field"
              ref={register}
            />
            Field
          </label>
        </div>
        {(watchAll.featureType === 'road' || watchAll.featureType === 'city') && (
          <div>
            <strong>Sections:</strong>
            <NumberInput
              control={control}
              name="sections"
              inputProps={{
                min: defaultValues.sections
              }}
            />
          </div>
        )}
        {watchAll.featureType === 'monastery' && (
          <div>
            <strong>Surrounding Tiles:</strong>
            <NumberInput
              control={control}
              name="surroundingTiles"
            />
          </div>
        )}
        {watchAll.featureType === 'field' && (
          <div>
            <strong>Completed Cities:</strong>
            <NumberInput
              control={control}
              name="completedCities"
            />
          </div>
        )}
        {watchAll.featureType === 'city' && (
          <div>
            <strong>Pennants:</strong>
            <NumberInput
              control={control}
              name="pennants"
              inputProps={{
                max: watchAll.sections
              }}
            />
          </div>
        )}
        <div>
          {watchAll.featureType === 'road' && (
            <>
              <strong>Modifiers:</strong>
              <label>
                <input name="hasInn" type="checkbox" defaultChecked={false} ref={register} />
                Has an Inn
              </label>
            </>
          )}
          {watchAll.featureType === 'city' && watchAll.sections > 4 && (
            <>
              <strong>Modifiers:</strong>
              <label>
                <input name="hasCathedral" type="checkbox" defaultChecked={false} ref={register} />
                Has a Cathedral
              </label>
            </>
          )}
        </div>
      </form>
      <div>
        {watchAll.featureType === '' ? (
          <em>Select a feature type to calculate the score.</em>
        ) : (
          <>
            <strong>Score:</strong>
            {score}
          </>
        )}
      </div>
    </div>
  );
}
