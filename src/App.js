import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

const KOBITON_API_KEY = 'ce356d7d-1a6b-4a02-b613-916102fed0e2';
const KOBITON_USER_NAME = 'doraemon';
const KOBITON_API_URL = 'http://localhost:3000';

// This function follow the KOBTION authentication documents
// This is basic way, You can enhance it with more security if you can
const getBasicAuthenHeaderKobiton = () => {
  const base64 = window.btoa(`${KOBITON_USER_NAME}:${KOBITON_API_KEY}`);
  return `Basic ${base64}`;
}

function App() {
  const [url, setUrl] = useState(null);
  document.title = 'Embedded IFrame';
  useEffect(() => {
    const headers = {authorization: getBasicAuthenHeaderKobiton()};
    const fetchIframeUrl = async () => {
      const urls = await axios.get(`${KOBITON_API_URL}/v1/viewers/url`, {headers})
        .then(res => res.data);
      setUrl(urls)
    }
    fetchIframeUrl();

    window.addEventListener('message', handleIFrameTask);
  }, [])

  const handleIFrameTask = (e) => {
    if (e.origin !== 'http://localhost:8182') {
      return;
    }
    console.log('origin', e.origin);
    console.log('data passing', e.data);
    
    if (e.data.type === 'MANUAL_DEVICE_CONNECTION_CHANGED' && e.data.connected) {
      // handle set width height here
    }


  }

  return (
    <div className="App">
      <h1>SOW 7 Embedded iFrame Demo</h1>
      <iframe width="640" height="640" title="Embedded IFrame to customer website" id="kobiton-embedded-iframe"
        src={url? url['website']: ''}
      />
    </div>
  );
}

export default App;
