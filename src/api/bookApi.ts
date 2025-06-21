import axios from 'axios';
import { Book } from '../utils/types';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Updated fetchBooks function to support pagination
export const fetchBooks = async (
  searchTerm: string = '',
  pageParam: number = 0
): Promise<{ items: Book[]; nextPage: number | null }> => {
  try {
    const query = searchTerm.trim() !== '' ? searchTerm : 'subject:fiction';

    const { data } = await axios.get(BASE_URL, {
      params: {
        q: query,
        // filter: 'free-ebooks',
        download: 'epub',
        startIndex: pageParam,
        maxResults: 20, // Use 20 to reduce payload for infinite loading
      },
    });

    if (!data.items || data.items.length === 0) {
      return { items: [], nextPage: null };
    }

    return {
      items: data.items,
      nextPage: pageParam + 20, // Increment by page size
    };
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


export const fetchHomeBooks = async (searchTerm: string = ''): Promise<Book[]> => {
  try {
    const query = searchTerm.trim() !== '' ? searchTerm : 'subject:fiction';

    const { data } = await axios.get(BASE_URL, {
      params: {
        q: query,                      // User input or fallback
        // filter: 'free-ebooks',         // Free books only
        download: 'epub',              // EPUB available
        // country: 'US',                 // Nigeria
        maxResults: 40,                 //Max allowed by Google Books API
      },
    });

    if (!data.items) {
      throw new Error('NoResults');
    }

    // return data.items;
    const books: Book[] = data.items.map( (item:any )=> ({
      ...item,
      isFavourite: false, // Default value, can be updated later
    }));
    return books;

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