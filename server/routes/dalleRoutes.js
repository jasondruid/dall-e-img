import express from "express";
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res, next) => {
    res.send('Hello from DALL-E!');
})

router.route('/chat').post(async (req, res, next) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ e });
    }


});


router.route('/').post(async (req, res, next) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        });

        const image = aiResponse.data.data[0].b64_json;

        res.status(200).json({ photo: image });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
});

export default router;
