const { Router } = require('express');
const axios = require('axios');

const router = Router();

router.get('/news', (request, response) => {
    return getNews(request, response);
});

const getNews = async (request, response) => {
    const newsResponse = await axios.get(`https://newsapi.org/v2/everything?language=pt&q=musica&sortBy=publishedAt&apiKey=6de76939696f4bbfbf062edd5db3e562`)
    return response.status(200).json(newsResponse.data);
}

module.exports = { router };