import { createContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    rules: "",
    poster: "",
    prizes: {
      first: "",
      second: "",
      third: "",
    },
    teamSize: "",
    lastDateModified: "",
    problemStatements: [],
    dates: {
      startRegistration: "",
      registrationEnd: "",
      chooseProblem: "",
      designSubmission: "",
      projectSubmission: "",
      reviewSubmissions: "",
      results: "",
    },
  });

  const [draftData, setDraftData] = useState({
    draftId: "",
    name: "",
    rules: "",
    poster: "",
    prizes: {
      first: "",
      second: "",
      third: "",
    },
    teamSize: "",
    lastDateModified: "",
    problemStatements: [],
    dates: {
      startRegistration: "",
      registrationEnd: "",
      chooseProblem: "",
      designSubmission: "",
      projectSubmission: "",
      reviewSubmissions: "",
      results: "",
    },
  });

  const onOpenModal = () => {
    setIsCreateModalOpen(true);
  };

  const onCloseSaveDraft = () => {
    setIsCreateModalOpen(false)
  }

  const onCloseModal = () => {
    setEventData({
      name: "",
      rules: "",
      poster: "",
      prizes: {
        first: "",
        second: "",
        third: "",
      },
      teamSize: "",
      lastDateModified: "",
      problemStatements: [],
      dates: {
        startRegistration: "",
        registrationEnd: "",
        chooseProblem: "",
        designSubmission: "",
        projectSubmission: "",
        reviewSubmissions: "",
        results: "",
      },
    });

    setIsCreateModalOpen(false)
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen: isCreateModalOpen,
        onOpenModal,
        eventData,
        setEventData,
        onCloseModal,
        onCloseSaveDraft,
        draftData,
        setDraftData
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
