"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Alert from "./Alert";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

const BASE_URL = "https://api.talrop.com";
const API_URL = "/api/crisis-project-inquiries";


interface LeadFormData {
  full_name: string;
  designation: string;
  company_name: string;
  email: string;
  phone_whatsapp: string;
  location: string;
  project_type: string;
  project_details: string;
  venture_turnover: string;
  asset_value: string;
  current_status: string;
  crisis_needs: string[];
  need_from_talrop: string;
}

type AlertType = "success" | "error" | "";

interface AlertState {
  type: AlertType;
  message: string;
  visible: boolean;
}


const TURNOVER_OPTIONS = [
  { label: "< ₹10Cr", value: "Range_below_10Cr" },
  { label: "₹10–25Cr", value: "Range_10Cr_25Cr" },
  { label: "₹25–50Cr", value: "Range_25Cr_50Cr" },
  { label: "₹50–100Cr", value: "Range_50Cr_100Cr" },
  { label: "₹100Cr+", value: "Range_above_100Cr" },
];
const ASSET_VALUE_OPTIONS = [
  { label: "< ₹10Cr", value: "Range_below_10Cr" },
  { label: "₹10–25Cr", value: "Range_10Cr_25Cr" },
  { label: "₹25–50Cr", value: "Range_25Cr_50Cr" },
  { label: "₹50–100Cr", value: "Range_50Cr_100Cr" },
  { label: "₹100Cr+", value: "Range_above_100Cr" },
];
const CURRENT_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Stalled", value: "stalled" },
  { label: "Under stress", value: "under_stress" },
  { label: "Litigation stage", value: "litigation" },
  { label: "Debt pressure", value: "debt_pressure" },
  { label: "Investor pressure", value: "investor_pressure" },
];
const PROJECT_TYPE_OPTIONS = [
  { label: "Venture", value: "venture" },
  { label: "Real Estate", value: "real_estate" },
];


export default function LeadForm() {
  const INITIAL_FORM: LeadFormData = {
    full_name: "",
    designation: "",
    company_name: "",
    email: "",
    phone_whatsapp: "",
    location: "",
    project_type: "",
    project_details: "",
    venture_turnover: "",
    asset_value: "",
    current_status: "",
    crisis_needs: [],
    need_from_talrop: "",
  };

  const [form, setForm] = useState<LeadFormData>(INITIAL_FORM);
  const [otherText, setOtherText] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  const [alert, setAlert] = useState<AlertState>({
    type: "",
    message: "",
    visible: false,
  });

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ type, message, visible: true });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  const CRISIS_OPTIONS: string[] = [
    "Investor refunds / pressure",
    "Cash flow collapse",
    "Sales and growth stagnation",
    "Execution stalled",
    "Legal / compliance issues",
    "Tech architecture or product failure",
    "Team breakdown / governance issues",
    "PR crisis / reputation risk",
    "Distribution / market access blocked",
    "Other",
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "project_type") {
        return {
          ...prev,
          project_type: value,
          venture_turnover: "",
          asset_value: "",
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const toggleCrisis = (value: string) => {
    setForm((prev) => {
      const exists = prev.crisis_needs.includes(value);

      return {
        ...prev,
        crisis_needs: exists
          ? prev.crisis_needs.filter((v) => v !== value)
          : [...prev.crisis_needs, value],
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const crisisList = form.crisis_needs.filter((v) => v !== "Other");

    if (form.crisis_needs.includes("Other") && otherText.trim()) {
      crisisList.push(otherText.trim());
    }

    const payload = {
      ...form,
      venture_turnover: form.venture_turnover || null,
      asset_value: form.asset_value || null,
      crisis_needs: crisisList,
    };

    try {
      await axios.post(`${BASE_URL}${API_URL}`, payload);

      setForm(INITIAL_FORM);
      setOtherText("");
      setStep(1);
      showAlert("success", "Your form has been submitted successfully.");
    } catch (err: any) {
      showAlert(
        "error",
        err.response?.data
          ? "Submission failed. Please complete all required fields."
          : "Server error. Try again later."
      );
    }
  };

  function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder: string;
  }) {
    const selected = options.find((o) => o.value === value);

    return (
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full">
          {/* Button */}
          <ListboxButton className="w-full rounded-[8px] border border-[#CDD5DF] px-[12px] py-[8px] text-left bg-white text-[14px]">
            {selected ? selected.label : placeholder}
          </ListboxButton>

          {/* Options */}
          <ListboxOptions className="absolute z-50 mt-1 w-full rounded-[8px] border border-[#CDD5DF] bg-white shadow-lg">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-pointer px-[12px] py-[8px] text-[14px] ${
                    active ? "bg-[#EEF2F6]" : ""
                  }`
                }
              >
                {option.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    );
  }

  return (
    <div className="flex justify-between w-[100%] overflow-hidden flex-1">
      <div className="w-[40%] hidden md:block">
        <div
          style={{
            backgroundImage: "url('/bg-shadow.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="w-[100%]"
        >
          <div>
            <a
              className="w-[230px] max-[1280px]:w-[200px] max-[1180px]:w-[174px] cursor-pointer block"
              href="https://talrop.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="TalropLogo"
                loading="lazy"
                width={230}
                height={67}
                decoding="async"
                style={{ color: "transparent" }}
                src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/01-09-2022/Talrop_logo.svg"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="w-[60%] p-[16px] max-lg:p-0 max-lg:max-w-[1280px] max-lg:w-[90%] max-lg:mx-auto max-lg:py-[25px]">
        <div className="py-[89px] px-[89px] pt-[32px] pb-[32px] max-xl:pl-[80px] max-xl:pr-[80px] max-xl:pb-[0] max-xl:px-[80px]  max-lg:px-[30px]  max-ml:p-0">
          <div className="">
            <div className="">
              <h1 className="text-[#000000] text-[36px] mb-[4px] gordita_medium max-[1080px]:text-[32px] max-[640px]:text-[28px]">
                Crisis Intake Form
              </h1>
              <h4 className="text-[#000000] text-[18px] gordita_regular max-[1080px]:text-[18px] max-[640px]:text-[16px]  mb-[24px]">
                Confidential information to assess how Talrop can support you
              </h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {step === 1 && (
                  <section>
                    <h2 className="text-[#000000] text-[20px]  gordita_medium   mb-[12px] w-full">
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="full_name"
                          placeholder="Enter full name"
                          value={form.full_name}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Role / Designation{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="designation"
                          placeholder="Enter designation"
                          value={form.designation}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="company_name"
                          placeholder="Enter company name"
                          value={form.company_name}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={form.email}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Phone / WhatsApp{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="phone_whatsapp"
                          placeholder="Enter number"
                          value={form.phone_whatsapp}
                          type="number"
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="location"
                          placeholder="Enter location"
                          value={form.location}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-[10px] sm:justify-start mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className={`rounded-[8px] min-w-[95px] text-[14px] min-h-[35px] px-[14px] py-[10px] max-ml:w-[100%] font-semibold border-[1px] border-solid${
                          step === 1
                            ? " cursor-not-allowed bg-[#EEF2F6] text-[#9AA4B2] border-transparent"
                            : "cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] hover:opacity-[.8]"
                        }`}
                        disabled={step === 1}
                      >
                        Previous
                      </button>

                      {step < 4 && (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Next
                        </button>
                      )}

                      {step === 4 && (
                        <button
                          type="submit"
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </section>
                )}
                {step === 2 && (
                  <section>
                    <h2 className="text-[#000000] text-[20px]  gordita_medium   mb-[12px] w-full">
                      Project Details
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Project Type <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
  value={form.project_type}
  placeholder="Select project type"
  options={PROJECT_TYPE_OPTIONS}
  onChange={(value) =>
    setForm((prev) => ({
      ...prev,
      project_type: value,
    }))
  }
/>

                      </div>
                      <div>
                        <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                          Project Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="project_details"
                          placeholder="Your answer"
                          value={form.project_details}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full h-[100px] resize-none"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-[24px]">
                      <h2 className="text-[#000000] text-[20px]  gordita_medium   mb-[12px] w-full">
                        Size & Status
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {form.project_type !== "real_estate" && (
                          <div>
                            <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                              {form.project_type === "venture"
                                ? "Venture Turnover"
                                : "Turnover / Value"}
                              <span className="text-red-500">*</span>
                            </label>
                            <CustomSelect
                              value={form.venture_turnover}
                              placeholder="Select range"
                              options={TURNOVER_OPTIONS}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  venture_turnover: value,
                                }))
                              }
                            />
                          </div>
                        )}

                        {form.project_type === "real_estate" && (
                          <div>
                            <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                              Asset Value{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <CustomSelect
                              value={form.asset_value}
                              placeholder="Select asset value"
                              options={ASSET_VALUE_OPTIONS}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  asset_value: value,
                                }))
                              }
                            />
                          </div>
                        )}

                        <div>
                          <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                            Current Status{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <CustomSelect
                            value={form.current_status}
                            placeholder="Select current status"
                            options={CURRENT_STATUS_OPTIONS}
                            onChange={(value) =>
                              setForm((prev) => ({
                                ...prev,
                                current_status: value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-[10px] sm:justify-start mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className={`rounded-[8px] min-w-[95px] text-[14px] min-h-[35px] px-[14px] py-[10px] max-ml:w-[100%] font-semibold border-[1px] border-solid${
                          step === 1
                            ? " cursor-not-allowed bg-[#EEF2F6] text-[#9AA4B2] border-transparent"
                            : "cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] hover:opacity-[.8]"
                        }`}
                        disabled={step === 1}
                      >
                        Previous
                      </button>

                      {step < 4 && (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Next
                        </button>
                      )}

                      {step === 4 && (
                        <button
                          type="submit"
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </section>
                )}
                {step === 3 && (
                  <section>
                    <h2 className="text-[#000000] text-[20px]  gordita_medium   mb-[12px] w-full">
                      Crisis Mode Needs
                      <span className="text-red-500">*</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {CRISIS_OPTIONS.map((option) => (
                        <label
                          key={option}
                          className="flex items-center  text-[16px] gap-3 p-3 rounded-[8px] border-[1px] border-solid border-[#CDD5DF] hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded accent-gray-900 cursor-pointer"
                            checked={form.crisis_needs.includes(option)}
                            onChange={() => toggleCrisis(option)}
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {form.crisis_needs.includes("Other") && (
                      <div className="mt-4">
                        <input
                          type="text"
                          value={otherText}
                          placeholder="Please specify your need"
                          onChange={(e) => setOtherText(e.target.value)}
                          className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-[10px] sm:justify-start mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className={`rounded-[8px] min-w-[95px] text-[14px] min-h-[35px] px-[14px] py-[10px] max-ml:w-[100%] font-semibold border-[1px] border-solid${
                          step === 1
                            ? " cursor-not-allowed bg-[#EEF2F6] text-[#9AA4B2] border-transparent"
                            : "cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] hover:opacity-[.8]"
                        }`}
                        disabled={step === 1}
                      >
                        Previous
                      </button>

                      {step < 4 && (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Next
                        </button>
                      )}

                      {step === 4 && (
                        <button
                          type="submit"
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </section>
                )}
                {step === 4 && (
                  <section>
                    <h2 className="text-[#000000] text-[20px]  gordita_medium   mb-[12px] w-full">
                      Summary
                    </h2>
                    <div>
                      <label className="block gordita_medium text-[#364152] text-[14px] mb-1.5">
                        In one line, what happened and what you need from Talrop{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="need_from_talrop"
                        placeholder="Your answer"
                        value={form.need_from_talrop}
                        className="rounded-[8px] border-[1px] border-solid  border-[#CDD5DF] px-[12px] py-[8px] text-[16px] w-full h-[100px] resize-none"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-[10px] sm:justify-start mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className={`rounded-[8px] min-w-[95px] text-[14px] min-h-[35px] px-[14px] py-[10px] max-ml:w-[100%] font-semibold border-[1px] border-solid${
                          step === 1
                            ? " cursor-not-allowed bg-[#EEF2F6] text-[#9AA4B2] border-transparent"
                            : "cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] hover:opacity-[.8]"
                        }`}
                        disabled={step === 1}
                      >
                        Previous
                      </button>

                      {step < 4 && (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Next
                        </button>
                      )}

                      {step === 4 && (
                        <button
                          type="submit"
                          className="max-ml:w-[100%] rounded-[8px] min-w-[95px] min-h-[35px] text-[14px] px-[14px] py-[10px] font-semibold cursor-pointer bg-[#96CA4C] text-[#fff] border-[#96CA4C] border-[1px] border-solid hover:opacity-[.8]"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Alert alert={alert} onClose={closeAlert} />
    </div>
  );
}
