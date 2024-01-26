import { useEffect, useState } from "react";

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

  return [value, FormComponent] as const;
}

export default function App() {
  const [formValue, FormComponent] = useForm("N", "Your name");

  return (
    <>
      <h1>{formValue}</h1>
      {/* <FormComponent formValue={formValue} /> */}
      {FormComponent({ formValue })}
    </>
  );
}
