import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const KanjiDetail = () => {
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchKanjiDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/image-file/${id}`);
        const data = await response.json();
        if (data.message === 'success') {
          setImageFile(data.data);
          setCurrentPage(data.data.page);
          // console.log('data.data', data.data);
        } else {
          console.error('Failed to fetch kanji detail');
        }
      } catch (error) {
        console.error('Error fetching kanji detail:', error);
      }
    };

    if (id) {
      fetchKanjiDetail();
    }
  }, [id]);

  const fetchPageData = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/image-file/page?type=${imageFile?.type}&page=${page}`);
      const data = await response.json();
      if (data.message === 'success') {
        setImageFile(data.data);
        setCurrentPage(data.data.page);
      } else {
        console.error('Failed to fetch page data');
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => {
      const newPage = prev > 1 ? prev - 1 : prev;
      fetchPageData(newPage);
      return newPage;
    });
  };

  const handleNext = () => {
    setCurrentPage((page) => {
      const newPage = page + 1;
      fetchPageData(newPage);
      return newPage;
    });
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <div className='flex-grow overflow-auto p-4'>
        <div className='flex items-center justify-center min-h-full'>
          {imageFile?.id ? (
            <img
              src={`http://localhost:3000/api/v1/image-file?id=${imageFile.id}`}
              alt={`Kanji detail ${currentPage}`}
              className={`${
                isZoomed ? 'w-full h-auto' : 'w-[60%] h-auto'
              } object-contain shadow-lg rounded-lg transition-all duration-300 cursor-zoom-in`}
              onClick={handleImageClick}
              onError={(e) => {
                e.target.onerror = null;
                e.target.alt = 'Image not available';
              }}
            />
          ) : (
            <div className='text-center text-gray-500'>
              <p>Image not available</p>
            </div>
          )}
        </div>
      </div>

      <div className='bg-white shadow-md p-4 sticky bottom-0'>
        <div className='flex items-center justify-between max-w-4xl mx-auto'>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-300'
            aria-label='Previous page'
          >
            <FaArrowLeft className='mr-2' />
            Previous
          </button>

          <div className='text-xl font-bold text-blue-500'>Page {currentPage}</div>

          <button
            onClick={handleNext}
            className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-300'
            aria-label='Next page'
          >
            Next
            <FaArrowRight className='ml-2' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanjiDetail;
