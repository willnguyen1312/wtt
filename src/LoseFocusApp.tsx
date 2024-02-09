import { useEffect, useMemo, useState } from "react";

function useForm(defaultState: string, label: string) {
  const [value, setValue] = useState(defaultState);

  const FormComponent = ({ formValue }: { formValue: string }) => {
    useEffect(() => {
      console.log("render with ", formValue);
    }, []);

    return (
      <form>
        <label htmlFor={label}>
          {label}
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            type="text"
          />
        </label>
      </form>
    );
  };

  const AnotherFormComponent = useMemo(() => {
    return (
      <form>
        <label htmlFor={label}>
          {label}
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            type="text"
          />
        </label>
      </form>
    );
  }, [label, value]);

  return [value, FormComponent, AnotherFormComponent] as const;
}

export default function App() {
  const [formValue, FormComponent, AnotherFormComponent] = useForm(
    "N",
    "Your name",
  );

  return (
    <>
      <h1>{formValue}</h1>
      {/* <FormComponent formValue={formValue} /> */}
      {FormComponent({ formValue })}
      {AnotherFormComponent}
    </>
  );
}
