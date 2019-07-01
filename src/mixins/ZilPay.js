export default {
  data() {
    return {
      code: {
        notZilPay: 'isZilPay',
        notEnable: 'isEnable',
        notConnect: 'notConnect'
      },
    };
  },
  methods: {
    validateAddreas(address) {
      const zilliqa = window.zilPay;
      const { validation } = zilliqa.utils;
      const {
        decodeBase58,
        toChecksumAddress,
        fromBech32Address,
        isValidChecksumAddress
      } = zilliqa.crypto;

      if (validation.isAddress(address)) {
        address = isValidChecksumAddress(address);
      } else if (validation.isBase58(address)) {
        address = decodeBase58(address);
      } else if (validation.isBech32(address)) {
        address = fromBech32Address(address);
      }
      return toChecksumAddress(address);
    },
    zilpayTest() {
      if (typeof window.zilPay === 'undefined') {
        return this.code.notZilPay;
      } else if (!window.zilPay.wallet.isEnable) {
        return this.code.notEnable;
      } else if (!window.zilPay.wallet.isConnect) {
        return this.code.notConnect;
      }
      
      return true;
    },
    async deployFungibleToken(owner, totalTokens, decimals, name, symbol) {
      const zilliqa = window.zilPay;
      const { units, Long } = zilliqa.utils;
      const { toBech32Address } = zilliqa.crypto;
      const code = window.code;
      
      owner = this.validateAddreas(owner);

      const init = [
        {
            "vname": "_scilla_version",
            "type": "Uint32",
            "value": "0"
        },
        {
            "vname": "owner",
            "type": "ByStr20",
            "value":  owner
        },
        {
          "vname": "total_tokens",
          "type": "Uint128",
          "value": totalTokens
        },
        {
          "vname": "decimals",
          "type": "Uint32",
          "value": decimals
        },
        {
            "vname": "name",
            "type": "String",
            "value": name
        },
        {
            "vname": "symbol",
            "type": "String",
            "value": symbol
        }
      ];
      const contract = zilliqa.contracts.new(code, init);
      const myGasPrice = units.toQa('1500', units.Units.Li);
      const [deployTx, newContract] = await contract.deploy({
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(10000)
      });

      return {
        init,
        ContractAddress: toBech32Address(newContract.address),
        owner: toBech32Address(deployTx.from),
        id: deployTx.TranID
      };
    },
    async txObservable(id) {
      return new Promise(resolve => {
        const zilliqa = window.zilPay;

        const obs = setInterval(() => {
          zilliqa.blockchain
                 .getTransaction(id)
                 .then(tx => {
                  resolve(tx);
                  clearInterval(obs);
                 })
                 .catch();
        }, 3000);
      });
    },
    async contractInfo(address) {
      const zilliqa = window.zilPay;
      
      address = this.validateAddreas(address);
      address = address.replace('0x', '');

      const init = await zilliqa.blockchain.getSmartContractInit(address);
      const state = await zilliqa.blockchain.getSmartContractState(address);

      if (!init.result || !state.result) {
        throw new Error('Wrong contract address');
      }

      return {
        init: init.result,
        state: state.result
      };
    },
    async TransferFrom(address, payload) {
      const zilliqa = window.zilPay;
      const { units, BN, Long } = zilliqa.utils;
      const contract = zilliqa.contracts.at(address);
      const gasPrice = units.toQa('1000', units.Units.Li);
      const tx = await contract.call(
        'TransferFrom',
        [
          {
            vname: "from",
            type: "ByStr20",
            value: this.validateAddreas(payload.from)
          },
          {
            vname: "to",
            type: "ByStr20",
            value: this.validateAddreas(payload.to)
          },
          {
            vname: "tokens",
            type: "Uint128",
            value: payload.tokens
          }
        ],
        {
          amount: new BN(0),
          gasPrice: gasPrice,
          gasLimit: Long.fromNumber(9000)
        }
      );

      return tx.TranID;
    },
    async Transfer(address, payload) {
      const zilliqa = window.zilPay;
      const { units, BN, Long } = zilliqa.utils;
      const contract = zilliqa.contracts.at(address);
      const gasPrice = units.toQa('1000', units.Units.Li);
      const tx = await contract.call(
        'Transfer',
        [
          {
            vname: "to",
            type: "ByStr20",
            value: this.validateAddreas(payload.to)
          },
          {
            vname: "tokens",
            type: "Uint128",
            value: payload.tokens
          }
        ],
        {
          amount: new BN(0),
          gasPrice: gasPrice,
          gasLimit: Long.fromNumber(9000)
        }
      );

      return tx.TranID;
    },
    async Approve(address, payload) {
      const zilliqa = window.zilPay;
      const { units, BN, Long } = zilliqa.utils;
      const contract = zilliqa.contracts.at(address);
      const gasPrice = units.toQa('1000', units.Units.Li);
      const tx = await contract.call(
        'Approve',
        [
          {
            vname: "spender",
            type: "ByStr20",
            value: this.validateAddreas(payload.spender)
          },
          {
            vname: "tokens",
            type: "Uint128",
            value: payload.tokens
          }
        ],
        {
          amount: new BN(0),
          gasPrice: gasPrice,
          gasLimit: Long.fromNumber(9000)
        }
      );

      return tx.TranID;
    },
    async Allowance(address, payload) {
      const zilliqa = window.zilPay;
      const { units, BN, Long } = zilliqa.utils;
      const contract = zilliqa.contracts.at(address);
      const gasPrice = units.toQa('1000', units.Units.Li);
      const tx = await contract.call(
        'Allowance',
        [
          {
            vname: "tokenOwner",
            type: "ByStr20",
            value: this.validateAddreas(payload.tokenOwner)
          },
          {
            vname: "spender",
            type: "ByStr20",
            value: payload.spender
          }
        ],
        {
          amount: new BN(0),
          gasPrice: gasPrice,
          gasLimit: Long.fromNumber(9000)
        }
      );

      return tx.TranID;
    }
  }
};