'use client'

import React, { useEffect, useState, useRef } from 'react';
import { 
    Box, Button, VStack, Text, Flex, IconButton, 
    useColorModeValue, Fade, Textarea, Spacer
  } from '@chakra-ui/react';
import { generateSecretKey, getPublicKey, finalizeEvent, Relay } from 'nostr-tools';
import { ChevronUpIcon, ChevronDownIcon, ChatIcon } from '@chakra-ui/icons';
// import BlockchainAvatar from './BlockchainAvatar';
import blockies from 'ethereum-blockies';
import Image from 'next/image';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [relay, setRelay] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [pubKey, setPubKey] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selfMsgBg = useColorModeValue('blue.100', 'blue.700');
  const otherMsgBg = useColorModeValue('gray.100', 'gray.600');
  const selfTextColor = useColorModeValue('black', 'white');
  const otherTextColor = useColorModeValue('black', 'white');

  const CHATROOM_ID = 'chatroom:socialinsclub';
  const PRIVATE_KEY_STORAGE_KEY = 'nostr_key';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    Relay.connect('wss://relay.damus.io').then(relay => {
        setRelay(relay);
        console.log(`connected to ${relay.url}`)
        // 尝试从 localStorage 获取私钥
        let storedPrivateKey = localStorage.getItem(PRIVATE_KEY_STORAGE_KEY);
        
        if (!storedPrivateKey) {
            // 如果没有存储的私钥，生成一个新的
            storedPrivateKey = generateSecretKey();
            localStorage.setItem(PRIVATE_KEY_STORAGE_KEY, storedPrivateKey);
        }
        
        const sk = new Uint8Array(storedPrivateKey.split(',').map(num => parseInt(num.trim(), 10)))        
        setPrivateKey(sk);
        let pk = getPublicKey(sk)
        setPubKey(pk)

        relay.subscribe([
            {
                kinds: [1],
               '#t': [CHATROOM_ID]
            },
            ], {
            onevent(event) {
                //console.log('got event:', event)
                setMessages((prevMessages) => {
                    const idSet = prevMessages.map(msg => msg.id);
                    if (!idSet.includes(event.id)) {
                        prevMessages.sort((a, b) => a.created_at - b.created_at)
                        return [...prevMessages, event]
                    }
                    return [...prevMessages]
                });
            }
            }
        )
    })
  }, []);

  const sendMessage = async () => {
    if (relay && privateKey) {
        let eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', CHATROOM_ID]],
            content: input,
          }
          // this assigns the pubkey, calculates the event id and signs the event in a single step
          const signedEvent = finalizeEvent(eventTemplate, privateKey)
          await relay.publish(signedEvent)

          setInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
      sendMessage();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const MessageBubble = ({ message, isSelf }) => (
    <Box
      maxWidth="70%"
      bg={isSelf ? 'blue.100' : 'gray.100'}
      color={isSelf ? selfTextColor : otherTextColor}
      borderRadius="lg"
      px={3}
      py={2}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        borderWidth: '8px',
        borderStyle: 'solid',
        borderColor: isSelf 
          ? `transparent ${selfMsgBg} transparent transparent` 
          : `transparent transparent transparent ${otherMsgBg}`,
        top: '10px',
        [isSelf ? 'right' : 'left']: '-15px',
      }}
    >
      <Text fontSize="sm">{message.content}</Text>
    </Box>
  );

  const BlockiesAvatar = ({ seed, size }) => {
    const icon = blockies.create({
      seed: seed.toLowerCase(),
      size: 8,
      scale: size / 8,
    });
  
    return <img
            style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
            }} 
            src={icon.toDataURL()} 
            alt="Blockies Avatar" />;
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      width={isExpanded ? "350px" : "auto"}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg={bgColor}
      transition="all 0.3s"
    >
      <Flex justifyContent="space-between" alignItems="center" p={3} borderBottomWidth={1} borderColor={borderColor}>
        <Flex alignItems="center">
          <ChatIcon mr={2} color="blue.500" />
          <Text fontWeight="bold">Chat Room</Text>
        </Flex>
        <IconButton
          icon={isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={toggleExpand}
          size="sm"
          variant="ghost"
          aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
        />
      </Flex>
      <Fade in={isExpanded}>
        {isExpanded && (
          <VStack spacing={3} align="stretch" p={4}>
            <Box 
              height="300px" 
              overflowY="auto" 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor={borderColor}
              p={2}
            >
              {messages.map((msg, index) => {
                const isSelf = msg.pubkey === pubKey;
                return (
                    <Flex 
                        key={index} 
                        mb={2} 
                        alignItems="start"
                        flexDirection={isSelf ? 'row-reverse' : 'row'}>
                        <BlockiesAvatar seed={msg.pubkey} size={32}/>
                        <Flex 
                            width="60%"
                            flexDirection="column" 
                            alignItems={isSelf ? 'flex-end' : 'flex-start'}
                            mx={2}
                            >
                            <Text fontSize="10px" mb={1}>
                                {new Date(msg.created_at * 1000).toLocaleString()}
                            </Text>
                            {/* <MessageBubble message={msg} isSelf={isSelf}/>                             */}
                            <Text overflowX="auto" fontSize="sm">{msg.content}</Text>
                        </Flex>
                    </Flex>
                )
            })}
              <div ref={messagesEndRef} />
            </Box>
            <Flex alignItems='center' >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                size="sm"
                resize="none"
                width="80%"
                minHeight="40px"
                maxHeight="120px"
                overflow="auto"
                borderRadius="md"
                borderColor='gray.200'
                borderWidth='1px'
              />
              <Spacer />
              <Button width={"15%"} onClick={sendMessage}>Send</Button>
            </Flex>
          </VStack>
        )}
      </Fade>
    </Box>
  );
};

export default ChatBox;