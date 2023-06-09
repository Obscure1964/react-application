import { createContext, useState, useEffect } from "react"

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edited: false,
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    const response = await fetch(`/feedback?_sort=id&_order=desc`)
    const data = await response.json()

    setFeedback(data)
    setIsLoading(false)
  }

  const addFeedback = async (newFeedback) => {
    const response = await fetch("/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFeedback),
    })

    const data = await response.json()

    setFeedback([data, ...feedback])
  }

  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`/feedback/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updItem),
    })

    const data = await response.json()

    setFeedback(feedback.map((item) => (item.id === id ? data : item)))

    setFeedbackEdit({
      item: {},
      edit: false,
    })
  }

  const deleteFeedback = async (id) => {
    await fetch(`/feedback/${id}`, { method: "DELETE" })

    setFeedback(() => feedback.filter((item) => item.id !== id))
  }

  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edited: true,
    })
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
