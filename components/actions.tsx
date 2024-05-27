'use client';

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import { LiveContext } from './live-provider';
import { useContext, useState } from 'react';
import { users } from '@/lib/schema';

export default function Actions({
  players
}: {
  players: (typeof users.$inferSelect)[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { refresh, data } = useContext(LiveContext);
  const [player, setPlayer] = useState<string>(null);
  const [amount, setAmount] = useState<number>(1);

  function sendMoney(onClose) {
    fetch('/api/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, amount })
    }).then(() => {
      refresh();
      onClose();
    });
  }

  return (
    <div className="space-x-3">
      <Button onClick={refresh}>Refresh</Button>
      <Button onClick={onOpen} color="primary">
        Send money
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Send money</ModalHeader>
              <ModalBody>
                <Autocomplete
                  label="To"
                  placeholder="Minecraft ign"
                  value={player}
                  onValueChange={setPlayer}
                >
                  {players.map((player) => (
                    <AutocompleteItem key={player.ign} value={player.ign}>
                      {player.ign}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Input
                  label="Amount"
                  max={data.money}
                  min={1}
                  value={amount + ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => sendMoney(onClose)}>
                  Send
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
