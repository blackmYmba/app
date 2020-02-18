export default () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (data) => {
      resolve({ latitude: data.coords.latitude, longitude: data.coords.longitude });
    },
    (err) => {
      reject(err);
    }
  );
});
