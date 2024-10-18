"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import Question0 from "@/components/q-bagian-0-edit";
import Sidebar from "@/components/sidebar-edit";
import axios from "axios";

const EditBagian0 = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [editedQuestions, setEditedQuestions] = useState({});
  const [isDataArea, setDataArea] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const formRef = useRef(null);
  const [isPushed, setIsPushed] = useState(false);
  const [activeId, setActiveId] = useState("/admin/edit/");

  useEffect(() => {
    setLoading(true);

    axios
      .get("https://ppamkespro.com/api/instrument", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filteredQuestions = res.data.data.filter((q) => q.topicId === 0);
        setQuestions(filteredQuestions);
        setEditedQuestions(
          filteredQuestions.reduce(
            (acc, question) => ({ ...acc, [question.id]: question.question }),
            {}
          )
        );
      })
      .catch((error) => console.error("Error fetching questions:", error))
      .finally(() => setLoading(false));

    axios
      .get("https://ppamkespro.com/api/instrument/area", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDataArea(res.data.data))
      .catch((error) => console.error("Error fetching area data:", error));
  }, [token]);

  const handleInputChange = (name, value) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (id, value) => {
    setEditedQuestions((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPushed(true);

    const updatedQuestions = questions.map((q) => ({
      id: q.id,
      question: editedQuestions[q.id],
    }));

    try {
      const response = await axios.put(
        "https://ppamkespro.com/api/instrument",
        updatedQuestions,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Questions updated successfully");
      }
    } catch (error) {
      console.error(
        "Error updating questions:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsPushed(false);
    }
  };

  const handleSidebarClick = () => {
    if (formRef.current) {
      setIsPushed(false);
      formRef.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
        <Sidebar
          activeId={activeId}
          setActiveId={setActiveId}
          onClick={handleSidebarClick}
        />
        <div className="container w-[1048px] ml-[344px] space-y-6 p-4">
          <div className="bg-[#1446AB] pl-4 py-4 rounded-2xl w-[1048px]">
            <p className="text-white font-extrabold text-xl">
              Bagian 0 - Informasi umum (Edit Pertanyaan)
            </p>
          </div>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="flex flex-col gap-y-5"
          >
            {questions.map((question) => (
              <Question0
                key={question.id}
                type={question.type}
                no={question.number}
                label={`${question.number}. ${question.question}`}
                name={`question_${question.number}`}
                placeholder="Edit pertanyaan"
                questionText={editedQuestions[question.id] || ""}
                onQuestionChange={(value) =>
                  handleQuestionChange(question.id, value)
                }
                selectedValue={editedQuestions[question.number] || ""}
                setSelectedValue={(value) =>
                  handleQuestionChange(question.number, value)
                }
                onChange={handleInputChange}
              />
            ))}

            <div className="flex items-center ml-80 my-10 gap-x-5 w-3/12">
              <Button
                label={"Sebelumnya"}
                onClick={() => router.push("/assessment")}
                variant="disabled"
                type="button"
                disabled
              />
              <Button label={"SIMPAN PERUBAHAN"} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBagian0;
