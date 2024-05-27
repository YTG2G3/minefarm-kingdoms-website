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
import { marketItems, users } from '@/lib/schema';

export default function Actions({
  players,
  admin
}: {
  players: (typeof users.$inferSelect)[];
  admin: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onOpenChange: onOpenChange3
  } = useDisclosure();
  const { refresh, data } = useContext(LiveContext);
  const [player, setPlayer] = useState<string>(null);
  const [newUser, setNewUser] = useState<string>('');
  const [newIgn, setNewIgn] = useState<string>('');
  const [newTeam, setNewTeam] = useState<string>('');
  const [amount, setAmount] = useState<number>(1);
  const [newItem, setNewItem] = useState<typeof marketItems.$inferInsert>();

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

  function registerUser(onClose) {
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newUser, ign: newIgn, team: newTeam })
    }).then(() => {
      refresh();
      onClose();
    });
  }

  function addItem(onClose) {
    fetch('/api/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
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
      {admin && (
        <>
          <Button onClick={onOpen2} color="primary">
            Register User
          </Button>
          <Button onClick={onOpen3} color="primary">
            Modify Item
          </Button>
        </>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Send money</ModalHeader>
              <ModalBody>
                <Input
                  label="Receiver's Minecraft name"
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                />
                <Input
                  label="Amount"
                  type="number"
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
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Register user</ModalHeader>
              <ModalBody>
                <Input
                  label="Discord Name"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
                <Input
                  label="Minecraft name"
                  value={newIgn}
                  onChange={(e) => setNewIgn(e.target.value)}
                />
                <Input
                  label="Team"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => registerUser(onClose)}>
                  Register
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen3} onOpenChange={onOpenChange3}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Modify Item</ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  value={newItem?.name}
                  onChange={(e) => {
                    setNewItem({
                      ...newItem,
                      name: e.target.value,
                      image: `https://mc.nerothe.com/img/1.20.1/${e.target.value}.png`
                    });
                  }}
                />
                <Input
                  label="Selling Price"
                  type="number"
                  value={newItem?.sellingPrice + ''}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      sellingPrice: Number(e.target.value)
                    })
                  }
                />
                <Input
                  label="Buying Price"
                  type="number"
                  value={newItem?.buyingPrice + ''}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      buyingPrice: Number(e.target.value)
                    })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => addItem(onClose)}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
