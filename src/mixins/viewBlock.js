export default {
  data() {
    return {
      viewBlockUrl: 'https://viewblock.io/zilliqa'
    };
  },
  methods: {
    explore(id, type='tx') {
      // eslint-disable-next-line
      const network = !!window.zilPay ? window['zilPay']['net'] : 'mainnet';
      return `${this.viewBlockUrl}/${type}/${id}?network=${network}`;
    }
  }
};