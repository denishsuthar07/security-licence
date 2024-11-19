import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const licenseNumbers = [
    'Z48-116-20S',
    '667-596-21S',
    'Z47-015-80S',
    'Z18-578-10S',
    'Z49-041-00S',
  ];

  const callApi = async () => {
    const apiUrl =
      'https://www.lars.police.vic.gov.au/LARS/LARS.asp?File=/Components/Screens/PSINFP03/PSINFP03.asp?Process=SEARCH';

    setResponses([]);
    setError('');
    setLoading(true);

    try {
      const responsesArray = [];
      for (const licenseNumber of licenseNumbers) {
        const xmlPayload = `
          <XML>
            <HEADER>
              <PROCESS>SEARCH</PROCESS>
              <TIMESTAMP>${new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, '')
                .slice(0, 14)}</TIMESTAMP>
              <SECURITYTOKEN>A63F4D6C-601D-407B-92E2-0997B5407E76</SECURITYTOKEN>
            </HEADER>
            <PAYLOAD>
              <GNDTLE01 id='idSearchPane'>
                <CONTROL name='dropdownlist'>%</CONTROL>
                <CONTROL name='searchtext'></CONTROL>
                <CONTROL name='SearchCriteriadropdownlist'>X</CONTROL>
                <CONTROL name='SearchAuthNb'>${licenseNumber}</CONTROL>
                <CONTROL name='Index'></CONTROL>
                <CONTROL name='Page'>1</CONTROL>
              </GNDTLE01>
            </PAYLOAD>
          </XML>
        `;

        const response = await axios.post(apiUrl, xmlPayload, {
          headers: {
            'Content-Type': 'text/xml',
            Accept: 'application/xml',
          },
        });

        responsesArray.push({ licenseNumber, data: response.data });
      }
      setResponses(responsesArray);
    } catch (err) {
      setError(err.response ? err.response.statusText : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <button onClick={callApi} disabled={loading}>
        {loading ? 'Loading...' : 'Call API'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {responses.map((response, index) => (
          <div key={index} className="response-block">
            <h3>License Number: {response.licenseNumber}</h3>
            <pre>{response.data}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;