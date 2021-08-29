import axios from 'axios';
import React, { useEffect } from 'react';
import { URLContext } from '../pages';

import styles from '../styles/PluginContent.module.css';

// This component would fetch and display the HTML for the plugin.
// Data about the plugin should be gotten from what ever state management we choose to use.
// The data should contain the URL to call for the plugin data, and that should replace
// the variable used to store the URL currently.
export const PluginContent = () => {
  // const pluginUrl = '/apps/default';
  const value = React.useContext(URLContext);

  useEffect(() => {
    axios.get(value.url).then(response => {
      const parser = new DOMParser();
      const html = parser.parseFromString(response.data, 'text/html');

      Array.from(html.querySelectorAll('link[rel="stylesheet"]')).forEach(
        element => {
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', element.href);
          document.head.appendChild(link);
        }
      );

      Array.from(html.scripts).forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.innerHTML = script.innerHTML;
        }
        script.remove();
        document.body.appendChild(newScript);
      });

      document.getElementById('plugin-container').innerHTML =
        html.body.innerHTML;
    });
  }, [value.url]);

  return (
    <section className={styles.container}>
      <div id="plugin-container" className={styles.content}>
        Loading...
      </div>
    </section>
  );
};
