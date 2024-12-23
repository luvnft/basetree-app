import {
  InputRightElement,
  useDisclosure,
  IconButton,
  Button,
  Tooltip,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  useMediaQuery,
  useColorMode,
  Input,
  InputGroup,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  SimpleGrid,
  Switch,
  Flex,
  useToast,
  ButtonGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  RiAddFill,
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopy2Line,
  RiUploadCloudLine,
} from "react-icons/ri";
import { useAtom, useAtomValue } from "jotai";
import {
  addLinkContentAtom,
  addLinkImageAtom,
  addLinkStylesAtom,
  addLinkTitleAtom,
  addLinkTypeAtom,
  addLinkUrlAtom,
  addressAtom,
  btcAtom,
  connectedAccountAtom,
  ethAtom,
  linksArrayAtom,
  linksAtom,
  openAddAtom,
  openAddLinkAtom,
  useLineIconsAtom,
} from "core/atoms";
import { capFirstLetter, setOrderInCustomLinks } from "core/utils";
import { useStorageUpload } from "@thirdweb-dev/react";
import { LinkIcon } from "components/logos";
import { ImageLink, Link } from "components/Profile";
import AddNFTAvatar from "./AddNFTAvatar";
import {
  AVAILABLE_LINKS,
  EMAIL_URL,
  EXAMPLE_LINK_URLS,
  IPFS_IMAGE_URI,
  OPENSEA_URL,
} from "core/utils/constants";
import { LinkType, Styles } from "types";
import NftLink from "components/Profile/NftLink";
import SelectOptionButton from "./SelectOptionButton";
import ManageSimpleLink from "./ManageSimpleLink";
import ManageUpload from "./ManageUpload";
import ManageDonate from "./ManageDonate";
import ManageNftGallery from "./ManageNftGallery";
import SettingsButton from "./SettingButton";
import ManageNftSlider from "./ManageNftSlider";
import ManageEmbedLink from "./ManageEmbedLink";
import ManageBlock from "./ManageBlock";
import useUploadJsonFile from "core/lib/hooks/use-upload";
import { client } from "components/walletConnect";
import ManagePSNProfile from "./ManagePSNProfile";
import ManageSwapBox from "./ManageSwapBox";
import ManageTokenChart from "./ManageTokenChart";
import ManageHeading from "./ManageHeading";
import ManageNftLink from "./ManageNftLink";
import ManageImageLink from "./ManageImageLink";
import ManageDocument from "./ManageDocument";

export default function AddLinkButton() {
  const useLineIcons = useAtomValue(useLineIconsAtom);
  const [_open, _setOpen] = useAtom(openAddLinkAtom);
  const [_type, _setType] = useAtom(addLinkTypeAtom);
  const _title = useAtomValue(addLinkTitleAtom);
  const _image = useAtomValue(addLinkImageAtom);
  const _url = useAtomValue(addLinkUrlAtom);
  const _content = useAtomValue(addLinkContentAtom);
  const _styles = useAtomValue(addLinkStylesAtom);
  const connectedAccount = useAtomValue(connectedAccountAtom);
  const btcAddress = useAtomValue(btcAtom);
  const { colorMode } = useColorMode();
  const [links, setLinks] = useAtom(linksAtom);
  const [linksArray, setLinksArray] = useAtom(linksArrayAtom);
  const [notMobile] = useMediaQuery("(min-width: 800px)");
  const [type, setType] = useState("");
  const [_back, _setBack] = useAtom(openAddAtom);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [styles, setStyles] = useState<Styles>({});
  const reg = AVAILABLE_LINKS.find((e) => e.type === type)?.reg ?? "";
  const toast = useToast();
  const { isLoading, data, hasError, uploadJsonFile } = useUploadJsonFile({
    client: client,
  });

  useEffect(() => {
    if (_open) {
      setType(_type);
      setTitle(_title);
      setImage(_image);
      setUrl(_url);
      setContent(_content);
      setStyles(_styles);
      onOpen();
    } else {
      _setType("");
    }
  }, [_open]);

  const addToLinks = async () => {
    let __content = content;
    if (content.length > 300) {
      toast({
        title: "Uploading to IPFS",
        description: "Uploading link content to IPFS to reduce gas costs",
        status: "loading",
        duration: null,
        isClosable: false,
      });
      __content = await uploadJsonFile(
        JSON.stringify(content),
        title.replaceAll(" ", "-")
      );
      if (hasError) {
        toast.closeAll();
        toast({
          title: "Error on Uploading to IPFS",
          description:
            `Can not upload to IPFS, please check your network. If the problem presists, please contact ${EMAIL_URL.replace("mailto:","")}`,
          status: "warning",
          isClosable: true,
        });
        return;
      } else {
        toast.closeAll();
      }
      //console.log("Link too bug", __content);
    }
    let _newLinksArray = [
      {
        type,
        title,
        url,
        image,
        content: __content,
        styles,
      },
      ...linksArray,
    ];

    console.log(_newLinksArray);
    const _links = setOrderInCustomLinks(_newLinksArray);
    setLinksArray(_links);
    setLinks(_links);
    //// console.log(_newLinksArray);
    setType("");
    setTitle("");
    setImage("");
    setUrl("");
    setContent("");
    setStyles({});
    _setOpen(false);
    onClose();
  };

  useEffect(() => {
    _setOpen(isOpen);
  }, [isOpen]);

  const addLink = (item: LinkType) => {
    if (item?.av) {
      setTitle("");
      setUrl("");
      setImage("");

      switch (item.type) {
        case "donate button":
        case "payment button":
          setStyles({
            size: "md",
            eth: connectedAccount
          });
          break;

        case "simple link":
          setStyles({
            size: "md",
            icon: "RiLinksLine",
          });
          break;

        case "nft gallery":
        case "nft slider":
          setStyles({
            size: "md",
            network: "base",
            effect: "slide",
          });
          break;

        default:
          setStyles({ size: "md" });
          break;
      }

      setContent("");
      _setOpen(false);
      setType(item.type);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setType("");
          onOpen();
        }}
        flexDir={"column"}
        gap={4}
        variant={"pop"}
        rounded={"xl"}
        height={100}
      >
        Add Block, NFT Gallery, Button ...
        <Flex gap={2}>
          <LinkIcon type="text" line={useLineIcons} />
          <LinkIcon type="simple link" line={useLineIcons} />
          <LinkIcon type="nft link" line={useLineIcons} color="dark" />
          <LinkIcon type="youtube video" line={useLineIcons} />
          <Text fontSize={"xl"}>+8</Text>
        </Flex>
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size={["full", "full", "lg", "xl", "2xl"]}
      >
        <ModalOverlay
          bg="blackAlpha.700"
          backdropFilter="auto"
          backdropBlur={"6px"}
        />
        <ModalContent
          bg={colorMode === "dark" ? "var(--dark1)" : "var(--white)"}
          minHeight={"80vh"}
        >
          <ModalHeader display="flex" gap={2} alignItems={"center"}>
            <IconButton
              variant={"ghost"}
              aria-label="back-to-add-modal"
              onClick={() => {
                if (!type) {
                  _setBack(true);
                  onClose();
                } else {
                  setType("");
                }
              }}
            >
              <RiArrowLeftLine size={"28"} />
            </IconButton>{" "}
            Add New {type ? capFirstLetter(type) : ""}
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            {type ? (
              <Stack gap={4}>
                {type && (
                  <>
                    <InputGroup size="lg" minWidth="xs" borderColor="gray">
                      <Input
                        isDisabled={type === ""}
                        value={title}
                        variant="filled"
                        placeholder={`Enter ${capFirstLetter(type)} Title`}
                        fontWeight="bold"
                        onChange={(e) => setTitle(e.currentTarget.value)}
                      />
                    </InputGroup>
                  </>
                )}

                {(type.includes("simple link") ||
                  type.includes("video") ||
                  type.includes("tweet") ||
                  type.includes("farcaster cast") ||
                  type.includes("twitter timeline") ||
                  type.includes("soundcloud")) && (
                  <ManageSimpleLink
                    type={type}
                    url={url}
                    setUrl={setUrl}
                    styles={styles}
                    setStyles={setStyles}
                  />
                )}

                {type.includes("embed") && (
                  <ManageEmbedLink
                    preview
                    title={title}
                    type={type}
                    url={url}
                    setUrl={setUrl}
                    styles={styles}
                    setStyles={setStyles}
                  />
                )}

                {type.includes("swap box") && (
                  <ManageSwapBox
                    preview
                    title={title}
                    type={type}
                    url={url}
                    setUrl={setUrl}
                    styles={styles}
                    setStyles={setStyles}
                  />
                )}

                {type.includes("token chart") && (
                  <ManageTokenChart
                    preview
                    title={title}
                    content={String(content)}
                    setContent={setContent}
                    type={type}
                    url={url}
                    setUrl={setUrl}
                    styles={styles}
                    setStyles={setStyles}
                  />
                )}

                {(type.includes("youtube") ||
                  type.includes("twitter timeline") ||
                  type.includes("tweet") ||
                  type.includes("farcaster cast") ||
                  type.includes("soundcloud")) &&
                  RegExp(reg, "i").test(url) && (
                    <Link
                      type={type}
                      title={title}
                      url={url}
                      styles={styles}
                      content={content}
                      image={image}
                    />
                  )}

                {type.includes("image") && (
                  <ManageImageLink
                    type={type}
                    setUrl={setUrl}
                    setImage={setImage}
                    url={url}
                    styles={styles}
                    setStyles={setStyles}
                    image={image}
                  />
                )}

                {type.includes("pdf") && (
                  <ManageDocument
                    type={type}
                    setUrl={setUrl}
                    setImage={setImage}
                    url={url}
                    styles={styles}
                    setStyles={setStyles}
                    image={image}
                  />
                )}

                {(type.includes("simple link") ||
                  type.includes("image") ||
                  type.includes("pdf")) && (
                  <>
                    {/* <SelectOptionButton
                      options={[true, false]}
                      value={String(styles?.popup) ?? false}
                      setValue={(e: any) => setStyles({ ...styles, popup: e })}
                      title="Open In Pop Up"
                    /> */}
                    {(image || url) && (
                      <Link
                        type={type}
                        title={title ? title : capFirstLetter(type)}
                        icon={
                          <LinkIcon
                            type={
                              type === "simple link"
                                ? String(styles.icon)
                                : type
                            }
                            line={useLineIcons}
                            size={
                              String(styles?.icon).includes(IPFS_IMAGE_URI)
                                ? styles?.size
                                : styles?.size === "sm"
                                ? "24"
                                : styles?.size === "md"
                                ? "28"
                                : "36"
                            }
                          />
                        }
                        url={url}
                        image={image}
                        styles={styles}
                      />
                    )}
                  </>
                )}

                {type.indexOf("nft link") >= 0 && (
                  <ManageNftLink
                    url={url}
                    title={title}
                    type={type}
                    image={image}
                    content={String(content)}
                    setContent={setContent}
                    setStyles={setStyles}
                    styles={styles ? styles : {}}
                  />
                )}

                {type.includes("nft gallery") && (
                  <ManageNftGallery
                    title={title}
                    type={type}
                    content={String(content)}
                    setContent={setContent}
                    setStyles={setStyles}
                    styles={styles ? styles : {}}
                    preview
                  />
                )}

                {type.includes("nft slider") && (
                  <ManageNftSlider
                    title={title}
                    type={type}
                    content={String(content)}
                    setContent={setContent}
                    setStyles={setStyles}
                    styles={styles ? styles : {}}
                    preview
                  />
                )}

                {type.indexOf("text") >= 0 && (
                  <Textarea
                    minWidth="xs"
                    my={2}
                    rows={5}
                    maxLength={500}
                    placeholder={"Simple Text ..."}
                    size="lg"
                    bg={
                      colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100"
                    }
                    variant="outline"
                    border="none"
                    resize={"none"}
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                  />
                )}

                {type.indexOf("heading") >= 0 && (
                  <ManageHeading
                    type={type}
                    title={title}
                    styles={styles}
                    setStyles={setStyles}
                    url={url}
                    setUrl={setUrl}
                    preview
                  />
                )}

                {(type.includes("donate") || type.includes("pay")) && (
                  <ManageDonate
                    title={title}
                    type={type}
                    content={String(content)}
                    setContent={setContent}
                    setStyles={setStyles}
                    styles={styles ? styles : {}}
                    preview
                  />
                )}

                {type.includes("block") && (
                  <ManageBlock
                    title={title}
                    type={type}
                    content={String(content)}
                    setContent={setContent}
                    setStyles={setStyles}
                    styles={styles ? styles : {}}
                  />
                )}

                {type.includes("psn profile") && (
                  <ManagePSNProfile
                    title={title}
                    type={type}
                    preview
                    content={String(content)}
                    setContent={setContent}
                    setStyles={setStyles}
                    styles={styles ? styles : {}}
                  />
                )}
              </Stack>
            ) : (
              <SimpleGrid columns={[1]} gap={2} pb={4}>
                {AVAILABLE_LINKS.map(
                  (item) =>
                    item !== undefined && (
                      <Button
                        gap={4}
                        fontWeight={"bold"}
                        fontSize={"xl"}
                        key={item?.type}
                        justifyContent={"left"}
                        size={"lg"}
                        height={"64px"}
                        onClick={() => addLink(item)}
                      >
                        {item.av && (
                          <LinkIcon type={item.type} line={useLineIcons} />
                        )}
                        {!item?.av && (
                          <Badge variant="solid" colorScheme="gray" p={1.5}>
                            Soon
                          </Badge>
                        )}
                        {capFirstLetter(item.type)}
                      </Button>
                    )
                )}
              </SimpleGrid>
            )}
          </ModalBody>
          {type && (
            <ModalFooter gap={2} justifyContent={"left"}>
              <Button
                color="white"
                bgColor="var(--base1)"
                isDisabled={type === undefined || title === ""}
                isLoading={isLoading}
                onClick={() => {
                  if (new RegExp(reg, "i").test(url)) {
                    addToLinks();
                  } else {
                    toast({
                      status: "warning",
                      title: "Invalid URL",
                      description:
                        "Please enter the url in the required format",
                      duration: 3000,
                    });
                  }
                }}
              >
                Add
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
