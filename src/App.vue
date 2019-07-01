<template>
  <div id="app">
    <nav class="navbar navbar-light" style="background: #2d3246;">
      <a class="navbar-brand text-warning" href="/#dapps">
        FungibleToken
      </a>
    </nav>
    <b-container class="mt-5">

      <b-row>
        <b-col>
          <deploy-form/>
        </b-col>
        <b-col>
          <connect-form/>
        </b-col>
      </b-row>
    </b-container>

    <b-modal :ref="code.notZilPay"
             hide-footer
             title="ZilPay is not installed!">
      <b-row class="justify-content-md-center">
        <img src="/img/home.png">
      </b-row>

      <b-row class="justify-content-md-center">
        <a href="https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd"
           target="_blank"
           class="btn btn-success m-2">FireFox</a>
        <a href="https://addons.mozilla.org/en-GB/firefox/addon/zilpay/"
           target="_blank"
           class="btn btn-success m-2">Chrome</a>
      </b-row>
    </b-modal>

    <b-modal :ref="code.notEnable"
             hide-footer
             title="ZilPay is not Enable!">
      <b-row class="justify-content-md-center">
        <img src="/img/lock.png">
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import DeployForm from './components/Deploy-form'
import ConnectForm from './components/Connect-form'
import ZilPayMixin from './mixins/ZilPay'
import LoadMixin from './mixins/loader'


export default {
  name: 'app',
  mixins: [ZilPayMixin, LoadMixin],
  components: {
    'deploy-form': DeployForm,
    'connect-form': ConnectForm
  },
  mounted() {
    window.addEventListener("load", async () => {
      this.endLoading();
      const test = await this.zilpayTest();

      if (test === this.code.notZilPay) {
        this.$refs[this.code.notZilPay].show();
      } else if (test === this.code.notEnable) {
        this.$refs[this.code.notEnable].show();
      } else if (test === this.code.notConnect) {
        await window.zilPay.wallet.connect();
      }

      window.zilPay.wallet.observableAccount(account => {
        this.ownerAddress = account.bech32;
      });
    });
  }
}
</script>

<style>

</style>
