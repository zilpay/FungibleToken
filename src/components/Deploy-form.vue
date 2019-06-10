<template>
    <b-jumbotron>
      <h1>FungibleToken creator</h1>
      <p class="lead">This dApp is a form to create fungible tokens.</p>
      <p>This token implements a fungible token interface a la ERC20.</p>

      <small class="lead text-danger">{{errorMsg}}</small>

    <b-form class="pt-3">
      <b-form-group
        label="Contract owner:"
        description="It's value should be an Zilliqa address.">
        <b-form-input
          v-model="form.owner"
          type="text"
          required
          placeholder="Enter your zil address">
        </b-form-input>
      </b-form-group>

      <b-form-group
        label="Token name:"
        description="It's value should be the token name.">
        <b-form-input
          v-model="form.name"
          type="text"
          required
          placeholder="Your token name">
        </b-form-input>
      </b-form-group>

      <b-form-group
        label="Token symbol:"
        description="A ticker symbol or stock symbol.">
        <b-form-input
          v-model="form.symbol"
          type="text"
          required
          placeholder="Your token symbol">
        </b-form-input>
      </b-form-group>

      <b-form-group
        label="Total supply of tokens:"
        description="It's value should be the total supply of the tokens.">
        <b-form-input
          v-model="form.totalSupply"
          type="text"
          required
          placeholder="Total supply value">
        </b-form-input>
      </b-form-group>

      <b-form-group
        label="Decimals:"
        description="18 is the most common number of decimal places.">
        <b-form-input
          v-model="form.decimals"
          type="number"
          required
          placeholder="Decimals value">
        </b-form-input>
      </b-form-group>

      <b-button @click="deploy" type="button" variant="primary">Deploy</b-button>
    </b-form>

    <b-modal :ref="isDeploy"
             hide-footer
             title="Contract created">
      <h6>Contract: 
        <a :href="explore(contract.ContractAddress, 'address')"
           class="text-info"
           target="_blank">{{contract.ContractAddress}}</a>
      </h6>
      <h6>owner: 
        <a :href="explore(contract.owner, 'address')"
           class="text-info"
           target="_blank">{{contract.owner}}</a></h6>
      <a class="btn btn-info"
         :href="explore(contract.id)"
         target="_blank">show on ViewBlock</a>
      <hr>
      <tree-view :data="contract.init" :options="treeViewOptions"></tree-view>
    </b-modal>
  </b-jumbotron>
</template>

<script>
import {
  BJumbotron,
  BFormGroup,
  BFormInput,
  BForm
} from 'bootstrap-vue'
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'


export default {
  name: 'Deploy-form',
  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin],
  components: {
    'b-jumbotron': BJumbotron,
    'b-form': BForm,
    'b-form-group': BFormGroup,
    'b-form-input': BFormInput
  },
  data() {
    return {
      form: {
        owner: null,
        name: null,
        symbol: null,
        totalSupply: null,
        decimals: 18
      },
      errorMsg: null,
      isDeploy: 'contract-deployed',
      contract: {},
      treeViewOptions: {
        maxDepth: 4,
        rootObjectKey: "init",
        modifiable: false,
        link: false
      }
    };
  },
  methods: {
    async deploy() {
      this.errorMsg = null;
      this.startLoading('Transaction padding');

      try {
        this.contract = await this.deployFungibleToken(
          this.form.owner,
          this.form.totalSupply,
          this.form.decimals,
          this.form.name,
          this.form.symbol
        );
      } catch(err) {
        this.errorMsg = err.message || err;
      }

      await this.txObservable(this.contract.id);

      this.$refs[this.isDeploy].show();

      this.endLoading();
    }
  },
  created() {
    try {
      window.zilPay.observableAccount().subscribe(() => {
        if (window.zilPay.defaultAccount) {
          this.form.owner =  window.zilPay.defaultAccount.bech32
        }
      });
    } catch(err) {
      // eslint-disable-next-line
    }
  }
}
</script>

<style>

</style>
