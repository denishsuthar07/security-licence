import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [responseData, setResponseData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callApi = async () => {
    const apiUrl =
      'https://www.lars.police.vic.gov.au/LARS/LARS.asp?File=/Components/Screens/PSINFP03/PSINFP03.asp?Process=SEARCH';

    const xmlPayload = `
      <XML>
        <HEADER>
          <PROCESS>SEARCH</PROCESS>
          <TIMESTAMP>20241119100226</TIMESTAMP>
          <SECURITYTOKEN>A63F4D6C-601D-407B-92E2-0997B5407E76</SECURITYTOKEN>
        </HEADER>
        <PAYLOAD>
          <GNDTLE01 id='idSearchPane'>
            <CONTROL name='dropdownlist'>%</CONTROL>
            <CONTROL name='searchtext'></CONTROL>
            <CONTROL name='SearchCriteriadropdownlist'>X</CONTROL>
            <CONTROL name='SearchAuthNb'>Z48-116-20S</CONTROL>
            <CONTROL name='Index'></CONTROL>
            <CONTROL name='Page'>1</CONTROL>
          </GNDTLE01>
        </PAYLOAD>
      </XML>
    `;

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(apiUrl, xmlPayload, {
        headers: {
          'Content-Type': 'text/xml',
          Accept: 'application/xml',
        },
      });

      setResponseData(response.data);
    } catch (err) {
      setError(err.response ? err.response.statusText : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <button onClick={callApi}>Call API</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {responseData && (
        <div>
          <h2>Response:</h2>
          <pre>{responseData}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
