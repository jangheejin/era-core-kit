import { jsx as _jsx } from "react/jsx-runtime";
export function OutcomeList({ outcomes }) {
    return (_jsx("ul", { className: "outcomeslist", children: outcomes.map((outcome, i) => (_jsx("li", { className: "outcome", children: outcome }, i))) }));
}
