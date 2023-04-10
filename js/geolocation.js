function geolocationSupport() {
  //   if ("geolocation" in navigator) {
  //     return true;
  //   }

  //   return false;

  return "geolocation" in navigator;
}
//geolocalización podremos obtener nuestra latitud y longitud

const defaultOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000000,
};

export function getCurrentPosition(options = defaultOptions) {
  if (!geolocationSupport())
    throw new Error("No hay soporte de geolocalización en tu navegador");

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        resolve({
          lat,
          long,
        });

        // console.log(position);
      },
      () => {
        reject("no hemos podido obtener tu ubicación");
      },
      options
    );
  });
}
// {
//     coords: { latitude: lat, longitude: long },
//   }
export async function getLatLong(options = defaultOptions) {
  try {
    const { lat, long } = await getCurrentPosition(options);

    return { lat, long, isError: false };
  } catch {
    return { isError: true, lat: null, long: null };
  }
}
