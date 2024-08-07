import { useEffect, useState, useCallback } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const getMessages = useCallback(async () => {
    if (!selectedConversation?._id) return messages;

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      const res = await fetch(`/api/message/${selectedConversation._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(data);
      return data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedConversation?._id, setMessages]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  return { messages, loading, refetch: getMessages };
};

export default useGetMessages;
