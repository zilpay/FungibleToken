<template>
  <b-jumbotron>
    <h1>FungibleToken Connect</h1>
    <p class="lead">You can connect your FungibleToken for call to call his methods</p>

    <small class="text-danger">{{errMsg}}</small>

    <b-form-group v-if="!isEnable"
        label="Contract owner:"
        description="It's value should be an Zilliqa address.">
        <b-form-input
          v-model="contracAddress"
          type="text"
          required
          placeholder="Enter your zil address">
        </b-form-input>
    </b-form-group>

    <div v-if="isEnable">
      <hr>
      <p class="lead text-info init" v-if="init">
        Owner: 
        <a :href="explore(toBech32Address(init[1].value), 'address')"
           class="text-secondary"
           target="_blank">{{toBech32Address(init[1].value)}}</a>
        <br>
        Total supply: <span class="text-secondary">{{init[2].value}}</span>
        <br>
        Balance: <span class="text-secondary">{{state.balance.value}} ZIL</span>
        <br>
        Decimals: <span class="text-secondary">{{init[3].value}}</span>
        <br>
        name: <span class="text-secondary">{{init[4].value}}</span>
        <br>
        name: <span class="text-secondary">{{init[4].value}}</span>
        <br>
        Symbol: <span class="text-secondary">{{init[5].value}}</span>
      </p>
      <hr>

      <b-button v-for="method of parseMethods" :key="method"
                @click="callMthod(method)"
                class="m-2"
                type="button"
                variant="secondary">{{method}}</b-button>
    </div>
    <b-button @click="connect" v-if="!isEnable" type="submit" variant="primary">Connect</b-button>

    <b-modal :ref="methods.Allowance"
          hide-footer
          :title="'Call '+methods.Allowance">
      <b-form-group :label="methods.Allowance"
                    description="tokenOwner : ByStr20, spender : ByStr20">
        <b-form-input
          type="text"
          v-model="allowance.tokenOwner"
          placeholder="tokenOwner">
        </b-form-input>
        <br>
        <b-form-input
          type="text"
          v-model="allowance.spender"
          placeholder="spender">
        </b-form-input>
      </b-form-group>
      <b-button @click="Allowance(contracAddress, allowance)"
                type="submit"
                variant="secondary">{{methods.Allowance}}</b-button>
    </b-modal>

    <b-modal :ref="methods.TransferFrom"
          hide-footer
          :title="'Call '+methods.TransferFrom">
      <b-form-group :label="methods.TransferFrom"
                    description="from : ByStr20, to : ByStr20, tokens : Uint128">
        <b-form-input
          type="text"
          v-model="transferFrom.from"
          placeholder="from">
        </b-form-input>
        <br>
        <b-form-input
          type="text"
          v-model="transferFrom.to"
          placeholder="to">
        </b-form-input>
        <br>
        <b-form-input
          type="text"
          v-model="transferFrom.tokens"
          placeholder="tokens">
        </b-form-input>
      </b-form-group>
      <b-button @click="TransferFrom(contracAddress, transferFrom)" type="submit"
                variant="secondary">{{methods.TransferFrom}}</b-button>
    </b-modal>

    <b-modal :ref="methods.Transfer"
             hide-footer
             :title="'Call '+methods.Transfer">
      <b-form-group :label="methods.Transfer"
                    description="to : ByStr20, tokens : Uint128">
        <b-form-input
          type="text"
          v-model="transfer.to"
          placeholder="to">
        </b-form-input>
        <br>
        <b-form-input
          type="text"
          v-model="transfer.tokens"
          placeholder="tokens">
        </b-form-input>
      </b-form-group>
      <b-button @click="Transfer(contracAddress, transfer)"
                type="submit"
                variant="secondary">{{methods.Transfer}}</b-button>
    </b-modal>

    <b-modal :ref="methods.Approve"
          hide-footer
          :title="'Call '+methods.Approve">
      <b-form-group :label="methods.Approve"
                    description="spender : ByStr20, tokens : Uint128">
        <b-form-input
          type="text"
          v-model="approve.spender"
          placeholder="spender">
        </b-form-input>
        <br>
        <b-form-input
          type="text"
          v-model="approve.tokens"
          placeholder="tokens">
        </b-form-input>
      </b-form-group>
      <b-button @click="Approve(contracAddress, approve)"
                type="submit"
                variant="secondary">{{methods.Approve}}</b-button>
    </b-modal>
  </b-jumbotron>
</template>

<script>
import {
  BJumbotron,
  BFormGroup,
  BFormInput
} from 'bootstrap-vue'
import ZilPayMixin from '../mixins/ZilPay'
import LoadMixin from '../mixins/loader'
import ViewBlockMixin from '../mixins/viewBlock'


export default {
  name: 'Connect-form',
  mixins: [ZilPayMixin, LoadMixin, ViewBlockMixin],
  components: {
    'b-jumbotron': BJumbotron,
    'b-form-group': BFormGroup,
    'b-form-input': BFormInput
  },
  data() {
    return {
      contracAddress: null,
      isEnable: false,
      errMsg: null,
      init: null,
      state: null,
      methods: {
        TransferFrom: 'TransferFrom',
        Transfer: 'Transfer',
        Approve: 'Approve',
        Allowance: 'Allowance'
      },
      allowance: {
        tokenOwner: null,
        spender: null
      },
      transferFrom: {
        from: null,
        to: null,
        tokens: null 
      },
      transfer: {
        to: null,
        tokens: null
      },
      approve: {
        spender: null,
        tokens: null
      }
    };
  },
  computed: {
    parseMethods() {
      return Object.keys(this.methods);
    }
  },
  methods: {
    async connect() {
      this.startLoading('connecting!');
      this.errMsg = null;

      try {
        const contractInfo = await this.contractInfo(this.contracAddress);

        this.init = contractInfo.init;
        this.state = {
          balance: contractInfo.state.filter(el => el.vname == '_balance')[0]
        };
        this.isEnable = true;
      } catch(err) {
        this.init = null;
        this.state = null;
        this.errMsg = err.message || err;
      }

      this.endLoading();
    },
    toBech32Address(address) {
      const zilliqa = new window.Zilliqa();
      const { toBech32Address } = zilliqa.crypto;
      return toBech32Address(address);
    },
    callMthod(method) {
      this.$refs[method].show();
    }
  }
}
</script>

<style>
.modal-backdrop {
  opacity: 0.6;
}
.init {
  font-size: 15px !important;
}
</style>
