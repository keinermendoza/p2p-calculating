import { toast } from "react-toastify";

const defaultErrorMessage = "Ocurrió un error, si el error continúa por favor recarga la página";

export async function fetchPostForm(endpoint, body, method="POST") {
  try {
    const response = await fetch(endpoint, {
      credentials: 'include',
      method: method,
      body: body,
    });
    // handeling response errors
    if (!response.ok) {
      if (response.status === 500) {
        return {errors: defaultErrorMessage}
      } else {
        const errorResponse = await response.json();
        return { errors: errorResponse.errors || defaultErrorMessage };
      }
    }

    // returning data
    const result = await response.json();
    return result;

  }
  // handeling conection errors
  catch (err) {
    return { errors: defaultErrorMessage };
  }
}

export async function fetchPost(endpoint, payload, method = "POST") {
  try {
    const response = await fetch(endpoint, {
      method: method,
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(payload),
    });

    // handeling response errors
    if (!response.ok) {
      console.log("response no es ok")
      if (response.status === 500) {
        return {errors: defaultErrorMessage}
      } else {

        const errorResponse = await response.json();
        return { errors: errorResponse.errors || defaultErrorMessage };
      }
    }

    // returning data
    const result = await response.json();
    return result;

    // handeling conection errors
  } catch (err) {
    console.log("catchong erro")

    return { errors: defaultErrorMessage };
  }
}
  
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Comprueba si esta cookie comienza con el nombre buscado
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


// function showErrors(keys, errorObj) {
//   Object.keys(errorObj).forEach(key => {
//     if(keys.includes(key)) {
//       console.log(key, errorObj[key])
//       setError(key, { type: "server", message: errorObj[key] })
//     } else {
//       toast.error(errorObj[key]);
//     }
//   });
// }


/* uses react-hook-form setError for set errors in the form  
if the key error is not part of the request payload returns the error message else returns null
*/
export function showFieldErrorsOrGetErrorMessage(errorDict, requestPayload, reactHookSetError) {
    const payloadKeys = Object.keys(requestPayload);
    
    Object.keys(errorDict).forEach(key => {
      if(payloadKeys.includes(key)) {
        console.log(key, errorDict[key])
        reactHookSetError(key, { type: "server", message: errorDict[key] })
      } else {
        return errorDict[key]
      }
    });

    return null;
}