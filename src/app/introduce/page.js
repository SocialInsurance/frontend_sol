'use client'

import Link from 'next/link'
import { Box, Container, Heading, Text, VStack, Card, CardHeader, CardBody, Center, SimpleGrid } from '@chakra-ui/react'

const projectInfo = [
  { 
    title: "Mass Adoption", 
    titleEn: "Mass Adoption",
    content: ["区块链的Mass Adoption会是什么❓", "👉 DeFi: 场景OK，但门槛高、用户少", "👉 游戏❓社交❓Web2的思路适合Web3吗❓", "👉 ❓"],
    contentEn: ["What will be the Mass Adoption of blockchain?", "👉 DeFi: Scenario OK, but high threshold, few users", "👉 Games? Social? Is Web2 thinking suitable for Web3?", "👉 ?"]
  },
  { 
    title: "区块链的本质", 
    titleEn: "The Essence of Blockchain",
    content: ["👉 价值网络：概念没问题，但定义模糊，价值多元&冲突，难以取得共识，如meme、GameFi、SocialFi、菠菜。。。", "", "👇更准确的定义👇", "👉 契约网络：价值中立，链、智能合约", "👉 契约度：货币 > 金融 > 游戏、社交等应用"],
    contentEn: ["👉 Value network: The concept is fine, but the definition is vague, values are diverse & conflicting, difficult to reach consensus, such as meme, GameFi, SocialFi, gambling...", "", "👇More accurate definition👇", "👉 Contract network: Value-neutral, blockchain, smart contracts", "👉 Contract degree: Currency > Finance > Games, social and other applications"]
  },
  { 
    title: "现代国家的本质", 
    titleEn: "The Essence of Modern State",
    content: ["👉 一种社会契约，即公民与政府之间达成的协议", "", "👉维护契约：法律体系，执法机构，公共服务，税收制度，民主机制，社会保障，国际关系"],
    contentEn: ["👉 A social contract, an agreement between citizens and the government", "", "👉 Maintaining the contract: Legal system, law enforcement agencies, public services, tax system, democratic mechanisms, social security, international relations"]
  },
  { 
    title: "区块链 vs 国家", 
    titleEn: "Blockchain vs State",
    content: ["👉 区块链已具有的国家属性：法律体系（链、智能合约），执法机构（验证节点、出块节点），公共服务（基础设施），税收制度（产出的平台币、Gas费），民主机制（PoW、PoS、PoH）",
              "👉 区块链尚未具有的国家属性：社会保障（养老、医疗），国际关系",
              "👉 法学家亨利·梅因：迄今为止，进步社会的演变一直是从身份到契约的转变。",
              "👉 区块链相比传统国家具备更高的契约水平和能力，代表了人类社会的进化方向"],
    contentEn: ["👉 State attributes already possessed by blockchain: Legal system (chain, smart contracts), law enforcement (validator nodes, block producer nodes), public services (infrastructure), tax system (platform tokens, Gas fees), democratic mechanisms (PoW, PoS, PoH)",
                "👉 State attributes not yet possessed by blockchain: Social security (pension, healthcare), international relations",
                "👉 Legal scholar Henry Maine: The movement of progressive societies has hitherto been a movement from status to contract.",
                "👉 Blockchain has a higher contractualization capability compared to traditional states, representing the evolutionary direction of human society"]
  },
  { 
    title: "Network State", 
    titleEn: "Network State",
    content: ["👉 区块链具备国家的大多数特征，其国家意识形态正逐步成型",
              "👉 网络国家将成为区块链的Mass Adoption，其对人类的吸引力会超越绝大部分传统国家",
              "👉 未来一百年，区块链的目标就是让更多人成为网络国家公民",
              "👉 网络国家需要补上两块重要拼图：社会保障系统，国际关系",
              "👉 一条链一个网络国家❓"],
    contentEn: ["👉 Blockchain possesses most characteristics of a state, and its state ideology is gradually taking shape",
                "👉 Network state will become the Mass Adoption of blockchain, its appeal to people will surpass most traditional countries",
                "👉 For the next hundred years, the goal of blockchain is to enable more people to become citizens of network states",
                "👉 Network states need to complete two important puzzle pieces: social security system and international relations",
                "👉 One chain, one network state?"]
  },
  { 
    title: "社会保障体系", 
    titleEn: "Social Security System",
    content: ["👉 高度契约化和社会达尔文主义并存，区块链文明呈现出了两种极端状态",
              "👉 区块链需要一套社会保障体系，以填补文明的缺失部分，这是网络国家走向Mass Adoption的必要条件之一",
              "👉 如何建立这样一套社会保障体系，需要我们共同努力"],
    contentEn: ["👉 High contractualization and social Darwinism coexist, blockchain civilization presents two extreme states",
                "👉 Blockchain needs a social security system to fill the missing part of civilization, which is one of the necessary condition for Mass Adoption of network state",
                "👉 How to establish such a social security system requires our joint efforts"]
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
    <Box as="main" bg="gray.50" minHeight="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="center">
          <Center>
            <Link href="/" passHref>
            <VStack spacing={2}>
                <Text 
                  as="a"
                  fontSize="6xl" 
                  fontWeight="bold" 
                  textAlign="center"
                  bgGradient="linear(to-r, blue.400, blue.500, purple.500)"
                  bgClip="text"
                  letterSpacing="tight"
                  _hover={{
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  《链上社保》产品介绍
                </Text>
                <Text
                  as="a"
                  fontSize="3xl"
                  fontWeight="semibold"
                  textAlign="center"
                  color="gray.600"
                  _hover={{
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Introduction to On-Chain Social Insurance
                </Text>
              </VStack>
            </Link>
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
