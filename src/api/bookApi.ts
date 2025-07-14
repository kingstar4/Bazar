import axios from 'axios';
import { Book } from '../utils/types';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Utility function to check available download formats for a book
export const getAvailableDownloadFormats = (book: Book): { epub: boolean; pdf: boolean; epubLink?: string; pdfLink?: string } => {
  const accessInfo = book.accessInfo;
  
  return {
    epub: accessInfo?.epub?.isAvailable || false,
    pdf: accessInfo?.pdf?.isAvailable || false,
    epubLink: accessInfo?.epub?.downloadLink,
    pdfLink: accessInfo?.pdf?.downloadLink,
  };
};

// Function to fetch books with specific download format preference
export const fetchBooksWithFormat = async (
  searchTerm: string = '',
  pageParam: number = 0,
  preferredFormat: 'epub' | 'pdf' | 'both' = 'both'
): Promise<{ items: Book[]; nextPage: number | null }> => {
  try {
    const query = searchTerm.trim() !== '' ? searchTerm : 'subject:fiction';
    
    const params: any = {
      q: query,
      startIndex: pageParam,
      maxResults: 20,
    };

    // Add download parameter only if specific format is preferred
    if (preferredFormat !== 'both') {
      params.download = preferredFormat;
    }

    const { data } = await axios.get(BASE_URL, { params });

    if (!data.items || data.items.length === 0) {
      return { items: [], nextPage: null };
    }

    // Filter books based on available formats if 'both' is specified
    let filteredItems = data.items;
    if (preferredFormat === 'both') {
      filteredItems = data.items.filter((item: any) => {
        const formats = getAvailableDownloadFormats(item);
        return formats.epub || formats.pdf; // Include books with at least one format available
      });
    }

    return {
      items: filteredItems,
      nextPage: pageParam + 20,
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

// Function to download a book in a specific format
export const downloadBook = async (bookId: string, format: 'epub' | 'pdf'): Promise<string> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${bookId}`);

    const book: Book = data;
    const formats = getAvailableDownloadFormats(book);

    if (format === 'epub' && !formats.epub) {
      throw new Error('EPUB format not available for this book');
    }

    if (format === 'pdf' && !formats.pdf) {
      throw new Error('PDF format not available for this book');
    }

    const downloadLink = format === 'epub' ? formats.epubLink : formats.pdfLink;

    if (!downloadLink) {
      throw new Error(`Download link not available for ${format.toUpperCase()} format`);
    }

    return downloadLink;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response.data?.message || 'Failed to get download link');
    }
    throw error;
  }
};

// Updated fetchBooks function to support pagination with both EPUB and PDF downloads
export const fetchBooks = async (
  searchTerm: string = '',
  pageParam: number = 0
): Promise<{ items: Book[]; nextPage: number | null }> => {
  try {
    const query = searchTerm.trim() !== '' ? searchTerm : 'subject:fiction';

    // Remove the download parameter to get books with any available format
    const { data } = await axios.get(BASE_URL, {
      params: {
        q: query,
        // filter: 'free-ebooks',
        // Removed download parameter to get books with both EPUB and PDF availability
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
        // Removed download parameter to get books with both EPUB and PDF availability
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