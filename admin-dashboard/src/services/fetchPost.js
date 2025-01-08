const BASE_URL = '/api/';
const defaultErrorMessage = "Ocurrió un error, si el error continúa por favor recarga la página";

export async function fetchPostForm(endpoint, body, method="POST") {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

    // handeling conection errors
  } catch (err) {
    return { errors: defaultErrorMessage };
  }
}
  