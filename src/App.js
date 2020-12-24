import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

const KOBITON_API_KEY = 'e1b1df2c-c717-4cd4-894b-7f7ba97d8423';
const KOBITON_USER_NAME = 'haibui';
const KOBITON_API_URL = 'http://localhost:3000';

// This function follow the KOBTION authentication documents
// This is basic way, You can enhance it with more security if you can
const getBasicAuthenHeaderKobiton = () => {
  const base64 = window.btoa(`${KOBITON_USER_NAME}:${KOBITON_API_KEY}`);
  return `Basic ${base64}`;
}

function App() {
  const [url, setUrl] = useState(null);
  const [height, setHeight] = useState("540");
  const [width, setWidth] = useState('640');

  document.title = 'Embedded IFrame';

  useEffect(() => {
    const headers = {authorization: getBasicAuthenHeaderKobiton()};
    
    const fetchIframeUrl = async () => {
      const url = await axios.get(`${KOBITON_API_URL}/v1/deviceViewport/url`, {headers})
        .then(res => res.data['WEBSITE']);
      
      const currentIframeUrl = getIframeURL();
      if (currentIframeUrl !== url) {
        setUrl(url);
        setIframeURL(url);
      } else {
        const urlCurrentIframe = getIframeLocationUrl();
        const finalUrl = urlCurrentIframe ? urlCurrentIframe : url;
        setUrl(finalUrl);
      }
    }
    fetchIframeUrl();

    const handleIFrameTask = (e) => {
      // You can do more thing from event message embedded iframe send to your website
      if (e.data.type === 'MANUAL_DEVICE_CONNECTION_CHANGED' && e.data.connected) {
      
      }
      
      // This codes will show you how to implement reload pay to keep manual sessions
      if (e.data.currentUrl) {
        handleChangeIframeURL(e.data.currentUrl);
      }
    }

    window.addEventListener('message', handleIFrameTask);

    const cleanUp = () => {
      window.removeEventListener('message', handleIFrameTask);
    }
    return cleanUp;
  }, [])

  const handleChangeIframeURL = (url) => {
    localStorage.setItem('IFRAME_CURRENT_URL', url);
  }

  const getIframeLocationUrl = () => {
    return localStorage.getItem('IFRAME_CURRENT_URL'); 
  }

  const setIframeURL = (url) => {
    localStorage.setItem('IFRAME_URL', url);
  }
  const getIframeURL = () => {
    return localStorage.getItem('IFRAME_URL');
  }

  return (
    <div>
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
    
    <div style={{textAlign: 'center'}}>
      <h1>SOW 7 Embedded iFrame Demo</h1>
      <iframe width={width} height={height} title="Embedded IFrame to customer website" id="kobiton-embedded-iframe"
        src={url? url: ''}
        // src="http://localhost:8182?token=4ebb3d844019e596d0028b0bf235c192c1910b58579a9c1ef80725642c1a02c4382a61fdec007e1e07a9469d1e82452d9c2dc847b63956229977fd9c4c694742056382777aabd1ebd17333d19854a9df25a588b59c87800cca0f55091edbd58fb45f3c9e60b146aeb27aa2229ea758a5&type=website"
      />
    </div>
    </div>
  );
}

export default App;
