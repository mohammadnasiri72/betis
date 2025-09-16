import { useEffect } from 'react';

const NajvaScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://van.najva.com/static/js/main-script.js';
    script.defer = true;
    script.id = 'najva-mini-script';
    script.setAttribute('data-najva-id', 'cf645b1d-f117-4fa3-8b6a-62a380d09cc1');
    document.head.appendChild(script);

    // تمیز کردن هنگام آنمونت
    return () => {
      const existingScript = document.getElementById('najva-mini-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
};

export default NajvaScript;