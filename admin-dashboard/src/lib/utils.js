import { toast } from 'react-toastify';

/* takes a string in ISO date and returns a string in format DD/MM/YYYY  */
export function transformDate(DateISO) {

    const dateObject = new Date(DateISO);
    
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve meses de 0 a 11
    const year = dateObject.getFullYear();
    
    return `${day}/${month}/${year}`;
}

export function displayResponseMessages(response, data, setError) {
    if (response.errors) {
      const dataKeys = Object.keys(data);
      displayErrors(setError, dataKeys, response.errors)
    } else {
      if (response.message) {
        toast.success(response.message);
      }
    }
  }
  
  /* Helper for show error messages 
  shows errors in above form fields or display single toast.error is message has not field associated 
  */
  function displayErrors(setError, keys, errorObj) {
    try {
      Object.keys(errorObj).forEach(key => {
        if(keys.includes(key)) {
          setError(key, { type: "server", message: errorObj[key] })
        } 
        // break forEach execution for show toast 
        else {
          throw new Error(errorObj);
        }
      });
    } catch (err) {
      toast.error(err.message);
    }
  }
  