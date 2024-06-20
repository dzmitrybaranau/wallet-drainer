// TODO: make abuse of 24/7 wallet drainers

import { zkSyncWeb3Provider } from "./chains/zkSync/zkSync";
import { getWalletFromPrivateKey, getWalletsData } from "@config/walletsData";
import { wait } from "@utils/utils";
import walletSeedPhrases from "./config/nasty.json";
import { getWalletPrivateKeysFromSeedPhrase } from "@utils/walletUtils";
import { Web3BaseWalletAccount } from "web3";
import { arbitrumChainWeb3Provider } from "./chains/arbitrum/arbitrum_chain";
import { drainToken } from "./main/drainToken";

const eligibleWallets = [
  {
    address: "0xAb10c33cBF1C32d19d27A52809C63E05cec79bC1",
    privateKey:
      "0x991f63dd7e20fa5e40915b0df0382181ade56a2801933a85f9931d1950ec4f0e",
    allocation: "40.45",
  },
  {
    address: "0x41F24F35fC7d71eF63EB929fa8E29EF7Eb6F391A",
    privateKey:
      "0x578c85cf90644d422306bb33774f00478ac571e57cc643e0f5cb9d91e23ed6db",
    allocation: "39.26",
  },
  {
    address: "0xe07157967995652aEC27e49De5442257824c2F32",
    privateKey:
      "0x2c7f8ba1ff45669807493c9b951cc6392cd521a1dfbb2c3914992ccf19607af2",
    allocation: "38.49",
  },
  {
    address: "0xEdC2Deb4ff62E4c117Cab1d3bDfB79C5B6Ed3167",
    privateKey:
      "0xb6e2567e5e385e6b4b5e92185c3a743f27804a61693f1d2df9d10fa5d072a9e8",
    allocation: "38.43",
  },
  {
    address: "0x2047Aeb8e6eaB9a951D852379f7767a1574229DB",
    privateKey:
      "0x0f4feb2527ad5efc27781fc90173ac9e594dc595d38e1caec281b37ce047ec7e",
    allocation: "37.81",
  },
  {
    address: "0x7490D4e8B58dDcbD12a72db36Dc7877BC32425ae",
    privateKey:
      "0x331469a572ae3a5a6a8cd3433f0c5a8d3fcf4ab563c663defe8241ab61089aa8",
    allocation: "37.68",
  },
  {
    address: "0x974A6FE593D295bF66BB5afc7B5cF3ee6fF506E4",
    privateKey:
      "0x8f1b7e47fbb956f8fe935f36e9139bafd5c1cff6a7a43c374657c60dc3b08957",
    allocation: "37.61",
  },
  {
    address: "0x7D6bB68838EC6db356cE7C1Af96F5312B5CaEF04",
    privateKey:
      "0x882ef90dda626de78a86a20f245f073402300c390aa58da99d9a1a4f1e71d6fa",
    allocation: "37.46",
  },
  {
    address: "0x0e84fAF4F4c534D7c5C1274D6A6F32ecDf3F8559",
    privateKey:
      "0x40a9ad63b32f1a20f433519fba33946bc221a018a15feb8307ff8dfc3f1bf83f",
    allocation: "37.33",
  },
  {
    address: "0x7F3dbfA41318159AE3F0736e0B5992b4Da455350",
    privateKey:
      "0x24819affe9e1ec96eef18537a03e934af6401a3a5409cb58a3988bfda532c162",
    allocation: "37.24",
  },
  {
    address: "0xABc813a27ffF8600843d57D78C8397fe9622d643",
    privateKey:
      "0x7663f8f638ddbaf4a1ac99575b671aab003f1129aebfd828e556232ab64c6f5d",
    allocation: "37.07",
  },
  {
    address: "0xdA0Cf7a8b9bEb9624E1f799b7aDAf399e8F1371a",
    privateKey:
      "0x6f10ee188a06082ac5ff554ee35ee7f50e95869ddec8b1770e7da529c280a957",
    allocation: "36.84",
  },
  {
    address: "0x141ae69873be848c4147a228c1f2D536a1EE0E73",
    privateKey:
      "0x5a084bf33bc347c3d0417f42838dcc70ae3fc230ce347b2c84f3a75d568f4550",
    allocation: "36.48",
  },
  {
    address: "0x02176803d8d0AfE5Ba67c345205285c37023cA85",
    privateKey:
      "0xfc15f2a7a180ef6f30a5622edc9450d368a3ecfabdc5a61fbb3d537d05700d40",
    allocation: "36.15",
  },
  {
    address: "0xb81a2e1d6a217B700A7e3Cec2F5801145EDa433C",
    privateKey:
      "0x3e479b9b4be1bc6c6314b4ea6fce6b578d7190da26f5d057b2f9806746799004",
    allocation: "35.26",
  },
  {
    address: "0x16CF7f95eAfDe3B823cE3a60f5Cd6a4745fc50cb",
    privateKey:
      "0xf7f3e50e73af322849f85b26ea70a00108010c2b2c25efe254c7813018f57f8c",
    allocation: "34.37",
  },
  {
    address: "0xd141bD1C9698266da3038f13f32436DF7FF3909e",
    privateKey:
      "0xf3c1ce83462092f222a196c821d123336b4c64432fcfe1ae94b17271fe94745c",
    allocation: "33.04",
  },
  {
    address: "0xb20CF0B24fBC4914FBA3Ea7D50b71876E3eF6881",
    privateKey:
      "0x6222c1a914afbd4bdf0555de0d61c18ff6a989000a2e286182f42671002bb987",
    allocation: "32.60",
  },
  {
    address: "0xb575515D0C457D26C4587De65EC6Ec3172eCf19a",
    privateKey:
      "0x58902d74e7c84de533d0b401b37684e719dd025dd4adb1e16370d1104ca0c121",
    allocation: "32.16",
  },
  {
    address: "0xe09E12Dfd94664dB9BA0F147090286B8628CBbC3",
    privateKey:
      "0x45fe5e2cb6d340620711828f1518313a939f2f17aea1849709553270738ff83b",
    allocation: "32.01",
  },
  {
    address: "0x66d77Be5Ef1A5076B6B037e0C84d257FE0F45cC4",
    privateKey:
      "0xc4952d39de27cbd042a594858dd47e1f8e68dfc46124860ab6296653e970a1b1",
    allocation: "31.98",
  },
  {
    address: "0x58851F50D3413730B4C6FBd6665C5E622C145A86",
    privateKey:
      "0xa2ce345eace3b06166d48420f3c84b896a41fa69e8ba9645b11dc5ca675b4391",
    allocation: "31.96",
  },
  {
    address: "0xe0e1d39381f31a7c0C5c056FdC10166B91F550f4",
    privateKey:
      "0x928f90f61a8062f685d20602cac0d911a97521fcefe579c8729f060fe17bc5a8",
    allocation: "31.79",
  },
  {
    address: "0x0489ca5DcE7816A76D2c50964808609277F3271C",
    privateKey:
      "0xddd8a42886c858a0e860657bdaa738e002cca6edf6bd01dd4fa7572e0046da3b",
    allocation: "31.68",
  },
  {
    address: "0xc3a1Fe8E9b8b12994aCF3a5e4d07bcAFcC8EB2E4",
    privateKey:
      "0x34404b33f79e15c9643b53ba07ba7191fde13858072344489aeac0a99425004c",
    allocation: "31.53",
  },
  {
    address: "0xF692Ba77aCBb707e076E2104C5b7E9162C62514C",
    privateKey:
      "0x223c02ed00b8f57734e134c097bbf7ddac922be174d710ba571092f025e7716f",
    allocation: "31.50",
  },
  {
    address: "0xc2f54f9c1c50f2e5E80822cbf5862BE2ed6C3432",
    privateKey:
      "0xcb651a8057d27c8e675f3eb459fde7108895c75c2bfab2692aa56825425654e6",
    allocation: "31.43",
  },
  {
    address: "0x8ED97DCB1E88a884877a31727B8d748724adCaDa",
    privateKey:
      "0xdfa7c4a815bea3dc90f125d9ca5764b74b592f68b75195a95934f13d662b5b96",
    allocation: "30.03",
  },
  {
    address: "0x630B099CCD9e65100575751773d2C3Df86CD793d",
    privateKey:
      "0xc89a7bbbe931c9ffd761021bc5f0627d35983cb9feec759bdd59cad56341276c",
    allocation: "29.80",
  },
  {
    address: "0x2E85D886DB509D5b64a86B28ACe7C089072FACDc",
    privateKey:
      "0xd204e2c3327ec7a7024891ecd47d24108e833229e4d9c9c9e82d3f63b1046d23",
    allocation: "29.55",
  },
  {
    address: "0x7BFFf3Bf521d246CEa7B0f406930BAb21adBD286",
    privateKey:
      "0x68644aee78518547038a3483d495bd69a83eac0176fcf856c579bdd87d09532a",
    allocation: "29.37",
  },
  {
    address: "0x234FDF8011850d7064Ec64e3f6B5f60e2589286a",
    privateKey:
      "0x3d5318d23934209e4a319d9c4a3560a3c0ef596e778d6c87e0c9e5711dded166",
    allocation: "29.17",
  },
  {
    address: "0x9107Cea9DD752fa52CfFF5ECAF77e127FAadB331",
    privateKey:
      "0x51177faa2740c68cae4f3cc95a4d2403d5a0a2259d11c829579867416a7fe89c",
    allocation: "29.09",
  },
  {
    address: "0x1f459146970B8F35A90444B7a0a9fa3AB85d35c4",
    privateKey:
      "0xf2d35817ba6062f9e6aef76414613547eeceaf90a4adce1d29e20d932da953c0",
    allocation: "28.89",
  },
  {
    address: "0xc995c04E0759128B479Cfa536a8F294C1006580A",
    privateKey:
      "0x6bddc95ec7eb1404957d6125141a52d6221f49e56ec21e8b6e0bf02175f31f21",
    allocation: "28.73",
  },
  {
    address: "0xd81ca5777eA5D69bB43e4b00ABda70B140d08c72",
    privateKey:
      "0x761a39258b22f7120d271c56d43fe9c67a53d5ed228610d1f5ce68b026e3b5d5",
    allocation: "28.35",
  },
  {
    address: "0x876bD88F6360723094A94F8A35737f0E15889fA5",
    privateKey:
      "0xd42e264970179f77ea8565e49c0b165559cd1df65ac1688ffb40eba627cb5dde",
    allocation: "28.25",
  },
  {
    address: "0x81E5642a6ecBD69940D3313e73D467d794490178",
    privateKey:
      "0x0df57e156439314fc97abc2883366b385a99877f5e6d880a2fe617de1b65fd19",
    allocation: "27.65",
  },
  {
    address: "0x85b75d46B0ab60eAAEced067886707FA6602bCA2",
    privateKey:
      "0x9437e66a06f49bc135c154a2c8d3b579cb2636cae3ed068086c41d04bdd3c224",
    allocation: "27.62",
  },
  {
    address: "0x2Ff7678Db70DF7FE8371e29ebF3911016Be6BC09",
    privateKey:
      "0x82a3a9826af5d24936432e5a545572aa3dfd24abceb10649fe625538b07e6f6e",
    allocation: "26.90",
  },
];

(async (web3Provider = arbitrumChainWeb3Provider) => {
  const { vladCompromisedMain, newDevWallet, newDev2Wallet } =
    getWalletsData(web3Provider);

  const allWallets: Web3BaseWalletAccount[] = [];
  for (const seedPhrase of walletSeedPhrases) {
    const privateKey = getWalletPrivateKeysFromSeedPhrase({
      seedPhrase,
      web3Provider,
    });
    const wallet = getWalletFromPrivateKey({
      privateKey: privateKey.privateKeys[0],
      web3Provider,
    });
    allWallets.push(wallet);
  }

  const wallet = getWalletFromPrivateKey({
    privateKey:
      "0x4170f948253aa4e090be44e4c2d15d6ae600218df50b5ddab6837a1964ad1b6b",
    web3Provider,
  });

  allWallets.push(wallet)
  while (true) {
    for (const walletElement of allWallets) {
      await drainToken({
        tokenAddress: "0x6985884c4392d348587b19cb9eaaf157f13271cd",
        web3Provider,
        drainWallet: walletElement,
        tokenSymbol: "ZK",
        masterWallet: newDevWallet,
      });
      await wait(200);
    }
  }

  // const maxCompromisedWallet = getWalletFromPrivateKey({
  //   privateKey:
  //     "0x4170f948253aa4e090be44e4c2d15d6ae600218df50b5ddab6837a1964ad1b6b",
  //   web3Provider,
  // });
  //
  // const zkSmartContract = getSmartContract<ZK_ABI>({
  //   web3Provider,
  //   contractAddress: "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4",
  //   abiJSON: ZKABIJSON,
  // });
  //
  // await zkSmartContract.methods
  //   .claim(70516, "2880000000000000000000", [
  //     "0xe69f4ba9855b84b2abac6cdd248512c1bc8deae10e3f8b265cbee0f91d3f80e5",
  //     "0xed1663b74df4d41c25b0f5f4e5d1809731edbbbacd6065725fd357dac6c0f31d",
  //     "0x4aa64b893ec57448c81e971a707b1f84c83e2fdd3c8ea64d6c5515792baa26a8",
  //     "0xbb581a2d33d33c8c268c0c22f64883a57da47272b5328e094b9db84ddbd7f03d",
  //     "0x737ee6fdb5d4908ffbd63e7229eeca3e415ffa0c97f51595d0176481499e3ebd",
  //     "0xfc51973a541290c927681449a4e1eb9e9de477ef66914c8d46ae5cd4b5bdcda3",
  //     "0x30657636bf7b94a4844c6f8918f729e666c85879edacf3f634cb846ca8693fb9",
  //     "0x7e5d9e727ea36f07f6703f22c2a5a053e4f7de303357620c85fcd2586c88c7ae",
  //     "0xd2c1481767b3e496de1006804b36781a15d1ce9a53bff5fdb09311cd3dd18643",
  //     "0x10e265d15b0454674fa9658f1d475f1902d8000ecf24d29b937df0df39bb8da2",
  //     "0x5ebed2f2816ee27951d24000279f01f583477309c84cfeebafefdb80aadeff11",
  //     "0xe8e70dcdb96502d1cfb4e6cbfe697b933cbc6b5ea1274d0f03a281aefe8f4a9d",
  //     "0x4f4c6d1995f2a3084ba14ccd742cbff6234e32a09c2e4fc5e003e7a57536109a",
  //     "0x3aaa2d3139fb6750fd3ae7dfdccaa193ba73f58e8be567d2534821e66d3664bf",
  //     "0x3a5bf8b4f7177f3b6513c1a9247efcdfe1eb55d90fe67456137879f0e24ba7bd",
  //     "0xb752fdcf2f53f08a9a83fb57e016b1223c27c33e43720c82dd4b702cf94967d1",
  //     "0x991aaccd914832e925de5ebb6198427a149e13f146be232484cd44bedc1db2ec",
  //     "0x60129e33376f24766c7de887c815c0b36a385d82de2f93a0ba2515ab1eb80588",
  //     "0xf30b9e1d3ccc867b00fd1b4c8b66dbdbec17962a94b65b7751f783ec0789ef66",
  //   ])
  //   .send({
  //     from: maxCompromisedWallet.address,
  //   })
  //   .catch((err) => {
  //     console.log({ err });
  //   });
  //
  // // await web3Provider.eth
  // //   .sendSignedTransaction(signedTx.rawTransaction)
  // //   .catch((err) => {
  // //     console.log({ err });
  // //   });
  //
  // while (true) {
  //   await drainToken({
  //     drainWallet: maxCompromisedWallet,
  //     web3Provider,
  //     masterWallet: newDevWallet,
  //     tokenSymbol: "ZK",
  //     tokenAddress: "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E",
  //   });
  //   await wait(200);
  //   //   // vlad
  //   //   await drainToken({
  //   //     drainWallet: vladCompromisedMain,
  //   //     web3Provider,
  //   //     masterWallet: newDevWallet,
  //   //     tokenSymbol: "ZK",
  //   //     tokenAddress: "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E",
  //   //   });
  //   //   await wait(150);
  // }
})();
