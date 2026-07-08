import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const judge0 = axios.create({
  baseURL: `${API_BASE_URL}/proxy/judge0`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const judge0Api = {
  /**
   * Submit code for execution
   * @param {string} source_code - The source code to execute
   * @param {number} language_id - The numeric ID of the language
   * @param {string} stdin - Optional input for the program
   */
  submitCode: async (source_code, language_id, stdin = '') => {
    try {
      // Use robust base64 encoding for UTF-8
      const encode = (str) => btoa(unescape(encodeURIComponent(str)));
      
      const response = await judge0.post('/submissions?base64_encoded=true&fields=*', {
        source_code: encode(source_code),
        language_id,
        stdin: encode(stdin)
      });
      return response.data;
    } catch (error) {
      console.error('Judge0 Submission Error:', error);
      throw error;
    }
  },

  /**
   * Get the result of a submission
   * @param {string} token - The unique submission token
   */
  getSubmission: async (token) => {
    try {
      const response = await judge0.get(`/submissions/${token}?base64_encoded=true&fields=*`);
      const data = response.data;
      
      // Use robust base64 decoding for UTF-8
      const decode = (str) => str ? decodeURIComponent(escape(atob(str))) : null;
      
      return {
        ...data,
        stdout: decode(data.stdout),
        stderr: decode(data.stderr),
        compile_output: decode(data.compile_output),
        message: decode(data.message)
      };
    } catch (error) {
      console.error('Judge0 Retrieval Error:', error);
      throw error;
    }
  }
};
