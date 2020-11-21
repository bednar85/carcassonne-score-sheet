import React, { useState } from 'react';
import { useForm, Controller, ControllerProps } from "react-hook-form";

interface Inputs {
  featureType: string;
  roadSegments?: number;
  hasInn?: boolean;
  citySections?: number;
  pennants?: number;
  hasCathedral?: boolean;
  surroundingTiles?: number;
  completedCities?: number;
};

const calculateScore = (formValues: Inputs): number => {
  if (!Object.keys(formValues).length) {
    return 0;
  }

  const { featureType, hasInn, hasCathedral } = formValues;
  const roadSegments = formValues.roadSegments || 0;
  const citySections = formValues.citySections || 0;
  const pennants = formValues.pennants || 0;
  const surroundingTiles = formValues.surroundingTiles || 0;
  const completedCities = formValues.completedCities || 0;


  if (featureType === 'road') {
    return hasInn ? roadSegments * 2 : roadSegments;
  }

  if (featureType === 'city') {
    return hasCathedral ? (citySections + pennants) * 3 : (citySections + pennants) * 2;
  }

  if (featureType === 'monastery') {
    return (surroundingTiles || 0) + 1;
  }

  if (featureType === 'field') {
    return (completedCities || 0) * 3;
  }

  return 0;
};


// can probably extract this out to a separate component
// consider adding logic to onChange to remove preceding 0's
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


export default function ScoreForm() {
  const [ records, setRecords ] = useState<Inputs[]>([]);

  const defaultValues = {
    featureType: '',
    roadSegments: 2,
    citySections: 2,
    pennants: 0,
    hasInn: false,
    hasCathedral: false,
    surroundingTiles: 0,
    completedCities: 0
  };

  const { register, handleSubmit, watch, control } = useForm<Inputs>({
    defaultValues
  });

  const watchAll = watch();

  /**
   * this is account for a quirk
   * when you click on a feature for the first time
   * initially it only sets the featureType in watchAll
   * pretty sure this is linked to the showing/hiding of form fields which are only registered when shown
   * planning on adjusting this so that the showing/hiding is more CSS class based rather than only JS based
   */
  const values = Object.keys(watchAll).length === 1 ? {
    ...defaultValues,
    ...watchAll
  } : watchAll;
  const score = calculateScore(values);

  const onSubmit = (data: any) => setRecords([...records, data]);

  const getFormContents = () => {
    if (watchAll.featureType === 'road') {
      return (
        <>
          <div className="">
            <strong>Road Segments:</strong>
            <NumberInput
              control={control}
              name="roadSegments"
              inputProps={{
                min: defaultValues.roadSegments
              }}
            />
          </div>
          {watchAll.roadSegments && watchAll.roadSegments > 2 && (
            <div className="">
              <strong>Modifiers:</strong>
              <label>
                <input name="hasInn" type="checkbox" defaultChecked={false} ref={register} />
                Has an Inn{watchAll.hasInn ? '!!!' : '?'}
              </label>
            </div>
          )}
        </>
      );
    }
    if (watchAll.featureType === 'city') {
      return (
        <>
          <div className="">
            <strong>City Sections:</strong>
            <NumberInput
              control={control}
              name="citySections"
              inputProps={{
                min: defaultValues.citySections
              }}
            />
          </div>
          <div className="">
            <strong>Pennants:</strong>
            <NumberInput
              control={control}
              name="pennants"
              inputProps={{
                max: watchAll.citySections
              }}
            />
          </div>
          {watchAll.citySections && watchAll.citySections > 4 && (
            <div className="">
              <strong>Modifiers:</strong>
              <label>
                <input name="hasCathedral" type="checkbox" defaultChecked={false} ref={register} />
                Has a Cathedral{watchAll.hasCathedral ? '!!!' : '?'}
              </label>
            </div>
          )}
        </>
      );
    }
    if (watchAll.featureType === 'monastery') {
      return (
        <div>
          <strong>Surrounding Tiles:</strong>
          <NumberInput
            control={control}
            name="surroundingTiles"
          />
        </div>
      );
    }
    if (watchAll.featureType === 'field') {
      return (
        <div>
          <strong>Completed Cities:</strong>
          <NumberInput
            control={control}
            name="completedCities"
          />
        </div>
      );
    }
  }

  return (
    <div className="">
      <h1 className="">Carcassonne Calculator</h1>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <label className="">
            <input
              className=""
              name="featureType"
              type="radio"
              value="road"
              ref={register}
            />
            Road
          </label>
          <label className="">
            <input
              className=""
              name="featureType"
              type="radio"
              value="city"
              ref={register}
            />
            City
          </label>
          <label className="">
            <input
              className=""
              name="featureType"
              type="radio"
              value="monastery"
              ref={register}
            />
            Monastery
          </label>
          <label className="">
            <input
              className=""
              name="featureType"
              type="radio"
              value="field"
              ref={register}
            />
            Field
          </label>
        </div>
        {getFormContents()}
        <div className="">
          {watchAll.featureType === '' ? (
            <em>Select a feature type to calculate the score.</em>
          ) : (
            <>
              <strong className="">Score:</strong>
              {score}
            </>
          )}
        </div>
        <input className="" type="submit" />
      </form>
      <ul>
        {records.map((record: Inputs, index: number) => (
          <li key={index} className="">
            <div>{JSON.stringify(record)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
