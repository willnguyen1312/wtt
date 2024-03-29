import { useEffect, useMemo, useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
}

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

        <Counter />
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
  console.log("render App");

  const [formValue, FormComponent] = useForm("N", "Your name");

  // const component = <FormComponent formValue={formValue} />;
  const component = FormComponent({ formValue });

  // console.log(component);

  return (
    <>
      <h1>{formValue}</h1>

      {component}
      {/* {FormComponent({ formValue })} */}
      {/* {AnotherFormComponent} */}
    </>
  );
}
