import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import firestore from '@react-native-firebase/firestore';
import { Book } from '../utils/types';


type BookStoreState ={
  // For Opening the bottom sheet
  isModalVisible: boolean;
  selectedBook: Book | null;
  setIsModalVisible: (visible:boolean)=>void
  setSelectedBook: (book: Book | null)=> void
  reset: ()=> void

  // Favourites
  isFavourite: boolean;
  favourites: Book[];
  addFavourite: (book: Book) => void;
  removeFavourite: (bookId: string) => void;
  isBookFavourite: (bookId: string) => boolean;
};

export const useBookStore = create<BookStoreState>((set, get) => ({
    isModalVisible:false,
    selectedBook: null,
    isFavourite: false,
    favourites: [],


    setIsModalVisible: (visible)=> set({isModalVisible: visible}),
    setSelectedBook: (book)=> set({selectedBook: book}),

    reset: ()=> set({isModalVisible: false, selectedBook: null}),

    addFavourite: (book) => {
        const { favourites } = get();
        const exists = favourites.some(b => b.id === book.id);
        if (!exists) {
        const updated = [...favourites, { ...book, isFavourite: true }];
        AsyncStorage.setItem('favourites', JSON.stringify(updated));
        set({ favourites: updated });
        }
    },

    removeFavourite: (bookId) => {
        const { favourites } = get();
        const updated = favourites.filter(b => b.id !== bookId);
        AsyncStorage.setItem('favourites', JSON.stringify(updated));
        set({ favourites: updated });
    },

    isBookFavourite: (bookId) => {
        const { favourites } = get();
        return favourites.some(b => b.id === bookId);
    },

}))