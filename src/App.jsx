import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const KanjiListView = () => {
  const [kanjiList, setKanjiList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('name');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMeaning, setEditMeaning] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('kanjiListState'));
    if (savedState) {
      setFilterText(savedState.filterText);
      setSearchTerm(savedState.searchTerm);
      setFilterOption(savedState.filterOption);
      setKanjiList(savedState.kanjiList);
    }
  }, []);

  useEffect(() => {
    const fetchKanjiData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/kanji/search?keyWord=${searchTerm}&type=${filterOption}`);
        const result = await response.json();

        // console.log('result', result);

        if (result.message === 'success') {
          const formattedData = result.data.map((kanji) => ({
            id: kanji.id,
            name: kanji.name,
            meaning: kanji.meaning,
            imageFileId: kanji.imageFileId,
            imageType: kanji.imageFile.type,
            imagePage: kanji.imageFile.page,
          }));
          setKanjiList(formattedData);
          saveState(formattedData);
        } else {
          console.error('Failed to fetch kanji data');
        }
      } catch (error) {
        console.error('Error fetching kanji data:', error);
      }
    };
    if (searchTerm) {
      fetchKanjiData();
    }
  }, [searchTerm, filterOption]);

  const saveState = (kanjiList) => {
    const stateToSave = {
      filterText,
      searchTerm,
      filterOption,
      kanjiList,
    };
    localStorage.setItem('kanjiListState', JSON.stringify(stateToSave));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(filterText);
  };

  const handleFilterOptionChange = (e) => {
    const newFilterOption = e.target.value;
    setFilterOption(newFilterOption);
    if (searchTerm) {
      setSearchTerm(filterText);
    }
  };

  const handleRowClick = (imageFileId) => {
    saveState(kanjiList);
    navigate(`/kanji/${imageFileId}`);
  };

  const handleEdit = (kanji, e) => {
    e.stopPropagation();
    setEditingId(kanji.id);
    setEditName(kanji.name);
    setEditMeaning(kanji.meaning);
  };

  const handleSave = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/kanji/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName, meaning: editMeaning }),
      });
      const result = await response.json();
      if (result.message === 'success') {
        const updatedList = kanjiList.map((kanji) => (kanji.id === id ? { ...kanji, name: editName, meaning: editMeaning } : kanji));
        setKanjiList(updatedList);
        saveState(updatedList);
        setEditingId(null);
      } else {
        console.error('Failed to update kanji');
      }
    } catch (error) {
      console.error('Error updating kanji:', error);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className='container mx-auto p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-4xl font-bold mb-8 text-indigo-600'>Kanji List View</h1>
      <form onSubmit={handleSearch} className='mb-4 flex items-center space-x-4'>
        <div className='flex items-center flex-grow'>
          <FaSearch className='text-gray-400 mr-2' />
          <input
            type='text'
            placeholder='Filter kanji...'
            className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full'
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <button type='submit' className='p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200'>
          Search
        </button>
        <select
          className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          value={filterOption}
          onChange={handleFilterOptionChange}
        >
          <option value='name'>Filter by Name</option>
          <option value='meaning'>Filter by Meaning</option>
        </select>
      </form>
      <div className='overflow-x-auto'>
        <table className='w-full bg-white rounded-lg overflow-hidden shadow-lg'>
          <thead className='bg-indigo-600 text-white'>
            <tr>
              {['Name', 'Meaning', 'Book', 'Page', 'Actions'].map((header) => (
                <th key={header} className='p-3 text-left'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kanjiList.map((kanji) => (
              <tr
                key={kanji.id}
                className='border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer'
                onClick={() => handleRowClick(kanji.imageFileId)}
              >
                <td className='p-3 font-semibold'>
                  {editingId === kanji.id ? (
                    <input
                      type='text'
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className='p-1 border rounded'
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    kanji.name
                  )}
                </td>
                <td className='p-3'>
                  {editingId === kanji.id ? (
                    <input
                      type='text'
                      value={editMeaning}
                      onChange={(e) => setEditMeaning(e.target.value)}
                      className='p-1 border rounded'
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    kanji.meaning
                  )}
                </td>
                <td className='p-3'>{kanji.imageType === 'TAP_1' ? 'Tập 1' : kanji.imageType === 'TAP_2' ? 'Tập 2' : kanji.imageType}</td>
                <td className='p-3'>{kanji.imagePage}</td>
                <td className='p-3'>
                  {editingId === kanji.id ? (
                    <>
                      <button onClick={(e) => handleSave(kanji.id, e)} className='mr-2 text-green-600'>
                        <FaSave size={24} />
                      </button>
                      <button onClick={handleCancel} className='text-red-600'>
                        <FaTimes size={24} />
                      </button>
                    </>
                  ) : (
                    <button onClick={(e) => handleEdit(kanji, e)} className='text-blue-600'>
                      <FaEdit size={24} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {kanjiList.length === 0 && <p className='text-center text-gray-500 mt-4'>No results found</p>}
    </div>
  );
};

export default KanjiListView;
