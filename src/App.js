import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

const KOBITON_API_KEY = '865d9bab-d514-4396-aa1c-43e0c397f016';
const KOBITON_USER_NAME = 'doraemon';
const KOBITON_API_URL = 'http://3.0.95.43:3000';

// This function follow the KOBTION authentication documents
// This is basic way, You can enhance it with more security if you can
const getBasicAuthenHeaderKobiton = () => {
  const base64 = window.btoa(`${KOBITON_USER_NAME}:${KOBITON_API_KEY}`);
  return `Basic ${base64}`;
}

function App() {
  const [url, setUrl] = useState(null);
  const [height, setHeight] = useState("480");
  const [width, setWidth] = useState('640');

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
    if (e.origin !== 'http://3.0.05.43:8182') {
      return;
    }
    console.log('origin', e.origin);
    console.log('data passing', e.data);
    
    if (e.data.type === 'MANUAL_DEVICE_CONNECTION_CHANGED' && e.data.connected) {
    
    }


  }

  return (
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
    <div style={{width: '20%', marginTop: '200px'}}>
    <h2 style={{textAlign: 'center'}}>Modify height and weight</h2>
      <div sytle={{display: 'flex' }}>
        <label style={{marginRight: '20px'}}>Input height</label>
        <input value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <div style={{marginTop: '20px', display: 'flex'}}>
        <label style={{marginRight: '20px'}}>Input Width</label>
        <input value={width} onChange={(e) => setWidth(e.target.value)} />
      </div>
    </div>
    
    <div>
      <h1>SOW 7 Embedded iFrame Demo</h1>
      <iframe width={width} height={height} title="Embedded IFrame to customer website" id="kobiton-embedded-iframe"
        src={url? url['website']: ''}
      />
    </div>
    </div>
  );
}

export default App;
