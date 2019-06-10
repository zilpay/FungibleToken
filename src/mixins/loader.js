export default {
  methods: {
    startLoading(text = '') {
      const loader = window.document.querySelector('.loader-box');
      const loaderTitle = window.document.querySelector('#loader-title');

      loaderTitle.innerText = text;
      loader.style.display = 'block';
    },
    endLoading() {
      const loader = window.document.querySelector('.loader-box');
      loader.style.display = 'none';
    }
  }
};