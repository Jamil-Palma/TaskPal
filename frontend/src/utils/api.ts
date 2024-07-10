import axios from "axios";

export const startConversation = async (task: string) => {
  const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/text/start-conversation`, { task });
  return response.data;
};

export const sendMessage = async (message: string, conversationId: string, filename?: string) => {
  const data = {
    input_text: message,
    conversation_id: conversationId,
    filename,
  };

  const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/text/ask`, data);
  return response.data;
};

export const sendImageMessage = async (image: File, inputText: string, conversationId: string, task?: string) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('input_text', inputText);
  formData.append('conversation_id', conversationId || '');
  if (task) {
    formData.append('task', task);
  }
  console.log("before to send: ", formData)
  const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/image/process`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getConversation = async (conversationId: string) => {
  const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/text/conversations/${conversationId}`);
  return response.data;
};