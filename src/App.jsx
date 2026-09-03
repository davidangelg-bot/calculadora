import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("0");
  const [expression, setExpression] = useState("");
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const formatNumber = (num) => {
    if (!Number.isFinite(num)) return "Error";

    return Number.isInteger(num)
      ? num.toLocaleString("en-US")
      : parseFloat(num.toFixed(10)).toLocaleString("en-US");
  };

  const getNumber = () => Number(value.replace(/,/g, ""));

  const inputNumber = (number) => {
    if (value === "Error") {
      setValue(number);
      setExpression("");
      return;
    }

    if (waiting) {
      setValue(number);
      setWaiting(false);
      return;
    }

    if (value === "0") {
      setValue(number);
    } else if (value.length < 14) {
      setValue(value + number);
    }
  };

  const decimal = () => {
    if (waiting) {
      setValue("0.");
      setWaiting(false);
      return;
    }

    if (!value.includes(".")) {
      setValue(value + ".");
    }
  };

  const clear = () => {
    setValue("0");
    setExpression("");
    setFirstValue(null);
    setOperator(null);
    setWaiting(false);
  };

  const toggleSign = () => {
    if (value === "0" || value === "Error") return;

    setValue(
      value.startsWith("-")
        ? value.substring(1)
        : "-" + value
    );
  };

  const percent = () => {
    if (value === "Error") return;

    const result = getNumber() / 100;
    setValue(formatNumber(result));
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? null : a / b;
      default:
        return b;
    }
  };

  const chooseOperator = (op) => {
    const input = getNumber();

    if (firstValue !== null && operator && !waiting) {
      const result = calculate(firstValue, input, operator);

      if (result === null) {
        setValue("Error");
        clear();
        return;
      }

      setFirstValue(result);
      setValue(formatNumber(result));
    } else {
      setFirstValue(input);
    }

    setOperator(op);
    setExpression(`${formatNumber(input)} ${op}`);
    setWaiting(true);
  };

  const equals = () => {
    if (firstValue === null || operator === null) return;

    const secondValue = getNumber();
    const result = calculate(firstValue, secondValue, operator);

    if (result === null) {
      setValue("Error");
      setExpression("Cannot divide by zero");
      setFirstValue(null);
      setOperator(null);
      setWaiting(true);
      return;
    }

    setExpression(
      `${formatNumber(firstValue)} ${operator} ${formatNumber(
        secondValue
      )} =`
    );

    setValue(formatNumber(result));
    setFirstValue(null);
    setOperator(null);
    setWaiting(true);
  };

  const Button = ({
    children,
    onClick,
    type = "number",
    wide = false,
  }) => {
    const styles = {
      number:
        "bg-white/8 text-white hover:bg-white/15 border border-white/5",
      function:
        "bg-slate-700/70 text-slate-200 hover:bg-slate-600/80 border border-white/5",
      operator:
        "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:from-violet-400 hover:to-indigo-500",
      equals:
        "bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg shadow-fuchsia-500/20 hover:from-fuchsia-400 hover:to-violet-500",
    };

    return (
      <button
        onClick={onClick}
        className={`
          ${wide ? "col-span-2" : ""}
          ${styles[type]}
          h-[68px]
          rounded-[22px]
          text-xl
          font-semibold
          backdrop-blur-xl
          transition-all
          duration-200
          active:scale-90
          hover:-translate-y-0.5
          select-none
        `}
      >
        {children}
      </button>
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b16] flex items-center justify-center px-4 py-8">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      {/* Calculator */}
      <section className="relative w-full max-w-[390px]">

        <div className="rounded-[38px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-3 pb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-violet-300/70">
                Calculator
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">
                Smart Calc
              </h1>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            </div>
          </div>

          {/* Display */}
          <div className="mb-4 rounded-[28px] border border-white/10 bg-black/20 px-5 py-6 text-right shadow-inner">

            <div className="mb-3 min-h-5 truncate text-sm text-slate-400">
              {expression || "Ready"}
            </div>

            <div
              className={`
                overflow-hidden
                text-5xl
                font-light
                tracking-tight
                text-white
                transition-all
                ${value.length > 9 ? "text-4xl" : ""}
                ${value.length > 12 ? "text-3xl" : ""}
              `}
            >
              {value}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">

            <Button type="function" onClick={clear}>
              AC
            </Button>

            <Button type="function" onClick={toggleSign}>
              ±
            </Button>

            <Button type="function" onClick={percent}>
              %
            </Button>

            <Button type="operator" onClick={() => chooseOperator("÷")}>
              ÷
            </Button>

            <Button onClick={() => inputNumber("7")}>7</Button>
            <Button onClick={() => inputNumber("8")}>8</Button>
            <Button onClick={() => inputNumber("9")}>9</Button>

            <Button type="operator" onClick={() => chooseOperator("×")}>
              ×
            </Button>

            <Button onClick={() => inputNumber("4")}>4</Button>
            <Button onClick={() => inputNumber("5")}>5</Button>
            <Button onClick={() => inputNumber("6")}>6</Button>

            <Button type="operator" onClick={() => chooseOperator("-")}>
              −
            </Button>

            <Button onClick={() => inputNumber("1")}>1</Button>
            <Button onClick={() => inputNumber("2")}>2</Button>
            <Button onClick={() => inputNumber("3")}>3</Button>

            <Button type="operator" onClick={() => chooseOperator("+")}>
              +
            </Button>

            <Button wide onClick={() => inputNumber("0")}>
              0
            </Button>

            <Button onClick={decimal}>
              .
            </Button>

            <Button type="equals" onClick={equals}>
              =
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-5 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">
              Simple • Fast • Beautiful
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
