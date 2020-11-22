import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import NumberInput from '../NumberInput/NumberInput';
import './ScoreForm.scss';

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

  // console.log('');
  // console.log('FILENAME - METHOD');
  // console.log('  formValues:', formValues);

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

const ScoreForm = () => {
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

  const { control, handleSubmit, register, reset, setValue, watch } = useForm<Inputs>({
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

  /**
   * when saving roads or cities
   * for roads:
   *   if hasInn is false exclude that from the record
   * for cities:
   *   if pennants is 0 or hasCathedral is false exclude them from the record
   * since I only care if they have been set
   */
  const onSubmit = (data: any) => {
    setRecords([...records, data])
    reset();
  };

  const getFormContents = () => {
    if (watchAll.featureType === 'road') {
      return (
        <>
          <div className="score-form__field">
            <NumberInput
              control={control}
              name="roadSegments"
              label="Road Segments"
              min={defaultValues.roadSegments}
            />
          </div>
          {watchAll.roadSegments && watchAll.roadSegments > 2 && (
            <div className="score-form__field">
              <label className="score-form__field__label-with-input" htmlFor="hasInn">
                <input id="hasInn" name="hasInn" type="checkbox" defaultChecked={false} ref={register} />
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
          <div className="score-form__field">
            <NumberInput
              control={control}
              name="citySections"
              label="City Sections"
              min={defaultValues.citySections}
            />
          </div>
          {watchAll.citySections && watchAll.citySections > 2 && (
            <div className="score-form__field">
              <NumberInput
                control={control}
                name="pennants"
                label="Pennants"
                max={watchAll.citySections}
              />
            </div>
          )}
          {watchAll.citySections && watchAll.citySections > 4 && (
            <div className="score-form__field">
              <label className="score-form__field__label-with-input"htmlFor="hasCathedral">
                <input id="hasCathedral" name="hasCathedral" type="checkbox" defaultChecked={false} ref={register} />
                Has a Cathedral{watchAll.hasCathedral ? '!!!' : '?'}
              </label>
            </div>
          )}
        </>
      );
    }
    if (watchAll.featureType === 'monastery') {
      return (
        <div className="score-form__field">
          <NumberInput
            control={control}
            name="surroundingTiles"
            label="Surrounding Tiles"
          />
        </div>
      );
    }
    if (watchAll.featureType === 'field') {
      return (
        <div className="score-form__field">
          <NumberInput
            control={control}
            name="completedCities"
            label="Completed Cities"
          />
        </div>
      );
    }
  }

  return (
    <div className="">
      <h1 className="">Carcassonne Calculator</h1>
      <form className="score-form" onSubmit={handleSubmit(onSubmit)}>
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
        <section className="score-form__section">
          {getFormContents()}
        </section>
        <section className="score-form__section">
          {watchAll.featureType === '' ? (
              <p className="intro-message">Select a feature type to calculate the score.</p>
            ) : (
              <p className="score">{score}</p>
            )
          }
        </section>
        <button className="" type="submit" disabled={watchAll.featureType === ''}>Add to Score Sheet</button>
        <button className="" type="button" onClick={() => reset({
          ...defaultValues,
          featureType: watchAll.featureType
        })}>Reset</button>
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

export default ScoreForm;