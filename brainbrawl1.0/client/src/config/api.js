const API_URL = import.meta.env.PROD 
  ? 'https://brainbrawl-backend-bw7x.onrender.com' //Production URL
  : 'http://localhost:8000'; //Development URL

export default API_URL;