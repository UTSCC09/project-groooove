"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";

import { LoopJson, Sequencer } from "@/components/sequencer";

interface Props {
  initialLoop: LoopJson;
  initialBpm: number;
}

export const LoopEditor = ({ initialLoop, initialBpm }: Props) => {
  const [loop, setLoop] = useState(initialLoop);
  const [bpm, setBpm] = useState(initialBpm);
  const [inputBpm, setInputBpm] = useState(initialBpm);
  const [bpmIsvalid, setBpmIsValid] = useState(bpm > 0);
  const [playing, setPlaying] = useState(false);

  function togglePlaying() {
    setPlaying(!playing);
  }

  function handleBpmInput(newBpmStr: string) {
    const newBpm = parseInt(newBpmStr);

    setInputBpm(newBpm);
    if (isNaN(newBpm) || newBpm <= 0) {
      setBpmIsValid(false);

      return;
    }
    setBpmIsValid(true);
    setBpm(newBpm);
  }

  return (
    <>
      <Card>
        <CardHeader>Loop Editor</CardHeader>
        <CardBody className="gap-4">
          <Input isRequired label="Title" size="sm" type="text" />
          <Input isRequired label="Author" size="sm" type="text" />
          <Button>SAVE</Button>
        </CardBody>
      </Card>
      <div className="flex justify-center mt-4">
        <Card>
          <CardBody className="gap-4">
            <div className="flex flex-row justify-between gap-4">
              <Button onClick={togglePlaying}>
                {playing ? "STOP" : "PLAY"}
              </Button>
              <Input
                isInvalid={!bpmIsvalid}
                label="BPM"
                labelPlacement="outside-left"
                size="sm"
                type="number"
                value={`${inputBpm}`}
                onValueChange={handleBpmInput}
              />
            </div>
            <Sequencer
              bpm={bpm}
              loop={loop}
              playing={playing}
              setLoop={setLoop}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};
