import { headers } from "next/headers";
import { getWeatherData } from "./lib/utils";
import { PageData } from "./components/page-data";
import { useEffect, useState } from "react";

const { ethers } = require("ethers");
const URL = 'https://eth-sepolia.g.alchemy.com/v2/5N7C78UQIqqc4eN0cCBxO2wF_Z3ecJRq';

const abi = [
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkRequested",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_requestId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "fulfill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "RequestPrice",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "requestPriceData",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawLink",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "price",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const runtime = "edge";

export default function Page() {
  const date = new Date().toISOString();
  const [provider, setProvider] = useState()
  const [contract, setContract] = useState()
  const [temperature, setTemperature] = useState(0)

  useEffect(() => {
    setProvider(new ethers.providers.JsonRpcProvider(URL));
  }, [])

  useEffect(() => {
    if (provider !== undefined) {
      // Asegúrate de que estás usando la dirección correcta del contrato inteligente al llamar a la función `attach()`
      setContract(new ethers.Contract("0xf713d84bc1AC82d0a7B0CeB405Ce1C8F47dC9806", abi, provider));
    }
  }, [provider])

  useEffect(() => {
    if (contract !== undefined) {
      // Obtiene el último precio
      setTemperature(contract.price());
    }
  }, [contract])

  const parsedCity = headers().get("x-vercel-ip-city");
  const city =
    !parsedCity || parsedCity === "null" ? "San Francisco" : parsedCity;
  const data = {
    current: {
      temp_c: temperature
    },
    location: {
      name: 'Cusco'
    }
  }

  return <PageData data={data} />;
}
