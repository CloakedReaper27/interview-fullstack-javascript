import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

type City = {
  uuid: string;
  cityName: string;
  count: number;
};

function App() {
  const [error, setError] = useState('');
  const [search, setSearch] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const citiesPerPage = 5;

  const fetchCities = async (query?: string) => {
    try {
      const url = query
        ? `/api/cities?search=${encodeURIComponent(query)}`
        : '/api/cities';

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      setCities(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch cities:", err);

    }
  };

  useEffect(() => {
    fetchCities();
  }, [])
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const paginatedCities = cities.slice(indexOfFirstCity, indexOfLastCity);
  const totalPages = Math.ceil(cities.length / citiesPerPage);
  
  const [deleteCityName, setDeleteCityName] = useState('');
  const [deleteCityuuid, setDeleteCityUuuid] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [formCityName, setFormCityName] = useState('');
  const [formCount, setFormCount] = useState(0);
  const [Cityuuid, setCityuuid] = useState<City | null>(null);

  const openModal = (city: City | null) => {
    setCityuuid(city);
    setFormCityName(city?.cityName || '');
    setFormCount(city?.count || 0);
    setShowModal(true);
  }

  const openDeleteModal = (city: City) => {
    setDeleteCityName(city.cityName);
    setDeleteCityUuuid(city.uuid);
    setShowDeleteModal(true);
  }

  const handleSubmit = async () => {
    if (!formCityName.trim()) {
      setError('City name cannot be empty');
      return;
    }
    if (!formCount){
      setError('Count cannot be empty');
      return;
    }else if (formCount > 9999){
      setError('Please input a count less than 9999');
      return;
    }
    setError('');
    console.log("Submitting form:", { formCityName, formCount, Cityuuid });

    const method = Cityuuid ? 'PUT' : 'POST';
    const url = Cityuuid
      ? `/api/cities/${Cityuuid.uuid}`
      : `/api/cities`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: formCityName, count: formCount }),
    })

    setShowModal(false);
    fetchCities(search);
  }

  const handleDelete = async (uuid: string) => {
    await fetch(`/api/cities/${uuid}`, { method: 'DELETE' });
    setShowDeleteModal(false);
    fetchCities(search);
  }

  const handleEdit = (city: City) => {
    openModal(city);
  }

  return (
    <div>
      <h1>City Search</h1>
        <div className='searchbox'>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e)=>{
              if (e.key === "Enter"){
                fetchCities(search)
              }
            }}
            placeholder="Search city..."
          />
          <button onClick={() => fetchCities(search)}>Search</button>
        </div>
      <button onClick={() => openModal(null)}>
        + Add City
      </button>

      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <h2>{Cityuuid ? "Edit City" : "Add City"}</h2>

            <div className='input-city'>
              <input
                type="text"
                value={formCityName}
                onChange={(e) => setFormCityName(e.target.value)}
                placeholder="City Name"
                required
              />
              <input
                type="number"
                value={formCount}
                onChange={(e) => setFormCount(Number(e.target.value))}
                placeholder="Count"
                required
              />
            </div>
              {error && <p style={{color: 'red'}}>{error}</p>}

            <div className='input-button'>
              <button onClick={handleSubmit}>
                {Cityuuid ? "Update" : "Create"}
              </button>
              <button onClick={() => {setShowModal(false), setError('')} }>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {paginatedCities.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>City Name</th>
                <th>Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCities.map((city) => (
                <tr key={city.uuid}>
                  <td>{city.cityName}</td>
                  <td>{city.count}</td>
                  <td>
                    <button onClick={() =>{  console.log("Editing city:", city); handleEdit(city)} }>Edit</button>
                    <button onClick={() => openDeleteModal(city)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No cities found.</p>
      )}

      {showDeleteModal && (
          <div className="modal">
          <h2> Are you sure you want delete {deleteCityName}?</h2>

          <div className='input-button'>
            <button onClick={() => handleDelete(deleteCityuuid)}>Delete</button>
            <button onClick={() => setShowDeleteModal(false) }>Cancel</button>
          </div>
        </div>
      )}
      
      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>

        <span> Page {' '}
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = Number(inputPage);
                if (value >= 1 && totalPages >= value) {
                  setCurrentPage(value);
                } else {
                  setInputPage(currentPage.toString());
                }
              }
            }}
            className="city-number-page"
          />{' '}

        of {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App
