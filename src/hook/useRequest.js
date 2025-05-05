import React, {useState, useCallback} from 'react';

// https://medium.com/@jaryd_34198/seamless-api-requests-with-react-hooks-part-1-7531849d8381
export const useRequest = () => {
  const [res, setRes] = useState({
    data: null,
    pending: true,
    error: false,
  });

  const execute = useCallback(
    (
      url,
      method,
      parser,
      body = null,
      headers = {'Content-Type': 'application/json', 'authorization': localStorage.getItem('token')},
    ) => {
      console.log('IN EXECUTE::',  body);
      let status = null;
      setRes({
        data: null,
        pending: true,
        error: false,
      });
      
      const payload = {
        method: method,
        headers: headers,
      };

      if (body) {
        payload.body = JSON.stringify(body);
      }
      fetch(url, payload)
        .then(res => {
          status = res.status;
          return res.json();
        })
        .then(res => {
          // console.log('Check:', res, url, method);
          setRes({
            data: parser(res),
            pending: false,
            error: status > 299 ? true : false,
          });
        })
        .catch(error => {
          // console.log(error);
          setRes({
            data: error.message,
            pending: false,
            error: true,
          });
        });
    },
    [],
  );

  return [res, execute];
};