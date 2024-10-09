'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image';
import {
  Box, Heading, VStack, HStack, Badge, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  InputGroup, InputLeftAddon, InputRightAddon, Tooltip, Icon, Text,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Flex, Spacer, useToast, Select, ButtonGroup, Spinner, Center, IconButton,
  Card, CardHeader, CardBody, CardFooter, Divider, CopyIcon, useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import { createPublicClient, http, createWalletClient, custom, parseAbi, formatEther, parseEther, zeroAddress, parseUnits, erc20Abi } from 'viem'
import { flare, mainnet, sepolia, blast, base, arbitrum, optimism } from 'viem/chains'
import ssFactoryJson from './contracts/ssFactory.json'
import ss from './contracts/ss.json'
import BigNumber from 'bignumber.js';
import { FaTwitter } from 'react-icons/fa';
import { GiThink } from "react-icons/gi";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'
import CopyableAddress from './CopyableAddress';

function formatAmount(amount) {
  amount = new BigNumber(amount);

  if (amount.toNumber() >= 1000000000) {
    return (amount.shiftedBy(-9)).toFixed(2) + 'B';
  } else if (amount.toNumber() >= 1000000) {
    return (amount.shiftedBy(-6)).toFixed(2) + 'M';
  } else {
    return amount.toString();
  }
}

const defaultDecimals = 18;
const defaultSymbol = 'stSol';

const demoInsurance4Sol = {
  contractAddress:"4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  lastWithdrawalTime:2037921563,
  monthlyContribution:new BigNumber("1000000000000000000"),
  daysUntilWithdrawal:3600,
  monthlyWithdrawal:new BigNumber("1000000000000000000"),
  emergencyAddress:"GijcCocu7xgrRKxCn81boMR88hZ2UyoLN5NZ4pXe6Y2J",
  beneficiary:"GijcCocu7xgrRKxCn81boMR88hZ2UyoLN5NZ4pXe6Y2J",
  initialTime:1726881563,
  isContractActive:true,
  depositedToken:"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
  policyHolder:"GijcCocu7xgrRKxCn81boMR88hZ2UyoLN5NZ4pXe6Y2J"}

const networkConfigs = {
  soldevnet: {
    chain: 'Solana',
    chainId: 'Devnet',
    name: 'Solana开发者网',
    tokens: [
      { value: 'mSOL', address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', symbol: 'mSOL', decimals: 18 },
      { value: 'stSOL', address: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', symbol: 'stSOL', decimals: 6 },
      { value: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', decimals: 6 },
      { value: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', symbol: 'RAY', decimals: 18 },
      { value: 'SRM', address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt', symbol: 'SRM', decimals: 6 },
      { value: 'MNGO', address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac', symbol: 'MNGO', decimals: 6 },
      { value: 'custom', address: '', symbol: 'Custom Token' }
    ]
  },
  mainnet: {
    chain: mainnet,
    chainId: '0x1',
    name: '以太坊主网',
    tokens: [
      { value: 'stETH', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', symbol: 'stETH', decimals: 18 },
      { value: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
      { value: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6 },
      { value: 'aETH', address: '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e', symbol: 'aETH', decimals: 18 },
      { value: 'aUSDT', address: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', symbol: 'aUSDT', decimals: 6 },
      { value: 'aUSDC', address: '0xBcca60bB61934080951369a648Fb03DF4F96263C', symbol: 'aUSDC', decimals: 6 },
      { value: 'custom', address: '', symbol: 'Custom Token' }
    ]
  },
  sepolia: {
    chain: sepolia,
    chainId: '0xaa36a7',
    name: 'Sepolia 测试网',
    tokens: [
      { value: 'aWETH', address: '0xE1a933729068B0B51452baC510Ce94dd9AB57A11', symbol: 'aWETH', decimals: 18 },
      { value: 'USDT', address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', symbol: 'USDT', decimals: 6 }, // Sepolia USDT
      { value: 'USDC', address: '0x8267cF9254734C6Eb452a7bb9AAF97B392258b21', symbol: 'USDC', decimals: 6 }, // Sepolia USDC
      { value: 'custom', address: '', symbol: 'Custom Token' }
    ]
  },
  blast: {
    chain: blast,
    chainId: '0x13e31',
    name: 'Blast',
    tokens: [
      { value: 'Blast', address: '0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad', symbol: 'Blast', decimals: 18 },
      { value: 'USDB', address: '0x4300000000000000000000000000000000000003', symbol: 'USDB', decimals: 18 },
      { value: 'custom', address: '', symbol: 'Custom Token' }
    ]
  },
  base: {
    chain: base,
    chainId: '0x2105',
    name: 'Base',
    tokens: [
      { value: 'WETH', address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', decimals: 18 },
      { value: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6 },
      { value: 'custom', address: '', symbol: 'Custom Token' }
    ]
  },
  arbitrum: {
    chain: arbitrum,
    chainId: '0xa4b1',
    name: 'Arbitrum',
    tokens: [
      { value: 'ARB', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', decimals: 18 },
      { value: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6 },
      { value: 'GMX', address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', symbol: 'GMX', decimals: 18 },
      { value: 'custom', address: '', symbol: 'Custom Token' }
    ]
  }
};

const soldevnet = 'soldevnet'


export default function Home() {
  //const router = useRouter()

  const oneDaySeconds = 24 * 3600; // 示例数据
  const oneYeadDays = 360;
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDepositDialog, setIsOpenDepositDialog] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('GijcCocu7xgrRKxCn81boMR88hZ2UyoLN5NZ4pXe6Y2J')
  const toast = useToast()
  const [formData, setFormData] = useState({
    initialDeposit: '',
    monthlyContribution: '',
    yearsUntilWithdrawal: '',
    monthlyWithdrawal: '',
    beneficiary: '',
    emergencyAddress: ''
  })

  // 模拟的社保列表数据
  const [insuranceList, setInsuranceList] = useState([])

  const [selectedNetwork, setSelectedNetwork] = useState('mainnet')
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedTokenDecimals, setSelectedTokenDecimals] = useState(18)
  const [customTokenSymbol, setCustomTokenSymbol] = useState('')
  const [customTokenAddress, setCustomTokenAddress] = useState('')
  const [userBalance, setUserBalance] = useState('0')
  const [userContracts, setUserContracts] = useState([])
  const [policyTokenInfo, setPolicyTokenInfo] = useState({[zeroAddress]: {}})
  const [curPolicyInfo, setCurPolicyInfo] = useState({})
  const [depositAmount, setDepositAmount] = useState(0)
  const [depositing, setDepositing] = useState(false)
  const [claimingFunds, setClaimingFunds] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [emergencyWithdrawing, setEmergencyWithdrawing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [policyNumber, setPolicyNumber] = useState(0)
  const [curBeneficiaryNum, setCurBeneficiaryNum] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('En');

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const { publicKey, connect, disconnect } = useWallet();

  const [publicClient, setPublicClient] = useState(selectedNetwork == soldevnet ? null : createPublicClient({
    chain: networkConfigs[selectedNetwork].chain,
    transport: http()
  }))

  const [walletClient, setWalletClient] = useState(null)

  const [daysUntilWithdrawal, setDaysUntilWithdrawal] = useState(0);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
    ],
    []
  );

  useEffect(() => {
    if (selectedNetwork == soldevnet) return;

    setPublicClient(createPublicClient({
      chain: networkConfigs[selectedNetwork].chain,
      transport: http()
    }))
  }, [selectedNetwork])

  useEffect(() => {
    if (isWalletConnected && selectedToken !== 'custom') {
      fetchTokenInfo()
    } else if (isWalletConnected && selectedToken === 'custom' && customTokenAddress) {
      fetchTokenInfo(customTokenAddress)
    }
  }, [isWalletConnected, selectedToken, customTokenAddress, walletAddress, selectedNetwork])

  const fetchTokenInfo = async (tokenAddr) => {
    if (!walletAddress) return
    if (selectedNetwork == soldevnet) {
      // todo
    } else {
      if (!tokenAddr) {
        const token = networkConfigs[selectedNetwork].tokens.find(t => t.value === selectedToken)
        if (!token) {
          return;
        }
        setSelectedTokenDecimals(token.decimals)
        tokenAddr = token.address
      }
  
      try {
        const values = await Promise.all([
          publicClient.readContract({
            address: tokenAddr,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [walletAddress],
          }),
          publicClient.readContract({
            address: tokenAddr,
            abi: erc20Abi,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: tokenAddr,
            abi: erc20Abi,
            functionName: 'symbol',
          }),
        ])
        let balance = values[0]
        let decimals = values[1] // default for ETH
        let symbol = values[2]
  
        const formattedBalance = formatEther(balance, 'wei')
        setUserBalance(parseFloat(formattedBalance).toFixed(4))
        setCustomTokenSymbol(symbol);   
        setSelectedTokenDecimals(Number(decimals));   
      } catch (error) {
        console.error('Error fetching balance:', error)
        toast({
          title: "Error fetching token info",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }   
  }

  const fetchUserContracts = async () => {
    if (!isWalletConnected || !walletAddress) return
    
    setIsLoading(true);
    try {
      const factoryAddress = ssFactoryJson.address[selectedNetwork]
      const factoryAbi = ssFactoryJson.abi

      const values = await Promise.all([
        publicClient.readContract({
          address: factoryAddress,
          abi: factoryAbi,
          functionName: 'getUserContracts',
          args: [walletAddress],
        }),
        publicClient.readContract({
          address: factoryAddress,
          abi: factoryAbi,
          functionName: 'policyCount',
        }),
      ])
      console.log('values', values)
      setUserContracts(values[0])
      setPolicyNumber(Number(values[1]))
    } catch (error) {
      console.error('Error fetching user contracts:', error)
      toast({
        title: "获取用户合约失败",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      if (selectedNetwork == soldevnet) {

      } else {
        fetchUserContracts()
      }
    }
  }, [isWalletConnected, walletAddress, selectedNetwork])


  const getPolicyCount = () => {
    const factoryAddress = ssFactoryJson.address[selectedNetwork]
    if (factoryAddress == '') return;
    
    const factoryAbi = ssFactoryJson.abi
    publicClient.readContract({
      address: factoryAddress,
      abi: factoryAbi,
      functionName: 'policyCount',
    }).then(result => {
      setPolicyNumber(Number(result))
    })
  }


  useEffect(() => {
    if (selectedNetwork == soldevnet) {

    } else {
      getPolicyCount();
    }
  }, [])

  useEffect(() => {
    if (publicClient) {
      getPolicyCount();
    }
  }, [publicClient])

  useEffect(() => {
    if (userContracts.length == 0) return;

    const contracts = []
    userContracts.forEach(contract => {
      contracts.push(...[{
        address: contract,
        abi: ss.abi,
        functionName: 'lastWithdrawalTime',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'monthlyContribution',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'daysUntilWithdrawal',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'monthlyWithdrawal',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'emergencyAddress',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'beneficiary',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'initialTime',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'isContractActive',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'depositedToken',
      }, {
        address: contract,
        abi: ss.abi,
        functionName: 'policyHolder',
      }])
    })
    publicClient.multicall({
      contracts,
      allowFailure: false,
    }).then(results => {
      console.log('results', results)
      const oneDataLength = results.length / userContracts.length;
      const parsedResults = [];
      for (let i = 0; i < results.length; i += oneDataLength) {
        const oneData = results.slice(i, i + oneDataLength);
        console.log('oneData 1', oneData)    
        parsedResults.push({
          contractAddress: userContracts[i / oneDataLength],
          lastWithdrawalTime: Number(oneData[0]),
          monthlyContribution: new BigNumber(oneData[1]),
          daysUntilWithdrawal: Number(oneData[2]),
          monthlyWithdrawal: new BigNumber(oneData[3]),
          emergencyAddress: oneData[4],
          beneficiary: oneData[5],
          initialTime: Number(oneData[6]),
          isContractActive: oneData[7],
          depositedToken: oneData[8],
          policyHolder: oneData[9],
        })    
      }
      console.log('parsedResults', JSON.stringify(parsedResults))
      setInsuranceList(parsedResults)
    })
  }, [userContracts])

  useEffect(() => {
    if (insuranceList.length == 0) return

    const contracts = []
    insuranceList.forEach(insurance => {
      contracts.push(...[{
        address: insurance.depositedToken,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [insurance.contractAddress],
      }, {
        address: insurance.depositedToken,
        abi: erc20Abi,
        functionName: 'symbol',
      }, {
        address: insurance.depositedToken,
        abi: erc20Abi,
        functionName: 'decimals',
      }])
    })

    publicClient.multicall({
      contracts,
      allowFailure: true,
    }).then(results => {
      console.log('results 1', results)
      const oneDataLength = results.length / insuranceList.length;
      
      for (let i = 0; i < results.length; i += oneDataLength) {
        const oneData = results.slice(i, i + oneDataLength); 
        const tokenInfo = {
          balance: oneData[0].status === 'success' ? new BigNumber(oneData[0].result).toString() : '0',
          symbol: oneData[1].status === 'success' ? oneData[1].result : '???',
          decimals: oneData[2].status === 'success' ? Number(oneData[2].result) : 18,
        }  
        policyTokenInfo[insuranceList[i / oneDataLength].contractAddress] = tokenInfo;
      }

      setPolicyTokenInfo(JSON.parse(JSON.stringify(policyTokenInfo)));
    })
  }, [insuranceList])

  useEffect(() => {
    const savedNetwork = localStorage.getItem('selectedNetwork')
    if (savedNetwork && networkConfigs[savedNetwork]) {
      setSelectedNetwork(savedNetwork)
    }

    const lng = localStorage.getItem("language");
    if (lng) {
      setLanguage(lng);
    }
  }, [])

  const handleNetworkChange = async (network) => {
    setSelectedNetwork(network)
    localStorage.setItem('selectedNetwork', network)
    if (isWalletConnected) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkConfigs[network].chainId }],
        });
        toast({
          title: "网络切换成功",
          description: `已切换到 ${networkConfigs[network].name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        console.error('Error switching network:', error)
        toast({
          title: "网络切换失败",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to connect your wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfigs[selectedNetwork].chainId }],
      });

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      const client = createWalletClient({
        chain: networkConfigs[selectedNetwork].chain,
        transport: custom(window.ethereum)
      })

      setWalletClient(client)
      setIsWalletConnected(true)
      setWalletAddress(address)

      toast({
        title: "连接成功",
        description: `您已成功连接到 ${networkConfigs[selectedNetwork].name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast({
        title: "Error connecting wallet",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false)
    setWalletAddress('')
    setWalletClient(null)
    setUserBalance('0')

    toast({
      title: "断开连接",
      description: "您已成功断开钱包连接",
      status: "info",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleTokenChange = (e) => {
    const value = e.target.value
    setSelectedToken(value)
    if (value !== '') {
      setCustomTokenAddress('')
    }
  }

  const getTokenSymbol = () => {
    if (selectedToken === 'custom') {
      return customTokenSymbol
    }
    return networkConfigs[selectedNetwork].tokens.find(option => option.value === selectedToken)?.symbol || ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'yearsUntilWithdrawal') {
      const days = parseInt(value * oneYeadDays);
      setDaysUntilWithdrawal(isNaN(days) ? 0 : days);
    }
  }

  const handleSubmit = async () => {
    if (!isWalletConnected) {
      toast({
        title: "钱包未连接",
        description: "请先连接钱包",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setCreating(true);
    try {
      const factoryAddress = ssFactoryJson.address[selectedNetwork]
      const factoryAbi = ssFactoryJson.abi
      let depositedTokenAddress = zeroAddress;
      console.log('depositedTokenAddress', selectedToken, customTokenAddress)
      if (selectedToken === 'custom') {
        depositedTokenAddress = customTokenAddress; 
      } else {
        depositedTokenAddress = networkConfigs[selectedNetwork].tokens.find(option => option.value === selectedToken)?.address;
      }      
      console.log('depositedTokenAddress', depositedTokenAddress)
      const hash = await walletClient.writeContract({
        account: walletAddress,
        address: factoryAddress,
        abi: factoryAbi,
        functionName: 'createSocialInsurance',
        args: [
          depositedTokenAddress,
          walletAddress,
          formData.beneficiary,
          parseUnits(formData.monthlyContribution, selectedTokenDecimals),
          BigInt(parseInt(formData.yearsUntilWithdrawal * oneYeadDays)),
          parseUnits(formData.monthlyWithdrawal, selectedTokenDecimals),
          formData.emergencyAddress
        ],
        value: depositedTokenAddress === zeroAddress ? parseEther(formData.initialDeposit) : 0, // 如果初始存款是 ETH，需要发送相应的值
      })

      toast({
        title: "交易已发送",
        description: `交易哈希: ${hash}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      })

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      setCreating(false);
      /// 检查receipt是否成功
      if (receipt.status === 'success') {
        toast({
          title: "社保计划创建成功",
          description: "您的社保计划已成功创建",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setIsOpen(false);
        await fetchUserContracts()
      } else {
        throw {message: "交易在链上未执行成功"};
      }
      // 这里可以添加逻辑来更新 UI 或获取新创建的社保计划信息
    } catch (error) {
      setCreating(false);
      console.error('Error creating social insurance plan:', error)
      toast({
        title: "创建社保计划失败",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDeposit = async (contractAddress, depositedToken, depositedTokenSymbol, depositedTokenDecimals) => {
    setCurPolicyInfo({ contractAddress, depositedToken, depositedTokenSymbol, depositedTokenDecimals });
    setIsOpenDepositDialog(true);
  };

  const handleDepositConfirm = async () => {
    setDepositing(true)
    try {      
      const hash = await walletClient.writeContract({
        account: walletAddress,
        address: curPolicyInfo.depositedToken,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          curPolicyInfo.contractAddress,
          parseUnits(depositAmount + '', curPolicyInfo.depositedTokenDecimals)
        ],
        value: 0, // 如果初始存款是 ETH，需要发送相应的值
      })

      toast({
        title: "交易已发送",
        description: `交易哈希: ${hash}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      })

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      setDepositing(false)
      /// 检查receipt是否成功
      if (receipt.status === 'success') {
        toast({
          title: "保单充值",
          description: "保单充值成功",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setIsOpenDepositDialog(false);
        await fetchUserContracts()
      } else {
        throw {message: "交易在链上未执行成功"};
      }

      // 这里可以添加逻辑来更新 UI 或获取新创建的社保计划信息
    } catch (error) {
      setDepositing(false)
      console.error('Error deposit token to contract:', error)
      toast({
        title: "保单充值失败",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }
  
  const handleClaimFunds = async (contractAddress) => {
    setClaimingFunds(true)
    try {      
      const hash = await walletClient.writeContract({
        account: walletAddress,
        address: contractAddress,
        abi: ss.abi,
        functionName: 'claim',
      })

      toast({
        title: "交易已发送",
        description: `交易哈希: ${hash}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      })

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      setClaimingFunds(false)
      /// 检查receipt是否成功
      if (receipt.status === 'success') {
        toast({
          title: "领取社保成功",
          description: "领取社保成功",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        await fetchUserContracts()
      } else {
        throw {message: "交易在链上未执行成功"};
      }

      // 这里可以添加逻辑来更新 UI 或获取新创建的社保计划信息
    } catch (error) {
      setClaimingFunds(false)
      console.error('Error deposit token to contract:', error)
      toast({
        title: "领取社保失败",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  };
  
  const handleWithdrawBalance = async (contractAddress) => {
    setWithdrawing(true)
    try {      
      const hash = await walletClient.writeContract({
        account: walletAddress,
        address: contractAddress,
        abi: ss.abi,
        functionName: 'withdrawUnpaidFunds',
      })

      toast({
        title: "交易已发送",
        description: `交易哈希: ${hash}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      })

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      setWithdrawing(false)
      /// 检查receipt是否成功
      if (receipt.status === 'success') {
        toast({
          title: "提取余额成功",
          description: "提取余额成功",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        await fetchUserContracts()
      } else {
        throw {message: "交易在链上未执行成功"};
      }

      // 这里可以添加逻辑来更新 UI 或获取新创建的社保计划信息
    } catch (error) {
      setWithdrawing(false)
      console.error('Error withdraw balance:', error)
      toast({
        title: "提取余额失败",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  };
  
  const handleCloseAccount = async (contractAddress) => {
    setEmergencyWithdrawing(true)
    try {      
      const hash = await walletClient.writeContract({
        account: walletAddress,
        address: contractAddress,
        abi: ss.abi,
        functionName: 'emergencyWithdraw',
      })

      toast({
        title: "交易已发送",
        description: `交易哈希: ${hash}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      })

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      setEmergencyWithdrawing(false)
      /// 检查receipt是否成功
      if (receipt.status === 'success') {
        toast({
          title: "销户&提现成功",
          description: "销户&提现成功",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        await fetchUserContracts()
      } else {
        throw {message: "交易在链上未执行成功"};
      }

      // 这里可以添加逻辑来更新 UI 或获取新创建的社保计划信息
    } catch (error) {
      setEmergencyWithdrawing(false)
      console.error('Error deposit token to contract:', error)
      toast({
        title: "销户&提现失败",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  };

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const changeLanguage = (lng) => {
    setLanguage(lng)
    localStorage.setItem('language', lng);
  }

  const _t = (chStr, enStr) => {
    return language == 'zh' ? chStr : enStr;
  }



  const connectWallet = async () => {
    if (!publicKey) {
      try {
        await connect();
        toast({
          title: "Wallet connected",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast({
          title: "Failed to connect wallet",
          description: error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      await disconnect();
      toast({
        title: "Wallet disconnected",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // const CopyableAddress = ({ address }) => {
  //   return (
  //     <Tooltip label={_t("复制地址", "Copy Address")}>
  //       <HStack spacing={1} cursor="pointer" onClick={() => navigator.clipboard.writeText(address)}>
  //         <Text fontSize="sm">{shortenAddress(address)}</Text>
  //         <CopyIcon boxSize={3} />
  //       </HStack>
  //     </Tooltip>
  //   );
  // };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Box as="main" py={20}>
            <Flex px={6} py={4} position="fixed" top={0} left={0} right={0} bg="white" boxShadow="sm" zIndex={10}>
              <Select value={selectedNetwork} onChange={(e) => handleNetworkChange(e.target.value)} width="200px">
                <option value="mainnet">{_t("以太坊主网", "Ethereum Mainnet")}</option>
                <option value="arbitrum">{_t("Arbitrum主网", "Arbitrum Mainnet")}</option>
                {/* <option value="optimism">{_t("Optimism主网", "Optimism Mainnet")}</option> */}
                <option value="base">{_t("Base主网", "Base Mainnet")}</option>
                <option value="blast">{_t("Blast主网", "Blast Mainnet")}</option>
                <option value={soldevnet}>{_t("Solana开发者网络", "Solana Devnet")}</option>
                <option value="sepolia">{_t("Sepolia 测试网", "Sepolia Testnet")}</option>
              </Select>
              <Spacer />
              <Link href="/introduce" passHref>
                <Tooltip label={_t("了解我们为什么要做这个项目", "Learn why we're doing this project")}>
                  <IconButton
                    as="a"
                    icon={
                      <GiThink />
                    }
                    aria-label="Go to Introduction"
                    mr={2}
                    variant="outline"
                    colorScheme="blue"
                  />
                </Tooltip>
              </Link>
              <Button onClick={() => changeLanguage('en')} mr={2}>EN</Button>
              <Button onClick={() => changeLanguage('zh')} mr={2}>中文</Button>
              <IconButton
                as="a"
                href="https://x.com/socialins001" // 替换为你的推特链接
                target="_blank" // 在新标签页中打开
                aria-label="Twitter"
                icon={<FaTwitter />}
                colorScheme="blue"
                variant="outline"
                mr={2}
              />
              {
                selectedNetwork == soldevnet ?
                  <WalletMultiButton />
                  :
                  isWalletConnected ? (
                    <Tooltip label={walletAddress} placement="bottom" hasArrow>
                      <Button 
                        onClick={handleWalletDisconnect}
                        variant="outline"
                        colorScheme="blue"
                      >
                        {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button colorScheme="blue" onClick={handleWalletConnect}>
                      {publicKey ? _t("断开钱包", "Disconnect") : _t("连接钱包", "Connect Wallet")}
                    </Button>
                  )
              }
              
            </Flex>

            <VStack spacing={10} mt={16}>
              <Heading as="h1" size="4xl" fontWeight="bold" color="blue.600">
                {_t("链上社保", "Social Insurance")}
              </Heading>
              <Text
                fontSize={["md", "lg", "xl"]}
                fontWeight="medium"
                fontStyle="italic"
                color="blue.500"
                letterSpacing="wide"
                textAlign="center"
                mt={-2}
                px={4}
              >
                {_t("迈向网络国家的第一步", "The first step towards a network state")}
              </Text>
              <HStack spacing={6} flexWrap="wrap" justifyContent="center">
                <Badge fontSize="lg" p={3} borderRadius="md" colorScheme="blue">{_t("去中心化社保系统", "Decentralized")}</Badge>
                <Badge fontSize="lg" p={3} borderRadius="md" colorScheme="green">{_t("合约无Owner", "Without Owner")}</Badge>
                <Badge fontSize="lg" p={3} borderRadius="md" colorScheme="blue">{_t("风险隔离(一保单一合约)", "Risk Isolation")}</Badge>
                <Badge fontSize="lg" p={3} borderRadius="md" colorScheme="orange">{_t("按需定制", "Customizable")}</Badge>
                <Badge fontSize="lg" p={3} borderRadius="md" colorScheme="purple">{_t("投保资产无限制", "Support ERC20")}</Badge>
              </HStack>
              
              <Box w="full" maxW="4xl" mt={10}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                  <Stat bg="blue.100" p={5} borderRadius="lg" boxShadow="md">
                    <StatLabel fontSize="xl" fontWeight="semibold" color="blue.800">{_t("总保单数", "Total Policies")}</StatLabel>
                    <StatNumber fontSize="4xl" fontWeight="bold" color="blue.600">{policyNumber}</StatNumber>
                    <StatHelpText fontSize="md" color="blue.800">
                    {_t("较上月增长", "Increase from last month")} <Box as="span" color="green.600" fontWeight="bold">0</Box>
                    </StatHelpText>
                  </Stat>
                  <Stat bg="green.100" p={5} borderRadius="lg" boxShadow="md">
                    <StatLabel fontSize="xl" fontWeight="semibold" color="green.800">{_t("累计投入金额", "Total Invested Amount")}</StatLabel>
                    <HStack justifyContent="left" alignItems="center">
                      <StatNumber fontSize="4xl" fontWeight="bold" color="green.600">{_t("统计中...", "Calculating...")}</StatNumber>
                    </HStack>
                    <StatHelpText fontSize="md" color="green.800">
                    {_t("较上月增长", "Increase from last month")} <Box as="span" color="green.600" fontWeight="bold">0%</Box>
                    </StatHelpText>
                  </Stat>
                  <Stat bg="purple.100" p={5} borderRadius="lg" boxShadow="md">
                    <StatLabel fontSize="xl" fontWeight="semibold" color="purple.800">{_t("当前领取社保人数", "Current Beneficiaries")}</StatLabel>
                    <StatNumber fontSize="4xl" fontWeight="bold" color="purple.600">{curBeneficiaryNum}</StatNumber>
                    <StatHelpText fontSize="md" color="purple.800">
                    {_t("本月新增", "New this month")} <Box as="span" color="green.600" fontWeight="bold">0</Box>
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </Box>

              <Box w="full" maxW="6xl" mt={10}>
                <Heading as="h2" size="xl" mb={6}>{_t("我的社保", "My Social Insurance")}</Heading>
                {
                  isLoading ? (
                    <Center>
                      <Spinner size="xl" />
                    </Center>
                  ) : userContracts.length >= 0 ? (
                    <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={8}>
                      {[demoInsurance4Sol, ...insuranceList].map((insurance, index) => {
                        const decimals = policyTokenInfo[insurance.contractAddress]?.decimals || defaultDecimals;
                        const symbol = policyTokenInfo[insurance.contractAddress]?.symbol || defaultSymbol;
                        const balance = policyTokenInfo[insurance.contractAddress]?.balance || 0;
                        const balanceShouldbePaid = insurance.monthlyWithdrawal.multipliedBy(parseInt((new Date().getTime() / 1000 - insurance.initialTime) / (30 * oneDaySeconds) + ''));
                        let paidBalance = balanceShouldbePaid;
                        let toBePaidBalance = new BigNumber(0);
                        let withdrawableBalance = new BigNumber(0);
                        let startWithdrawTime = insurance.initialTime + insurance.daysUntilWithdrawal * oneDaySeconds;
                        
                        const curTime = Math.floor(new Date().getTime() / 1000);
                        let curAvailableFunds = curTime > startWithdrawTime ? (Math.floor((curTime - startWithdrawTime) / oneDaySeconds) - Math.floor((insurance.lastWithdrawalTime - startWithdrawTime) / oneDaySeconds)) * insurance.monthlyWithdrawal : 0;
                        if (new BigNumber(balance).lt(curAvailableFunds)) {
                          curAvailableFunds = balance;
                        }
                        if (new BigNumber(balance).lt(balanceShouldbePaid)) {
                          paidBalance = new BigNumber(balance);
                          toBePaidBalance = new BigNumber(balanceShouldbePaid).minus(balance);
                        } else {
                          withdrawableBalance = new BigNumber(balance).minus(balanceShouldbePaid);
                        }

                        const bgColor = useColorModeValue('white', 'gray.800')
                        const borderColor = useColorModeValue('gray.200', 'gray.600')
                        const headingColor = useColorModeValue('blue.600', 'blue.300')

                        return (
                          <Card 
                            key={index}
                            bg={bgColor}
                            borderColor={borderColor}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="lg"
                            transition="all 0.3s"
                            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
                          >
                            <CardHeader bg={useColorModeValue('blue.50', 'blue.900')} py={4}>
                              <HStack justify="space-between" width="100%">
                                <Heading size="md" color={headingColor}>{_t("保单", "Policy")} #{index + 1}</Heading>
                                <Badge colorScheme={insurance.isContractActive ? "green" : "red"} fontSize="0.8em" py={1} px={2}>
                                  {insurance.isContractActive ? _t("活跃", "Active") : _t("已关闭", "Closed")}
                                </Badge>
                              </HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={4}>
                                <SimpleGrid columns={2} spacing={4} width="100%">
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("合约地址", "Contract Address")}</StatLabel>
                                    <StatNumber fontSize="md"><CopyableAddress address={insurance.contractAddress} /></StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("投保时间", "Insurance Time")}</StatLabel>
                                    <StatNumber fontSize="md">{new Date(insurance.initialTime * 1000).toLocaleDateString()}</StatNumber>
                                  </Stat>
                                </SimpleGrid>
                                <Divider />
                                <SimpleGrid columns={2} spacing={4} width="100%">
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("投保Token", "Insured Token")}</StatLabel>
                                    <StatNumber fontSize="md">{symbol}</StatNumber>
                                    <StatHelpText>
                                      <CopyableAddress address={insurance.depositedToken} />
                                    </StatHelpText>
                                  </Stat>
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("每月缴纳", "Monthly Contribution")}</StatLabel>
                                    <StatNumber fontSize="md">{formatAmount(new BigNumber(insurance.monthlyContribution).shiftedBy(-1 * decimals))} {symbol}</StatNumber>
                                  </Stat>
                                </SimpleGrid>
                                <SimpleGrid columns={2} spacing={4} width="100%">
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("已缴纳", "Paid")}</StatLabel>
                                    <StatNumber fontSize="md">{formatAmount(paidBalance.shiftedBy(-1 * decimals))} {symbol}</StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("待补充", "To Be Paid")}</StatLabel>
                                    <StatNumber fontSize="md">{formatAmount(toBePaidBalance.shiftedBy(-1 * decimals))} {symbol}</StatNumber>
                                  </Stat>
                                </SimpleGrid>
                                <SimpleGrid columns={2} spacing={4} width="100%">
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("每月领取", "Monthly Withdrawal")}</StatLabel>
                                    <StatNumber fontSize="md">{formatAmount(new BigNumber(insurance.monthlyWithdrawal).shiftedBy(-1 * decimals))} {symbol}</StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("当前可领取", "Currently Available")}</StatLabel>
                                    <StatNumber fontSize="md">{formatAmount(new BigNumber(curAvailableFunds).shiftedBy(-1 * decimals))} {symbol}</StatNumber>
                                  </Stat>
                                </SimpleGrid>
                                <SimpleGrid columns={2} spacing={4} width="100%">
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("保单余额", "Policy Balance")}</StatLabel>
                                    <StatNumber fontSize="md">{formatAmount(withdrawableBalance.shiftedBy(-1 * decimals))} {symbol}</StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("开始领取日", "Start Withdrawal Date")}</StatLabel>
                                    <StatNumber fontSize="md">{new Date(startWithdrawTime * 1000).toLocaleDateString()}</StatNumber>
                                  </Stat>
                                </SimpleGrid>
                                <Divider />
                                <SimpleGrid columns={2} spacing={4} width="100%">
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("投保人", "Policy Holder")}</StatLabel>
                                    <StatNumber fontSize="md"><CopyableAddress address={insurance.policyHolder} /></StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel fontSize="sm" fontWeight="medium">{_t("受益人", "Beneficiary")}</StatLabel>
                                    <StatNumber fontSize="md"><CopyableAddress address={insurance.beneficiary} /></StatNumber>
                                  </Stat>
                                </SimpleGrid>
                                <Stat>
                                  <StatLabel fontSize="sm" fontWeight="medium">{_t("紧急联系人", "Emergency Contact")}</StatLabel>
                                  <StatNumber fontSize="md"><CopyableAddress address={insurance.emergencyAddress} /></StatNumber>
                                </Stat>
                              </VStack>
                            </CardBody>
                            <CardFooter bg={useColorModeValue('gray.50', 'gray.900')} borderTop="1px" borderColor={borderColor}>
                              <VStack spacing={2} width="100%">
                                {insurance.isContractActive && (
                                  <>
                                    {walletAddress.toUpperCase() === insurance.beneficiary.toUpperCase() && (
                                      <Button colorScheme="green" onClick={() => handleClaimFunds(insurance.contractAddress)} isLoading={claimingFunds} loadingText={_t("领取中", "Claiming")} width="100%">
                                        {_t("领取社保", "Claim Insurance")}
                                      </Button>
                                    )}
                                    {walletAddress.toUpperCase() === insurance.policyHolder.toUpperCase() && (
                                      <>
                                        <Button colorScheme="blue" onClick={() => handleDeposit(insurance.contractAddress, insurance.depositedToken, symbol, decimals)} width="100%">
                                          {_t("充值", "Deposit")}
                                        </Button>
                                        <Button colorScheme="yellow" onClick={() => handleWithdrawBalance(insurance.contractAddress)} isLoading={withdrawing} loadingText={_t("提取中", "Withdrawing")} width="100%">
                                          {_t("提取余额", "Withdraw Balance")}
                                        </Button>
                                      </>
                                    )}
                                    {(walletAddress.toUpperCase() === insurance.policyHolder.toUpperCase() || walletAddress.toUpperCase() === insurance.emergencyAddress.toUpperCase()) && (
                                      <Button colorScheme="red" onClick={() => handleCloseAccount(insurance.contractAddress)} isLoading={emergencyWithdrawing} loadingText={_t("销户&提现中", "Closing & Withdrawing")} width="100%">
                                        {_t("销户&提现", "Close Account & Withdraw")}
                                      </Button>
                                    )}
                                  </>
                                )}
                              </VStack>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Text>{_t("您还没有社保记录。", "You don't have any social insurance records yet.")}</Text>
                  )
                }         
              </Box>

              <Button colorScheme="blue" size="lg" onClick={() => setIsOpen(true)}>
              {_t("创建我的社保", "Create My Social Insurance")}
              </Button>

              <Modal isOpen={isOpenDepositDialog} onClose={() => setIsOpenDepositDialog(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{_t("给保单充值", "Deposit to Policy")}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl>
                      <FormLabel>{_t("充值金额", "Deposit Amount")}({curPolicyInfo.depositedTokenSymbol})</FormLabel>
                      <NumberInput min={0} onChange={(_, value) => setDepositAmount(value)}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleDepositConfirm} isLoading={depositing} loadingText={_t("充值中", "Depositing")}>
                    {_t("充值", "Deposit")}
                    </Button>
                    <Button variant="ghost" onClick={() => setIsOpenDepositDialog(false)}>{_t("取消", "Cancel")}</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent borderRadius="xl" boxShadow="xl">
                  <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">{_t("创建我的社保", "Create My Social Insurance")}</ModalHeader>
                  <ModalCloseButton color="white" />
                  <ModalBody py={6}>
                    <VStack spacing={6}>
                      <FormControl>
                        <FormLabel fontWeight="bold">{_t("选择社保代币", "Select Insurance Token")}</FormLabel>
                        <Select value={selectedToken} onChange={handleTokenChange}>
                          {networkConfigs[selectedNetwork].tokens.map(option => (
                            <option key={option.address} value={option.value}>{`${option.symbol} ${option.address ? ' - ' : ''} ${option.address}`}</option>
                          ))}
                        </Select>
                      </FormControl>
                      {selectedToken === 'custom' && (
                        <FormControl>
                          <FormLabel fontWeight="bold">{_t("自定义代币地址", "Custom Token Address")}</FormLabel>
                          <Input 
                            value={customTokenAddress} 
                            onChange={(e) => setCustomTokenAddress(e.target.value)}
                            placeholder={_t("输入代币合约地址", "Enter token contract address")}
                          />
                        </FormControl>
                      )}
                      {(selectedToken !== 'custom' || (selectedToken === 'custom' && customTokenAddress)) && (
                        <Text>{_t("您的余额: ", "Your Balance: ")}{userBalance} {getTokenSymbol()}</Text>
                      )}                
                      <FormControl>
                        <FormLabel fontWeight="bold">{_t("每月缴纳金额", "Monthly Contribution Amount")}</FormLabel>
                        <InputGroup>
                          <InputLeftAddon children={getTokenSymbol()} />
                          <NumberInput min={0} w="full" precision={3}>
                            <NumberInputField name="monthlyContribution" value={formData.monthlyContribution} onChange={handleInputChange} borderLeftRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="bold">
                        {_t("领取年限", "Years Until Withdrawal")}
                          <Tooltip label={_t("设置多久后可以开始领取社保，支持小数，实际按天数计算", "Set how long until you can start withdrawing insurance, supports decimals, calculated in days")} placement="top">
                            <Icon as={InfoIcon} ml={1} color="blue.500" />
                          </Tooltip>
                        </FormLabel>
                        <InputGroup>
                          <NumberInput min={0} w="full" precision={3}>
                            <NumberInputField name="yearsUntilWithdrawal" value={formData.yearsUntilWithdrawal} onChange={handleInputChange} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon children={_t("年", "years")} />
                        </InputGroup>
                        <Text fontSize="sm" color="gray.600" mt={1}>
                        {_t("共计", "Total")} {daysUntilWithdrawal} {_t("天", "days")}
                        </Text>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="bold">{_t("每月领取金额", "Monthly Claim Amount")}</FormLabel>
                        <InputGroup>
                          <InputLeftAddon children={getTokenSymbol()} />
                          <NumberInput min={0} w="full" precision={3}>
                            <NumberInputField name="monthlyWithdrawal" value={formData.monthlyWithdrawal} onChange={handleInputChange} borderLeftRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="bold">
                        {_t("受益人地址", "Beneficiary Address")}
                          <Tooltip label={_t("在达到领取年限后，仅受益人可提取社保", "Only the beneficiary can withdraw insurance after reaching the withdrawal period")} placement="top">
                            <Icon as={InfoIcon} ml={1} color="blue.500" />
                          </Tooltip>
                        </FormLabel>
                        <Input name="beneficiary" value={formData.beneficiary} onChange={handleInputChange} placeholder="0x..." />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="bold">
                        {_t("紧急提取地址", "Emergency Withdrawal Address")}
                          <Tooltip label={_t("在发生特殊情况时，此地址可发起提取所有账户余额的操作，余额全部转给受益人", "This address can initiate the operation to withdraw all account balances, transferring all balances to the beneficiary.")} placement="top">
                            <Icon as={InfoIcon} ml={1} color="blue.500" />
                          </Tooltip>
                        </FormLabel>
                        <Input name="emergencyAddress" value={formData.emergencyAddress} onChange={handleInputChange} placeholder="0x..." />
                      </FormControl>
                    </VStack>
                  </ModalBody>
                  <ModalFooter bg="gray.50" borderBottomRadius="xl" flexDirection="column" alignItems="stretch">
                    {
                      language == 'zh' ?
                        <Box mb={4} textAlign="left">
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            说明：
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            投保人可在任何时候销毁账户，此时保单内剩余资产都会转给受益人
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            投保人可在任何时候提取保单内尚未投保的资金，此部分资金将转给投保人
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            本平台不收取任何费用，每张保单一个合约，并且无owner权限，完全去中心化
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            创建保单过程无需支付或转移任何Token，仅需支付上链的Gas费
                          </Text>
                        </Box>
                        :
                        <Box mb={4} textAlign="left">
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            Notes:
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            The policyholder can destroy the account at any time, and all remaining assets in the policy will be transferred to the beneficiary
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            The policyholder can withdraw funds not yet insured from the policy at any time, these funds will be transferred to the policyholder
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            This platform does not charge any fees, each policy has its own contract, and there is no owner authority, completely decentralized
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            <Icon as={InfoIcon} mr={1} color="blue.500" />
                            Creating a policy does not require payment or transfer of any tokens, only gas fees for on-chain transactions are needed
                          </Text>
                        </Box>
                    }
                    
                    <HStack justifyContent="center">
                      <Button 
                        isDisabled={selectedNetwork == soldevnet || !isWalletConnected} 
                        colorScheme="blue" 
                        mr={3} 
                        onClick={handleSubmit} 
                        size="lg" 
                        isLoading={creating} 
                        loadingText={_t("创建中", "Creating")}
                      >
                        {_t("创建保单", "Create Policy")}
                      </Button>
                      <Button variant="outline" onClick={() => setIsOpen(false)} size="lg">{_t("取消", "Cancel")}</Button>
                    </HStack>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </VStack>
          </Box>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
