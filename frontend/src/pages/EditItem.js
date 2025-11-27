import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    productId: '',
    quantity: '',
    unit: '',
    expirationDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error(`Failed to load item: ${res.status}`);
        const data = await res.json();
        // Maps backend data to frontend state structure
        setItem({
          productId: data.productId ?? '',
          quantity: data.quantity ?? '',
          unit: data.unit ?? '',
          expirationDate: data.expirationDate ? data.expirationDate.slice(0,10) : '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      // navigate back or to a success page
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading item...</div>;
  // if (error) return <div>Error: {error}</div>; // Uncomment once backend is ready

  return (
    <div>
      <h1>Edit Item</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Product ID</label>
          <input name="productId" value={item.productId} onChange={handleChange} />
        </div>

        <div>
          <label>Quantity</label>
          <input name="quantity" value={item.quantity} onChange={handleChange} />
        </div>

        <div>
          <label>Unit</label>
          <input name="unit" value={item.unit} onChange={handleChange} />
        </div>

        <div>
          <label>Expiration Date</label>
          <input
            type="date"
            name="expirationDate"
            value={item.expirationDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditItem;