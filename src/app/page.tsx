"use client";
import BaseSvg from "@/assets/svg/BaseSvg";
import MagicButton from "@/components/MagicButton";
import ShowcaseBaseProfile from "@/components/ShowcaseBaseProfile";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Progress, TextField } from "@radix-ui/themes";
import { useAccount } from "wagmi";
import HowBasedAreYouHeader from "../components/HowBasedAreYouHeader";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import { useMagic } from "./hooks/useMagic";
import { useMagicContext } from "./hooks/useMagicContext";
import { ThreeStageState } from "./state.type";
import ProfileCard from "@/components/ProfileCard";
import AnimatedComponent from "@/components/AnimatedComponent";
import { useMagicTraits } from "./hooks/useMagicTraits";

export default function Page() {
  const { address } = useAccount();
  const {
    text: [addressInput, setAddressInput],
  } = useMagicContext();
  const {
    query: { stateCheck },
    mutate: { letsDoSomeMagic },
  } = useMagic();
  const {
    defitOrArtTraitResult,
    degenOrDiamondHandResult,
    originalBuilderOrMultichainCitizen,
  } = useMagicTraits();

  return (
    <div className="flex w-100 max-w-full flex-col px-1 md:w-[1200px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <BaseSvg width={30} height={30} />{" "}
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      <section
        className="templateSection relative flex w-full h-[300px] mb-[170px] flex-col items-center justify-center gap-4 rounded-xl px-2 py-10 md:grow"
        style={{
          background: `url('/background.avif')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <HowBasedAreYouHeader />
        </AnimatedComponent.OpacityFadeInDiv>
        <TextField.Root
          className="mr-2 w-full rounded-md p-2 shadow-xl"
          disabled={stateCheck("HowBasedAreYou", ThreeStageState.InProgress)}
          placeholder="ENS, Basename, OneID, 0x..."
          style={{
            borderRadius: 50,
            height: "70px",
            maxWidth: "900px",
            border: "1px solid lightgray",
          }}
          size={"3"}
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="20" width="20" />
          </TextField.Slot>
          <TextField.Slot>
            {address && (
              <MagicButton
                text="🧑‍💻 My wallet"
                textColor="text-black"
                className="bg-white hover:text-white"
                onClick={() => setAddressInput(address)}
              />
            )}
            <MagicButton
              text="Let's go 🔥"
              onClick={() => letsDoSomeMagic(addressInput)}
              loading={stateCheck("HowBasedAreYou", ThreeStageState.InProgress)}
            />
          </TextField.Slot>
        </TextField.Root>
        {addressInput && (
          <div className="sm:absolute block bottom-[-140px] flex justify-center items-center flex-col">
            <AnimatedComponent.OpacityFadeInDiv delay={300}>
              <div className="w-fit">
                <ProfileCard address={addressInput as any} />
              </div>
            </AnimatedComponent.OpacityFadeInDiv>
            <div className="flex flex-wrap items-center justify-center sm:mt-[-20px] mt-[15px] gap-4">
              <Box
                width="350px"
                className="shadow-xl h-fit bg-white py-3 px-5 rounded-2xl border border-palette-line/20"
              >
                <div className="flex justify-between mb-3">
                  <h1 className="font-bold text-sm">🎨 DeFi Enthusiast</h1>
                  <h1 className="font-bold text-sm">Art Collector</h1>
                </div>
                <Progress
                  size={"3"}
                  color="indigo"
                  radius="full"
                  value={defitOrArtTraitResult.score}
                  max={1}
                />
              </Box>
              <Box
                width="350px"
                className="shadow-xl h-fit bg-white py-3 px-5 rounded-2xl border border-palette-line/20 sm:mt-[35px] mt-0"
              >
                <div className="flex justify-between mb-3">
                  <h1 className="font-bold text-sm">💸 Degen</h1>
                  <h1 className="font-bold text-sm">Diamond Hand</h1>
                </div>
                <Progress
                  size={"3"}
                  color="cyan"
                  radius="full"
                  value={degenOrDiamondHandResult.score}
                  max={1}
                />
              </Box>
              <Box
                width="350px"
                className="shadow-xl h-fit bg-white py-3 px-5 rounded-2xl border border-palette-line/20"
              >
                <div className="flex justify-between mb-3">
                  <h1 className="font-bold text-sm">👷‍♂️ Original Builder</h1>
                  <h1 className="font-bold text-sm">Multichain Citizen</h1>
                </div>
                <Progress
                  size={"3"}
                  color="pink"
                  radius="full"
                  value={originalBuilderOrMultichainCitizen.score}
                  max={1}
                />
              </Box>
            </div>
          </div>
        )}
      </section>
      <ShowcaseBaseProfile addressInput={addressInput} />
    </div>
  );
}
