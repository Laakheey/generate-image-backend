import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';
import { configDotenv } from 'dotenv';

configDotenv();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  const payload = {
    prompt,
    output_format: "jpeg"
  };

  try {
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.HOST_AI_SECRET_KEY}`,
          Accept: "image/*"
        },
      }
    );
    
    console.log("🚀 ~ app.post ~ response:", response)
    if (response.status === 200) {
      res.set('Content-Type', 'image/jpeg');
      res.send(response.data);
    } else {
      res.status(response.status).send(response.data.toString());
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
