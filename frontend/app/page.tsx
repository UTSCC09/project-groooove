import { LoopJson, Sequencer } from "@/components/sequencer";
import { Button } from "@nextui-org/button";
import AuthForm from "@/components/authForm";

export default function Home() {
  const initialLoop: LoopJson = [
    { sample: "house_kick.wav", sequence: Array<boolean>(16).fill(false) },
    { sample: "house_snare.wav", sequence: Array<boolean>(16).fill(false) },
    { sample: "closed_hh.wav", sequence: Array<boolean>(16).fill(false) },
    { sample: "open_hh.wav", sequence: Array<boolean>(16).fill(false) },
  ];

  return (
    <>
      <h1>grooove</h1>
      <AuthForm />
      <Sequencer initialLoop={initialLoop} />

    </>
  );
}
