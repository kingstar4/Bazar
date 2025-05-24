import axios from 'axios';
import { Book } from '../navigation/types';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const fetchBooks = async (searchTerm: string = ''): Promise<Book[]> => {
  try {
    const query = searchTerm.trim() !== '' ? searchTerm : 'subject:fiction';

    const { data } = await axios.get(BASE_URL, {
      params: {
        q: query,                      // User input or fallback
        filter: 'free-ebooks',         // Free books only
        download: 'epub',              // EPUB available
        country: 'NG',                 // Nigeria
        maxResults: 40,                 //Max allowed by Google Books API
      },
    });

    if (!data.items) {
      throw new Error('NoResults');
    }

    return data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response.data?.message || 'Failed to fetch books');
    }
    throw error;
  }
};
