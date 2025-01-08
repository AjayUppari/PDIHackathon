import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ModalContext from "../../context/TimelineContext";
import { Dialog } from "@headlessui/react";
import StepOne from "../event-creation/StepOne";
import StepTwo from "../event-creation/StepTwo";
import StepThree from "../event-creation/StepThree";
import StepFour from "../event-creation/StepFour";

function DraftsList({ drafts }) {
  const navigate = useNavigate();
  const {
    isOpen,
    onOpenModal,
    eventData,
    setEventData,
    onCloseSaveDraft,
    draftData,
    setDraftData,
  } = useContext(ModalContext);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const steps = [
    { id: 1, name: "Create Event" },
    { id: 2, name: "Add Problem Statements" },
    { id: 3, name: "Define dates" },
    { id: 4, name: "Publish" },
  ];

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const nowDateAndTime = new Date().toISOString()

    const { userId } = JSON.parse(localStorage.getItem('userData'))
    const updatedEventData = {...draftData, lastDateModified: nowDateAndTime, userId, eventId: draftData.draftId}

    formData.append("eventData", JSON.stringify(updatedEventData)); // Append event data as JSON
    formData.append("file", eventData.poster);

    if (draftData.name === "") {
      alert("Event name mandatory");
    }
    else{
      const response = await fetch("http://localhost:5000/updateAndPublishEvent", {
        method: "PUT",
        body: formData,
      })

      const data= await response.json();
      console.log(data)
  }
    // Here call API for publishing the event
    onCloseSaveDraft();
    setCurrentStep(1);
  };

  const handleSaveAsDraft = async () => {
    // Here call API for saving the draft

    if (draftData.name === "") alert("Event name is mndatory");

    const draftId = draftData.draftId
    console.log('draft id is ', draftId)
    const url = `http://localhost:5000/saveDraftNew/${draftId}`

    const nowDateAndTime = new Date().toISOString()

    const userData = JSON.parse(localStorage.getItem('userData'))

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...draftData, lastDateModified: nowDateAndTime, isPublished: 'false', userId: userData.userId })
    })


    const jsonData = await response.json()
    console.log(jsonData)

    // onSaveAsDraft(eventData)
    onCloseSaveDraft();
    setCurrentStep(1);
  };

  function convertDraftToEvent(draftData) {
    return {
      draftId: draftData.event_id,
      name: draftData.event_name || "",
      rules: draftData.rules || "",
      poster: draftData.poster_link || "", // Assuming poster_link is the poster
      prizes: {
        first: draftData.first_prize || "",
        second: draftData.second_prize || "",
        third: draftData.third_prize || "",
      },
      teamSize: draftData.team_size || "",
      lastDateModified: draftData.last_modified_date || "",
      problemStatements:
        draftData.problem_statements.length > 0
          ? draftData.problem_statements.map((problem) => ({
            title: problem.problem_name || "",
            description: problem.problem_description || "",
            problemId: problem.problem_id,
          }))
          : [],
      dates: {
        startRegistration: draftData.registration_start_date || "",
        registrationEnd: draftData.registration_end_date || "",
        chooseProblem: draftData.problem_selection_deadline || "",
        designSubmission: draftData.document_submission_deadline || "",
        projectSubmission: draftData.project_submission_deadline || "",
        reviewSubmissions: draftData.reviewer_submission_deadline || "",
        results: draftData.results_announcement_date || "",
      },
    };
  }

  const openDraftModal = (draft) => {
    onOpenModal();

    const newDraftData = convertDraftToEvent(draft);

    console.log("New draft data is ", newDraftData);
    setDraftData({ ...newDraftData });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#07003D]">My Drafts</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problems
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drafts.map((draft) => (
              <tr key={draft.event_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#07003D]">
                    {draft.event_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(
                      new Date(draft.last_modified_date),
                      "MMM d, yyyy HH:mm"
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {draft.problem_statements?.length || 0} problems
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openDraftModal(draft)}
                    className="text-[#00D2F4] hover:text-[#1226AA] mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/events/${draft.event_id}`)
                    }
                    className="text-[#1226AA] hover:text-[#07003D]"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isOpen}
        onClose={onCloseSaveDraft}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg">
            <div className="p-6">
              <div className="mb-8">
                <nav aria-label="Progress">
                  <ol className="flex items-center justify-between">
                    {steps.map((step, stepIdx) => (
                      <li
                        key={step.name}
                        className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
                          }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`${currentStep >= step.id
                                ? "bg-[#1226AA]"
                                : "bg-gray-200"
                              } h-8 w-8 rounded-full flex items-center justify-center`}
                          >
                            <span className="text-white">{step.id}</span>
                          </div>
                          <span className="ml-4 text-sm font-medium">
                            {step.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="mt-6">
                {currentStep === 1 && (
                  <StepOne eventData={draftData} setEventData={setDraftData} />
                )}
                {currentStep === 2 && (
                  <StepTwo eventData={draftData} setEventData={setDraftData} />
                )}
                {currentStep === 3 && (
                  <StepThree
                    eventData={draftData}
                    setEventData={setDraftData}
                  />
                )}
                {currentStep === 4 && (
                  <StepFour eventData={draftData} setEventData={setDraftData} />
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`px-4 py-2 rounded ${currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Back
                </button>
                <div className="space-x-3">
                  {currentStep === 4 && (
                    <button
                      onClick={handleSaveAsDraft}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Save
                    </button>
                  )}
                  {currentStep === 4 ? (
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-[#00D2F4] text-white rounded hover:bg-[#1226AA]"
                    >
                      Publish Event
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-[#00D2F4] text-white rounded hover:bg-[#1226AA]"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default DraftsList;
