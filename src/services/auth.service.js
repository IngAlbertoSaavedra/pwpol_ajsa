export default {
  login(email, password) {
    console.log("Login:", email, password);

    // aquí irá tu API real
    return Promise.resolve(true);
  },

  logout() {
    console.log("Logout");
  },
};
