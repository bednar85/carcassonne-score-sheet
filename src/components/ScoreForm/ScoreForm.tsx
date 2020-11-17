import React from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  featureType: string;
  sections: number;
  pennants?: number;
  innWithLake?: boolean;
  cathedral?: boolean;
  testArray?: string[];
};

const calculateScore = (formValues: Inputs): number => {
  const { featureType, innWithLake, cathedral } = formValues;
  const sections = Number(formValues.sections);
  const pennants = formValues.pennants ? Number(formValues.pennants) : 0;

  // console.log('');
  // console.log('FILENAME - METHOD');
  // console.log('  formValues:', formValues);
  // console.log('  sections:', sections);
  // console.log('  pennants:', pennants);

  if (featureType === undefined || featureType === '') {
    return 0;
  }

  if (featureType === 'road') {
    return innWithLake ? sections * 2 : sections;
  }

  if (featureType === 'city') {
    return cathedral ? (sections + pennants) * 3 : (sections + pennants) * 2;
  }

  return 0;
};

export default function ScoreForm() {
  const defaultValues = { featureType: 'road', sections: 2 }
  const { register, watch } = useForm<Inputs>({ defaultValues });

  const watchAll = watch();

  console.log('watchAll:', watchAll);

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
        </div>
        <div>
          <strong>Sections:</strong>
          <input
            name="sections"
            type="number"
            defaultValue={defaultValues.sections}
            min={2}
            ref={register}
          />
        </div>
        {/* {watchFeatureType === 'city' && (
          <div>
            <strong>Pennants:</strong>
            <input
              name="pennants"
              type="number"
              defaultValue="0"
              min="0"
              max={watchSections}
              ref={register}
            />
          </div>
        )} */}
        <div>
          <strong>Pennants:</strong>
          <input
            name="pennants"
            type="number"
            defaultValue={0}
            min={0}
            ref={register}
          />
        </div>
        <div>
          {/* {watchFeatureType === 'road' && (
            <>
              <strong>Modifiers:</strong>
              <label>
                <input name="innWithLake" type="checkbox" value="hasInnWithLake" ref={register} />
                Inn with Lake
              </label>
            </>
          )}
          {watchFeatureType === 'city' && watchSections > 5 && (
            <>
              <strong>Modifiers:</strong>
              <label>
                <input name="cathedral" type="checkbox" value="hasCathedral" ref={register} />
                Cathedral
              </label>
            </>
          )} */}
          <>
            <strong>Modifiers:</strong>
            <label>
              <input name="innWithLake" type="checkbox" defaultChecked={false} ref={register} />
              Inn with Lake
            </label>
            <strong>Modifiers:</strong>
            <label>
              <input name="cathedral" type="checkbox" defaultChecked={false} ref={register} />
              Cathedral
            </label>
          </>
        </div>
      </form>
      {/* <div>
        {!Object.keys(values).length ? (
          <em>Select a feature type to calculate the score.</em>
        ) : (
          <>
            <strong>Score:</strong>
            {score}
          </>
        )}
      </div> */}
    </div>
  );
}
