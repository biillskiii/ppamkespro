"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import Question0 from "@/components/q-edit"; // Import Question0
import Sidebar from "@/components/sidebar-edit";
import axios from "axios";

const EditBagian1 = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [editedQuestions, setEditedQuestions] = useState({}); // For edited questions
  const [editedSubQuestions, setEditedSubQuestions] = useState({}); // For edited subquestions

  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const formRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    axios
      .get("https://ppamkespro.com/api/instrument", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filteredQuestions = res.data.data.filter(
          (q) => q.number >= 68 && q.number <= 73
        );
        setQuestions(filteredQuestions);

        // Set edited questions and subquestions
        setEditedQuestions(
          filteredQuestions.reduce(
            (acc, question) => ({ ...acc, [question.id]: question.question }),
            {}
          )
        );

        setEditedSubQuestions(
          filteredQuestions.reduce((acc, question) => {
            if (question.sub) {
              return {
                ...acc,
                [question.id]: question.sub.reduce(
                  (subAcc, sub) => ({
                    ...subAcc,
                    [sub.id]: sub.question,
                  }),
                  {}
                ),
              };
            }
            return acc;
          }, {})
        );
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, [token]);

  // Update main question handler
  const handleQuestionChange = (id, value) => {
    setEditedQuestions((prev) => ({ ...prev, [id]: value }));
  };

  // Update subquestion handler
  const handleSubQuestionChange = (questionId, subId, value) => {
    console.log(
      `Updating subquestion ${subId} of question ${questionId} with value:`,
      value
    );
    setEditedSubQuestions((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [subId]: value,
      },
    }));
  };

  // Submit form
  const onSubmit = async (e) => {
    e.preventDefault();

    // Build the updated questions payload
    const updatedQuestions = questions.map((q) => ({
      id: q.id,
      number: q.number,
      question: editedQuestions[q.id], // Main question text
      sub: q.sub
        ? q.sub.map((sub) => ({
            id: sub.id,
            question: editedSubQuestions[q.id]?.[sub.id] || sub.question, // Updated subquestion or original
            type: sub.type,
            choice: sub.choice || [], // Preserve choice options
          }))
        : [],
    }));

    // Debugging payload
    console.log("Payload to be sent to API:", updatedQuestions);

    // Send request to API
    try {
      const response = await axios.put(
        "https://ppamkespro.com/api/instrument",
        updatedQuestions,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Questions updated successfully");
        console.log("Updated subquestions state: ", editedSubQuestions);
      }
    } catch (error) {
      console.error(
        "Error updating questions:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
        <Sidebar />
        <div className="container w-[1048px] ml-[344px] space-y-6 p-4">
          <div className="bg-[#1446AB] pl-4 py-4 rounded-2xl w-[1048px]">
            <p className="text-white font-extrabold text-xl">
              Bagian 2 - Informasi umum (Edit Pertanyaan)
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
                no={question.number}
                type={question.sub ? "sub" : question.type}
                label={`${question.number}. ${question.question}`}
                name={`question_${question.id}`}
                placeholder="Komentar/Referensi/Rincian..."
                options={question.choice || []} // Ensure choices are passed
                subname={question.subname}
                questionText={editedQuestions[question.id] || ""}
                onQuestionChange={(value) =>
                  handleQuestionChange(question.id, value)
                }
                subquestions={question.sub} // Pass subquestions correctly
                onSubQuestionChange={(subId, value) =>
                  handleSubQuestionChange(question.id, subId, value)
                }
              />
            ))}

            <div className="flex items-center ml-80 my-10 gap-x-5 w-3/12">
              <Button label={"SIMPAN PERUBAHAN"} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBagian1;
