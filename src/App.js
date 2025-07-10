import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    tags: '',
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return setMessage('❌ Please select an image!');

    const data = new FormData();
    data.append('image', image);
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/cards', data);
      setMessage('✅ Card uploaded successfully!');
      setCards((prev) => [res.data, ...prev]); // Add new card to top
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to upload card.');
    }
  };

  // Fetch existing cards on page load
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cards');
        setCards(res.data);
      } catch (err) {
        console.error('❌ Error fetching cards:', err);
      }
    };
    fetchCards();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cards/${id}`);
      setCards(cards.filter((card) => card._id !== id));
      setMessage('🗑️ Card deleted');
    } catch (err) {
      console.error('❌ Error deleting card:', err);
      setMessage('❌ Failed to delete card');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>📤 Upload Business Card</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="image" onChange={handleImageChange} required /><br /><br />
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required /><br /><br />
        <input type="text" name="company" placeholder="Company" onChange={handleChange} /><br /><br />
        <input type="text" name="title" placeholder="Title" onChange={handleChange} /><br /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} /><br /><br />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} /><br /><br />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} /><br /><br />
        <button type="submit">Upload</button>
      </form>

      <hr />
      <h3>🗂️ Uploaded Cards</h3>
      <input
        type="text"
        placeholder="🔍 Search by name, company, title or tag"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      {cards.length === 0 ? (
        <p>No cards uploaded yet.</p>
      ) : (
        cards
          .filter((card) => {
            const search = searchTerm.toLowerCase();
            return (
              card.name.toLowerCase().includes(search) ||
              card.company.toLowerCase().includes(search) ||
              card.title.toLowerCase().includes(search) ||
              card.tags.join(', ').toLowerCase().includes(search)
            );
          })
          .map((card) => (
            <div key={card._id} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '16px',
              padding: '12px'
            }}>
              <img
                src={card.imageUrl}
                alt={card.name}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
              />
              <h4>{card.name}</h4>
              <p><strong>Company:</strong> {card.company}</p>
              <p><strong>Title:</strong> {card.title}</p>
              <p><strong>Email:</strong> {card.email}</p>
              <p><strong>Phone:</strong> {card.phone}</p>
              <p><strong>Tags:</strong> {card.tags.join(', ')}</p>
              <button
                onClick={() => handleDelete(card._id)}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))
      )}
    </div>
  );
}

export default App;
