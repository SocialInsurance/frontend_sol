'use client'

import Link from 'next/link'
import { Box, Container, Heading, Text, VStack, Card, CardHeader, CardBody, Center, SimpleGrid, Button } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'

const projectInfo = [
    { 
        title: "什么是链上社保❓", 
        titleEn: "What is On-Chain Social Insurance❓",
        content: ["👉 可以为自己或他人在链上缴纳社保", "👉 支持所有标准化的Token进行投保", "👉 投保年限、金额和领取方式可定制"],
        contentEn: ["👉 Pay social insurance on-chain for yourself or others", "👉 Support all standardized tokens for insurance", "👉 Customizable insurance period, amount, and payout method"]
    },
    { 
        title: "适用人群", 
        titleEn: "Applicable People",
        content: ["👉 想为自己交社保的Crypto原住民", "👉 想用加密货币为亲人交社保的Crypto信仰者", "👉 需要为雇员交社保的Crypto企业"],
        contentEn: ["👉 Crypto natives who want to pay social insurance for themselves", "👉 Crypto believers who want to pay social insurance for their relatives using cryptocurrencies", "👉 Crypto companies that need to pay social insurance for their employees"]
    },
    { 
        title: "为什么要做这个产品❓",   
        titleEn: "Why We're Building This Product",
        content: ["👉 不仅是为了Crypto个体未来的生活保障", "👉 还有一个网络国家的梦想要实现"],
        contentEn: ["👉 Not only for the future life security of Crypto individuals", "👉 Also to realize the dream of a network state"]
    },
    { 
        title: "为什么网络国家需要这个产品❓",   
        titleEn: "Why Network States Need This Product",
        content: ["我们将从以下几个方面进行阐述", "👉 现代国家的本质", "👉 区块链 vs 现代国家", "👉 区块链 vs 网络国家"],
        contentEn: ["We will explain from the following aspects", "👉 The essence of modern states", "👉 Blockchain vs modern states", "👉 Blockchain vs network states"]
    },
    { 
        title: "现代国家的本质", 
        titleEn: "The Essence of Modern State",
        content: ["👉 一种社会契约，即公民与政府之间达成的协议", "", "👉维护契约：法律体系，执法机构，公共服务，税收制度，民主机制，社会保障，国际关系"],
        contentEn: ["👉 A social contract, an agreement between citizens and the government", "", "👉 Maintaining the contract: Legal system, law enforcement agencies, public services, tax system, democratic mechanisms, social security, international relations"]
    },
    { 
        title: "区块链 vs 现代国家", 
        titleEn: "Blockchain vs Modern State",
        content: ["👉 区块链已具有的国家属性：法律体系（链、智能合约），执法机构（验证节点、出块节点），公共服务（基础设施），税收制度（产出的平台币、Gas费），民主机制（PoW、PoS、PoH）",
                "👉 区块链尚未具有的国家属性：社会保障（养老、医疗），国际关系",
                "👉 法学家亨利·梅因：迄今为止，进步社会的演变一直是从身份到契约的转变。",
                "👉 区块链相比现代国家具备更高的契约水平和能力，代表了人类社会的进化方向"],
        contentEn: ["👉 State attributes already possessed by blockchain: Legal system (chain, smart contracts), law enforcement (validator nodes, block producer nodes), public services (infrastructure), tax system (platform tokens, Gas fees), democratic mechanisms (PoW, PoS, PoH)",
                    "👉 State attributes not yet possessed by blockchain: Social security (pension, healthcare), international relations",
                    "👉 Legal scholar Henry Maine: The movement of progressive societies has hitherto been a movement from status to contract.",
                    "👉 Blockchain has a higher contractualization capability compared to traditional states, representing the evolutionary direction of human society"]
    },
    { 
        title: "区块链 vs 网络国家", 
        titleEn: "Blockchain vs Network State",
        content: ["👉 区块链具备国家的大多数特征，其国家意识形态正逐步成型",
                "👉 网络国家将建立在区块链之上，区块链为其提供契约保障",
                "👉 网络国家将成为区块链的Mass Adoption，越来越多生活于数字空间的人会愿意成为其公民",
                "👉 网络国家需要补上两块重要拼图：社会保障系统，国际关系"],
        contentEn: ["👉 Blockchain possesses most characteristics of a state, and its state ideology is gradually taking shape",
                    "👉 Network states will be built on blockchain, with blockchain providing contractual guarantees",
                    "👉 Network states will become the Mass Adoption of blockchain, with more people living in digital spaces willing to become its citizens",
                    "👉 Network states need to complete two important puzzle pieces: social security system and international relations"]
    },
    { 
        title: "为什么社会保障体系如此重要？", 
        titleEn: "Why is the Social Security System So Important?",
        content: ["👉 区块链生态呈现出了两种极端状态，高度契约化和社会达尔文主义并存",
                "👉 Crypto用户难以在一块冰冷的大陆上找到精神家园",
                "👉 社会保障体系是建立精神家园的前置条件，也是网络国家成为Mass Adoption的必要条件"],
        contentEn: ["👉 The blockchain ecosystem presents two extreme states: high contractualization and social Darwinism coexist",
                    "👉 Crypto users find it difficult to find a spiritual home on a cold continent",
                    "👉 The social security system is a prerequisite for building a spiritual home and a necessary condition for network states to become Mass Adoption"]
    },
    { 
        title: "Roadmap", 
        titleEn: "Roadmap",
        content: ["👉 第一步：开发并优化养老存钱罐功能✅",
                "👉 第二步：设计合理的互助基金",
                "👉 第三步：拓展出更多的社会保障类产品"],
        contentEn: ["👉 Step 1: Develop and optimize the pension savings function",
                    "👉 Step 2: Design a reasonable mutual aid fund",
                    "👉 Step 3: Expand to more social security products"]
    },
]

export default function Home() {
  return (
    <Box as="main" bg="gray.50" minHeight="100vh" py={10} position="relative">
      <Link href="/" passHref>
        <Button
          as="a"
          leftIcon={<ChevronLeftIcon />}
          position="absolute"
          top="4"
          left="4"
          colorScheme="blue"
          variant="outline"
        >
          返回主页
        </Button>
      </Link>
      <Container maxW="container.xl">
        <VStack spacing={10} align="center">
          <Center>
            <VStack spacing={2}>
                <Text 
                as="a"
                fontSize="6xl" 
                fontWeight="bold" 
                textAlign="center"
                bgGradient="linear(to-r, blue.400, blue.500, purple.500)"
                bgClip="text"
                letterSpacing="tight"
                >
                《链上社保》
                </Text>
                <Text
                as="a"
                fontSize="3xl"
                fontWeight="semibold"
                textAlign="center"
                color="gray.600"
                >
                Social Insurance On-Chain
                </Text>
            </VStack>
          </Center>
          
          <SimpleGrid columns={2} spacing={6} width="100%" maxWidth="1200px">
            {projectInfo.map((info, index) => (
              <>
                <Card 
                  key={`${index}-zh`}
                  width="100%" 
                  bg={index % 2 === 0 ? "blue.50" : "purple.50"}
                  borderColor={index % 2 === 0 ? "blue.200" : "purple.200"}
                  borderWidth="1px"
                >
                  <CardHeader>
                    <Center>
                      <Heading size="md" color={index % 2 === 0 ? "blue.600" : "purple.600"}>
                        {info.title}
                      </Heading>
                    </Center>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      {info.content.map((line, lineIndex) => (
                        <Text key={lineIndex}>{line}</Text>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
                <Card 
                  key={`${index}-en`}
                  width="100%" 
                  bg={index % 2 === 0 ? "blue.50" : "purple.50"}
                  borderColor={index % 2 === 0 ? "blue.200" : "purple.200"}
                  borderWidth="1px"
                >
                  <CardHeader>
                    <Center>
                      <Heading size="md" color={index % 2 === 0 ? "blue.600" : "purple.600"}>
                        {info.titleEn}
                      </Heading>
                    </Center>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      {info.contentEn.map((line, lineIndex) => (
                        <Text key={lineIndex}>{line}</Text>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
