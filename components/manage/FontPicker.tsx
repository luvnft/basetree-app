import {
    Button,
    Text,
    IconButton,
    SimpleGrid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    useColorMode,
  } from '@chakra-ui/react';
  import React, { useEffect } from 'react';
  import { useAtom, useAtomValue } from 'jotai';
  import { variantAtom, buttonBgColorAtom, lightModeAtom, roundAtom, fontAtom } from 'core/atoms';
  import { RiCheckDoubleLine, RiCheckLine } from 'react-icons/ri';
  import { BG_COLORS, FONTS } from 'core/utils/constants';
  
  export default function FontPicker() {
    const buttonBgColor = useAtomValue(buttonBgColorAtom);
    const lightMode = useColorMode().colorMode === 'light';
    const [font, setFont] = useAtom(fontAtom);
    const round = useAtomValue(roundAtom);
    const variant = useAtomValue(variantAtom);

    const shortenFontName = (fontName:string) => {
      // Split font name into words
      const words = fontName.split(" ");
    
      // If there are two words and the font name exceeds 10 characters, return the first word only
      if (words.length > 1 && fontName.length > 10) {
        return words[0];
      }
    
      // Otherwise, return the font name truncated to 10 characters
      return fontName.slice(0, 10);
    };
  
    return (
      <>
      <Accordion
        allowToggle
        allowMultiple={false}
        borderTopRadius={0}
        size="lg"
        display={'flex'}
        flexGrow={1}>
        <AccordionItem border={0} borderTopRadius={0} width={'100%'}>
          <AccordionButton
            as={Button}
            height={['44px', '52px']}
            _expanded={{ bgColor: lightMode ? BG_COLORS[4].color : BG_COLORS[2].color, borderRadius: 0 }}
            _hover={{ bgColor: lightMode ? BG_COLORS[4].color : BG_COLORS[2].color }}
            px={4}
            variant="solid"
            borderTopRadius={0}
            width={'100%'}
            justifyContent="space-between">
            <Text fontSize={'lg'}>Font</Text>
              <Text fontFamily={font}>{font}</Text>
            </AccordionButton>
            <AccordionPanel px={0} py={4} bgColor={lightMode ? BG_COLORS[4].color : BG_COLORS[2].color} borderBottomRadius={12}>
              <SimpleGrid columns={[2]} gap={2}>
                {FONTS.map((_font) => (
                  <Button
                    key={`button-font-${_font}-${lightMode}`}
                    aria-label="button-font-picker"
                    onClick={() => {
                      setFont(_font);
                    }}
                    colorScheme={buttonBgColor}
                    color={buttonBgColor === 'dark' && variant !== 'outline' ? 'white' : undefined}
                    variant={variant}
                    fontFamily={_font}
                    fontSize={['lg','lg','lg','lg','md','xl']}
                    rounded={round}>
                    {shortenFontName(_font)}
                    {font === _font && <RiCheckLine size={24} />}
                  </Button>
                ))}
              </SimpleGrid>
            </AccordionPanel>
            </AccordionItem>
            </Accordion>
      </>
    );
  }
  