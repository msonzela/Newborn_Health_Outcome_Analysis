
import { useEffect, useState } from "react";
import {
  Activity,
  Baby,
  BrainCircuit,
  ChartColumn,
  Database,
  HeartPulse,
  LayoutDashboard,
  MapPinned,
  ShieldAlert,
} from "lucide-react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getOverview,
  getRegions,
  getOutcomes,
  getModelPerformance,
  predictOutcome,
} from "./services/api";

const MENU = [
  { label: "Executive Overview", icon: LayoutDashboard },
  { label: "Regional Analytics", icon: MapPinned },
  { label: "Newborn Outcomes", icon: Baby },
  { label: "Model Performance", icon: BrainCircuit },
  { label: "Prediction Simulator", icon: Activity },
  { label: "Research Limitations", icon: ShieldAlert },
];

const initialForm = {
  maternal_age: 28,
  parity: 1,
  anc_visits: 5,
  maternal_bmi: 24.5,
  previous_complication: 0,
  maternal_hypertension: 0,
  maternal_diabetes: 0,
  region: "",
  facility_type: "",
};

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon size={19} className="text-teal-600" />
      </div>
      <h3 className="mt-3 text-2xl font-semibold">
        {value ?? "—"}
      </h3>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Percent({ value }) {
  if (value == null) return "—";
  return `${Number(value).toFixed(1)}%`;
}

function App() {
  const [page, setPage] = useState("Executive Overview");
  const [region, setRegion] = useState("");
  const [overview, setOverview] = useState(null);
  const [regions, setRegions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRegions() {
      try {
        const result = await getRegions();
        if (active) setRegions(result.regions || []);
      } catch (err) {
        if (active) {
          setError("Could not connect to FastAPI. Check port 8000.");
        }
      }
    }

    loadRegions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [overviewData, outcomesData] = await Promise.all([
          getOverview(region),
          getOutcomes(region),
        ]);

        if (active) {
          setOverview(overviewData);
          setOutcomes(outcomesData.outcomes || []);
        }
      } catch (err) {
        if (active) {
          setError("Unable to retrieve newborn health data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [region]);

  useEffect(() => {
    let active = true;

    getModelPerformance()
      .then((result) => {
        if (active) setPerformance(result);
      })
      .catch(() => {
        if (active) setPerformance(null);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handlePrediction(event) {
    event.preventDefault();
    setPredicting(true);
    setPredictionError("");
    setPrediction(null);

    try {
      const result = await predictOutcome(form);
      setPrediction(result);
    } catch (err) {
      setPredictionError(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : "Prediction failed. Check the API and input values."
      );
    } finally {
      setPredicting(false);
    }
  }

  const rateMetrics = [
    {
      label: "Newborn Records",
      value: overview?.total_records?.toLocaleString(),
      icon: Database,
    },
    {
      label: "Low Birth Weight",
      value: overview
        ? <Percent value={overview.low_birth_weight_rate} />
        : null,
      icon: Baby,
    },
    {
      label: "Preterm Birth",
      value: overview
        ? <Percent value={overview.preterm_birth_rate} />
        : null,
      icon: HeartPulse,
    },
    {
      label: "NICU Admission",
      value: overview
        ? <Percent value={overview.nicu_admission_rate} />
        : null,
      icon: Activity,
    },
  ];

  const modelResults = performance?.test_results || {};

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="w-full border-r border-slate-200 bg-white p-6 lg:min-h-screen lg:w-64">
        <div className="mb-9">
          <div className="flex items-center gap-2 text-teal-700">
            <HeartPulse size={26} />
            <span className="text-lg font-bold">Newborn Health</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Intelligence & Analytics
          </p>
        </div>

        <nav className="space-y-1">
          {MENU.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setPage(label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                page === label
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-10 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
          Synthetic research data only. Not for clinical use.
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Newborn Health Intelligence
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {page}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Synthetic maternal and newborn health analytics
            </p>
          </div>

          {["Executive Overview", "Newborn Outcomes"].includes(page) && (
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">All Regions</option>
              {regions.map((item) => (
                <option key={item.region} value={item.region}>
                  {item.region}
                </option>
              ))}
            </select>
          )}
        </header>

        {error && (
          <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <p className="mb-5 text-sm text-slate-500">Loading data...</p>
        )}

        {page === "Executive Overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {rateMetrics.map((item) => (
                <MetricCard key={item.label} {...item} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <ChartCard title="Low Birth Weight by Region">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Bar
                        dataKey="lbw_rate"
                        fill="#0d9488"
                        radius={[5, 5, 0, 0]}
                        name="LBW rate"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Newborn Outcome Rates">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={outcomes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="outcome"
                        tick={{ fontSize: 10 }}
                        interval={0}
                      />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Bar
                        dataKey="rate"
                        fill="#2563eb"
                        radius={[5, 5, 0, 0]}
                        name="Outcome rate"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
        )}

        {page === "Regional Analytics" && (
          <ChartCard title="Regional Outcome Comparison">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {["Region", "Births", "LBW %", "Preterm %", "NICU %"].map(
                      (header) => (
                        <th key={header} className="p-3">{header}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {regions.map((item) => (
                    <tr key={item.region} className="border-t border-slate-100">
                      <td className="p-3 font-medium">{item.region}</td>
                      <td className="p-3">{item.total_births}</td>
                      <td className="p-3">{item.lbw_rate}%</td>
                      <td className="p-3">{item.preterm_rate}%</td>
                      <td className="p-3">{item.nicu_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        )}

        {page === "Newborn Outcomes" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {outcomes.map((item) => (
              <div
                key={item.outcome}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <p className="text-sm text-slate-500">{item.outcome}</p>
                <p className="mt-2 text-3xl font-semibold">
                  {Number(item.rate).toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {item.cases.toLocaleString()} simulated cases
                </p>
              </div>
            ))}
          </div>
        )}

        {page === "Model Performance" && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Selected model:{" "}
              <strong>{performance?.selected_model || "Unavailable"}</strong>
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["ROC-AUC", "roc_auc"],
                ["Average Precision", "average_precision"],
                ["Recall", "recall"],
                ["F1 Score", "f1"],
              ].map(([label, key]) => (
                <MetricCard
                  key={key}
                  label={label}
                  value={
                    typeof modelResults[key] === "number"
                      ? modelResults[key].toFixed(3)
                      : "—"
                  }
                  icon={ChartColumn}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              These are saved held-out test results for the full synthetic
              dataset, not recalculated for regional filters.
            </p>
          </div>
        )}

        {page === "Prediction Simulator" && (
          <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
            <p className="mb-5 text-sm text-amber-800">
              Educational simulator only. Scores are not validated clinical
              probabilities or recommendations.
            </p>

            <form onSubmit={handlePrediction} className="grid gap-4 sm:grid-cols-2">
              {[
                ["maternal_age", "Maternal Age", 1],
                ["parity", "Parity", 1],
                ["anc_visits", "ANC Visits", 1],
                ["maternal_bmi", "Maternal BMI", 0.1],
              ].map(([key, label, step]) => (
                <label key={key} className="text-sm">
                  <span className="mb-2 block font-medium">{label}</span>
                  <input
                    type="number"
                    step={step}
                    required
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 p-3"
                  />
                </label>
              ))}

              {[
                ["previous_complication", "Previous Complication"],
                ["maternal_hypertension", "Maternal Hypertension"],
                ["maternal_diabetes", "Maternal Diabetes"],
              ].map(([key, label]) => (
                <label key={key} className="text-sm">
                  <span className="mb-2 block font-medium">{label}</span>
                  <select
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 p-3"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              ))}

              <label className="text-sm">
                <span className="mb-2 block font-medium">Region</span>
                <select
                  required
                  value={form.region}
                  onChange={(e) =>
                    setForm({ ...form, region: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-3"
                >
                  <option value="">Select region</option>
                  {regions.map((item) => (
                    <option key={item.region} value={item.region}>
                      {item.region}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-2 block font-medium">Facility Type</span>
                <select
                  required
                  value={form.facility_type}
                  onChange={(e) =>
                    setForm({ ...form, facility_type: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-3"
                >
                  <option value="">Select facility type</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Health Center">Health Center</option>
                  <option value="Dispensary">Dispensary</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={predicting}
                className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white disabled:opacity-50 sm:col-span-2"
              >
                {predicting ? "Calculating..." : "Run Synthetic Simulation"}
              </button>
            </form>

            {predictionError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {predictionError}
              </p>
            )}

            {prediction && (
              <div className="mt-6 rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Experimental model score
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {(prediction.experimental_score * 100).toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Simulated classification: {prediction.predicted_class}
                </p>
                <p className="mt-2 text-xs text-amber-800">
                  {prediction.interpretation}
                </p>
              </div>
            )}
          </div>
        )}

        {page === "Research Limitations" && (
          <div className="max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700">
            <h2 className="text-lg font-semibold">Responsible Interpretation</h2>
            <p>
              All records are synthetic. Regional and facility comparisons
              do not describe actual Tanzanian health outcomes.
            </p>
            <p>
              The machine learning model has not undergone external
              validation, clinical calibration or prospective evaluation.
            </p>
            <p>
              Model outputs must not be used for diagnosis, treatment,
              triage or individual patient decision-making.
            </p>
          </div>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-500">
          Newborn Health Intelligence · Data Science Portfolio ·
          Synthetic Data Only · Not for Clinical Use
        </footer>
      </main>
    </div>
  );
}

export default App;
