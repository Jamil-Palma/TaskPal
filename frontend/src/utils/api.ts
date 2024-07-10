import axios from "axios";

const apiUrl = process.env.REACT_APP_API_BASE_URL as string;


interface Message {
  role: string;
  content: string;
  type?: string;
}

interface StartConversationResponse {
  conversation_id: string;
  current_step_index: number;
  all_steps_completed: boolean;
  messages: Message[];
}

interface SendMessageResponse {
  response: string;
  current_step_index: number;
  all_steps_completed: boolean;
}

interface SendImageMessageResponse {
  response: string;
  current_step_index: number;
  all_steps_completed: boolean;
}

interface GetConversationResponse {
  conversation_id: string;
  current_step_index: number;
  all_steps_completed: boolean;
  messages: Message[];
}


export const startConversation = async (task: string): Promise<StartConversationResponse> => {
  try {
    const response = await axios.post<StartConversationResponse>(`${apiUrl}/text/start-conversation`, { task });
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

export const sendMessage = async (message: string, conversationId: string, filename?: string): Promise<SendMessageResponse> => {
  const data = {
    input_text: message,
    conversation_id: conversationId,
    filename,
  };

  try {
    const response = await axios.post<SendMessageResponse>(`${apiUrl}/text/ask`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendImageMessage = async (image: File, inputText: string, conversationId: string, task?: string): Promise<SendImageMessageResponse> => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('input_text', inputText);
  formData.append('conversation_id', conversationId || '');
  if (task) {
    formData.append('task', task);
  }

  try {
    const response = await axios.post<SendImageMessageResponse>(`${apiUrl}/image/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending image message:', error);
    throw error;
  }
};

export const getConversation = async (conversationId: string): Promise<GetConversationResponse> => {
  try {
    const response = await axios.post<GetConversationResponse>(`${apiUrl}/text/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};
