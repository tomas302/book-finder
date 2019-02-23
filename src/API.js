import axios from 'axios';

const apiKey = "AIzaSyD_IFTjUwNSb_GWrmlu6PbQfHsM7Oafkdc";

const searchBooks = async (text) => {
    let queryUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + text.replace(" ", "+");
    queryUrl += "&key=" + apiKey;
    queryUrl += "&projection=lite&printType=books&orderBy=relevance";
    let books;
    await axios.get(queryUrl).then(result => {
        books = result.data.items;
    });
    return books;
};

export { searchBooks };