import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Modal } from "components/Modal";
import { Searchbar } from "components/Searchbar/Searchbar";
import { ImageGallery } from "components/ImageGallery";
import { Button } from "components/Button";
import { Loader } from "components/Loader";

import { fetchImage } from "services/pixabay-api";

import { Container } from "./App.styled";

export const App = () => {
  const [images, setImages] = useState(() => []);
  const [searchQuerry, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [urlImage, setUrlImage] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if (searchQuerry === '') {
      return;
    };

    window.addEventListener('keydown', closeModal);

    const getImages = async () => {
      try {
        setIsLoading(true);

        const { hits, totalHits } = await fetchImage(searchQuerry, page);

        if (hits.length === 0) {
          return toast.info('Sorry, no results were found for your query');
        };

        setImages(state => [...state, ...hits]);
        setTotalHits(Math.ceil(totalHits / 12));

        setIsLoading(true);
      } catch (error) {
        return toast.error('Oops, something went wrong. Try refreshing the page');
      } finally {
        setIsLoading(false)
      };
    };

    getImages();
    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, [page, searchQuerry]);

  const closeModal = ev => {
    if (ev.code === 'Escape' || ev.target === ev.currentTarget) {
      setUrlImage(null);
    };
  };

  const handleFormSubmit = searchQuerry => {
    if (searchQuerry === '') {
      return toast.info('Please enter your search details');
    };
    
    setImages([]);
    setQuery(searchQuerry);
    setPage(1);
    setTotalHits(0);
  };

  const loadMore = () => {
    setPage(prevState => prevState+ 1);
    };

    return (
      <Container>
        {urlImage !== null && (
          <Modal image={urlImage} onClick={closeModal} />
        )}
        <Searchbar onSubmit={handleFormSubmit} Loading={isLoading} />
        {images.length > 0 && (
          <ImageGallery images={images} onSelect={setUrlImage}/>
        )}
        {totalHits > page && !isLoading && (
          <Button onClick={loadMore}/>
        )}
        {isLoading && (
          <Loader visible={isLoading}/>
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    )
  };