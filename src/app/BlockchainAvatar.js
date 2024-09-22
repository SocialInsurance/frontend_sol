// BlockchainAvatar.js
import React, { useEffect, useRef } from 'react';
import jazzicon from 'jazzicon';
import { Box } from '@chakra-ui/react';
import { sha256 } from 'js-sha256';

const BlockchainAvatar = ({ pubkey, size = 40 }) => {
  const ref = useRef();

  useEffect(() => {
    if (pubkey && ref.current) {
      // 使用 sha256 哈希 pubkey 来生成一个确定性的种子
      const hash = sha256(pubkey);
      const seed = parseInt(hash.slice(0, 8), 16);
      
      // 创建 jazzicon
      const el = jazzicon(size, seed);
      
      if (ref.current.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
      ref.current.appendChild(el);
    }
  }, [pubkey, size]);

  return (
    <Box ref={ref} minWidth={`${size}px`} minHeight={`${size}px`} />
  );
};

export default BlockchainAvatar;